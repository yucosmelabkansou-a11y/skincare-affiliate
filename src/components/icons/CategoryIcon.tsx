// カテゴリー用のミニマル線SVGアイコン集
// 絵文字の量産型AIサイト感を排した、編集感のあるアイコン

import type { SVGProps } from 'react'

type IconName =
  // アイテム別
  | 'all'
  | 'toner'
  | 'emulsion'
  | 'cream'
  | 'serum'
  | 'sunscreen'
  | 'base'
  | 'facewash'
  | 'cleansing'
  // 悩み別
  | 'moisture'
  | 'pores'
  | 'aging'
  | 'brightening'
  | 'sensitive'

type Props = SVGProps<SVGSVGElement> & {
  name: IconName
  size?: number
}

export default function CategoryIcon({ name, size = 24, ...rest }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...rest,
  }

  switch (name) {
    // ✨ すべて：3つの星型（mini sparkle）
    case 'all':
      return (
        <svg {...common}>
          <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4" />
          <circle cx="12" cy="12" r="2.3" />
        </svg>
      )

    // 化粧水：背の高いシンプルなボトル
    case 'toner':
      return (
        <svg {...common}>
          <path d="M10 3h4v2.5l1 1.5v13a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 20V7l1-1.5z" />
          <path d="M10 10h4" />
        </svg>
      )

    // 乳液：ポンプ付きボトル
    case 'emulsion':
      return (
        <svg {...common}>
          <path d="M9 8h6v12a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 20z" />
          <path d="M11 3v2M11 5h2v3h-2z" />
          <path d="M13 5l2 1v1" />
        </svg>
      )

    // クリーム：ジャー（円筒）
    case 'cream':
      return (
        <svg {...common}>
          <rect x="5.5" y="9" width="13" height="11" rx="1.5" />
          <path d="M5.5 13h13" />
          <path d="M8 6.5h8v2.5H8z" />
        </svg>
      )

    // 美容液：スポイト付きボトル
    case 'serum':
      return (
        <svg {...common}>
          <path d="M10 10h4v10.5a1 1 0 01-1 1h-2a1 1 0 01-1-1z" />
          <path d="M9.5 8.5h5v1.5h-5z" />
          <path d="M12 3v5" />
          <path d="M11 3h2" />
        </svg>
      )

    // 日焼け止め：太陽（円＋光線）
    case 'sunscreen':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M17 7l1.4-1.4M5.6 18.4L7 17" />
        </svg>
      )

    // 化粧下地：チューブ（絞り口）
    case 'base':
      return (
        <svg {...common}>
          <path d="M7 6l2-1.5h6L17 6v13a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
          <path d="M9 4.5l1-1.5h4l1 1.5" />
          <path d="M11 10h2" />
        </svg>
      )

    // 洗顔：泡（円が重なる）
    case 'facewash':
      return (
        <svg {...common}>
          <circle cx="9.5" cy="14" r="4" />
          <circle cx="15.5" cy="10" r="3" />
          <circle cx="17" cy="16.5" r="2" />
        </svg>
      )

    // クレンジング：水滴＋波紋
    case 'cleansing':
      return (
        <svg {...common}>
          <path d="M12 3c-3 4.5-5 7-5 10a5 5 0 0010 0c0-3-2-5.5-5-10z" />
          <path d="M10 14c.5 1 1.5 1.5 2.5 1.5" />
        </svg>
      )

    // 乾燥・保湿：大きな水滴
    case 'moisture':
      return (
        <svg {...common}>
          <path d="M12 3c-4 6-6 9-6 12a6 6 0 1012 0c0-3-2-6-6-12z" />
        </svg>
      )

    // 毛穴・ニキビ：同心円（ズーム感）
    case 'pores':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6" />
          <path d="M15.5 15.5l4 4" />
          <circle cx="11" cy="11" r="1.5" />
        </svg>
      )

    // エイジング：葉（植物）
    case 'aging':
      return (
        <svg {...common}>
          <path d="M20 4c-9 0-15 6-15 13 0 1 .2 2 .5 3 1-.3 2-.5 3-.5 7 0 13-6 13-15z" />
          <path d="M5 20c3-6 7-10 13-13" />
        </svg>
      )

    // 美白・くすみ：ミニマルスパークル
    case 'brightening':
      return (
        <svg {...common}>
          <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
          <path d="M7 7l3 3M14 14l3 3M17 7l-3 3M10 14l-3 3" />
        </svg>
      )

    // 敏感肌：花びら（4弁）
    case 'sensitive':
      return (
        <svg {...common}>
          <path d="M12 3c2.5 2 3.5 4 3.5 6S14 12 12 12s-3.5-1-3.5-3S9.5 5 12 3z" />
          <path d="M21 12c-2 2.5-4 3.5-6 3.5s-3-1.5-3-3.5 1-3.5 3-3.5 4 1 6 3.5z" />
          <path d="M12 21c-2.5-2-3.5-4-3.5-6S10 12 12 12s3.5 1 3.5 3-1 4-3.5 6z" />
          <path d="M3 12c2-2.5 4-3.5 6-3.5s3 1.5 3 3.5-1 3.5-3 3.5-4-1-6-3.5z" />
        </svg>
      )

    default:
      return null
  }
}

export type { IconName }
