'use client'

import Link from 'next/link'
import { useRef } from 'react'

const links = [
  ['/diagnosis', '肌診断'],
  ['/#products', '商品を探す'],
  ['/#guide-ranking-heading', '肌悩みから探す'],
  ['/column', 'コラム'],
  ['/qa', 'Q&A'],
] as const

export default function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null)
  return (
    <>
      <a className="skip-link" href="#page-content">本文へ進む</a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="site-logo" href="/" aria-label="yun.skincare_ ホーム">yun.skincare_</Link>
          <nav className="desktop-nav" aria-label="メインナビゲーション">
            {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <Link className="header-cta" href="/diagnosis">肌診断を受ける <span aria-hidden>→</span></Link>
          <details className="mobile-menu" ref={menu} onKeyDown={(event) => {
            if (event.key === 'Escape' && menu.current) {
              menu.current.open = false
              menu.current.querySelector('summary')?.focus()
            }
          }}>
            <summary aria-label="メニュー"><span /><span /><span /></summary>
            <nav aria-label="モバイルナビゲーション">
              {links.map(([href, label]) => <Link key={href} href={href} onClick={() => { if (menu.current) menu.current.open = false }}>{label}<span aria-hidden>→</span></Link>)}
            </nav>
          </details>
        </div>
      </header>
    </>
  )
}
