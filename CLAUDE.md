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
  data/products.csv         ← 商品マスターデータ（全件・現在56件）
  images/                   ← 商品画像（IMG_xxxx.jpg 形式）
```

## Product型

```typescript
type Product = {
  id: string
  category: string        // 化粧水 / 化粧下地 / 日焼け止め / BBクリーム / CCクリーム
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
- URLに改行・制御文字が混入しないよう `re.sub(r'[\x00-\x1f\x7f]', '', url)` で除去すること

## フィルターの仕組み

- カテゴリフィルターは **product.tags（悩みタグ）** と **product.category** の両方でマッチする
- 例：化粧水フィルター選択時 → category='化粧水' の商品 OR tags に '化粧水' を含む商品を表示
- 新カテゴリ追加時は `categories.ts` のタグ定義も合わせて確認すること

## 画像命名規則

- 元画像: `写真入れ/カテゴリ名/IMG_xxxx.jpg`
- 配置先: `public/images/IMG_xxxx.jpg`
- CSVの `image_filename`: `IMG_xxxx.jpg`（拡張子あり）

---

# 「更新」と言われたときの手順

ユーザーが **「更新」** とだけ伝えてきたら、以下の順番で進めること。

## Step 1: 写真の場所を確認する

必ず最初に聞く：

> 新しい写真はどのフォルダに入っていますか？（例：`写真入れ/化粧水/`）
> また、今回追加・変更する商品のIMG番号を教えてください。

## Step 2: CSVの確認

- CSVファイル名：**`商品写真データ - シート1.csv`**（Googleスプレッドシートからのエクスポート名）
- 配置場所：`★商品紹介サイト/` 直下
- ヘッダー確認：`カテゴリ,ブランド,商品名,価格 / 最小容量,注目成分・技術,pick,悩み,ファイル名,instagram_url`
- カテゴリの表記ゆれに注意（例：「化粧液」→「化粧水」に統一）

## Step 3: 画像コピー

```python
# 写真入れ/ 以下を再帰検索して public/images/ にコピー
# CSVのファイル名列（拡張子なし）に一致するもののみ
# すでに存在するファイルはスキップ
# コピー先: public/images/IMG_xxxx.jpg
```

## Step 4: 楽天URL取得

```bash
# ターミナルで実行してもらう
export RAKUTEN_APP_ID="xxxx"
python3 fetch_rakuten.py
```

### 楽天URLについての注意事項

- APIで自動取得できない商品が多い（特に新商品・ブランド公式ショップのみ取扱い）
- 取得できなかった商品は一覧を出してユーザーに手動追記をお願いする
- 手動追記してもらった `rakuten_links.json` をそのまま使う
- 既存URLはIMG番号をキーに `public/data/products.csv` から流用する

### fetch_rakuten.py の設定

- CSVファイル名：`商品写真データ - シート1.csv`
- 既存URL照合：IMG番号（`IMG_xxxx`）をキーに使用
- 優先店舗：`rakuten24cosme` → `rakuten24` → `atcosme` → `cosme-yaoi` → 全店舗

## Step 5: products.csv 再生成

```python
# 商品写真データ - シート1.csv + rakuten_links.json → public/data/products.csv
# 必ず csv.QUOTE_ALL を使うこと（カンマ混入対策）
# URLの制御文字（改行など）を除去すること
# カテゴリの表記ゆれを確認・統一すること
```

## Step 6: ビルド確認 → コミット → プッシュ

```bash
npm run build   # エラーがないことを確認（"Failed to load products.csv" が出たら要確認）
git add .
git commit -m "feat: 商品データ更新"
git push origin main
# Vercelが自動デプロイ（1〜2分）
```

---

# よくあるトラブルと対処法

| 症状 | 原因 | 対処 |
|---|---|---|
| サイトに何も表示されない | CSVのカラムずれ or 改行文字混入 | QUOTE_ALLで再生成・URLの制御文字除去 |
| 画像が表示されない | image_filenameの不一致 | `public/images/` のファイル名とCSVを照合 |
| Pickの画像が出ない | 絵文字フォールバックが画像の上に重なっている | 🧴divをimgより前に置く |
| 楽天URLが取得できない | 商品名の不一致 or 店舗に在庫なし | IMG番号キーで既存URL流用・ユーザーに手動追記依頼 |
| カテゴリフィルターにヒットしない | タグにカテゴリ名がない | ProductList.tsxのフィルターはcategoryフィールドも参照する（修正済み） |
| 「化粧液」など表記ゆれ | CSVの入力ミス | products.csv生成前にカテゴリ一覧を確認・統一 |

---

# 関連ファイルの場所

```
★商品紹介サイト/
  商品写真データ - シート1.csv   ← Googleスプレッドシートからエクスポート（毎回上書き）
  rakuten_links.json             ← 楽天URL取得結果（IMG番号キー・手動追記分も含む）
  fetch_rakuten.py               ← 楽天URL取得スクリプト
  写真入れ/                      ← 元の写真フォルダ（カテゴリ別サブフォルダ）
    下地/
    日焼け止め/
    化粧水/
    （追加カテゴリは都度作成）
  skincare-affiliate/            ← Next.jsプロジェクト本体
  Instagram投稿案.md             ← サイト紹介用のInstagram投稿テキスト案
```
