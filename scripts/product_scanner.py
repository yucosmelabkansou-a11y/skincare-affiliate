#!/usr/bin/env python3
"""
🌸 商品写真自動スキャナー v2
=====================================
「新商品写真」フォルダを監視して、写真が追加されると自動で：
  1. Gemini Vision APIで商品情報を解析
  2. public/images/ に画像をコピー
  3. public/data/products.csv に商品データを追記
  4. 処理済み写真フォルダに移動
"""

import os
import sys
import json
import csv
import shutil
import time
import re
import subprocess
from pathlib import Path
from datetime import datetime

# =====================================================
# パス設定
# =====================================================
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent  # skincare-affiliate/

GDRIVE_BASE = Path.home() / "Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ"
WATCH_FOLDER    = GDRIVE_BASE / "★★商品紹介サイト" / "新商品写真"
PROCESSED_FOLDER = GDRIVE_BASE / "★★商品紹介サイト" / "処理済み写真"

PRODUCTS_CSV = PROJECT_DIR / "public" / "data" / "products.csv"
IMAGES_DIR   = PROJECT_DIR / "public" / "images"

SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'}

# =====================================================
# .env 読み込み
# =====================================================
def load_env():
    env_path = PROJECT_DIR / ".env"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, _, v = line.partition('=')
                    os.environ.setdefault(k.strip(), v.strip())

load_env()

# =====================================================
# 依存パッケージ確認
# =====================================================
def ensure_packages():
    missing = []
    try:
        from google import genai  # noqa
    except ImportError:
        missing.append('google-genai')
    try:
        from watchdog.observers import Observer  # noqa
    except ImportError:
        missing.append('watchdog')
    try:
        from PIL import Image  # noqa
    except ImportError:
        missing.append('Pillow')

    if missing:
        print(f"📦 パッケージをインストール中: {', '.join(missing)}")
        subprocess.run(
            [sys.executable, '-m', 'pip', 'install'] + missing + ['--quiet', '--user'],
            check=True
        )
        print("✅ インストール完了")

ensure_packages()

from google import genai
from google.genai import types
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from PIL import Image

# macOS sips（HEIC→JPEG変換用）
SIPS_AVAILABLE = subprocess.run(['which', 'sips'], capture_output=True).returncode == 0

# =====================================================
# HEIC → JPEG 変換
# =====================================================
def heic_to_jpeg(heic_path: Path):
    out = Path('/tmp') / (heic_path.stem + '_conv.jpg')
    if out.exists():
        out.unlink()

    # macOS sips（最も確実）
    if SIPS_AVAILABLE:
        r = subprocess.run(
            ['sips', '-s', 'format', 'jpeg', str(heic_path), '--out', str(out)],
            capture_output=True, text=True
        )
        if r.returncode == 0 and out.exists():
            return out

    # pillow-heif フォールバック
    try:
        import pillow_heif
        pillow_heif.register_heif_opener()
        img = Image.open(heic_path)
        img.convert('RGB').save(out, 'JPEG', quality=95)
        return out
    except Exception:
        pass

    return None

# =====================================================
# Gemini API
# =====================================================
def setup_gemini():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError(
            f"GEMINI_API_KEYが設定されていません。\n"
            f"  {PROJECT_DIR / '.env'} を確認してください。"
        )
    client = genai.Client(api_key=api_key)
    return client


GEMINI_MODEL = "gemini-2.0-flash-lite"  # 軽量・高レート制限モデル


def analyze_product_image(client, image_path: Path, model_name: str = "gemini-2.0-flash-lite", retry: int = 3) -> dict:
    """Gemini Vision APIで商品情報を解析（レート制限時は自動リトライ）"""
    work_path = image_path

    # HEIC変換
    if image_path.suffix.lower() in {'.heic', '.heif'}:
        converted = heic_to_jpeg(image_path)
        if converted:
            work_path = converted
            print("  📱 HEIC→JPEG変換完了")
        else:
            print("  ❌ HEIC変換失敗")
            return {}

    img = Image.open(work_path)

    prompt = """この商品写真を分析してください。スキンケア・美容商品の場合は成分・効果を詳しく。

以下のJSONのみで回答してください（他のテキスト不要）:
{
  "name": "商品名",
  "brand": "ブランド名",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "review": "商品の特徴・成分・効果の説明（150〜250文字）"
}

タグ候補: 保湿, 美白, エイジングケア, セラミド, ナイアシンアミド, レチノール, ヒアルロン酸,
ビタミンC, 日焼け止め, UV, 洗顔, クレンジング, 美容液, セラム, クリーム, ローション,
敏感肌, 乾燥肌, 脂性肌, ニキビ, 毛穴, シワ, ハリ, くすみ, バリア機能"""

    for attempt in range(retry):
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[prompt, img]
            )
            text = response.text.strip()
            break
        except Exception as e:
            err = str(e)
            if '429' in err and attempt < retry - 1:
                wait = 65  # 1分以上待機してリセット
                print(f"  ⏳ レート制限 → {wait}秒待機してリトライ ({attempt+1}/{retry})...")
                time.sleep(wait)
            else:
                raise

    # JSONを抽出
    m = re.search(r'```json\s*([\s\S]*?)\s*```', text)
    if m:
        text = m.group(1)
    else:
        m = re.search(r'\{[\s\S]*\}', text)
        if m:
            text = m.group()

    return json.loads(text)

# =====================================================
# CSV操作
# =====================================================
def get_next_id() -> int:
    if not PRODUCTS_CSV.exists():
        return 1
    try:
        with open(PRODUCTS_CSV, encoding='utf-8') as f:
            ids = [int(r['id'].strip()) for r in csv.DictReader(f) if r.get('id','').strip().isdigit()]
        return max(ids) + 1 if ids else 1
    except Exception:
        return 1


def add_to_csv(product_data: dict, image_filename: str) -> int:
    new_id = get_next_id()
    tags = product_data.get('tags', [])
    row = {
        'id': str(new_id),
        'name': product_data.get('name', '商品名不明'),
        'brand': product_data.get('brand', 'ブランド不明'),
        'tags': ','.join(tags) if isinstance(tags, list) else str(tags),
        'review': product_data.get('review', ''),
        'image_filename': image_filename,
        'amazon_url': '',
        'rakuten_url': '',
        'is_pick': 'false',
        'instagram_url': '',
    }
    fieldnames = list(row.keys())
    is_new = not (PRODUCTS_CSV.exists() and PRODUCTS_CSV.stat().st_size > 0)
    with open(PRODUCTS_CSV, 'a', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        if is_new:
            w.writeheader()
        w.writerow(row)
    return new_id

# =====================================================
# 1枚処理
# =====================================================
def process_image(image_path: Path, client, model_name: str) -> bool:
    print(f"\n{'─'*50}")
    print(f"📸 {image_path.name}")
    print(f"{'─'*50}")

    try:
        # Gemini解析
        print("  🤖 Geminiで解析中...")
        data = analyze_product_image(client, image_path, model_name)
        if not data:
            return False

        print(f"  ✅ {data.get('name')} / {data.get('brand')}")
        print(f"     タグ: {', '.join(data.get('tags', []))}")

        # 画像コピー（HEIC→JPEG変換）
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        ts = datetime.now().strftime('%Y%m%d_%H%M%S')
        safe_stem = re.sub(r'[^\w-]', '_', image_path.stem)
        dest_name = f"{ts}_{safe_stem}.jpg"
        dest_path = IMAGES_DIR / dest_name

        if image_path.suffix.lower() in {'.heic', '.heif'}:
            converted = heic_to_jpeg(image_path)
            if converted:
                shutil.copy2(converted, dest_path)
            else:
                return False
        elif image_path.suffix.lower() not in {'.jpg', '.jpeg'}:
            Image.open(image_path).convert('RGB').save(dest_path, 'JPEG', quality=95)
        else:
            shutil.copy2(image_path, dest_path)

        print(f"  📁 画像保存: {dest_name}")

        # CSV追記
        new_id = add_to_csv(data, dest_name)
        print(f"  📊 CSV追記: ID={new_id}")

        # 処理済みへ移動
        PROCESSED_FOLDER.mkdir(parents=True, exist_ok=True)
        dest_orig = PROCESSED_FOLDER / image_path.name
        if dest_orig.exists():
            dest_orig = PROCESSED_FOLDER / f"{image_path.stem}_{ts}{image_path.suffix}"
        shutil.move(str(image_path), str(dest_orig))
        print(f"  ✨ 完了！処理済みフォルダへ移動しました")
        return True

    except Exception as e:
        print(f"  ❌ エラー: {type(e).__name__}: {e}")
        return False

# =====================================================
# フォルダ監視
# =====================================================
class ImageHandler(FileSystemEventHandler):
    def __init__(self, client, model_name):
        self.client = client
        self.model_name = model_name
        self.processing = set()

    def on_created(self, event):
        if event.is_directory:
            return
        p = Path(event.src_path)
        if p.suffix.lower() not in SUPPORTED_EXTENSIONS:
            return
        if str(p) in self.processing:
            return
        print(f"\n📥 新しい写真を検知: {p.name}")
        time.sleep(3)
        if not p.exists():
            return
        self.processing.add(str(p))
        try:
            process_image(p, self.client, self.model_name)
        finally:
            self.processing.discard(str(p))

# =====================================================
# メイン
# =====================================================
def main():
    print()
    print("╔══════════════════════════════════════════╗")
    print("║  🌸 商品写真自動スキャナー v2              ║")
    print("╚══════════════════════════════════════════╝")
    print()

    WATCH_FOLDER.mkdir(parents=True, exist_ok=True)
    PROCESSED_FOLDER.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    print(f"📂 監視: {WATCH_FOLDER}")
    print(f"📊 CSV: {PRODUCTS_CSV}")
    print()

    try:
        client = setup_gemini()
        model_name = GEMINI_MODEL
        print(f"✅ Gemini API 接続成功（モデル: {model_name}）")
    except Exception as e:
        print(f"❌ {e}")
        sys.exit(1)

    # 既存ファイルを一括処理
    existing = [
        f for f in WATCH_FOLDER.iterdir()
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
    ]
    if existing:
        print(f"\n📋 未処理の写真: {len(existing)}件 → 処理開始...")
        print("  ※ 1枚ずつ処理します（API制限のため5秒間隔）\n")
        ok = 0
        for i, f in enumerate(existing):
            if process_image(f, client, model_name):
                ok += 1
            if i < len(existing) - 1:
                time.sleep(5)
        print(f"\n✅ 一括処理完了: {ok}/{len(existing)} 件成功")

    # 監視開始
    handler = ImageHandler(client, model_name)
    observer = Observer()
    observer.schedule(handler, str(WATCH_FOLDER), recursive=False)
    observer.start()
    print(f"\n👀 監視中... 新しい写真を「新商品写真」フォルダに入れると自動処理されます")
    print("🛑 終了: Ctrl+C\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
    print("\n👋 終了しました")

if __name__ == "__main__":
    main()
