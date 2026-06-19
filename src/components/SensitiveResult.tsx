// 敏感肌診断結果ページ専用レイアウト（/diagnosis/result/sensitive）
// クリック率改善のため、汎用レイアウトより導線を絞り込んだ構成にしている。
// 1.結果タイトル → 2.特徴を短く → 3.まず見直したい3つ → 4-6.ゆん厳選TOP3＋理由＋購入ボタン
// → 7.関連カテゴリ内部リンク → 8.Q&A3つ → 9.FAQ構造化データ
// スマホ閲覧最優先（縦積み・大きめタップ領域・max-w-md 中央寄せ）。

import Link from 'next/link'
import { resultTypes } from '@/lib/diagnosis'
import { SITE_URL } from '@/lib/siteConfig'
import DiagnosisProductMatch from './DiagnosisProductMatch'
import RelatedReads from './RelatedReads'
import SectionLabel from './SectionLabel'

const result = resultTypes.sensitive

// 3.「まず見直したい3つ」
const REVIEW_POINTS: { tag: string; title: string; body: string }[] = [
  {
    tag: '洗いすぎ',
    title: '落としすぎていませんか？',
    body: '洗顔は1日2回・ぬるま湯で十分。こすらず泡で包むように。洗いすぎはうるおいを奪い、ヒリつきや乾燥の引き金になりやすいです。',
  },
  {
    tag: '保湿不足',
    title: 'うるおいの“フタ”が足りていますか？',
    body: 'セラミドなどでうるおいを補い、上からやさしくフタを。角層がうるおいで満たされると、外的刺激を受けにくい肌印象に近づきます。',
  },
  {
    tag: '紫外線・摩擦',
    title: '日中の刺激から守れていますか？',
    body: '日中はやさしい処方のUVケアを。タオル・手・マスクの摩擦も最小限に。紫外線と摩擦は、ゆらぎがちな肌にとって意外と大きな負担です。',
  },
]

// 7. 関連カテゴリへの内部リンク（トップページのフィルターに deep link）
const RELATED_LINKS: { href: string; label: string; sub: string }[] = [
  { href: '/?cat=sunscreen', label: '敏感肌向け日焼け止め', sub: '紫外線対策はやさしい処方で' },
  { href: '/?cat=toner', label: 'セラミド化粧水', sub: 'うるおいでバリアをサポート' },
  { href: '/?cat=cleansing', label: '低刺激クレンジング', sub: 'こすらず・落としすぎない1本' },
]

// 8. 敏感肌向け Q&A（9. の FAQ 構造化データもこの内容から生成）
const FAQ: { q: string; a: string }[] = [
  {
    q: '敏感肌でも美白やエイジングケアはできますか？',
    a: 'できます。ただし一度に複数の機能性成分を足すよりも、まずは低刺激の保湿とUVで土台を整えるのが先決です。新しい美容液などを取り入れるときは1品ずつ、肌の様子を見ながら少量から始めると安心です。',
  },
  {
    q: '新しいスキンケアを試すときの注意点は？',
    a: '顔に使う前に、腕の内側などで2日ほどパッチテストをしておくと安心です。問題がなければ少量から顔へ。一度に何品も切り替えず1品ずつ試すと、もし合わなかったときに原因が分かりやすくなります。',
  },
  {
    q: '赤みやヒリつきが出たときはどうすればいい？',
    a: 'まずは使用を一旦お休みし、化粧水＋ワセリンなど最小限のケアに切り替えて様子を見ます。症状が長く続く・悪化する場合は自己判断せず、皮膚科専門医にご相談ください。',
  },
]

export default function SensitiveResult() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '肌診断', item: `${SITE_URL}/diagnosis` },
      { '@type': 'ListItem', position: 3, name: result.name, item: `${SITE_URL}/diagnosis/result/sensitive` },
    ],
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${result.name}とは？特徴と敏感肌向けおすすめスキンケア`,
    description: result.description,
    author: {
      '@type': 'Person',
      name: 'ゆん（yun.skincare_）',
      jobTitle: '元化粧品研究・商品企画',
      url: 'https://www.instagram.com/yun.skincare_',
    },
    publisher: { '@type': 'Organization', name: 'yun.skincare_', url: SITE_URL },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/diagnosis/result/sensitive`,
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen" style={{ background: 'var(--bg-cream)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

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

      {/* 1. 診断結果タイトル + 2. 特徴を短く説明 */}
      <section className="px-5 pt-8 pb-6 text-center">
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.32em',
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {result.tagEn}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 'clamp(22px, 6vw, 28px)',
            letterSpacing: '0.14em',
            color: 'var(--ink)',
            marginBottom: 14,
          }}
        >
          あなたは{result.name}
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

        <p
          className="mt-6 mx-auto text-left"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontWeight: 400,
            fontSize: 13.5,
            lineHeight: 2,
            letterSpacing: '0.06em',
            color: 'var(--ink-soft)',
            maxWidth: '32ch',
          }}
        >
          通常は気にならない刺激にも、ヒリヒリ・赤み・かゆみを感じやすい状態。
          鍵は「シンプル × 低刺激 × うるおいキープ」。足すより引くケアで、肌をやさしく守ります。
        </p>
      </section>

      {/* 3. まず見直したい3つ */}
      <section className="px-5 pt-4 pb-12">
        <SectionLabel en="Check First" jp="まず見直したい3つ" />
        <div className="space-y-3 max-w-md mx-auto">
          {REVIEW_POINTS.map((p, i) => (
            <div
              key={p.tag}
              className="px-5 py-4"
              style={{ background: '#fff', border: '1px solid var(--line-soft)', borderRadius: 4 }}
            >
              <div className="flex items-center gap-3 mb-2">
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
                <span
                  className="px-2.5 py-1"
                  style={{
                    fontFamily: 'var(--font-jp)',
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    color: '#fff',
                    background: 'var(--gold)',
                    borderRadius: 999,
                  }}
                >
                  {p.tag}
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-jp)',
                  fontWeight: 500,
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  letterSpacing: '0.06em',
                  color: 'var(--ink)',
                  marginBottom: 6,
                }}
              >
                {p.title}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-jp-alt)',
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: 1.85,
                  letterSpacing: '0.05em',
                  color: 'var(--ink-mute)',
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4-6. ゆん厳選 敏感肌向け TOP3（理由 + Amazon/楽天ボタン + PR表記を内包） */}
      <DiagnosisProductMatch
        skinType="sensitive"
        variant="top3"
        heading={{ en: "Yun's Pick", jp: 'ゆん厳選：敏感肌向けおすすめTOP3' }}
        lead={
          <>
            刺激になりにくい処方を軸に、
            <br />
            元化粧品研究・商品企画ゆんが敏感肌目線で選んだ3点
          </>
        }
      />

      {/* 7. 関連カテゴリへの内部リンク */}
      <section className="px-5 pb-12">
        <SectionLabel en="Browse More" jp="あわせて見たいカテゴリ" />
        <div className="space-y-3 max-w-md mx-auto">
          {RELATED_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-5 py-4 transition-opacity hover:opacity-80 active:opacity-70"
              style={{
                background: '#fff',
                border: '1px solid var(--line-soft)',
                borderLeft: '2px solid var(--gold)',
                borderRadius: 4,
                textDecoration: 'none',
                minHeight: 64,
              }}
            >
              <div className="flex-1">
                <p
                  style={{
                    fontFamily: 'var(--font-jp)',
                    fontWeight: 600,
                    fontSize: 13.5,
                    letterSpacing: '0.06em',
                    color: 'var(--ink)',
                    marginBottom: 3,
                  }}
                >
                  {l.label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-jp-alt)',
                    fontWeight: 400,
                    fontSize: 11.5,
                    letterSpacing: '0.04em',
                    color: 'var(--ink-mute)',
                  }}
                >
                  {l.sub}
                </p>
              </div>
              <span style={{ color: 'var(--gold)', fontSize: 18, flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. Q&A 3つ（9. FAQ 構造化データは上部の faqJsonLd で付与） */}
      <section className="px-5 pb-12">
        <SectionLabel en="FAQ" jp="敏感肌のQ&A" />
        <div className="max-w-md mx-auto" style={{ borderTop: '1px solid var(--line-soft)' }}>
          {FAQ.map((f, i) => (
            <details
              key={i}
              className="group"
              style={{ borderBottom: '1px solid var(--line-soft)' }}
              open={i === 0}
            >
              <summary
                className="flex items-start justify-between gap-4 cursor-pointer py-5 list-none"
                style={{
                  fontFamily: 'var(--font-jp)',
                  fontWeight: 500,
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  letterSpacing: '0.08em',
                  color: 'var(--ink)',
                }}
              >
                <span>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontWeight: 300,
                      fontSize: 13,
                      color: 'var(--gold-deep)',
                      marginRight: 10,
                    }}
                  >
                    Q.
                  </span>
                  {f.q}
                </span>
                <span
                  className="shrink-0 transition-transform group-open:rotate-45"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 300,
                    fontSize: 22,
                    color: 'var(--gold-deep)',
                    marginTop: -2,
                  }}
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div
                className="pb-5 pl-7 pr-2"
                style={{
                  fontFamily: 'var(--font-jp-alt)',
                  fontWeight: 400,
                  fontSize: 12.5,
                  lineHeight: 2,
                  letterSpacing: '0.06em',
                  color: 'var(--ink-soft)',
                }}
              >
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 関連して読みたい（結果→関連記事の内部リンク） */}
      <RelatedReads tags={['敏感肌', 'セラミド', '保湿', 'バリア機能', '肌荒れ']} />

      {/* 診断やり直し導線 */}
      <section className="px-5 pb-10 text-center">
        <Link
          href="/diagnosis/quiz"
          className="inline-flex items-center justify-center gap-3 px-9 py-3.5 transition-all hover:bg-[var(--gold)] hover:text-white"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: '0.28em',
            border: '1px solid var(--gold)',
            color: 'var(--ink)',
            background: '#fff',
          }}
        >
          診断をやり直す
        </Link>
      </section>

      {/* 免責 */}
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
      <footer className="px-5 py-12 text-center" style={{ borderTop: '1px solid var(--line-soft)' }}>
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
