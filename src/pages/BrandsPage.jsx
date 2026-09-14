import { PageHero } from '../components/ui/PageHero.jsx';
import { PAGE_COPY } from '../data/siteContent.js';
import { cleanSlug } from '../lib/productUtils.js';

export function BrandsPage({ products, navigate }) {
  const brands = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ].sort();

  return (
    <>
      <PageHero
        eyebrow={PAGE_COPY.brands.eyebrow}
        title={PAGE_COPY.brands.title}
        text={PAGE_COPY.brands.text}
      />
      <section className="section tile-grid">
        {(brands.length ? brands : PAGE_COPY.brands.fallback).map((brand) => (
          <button
            className="large-tile brand-tile"
            key={brand}
            type="button"
            onClick={() => navigate(`/marque/${cleanSlug(brand)}`)}
          >
            <span>{brand}</span>
            <p>{PAGE_COPY.brands.tileText}</p>
          </button>
        ))}
      </section>
    </>
  );
}