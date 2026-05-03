'use client'

import { useState } from 'react'
import { SITE_URL } from '@/lib/siteConfig'

type Props = {
  resultName: string
  type: string
}

const IG_HANDLE = 'yun.skincare_'

export default function ShareButtons({ resultName, type }: Props) {
  const [copied, setCopied] = useState(false)
  const [igFlow, setIgFlow] = useState<'idle' | 'copied'>('idle')

  const shareText = `私の肌タイプは「${resultName}」でした🌸\n\n元化粧品研究・商品企画監修の肌診断、2分でわかるよ！\nあなたもチェックしてみて↓\n\n#yun_skincare肌診断`
  const shareWithUrl = `${shareText}\n${SITE_URL}/diagnosis`

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SITE_URL + '/diagnosis')}`
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(SITE_URL + '/diagnosis')}&text=${encodeURIComponent(shareText)}`
  // Instagram プロフィール（ユーザーがそのままDM導線へ遷移可）
  const igDmUrl = `https://www.instagram.com/${IG_HANDLE}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareWithUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('コピーに失敗しました')
    }
  }

  // Instagram DM フロー: シェア文を自動コピー → DMページを新規タブで開く
  const handleIgDm = async () => {
    const igText = `ゆんさん、肌診断やってみました！\n\n私のタイプは「${resultName}」でした🌸\n\n結果ページはここ👇\n${SITE_URL}/diagnosis/result/${type}`
    try {
      await navigator.clipboard.writeText(igText)
      setIgFlow('copied')
      setTimeout(() => setIgFlow('idle'), 4000)
    } catch {
      // コピー失敗してもDMは開く
    }
    window.open(igDmUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <div className="flex justify-center gap-3 flex-wrap">
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 px-4 py-2 bg-black text-white rounded-xl text-xs font-medium active:scale-95 transition-all"
          aria-label="Xでシェア"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X</span>
        </a>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 px-4 py-2 bg-[#06C755] text-white rounded-xl text-xs font-medium active:scale-95 transition-all"
          aria-label="LINEでシェア"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          <span>LINE</span>
        </a>
        <button
          onClick={handleIgDm}
          className="flex flex-col items-center gap-1 px-4 py-2 text-white rounded-xl text-xs font-medium active:scale-95 transition-all"
          aria-label="ゆんにInstagram DMで結果を送る"
          style={{
            background:
              'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span>ゆんにDM</span>
        </button>
        <button
          onClick={handleCopy}
          className="flex flex-col items-center gap-1 px-4 py-2 bg-[#4DB6AC] text-white rounded-xl text-xs font-medium active:scale-95 transition-all"
          aria-label="URLをコピー"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>コピー済</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>コピー</span>
            </>
          )}
        </button>
      </div>

      {/* Instagram DM フロー説明 */}
      {igFlow === 'copied' && (
        <p
          className="mt-4 text-center"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontSize: 11.5,
            lineHeight: 1.7,
            letterSpacing: '0.06em',
            color: 'var(--gold-deep)',
          }}
        >
          ✓ メッセージをコピーしました。<br />
          開いたDM画面に貼り付けて送信してください 💌
        </p>
      )}
      {igFlow === 'idle' && (
        <p
          className="mt-3 text-center"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontSize: 10.5,
            lineHeight: 1.7,
            letterSpacing: '0.04em',
            color: 'var(--ink-mute)',
          }}
        >
          ※「ゆんにDM」ボタンで、結果メッセージが自動コピーされ、Instagram DMが開きます
        </p>
      )}
    </div>
  )
}
