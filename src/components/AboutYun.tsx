// About Yun — 3ピラー（信頼の証）
// HTMLモックの「About Yun / ゆんについて」セクションを移植

import SectionLabel from './SectionLabel'

export default function AboutYun() {
  return (
    <section
      id="about"
      className="about-section"
      style={{ background: 'var(--bg-cream)' }}
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className="sr-only">
        ゆんについて
      </h2>
      <SectionLabel en="About Yun" jp="ゆんについて" />

      {/* statement copy */}
      <p
        className="mx-auto text-center mb-12"
        style={{
          fontFamily: 'var(--font-jp)',
          fontWeight: 500,
          fontSize: 'clamp(15px, 4vw, 18px)',
          lineHeight: 2,
          letterSpacing: '0.04em',
          color: 'var(--ink)',
          maxWidth: '24ch',
        }}
      >
        SNSや流行の成分に左右されず、
        <br />
        自分の肌に合うものだけを。
      </p>

      <p
        className="mx-auto text-center mb-12"
        style={{
          fontFamily: 'var(--font-jp-alt)',
          fontWeight: 400,
          fontSize: 13,
          lineHeight: 2.2,
          letterSpacing: '0.04em',
          color: 'var(--ink-soft)',
          maxWidth: '32ch',
        }}
      >
        29年間、毎日ノーファンデ。
        <br />
        元化粧品研究・商品企画として培った知見から、
        <br />
        処方設計や使い心地、価格まで見ながら、
        <br />
        スキンケア選びのポイントをお伝えします。
        <br />
        現在は化粧品の企画開発を支援する会社を経営しています。
      </p>

      {/* 3 pillars */}
      <div
        className="grid grid-cols-3 max-w-md mx-auto"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <Pillar
          title={<>元化粧品研究<br />商品企画</>}
          en="Formulation"
          icon={<FlaskIcon />}
          rightBorder
        />
        <Pillar
          title={<>29年間、<br />毎日ノーファンデ</>}
          en="Bare Skin"
          icon={<MirrorIcon />}
          rightBorder
        />
        <Pillar
          title={<>Instagram<br />6万人超え</>}
          en="@yun.skincare_"
          icon={<MirrorIcon />}
        />
      </div>
    </section>
  )
}

function Pillar({
  title,
  en,
  icon,
  rightBorder = false,
}: {
  title: React.ReactNode
  en: string
  icon: React.ReactNode
  rightBorder?: boolean
}) {
  return (
    <article
      className="flex flex-col items-center text-center px-2 py-6"
      style={rightBorder ? { borderRight: '1px solid var(--line)' } : undefined}
    >
      <span
        className="flex items-center justify-center mb-4"
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          border: '1px solid var(--gold)',
          color: 'var(--gold-deep)',
          background:
            'var(--bg-warm)',
        }}
        aria-hidden
      >
        {icon}
      </span>
      <p
        style={{
          fontFamily: 'var(--font-jp)',
          fontWeight: 500,
          fontSize: 13,
          lineHeight: 1.6,
          letterSpacing: '0.04em',
          color: 'var(--ink)',
          marginBottom: 6,
          wordBreak: 'keep-all',
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: 13,
          letterSpacing: '0.04em',
          color: 'var(--gold-deep)',
        }}
      >
        {en}
      </p>
    </article>
  )
}

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function FlaskIcon() {
  return (
    <svg {...iconProps}>
      <path d="M9 3h6" />
      <path d="M10 3v5l-5.5 10.2A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.8-2.8L14 8V3" />
      <path d="M7.5 14h9" />
    </svg>
  )
}

function MirrorIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 14.5V22" />
      <path d="M9 19h6" />
    </svg>
  )
}
