// Journal セクション — note 埋め込み5本
// HTMLモックの読み物セクションを移植

'use client'

import { useEffect } from 'react'
import SectionLabel from './SectionLabel'

const NOTE_IDS = [
  'na114e9184523',
  'n84209150ad4d',
  'ne654c25fcb5f',
  'n7e5a31721ae8',
  'nbea55adb231a',
] as const

export default function JournalNote() {
  // note の埋め込みスクリプト読込（クライアントのみ）
  useEffect(() => {
    if (document.getElementById('note-embed-script')) return
    const s = document.createElement('script')
    s.id = 'note-embed-script'
    s.src = 'https://note.com/scripts/embed.js'
    s.async = true
    s.charset = 'utf-8'
    document.body.appendChild(s)
  }, [])

  return (
    <section
      id="journal"
      className="px-5 py-20"
      style={{
        background: 'var(--bg-cream)',
        borderTop: '1px solid var(--line-soft)',
      }}
      aria-labelledby="journal-heading"
    >
      <h2 id="journal-heading" className="sr-only">
        読み物
      </h2>
      <SectionLabel en="Journal · note" jp="読み物" />

      <div className="flex flex-col gap-5 max-w-md mx-auto">
        {NOTE_IDS.map((id, i) => (
          <iframe
            key={id}
            className="note-embed"
            src={`https://note.com/embed/notes/${id}`}
            loading="lazy"
            title={`ゆんのnote記事 ${i + 1}`}
            style={{
              border: 0,
              display: 'block',
              width: '100%',
              maxWidth: 494,
              height: 380,
              margin: '0 auto',
              background: '#fff',
              boxShadow: '0 12px 32px -24px oklch(0.45 0.06 70 / .35)',
            }}
          />
        ))}
      </div>
    </section>
  )
}
