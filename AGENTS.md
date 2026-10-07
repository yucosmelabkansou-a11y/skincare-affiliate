<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Instagram投稿画像からコラムを作る

このプロジェクトでは、ユーザーが @yun.skincare_ の完成済み投稿画像を渡したら、画像だけの依頼でもコラム化の依頼として扱う。「コラム化」「インスタから記事に」も同じ手順で進める。画面の不具合を示すスクリーンショット、商品マスター更新用の写真、制作途中の画像への批評依頼には適用しない。

最初に [専用ワークフロー](docs/instagram-to-column.md) を読み、画像の読み取り → 事実確認 → 既存形式で記事追加 → 表示確認 → Notion記録まで続ける。材料が揃っている工程ごとに許可を取り直さない。公開方法はユーザーの最新の指示を優先し、指定がなければプレビュー・Notion記録まで進める。

- 記事は `content/column/<slug>.md`。比較記事は `CLAUDE.md` の「比較コラム記事の作り方」と `content/column/anessa-5-types-comparison.md` の**構成**を使う。過去記事の商品情報・価格・体験談を新記事の根拠にしない。
- 投稿の要約に留めず、現行製品の公式サイト・開発資料から「着目した課題・技術の仕組み・選び方への意味」を加筆する。本文の説明の近くに出典を付け、メーカーの説明と本人の使用感を混同しない。詳しくは専用ワークフローの深掘り工程に従う。 本文は技術が落としやすさ・洗い心地などへどうつながるかを中心に書き、成分の羅列や不要な否定の補足は避ける。
- 画像にない使用感・使用歴・効果をゆんの体験として創作しない。画像内の主張、公式情報、本人の感想を分けて扱う。読めない重要箇所だけ具体的に確認する。
- 商品マスター、既存アフィリエイトURL、診断ロジックはこの作業の対象外。`npm run sync` や商品CSV再生成は行わない。
- 記事・今回の画像以外の未コミット変更を巻き込まない。`git add .` は使わない。
- `content/column/*.md` に下書き除外機能はない。未完成原稿・OCR・管理記録は `work/instagram-columns/<slug>/` に置き、本番へ混ぜない。
- Notionは既存の「インスタ投稿共有（@yun.skincare_)」の該当投稿へ記録する。新しい管理DBを毎回作らず、Instagramの既存「進捗」は変更しない。確定できない投稿には書き込まず、記事作成を続けながら投稿ページURLだけ確認する。
- 本番URLは実際の公開を確認してからNotionへ記録する。プレビューURLと公開URLを混同しない。リンクだけから公開済みと判断しない。
- 表紙は完成済みInstagram画像をそのまま使う。商品撮影写真は各商品見出しの直後に正方形で表示し、既存の `#square=` 機能を再利用する。広告開示は枠なし・12pxの灰色の通常段落にする。
