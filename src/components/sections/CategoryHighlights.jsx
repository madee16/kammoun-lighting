import { DEFAULT_CATEGORIES } from '../../data/siteContent.js';
import { cleanSlug } from '../../lib/productUtils.js';

export function CategoryHighlights({ navigate }) {
  return (
    <section className="category-band" aria-label="Gammes de produits">
      {DEFAULT_CATEGORIES.map((item) => (
        <button
          className="category-tile"
          key={item.name}
          type="button"
          onClick={() => navigate(`/categorie/${cleanSlug(item.name)}`)}
          aria-label={item.name}
        >
          <span>{item.name}</span>
          <p>{item.text}</p>
        </button>
      ))}
    </section>
  );
}