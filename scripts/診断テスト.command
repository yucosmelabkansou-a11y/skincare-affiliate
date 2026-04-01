#!/bin/bash
cd "$(dirname "$0")/.."   # skincare-affiliateに移動

echo "🔍 診断テストを開始します..."
echo ""

python3 - << 'PYEOF'
import os, sys, subprocess
from pathlib import Path

# 絶対パスで.envを読み込む
PROJECT_DIR = Path(os.getcwd())  # skincare-affiliate/
env_path = PROJECT_DIR / ".env"
print(f"📂 プロジェクト: {PROJECT_DIR}")
print(f"📄 .envパス: {env_path} → {'存在する' if env_path.exists() else '存在しない！'}")

if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and '=' in line and not line.startswith('#'):
                k, _, v = line.partition('=')
                os.environ[k.strip()] = v.strip()

api_key = os.environ.get("GEMINI_API_KEY", "")
print(f"🔑 APIキー: {'あり (' + api_key[:8] + '...)' if api_key else 'なし！'}")
print()

if not api_key:
    print("❌ .envファイルにGEMINI_API_KEYが設定されていません")
    sys.exit(1)

print("=== sips変換テスト ===")
GDRIVE = Path.home() / "Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ"
heic_files = list((GDRIVE / "★★商品紹介サイト/新商品写真").glob("*.HEIC"))
if heic_files:
    r = subprocess.run(['sips', '-s', 'format', 'jpeg', str(heic_files[0]), '--out', '/tmp/test_img.jpg'], capture_output=True, text=True)
    ok = r.returncode == 0 and Path('/tmp/test_img.jpg').exists()
    print(f"{'✅' if ok else '❌'} sips変換: {heic_files[0].name} → {'成功' if ok else r.stderr}")
else:
    print("⚠️ HEICファイルなし")
print()

print("=== 新しいGemini API (google-genai) テスト ===")
# まず新パッケージをインストール
print("📦 google-genai インストール中...")
r = subprocess.run([sys.executable, '-m', 'pip', 'install', 'google-genai', '--quiet', '--user'], capture_output=True, text=True)
print(f"インストール: {'成功' if r.returncode == 0 else '失敗 → ' + r.stderr[:100]}")

try:
    from google import genai
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(model="gemini-2.0-flash", contents="テストと返してください")
    print(f"✅ Gemini APIテキスト応答: {response.text.strip()}")
except Exception as e:
    print(f"❌ Gemini API エラー: {type(e).__name__}: {e}")
    sys.exit(1)

if Path('/tmp/test_img.jpg').exists():
    print()
    print("=== 画像解析テスト（1枚） ===")
    try:
        from PIL import Image
        img = Image.open('/tmp/test_img.jpg')
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                "この商品の名前とブランドを教えてください。JSON {\"name\":\"...\",\"brand\":\"...\"} だけで答えてください",
                img
            ]
        )
        print(f"✅ 画像解析成功: {response.text.strip()[:200]}")
    except Exception as e:
        print(f"❌ 画像解析エラー: {type(e).__name__}: {e}")

print()
print("=== 診断完了 ===")
PYEOF

echo ""
echo "このウィンドウを閉じるには何かキーを押してください..."
read -n 1
