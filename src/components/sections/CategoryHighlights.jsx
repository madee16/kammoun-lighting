import { ArrowUpRight } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../../data/siteContent.js';
import { cleanSlug } from '../../lib/productUtils.js';

const CATEGORY_BACKGROUNDS = {
  Projecteurs: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80',
  'Panneaux LED': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
  'Rubans LED': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80',
  Accessoires: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
};

export function CategoryHighlights({ navigate }) {
  return (
    <section className="category-band" aria-label="Gammes de produits">
      {DEFAULT_CATEGORIES.map((item, index) => {
        const bgImage = CATEGORY_BACKGROUNDS[item.name];
        return (
          <button
            className="category-tile"
            key={item.name}
            type="button"
            onClick={() => navigate(`/categorie/${cleanSlug(item.name)}`)}
            aria-label={item.name}
          >
            {bgImage && (
              <div className="category-tile-bg" aria-hidden="true">
                <div
                  className="category-tile-photo"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
                <div className="category-tile-overlay" />
                <div className="category-tile-beam" />
              </div>
            )}
            <div className="category-tile-inner">
              <span className="category-tile-top">
                <span className="category-tile-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <ArrowUpRight className="category-tile-arrow" size={20} />
              </span>
              <span className="category-tile-name">{item.name}</span>
              <p>{item.text}</p>
            </div>
          </button>
        );
      })}
    </section>
  );
}