// 肌診断のプライバシー注釈（確定文 2026-11-26）。
// 文言は「回答＝ブラウザ内のみ」「結果タイプとお悩み＝集計のみ」を分けて書いた確定文。
// GAイベント（diagnosis_complete に skin_type / concern を送信）と矛盾しないよう、文言は変更しないこと。
// 見た目：箱なし・本文（13px）より一段小さい12px・グレー文字の控えめな注釈。診断トップと結果ページで共通。

type Props = {
  className?: string
}

export default function DiagnosisPrivacyNote({ className = '' }: Props) {
  return (
    <aside
      aria-label="診断結果とプライバシーについて"
      className={`mx-auto text-left ${className}`}
      style={{
        maxWidth: '34ch',
        fontFamily: 'var(--font-jp-alt)',
        fontWeight: 400,
        fontSize: 12,
        lineHeight: 1.9,
        letterSpacing: '0.04em',
        color: 'var(--ink-mute)',
      }}
    >
      <p>＜診断結果とプライバシーについて＞</p>
      <p>
        この診断では、氏名やメールアドレスなど、個人を特定できる情報の入力は一切ありません。回答は、お使いのブラウザの中にだけ保存され（途中で中断しても再開できます）、サーバーへ送信・保存されることはありません。診断結果のタイプやお悩みの種類だけを、個人を特定できない形で、件数の集計に使わせていただくことがあります。
      </p>
    </aside>
  )
}
