import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, PackageSearch, SlidersHorizontal, X } from 'lucide-react';
import { CatalogFilters } from '../components/ui/CatalogFilters.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { LoadingGrid } from '../components/ui/LoadingGrid.jsx';
import { PageHero } from '../components/ui/PageHero.jsx';
import { ProductCard } from '../components/ui/ProductCard.jsx';
import { DEFAULT_CATEGORIES, PAGE_COPY, ROUTES } from '../data/siteContent.js';
import {
  EMPTY_FILTERS,
  KELVIN_OPTIONS,
  POWER_OPTIONS,
  SORT_OPTIONS,
  applyFilters,
  brandOptions,
  buildChips,
  categoryOptions,
  countActiveFilters,
  kelvinTone,
  matchFilters,
  powerBucket,
  toggleInList,
} from '../lib/productFilters.js';

const initialList = (value, allLabel) => {
  if (!value || value === allLabel) return [];
  return [value];
};

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
  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    categories: initialList(initialCategory, 'Tous'),
    brands: initialList(initialBrand, 'Toutes'),
  }));
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (!panelOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setPanelOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [panelOpen]);

  const categories = useMemo(
    () => categoryOptions(products, DEFAULT_CATEGORIES.map((item) => item.name)),
    [products],
  );
  const brands = useMemo(() => brandOptions(products), [products]);
  const toneOptions = useMemo(
    () => KELVIN_OPTIONS.filter((option) => products.some((p) => kelvinTone(p.color_temperature) === option.id)),
    [products],
  );
  const powerOptions = useMemo(
    () => POWER_OPTIONS.filter((option) => products.some((p) => powerBucket(p) === option.id)),
    [products],
  );

  const facetCounts = useMemo(() => {
    const perCategory = {};
    categories.forEach((item) => {
      perCategory[item] = products.filter(
        (product) => product.category === item && matchFilters(product, filters, 'categories'),
      ).length;
    });

    const perBrand = {};
    brands.forEach((item) => {
      perBrand[item] = products.filter(
        (product) => product.brand === item && matchFilters(product, filters, 'brands'),
      ).length;
    });

    const perTone = {};
    KELVIN_OPTIONS.forEach((option) => {
      perTone[option.id] = products.filter(
        (product) =>
          kelvinTone(product.color_temperature) === option.id && matchFilters(product, filters, 'tones'),
      ).length;
    });

    const perPower = {};
    POWER_OPTIONS.forEach((option) => {
      perPower[option.id] = products.filter(
        (product) => powerBucket(product) === option.id && matchFilters(product, filters, 'powers'),
      ).length;
    });

    return { categories: perCategory, brands: perBrand, tones: perTone, powers: perPower };
  }, [brands, categories, filters, products]);

  const filteredProducts = useMemo(() => applyFilters(products, filters), [filters, products]);
  const chips = useMemo(() => buildChips(filters), [filters]);
  const activeCount = countActiveFilters(filters);

  const onToggle = (key, value) => {
    setFilters((current) => ({ ...current, [key]: toggleInList(current[key], value) }));
  };

  const onRemoveChip = (key, value) => {
    if (key === 'stockOnly') {
      setFilters((current) => ({ ...current, stockOnly: false }));
      return;
    }
    setFilters((current) => ({ ...current, [key]: current[key].filter((item) => item !== value) }));
  };

  const onReset = () => setFilters((current) => ({ ...EMPTY_FILTERS, sort: current.sort }));

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={text} />
      <section className="section catalog-section">
        <div className="catalog-toolbar">
          <button
            className="filter-toggle"
            type="button"
            onClick={() => setPanelOpen(true)}
            aria-expanded={panelOpen}
          >
            <SlidersHorizontal size={18} />
            Filtrer
            {activeCount > 0 && <span className="filter-toggle-count">{activeCount}</span>}
          </button>

          <p className="catalog-count">
            <strong>{filteredProducts.length}</strong>
            {` produit${filteredProducts.length > 1 ? 's' : ''}`}
            {activeCount > 0 && ' filtres'}
          </p>

          <label className="catalog-sort">
            <span>Trier</span>
            <select
              value={filters.sort}
              onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="catalog-layout">
          <aside
            className={panelOpen ? 'catalog-sidebar open' : 'catalog-sidebar'}
            aria-label="Filtres du catalogue"
          >
            <div className="catalog-sidebar-head">
              <strong>Filtres</strong>
              <button
                className="catalog-sidebar-close"
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Fermer les filtres"
              >
                <X size={18} />
              </button>
            </div>

            <CatalogFilters
              filters={filters}
              categories={categories}
              brands={brands}
              toneOptions={toneOptions}
              powerOptions={powerOptions}
              counts={facetCounts}
              resultCount={filteredProducts.length}
              totalCount={products.length}
              onToggle={onToggle}
              onQueryChange={(value) => setFilters((current) => ({ ...current, query: value }))}
              onStockOnlyChange={(value) => setFilters((current) => ({ ...current, stockOnly: value }))}
              onReset={onReset}
            />

            <div className="catalog-sidebar-links">
              <button type="button" onClick={() => navigate(ROUTES.categories)}>
                Toutes les categories
              </button>
              <button type="button" onClick={() => navigate(ROUTES.brands)}>
                Toutes les marques
              </button>
            </div>
          </aside>

          {panelOpen && (
            <button
              className="catalog-scrim"
              type="button"
              aria-label="Fermer les filtres"
              onClick={() => setPanelOpen(false)}
            />
          )}

          <div className="catalog-results">
            {chips.length > 0 && (
              <div className="filter-chips">
                {chips.map((chip) => (
                  <button
                    className="filter-chip"
                    key={`${chip.key}-${chip.value}`}
                    type="button"
                    onClick={() => onRemoveChip(chip.key, chip.value)}
                  >
                    {chip.label}
                    <X size={14} />
                  </button>
                ))}
                <button className="filter-chip-clear" type="button" onClick={onReset}>
                  Tout effacer
                </button>
              </div>
            )}

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

            {!loading && filteredProducts.length > 0 && (
              <p className="catalog-hint">
                <CheckCircle2 size={15} />
                Prix et disponibilites sur demande par WhatsApp.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
