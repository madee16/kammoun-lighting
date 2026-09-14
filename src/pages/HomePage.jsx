import { PackageSearch } from 'lucide-react';
import { BrandLogosSection } from '../components/sections/BrandLogosSection.jsx';
import { BrandStrip } from '../components/sections/BrandStrip.jsx';
import { CategoryHighlights } from '../components/sections/CategoryHighlights.jsx';
import { Hero } from '../components/sections/Hero.jsx';
import { TestimonialsSection } from '../components/sections/TestimonialsSection.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { LoadingGrid } from '../components/ui/LoadingGrid.jsx';
import { ProductCard } from '../components/ui/ProductCard.jsx';
import { PAGE_COPY, ROUTES } from '../data/siteContent.js';

export function HomePage({ products, loading, navigate }) {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  const fallbackProducts = products.slice(0, 3);

  return (
    <>
      <Hero navigate={navigate} />
      <CategoryHighlights navigate={navigate} />
      <BrandStrip products={products} navigate={navigate} />
      <BrandLogosSection />
      <section className="section home-intro">
        <div>
          <p className="eyebrow">{PAGE_COPY.homeIntro.eyebrow}</p>
          <h2>{PAGE_COPY.homeIntro.title}</h2>
        </div>
        <p>{PAGE_COPY.homeIntro.text}</p>
      </section>

      <section className="section featured-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">{PAGE_COPY.featured.eyebrow}</p>
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
          <p className="eyebrow">{PAGE_COPY.trust.eyebrow}</p>
          <h2>{PAGE_COPY.trust.title}</h2>
          <p>{PAGE_COPY.trust.text}</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => navigate(ROUTES.about)}>
              {PAGE_COPY.trust.aboutCta}
            </button>
            <button className="secondary-action" type="button" onClick={() => navigate(ROUTES.contact)}>
              {PAGE_COPY.trust.contactCta}
            </button>
          </div>
        </div>
      </section>
      <TestimonialsSection />
    </>
  );
}