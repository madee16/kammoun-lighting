import { MessageCircle } from 'lucide-react';
import { PAGE_COPY, ROUTES } from '../../data/siteContent.js';
import { whatsappNumber } from '../../lib/supabase.js';

export function Hero({ navigate }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{PAGE_COPY.hero.eyebrow}</p>
        <h1>{PAGE_COPY.hero.title}</h1>
        <p>{PAGE_COPY.hero.text}</p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => navigate(ROUTES.catalog)}>
            {PAGE_COPY.hero.catalogCta}
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
    </section>
  );
}