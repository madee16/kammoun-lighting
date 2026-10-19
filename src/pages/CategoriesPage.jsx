import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero.jsx';
import { DEFAULT_CATEGORIES, PAGE_COPY } from '../data/siteContent.js';
import { cleanSlug } from '../lib/productUtils.js';

const CATEGORY_BACKGROUNDS = {
  Projecteurs: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80',
  'Panneaux LED': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
  'Rubans LED': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80',
  Accessoires: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
};

export function CategoriesPage({ products, navigate }) {
  const categories = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.name).length,
    bgImage: CATEGORY_BACKGROUNDS[category.name],
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
            {category.bgImage && (
              <div className="large-tile-bg" aria-hidden="true">
                <div
                  className="large-tile-photo"
                  style={{ backgroundImage: `url(${category.bgImage})` }}
                />
                <div className="large-tile-overlay" />
                <div className="large-tile-beam" />
              </div>
            )}
            <div className="large-tile-inner">
              <span className="large-tile-header">
                <span>{category.name}</span>
                <ArrowUpRight className="category-tile-arrow" size={20} />
              </span>
              <p>{category.text}</p>
              <strong>{category.count ? `${category.count} produit(s)` : PAGE_COPY.categories.emptyCount}</strong>
            </div>
          </button>
        ))}
      </section>
    </>
  );
}