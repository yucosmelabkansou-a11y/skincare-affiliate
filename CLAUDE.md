@AGENTS.md

---

# このプロジェクトについて

**skincare-affiliate** — yun.skincare_ のスキンケア・ベースメイク商品紹介サイト
本番URL: https://skincare-affiliate.vercel.app/
GitHub: https://github.com/yucosmelabkansou-a11y/skincare-affiliate.git

## 技術スタック

- Next.js 16 (App Router) / TypeScript / Tailwind CSS
- 商品データ: `public/data/products.csv`（CSVベース、DBなし）
- デプロイ: Vercel（mainブランチへのpushで自動デプロイ）

## ディレクトリ構造

```
src/
  app/page.tsx              ← トップページ
  components/
    ProductCard.tsx         ← 商品カード（Amazon・楽天ボタンあり）
    ProductModal.tsx        ← 商品詳細モーダル
    WeeklyPicks.tsx         ← おすすめPickセクション
    ProductList.tsx / FilterDrawer.tsx / CategoryNav.tsx
  lib/
    parseCSV.ts             ← CSVパーサー（QUOTE_ALL形式に対応）
    categories.ts           ← カテゴリ・タグ定義
  types/product.ts          ← Product型定義

public/
  data/products.csv         ← 商品マスターデータ（全件）
  images/                   ← 商品画像（IMG_0343.jpg 形式）
```

## Product型

```typescript
type Product = {
  id: string
  category: string        // 化粧下地 / 日焼け止め / BBクリーム / CCクリーム
  name: string
  brand: string
  price: string           // 例: ¥1,760 / 42g
  tags: string[]          // 悩みタグ（毛穴・崩れ → ["毛穴","崩れ"]）
  review: string          // 商品説明・成分解説
  image_filename: string  // 例: IMG_0343.jpg
  amazon_url: string
  rakuten_url: string
  is_pick: boolean
  instagram_url: string
}
```

## CSVフォーマット（QUOTE_ALL）

```
"id","category","name","brand","price","tags","review","image_filename","amazon_url","rakuten_url","is_pick","instagram_url"
```

- 全フィールドをダブルクォートで囲む（`csv.QUOTE_ALL`）
- tagsはカンマ区切り（例: `"毛穴,崩れ"`）
- image_filenameは拡張子あり（例: `"IMG_0343.jpg"`）

## 画像命名規則

- `写真入れ/` フォルダに `IMG_xxxx.jpg` で格納
- `public/images/` に同名でコピー
- CSVの `image_filename` は `IMG_xxxx.jpg`（拡張子あり）

---

# 「更新」と言われたときの手順

ユーザーが **「更新」** とだけ伝えてきたら、以下の順番で進めること。

## Step 1: 写真の場所を確認する

必ず最初に聞く:

> 新しい写真はどのフォルダに入っていますか？（例：`写真入れ/` のサブフォルダ）
> また、今回追加・変更する商品のIMG番号を教えてください。

## Step 2: CSVの確認

- `★商品紹介サイト/products_new.csv` が最新のGoogleスプレッドシートからエクスポートされたか確認
- なければユーザーに配置を依頼する
- CSVのヘッダー確認: `カテゴリ,ブランド,商品名,価格 / 最小容量,注目成分・技術,pick,悩み,ファイル名,instagram_url`

## Step 3: 画像コピー

```python
# 写真入れ/ 以下を再帰検索して public/images/ にコピー
# CSVのファイル名列（拡張子なし）に一致するもののみ
# コピー先: public/images/IMG_xxxx.jpg
```

## Step 4: 楽天URL取得

- `fetch_rakuten.py` を実行してもらう（RAKUTEN_APP_IDが必要）
- 既存URLはIMG番号をキーに `public/data/products.csv` から流用
- 結果を `rakuten_links.json` に保存

```bash
export RAKUTEN_APP_ID="xxxx"
python3 fetch_rakuten.py
```

## Step 5: products.csv 再生成

```python
# products_new.csv + rakuten_links.json → public/data/products.csv
# 必ず csv.QUOTE_ALL を使うこと（カンマ混入対策）
# URLの制御文字（改行など）を除去すること
```

## Step 6: ビルド確認 → コミット → プッシュ

```bash
npm run build   # エラーがないことを確認
git add .
git commit -m "feat: 商品データ更新"
git push origin main
# Vercelが自動デプロイ（1〜2分）
```

---

# よくあるトラブルと対処法

| 症状 | 原因 | 対処 |
|---|---|---|
| サイトに何も表示されない | CSVのカラムずれ or 改行文字混入 | QUOTE_ALLで再生成、URLの制御文字除去 |
| 画像が表示されない | image_filenameの不一致 | `public/images/` のファイル名とCSVを照合 |
| Pickの画像が出ない | 絵文字フォールバックが画像の上に重なっている | 🧴divをimgより前に置く |
| 楽天URLが取得できない | 商品名の不一致 or 店舗に在庫なし | IMG番号キーで既存URL流用、手動追記 |

---

# 関連ファイルの場所

```
★商品紹介サイト/
  products_new.csv        ← Googleスプレッドシートからエクスポート
  rakuten_links.json      ← 楽天URL取得結果（IMG番号キー）
  fetch_rakuten.py        ← 楽天URL取得スクリプト
  写真入れ/               ← 元の写真フォルダ（カテゴリ別サブフォルダ）
  skincare-affiliate/     ← Next.jsプロジェクト本体
```
