import Link from 'next/link'
import { INSTAGRAM_URL } from '@/lib/siteConfig'

export default function EditorialHero() {
  return (
    <section className="editorial-hero" aria-labelledby="home-heading">
      <div className="hero-copy">
        <p className="hero-byline">Skincare Edit by Yun</p>
        <h1 id="home-heading">自分の肌を知ることから、<br />スキンケア選びを始める。</h1>
        <p className="hero-intro">肌診断や商品比較、成分・処方の解説を通して、<br className="desktop-break" />スキンケア選びに役立つ情報をまとめています。</p>
        <div className="hero-actions">
          <Link className="button-primary" href="/diagnosis">肌診断を受ける <span aria-hidden>→</span></Link>
          <a className="button-text" href="#products">商品から探す <span aria-hidden>→</span></a>
        </div>
        <a className="hero-editor" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">edited by yun.skincare_</a>
      </div>
      <div className="hero-guide" aria-label="このサイトの使い方">
        <p className="hero-guide-title">肌を知る。ケアを考える。</p>
        <ol>
          <li><span className="step-number">01</span><div><strong>肌診断</strong><p>8問から、いまの肌の傾向を整理。</p></div></li>
          <li><span className="step-number">02</span><div><strong>お手入れの方法を知る</strong><p>洗顔や保湿のしかた、取り入れたい成分を確認できます。</p></div></li>
          <li><span className="step-number">03</span><div><strong>記事・Q&Aを読む</strong><p>スキンケアの使い方や選び方を、記事で詳しく解説。</p></div></li>
          <li><span className="step-number">04</span><div><strong>商品を検索する</strong><p>商品名・ブランド・成分から検索できます。</p></div></li>
        </ol>
        <Link href="/diagnosis" className="hero-guide-link">8問・約2分 <span aria-hidden>→</span></Link>
      </div>
    </section>
  )
}
