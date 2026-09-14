import { PageHero } from '../components/ui/PageHero.jsx';
import { DEFAULT_CATEGORIES, PAGE_COPY } from '../data/siteContent.js';
import { cleanSlug } from '../lib/productUtils.js';

export function CategoriesPage({ products, navigate }) {
  const categories = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.name).length,
  }));

  return (
    <>
      <PageHero
        eyebrow={PAGE_COPY.categories.eyebrow}
        title={PAGE_COPY.categories.title}
        text={PAGE_COPY.categories.text}
      />
      <section className="section tile-grid">
        {categories.map((category) => (
          <button
            className="large-tile"
            key={category.name}
            type="button"
            onClick={() => navigate(`/categorie/${cleanSlug(category.name)}`)}
          >
            <span>{category.name}</span>
            <p>{category.text}</p>
            <strong>{category.count ? `${category.count} produit(s)` : PAGE_COPY.categories.emptyCount}</strong>
          </button>
        ))}
      </section>
    </>
  );
}