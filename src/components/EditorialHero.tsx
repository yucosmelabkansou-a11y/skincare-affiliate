import Link from 'next/link'

export default function EditorialHero() {
  return (
    <section className="editorial-hero" aria-labelledby="home-heading">
      <div className="hero-main">
        <div className="hero-copy">
          <h1 id="home-heading">
            <span className="hero-phrase">たった2分の質問で</span>
            <span className="hero-phrase">自分に合った</span>
            <span className="hero-phrase">スキンケアがわかる</span>
          </h1>
          <p className="hero-intro">
            <span className="hero-phrase">約2分。</span>
            <span className="hero-phrase">お手入れや商品選びのヒントを。</span>
          </p>
          <Link className="hero-cta" href="/diagnosis/quiz">肌診断をはじめる <span aria-hidden>→</span></Link>
        </div>
        <figure className="hero-result">
          <figcaption className="hero-result-caption">診断結果の一例</figcaption>
          <p className="hero-result-type">
            <span className="hero-phrase">乾燥肌タイプ／</span>
            <span className="hero-phrase">うるおいケアタイプ</span>
          </p>
          <dl className="hero-result-list">
            <div className="hero-result-care">
              <dt>まずするケア</dt>
              <dd>
                <span className="hero-phrase">化粧水は手で</span>
                <span className="hero-phrase">2〜3回に分けて重ねづけ</span>
              </dd>
            </div>
            <div className="hero-result-product">
              <dt>商品例</dt>
              <dd>dプログラム モイストケア ローション EX【医薬部外品】</dd>
            </div>
          </dl>
          <Link className="hero-result-link" href="/column/dry-skin-cleansing-7">関連記事を読む <span aria-hidden>→</span></Link>
        </figure>
      </div>
      <div className="hero-guide" aria-label="このサイトの使い方">
        <p className="hero-guide-title">肌を知る。ケアを考える。</p>
        <ol>
          <li><span className="step-number">01</span><div><strong>肌診断</strong><p>8問から、いまの肌の傾向を整理。</p></div></li>
          <li><span className="step-number">02</span><div><strong>お手入れの方法を知る</strong><p>洗顔や保湿のしかた、取り入れたい成分を確認できます。</p></div></li>
          <li><span className="step-number">03</span><div><strong>記事・Q&Aを読む</strong><p>スキンケアの使い方や選び方を、記事で詳しく解説。</p></div></li>
          <li><span className="step-number">04</span><div><strong>商品を検索する</strong><p>商品名・ブランド・成分から検索できます。</p></div></li>
        </ol>
      </div>
    </section>
  )
}
