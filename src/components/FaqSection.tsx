// FAQ — 5問 + FAQPage JSON-LD
// HTMLモックの FAQ セクションを移植

import SectionLabel from './SectionLabel'

const FAQ_DATA = [
  {
    q: 'どんな基準でアイテムを選んでいますか？',
    a: '流行や話題性ではなく、「処方の意図が明確か」「使い続けられる価格と量か」「肌が静かに整うか」の3点を必ず通します。元化粧品研究・商品企画としての視点と、生涯ノーファンデ歴29年で磨いた素肌感覚の両方で確かめ、本当に使ってよかった200近いアイテムだけを厳選しています。',
  },
  {
    q: '掲載商品は購入できますか？',
    a: '各アイテムには Amazon・楽天市場へのリンクを用意しています。リンク経由でご購入いただいた場合、yun.skincare_ に紹介料が支払われることがありますが、価格は通常購入と変わりません。韓国コスメやデパコスなど一部商品は、ブランド公式サイトからの購入を推奨しています。',
  },
  {
    q: '肌悩みからおすすめを知りたいときは？',
    a: 'カテゴリーや肌悩みでフィルターできる検索機能を用意しています。プチプラ・デパコス・韓国コスメ問わず、お悩み別にスキンケア・ベースメイクをご提案します。今後リリース予定の「肌診断」では、簡単な質問から自動で提案します。',
  },
  {
    q: 'ノーファンデを続けるコツはありますか？',
    a: '鍵は保湿とUVの2つだけ。素肌で過ごすほど、日中の乾燥と紫外線が肌の表情を決めます。朝は導入美容液→保湿→トーンアップUV、夜はクリームでしっかり閉じ込める。Journal でも詳しく綴っています。',
  },
  {
    q: '更新やお知らせはどこで受け取れますか？',
    a: '最新の編集情報は Instagram @yun.skincare_ にてフォロワー6万人と一緒に配信中です。新しいアイテムの追加や、肌悩み別の特集はこちらから先行してお届けしています。',
  },
] as const

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_DATA.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="px-5 py-20"
      style={{
        background:
          'linear-gradient(180deg, var(--bg-ivory), var(--bg-cream))',
        borderTop: '1px solid var(--line-soft)',
      }}
      aria-labelledby="faq-heading"
    >
      <h2 id="faq-heading" className="sr-only">
        よくあるご質問
      </h2>
      <SectionLabel en="FAQ" jp="よくあるご質問" />

      <div
        className="max-w-md mx-auto"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        {FAQ_DATA.map((f, i) => (
          <details
            key={i}
            className="group"
            style={{ borderBottom: '1px solid var(--line)' }}
            open={i === 0}
          >
            <summary
              className="flex items-start justify-between gap-4 cursor-pointer py-6 list-none"
              style={{
                fontFamily: 'var(--font-jp)',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: 1.7,
                letterSpacing: '0.1em',
                color: 'var(--ink)',
              }}
            >
              <span>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: '13px',
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
              className="pb-6 pl-7 pr-2"
              style={{
                fontFamily: 'var(--font-jp-alt)',
                fontWeight: 400,
                fontSize: '12.5px',
                lineHeight: 2.1,
                letterSpacing: '0.08em',
                color: 'var(--ink-soft)',
              }}
            >
              {f.a}
            </div>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  )
}
