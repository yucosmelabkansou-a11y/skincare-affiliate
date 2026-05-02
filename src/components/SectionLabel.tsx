// 共通エディトリアルラベル（en+rule+jp）
// HTMLモックの .section-label を再現

export default function SectionLabel({ en, jp }: { en: string; jp: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 mb-12">
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: '13px',
          letterSpacing: '0.42em',
          color: 'var(--gold-deep)',
          textTransform: 'uppercase',
        }}
      >
        {en}
      </span>
      <span
        className="block"
        style={{ width: 1, height: 36, background: 'var(--gold)' }}
        aria-hidden
      />
      <span
        style={{
          fontFamily: 'var(--font-jp)',
          fontSize: '12px',
          letterSpacing: '0.4em',
          color: 'var(--ink-soft)',
        }}
      >
        {jp}
      </span>
    </div>
  )
}
