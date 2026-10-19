import { ArrowRight, MessageCircle } from 'lucide-react';
import { Highlight } from '../ui/Highlight.jsx';
import { PAGE_COPY, ROUTES } from '../../data/siteContent.js';
import { whatsappNumber } from '../../lib/supabase.js';

export function Hero({ navigate }) {
  return (
    <section className="hero">
      <div className="hero-lighting-bg" aria-hidden="true">
        <div className="hero-lighting-photo" />
        <div className="hero-lighting-beams" />
        <div className="hero-lighting-glow" />
      </div>
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{PAGE_COPY.hero.eyebrow}</p>
          <h1>
            <Highlight text={PAGE_COPY.hero.title} words={['Lighting']} />
          </h1>
          <p>{PAGE_COPY.hero.text}</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => navigate(ROUTES.catalog)}>
              {PAGE_COPY.hero.catalogCta}
              <ArrowRight size={18} />
            </button>
            <a
              className="secondary-button"
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              {PAGE_COPY.hero.contactCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}