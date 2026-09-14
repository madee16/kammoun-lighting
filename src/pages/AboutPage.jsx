import { IconByName } from '../components/ui/IconByName.jsx';
import { PageHero } from '../components/ui/PageHero.jsx';
import { ABOUT_FACTS, PAGE_COPY, ROUTES } from '../data/siteContent.js';

export function AboutPage({ navigate }) {
  return (
    <>
      <PageHero
        eyebrow={PAGE_COPY.about.eyebrow}
        title={PAGE_COPY.about.title}
        text={PAGE_COPY.about.text}
      />
      <section className="section about-layout">
        <div className="about-copy">
          <p className="eyebrow">{PAGE_COPY.about.sectionEyebrow}</p>
          <h2>{PAGE_COPY.about.sectionTitle}</h2>
          <p>{PAGE_COPY.about.sectionText}</p>
          <button className="primary-button" type="button" onClick={() => navigate(ROUTES.catalog)}>
            {PAGE_COPY.about.cta}
          </button>
        </div>
        <div className="about-facts">
          {ABOUT_FACTS.map((fact) => (
            <div key={fact.label}>
              <IconByName name={fact.icon} size={22} />
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}