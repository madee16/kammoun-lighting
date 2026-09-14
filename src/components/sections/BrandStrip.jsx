import { PAGE_COPY, ROUTES } from '../../data/siteContent.js';
import { cleanSlug } from '../../lib/productUtils.js';

export function BrandStrip({ products, navigate }) {
  const brands = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ].slice(0, 6);

  if (!brands.length) return null;

  return (
    <section className="brand-strip" aria-label={PAGE_COPY.brands.eyebrow}>
      <span>{PAGE_COPY.brands.eyebrow}</span>
      {brands.map((brand) => (
        <button
          type="button"
          key={brand}
          onClick={() => navigate(`/marque/${cleanSlug(brand)}`)}
        >
          {brand}
        </button>
      ))}
      <button type="button" onClick={() => navigate(ROUTES.brands)}>
        {PAGE_COPY.brands.allCta}
      </button>
    </section>
  );
}