@AGENTS.md

---

# このプロジェクトについて

**skincare-affiliate** — yun.skincare_ のスキンケア・ベースメイク商品紹介サイト
本番URL: https://skincare-affiliate.vercel.app/
GitHub: https://github.com/yucosmelabkansou-a11y/skincare-affiliate.git

## ⚠️ 新規セッション向け：絶対パス

```
作業ディレクトリ（Google Drive）:
/Users/myuasa/Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ/★商品紹介サイト/

Next.jsプロジェクト:
/Users/myuasa/Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ/★商品紹介サイト/skincare-affiliate/

CSVデータ:
/Users/myuasa/Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ/★商品紹介サイト/商品写真データ - シート1.csv

楽天URLキャッシュ:
/Users/myuasa/Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ/★商品紹介サイト/rakuten_links.json

楽天URL取得スクリプト:
/Users/myuasa/Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ/★商品紹介サイト/fetch_rakuten.py

公開画像フォルダ:
/Users/myuasa/Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ/★商品紹介サイト/skincare-affiliate/public/images/

products.csv:
/Users/myuasa/Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ/★商品紹介サイト/skincare-affiliate/public/data/products.csv
```

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
  data/products.csv         ← 商品マスターデータ（全件・現在67件）
  images/                   ← 商品画像（IMG_xxxx.jpg 形式）
```

## Product型

```typescript
type Product = {
  id: string
  category: string        // 化粧水 / 乳液 / 化粧下地 / 日焼け止め / BBクリーム / CCクリーム
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
import csv, shutil, pathlib, glob as g

BASE = "/Users/myuasa/Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ/★商品紹介サイト"
DST  = f"{BASE}/skincare-affiliate/public/images"
pathlib.Path(DST).mkdir(exist_ok=True)

with open(f"{BASE}/商品写真データ - シート1.csv", encoding="utf-8") as f:
    fnames = [r["ファイル名"].strip() for r in csv.DictReader(f) if r.get("商品名","").strip()]

for fname in fnames:
    stem = fname.replace(".jpg","").replace(".jpeg","")
    # 既に存在するならスキップ
    if pathlib.Path(f"{DST}/{stem}.jpg").exists():
        continue
    # 写真入れ/ 以下を再帰検索
    found = g.glob(f"{BASE}/写真入れ/**/{stem}.jpg", recursive=True) or \
            g.glob(f"{BASE}/写真入れ/**/{stem}.jpeg", recursive=True)
    if found:
        shutil.copy2(found[0], f"{DST}/{stem}.jpg")
        print(f"コピー: {stem}.jpg")
    else:
        print(f"⚠️ 見つからない: {stem}")
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
import csv, json, re, urllib.parse

BASE = "/Users/myuasa/Library/CloudStorage/GoogleDrive-yu.cosmelab.kansou@gmail.com/マイドライブ/★商品紹介サイト"

with open(f"{BASE}/rakuten_links.json", encoding="utf-8") as f:
    links = json.load(f)

CAT_MAP = {"化粧液": "化粧水"}  # 表記ゆれ対策

def clean_url(url):
    return re.sub(r'[\x00-\x1f\x7f]', '', url).strip()

rows_out = []
with open(f"{BASE}/商品写真データ - シート1.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        name = row.get("商品名","").strip()
        if not name:
            continue
        category = CAT_MAP.get(row.get("カテゴリ","").strip(), row.get("カテゴリ","").strip())
        brand    = row.get("ブランド","").strip()
        price    = row.get("価格 / 最小容量","").strip()
        review   = row.get("注目成分・技術","").strip()
        is_pick  = "true" if row.get("pick","").strip().upper() == "TRUE" else "false"
        tags_raw = row.get("悩み","").strip()
        fname    = row.get("ファイル名","").strip()
        ig_url   = row.get("instagram_url","").strip()
        if ig_url == "-": ig_url = ""
        img_filename = fname if "." in fname else fname + ".jpg"
        link = links.get(fname, {})
        amazon_url  = clean_url(link.get("amazon_url",""))
        rakuten_url = clean_url(link.get("rakuten_url",""))
        if not amazon_url:
            q = urllib.parse.quote(f"{brand} {name}")
            amazon_url = f"https://www.amazon.co.jp/s?k={q}&i=beauty"
        rows_out.append([str(len(rows_out)+1), category, name, brand, price,
                         tags_raw, review, img_filename, amazon_url, rakuten_url, is_pick, ig_url])

OUT = f"{BASE}/skincare-affiliate/public/data/products.csv"
with open(OUT, "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f, quoting=csv.QUOTE_ALL)
    w.writerow(["id","category","name","brand","price","tags","review","image_filename",
                "amazon_url","rakuten_url","is_pick","instagram_url"])
    w.writerows(rows_out)

print(f"生成完了: {len(rows_out)}件 → {OUT}")
```

- 必ず `csv.QUOTE_ALL`（カンマ混入対策）
- URLの制御文字（改行など）を `re.sub` で除去
- カテゴリ表記ゆれは `CAT_MAP` で統一

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
    乳液/
    （追加カテゴリは都度作成）
  skincare-affiliate/            ← Next.jsプロジェクト本体
  Instagram投稿案.md             ← サイト紹介用のInstagram投稿テキスト案
```

---

# 比較コラム記事の作り方（アネッサ型テンプレート）

完成済みInstagram投稿からの記事制作は [専用ワークフロー](docs/instagram-to-column.md) を最初に読み、以下の一般的な構成より、そちらの最新の画像配置・広告表記・アフィリエイト確認・Notion記録のルールを優先する。

複数商品を比較するコラム記事（例：アネッサ5選、敏感肌UV、エリクシール デーケアレボリューション）は、
すべて **アネッサ記事（`content/column/anessa-5-types-comparison.md`）と同じ構成** に揃える。
新しい比較記事の依頼が来たら、アネッサ記事を雛形にして以下の順番で組み立てること。

## ファイルと仕組み

- 記事は **`content/column/<slug>.md`**（Markdown＋frontmatter）。DBなし。
- ルーティング：`src/app/column/[slug]/page.tsx`（slug＝ファイル名）。`react-markdown`＋`remark-gfm`でレンダリング。
- frontmatter：`title` / `description` / `publishedAt` / `updatedAt` / `tags` / `midCta`（通常 `diagnosis`）/ `endCta`（通常 `products`）/ `hero`（表紙画像パス）。
- `## Q. 〜` 形式があると FAQ 構造化データ（リッチリザルト）が自動付与される。Q&Aは必ずこの形式で書く。
- midCta は本文中盤のH2で自動挿入されるので、本文に診断CTAを手書きする必要はない。

## 本文の構成（この順番で固定）

1. `本記事はアフィリエイト広告を掲載しています。`（必須・冒頭。通常段落で、枠なし・小さな灰色文字。`>` は付けない）
2. 導入文（ゆんの一人称。「これを読めば自分に合う1本が見つかる」型のフック＋🌸などの絵文字）
3. `## あなたの悩みに合うのはどれ？` ＋ 比較表（列：`画像 | 商品 | こんな人に | 価格 | Amazon | 楽天`）
4. `迷ったら[2分でできる肌タイプ診断](/diagnosis)から。`
5. （任意）選び方の軸／共通成分など、その記事独自の解説H2
6. 各商品セクション `## ① 商品名｜キャッチ` を商品数ぶん。各セクションは必ず次の並び：
   - `> ` タグライン（成分名の羅列はしない。ベネフィット中心。成分は下で説明する）
   - `項目 | 内容` テーブル（容量・価格／SPF・PA／有効成分 or 主な成分／区分 など）
   - `⭐️ **主役の独自技術/有効成分**`（太字。ゴールド下線でレンダリングされる）＋説明
   - `◎ ポイント`（2〜3個）
   - `> 🎯 こんな人におすすめ`（・で2項目。blockquoteでカード化される）
   - `> ★ 注意：〜`（短所・注意点。blockquoteでカード化）
   - `🛒 商品名 容量 価格` ＋ 改行2スペース ＋ `[Amazon](URL) ／ [楽天](URL)`（公式があれば先頭に `[公式](URL) ／`）
7. シーン別の使い分け（表 or A/Bパターン）
8. `## おすすめ◯本まとめ`（列：`画像 | 商品 | 区分 | 強み`）
9. `## Q. 〜`（A. 〜）を3〜4個
10. `## まとめ｜〜`
11. **Instagram誘導CTA**（まとめの後、出典の前）：
    - リード文（太字見出し＋「保存して買い物のとき見返してね」と誘導。**冒頭に貼らない**）
    - クリックで投稿に飛ぶ表紙画像：`[![alt](/images/<topic>-cover.jpg)](Instagram投稿URL)`
    - テキストリンク：`📷 [この◯本の比較をInstagramで見る →](Instagram投稿URL)`
    - Instagram投稿URLは末尾の `?igsh=...` を外して `https://www.instagram.com/p/XXXX/` の形にする
12. `---` ＋ `この記事の出典・参考：`（公式サイト・各製品公式ページのリンク）

## 画像

- 商品画像・表紙画像は **`public/images/`** に置く（webpはjpgへ変換、白背景・幅600〜1080目安）。
- **公式商品画像**：資生堂などブランド公式の商品ページから取得可（`og:image` / 商品写真）。
  - ブランドサイトは **`https://www.shiseido.co.jp/{brand}/`**（旧サブドメイン `www.{brand}.shiseido.co.jp` は現在つながらない）。
  - 公式画像を使ったら出典末尾に `※掲載している商品画像は[ブランド公式](URL)より引用しています。` を入れる。
- **フィード表紙画像**（Instagramの表紙）：`<topic>-cover.jpg` で保存し、
  - frontmatter `hero:` に設定（SNSシェアのOG画像になる）
  - 記事一覧カードのサムネに自動表示（`src/components/ArticleCard.tsx` が `hero` を全体表示）
  - 上記の誘導CTAでクリック画像として使う
  - **本文の冒頭には置かない**（記事H1とタイトルが二重になるため）

## アフィリエイトリンク（重要）

- **Amazon**：`https://amzn.to/XXXX`（ユーザー生成の短縮アフィリ）または `https://www.amazon.co.jp/dp/<ASIN>?tag=yyy0410mmm-22`。
- **楽天**：`https://hb.afl.rakuten.co.jp/ichiba/.../?pc=...&link_type=hybrid_url&ut=...`（aflハイブリッド）。
  既存記事で使っている ichiba テンプレート（`ichiba/32b6c430.ea0d1e6a.32b6c431.75416e52/?pc=<item.rakuten.co.jpの商品URLをエンコード>&link_type=hybrid_url&ut=<既存と同じ値>`）の `pc=` だけを、照合済みの販売ページURLに差し替えて作る（2026-11-26 の修正から採用している方式）。
- 既存の直リンクは **`public/data/products.csv`** に入っていることがある（商品名で検索して流用可）。

### 執筆前に「リンク表」を作る（必須・2026-11-27〜）

記事を書き始める前に、掲載する全商品のリンク表（商品名／Amazon／楽天／公式）を作る。材料は次の順で使う。

1. `public/data/products.csv` と過去記事（`content/column/*.md`）から、**同じ商品・同じ容量**の既存直リンクを流用する。
2. **Amazon**：単品ページ（`/dp/<ASIN>`）を開き、商品名・容量・本体／つめかえ・セットでないことを照合してASINを確定する。リンクは `https://www.amazon.co.jp/dp/<ASIN>/ref=nosim?tag=yyy0410mmm-22`。
3. **楽天**：販売ページ（`item.rakuten.co.jp/<shop>/<item>/`）を開いて商品名・容量を照合し、上の ichiba テンプレートで生成する。メーカー公式ショップを優先し、ふるさと納税の返礼品ページは通常の購入リンクにしない（ほかに販売ページが無いときだけ「楽天（ふるさと納税）」と明記して置く）。
4. ASINや販売ページURLは**推測で作らない**。照合できなかった商品は、**リンク表の時点で**未特定の一覧をYunに出す（公開直前・公開後に発覚させない）。

### 公開前のリンクチェック（必須・2026-11-27〜）

コラム記事の購入リンクは記事Markdownに手書きする仕組みで、商品DBからは自動で入らない。書き忘れはそのまま公開されるため、
**mainへpush（＝公開。`publishAt` の予約記事も含む）する前に、必ず次を実行する。**

```bash
node scripts/check_column_links.mjs <slug>      # 対象記事だけ（npm run check:links -- <slug> でも可）
node scripts/check_column_links.mjs --all       # 全コラムの棚卸し
```

- 商品セクション（見出しに `/images/products/` の商品画像がある、または `## ①` 形式の見出し）ごとに、Amazon／楽天／公式いずれかの購入リンクがあるかを数える。
- **「結果: NG」（終了コード1）が出たら、1品でも公開しない。** 出力された不足商品の一覧をそのままYunに報告し、リンクがそろってからpushする。
- 「注意」（検索リンクの仮置き、aflでない楽天リンク、Amazon／楽天の片方だけ）は公開を止めないが、報告に含める。
- 販売終了などで意図的にリンクを置かない商品は、そのセクションに `<!-- link-check: skip 理由 -->` を書く（理由必須。Yunの了承を得たものだけ）。
- 「商品セクション未検出」と出た記事は、見出しの形が違うだけの可能性があるので目視で確認する。
- 比較表と各商品の🛒ボタンの **両方** を必ず同じ直リンクに揃える（片方だけ検索リンクが残りがち）。
- amzn.to がどの商品か不明なときは `curl -sL -o /dev/null -w "%{url_effective}"` で展開してASIN確認。

## プレビューと公開（Vercel）

- 制作中は **プレビューブランチ**（例 `preview/<topic>`）で作業し push → Vercelが自動でプレビューデプロイ。
- プレビュー/本番URLの取得（GitHub Deployment経由）：
  ```bash
  SHA=$(git rev-parse HEAD)
  DID=$(gh api repos/yucosmelabkansou-a11y/skincare-affiliate/deployments --jq ".[] | select(.sha==\"$SHA\") | .id" | head -1)
  gh api repos/yucosmelabkansou-a11y/skincare-affiliate/deployments/$DID/statuses --jq '.[0] | .state+"|"+(.environment//"?")+"|"+(.environment_url//"none")'
  ```
  `environment_url`（`*-<hash>.vercel.app`）がスマホでも開ける確認用URL。`environment` が `Production` なら本番。
- **本番公開**：`node scripts/check_column_links.mjs <slug>` が「結果: OK」であることを確認してから `main` にマージ → push（上の「公開前のリンクチェック」）。本番ドメインは **https://www.yun-skin-care.com**
  （`skincare-affiliate.vercel.app` は本番ドメインへ301リダイレクト。`*-<hash>.vercel.app` プレビューは対象外）。
- **予約公開（`publishAt`）の反映（2026-11-28〜）**：一覧・記事・トップ・サイトマップは10分ごとの再生成（`revalidate = 600`）で、
  予約時刻を過ぎても「最初のアクセスには古いページを返し、裏で作り直す」ため、時刻ちょうどに出ないことがある（11/28 に発生）。
  そのため GitHub Actions「予約公開の反映」（`.github/workflows/scheduled-publish.yml`）が **毎朝 8:00〜8:45 JST に数回**
  `scripts/scheduled_publish.mjs` を実行し、本番の `/api/revalidate-scheduled` で作り直させたうえで、一覧と記事ページに出たことを確認する。
  - 出ていなければワークフローが失敗し、GitHub から通知メールが届く。Actions のログに原因（一覧に掲載／記事ページのHTTP状態）が出る。
  - 予約時刻を過ぎてから3時間以内の記事が無い日は、何もせず数秒で終わる。API も同じ条件で、対象が無ければ何もしない。
  - **予約時刻は 8:00 JST に揃える**（ワークフローは8時台だけ動く。別の時刻にする場合は cron を足す）。
  - 手動で反映・確認したいとき：GitHub の Actions 画面から「予約公開の反映」を Run workflow、または `node scripts/scheduled_publish.mjs`（確認だけなら `--check`）。

## ローカル確認

- `.claude/launch.json` の `dev`（`npm run dev` / port 3000）を使う。初回コンパイルが60秒前後かかるので注意。
- 記事URL：`http://localhost:3000/column/<slug>`。
