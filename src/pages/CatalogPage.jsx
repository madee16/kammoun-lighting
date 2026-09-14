import { useMemo, useState } from 'react';
import { CheckCircle2, Filter, PackageSearch, Search } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { LoadingGrid } from '../components/ui/LoadingGrid.jsx';
import { PageHero } from '../components/ui/PageHero.jsx';
import { ProductCard } from '../components/ui/ProductCard.jsx';
import { DEFAULT_CATEGORIES, PAGE_COPY } from '../data/siteContent.js';

export function CatalogPage({
  products,
  loading,
  navigate,
  initialCategory = 'Tous',
  initialBrand = 'Toutes',
  eyebrow = PAGE_COPY.catalog.eyebrow,
  title = PAGE_COPY.catalog.title,
  text = PAGE_COPY.catalog.text,
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const [stockOnly, setStockOnly] = useState(false);

  const categories = useMemo(
    () => [
      'Tous',
      ...new Set([
        ...DEFAULT_CATEGORIES.map((item) => item.name),
        ...products.map((item) => item.category).filter(Boolean),
      ]),
    ],
    [products],
  );
  const brands = useMemo(
    () => ['Toutes', ...new Set(products.map((item) => item.brand).filter(Boolean))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesText = [
        product.name,
        product.brand,
        product.category,
        product.reference,
        product.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle);
      const matchesCategory = category === 'Tous' || product.category === category;
      const matchesBrand = brand === 'Toutes' || product.brand === brand;
      const matchesStock = !stockOnly || product.stock_quantity > 0;

      return matchesText && matchesCategory && matchesBrand && matchesStock;
    });
  }, [brand, category, products, query, stockOnly]);

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        text={text}
      />
      <section className="section catalog-section">
        <div className="filters" aria-label="Filtres du catalogue">
          <label className="search-field">
            <Search size={18} />
            <input
              type="search"
              placeholder={PAGE_COPY.catalog.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label>
            <Filter size={16} />
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            <PackageSearch size={16} />
            <select value={brand} onChange={(event) => setBrand(event.target.value)}>
              {brands.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <button
            className={stockOnly ? 'toggle active' : 'toggle'}
            type="button"
            onClick={() => setStockOnly((value) => !value)}
          >
            <CheckCircle2 size={17} />
            {PAGE_COPY.catalog.stockOnly}
          </button>
        </div>

        {loading ? (
          <LoadingGrid count={6} />
        ) : filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
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
            title="Aucun resultat"
            text={PAGE_COPY.catalog.empty}
          />
        )}
      </section>
    </>
  );
}