// 五角形レーダーチャート（水分／油分／バリア／ハリ／バランス）
// 受け取る values は 0-100 の5つの数値

type Props = {
  values: [number, number, number, number, number]
  themeColor?: string
  size?: number
}

const AXIS_LABELS_JP = ['水分量', '油分量', 'バリア機能', 'ハリ・弾力', 'バランス'] as const
const AXIS_LABELS_EN = ['Hydration', 'Sebum', 'Barrier', 'Firmness', 'Balance'] as const

export default function SkinRadarChart({
  values,
  themeColor,
  size = 280,
}: Props) {
  const goldDeep = 'oklch(0.58 0.095 75)'
  const gold = themeColor || 'oklch(0.72 0.085 80)'
  const lineSoft = 'oklch(0.86 0.020 75)'
  const inkSoft = 'oklch(0.42 0.015 70)'
  const goldDeepText = themeColor || goldDeep

  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.32

  // 5頂点の角度（上から時計回り、12時方向 = -90°）
  const angle = (i: number) => (-Math.PI / 2) + (i * 2 * Math.PI / 5)

  // 各レベル（0%, 25%, 50%, 75%, 100%）の五角形パスを生成
  const polygonPath = (ratio: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const a = angle(i)
      const x = cx + Math.cos(a) * radius * ratio
      const y = cy + Math.sin(a) * radius * ratio
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    }).join(' ') + ' Z'
  }

  // 値に応じた塗りつぶし五角形
  const valuePath = Array.from({ length: 5 }, (_, i) => {
    const a = angle(i)
    const r = radius * Math.max(0, Math.min(100, values[i])) / 100
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ') + ' Z'

  // 軸の終点（ラベル位置）
  const axisEnd = (i: number) => {
    const a = angle(i)
    return {
      x: cx + Math.cos(a) * radius,
      y: cy + Math.sin(a) * radius,
      labelX: cx + Math.cos(a) * (radius + 24),
      labelY: cy + Math.sin(a) * (radius + 24),
    }
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="肌状態の五角形レーダーチャート"
        style={{ overflow: 'visible' }}
      >
        {/* 背景の同心五角形（4段階） */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <path
            key={r}
            d={polygonPath(r)}
            fill="none"
            stroke={lineSoft}
            strokeWidth={0.6}
          />
        ))}

        {/* 軸ライン */}
        {Array.from({ length: 5 }, (_, i) => {
          const e = axisEnd(i)
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={e.x}
              y2={e.y}
              stroke={lineSoft}
              strokeWidth={0.6}
            />
          )
        })}

        {/* 値の塗りつぶし */}
        <path
          d={valuePath}
          fill={gold}
          fillOpacity={0.18}
          stroke={goldDeepText}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />

        {/* 値の頂点 */}
        {Array.from({ length: 5 }, (_, i) => {
          const a = angle(i)
          const r = radius * Math.max(0, Math.min(100, values[i])) / 100
          const x = cx + Math.cos(a) * r
          const y = cy + Math.sin(a) * r
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={2.5}
              fill={goldDeepText}
            />
          )
        })}

        {/* 軸ラベル（日本語） */}
        {AXIS_LABELS_JP.map((label, i) => {
          const e = axisEnd(i)
          // 5方向に応じたテキストアラインメント
          let anchor: 'start' | 'middle' | 'end' = 'middle'
          if (i === 0) anchor = 'middle'      // 上
          else if (i === 1 || i === 2) anchor = 'start'  // 右
          else if (i === 3 || i === 4) anchor = 'end'    // 左
          const dy = i === 0 ? -4 : i === 1 || i === 4 ? 0 : 14
          return (
            <text
              key={`label-jp-${i}`}
              x={e.labelX}
              y={e.labelY + dy}
              textAnchor={anchor}
              style={{
                fontFamily: 'var(--font-jp)',
                fontWeight: 500,
                fontSize: 11,
                letterSpacing: '0.08em',
                fill: inkSoft,
              }}
            >
              {label}
            </text>
          )
        })}
      </svg>

      {/* 凡例（小さく英文） */}
      <div
        className="mt-3 grid grid-cols-5 gap-2 text-center"
        style={{ width: '100%', maxWidth: 360 }}
      >
        {AXIS_LABELS_EN.map((en, i) => (
          <div key={en} className="flex flex-col items-center">
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 9,
                letterSpacing: '0.16em',
                color: goldDeepText,
                textTransform: 'uppercase',
              }}
            >
              {en}
            </span>
            <span
              className="mt-0.5"
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontSize: 13,
                color: inkSoft,
              }}
            >
              {Math.round(values[i])}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ========== 肌タイプ別の典型値（quiz未経由・SSG用デフォルト） ==========
export const TYPICAL_VALUES_BY_TYPE: Record<
  string,
  [number, number, number, number, number]
> = {
  // 順序: [水分, 油分, バリア, ハリ, バランス]
  dry:         [25, 30, 60, 55, 50],
  oily:        [55, 85, 60, 65, 45],
  combination: [55, 65, 65, 60, 40],
  sensitive:   [50, 50, 30, 55, 45],
  aging:       [45, 40, 55, 30, 55],
  normal:      [75, 60, 75, 70, 80],
}
