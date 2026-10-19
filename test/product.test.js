import test from 'node:test';
import assert from 'node:assert/strict';
import {
  colorTemperatureFraction,
  colorTemperatureLabel,
  colorTemperatureTone,
} from '../src/lib/colorTemperature.js';
import {
  mapCsvProduct,
  normalizeAvailabilityStatus,
  normalizeHeader,
  parseCsv,
  validateProductBatch,
  validateProductRow,
} from '../src/lib/csv.js';
import {
  applyFilters,
  matchFilters,
  powerBucket,
  wattageValue,
} from '../src/lib/productFilters.js';
import {
  availabilityLabel,
  productImages,
  productMatchesPath,
  productPath,
} from '../src/lib/productUtils.js';

test('colorTemperatureTone identifies tones correctly', () => {
  assert.equal(colorTemperatureTone('Blanc chaud 3000K'), 'chaud');
  assert.equal(colorTemperatureTone('6500K Blanc froid'), 'froid');
  assert.equal(colorTemperatureTone('4000K Blanc neutre'), 'neutre');
  assert.equal(colorTemperatureTone(''), 'neutre');
  assert.equal(colorTemperatureTone(null), 'neutre');
});

test('colorTemperatureFraction and Label map consistently', () => {
  assert.equal(colorTemperatureFraction('Blanc chaud'), 0.14);
  assert.equal(colorTemperatureFraction('Blanc froid'), 0.86);
  assert.equal(colorTemperatureFraction('Neutre'), 0.5);

  assert.equal(colorTemperatureLabel(0.2), 'Blanc chaud');
  assert.equal(colorTemperatureLabel(0.5), 'Blanc neutre');
  assert.equal(colorTemperatureLabel(0.8), 'Blanc froid');
});

test('wattageValue and powerBucket parse wattage values', () => {
  assert.equal(wattageValue({ wattage: '50W' }), 50);
  assert.equal(wattageValue({ wattage: '18,5 W' }), 18.5);
  assert.equal(wattageValue({ wattage: '' }), null);
  assert.equal(wattageValue(null), null);

  assert.equal(powerBucket({ wattage: '10W' }), 'lt20');
  assert.equal(powerBucket({ wattage: '30W' }), 'w20_50');
  assert.equal(powerBucket({ wattage: '80W' }), 'w50_100');
  assert.equal(powerBucket({ wattage: '150W' }), 'gt100');
  assert.equal(powerBucket({ wattage: '' }), null);
});

test('productMatchesPath matches by reference, slug, id or name', () => {
  const product = {
    id: 'abc-123',
    reference: 'PL-PROJ-50W',
    slug: 'projecteur-50w',
    name: 'Projecteur LED 50W',
  };

  assert.equal(productMatchesPath(product, 'PL-PROJ-50W'), true);
  assert.equal(productMatchesPath(product, 'pl-proj-50w'), true);
  assert.equal(productMatchesPath(product, 'projecteur-50w'), true);
  assert.equal(productMatchesPath(product, 'abc-123'), true);
  assert.equal(productMatchesPath(product, 'autre-produit'), false);
});

test('availabilityLabel computes correct labels', () => {
  assert.equal(availabilityLabel({ availability_status: 'available' }), 'Disponible');
  assert.equal(availabilityLabel({ availability_status: 'order' }), 'Sur commande');
  assert.equal(availabilityLabel({ availability_status: 'request' }), 'Sur demande');
  assert.equal(availabilityLabel({ availability_status: 'auto', stock_quantity: 5 }), 'Disponible');
  assert.equal(availabilityLabel({ availability_status: 'auto', stock_quantity: 0 }), 'Sur demande');
});

test('productImages normalizes, handles delimiters and deduplicates', () => {
  const product = {
    image_url: 'https://img.com/main.jpg',
    image_urls: 'https://img.com/main.jpg\nhttps://img.com/second.jpg',
  };

  const images = productImages(product);
  assert.deepEqual(images, ['https://img.com/main.jpg', 'https://img.com/second.jpg']);
  assert.deepEqual(productImages(null), []);
});

test('csv parsing and header normalization', () => {
  assert.equal(normalizeHeader('  Nom du Produit (Réf)  '), 'nom_du_produit_ref');
  assert.equal(normalizeAvailabilityStatus('Disponible'), 'available');
  assert.equal(normalizeAvailabilityStatus('Sur commande'), 'order');
  assert.equal(normalizeAvailabilityStatus('sur demande'), 'request');
  assert.equal(normalizeAvailabilityStatus('inconnu'), 'auto');

  const csv = 'nom;reference;prix;stock\nSpot LED;SP-10;25.5;10';
  const parsed = parseCsv(csv);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].nom, 'Spot LED');
  assert.equal(parsed[0].reference, 'SP-10');

  const mapped = mapCsvProduct(parsed[0]);
  assert.equal(mapped.name, 'Spot LED');
  assert.equal(mapped.reference, 'SP-10');
  assert.equal(mapped.price, 25.5);
  assert.equal(mapped.stock_quantity, 10);
});

test('product validation validates required fields and batches', () => {
  const validProd = {
    name: 'Projecteur 100W',
    reference: 'PROJ-100',
    stock_quantity: 4,
    price: 85,
    availability_status: 'available',
  };

  const validRes = validateProductRow(validProd, 2);
  assert.equal(validRes.valid, true);
  assert.equal(validRes.errors.length, 0);

  const invalidProd = {
    name: '',
    stock_quantity: -5,
    price: -10,
    availability_status: 'invalid_status',
  };

  const invalidRes = validateProductRow(invalidProd, 3);
  assert.equal(invalidRes.valid, false);
  assert.equal(invalidRes.errors.length, 4);

  const batch = validateProductBatch([
    validProd,
    { ...validProd, reference: 'PROJ-100' }, // duplicate reference
    invalidProd,
  ]);

  assert.equal(batch.validProducts.length, 1);
  assert.equal(batch.invalidRows.length, 2);
});

test('product filtering applies multiple criteria', () => {
  const products = [
    {
      name: 'Projecteur 50W',
      brand: 'Platinum',
      category: 'Projecteurs',
      color_temperature: 'Blanc froid',
      wattage: '50W',
      stock_quantity: 10,
      sort_order: 1,
    },
    {
      name: 'Panneau 18W',
      brand: 'Somef',
      category: 'Panneaux LED',
      color_temperature: 'Blanc neutre',
      wattage: '18W',
      stock_quantity: 0,
      sort_order: 2,
    },
  ];

  const filteredStockOnly = applyFilters(products, {
    query: '',
    categories: [],
    brands: [],
    tones: [],
    powers: [],
    stockOnly: true,
    sort: 'recommended',
  });
  assert.equal(filteredStockOnly.length, 1);
  assert.equal(filteredStockOnly[0].name, 'Projecteur 50W');

  const filteredCategory = applyFilters(products, {
    query: '',
    categories: ['Panneaux LED'],
    brands: [],
    tones: [],
    powers: [],
    stockOnly: false,
    sort: 'recommended',
  });
  assert.equal(filteredCategory.length, 1);
  assert.equal(filteredCategory[0].name, 'Panneau 18W');
});
