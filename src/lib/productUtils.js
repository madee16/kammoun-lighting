import {
  AVAILABILITY_LABELS,
  WHATSAPP_ACTION_LABELS,
} from '../data/siteContent.js';

export const currentRoute = () => window.location.pathname.replace(/\/$/, '') || '/';

export const cleanSlug = (value) => encodeURIComponent(String(value || '').trim());

export const productPath = (product) =>
  `/produit/${encodeURIComponent(
    product.slug || product.reference || product.id || product.name,
  )}`;

export const productMatchesPath = (product, value) => {
  const decoded = decodeURIComponent(value || '').toLowerCase();
  return [product.slug, product.reference, product.id, product.name]
    .filter(Boolean)
    .some((candidate) => String(candidate).toLowerCase() === decoded);
};

export const productUrl = (product) => `${window.location.origin}${productPath(product)}`;

export const productImages = (product) => {
  if (!product) return [];
  const gallery = Array.isArray(product.image_urls)
    ? product.image_urls
    : String(product.image_urls || '')
        .split(/[\n|]/)
        .map((item) => item.trim())
        .filter(Boolean);

  const list = [product.image_url, ...gallery].filter(Boolean);
  return [...new Set(list)];
};

export const availabilityLabel = (product) => {
  if (product.availability_status === 'order') return AVAILABILITY_LABELS.order;
  if (product.availability_status === 'request') return AVAILABILITY_LABELS.request;
  if (product.availability_status === 'available') return AVAILABILITY_LABELS.available;
  return product.stock_quantity > 0
    ? AVAILABILITY_LABELS.autoInStock
    : AVAILABILITY_LABELS.autoOutOfStock;
};

export const whatsappProductMessage = (product, action = 'details', quantity = '') =>
  encodeURIComponent(
    `Bonjour, je veux ${WHATSAPP_ACTION_LABELS[action]} sur ce produit: ${product.name}${
      product.reference ? ` (${product.reference})` : ''
    }\nQuantite souhaitee: ${quantity || 'a preciser'}\nLien: ${productUrl(product)}`,
  );

export const whatsappSimpleMessage = (text) => encodeURIComponent(text);

export const sortProducts = (products) =>
  [...products].sort((a, b) => {
    const sortA = Number(a.sort_order || 0);
    const sortB = Number(b.sort_order || 0);
    if (sortA !== sortB) return sortA - sortB;
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });

export const uniqueProductValues = (products, key) =>
  [...new Set(products.map((product) => product[key]).filter(Boolean))].sort();
