// 肌診断 - 質問データ・結果タイプ・スコアリングロジック
// 元化粧品研究員ゆん監修

// ========== 型定義 ==========
export type SkinType = 'dry' | 'oily' | 'combination' | 'sensitive' | 'aging' | 'normal'
export type Concern = 'spots' | 'wrinkles' | 'pores' | 'dryness' | 'acne' | 'redness'

export type QuestionOption = {
  label: string
  emoji?: string
  scores?: Partial<Record<SkinType, number>>
  concern?: Concern // Q1のみ：メイン悩み
}

export type Question = {
  id: number
  text: string
  subtext?: string
  category:
    | 'concern'
    | 'scene'
    | 'skinType'
    | 'barrier'
    | 'season'
    | 'aging'
    | 'routine'
    | 'lifestyle'
  options: QuestionOption[]
}

export type ResultType = {
  type: SkinType
  name: string
  tagEn: string
  emoji: string
  badge: string
  description: string
  features: string[]
  cares: { icon: string; title: string; text: string }[]
  ngList: string[]
  recommendedIngredients: string[]
  yunComment: string
  themeColor: string
  bgColor: string
}

// ========== 質問データ（8問） ==========
export const questions: Question[] = [
  {
    id: 1,
    text: '一番気になる肌悩みはどれ？',
    subtext: '直感で1番気になるものを選んでね',
    category: 'concern',
    options: [
      { label: 'シミ・くすみ（明るくしたい）', emoji: '🌑', scores: { aging: 1 }, concern: 'spots' },
      { label: 'シワ・たるみ（年齢サイン）', emoji: '🪞', scores: { aging: 3 }, concern: 'wrinkles' },
      { label: '毛穴の開き・黒ずみ', emoji: '🕳️', scores: { oily: 2 }, concern: 'pores' },
      { label: '乾燥・粉ふき・つっぱり', emoji: '🏜️', scores: { dry: 3 }, concern: 'dryness' },
      { label: 'ニキビ・吹き出物', emoji: '🔴', scores: { oily: 2 }, concern: 'acne' },
      { label: '赤み・ヒリヒリ・ピリつき', emoji: '🌸', scores: { sensitive: 3 }, concern: 'redness' },
    ],
  },
  {
    id: 2,
    text: '「あ、気になる…」と感じるのはどんな時？',
    subtext: '一番"あるある"な瞬間は？',
    category: 'scene',
    options: [
      { label: '写真に写った時', emoji: '📸', scores: { aging: 1 } },
      { label: 'メイクのノリが悪い時', emoji: '💄', scores: { dry: 1, oily: 1 } },
      { label: '鏡を間近で見た時', emoji: '🪞', scores: { aging: 1 } },
      { label: '触った時のザラつき・カサつき', emoji: '☝️', scores: { dry: 2 } },
      { label: '朝起きた時の顔の状態', emoji: '🔆', scores: { oily: 1, dry: 1 } },
    ],
  },
  {
    id: 3,
    text: '朝起きた瞬間の顔、どれが一番近い？',
    subtext: '何もつけてない素肌の状態',
    category: 'skinType',
    options: [
      { label: '全体的にしっとり、ベタつかない', emoji: '✨', scores: { normal: 3 } },
      { label: 'パリッとして突っ張る感じ', emoji: '💧', scores: { dry: 3 } },
      { label: 'ベタっと脂っぽい', emoji: '🛢️', scores: { oily: 3 } },
      { label: 'Tゾーンだけテカって頬は乾く', emoji: '🎭', scores: { combination: 3 } },
    ],
  },
  {
    id: 4,
    text: '新しい化粧品を試した翌朝、多いのは？',
    subtext: '初めて使ったコスメへの肌の反応',
    category: 'barrier',
    options: [
      { label: '何も起きない、しっとりしてる', emoji: '😌', scores: { normal: 2 } },
      { label: 'ピリピリ・赤みが出やすい', emoji: '😣', scores: { sensitive: 3 } },
      { label: 'ニキビができやすい', emoji: '😢', scores: { oily: 1, sensitive: 1 } },
      { label: '余計乾燥する', emoji: '🥲', scores: { dry: 2, sensitive: 1 } },
      { label: '今までも何度も合わないことがあった', emoji: '😭', scores: { sensitive: 3 } },
    ],
  },
  {
    id: 5,
    text: '一番調子が崩れる時期は？',
    subtext: '季節や体調と肌の関係',
    category: 'season',
    options: [
      { label: '真冬（乾燥がひどくなる）', emoji: '❄️', scores: { dry: 2 } },
      { label: '春・秋（花粉や季節の変わり目）', emoji: '🌸', scores: { sensitive: 3 } },
      { label: '真夏（テカリ・崩れ）', emoji: '☀️', scores: { oily: 2 } },
      { label: '生理前・寝不足の時', emoji: '🌙', scores: { sensitive: 1, oily: 1 } },
      { label: '特に変わらない', emoji: '😊', scores: { normal: 2 } },
    ],
  },
  {
    id: 6,
    text: '最近「あ、年齢かも」と感じるのは？',
    subtext: 'エイジングサインの自覚度',
    category: 'aging',
    options: [
      { label: '特にない', emoji: '🌟', scores: { normal: 1 } },
      { label: 'ファンデが小ジワに溜まる', emoji: '✏️', scores: { dry: 1, aging: 2 } },
      { label: 'ほうれい線・たるみが気になる', emoji: '😔', scores: { aging: 3 } },
      { label: 'ハリやツヤが減った気がする', emoji: '🫧', scores: { aging: 2 } },
    ],
  },
  {
    id: 7,
    text: '朝のスキンケア、近いのはどれ？',
    subtext: '今のお手入れスタイル',
    category: 'routine',
    options: [
      { label: '水だけ or 化粧水のみで時短派', emoji: '🚿', scores: { oily: 1 } },
      { label: '化粧水＋乳液の基本セット', emoji: '🧴', scores: { normal: 1 } },
      { label: '美容液までしっかり多段階', emoji: '💎', scores: { aging: 1 } },
      { label: '何が合うか分からなくて迷子', emoji: '🤔', scores: { sensitive: 2 } },
    ],
  },
  {
    id: 8,
    text: '睡眠×ストレス、近いのはどっち？',
    subtext: 'ライフスタイルが肌を作る',
    category: 'lifestyle',
    options: [
      { label: '寝てるけどストレス高め', emoji: '😤', scores: { oily: 1, sensitive: 1 } },
      { label: '寝不足だけどメンタル安定', emoji: '😪', scores: { aging: 1, dry: 1 } },
      { label: '両方OK', emoji: '😄', scores: { normal: 2 } },
      { label: '両方ダメで自分が心配', emoji: '😵', scores: { sensitive: 2, aging: 1 } },
    ],
  },
]

// ========== 結果タイプデータ（6種） ==========
export const resultTypes: Record<SkinType, ResultType> = {
  dry: {
    type: 'dry',
    name: '乾燥肌タイプ',
    tagEn: 'DRY SKIN TYPE',
    emoji: '💧',
    badge: 'うるおいケアタイプ',
    themeColor: '#7E96A2',  // くすみブルーグレー
    bgColor: '#EAF0F2',
    description:
      '肌の水分量が不足しがちなタイプ。洗顔後のつっぱりや粉ふき・カサつきが起きやすく、バリア機能が低下するとシワや小じわが目立ちやすい傾向があります。とにかく「水分補給＋水分を逃さないフタ」が鍵。',
    features: [
      '洗顔後に肌がつっぱりやすい',
      '頬や口周りがカサつく',
      '乾燥による小ジワが出やすい',
      'メイクが粉っぽく崩れやすい',
    ],
    cares: [
      { icon: '💧', title: 'セラミド配合の保湿', text: 'セラミドやヒアルロン酸配合の化粧水で角質層の水分を補給' },
      { icon: '🧴', title: 'クリームでフタをする', text: '化粧水→美容液→クリームの順で水分を逃さない多層ケア' },
      { icon: '🌙', title: 'ナイトケアの充実', text: '寝る前にリッチなクリームやオイルでしっかり保湿' },
    ],
    ngList: [
      '洗浄力の強いクレンジング・洗顔料',
      '熱いお湯での洗顔（ぬるま湯がベスト）',
      '化粧水だけで終わるケア',
    ],
    recommendedIngredients: ['セラミド', 'ヒアルロン酸', 'グリセリン', 'スクワラン'],
    yunComment:
      '乾燥肌は「攻める保湿」より「優しく重ねる保湿」が正解。私も冬は乳液を2回塗ることもあるよ。',
  },
  oily: {
    type: 'oily',
    name: '脂性肌タイプ',
    tagEn: 'OILY SKIN TYPE',
    emoji: '✨',
    badge: 'さっぱりケアタイプ',
    themeColor: '#A8956B',  // くすみベージュゴールド
    bgColor: '#F2EBDC',
    description:
      '皮脂の分泌が活発で、テカリや毛穴の開き・黒ずみが気になりやすいタイプ。実は「保湿不足」が皮脂の過剰分泌を招いていることも。落としすぎず、水分はしっかり補給するのがポイント。',
    features: [
      '午後になると顔全体がテカる',
      '毛穴の開き・黒ずみが気になる',
      'ニキビや吹き出物ができやすい',
      '化粧崩れしやすい',
    ],
    cares: [
      { icon: '🫧', title: '丁寧なクレンジング', text: '毛穴の汚れをしっかり落としつつ、落としすぎない洗顔を' },
      { icon: '💦', title: '水分ベースの保湿', text: 'さっぱり系の化粧水でしっかり水分補給。乳液は軽めに' },
      { icon: '🧊', title: '収れんケア', text: 'ビタミンC誘導体配合のアイテムで毛穴を引き締める' },
    ],
    ngList: [
      '1日に何度も洗顔する（皮脂の取りすぎは逆効果）',
      '保湿を省略する（テカリが余計増す）',
      '油分の多いクリームの厚塗り',
    ],
    recommendedIngredients: ['ビタミンC誘導体', 'ナイアシンアミド', 'サリチル酸', 'グリチルリチン酸'],
    yunComment:
      '皮脂は「敵」じゃない。守ってくれる存在。取りすぎず、整えてあげるのがゆん的正解。',
  },
  combination: {
    type: 'combination',
    name: '混合肌タイプ',
    tagEn: 'COMBINATION SKIN TYPE',
    emoji: '🎭',
    badge: 'バランスケアタイプ',
    themeColor: '#A38787',  // くすみモーブ
    bgColor: '#EFE8E8',
    description:
      'Tゾーン（おでこ・鼻）はテカるのに、頬や口周りは乾燥する…日本人に最も多い肌質。パーツごとに肌状態が違うので「全顔同じケア」は卒業。部位別ケアで一気にバランスが整います。',
    features: [
      'おでこ・鼻はテカるが頬は乾燥する',
      '季節や環境で肌の状態が変わりやすい',
      '部分的に毛穴が目立つ',
      '合うスキンケアが見つけにくい',
    ],
    cares: [
      { icon: '🎯', title: 'パーツ別ケア', text: 'Tゾーンはさっぱり、頬はしっとり。部位ごとに量を調整' },
      { icon: '⚖️', title: 'バランス保湿', text: 'ジェルタイプの保湿剤で、水分と油分のバランスを整える' },
      { icon: '🌿', title: '肌コンディショニング', text: 'ナイアシンアミド配合のアイテムで肌全体を底上げ' },
    ],
    ngList: [
      '顔全体に同じケアをする',
      'Tゾーンの保湿を省略する',
      '頬に油分の多いアイテムを塗りすぎる',
    ],
    recommendedIngredients: ['ナイアシンアミド', 'ヒアルロン酸', 'セラミド', 'BG'],
    yunComment:
      '混合肌は「全顔1パターンのケア」が一番もったいない。頬と鼻で量を変えるだけで激変するよ。',
  },
  sensitive: {
    type: 'sensitive',
    name: '敏感肌タイプ',
    tagEn: 'SENSITIVE SKIN TYPE',
    emoji: '🌸',
    badge: 'やさしさケアタイプ',
    themeColor: '#B79490',  // くすみピンクベージュ
    bgColor: '#F4EAE9',
    description:
      'バリア機能が弱く、外部刺激に敏感に反応しやすいタイプ。化粧品でピリピリしたり、季節の変わり目に赤みやかゆみが出やすい傾向。「シンプル × 低刺激 × バリア強化」の3点が肌を救う鍵。',
    features: [
      '化粧品でピリピリ・赤みが出ることがある',
      '季節の変わり目に肌が荒れやすい',
      '花粉や乾燥でかゆみが出る',
      '肌に合わないものが多いと感じる',
    ],
    cares: [
      { icon: '🧸', title: '低刺激アイテムを選ぶ', text: '敏感肌向け・無香料・無着色・無添加処方を優先' },
      { icon: '🛡️', title: 'バリア機能を強化', text: 'セラミド・ヘパリン類似物質などで肌を守る層を作る' },
      { icon: '🌿', title: 'シンプルケア', text: 'ステップを減らして肌への負担を最小限に' },
    ],
    ngList: [
      '成分の多いコスメを一度に複数試す',
      'スクラブやピーリングのやりすぎ',
      'アルコール・香料の強いアイテム',
    ],
    recommendedIngredients: ['セラミド', 'ヘパリン類似物質', 'グリチルリチン酸', 'パンテノール'],
    yunComment:
      '敏感肌は「足すケア」より「引くケア」が正解。私も赤みが出た時は化粧水＋ワセリンだけにしてる。',
  },
  aging: {
    type: 'aging',
    name: 'エイジング肌タイプ',
    tagEn: 'AGING SKIN TYPE',
    emoji: '💎',
    badge: 'ハリ・ツヤケアタイプ',
    themeColor: '#928196',  // くすみラベンダー
    bgColor: '#E9E4ED',
    description:
      'シワ・たるみ・くすみ・ハリ感の低下が主な悩み。コラーゲンやエラスチンの減少、ターンオーバーの遅れが原因。「攻めの美容成分」と「徹底した紫外線対策」の両輪が若見えの鍵。',
    features: [
      '目元や口元のシワが気になる',
      'フェイスラインのたるみ・もたつき',
      '肌のハリやツヤが減ってきた',
      'シミやくすみが目立つようになった',
    ],
    cares: [
      { icon: '✨', title: 'レチノール・ビタミンC', text: 'コラーゲン生成をサポートする攻めの成分を取り入れる' },
      { icon: '💆', title: 'リフトアップケア', text: 'マッサージ・EMS美顔器でたるみにアプローチ' },
      { icon: '☀️', title: '徹底した紫外線対策', text: '日焼け止めは365日。紫外線はエイジング最大の敵' },
    ],
    ngList: [
      '紫外線対策を怠る（最大のエイジング要因）',
      '過度なダイエット（栄養不足で肌が老ける）',
      '肌を引っ張るマッサージ',
    ],
    recommendedIngredients: ['レチノール', 'ナイアシンアミド', 'ビタミンC誘導体', 'ペプチド'],
    yunComment:
      'エイジングは「予防が最強」。29歳ノーファンデで気づいた、最大の若見えはUVケアと睡眠だよ。',
  },
  normal: {
    type: 'normal',
    name: '普通肌タイプ',
    tagEn: 'NORMAL SKIN TYPE',
    emoji: '🌟',
    badge: 'キープケアタイプ',
    themeColor: '#7E928A',  // くすみセージグリーン
    bgColor: '#E7EDE9',
    description:
      '水分と油分のバランスが取れた、理想的な肌状態。大きなトラブルは少ないですが、今の良い状態を維持するためのケアが大切。季節やライフスタイルの変化に合わせた微調整がポイント。',
    features: [
      '肌のキメが整っている',
      '大きな肌トラブルが少ない',
      '化粧のりが良い',
      '水分と油分のバランスが良い',
    ],
    cares: [
      { icon: '💎', title: '今のケアを継続', text: '現在のスキンケア習慣を大切に維持' },
      { icon: '🌟', title: 'プラスαの美容', text: '美容液やパックでさらに上の肌を目指す' },
      { icon: '📋', title: '定期的な肌チェック', text: '季節の変わり目に肌の状態を見直す習慣を' },
    ],
    ngList: [
      'ケアの手抜き（良い状態は努力の成果）',
      '過剰なスキンケア（やりすぎも禁物）',
      '生活習慣の乱れ（睡眠・食事・運動）',
    ],
    recommendedIngredients: ['ヒアルロン酸', 'ビタミンC誘導体', 'ナイアシンアミド', 'セラミド'],
    yunComment:
      'バランス肌は「キープが一番難しい」。攻めずに、でも手は抜かない。これが意外と難しいんだよね。',
  },
}

// ========== 悩みデータ ==========
export const concernLabels: Record<Concern, { label: string; emoji: string }> = {
  spots: { label: 'シミ・くすみ悩み', emoji: '🌑' },
  wrinkles: { label: 'シワ・たるみ悩み', emoji: '🪞' },
  pores: { label: '毛穴悩み', emoji: '🕳️' },
  dryness: { label: '乾燥悩み', emoji: '🏜️' },
  acne: { label: 'ニキビ悩み', emoji: '🔴' },
  redness: { label: '赤み・ヒリヒリ悩み', emoji: '🌸' },
}

// ========== スコアリング ==========
export type Answers = (number | undefined)[]

export type DiagnosisResult = {
  primaryType: SkinType
  scores: Record<SkinType, number>
  concern?: Concern
}

export function calculateResult(answers: Answers): DiagnosisResult {
  const scores: Record<SkinType, number> = {
    dry: 0,
    oily: 0,
    combination: 0,
    sensitive: 0,
    aging: 0,
    normal: 0,
  }

  let concern: Concern | undefined

  answers.forEach((answerIndex, qIndex) => {
    if (answerIndex === undefined) return
    const question = questions[qIndex]
    if (!question) return
    const option = question.options[answerIndex]
    if (!option) return

    // Q1の悩みは×3の重みで該当タイプにブースト
    const weight = qIndex === 0 ? 3 : 1
    if (option.scores) {
      for (const [type, val] of Object.entries(option.scores)) {
        scores[type as SkinType] += (val ?? 0) * weight
      }
    }
    if (option.concern && qIndex === 0) {
      concern = option.concern
    }
  })

  // 最高スコアのタイプを判定
  let primaryType: SkinType = 'normal'
  let maxScore = -1
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      primaryType = type as SkinType
    }
  }

  return { primaryType, scores, concern }
}

// 全タイプのスラッグ（静的生成用）
export const allSkinTypes: SkinType[] = ['dry', 'oily', 'combination', 'sensitive', 'aging', 'normal']
