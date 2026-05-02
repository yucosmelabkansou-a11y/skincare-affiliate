// About Yun — 3ピラー（信頼の証）
// HTMLモックの「About Yun / ゆんについて」セクションを移植

import SectionLabel from './SectionLabel'

export default function AboutYun() {
  return (
    <section
      id="about"
      className="px-5 py-20"
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
          letterSpacing: '0.16em',
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
          fontSize: '12.5px',
          lineHeight: 2.2,
          letterSpacing: '0.1em',
          color: 'var(--ink-soft)',
          maxWidth: '32ch',
        }}
      >
        生涯ノーファンデ歴29年で磨いた素肌の感覚と、
        <br />
        元化粧品研究・商品企画として培った知見から、
        <br />
        本当に使ってよかった200近いアイテムから、
        <br />
        あなたに合ったものをお届けします。
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
          title={<>生涯<br />ノーファンデ29年</>}
          en="Bare Skin"
          icon={<MirrorIcon />}
          rightBorder
        />
        <Pillar
          title={<>Instagram<br />5.7万人</>}
          en="@yun.skincare_"
          icon={<SparkleIcon />}
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
          borderRadius: '50%',
          border: '1px solid var(--gold)',
          color: 'var(--gold-deep)',
          background:
            'radial-gradient(circle at 30% 25%, oklch(0.99 0.008 80), oklch(0.96 0.025 80))',
        }}
        aria-hidden
      >
        {icon}
      </span>
      <p
        style={{
          fontFamily: 'var(--font-jp)',
          fontWeight: 500,
          fontSize: '11px',
          lineHeight: 1.6,
          letterSpacing: '0.12em',
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
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '10px',
          letterSpacing: '0.18em',
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

function SparkleIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3v6" />
      <path d="M12 15v6" />
      <path d="M3 12h6" />
      <path d="M15 12h6" />
      <path d="M5.5 5.5l3 3" />
      <path d="M15.5 15.5l3 3" />
      <path d="M18.5 5.5l-3 3" />
      <path d="M8.5 15.5l-3 3" />
    </svg>
  )
}
