import { MessageCircle, PackageSearch } from 'lucide-react';
import { BrandLogosSection } from '../components/sections/BrandLogosSection.jsx';
import { BrandStrip } from '../components/sections/BrandStrip.jsx';
import { CategoryHighlights } from '../components/sections/CategoryHighlights.jsx';
import { Hero } from '../components/sections/Hero.jsx';
import { TestimonialsSection } from '../components/sections/TestimonialsSection.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Highlight } from '../components/ui/Highlight.jsx';
import { LoadingGrid } from '../components/ui/LoadingGrid.jsx';
import { MarqueeStrip } from '../components/ui/MarqueeStrip.jsx';
import { ProductCard } from '../components/ui/ProductCard.jsx';
import { MARQUEE_ITEMS, PAGE_COPY, ROUTES } from '../data/siteContent.js';
import { whatsappNumber } from '../lib/supabase.js';

export function HomePage({ products, loading, navigate }) {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  const fallbackProducts = products.slice(0, 4);
  const spotlightProducts = featuredProducts.length ? featuredProducts : fallbackProducts;

  return (
    <>
      <Hero navigate={navigate} />
      <CategoryHighlights navigate={navigate} />
      <MarqueeStrip items={MARQUEE_ITEMS} />
      <BrandStrip products={products} navigate={navigate} spotlights={spotlightProducts} />
      <BrandLogosSection />
      <section className="section intro-spotlight">
        <div className="intro-lighting-bg" aria-hidden="true">
          <div className="intro-lighting-photo" />
          <div className="intro-lighting-beam" />
        </div>
        <div className="intro-glow" aria-hidden="true" />
        <p className="eyebrow">{PAGE_COPY.homeIntro.eyebrow}</p>
        <h2>
          <Highlight text={PAGE_COPY.homeIntro.title} words={['clairs', 'direct']} />
        </h2>
        <p>{PAGE_COPY.homeIntro.text}</p>
        <a
          className="whatsapp-button intro-cta"
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={18} />
          {PAGE_COPY.hero.contactCta}
        </a>
      </section>

      <section className="section featured-section">
        <div className="section-header header-right">
          <div>
            <div className="section-index-row">
              <span className="section-index">02</span>
              <p className="eyebrow">{PAGE_COPY.featured.eyebrow}</p>
            </div>
            <h2>{PAGE_COPY.featured.title}</h2>
          </div>
          <button
            className="secondary-action"
            type="button"
            onClick={() => navigate(ROUTES.catalog)}
          >
            {PAGE_COPY.featured.cta}
          </button>
        </div>

        {loading ? (
          <LoadingGrid count={3} />
        ) : featuredProducts.length || fallbackProducts.length ? (
          <div className="product-grid compact-grid">
            {(featuredProducts.length ? featuredProducts : fallbackProducts).map((product) => (
              <ProductCard
                key={product.id || product.reference || product.name}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={PackageSearch}
            title="Aucun produit en avant"
            text={PAGE_COPY.featured.empty}
          />
        )}
      </section>

      <section className="section trust-section">
        <div className="trust-panel">
          <div className="trust-panel-backdrop" aria-hidden="true">
            <div className="trust-panel-photo" />
            <div className="trust-panel-glow" />
          </div>
          <div className="trust-panel-head">
            <p className="eyebrow">{PAGE_COPY.trust.eyebrow}</p>
            <h2>{PAGE_COPY.trust.title}</h2>
            <p>{PAGE_COPY.trust.text}</p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={() => navigate(ROUTES.about)}>
                {PAGE_COPY.trust.aboutCta}
              </button>
              <button className="secondary-button secondary-action" type="button" onClick={() => navigate(ROUTES.contact)}>
                {PAGE_COPY.trust.contactCta}
              </button>
            </div>
          </div>
          <div className="trust-panel-mark" aria-hidden="true" />
        </div>
      </section>
      <TestimonialsSection />
    </>
  );
}