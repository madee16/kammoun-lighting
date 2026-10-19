import { ChevronDown, RotateCcw, Search } from 'lucide-react';

function FilterGroup({ title, activeCount = 0, children }) {
  return (
    <details className="filter-group" open>
      <summary>
        <span>{title}</span>
        {activeCount > 0 && <span className="filter-group-count">{activeCount}</span>}
        <ChevronDown className="filter-group-chevron" size={16} aria-hidden="true" />
      </summary>
      <div className="filter-group-body">{children}</div>
    </details>
  );
}

function FilterOption({ name, label, count, checked, swatch, onChange }) {
  return (
    <label className={checked ? 'filter-option checked' : 'filter-option'}>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span className="filter-option-box" aria-hidden="true" />
      {swatch && <span className="filter-swatch" style={{ background: swatch }} aria-hidden="true" />}
      <span className="filter-option-label">{label}</span>
      <span className="filter-option-count">{count}</span>
    </label>
  );
}

export function CatalogFilters({
  filters,
  categories,
  brands,
  toneOptions,
  powerOptions,
  counts,
  resultCount,
  totalCount,
  onToggle,
  onQueryChange,
  onStockOnlyChange,
  onReset,
}) {
  return (
    <div className="filter-panel">
      <label className="search-field filter-search">
        <Search size={18} />
        <input
          type="search"
          placeholder="Rechercher un produit, une marque, une reference..."
          value={filters.query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>

      <button
        className={filters.stockOnly ? 'toggle active filter-stock' : 'toggle filter-stock'}
        type="button"
        onClick={() => onStockOnlyChange(!filters.stockOnly)}
      >
        <span className="filter-option-box" aria-hidden="true" />
        En stock uniquement
      </button>

      <FilterGroup title="Categories" activeCount={filters.categories.length}>
        {categories.map((item) => (
          <FilterOption
            key={item}
            name="category"
            label={item}
            count={counts.categories[item] || 0}
            checked={filters.categories.includes(item)}
            onChange={() => onToggle('categories', item)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Marques" activeCount={filters.brands.length}>
        {brands.length ? (
          brands.map((item) => (
            <FilterOption
              key={item}
              name="brand"
              label={item}
              count={counts.brands[item] || 0}
              checked={filters.brands.includes(item)}
              onChange={() => onToggle('brands', item)}
            />
          ))
        ) : (
          <p className="filter-empty">Aucune marque.</p>
        )}
      </FilterGroup>

      {toneOptions.length > 0 && (
        <FilterGroup title="Couleur de la lumiere" activeCount={filters.tones.length}>
          {toneOptions.map((option) => (
            <FilterOption
              key={option.id}
              name="tone"
              label={option.label}
              swatch={option.swatch}
              count={counts.tones[option.id] || 0}
              checked={filters.tones.includes(option.id)}
              onChange={() => onToggle('tones', option.id)}
            />
          ))}
        </FilterGroup>
      )}

      {powerOptions.length > 0 && (
        <FilterGroup title="Puissance" activeCount={filters.powers.length}>
          {powerOptions.map((option) => (
            <FilterOption
              key={option.id}
              name="power"
              label={option.label}
              count={counts.powers[option.id] || 0}
              checked={filters.powers.includes(option.id)}
              onChange={() => onToggle('powers', option.id)}
            />
          ))}
        </FilterGroup>
      )}

      <div className="filter-footer">
        <button className="filter-reset" type="button" onClick={onReset}>
          <RotateCcw size={15} />
          Reinitialiser
        </button>
        <span className="filter-total">
          {resultCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}
