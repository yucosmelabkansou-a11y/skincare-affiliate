import { ImageResponse } from 'next/og'

// サイト共通の OGP 画像（1200x630）をビルド時に生成する。
// 外部フォント取得に依存しないよう、ロゴ・コピーは Latin のみで構成（淡ピンク・ベージュ・ゴールドの世界観）。

export const alt =
  'yun.skincare_ — Skincare edit by a former cosmetics R&D insider'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fdf6f4 0%, #f7efe6 55%, #f3ece0 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 枠線 */}
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: '1px solid #d9c9a6',
            borderRadius: 8,
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 14,
            color: '#a8895b',
            textTransform: 'uppercase',
            marginBottom: 28,
          }}
        >
          Skincare Edit
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 84,
            fontWeight: 700,
            color: '#3a322c',
            letterSpacing: 2,
          }}
        >
          yun.skincare_
        </div>

        <div
          style={{
            width: 64,
            height: 2,
            background: '#c9a86a',
            margin: '34px 0',
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#6b6157',
            letterSpacing: 4,
          }}
        >
          Curated by a former cosmetics R&amp;D insider
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#8a7f73',
            letterSpacing: 3,
            marginTop: 16,
          }}
        >
          Skin Diagnosis · Reviews · Columns
        </div>
      </div>
    ),
    { ...size },
  )
}
