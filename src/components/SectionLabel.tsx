export default function SectionLabel({ en, jp }: { en: string; jp: string }) {
  return <div className="section-heading"><span className="section-heading-en">{en}</span><span className="section-heading-jp">{jp}</span></div>
}
