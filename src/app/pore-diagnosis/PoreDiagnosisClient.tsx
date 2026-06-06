'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ===== 型定義 =====
type PoreTypeId =
  | 'open_pores' | 'clogged_pores' | 'black_pores'
  | 'sagging_pores' | 'dry_pores' | 'melanin_pores'
  | 'vellus_hair_pores' | 'crater'

interface PoreType {
  label: string
  alias: string
  icon: string
  desc: string
  causes: string[]
  advice: string[]
}

interface Product {
  name: string
  tag: string
  catch: string
  price?: string
  image: string
  url: string
  btnText: string
  rakutenUrl?: string
}

// ===== 毛穴タイプデータ =====
const TYPES: Record<string, PoreType> = {
  open_pores: {
    label: '開き毛穴', alias: 'すり鉢状毛穴', icon: '🕳️',
    desc: '皮脂分泌が多く、毛穴がはっきりと「穴」として開いて見えるタイプです。特にTゾーン（額・鼻・小鼻）に目立ちやすく、毛穴が黒い点というより「開いた穴」として認識されます。',
    causes: ['過剰な皮脂分泌', '皮膚の弾力低下', '乾燥による代償的な皮脂分泌', 'ホルモンバランスの崩れ'],
    advice: [
      '洗顔は朝夜2回、泡立てた洗顔料で優しく。皮脂を取りすぎないことが重要です',
      '収れん化粧水（ハマメリスエキス、グリチルリチン酸など）を活用しましょう',
      '保湿をしっかり行い、皮脂の過剰分泌を防ぎます',
      '週1〜2回の酵素洗顔や角質ケアで毛穴の詰まりを予防',
      '日焼け止めを毎日使い、紫外線による皮膚ダメージを防ぎましょう',
    ],
  },
  clogged_pores: {
    label: 'つまり毛穴', alias: '角栓毛穴', icon: '⚫',
    desc: '皮脂と古い角質が混ざり合って角栓を形成し、毛穴に詰まっているタイプです。触るとザラザラした感触があり、白や黄みがかった詰まりが見えることが特徴です。',
    causes: ['過剰な皮脂分泌', '古い角質の蓄積', 'メイク残り・ターンオーバーの乱れ'],
    advice: [
      'ダブル洗顔でメイクをしっかりオフ。クレンジングの後に洗顔料でケア',
      'サリチル酸（BHA）配合アイテムで毛穴の角栓ケアを',
      '毛穴パックの使い過ぎは毛穴を広げる原因に。週1回程度に留めましょう',
      'ターンオーバーを正常化させる保湿ケアが根本改善に',
      '洗顔後の引き締め化粧水で毛穴が再び詰まりにくい状態を作ります',
    ],
  },
  black_pores: {
    label: '黒ずみ毛穴', alias: '酸化角栓タイプ', icon: '🔲',
    desc: '毛穴に詰まった皮脂や角栓が空気に触れて酸化し、黒く見えるタイプです。鼻や小鼻に黒いポツポツとして現れ、触るとザラザラとした感触があります。',
    causes: ['角栓の形成と酸化', '皮脂・古い角質の蓄積'],
    advice: [
      '酸化した角栓を取り除くBHA（サリチル酸）配合のクレンザーを活用',
      'クレンジングは摩擦を避け、乳化させてから洗い流す',
      'レチノールやAHAなどのピーリング成分で角質ケア',
      '毎日の日焼け止めでメラニンによる色素沈着も予防',
    ],
  },
  sagging_pores: {
    label: 'たるみ毛穴', alias: '滴型・しずく型毛穴', icon: '💧',
    desc: 'コラーゲンやエラスチンの減少、重力による皮膚のたるみで毛穴が縦長・しずく型に引き伸ばされたタイプです。主に頬や法令線周辺に出やすく、加齢に伴い目立ちやすくなります。',
    causes: ['加齢によるハリ・弾力低下', 'コラーゲン・エラスチンの減少', '重力による下垂', '紫外線ダメージ'],
    advice: [
      'レチノール・ナイアシンアミドなど、コラーゲン産生をサポートする成分を取り入れて',
      '毎日の日焼け止めが必須。紫外線はたるみ毛穴最大の原因です',
      'フェイシャルマッサージやリフトアップケアで血行促進を',
      '睡眠不足は肌の再生を妨げます。7〜8時間の質の良い睡眠を',
    ],
  },
  dry_pores: {
    label: '乾燥毛穴', alias: 'インナードライによる毛穴', icon: '🌵',
    desc: '乾燥によって肌のキメが乱れ、毛穴が目立つタイプです。洗顔後につっぱる感じや、ファンデのカサつきが気になる方に多い傾向があります。',
    causes: ['保湿不足', 'バリア機能低下', '乾燥による代償的な皮脂分泌', 'ターンオーバーの乱れ'],
    advice: [
      '洗顔後すぐ（1分以内）に化粧水を。時間が経つと乾燥が加速します',
      'セラミド・ヒアルロン酸・スクワランなど保湿成分を重ね付け',
      '洗顔料は低刺激・保湿タイプを選択。ぬるま湯ですすぎ',
      'シートマスクを週2〜3回使って集中保湿を',
    ],
  },
  melanin_pores: {
    label: 'メラニン毛穴', alias: '毛穴ジミ・色素沈着型', icon: '🔵',
    desc: '毛穴の「中」ではなく「周り」がリング状に黒ずんで見えるタイプです。これは角栓ではなくメラニン色素の沈着が原因のため、触ってもザラザラしません。',
    causes: ['紫外線', '炎症後色素沈着', '毛穴周辺のメラニン蓄積'],
    advice: [
      '美白有効成分（ビタミンC誘導体・アルブチン・トラネキサム酸）配合アイテムをプラス',
      '日焼け止めをSPF50・PA++++で毎日使用し、紫外線を徹底ブロック',
      '洗顔時の摩擦をゼロに。摩擦は色素沈着を悪化させます',
      'ターンオーバーを促すAHA（グリコール酸）配合のピーリングケア',
    ],
  },
  vellus_hair_pores: {
    label: '産毛毛穴', alias: '産毛による黒ずみ毛穴', icon: '〰️',
    desc: '産毛が影を作ることで毛穴が黒ずんで見えるタイプです。近くで見ると毛の線や根元が見え、触るとチクチクした感触があります。角栓の詰まりではないため、ピーリングより産毛ケアが効果的です。',
    causes: ['濃い産毛', '剃毛後に目立つことがある'],
    advice: [
      '産毛の自己処理は電動シェーバーや除毛クリームで丁寧に',
      '医療脱毛（レーザー・光脱毛）を検討することも一つの選択肢',
      '産毛処理後は十分な保湿で肌バリアをケア',
      '日焼け止めで産毛の影が濃くなるのを予防',
    ],
  },
}

// ===== 商品データ =====
const IMG = 'https://www.yun-skin-care.com/'
const PRODUCTS: Record<string, Product[]> = {
  open_pores: [
    { name: 'KISO アゼライン酸15%クリーム', tag: '皮脂コントロール', catch: '天然由来のアゼライン酸が毛穴を詰まらせる過剰皮脂にアプローチ。ニキビ予防にも。', price: '¥2,020 / 20g', image: IMG + '写真入れ/クリーム/KISO アゼライン酸15クリーム.jpg', url: 'https://amzn.to/4ohe208', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/367a123d.677951f6.367a123e.ee85f101/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkiso%2Fkiso-k57%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
    { name: 'メラノCC 薬用しみ集中対策プレミアム美容液', tag: "Yun's Pick", catch: 'ビタミンB6が皮脂の過剰分泌をコントロール。テカリ・毛穴の開きをW対策。', price: '¥1,628 / 20g', image: IMG + '写真入れ/美容液/メラノCC 薬用しみ集中対策プレミアム美容液.jpg', url: 'https://amzn.to/43CRgX3', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/280df31e.cc217036.280df31f.ad07d749/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakuten24%2F4987241168583%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
    { name: 'ONE BY KOSÉ バランシング チューナー', tag: '皮脂バランス処方', catch: 'ライスパワーNo.6が皮脂分泌そのものを調整。みずみずしくすっきりとした肌へ。', price: '¥4,950 / 120mL', image: IMG + '写真入れ/化粧水/ONE BY KOSÉ セラムチューナー.jpg', url: 'https://amzn.to/3S4s4WD', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/3a7a3323.623c5a77.3a7a3324.f3eeec80/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fyayoi-cosme%2F27852k%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  ],
  clogged_pores: [
    { name: 'ラ ロッシュ ポゼ エファクラ ピールケア セラム', tag: '角質ケアNo.1', catch: 'サリチル酸＋乳酸の2種のピーリング成分が毎日使いで角栓を優しく除去。', price: '¥5,280 / 30mL', image: IMG + '写真入れ/美容液/IMG_1185.jpg', url: 'https://www.amazon.co.jp/dp/B09SX9DN4T?tag=onamzyyy0410m-22', btnText: 'Amazon', rakutenUrl: 'https://item.rakuten.co.jp/larocheposay/l00348/' },
    { name: 'ソフティモ クリアプロ クッションクレンジングオイル', tag: 'メイク落とし', catch: 'クッション泡が毛穴奥の汚れをしっかりオフ。洗い上がりつっぱりにくい。', price: '¥1,980 / 180mL', image: IMG + '写真入れ/クレンジング/ソフティモ クリアプロ クッションクレンジングオイル.jpg', url: 'https://amzn.to/49IetKP', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/37b19720.08bc207d.37b19721.21e05540/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakuten24-cosmetics%2F4971710555776%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
    { name: 'KISO アゼライン酸15%クリーム', tag: '詰まり予防', catch: '過剰皮脂を抑制することで角栓の元を作りにくい肌環境に整える。', price: '¥2,020 / 20g', image: IMG + '写真入れ/クリーム/KISO アゼライン酸15クリーム.jpg', url: 'https://amzn.to/4ohe208', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/367a123d.677951f6.367a123e.ee85f101/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkiso%2Fkiso-k57%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  ],
  black_pores: [
    { name: 'ビオレ おうちdeエステ ディープクレイ洗顔', tag: '黒角栓ケア', catch: '角栓崩壊技術×ミクロパウダーが毛穴の奥の黒角栓をかき出しすっきり。', price: '¥1,089 / 180g', image: IMG + '写真入れ/洗顔料/IMG_1494.jpg', url: 'https://www.kao-kirei.com/ja/item/khg/biore/4901301464057/?tw=khg', btnText: '公式サイト' },
    { name: 'トゥヴェール スキンピーリングローション', tag: 'ターンオーバー', catch: 'マイルドな酸ピーリングで角質をケア。詰まり角栓の排出サイクルを整える。', price: '¥2,650 / 100mL', image: IMG + '写真入れ/化粧水/トゥヴェール スキンピーリングローション.jpg', url: 'https://amzn.to/4vq7yy6', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/2c9f7caa.f2f3298f.2c9f7cab.d225e2f2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftvert%2F904214%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
    { name: 'エリクシール レチノパワー リンクルクリームS', tag: "Yun's Pick", catch: 'レチノールがターンオーバーを促進。角栓を自力で排出できる肌へ導く。', price: '¥6,490 / 15g', image: IMG + '写真入れ/クリーム/エリクシール レチノパワー リンクルクリームS.jpg', url: 'https://amzn.to/4ujc9Bk', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/280df31e.cc217036.280df31f.ad07d749/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakuten24%2F4909978214906%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  ],
  sagging_pores: [
    { name: 'ソフィーナ iP 薬用シワ改善泡セラム', tag: 'ハリ・弾力No.1', catch: '炭酸泡×ナイアシンアミドが毛穴周りのハリをUP。しずく型毛穴に届くケア。', price: '¥6,380 / 90g', image: IMG + '写真入れ/導入美容液/IMG_1167.jpg', url: 'https://www.amazon.co.jp/dp/B0CVRYM4QW?tag=onamzyyy0410m-22', btnText: 'Amazon', rakutenUrl: 'https://item.rakuten.co.jp/rakuten24/4901301416483/' },
    { name: 'トゥヴェール レチノショット 0.1', tag: "Yun's Pick", catch: 'レチノール×ペプチドの組み合わせでコラーゲン産生を促し弾力ある肌へ。', price: '¥3,980 / 30g', image: IMG + '写真入れ/クリーム/トゥヴェール レチノショット 0.1.jpg', url: 'https://amzn.to/4uWjU1h', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/2c9f7caa.f2f3298f.2c9f7cab.d225e2f2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftvert%2F350%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
    { name: 'ソフィーナ iP ハリ弾力注入美容液', tag: '集中リフトケア', catch: '凹凸密着処方でたるんだ毛穴周りにハリを補給。フィルムのように密着。', price: '¥4,730 / 40g', image: IMG + '写真入れ/美容液/IMG_1179.jpg', url: 'https://www.amazon.co.jp/dp/B0CCJBHQKR?tag=onamzyyy0410m-22', btnText: 'Amazon', rakutenUrl: 'https://item.rakuten.co.jp/rakuten24/4901301422750/' },
  ],
  dry_pores: [
    { name: 'ソフィーナ iP 薬用シワ改善泡セラム', tag: 'うるおい補給', catch: 'ナイアシンアミド炭酸泡がキメを整えながらハリをUP。乾燥毛穴の影をケア。', price: '¥6,380 / 90g', image: IMG + '写真入れ/導入美容液/IMG_1167.jpg', url: 'https://www.amazon.co.jp/dp/B0CVRYM4QW?tag=onamzyyy0410m-22', btnText: 'Amazon', rakutenUrl: 'https://item.rakuten.co.jp/rakuten24/4901301416483/' },
    { name: 'トゥヴェール バランシングGAローション モイスト', tag: "Yun's Pick", catch: '6%グリシルグリシンがキメを整えながら保湿。乾燥でしぼんだ毛穴をふっくら。', price: '¥1,980', image: IMG + '写真入れ/化粧水/IMG_1062.jpg', url: 'https://www.amazon.co.jp/dp/B0FJXD8J5D?tag=onamzyyy0410m-22', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/2c9f7caa.f2f3298f.2c9f7cab.d225e2f2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftvert%2F352%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
    { name: 'アクアレーベル トリートメントローション（モイストスムース）', tag: '保湿＋キメ整え', catch: 'グリシルグリシン配合でキメを整えながらうるおいをキープ。乾燥毛穴の凹凸をなめらかに。', image: IMG + '写真入れ/化粧水/IMG_1059.jpg', url: '', btnText: '', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/2ca080ea.f3db1764.2ca080eb.daadf930/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhb-navi%2F002-8257606%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  ],
  melanin_pores: [
    { name: 'オバジ C10セラム', tag: '美白ケアNo.1', catch: '高濃度ピュアビタミンCがメラニン生成を抑制。毛穴周りのリング状黒ずみを薄く。', price: '¥4,400 / 12mL', image: IMG + '写真入れ/美容液/IMG_1173.jpg', url: 'https://www.amazon.co.jp/dp/B0GCCF24T1?tag=onamzyyy0410m-22', btnText: 'Amazon', rakutenUrl: 'https://item.rakuten.co.jp/fancylifecosme/4987241134502/' },
    { name: 'オルビス リンクルブライトUVプロテクター N', tag: "Yun's Pick", catch: '美白×シワ対策の薬用ハイスペUV。色素沈着を防ぐ毎日のファーストステップ。', price: '¥3,850 / 50g', image: IMG + '写真入れ/日焼け止め/IMG_0873.jpg', url: 'https://www.amazon.co.jp/dp/B0GLP7GYMX?tag=onamzyyy0410m-22', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/373d6002.128cad32.373d6003.401ff5a4/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Forbis-shop%2Fr4908064090790%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
    { name: 'HAKU 薬用 メラノフォーカスIV【医薬部外品】', tag: '資生堂HAKU', catch: 'メラニン生成を抑え、すでにできた毛穴まわりの黒ずみ・シミにも集中アプローチ。', image: IMG + '写真入れ/美容液/HAKU メラノフォーカスIV.webp', url: 'https://amzn.to/3PZNZxK', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/280df31e.cc217036.280df31f.ad07d749/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakuten24%2F4909978224486%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  ],
  vellus_hair_pores: [
    { name: 'トゥヴェール バランシングGAローション モイスト', tag: '産毛ケア後の保湿', catch: '産毛処理後の乾燥・炎症を抑え、バリア機能を整える。6%GAでキメもアップ。', price: '¥1,980', image: IMG + '写真入れ/化粧水/IMG_1062.jpg', url: 'https://www.amazon.co.jp/dp/B0FJXD8J5D?tag=onamzyyy0410m-22', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/2c9f7caa.f2f3298f.2c9f7cab.d225e2f2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftvert%2F352%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
    { name: 'オルビス リンクルブライトUVプロテクター N', tag: '毎日のUVケア必須', catch: '産毛の影が濃くなるのは紫外線が原因。SPF50+・PA++++で毎日ブロック。', price: '¥3,850 / 50g', image: IMG + '写真入れ/日焼け止め/IMG_0873.jpg', url: 'https://www.amazon.co.jp/dp/B0GLP7GYMX?tag=onamzyyy0410m-22', btnText: 'Amazon', rakutenUrl: 'https://hb.afl.rakuten.co.jp/ichiba/373d6002.128cad32.373d6003.401ff5a4/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Forbis-shop%2Fr4908064090790%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  ],
}

// ===== 質問データ =====
interface Question {
  category: string
  text: string
  hint?: string
  scores: Partial<Record<PoreTypeId, number>>
}

const QUESTIONS: Question[] = [
  { category: '毛穴の状態', text: '気になる部分は「黒ずみ」や「詰まり」より、皮膚が「凹んで」見えますか？', hint: '触ると穴のようなくぼみを感じる場合', scores: { crater: 1 } },
  { category: '毛穴の状態', text: 'その凹みは、ニキビが治った後から残っていますか？', scores: { crater: 1 } },
  { category: '毛穴の形・位置', text: '頬の毛穴が縦長・しずく型に伸びて見えますか？', hint: '丸い点ではなく、滴のように細長く見える場合', scores: { sagging_pores: 2 } },
  { category: '毛穴の形・位置', text: '頬や法令線あたりの毛穴が特に気になりますか？', hint: '小鼻・鼻よりも頬の方が目立つ', scores: { sagging_pores: 2 } },
  { category: '毛穴の形・位置', text: '頬を軽く上に引き上げると、毛穴が目立ちにくくなりますか？', scores: { sagging_pores: 2 } },
  { category: '黒ずみの特徴', text: '鼻や小鼻に、いちご鼻のような黒いポツポツがありますか？', scores: { black_pores: 1, clogged_pores: 1 } },
  { category: '黒ずみの特徴', text: 'その黒いポツポツを触ると、ザラザラした感触がありますか？', hint: '指でなでるとポツポツした角栓が感じられる場合', scores: { black_pores: 2, clogged_pores: 1 } },
  { category: '黒ずみの特徴', text: '黒ずみは毛穴の「中心」ではなく、毛穴の「周り」がリング状に黒く見えますか？', hint: '境界線が曖昧なシミのような黒ずみ', scores: { melanin_pores: 2 } },
  { category: '黒ずみの特徴', text: '黒ずみ部分を近くで見ると、細い毛（産毛）が見えますか？', scores: { vellus_hair_pores: 2 } },
  { category: '詰まりの状態', text: '毛穴の中に白っぽい詰まりや小さな角栓が見えますか？', hint: '黒い酸化角栓ではなく、白・黄色みがかった詰まり', scores: { clogged_pores: 2 } },
  { category: '詰まりの状態', text: '毛穴の出口が角栓で盛り上がって見えることがありますか？', scores: { clogged_pores: 2 } },
  { category: '毛穴の大きさ・開き', text: 'TゾーンやUゾーンの毛穴が、はっきりとした「穴」として開いて見えますか？', hint: '黒い点ではなく、すり鉢状に広がった穴のように見える', scores: { open_pores: 2 } },
  { category: '毛穴の大きさ・開き', text: '皮脂が多く、昼頃になるとテカリが気になりますか？', scores: { open_pores: 1, clogged_pores: 1 } },
  { category: '毛穴の大きさ・開き', text: 'メイク後も毛穴の「開き」が気になりますか？', scores: { open_pores: 2 } },
  { category: '乾燥・うるおい', text: '洗顔後、肌がつっぱる感じがありますか？', hint: '特に頬や口元のつっぱり感', scores: { dry_pores: 2 } },
  { category: '乾燥・うるおい', text: 'パウダーファンデーションがのりにくく、カサつきが目立ちますか？', scores: { dry_pores: 2 } },
]

type Screen = 'start' | 'question' | 'result' | 'crater'
type Scores = Record<string, number>

// ===== メインコンポーネント =====
export default function PoreDiagnosisClient() {
  const [screen, setScreen] = useState<Screen>('start')
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<Scores>({})
  const [mainType, setMainType] = useState('')
  const [secondType, setSecondType] = useState('')

  const totalQ = QUESTIONS.length

  function startDiagnosis() {
    setScores({})
    setCurrentQ(0)
    setScreen('question')
  }

  function answer(isYes: boolean) {
    const newScores = { ...scores }
    if (isYes) {
      const q = QUESTIONS[currentQ]
      for (const [type, pt] of Object.entries(q.scores)) {
        newScores[type] = (newScores[type] ?? 0) + (pt as number)
      }
    }
    setScores(newScores)

    const next = currentQ + 1
    if (next < totalQ) {
      setCurrentQ(next)
    } else {
      finalize(newScores)
    }
  }

  function finalize(s: Scores) {
    if ((s.crater ?? 0) >= 2) { setScreen('crater'); return }

    const typeScores = Object.entries(s)
      .filter(([k]) => k !== 'crater')
      .sort(([, a], [, b]) => b - a)

    const [m, mScore] = typeScores[0] ?? ['open_pores', 0]
    const [sec, secScore] = typeScores[1] ?? ['', 0]
    setMainType(m)
    setSecondType(secScore >= 2 && mScore - secScore <= 2 ? sec : '')
    setScreen('result')
  }

  function reset() {
    setScreen('start')
    setCurrentQ(0)
    setScores({})
    setMainType('')
    setSecondType('')
  }

  const pct = Math.round((currentQ / totalQ) * 100)

  // ----- START -----
  if (screen === 'start') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px 80px' }}>
      <div style={{ paddingTop: 24 }}>
        <Link href="/diagnosis" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-mute)', textDecoration: 'none', letterSpacing: '0.06em' }}>
          <span>🪞</span><span>肌質タイプ診断はこちら →</span>
        </Link>
      </div>
      <div style={{ textAlign: 'center', padding: '48px 16px 40px' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto 20px', background: 'linear-gradient(135deg, var(--bg-ivory) 0%, oklch(0.93 0.025 75) 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🔍</div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 12 }}>Pore Type Diagnosis</p>
        <h1 style={{ fontFamily: 'var(--font-jp)', fontSize: 'clamp(20px, 5.5vw, 26px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.05em', marginBottom: 12, lineHeight: 1.5 }}>
          あなたの毛穴タイプを<br />診断しましょう
        </h1>
        <p style={{ fontFamily: 'var(--font-jp-alt)', color: 'var(--ink-soft)', fontSize: 13, maxWidth: 360, margin: '0 auto 28px', lineHeight: 1.9, letterSpacing: '0.06em' }}>
          16の質問に答えるだけで、毛穴の悩みの原因とタイプを特定。あなたに合ったスキンケアをご提案します。
        </p>
        <button onClick={startDiagnosis} style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-deep) 100%)', color: '#fff', fontFamily: 'var(--font-jp)', fontWeight: 600, fontSize: 15, letterSpacing: '0.12em', padding: '15px 48px', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px oklch(0.6 0.08 75 / .3)' }}>
          診断スタート →
        </button>
        <p style={{ marginTop: 10, fontSize: 11, color: 'var(--ink-mute)' }}>所要時間：約2〜3分</p>
      </div>
    </div>
  )

  // ----- QUESTION -----
  if (screen === 'question') {
    const q = QUESTIONS[currentQ]
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px 80px' }}>
        {/* プログレスバー */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-mute)', marginBottom: 8, letterSpacing: '0.08em' }}>
            <span>質問 {currentQ + 1} / {totalQ}</span>
            <span>{pct}%</span>
          </div>
          <div style={{ background: 'var(--line-soft)', borderRadius: 10, height: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--gold), var(--gold-deep))', borderRadius: 10, width: `${pct}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>
        {/* 質問カード */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 20px oklch(0.3 0.01 70 / .06)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 10 }}>{q.category}</p>
          <p style={{ fontFamily: 'var(--font-jp)', fontSize: 'clamp(14px, 3.8vw, 16px)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.7, marginBottom: q.hint ? 8 : 24 }}>{q.text}</p>
          {q.hint && <p style={{ fontSize: 11, color: 'var(--ink-mute)', marginBottom: 20 }}>{q.hint}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'はい', emoji: '😊', yes: true },
              { label: 'いいえ', emoji: '🙅', yes: false },
            ].map(({ label, emoji, yes }) => (
              <button key={label} onClick={() => answer(yes)} style={{ padding: '14px 8px', borderRadius: 12, border: '1.5px solid var(--line)', background: '#fff', fontFamily: 'var(--font-jp)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--ink)', transition: 'all .15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = yes ? 'var(--gold)' : '#9aafbe'; (e.currentTarget as HTMLElement).style.background = yes ? 'oklch(0.97 0.02 80)' : '#f0f4f8' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLElement).style.background = '#fff' }}
              >
                <span style={{ fontSize: 22 }}>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ----- CRATER -----
  if (screen === 'crater') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px 80px' }}>
      <div style={{ background: 'linear-gradient(135deg, oklch(0.97 0.015 80), oklch(0.95 0.02 75))', borderRadius: 16, padding: '28px 24px', textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏥</div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 8 }}>Diagnosis Result</p>
        <h2 style={{ fontFamily: 'var(--font-jp)', fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>医師への相談をおすすめします</h2>
        <p style={{ fontFamily: 'var(--font-jp-alt)', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.9 }}>クレーター状毛穴（ニキビ跡）の可能性があります。通常の毛穴ケアとは異なるアプローチが必要なため、皮膚科・美容皮膚科への相談をおすすめします。</p>
      </div>
      <button onClick={reset} style={{ display: 'block', width: '100%', background: 'transparent', border: '1.5px solid var(--line)', color: 'var(--ink-soft)', fontFamily: 'var(--font-jp)', fontSize: 13, padding: '12px 0', borderRadius: 50, cursor: 'pointer', marginTop: 16 }}>↩ もう一度診断する</button>
    </div>
  )

  // ----- RESULT -----
  const data = TYPES[mainType]
  if (!data) return null
  const products = PRODUCTS[mainType] ?? []
  const maxScore = Math.max(1, ...Object.entries(scores).filter(([k]) => k !== 'crater').map(([, v]) => v))

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px 80px' }}>
      {/* ヘッダー */}
      <div style={{ textAlign: 'center', padding: '32px 16px 24px' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 8 }}>Diagnosis Result</p>
        <h2 style={{ fontFamily: 'var(--font-jp)', fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: 700, color: 'var(--ink)' }}>
          あなたは「{data.label}」タイプです
        </h2>
      </div>

      {/* タイプカード */}
      <div style={{ background: 'linear-gradient(135deg, oklch(0.98 0.018 80), oklch(0.95 0.025 75))', border: '1.5px solid oklch(0.88 0.03 75)', borderRadius: 16, padding: '24px 20px', marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>{data.icon}</div>
        <p style={{ fontFamily: 'var(--font-jp)', fontSize: 'clamp(20px, 5.5vw, 24px)', fontWeight: 800, color: 'var(--gold-deep)', marginBottom: 8, letterSpacing: '0.04em' }}>{data.label}（{data.alias}）</p>
        <p style={{ fontFamily: 'var(--font-jp-alt)', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.9 }}>{data.desc}</p>
      </div>

      {/* 併発タイプ */}
      {secondType && TYPES[secondType] && (
        <div style={{ background: 'var(--bg-ivory)', border: '1px solid var(--line-soft)', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 4 }}>併発傾向あり</p>
          <p style={{ fontFamily: 'var(--font-jp)', fontSize: 14, fontWeight: 700, color: 'var(--ink-soft)' }}>{TYPES[secondType].label}（{TYPES[secondType].alias}）</p>
        </div>
      )}

      {/* スコアバー */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '18px 18px', marginBottom: 16, boxShadow: '0 2px 12px oklch(0.3 0.01 70 / .05)' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 14 }}>毛穴タイプ スコア</p>
        {(['open_pores', 'clogged_pores', 'black_pores', 'sagging_pores', 'dry_pores', 'melanin_pores', 'vellus_hair_pores'] as const).map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-jp)', fontSize: 11, color: 'var(--ink-soft)', minWidth: 88 }}>{TYPES[t].label}</span>
            <div style={{ flex: 1, height: 7, background: 'var(--line-soft)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${((scores[t] ?? 0) / maxScore) * 100}%`, background: 'linear-gradient(90deg, var(--gold), var(--gold-deep))', borderRadius: 10, transition: 'width 0.8s ease' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--ink-mute)', minWidth: 20, textAlign: 'right' }}>{scores[t] ?? 0}</span>
          </div>
        ))}
      </div>

      {/* アドバイス */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 20px', marginBottom: 16, boxShadow: '0 2px 12px oklch(0.3 0.01 70 / .05)' }}>
        <p style={{ fontFamily: 'var(--font-jp)', fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 14 }}>💡 あなたへのケアアドバイス</p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.advice.map((a, i) => (
            <li key={i} style={{ fontFamily: 'var(--font-jp-alt)', fontSize: 13, color: 'var(--ink-soft)', paddingLeft: 18, position: 'relative', lineHeight: 1.8 }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--gold)', fontSize: 10, top: 5 }}>✦</span>
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* 商品セクション */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontFamily: 'var(--font-jp)', fontSize: 15, fontWeight: 700, color: 'var(--ink)', textAlign: 'center', marginBottom: 4 }}>あなたの毛穴タイプに<br />おすすめのアイテム</p>
        <p style={{ fontFamily: 'var(--font-jp-alt)', fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center', marginBottom: 18 }}>肌研究を重ねたYunが厳選したスキンケア</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map((p, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 14px oklch(0.3 0.01 70 / .07)', display: 'flex', alignItems: 'stretch' }}>
              <div style={{ width: 100, minHeight: 100, flexShrink: 0, background: 'oklch(0.97 0.018 80)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {p.image
                  ? <img src={p.image} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 32, opacity: 0.3 }}>🧴</span>}
              </div>
              <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 3 }}>{p.tag}</p>
                  <p style={{ fontFamily: 'var(--font-jp)', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.4 }}>{p.name}</p>
                  <p style={{ fontFamily: 'var(--font-jp-alt)', fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 4 }}>{p.catch}</p>
                  {p.price && <p style={{ fontFamily: 'var(--font-jp)', fontSize: 12, fontWeight: 700, color: 'var(--gold-deep)', marginBottom: 6 }}>{p.price}</p>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="sponsored nofollow noopener" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-deep))', color: '#fff', fontFamily: 'var(--font-jp)', fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 30, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      {p.btnText}で見る
                    </a>
                  )}
                  {p.rakutenUrl && (
                    <a href={p.rakutenUrl} target="_blank" rel="sponsored nofollow noopener" style={{ background: 'linear-gradient(135deg, #e85c5c, #c94040)', color: '#fff', fontFamily: 'var(--font-jp)', fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 30, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      楽天で見る
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 肌診断への誘導 */}
      <Link href="/diagnosis" style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(135deg, oklch(0.97 0.018 80), oklch(0.94 0.025 75))', border: '1.5px solid oklch(0.87 0.03 75)', borderRadius: 12, padding: '18px 20px', textDecoration: 'none', marginBottom: 20 }}>
        <span style={{ fontSize: 26, flexShrink: 0 }}>🪞</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 2 }}>Also Try</p>
          <p style={{ fontFamily: 'var(--font-jp)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>肌質タイプ診断もやってみませんか？</p>
          <p style={{ fontFamily: 'var(--font-jp-alt)', fontSize: 11, color: 'var(--ink-soft)' }}>乾燥・脂性・混合・敏感…8問でタイプ判定</p>
        </div>
        <span style={{ color: 'var(--gold)', fontSize: 16, flexShrink: 0 }}>→</span>
      </Link>

      <div style={{ textAlign: 'center' }}>
        <button onClick={reset} style={{ background: 'transparent', border: '1.5px solid var(--line)', color: 'var(--ink-soft)', fontFamily: 'var(--font-jp)', fontSize: 13, padding: '11px 32px', borderRadius: 50, cursor: 'pointer' }}>↩ もう一度診断する</button>
      </div>
    </div>
  )
}
