import styles from './DiagnosisNotice.module.css'

export default function DiagnosisNotice() {
  return (
    <aside className={styles.notice} aria-labelledby="diagnosis-notice-title">
      <div className={styles.content}>
        <h2 id="diagnosis-notice-title" className={styles.heading}>この診断について</h2>
        <p className={styles.copy}>
          この結果は、回答いただいた内容をもとに肌の傾向を整理したもので、実際の肌状態を測定・診断するものではありません。
        </p>
        <p className={styles.copy}>
          まずは無理のない範囲で、保湿や紫外線対策など日々のスキンケアを見直す際の参考にしてください。
        </p>
        <p className={styles.copy}>
          赤み・かゆみ・痛みなど気になる症状が続く場合は、必要に応じて皮膚科などの医療機関へ相談してください。
        </p>
      </div>
    </aside>
  )
}
