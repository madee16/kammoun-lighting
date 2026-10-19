import { colorTemperatureTone } from './colorTemperature.js';
import { sortProducts } from './productUtils.js';

export const EMPTY_FILTERS = {
  query: '',
  categories: [],
  brands: [],
  tones: [],
  powers: [],
  stockOnly: false,
  sort: 'recommended',
};

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Tri du magasin' },
  { value: 'name-asc', label: 'Nom (A-Z)' },
  { value: 'power-desc', label: 'Puissance (elevee)' },
  { value: 'price-asc', label: 'Prix (croissant)' },
  { value: 'price-desc', label: 'Prix (decroissant)' },
];

export const KELVIN_OPTIONS = [
  { id: 'chaud', label: 'Blanc chaud', swatch: '#ffb35c' },
  { id: 'neutre', label: 'Blanc neutre', swatch: '#ffeec4' },
  { id: 'froid', label: 'Blanc froid', swatch: '#c6ddff' },
];

export const POWER_OPTIONS = [
  { id: 'lt20', label: 'Moins de 20W' },
  { id: 'w20_50', label: '20 a 50W' },
  { id: 'w50_100', label: '50 a 100W' },
  { id: 'gt100', label: 'Plus de 100W' },
];

export const kelvinTone = colorTemperatureTone;

export const wattageValue = (product) => {
  const match = String(product?.wattage || '').match(/(\d+(?:[.,]\d+)?)/);
  return match ? Number(match[1].replace(',', '.')) : null;
};

export const powerBucket = (product) => {
  const value = wattageValue(product);
  if (value === null) return null;
  if (value < 20) return 'lt20';
  if (value <= 50) return 'w20_50';
  if (value <= 100) return 'w50_100';
  return 'gt100';
};

const matchesQuery = (product, needle) =>
  [
    product.name,
    product.brand,
    product.category,
    product.reference,
    product.description,
    product.wattage,
    product.color_temperature,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(needle);

export const matchFilters = (product, filters, skipKey) => {
  const needle = filters.query.trim().toLowerCase();

  if (skipKey !== 'query' && needle && !matchesQuery(product, needle)) return false;
  if (skipKey !== 'categories' && filters.categories.length && !filters.categories.includes(product.category)) {
    return false;
  }
  if (skipKey !== 'brands' && filters.brands.length && !filters.brands.includes(product.brand)) {
    return false;
  }
  if (skipKey !== 'tones' && filters.tones.length && !filters.tones.includes(kelvinTone(product.color_temperature))) {
    return false;
  }
  if (skipKey !== 'powers' && filters.powers.length) {
    const bucket = powerBucket(product);
    if (!bucket || !filters.powers.includes(bucket)) return false;
  }
  if (skipKey !== 'stockOnly' && filters.stockOnly && !(product.stock_quantity > 0)) return false;

  return true;
};

export const applyFilters = (products, filters) => {
  const list = products.filter((product) => matchFilters(product, filters));

  if (filters.sort === 'name-asc') {
    return [...list].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'fr'));
  }
  if (filters.sort === 'power-desc') {
    return [...list].sort((a, b) => (wattageValue(b) ?? -1) - (wattageValue(a) ?? -1));
  }
  if (filters.sort === 'price-asc') {
    return [...list].sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
  }
  if (filters.sort === 'price-desc') {
    return [...list].sort((a, b) => {
      const priceA = a.price ?? Number.MAX_SAFE_INTEGER;
      const priceB = b.price ?? Number.MAX_SAFE_INTEGER;
      if (priceA !== priceB) return priceB - priceA;
      return String(a.name || '').localeCompare(String(b.name || ''), 'fr');
    });
  }
  return sortProducts(list);
};

export const categoryOptions = (products, defaults = []) => {
  const names = [...defaults, ...products.map((product) => product.category)];
  return [...new Set(names.filter(Boolean))];
};

export const brandOptions = (products) =>
  [...new Set(products.map((product) => product.brand).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  );

export const toggleInList = (list, value) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

export const buildChips = (filters) => {
  const chips = [];

  filters.categories.forEach((value) => chips.push({ key: 'categories', value, label: value }));
  filters.brands.forEach((value) => chips.push({ key: 'brands', value, label: value }));
  filters.tones.forEach((value) => {
    const option = KELVIN_OPTIONS.find((item) => item.id === value);
    chips.push({ key: 'tones', value, label: option ? option.label : value });
  });
  filters.powers.forEach((value) => {
    const option = POWER_OPTIONS.find((item) => item.id === value);
    chips.push({ key: 'powers', value, label: option ? option.label : value });
  });
  if (filters.stockOnly) chips.push({ key: 'stockOnly', value: true, label: 'En stock' });

  return chips;
};

export const countActiveFilters = (filters) =>
  filters.categories.length +
  filters.brands.length +
  filters.tones.length +
  filters.powers.length +
  (filters.stockOnly ? 1 : 0);
