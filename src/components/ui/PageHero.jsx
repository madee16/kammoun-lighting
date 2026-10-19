export function PageHero({ eyebrow, title, text }) {
  return (
    <section className="page-hero">
      <div className="page-hero-lighting-bg" aria-hidden="true">
        <div className="page-hero-photo" />
        <div className="page-hero-glow" />
      </div>
      <div className="page-hero-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}