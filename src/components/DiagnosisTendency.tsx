import { type SecondaryTendency, type SkinType } from '@/lib/diagnosis'

const labels: Record<SkinType, string> = {
  dry: '乾燥肌', oily: '脂性肌', combination: '混合肌',
  sensitive: '敏感肌', aging: 'エイジングケア', normal: '普通肌',
}
const supplements: Record<SkinType, string> = {
  dry: '乾燥しやすい傾向もみられます。',
  oily: '皮脂が多い傾向もみられます。',
  combination: '部分的なテカリと乾燥が重なる傾向もみられます。',
  sensitive: '刺激を感じやすい傾向もみられます。',
  aging: 'ハリや年齢サインのケアを意識したい傾向もみられます。',
  normal: '肌が安定している傾向もみられます。',
}

export default function DiagnosisTendency({ primaryType, secondary }: {
  primaryType: SkinType; secondary?: SecondaryTendency
}) {
  if (!secondary) return null
  return (
    <aside aria-label="もう一つの肌の傾向" className="mt-5 mx-auto text-left"
      style={{ maxWidth: '32ch', borderTop: '1px solid var(--line-soft)', paddingTop: 16,
        fontSize: 13, lineHeight: 1.9, color: 'var(--ink-soft)' }}>
      <p style={{ fontWeight: 500, color: 'var(--ink)' }}>
        {secondary.tied
          ? `回答からは、${labels[primaryType]}と${labels[secondary.type]}の両方の傾向がみられます。`
          : `主な傾向は${labels[primaryType]}。${supplements[secondary.type]}`}
      </p>
      <p className="mt-2" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
        回答にもとづく目安です。以下のケア・商品は主な結果をもとにご紹介しています。
      </p>
    </aside>
  )
}
