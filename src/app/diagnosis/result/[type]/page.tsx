import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  resultTypes,
  allSkinTypes,
  concernLabels,
  type SkinType,
  type Concern,
} from '@/lib/diagnosis'
import { SITE_URL } from '@/lib/siteConfig'
import SkinRadarChart, { TYPICAL_VALUES_BY_TYPE } from '@/components/SkinRadarChart'
import DiagnosisProductMatch from '@/components/DiagnosisProductMatch'
import ShareButtons from './ShareButtons'

// 静的パラメータ生成（SSG）
export function generateStaticParams() {
  return allSkinTypes.map((type) => ({ type }))
}

type Props = {
  params: Promise<{ type: string }>
  searchParams: Promise<{ concern?: string; scores?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const result = resultTypes[type as SkinType]
  if (!result) return {}

  const title = `${result.name}診断結果｜元化粧品研究・商品企画監修のスキンケアアドバイス`
  const description = `あなたの肌タイプは「${result.name}」。${result.description.slice(0, 80)}...元化粧品研究・商品企画のゆんが監修した専門的なケア方法を解説。`

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/diagnosis/result/${type}`,
    },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/diagnosis/result/${type}`,
      title: `私の肌タイプは「${result.name}」でした🌸`,
      description: `元化粧品研究・商品企画監修の肌診断でわかった、私の肌タイプと最適なケア方法。`,
      images: ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `私の肌タイプは「${result.name}」でした🌸`,
      description: '元化粧品研究・商品企画監修の肌診断であなたのタイプもチェック！',
    },
  }
}

// scores クエリパラメータをパース、無ければタイプ別デフォルト
function parseScores(
  scoresParam: string | undefined,
  type: SkinType,
): [number, number, number, number, number] {
  if (scoresParam) {
    const arr = scoresParam.split(',').map((n) => parseInt(n, 10))
    if (arr.length === 5 && arr.every((n) => !isNaN(n))) {
      return arr as [number, number, number, number, number]
    }
  }
  return TYPICAL_VALUES_BY_TYPE[type] || TYPICAL_VALUES_BY_TYPE.normal
}

// タイプ別「今日からできる」Tips（即実践可能・成分以外のライフスタイル系）
const TODAYS_TIPS: Record<SkinType, { tip: string; why: string }[]> = {
  dry: [
    { tip: '洗顔は ぬるま湯（32〜34℃）で短めに', why: '熱いお湯や長時間の洗顔は、必要な皮脂やうるおい成分を奪う一因に。30秒〜1分を目安に' },
    { tip: '化粧水は手で2〜3回に分けて重ねづけ', why: '少量を重ねる方が、角層にうるおいが行き渡りやすくなります' },
    { tip: '寝室に加湿器を置く（湿度50〜60%）', why: '寝ている間の乾燥が、翌朝のコンディションを左右します' },
  ],
  oily: [
    { tip: '洗顔は朝晩2回まで（こすらず泡で）', why: '洗いすぎはバリア機能を弱め、かえってテカリやニキビの一因に。摩擦も毛穴の敵です' },
    { tip: '日中のテカリは押さえ取り＋ミスト保湿', why: 'こすって取ると刺激で皮脂が増えやすいので、押さえて吸い取るのが基本' },
    { tip: '化粧水後は必ず軽い保湿でうるおいを閉じ込める', why: '保湿を省くと「乾燥→皮脂が出やすい」状態になりやすい' },
  ],
  combination: [
    { tip: 'Tゾーンと頬で量を変える「部位別ケア」', why: '同じ量を全顔に塗ると、テカる部分・乾く部分の両方が悪化しやすい' },
    { tip: 'クレンジングは部位別の処方を意識', why: '頬は優しく短時間、Tゾーンはやや丁寧めが理想' },
    { tip: '夏はジェル、冬はクリームに切替', why: '季節で皮脂量が変わるので、保湿剤のテクスチャーも変える' },
  ],
  sensitive: [
    { tip: '新製品は腕の内側で2日テストしてから顔に', why: 'パッチテストで肌に合うかを確認すれば、トラブルを減らせます' },
    { tip: 'ステップを最小限に（化粧水＋クリームでもOK）', why: '成分の数が多いほど、刺激の可能性も増えます' },
    { tip: '入浴後はできるだけ早く保湿（目安5分以内、遅くとも10分以内）', why: '入浴後10分以内で角層水分が大きく低下するという報告もあり、早めの保湿でうるおいキープ' },
  ],
  aging: [
    { tip: '日焼け止めは曇り・室内・冬も365日', why: '紫外線（特にUVA）はガラス越しにも届き、肌印象の変化に大きく影響' },
    { tip: '夜のレチノールは少量から週2〜3回でスタート', why: 'はじめは低頻度・低濃度で。肌の慣れを見ながら頻度を上げる' },
    { tip: '枕カバーは週1〜2回洗濯、肌が荒れやすい人はもっとこまめに', why: '雑菌や摩擦は肌コンディションに影響しやすい。シルク素材も摩擦軽減の選択肢' },
  ],
  normal: [
    { tip: '季節の変わり目に肌チェックの習慣を', why: '良い状態は変化を見逃しやすい。週1で観察するクセを' },
    { tip: '攻める前に基本を磨く', why: '高機能美容液を足す前に、洗顔・保湿・UVの3点を整える' },
    { tip: '睡眠時間を肌のバロメーターに', why: '6時間未満が続くと、整った肌でもコンディションが崩れやすい' },
  ],
}

// 成分の解説（肌質を知らない初心者向け／化粧品の標榜可能範囲に準拠）
const INGREDIENT_INFO: Record<string, { what: string; effect: string }> = {
  'セラミド': { what: '角層のバリアを構成する脂質', effect: 'うるおいを抱え込み、肌をすこやかに保つ' },
  'ヒアルロン酸': { what: '高い保水力を持つ成分', effect: '最大6L程度の水を抱えると言われる、保湿のベース' },
  'グリセリン': { what: '高い保湿力を持つ多価アルコール', effect: '角層にうるおいを与え、柔らかな肌印象に' },
  'スクワラン': { what: '皮脂と相性の良いオイル成分', effect: 'うるおいを閉じ込めるフタの役割' },
  'ビタミンC誘導体': { what: 'ビタミンCを安定化させた成分', effect: '透明感のある印象とキメの整った肌をサポート' },
  'ナイアシンアミド': { what: 'ビタミンB3の一種', effect: '医薬部外品では「乾燥小ジワを目立たなくする」「メラニンの生成を抑え、シミ・そばかすを防ぐ」有効成分としても使われる多機能成分' },
  'サリチル酸': { what: '角質柔軟作用のあるBHA', effect: '毛穴の汚れをやさしくケアし、なめらかな肌印象に' },
  'グリチルリチン酸': { what: '甘草由来の成分', effect: '肌荒れを防ぐ成分として医薬部外品にも使われる' },
  'BG': { what: '低刺激な多価アルコール', effect: 'ベタつかずうるおいを肌に留める' },
  'アラントイン': { what: '植物などにも含まれる成分', effect: '肌荒れを防ぐ成分として医薬部外品にも使われる' },
  'パンテノール': { what: 'プロビタミンB5', effect: 'うるおいを与え、肌のキメを整える' },
  'レチノール': { what: 'ビタミンA誘導体', effect: 'ハリ感のある肌印象に。医薬部外品では「乾燥小ジワを目立たなくする」有効成分としても使われる' },
  'ペプチド': { what: 'アミノ酸が連なった美容成分', effect: 'ハリ・弾力のある肌印象をサポート' },
}

export default async function ResultPage({ params, searchParams }: Props) {
  const { type } = await params
  const { concern: concernParam, scores: scoresParam } = await searchParams
  const result = resultTypes[type as SkinType]
  if (!result) notFound()

  const concern = (concernParam as Concern | undefined) && concernLabels[concernParam as Concern]
    ? (concernParam as Concern)
    : undefined

  const radarValues = parseScores(scoresParam, type as SkinType)
  const tips = TODAYS_TIPS[type as SkinType]

  // 構造化データ
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '肌診断', item: `${SITE_URL}/diagnosis` },
      { '@type': 'ListItem', position: 3, name: result.name, item: `${SITE_URL}/diagnosis/result/${type}` },
    ],
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${result.name}とは？特徴とおすすめスキンケア`,
    description: result.description,
    author: {
      '@type': 'Person',
      name: 'ゆん（yun.skincare_）',
      jobTitle: '元化粧品研究・商品企画',
      url: 'https://www.instagram.com/yun.skincare_',
    },
    publisher: {
      '@type': 'Organization',
      name: 'yun.skincare_',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/diagnosis/result/${type}`,
    },
  }

  return (
    <div
      className="max-w-2xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-cream)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* パンくず */}
      <nav
        className="px-5 pt-5 text-[10px]"
        style={{ color: 'var(--ink-mute)', letterSpacing: '0.2em' }}
        aria-label="パンくず"
      >
        <Link href="/" className="hover:opacity-70 transition-opacity">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/diagnosis" className="hover:opacity-70 transition-opacity">肌診断</Link>
        <span className="mx-2">/</span>
        <span style={{ color: 'var(--ink)' }}>{result.name}</span>
      </nav>

      {/* 結果ヒーロー */}
      <section className="px-5 pt-10 pb-8 text-center">
        <SectionLabel en="Diagnosis Result" jp="あなたの診断結果" />

        <div
          className="mx-auto mt-6 px-7 py-9"
          style={{
            background: '#fff',
            border: '1px solid var(--line-soft)',
            maxWidth: 460,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '11px',
              letterSpacing: '0.32em',
              color: 'var(--gold-deep)',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            {result.tagEn}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: 'clamp(20px, 5.6vw, 26px)',
              letterSpacing: '0.14em',
              color: 'var(--ink)',
              marginBottom: 18,
            }}
          >
            {result.name}
          </h1>
          <span
            className="inline-block px-4 py-1.5"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.18em',
              color: 'var(--gold-deep)',
              border: '1px solid var(--gold)',
              background: 'oklch(0.99 0.012 80)',
              borderRadius: 999,
            }}
          >
            {result.badge}
          </span>

          {concern && (
            <div
              className="mt-5 pt-4"
              style={{ borderTop: '1px solid var(--line-soft)' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 10,
                  letterSpacing: '0.32em',
                  color: 'var(--ink-mute)',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                main concern
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-jp)',
                  fontWeight: 500,
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  color: 'var(--ink)',
                }}
              >
                {concernLabels[concern].label}
              </span>
            </div>
          )}

          <p
            className="mt-6 text-left"
            style={{
              fontFamily: 'var(--font-jp-alt)',
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 2.1,
              letterSpacing: '0.08em',
              color: 'var(--ink-soft)',
            }}
          >
            {result.description}
          </p>
        </div>
      </section>

      {/* Product Match — 診断直後の推しセット */}
      <DiagnosisProductMatch skinType={type as SkinType} variant="compact" />

      {/* 五角形レーダーチャート */}
      <section className="px-5 pb-12">
        <SectionLabel en="Skin Profile" jp="あなたの肌マップ" />
        <div
          className="mx-auto mt-2 px-5 py-8"
          style={{
            background: '#fff',
            border: '1px solid var(--line-soft)',
            maxWidth: 460,
          }}
        >
          <SkinRadarChart values={radarValues} themeColor="oklch(0.58 0.095 75)" size={260} />
          <p
            className="mx-auto mt-6 text-center"
            style={{
              fontFamily: 'var(--font-jp-alt)',
              fontWeight: 400,
              fontSize: 11.5,
              lineHeight: 1.9,
              letterSpacing: '0.06em',
              color: 'var(--ink-mute)',
              maxWidth: '32ch',
            }}
          >
            5軸で見たあなたの肌の傾向。低い軸が、優先的にケアしたいポイントです。
          </p>
        </div>
      </section>

      {/* ゆんコメント */}
      <section className="px-5 pb-10">
        <div
          className="mx-auto px-6 py-5"
          style={{
            background: 'oklch(0.985 0.012 80)',
            border: '1px solid var(--line-soft)',
            maxWidth: 460,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 11,
              letterSpacing: '0.32em',
              color: 'var(--gold-deep)',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            A Note from Yun
          </p>
          <p
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: 13,
              lineHeight: 2,
              letterSpacing: '0.08em',
              color: 'var(--ink)',
            }}
          >
            {result.yunComment}
          </p>
        </div>
      </section>

      {/* 今日からできる Tips */}
      <section className="px-5 pb-12">
        <SectionLabel en="Today's Tips" jp="今日からできる3つのこと" />
        <div className="space-y-3 max-w-md mx-auto">
          {tips.map((t, i) => (
            <div
              key={i}
              className="px-5 py-4"
              style={{ background: '#fff', border: '1px solid var(--line-soft)' }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: 18,
                    color: 'var(--gold-deep)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-jp)',
                    fontWeight: 500,
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    letterSpacing: '0.08em',
                    color: 'var(--ink)',
                  }}
                >
                  {t.tip}
                </p>
              </div>
              <p
                className="pl-7"
                style={{
                  fontFamily: 'var(--font-jp-alt)',
                  fontWeight: 400,
                  fontSize: 11.5,
                  lineHeight: 1.8,
                  letterSpacing: '0.06em',
                  color: 'var(--ink-mute)',
                }}
              >
                {t.why}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* おすすめ成分（最初の2つだけに絞る）*/}
      <section className="px-5 pb-12">
        <SectionLabel en="Recommended Ingredients" jp="まず取り入れたい成分" />
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {result.recommendedIngredients.slice(0, 2).map((ing) => {
            const info = INGREDIENT_INFO[ing]
            return (
              <article
                key={ing}
                className="px-4 py-4"
                style={{
                  background: '#fff',
                  border: '1px solid var(--line-soft)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-jp)',
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: '0.1em',
                    color: 'var(--ink)',
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {ing}
                </p>
                {info && (
                  <>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        fontWeight: 300,
                        fontSize: 9.5,
                        letterSpacing: '0.18em',
                        color: 'var(--gold-deep)',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      What
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-jp-alt)',
                        fontSize: 11,
                        lineHeight: 1.65,
                        letterSpacing: '0.04em',
                        color: 'var(--ink-soft)',
                        marginBottom: 8,
                      }}
                    >
                      {info.what}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        fontWeight: 300,
                        fontSize: 9.5,
                        letterSpacing: '0.18em',
                        color: 'var(--gold-deep)',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      Why
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-jp-alt)',
                        fontSize: 11,
                        lineHeight: 1.65,
                        letterSpacing: '0.04em',
                        color: 'var(--ink-soft)',
                      }}
                    >
                      {info.effect}
                    </p>
                  </>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* 特徴 */}
      <section className="px-5 pb-12">
        <SectionLabel en="Your Skin Traits" jp="あなたの肌の特徴" />
        <ul className="space-y-2 max-w-md mx-auto">
          {result.features.map((feature, i) => (
            <li
              key={i}
              className="px-4 py-3"
              style={{
                background: '#fff',
                fontFamily: 'var(--font-jp-alt)',
                fontWeight: 400,
                fontSize: 12.5,
                lineHeight: 1.7,
                letterSpacing: '0.06em',
                color: 'var(--ink-soft)',
                borderLeft: '2px solid var(--gold)',
              }}
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* NGケア */}
      <section className="px-5 pb-12">
        <SectionLabel en="Avoid This" jp="避けたいNGケア" />
        <ul className="space-y-2 max-w-md mx-auto">
          {result.ngList.map((ng, i) => (
            <li
              key={i}
              className="px-4 py-3"
              style={{
                background: '#fff',
                fontFamily: 'var(--font-jp-alt)',
                fontWeight: 400,
                fontSize: 12.5,
                lineHeight: 1.7,
                letterSpacing: '0.06em',
                color: 'var(--ink-soft)',
                border: '1px solid var(--line-soft)',
              }}
            >
              <span style={{ color: 'var(--gold-deep)', marginRight: 8 }}>×</span>
              {ng}
            </li>
          ))}
        </ul>
      </section>

      {/* Product Match — あなた専用ピックアップ */}
      <DiagnosisProductMatch skinType={type as SkinType} />

      {/* 全商品ラインナップへの導線 */}
      <section className="px-5 pb-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-7 py-3 transition-opacity hover:opacity-70"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.24em',
            color: 'var(--ink)',
            border: '1px solid var(--ink)',
            background: 'transparent',
          }}
        >
          全商品ラインナップを見る →
        </Link>
      </section>

      {/* シェア & アクション */}
      <section className="px-5 pb-10 text-center">
        <SectionLabel en="Share Your Result" jp="結果をシェア" />
        <div
          className="mx-auto px-5 py-5 mb-6"
          style={{
            background: '#fff',
            border: '1px solid var(--line-soft)',
            maxWidth: 460,
          }}
        >
          <ShareButtons resultName={result.name} type={type} />
        </div>

        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <Link
            href="/diagnosis/quiz"
            className="inline-flex items-center justify-center gap-3 px-9 py-3.5 transition-all hover:bg-[var(--gold)] hover:text-white"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: 13,
              letterSpacing: '0.32em',
              border: '1px solid var(--gold)',
              color: 'var(--ink)',
              background: '#fff',
            }}
          >
            診断をやり直す
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 px-9 py-3.5 transition-opacity hover:opacity-70"
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
              fontSize: 11,
              letterSpacing: '0.32em',
              color: 'var(--ink-mute)',
              textTransform: 'uppercase',
            }}
          >
            ← Back to Products
          </Link>
        </div>
      </section>

      {/* 免責事項 */}
      <section className="px-5 pb-8">
        <div
          className="mx-auto px-5 py-4 text-center"
          style={{
            background: 'oklch(0.985 0.012 80)',
            border: '1px solid var(--line-soft)',
            maxWidth: 460,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-jp-alt)',
              fontWeight: 400,
              fontSize: 10.5,
              lineHeight: 1.85,
              letterSpacing: '0.04em',
              color: 'var(--ink-mute)',
            }}
          >
            ※本診断は医療的な診断ではなく、セルフケアの参考情報です。
            <br />
            肌の症状が長く続く・悪化する場合は皮膚科専門医にご相談ください。
            <br />
            記載の成分情報は医薬品的な効能効果を保証するものではありません。
          </p>
        </div>
      </section>

      {/* Footer Instagram */}
      <footer
        className="px-5 py-12 text-center"
        style={{ borderTop: '1px solid var(--line-soft)' }}
      >
        <p
          className="mb-3"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontSize: 11.5,
            lineHeight: 1.9,
            letterSpacing: '0.06em',
            color: 'var(--ink-soft)',
          }}
        >
          最新の編集情報は Instagram で配信中
        </p>
        <a
          href="https://www.instagram.com/yun.skincare_"
          target="_blank"
          rel="me noopener noreferrer"
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.32em',
            color: 'var(--ink-soft)',
            textTransform: 'lowercase',
          }}
          className="hover:opacity-70 transition-opacity"
        >
          @yun.skincare_
        </a>
      </footer>
    </div>
  )
}

// ========== セクション見出し（共通エディトリアル）==========
function SectionLabel({ en, jp }: { en: string; jp: string }) {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 12,
          letterSpacing: '0.42em',
          color: 'var(--gold-deep)',
          textTransform: 'uppercase',
        }}
      >
        {en}
      </span>
      <span
        className="block"
        style={{ width: 1, height: 28, background: 'var(--gold)' }}
        aria-hidden
      />
      <span
        style={{
          fontFamily: 'var(--font-jp)',
          fontSize: 12,
          letterSpacing: '0.4em',
          color: 'var(--ink-soft)',
        }}
      >
        {jp}
      </span>
    </div>
  )
}
