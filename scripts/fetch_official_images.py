#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations
"""
楽天 ItemSearch API から商品の公式画像を取得し、public/images/ に保存する。
実行前: export RAKUTEN_APP_ID=... (or skincare-affiliate/.env から)
使い方:  python3 scripts/fetch_official_images.py
"""

import os, sys, json, time, urllib.request, urllib.parse

APP_ID     = os.environ.get("RAKUTEN_APP_ID")
ACCESS_KEY = os.environ.get("RAKUTEN_ACCESS_KEY")
if not APP_ID:
    sys.exit("❌ RAKUTEN_APP_ID is not set")
if not ACCESS_KEY:
    sys.exit("❌ RAKUTEN_ACCESS_KEY is not set (新方式では accessKey も必須)")

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT_DIR, exist_ok=True)

# (slug, keyword) — slug は保存ファイル名
QUERIES = [
    # アネッサ記事
    ("anessa-gel-nb",          "アネッサ パーフェクトUV スキンケアジェル NB 40g"),
    ("anessa-brightening-na",  "アネッサ ブライトニングUV ジェル NA 40g"),
    ("anessa-day-serum-n",     "アネッサ デイセラム N 30mL"),
    ("anessa-milk-na",         "アネッサ パーフェクトUV スキンケアミルク NA 60mL"),
    ("anessa-brush-on-powder", "アネッサ パーフェクトUV ブラッシュオン パウダー"),
    # 敏感肌UV記事
    ("ihada-uv-milk",          "イハダ 薬用フェイスプロテクトUV ミルク 30mL"),
    ("minon-brightup-uv",      "ミノン アミノモイスト ブライトアップベース UV"),
    ("carte-hd-toneup-uv",     "カルテHD トーンアップ UV乳液 35mL"),
    ("curel-skinrepair-uv",    "キュレル 潤浸保湿 スキンリペアUVセラム 60g"),
    ("lrp-uvidea-rose",        "ラ ロッシュ ポゼ UVイデア XL プロテクション トーンアップ ローズ 30mL"),
]


def search_rakuten(keyword: str) -> dict | None:
    # 新方式 (2026-04-01 リニューアル) のエンドポイント
    # accessKey はヘッダーではなくクエリパラメータに、Referer/Origin は www.rakuten.co.jp 固定
    params = {
        "applicationId": APP_ID,
        "accessKey":     ACCESS_KEY,
        "keyword":       keyword,
        "hits":          5,
        "sort":          "-reviewCount",
        "formatVersion": "2",
    }
    url = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?" + urllib.parse.urlencode(params)
    for attempt in range(4):
        req = urllib.request.Request(url)
        req.add_header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
        req.add_header("Referer", "https://skincare-affiliate.vercel.app/")
        req.add_header("Origin",  "https://skincare-affiliate.vercel.app")
        try:
            with urllib.request.urlopen(req, timeout=10) as res:
                return json.loads(res.read())
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:300]
            if e.code == 429 and attempt < 3:
                wait = 5 * (attempt + 1)
                print(f"  ⚠️  429 rate limit — wait {wait}s and retry ({attempt+1}/3)")
                time.sleep(wait)
                continue
            print(f"  ❌ HTTP {e.code}: {body}")
            return None
        except Exception as e:
            print(f"  ❌ API error: {e}")
            return None
    return None


def pick_image_url(data: dict) -> str | None:
    items = data.get("Items", [])
    if not items:
        return None
    item = items[0]
    images = item.get("mediumImageUrls") or item.get("smallImageUrls") or []
    if not images:
        return None
    first = images[0]
    if isinstance(first, str):
        url = first
    else:
        url = first.get("imageUrl", "")
    # クエリストリング (?_ex=128x128) を外して高画質取得
    return url.split("?")[0] if url else None


def download(url: str, out_path: str) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as res:
            with open(out_path, "wb") as f:
                f.write(res.read())
        return True
    except Exception as e:
        print(f"  ❌ download failed: {e}")
        return False


def main():
    print(f"✓ APP_ID is set (length={len(APP_ID)})")
    print(f"  → OUT_DIR: {os.path.abspath(OUT_DIR)}\n")
    results = {}
    for slug, kw in QUERIES:
        print(f"▶ {slug}  ({kw[:40]}...)")
        data = search_rakuten(kw)
        if not data:
            results[slug] = None
            continue
        img_url = pick_image_url(data)
        if not img_url:
            print(f"  ❌ no image url found")
            results[slug] = None
            continue
        out_path = os.path.join(OUT_DIR, f"{slug}.jpg")
        if download(img_url, out_path):
            print(f"  ✅ {img_url} → {out_path}")
            results[slug] = img_url
        else:
            results[slug] = None
        time.sleep(3)  # rate limit (新APIは厳しめ)

    print("\n=== Results ===")
    for slug, url in results.items():
        status = "✅" if url else "❌"
        print(f"{status} {slug}: {url or 'FAILED'}")


if __name__ == "__main__":
    main()
