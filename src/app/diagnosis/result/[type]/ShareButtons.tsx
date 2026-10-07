'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { sendGAEvent } from '@next/third-parties/google'
import { INSTAGRAM_HANDLE } from '@/lib/siteConfig'
import styles from './ShareButtons.module.css'

type Props = {
  resultName: string
  summary: string
  type: string
  diagnosis?: 'skin' | 'pore'
  secondaryResult?: string
}

const IG_USERNAME = INSTAGRAM_HANDLE.replace(/^@/, '')
const IG_DM_URL = `https://ig.me/m/${IG_USERNAME}`
const IG_APP_URL = `instagram://user?username=${IG_USERNAME}`

function openInstagram(onFinished: () => void) {
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    || (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  if (!mobile) {
    onFinished()
    window.location.assign(IG_DM_URL)
    return () => {}
  }

  let finished = false
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null
  const clearFallback = () => {
    if (fallbackTimer !== null) clearTimeout(fallbackTimer)
    fallbackTimer = null
  }
  const stop = () => {
    if (finished) return
    finished = true
    clearFallback()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('pagehide', stop)
    window.removeEventListener('blur', clearFallback)
    window.removeEventListener('focus', armFallback)
    onFinished()
  }
  const fallback = () => {
    if (finished) return
    const wasHidden = document.hidden
    stop()
    if (!wasHidden) window.location.assign(IG_DM_URL)
  }
  const onVisibilityChange = () => {
    // Latch this transition: returning from the app must never re-arm fallback.
    if (document.hidden) stop()
  }
  const armFallback = () => {
    if (finished) return
    if (document.hidden) { stop(); return }
    clearFallback()
    fallbackTimer = setTimeout(fallback, 2000)
  }
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('pagehide', stop)
  // Pause while the OS app-opening prompt has focus.
  window.addEventListener('blur', clearFallback)
  window.addEventListener('focus', armFallback)
  armFallback()
  try {
    window.location.assign(IG_APP_URL)
  } catch {
    fallback()
  }
  return stop
}

export default function ShareButtons({ resultName, type, diagnosis = 'skin' }: Props) {
  const headingId = useId()
  const helpId = useId()
  const fallbackId = useId()
  const [status, setStatus] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)
  const busy = useRef(false)
  const navigationCleanup = useRef<(() => void) | null>(null)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      navigationCleanup.current?.()
    }
  }, [])

  const launchInstagram = () => {
    navigationCleanup.current?.()
    busy.current = true
    navigationCleanup.current = openInstagram(() => { busy.current = false })
  }

  const resultText = [
    diagnosis === 'pore' ? '【毛穴診断結果】' : '【肌診断結果】',
    `${resultName.replace(/(?:タイプ|方へ)$/, '')}タイプでした。`,
    'この結果について相談したいです。',
  ].join('\n')

  const copyResult = async (method: 'copy' | 'instagram_dm') => {
    if (busy.current) return
    busy.current = true
    setStatus('')
    setCopyFailed(false)
    try {
      await navigator.clipboard.writeText(resultText)
    } catch {
      setCopyFailed(true)
      setStatus('結果をコピーできませんでした。下の文章を選択してコピーし、「Instagramで結果を送る」をもう一度押してください。')
      busy.current = false
      return
    }
    if (!mounted.current) return

    flushSync(() => setStatus(method === 'instagram_dm'
      ? '結果をコピーしました。Instagramで「メッセージ」をタップして貼り付けてください'
      : '結果をコピーしました。'))
    if (method === 'instagram_dm') {
      launchInstagram()
    } else {
      busy.current = false
    }
    sendGAEvent('event', 'result_share', { method, skin_type: type })
  }

  return (
    <div className={styles.consultation} role="group" aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.heading}>診断結果について相談する</h2>
      <p id={helpId} className={styles.help}>
        結果をコピーしてInstagramを開きます。<br />
        「メッセージ」をタップして貼り付けてください。
      </p>
      <div className={styles.actions}>
        <a
          href={IG_DM_URL}
          rel="noopener noreferrer"
          aria-describedby={helpId}
          className={styles.primary}
          onClick={(event) => {
            event.preventDefault()
            if (copyFailed) {
              if (!busy.current) launchInstagram()
              return
            }
            void copyResult('instagram_dm')
          }}
        >
          Instagramで結果を送る
        </a>
        <button type="button" className={styles.secondary} onClick={() => { void copyResult('copy') }}>
          結果をコピー
        </button>
      </div>
      <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">{status}</p>
      {copyFailed && (
        <div className={styles.fallback}>
          <label htmlFor={fallbackId}>コピーする診断結果</label>
          <textarea id={fallbackId} readOnly value={resultText} rows={6} onFocus={(event) => event.currentTarget.select()} />
        </div>
      )}
    </div>
  )
}
