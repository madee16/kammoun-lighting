import { PAGE_COPY, ROUTES, STORE_INFO } from '../data/siteContent.js';
import { productImages, productMatchesPath } from './productUtils.js';

const SITE_NAME = STORE_INFO.brandName;
const LEGAL_NAME = STORE_INFO.legalName;
const DEFAULT_DESCRIPTION =
  "Catalogue de produits d'eclairage Kammoun Lighting, Societe MEM d'Electricite.";
const DEFAULT_IMAGE_PATH = STORE_INFO.logoPath || '/assets/kammoun-logo.png';

export const siteOrigin =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') ||
  (typeof window !== 'undefined' ? window.location.origin : '');

export const absoluteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return siteOrigin ? `${siteOrigin}${normalizedPath}` : normalizedPath;
};

export const absoluteImageUrl = (image) => {
  if (!image) return absoluteUrl(DEFAULT_IMAGE_PATH);
  if (/^https?:\/\//i.test(image)) return image;
  return absoluteUrl(image.startsWith('/') ? image : `/${image}`);
};

const upsertMeta = (attribute, key, content) => {
  if (typeof document === 'undefined' || !content) return;

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const upsertCanonical = (href) => {
  if (typeof document === 'undefined' || !href) return;

  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

export const setPageMeta = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  path = '/',
  type = 'website',
}) => {
  if (typeof document === 'undefined') return;

  const pageTitle = title || `${SITE_NAME} | ${LEGAL_NAME}`;
  const pageUrl = absoluteUrl(path);
  const pageImage = absoluteImageUrl(image);

  document.title = pageTitle;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', pageTitle);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:image', pageImage);
  upsertMeta('property', 'og:url', pageUrl);
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:locale', 'fr_FR');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', pageTitle);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', pageImage);
  upsertCanonical(pageUrl);
};

export const getMetaForRoute = (route, products = []) => {
  const homeTitle = `${SITE_NAME} | ${LEGAL_NAME}`;

  if (route === ROUTES.home) {
    return {
      title: homeTitle,
      description: PAGE_COPY.hero.text,
      path: ROUTES.home,
    };
  }

  if (route === ROUTES.catalog) {
    return {
      title: `${PAGE_COPY.catalog.title} | ${SITE_NAME}`,
      description: PAGE_COPY.catalog.text,
      path: ROUTES.catalog,
    };
  }

  if (route === ROUTES.categories) {
    return {
      title: `${PAGE_COPY.categories.title} | ${SITE_NAME}`,
      description: PAGE_COPY.categories.text,
      path: ROUTES.categories,
    };
  }

  if (route.startsWith(ROUTES.categoryPrefix)) {
    const categoryName = decodeURIComponent(route.replace(ROUTES.categoryPrefix, ''));
    return {
      title: `${categoryName} | ${SITE_NAME}`,
      description: `Produits ${categoryName.toLowerCase()} disponibles chez ${SITE_NAME}.`,
      path: route,
    };
  }

  if (route === ROUTES.brands) {
    return {
      title: `${PAGE_COPY.brands.title} | ${SITE_NAME}`,
      description: PAGE_COPY.brands.text,
      path: ROUTES.brands,
    };
  }

  if (route.startsWith(ROUTES.brandPrefix)) {
    const brandName = decodeURIComponent(route.replace(ROUTES.brandPrefix, ''));
    return {
      title: `${brandName} | ${SITE_NAME}`,
      description: `Produits ${brandName} disponibles chez ${SITE_NAME}.`,
      path: route,
    };
  }

  if (route.startsWith(ROUTES.productPrefix)) {
    const productKey = route.replace(ROUTES.productPrefix, '');
    const product = products.find((item) => productMatchesPath(item, productKey));

    if (product) {
      const description =
        product.description ||
        [product.brand, product.category, product.wattage].filter(Boolean).join(' | ') ||
        PAGE_COPY.product.fallbackDetails;

      return {
        title: `${product.name} | ${SITE_NAME}`,
        description,
        image: productImages(product)[0],
        path: route,
        type: 'product',
      };
    }

    return {
      title: `${PAGE_COPY.product.missingTitle} | ${SITE_NAME}`,
      description: PAGE_COPY.product.missingText,
      path: route,
    };
  }

  if (route === ROUTES.contact) {
    return {
      title: `${PAGE_COPY.contact.title} | ${SITE_NAME}`,
      description: PAGE_COPY.contact.text,
      path: ROUTES.contact,
    };
  }

  if (route === ROUTES.about) {
    return {
      title: `${PAGE_COPY.about.title} | ${SITE_NAME}`,
      description: PAGE_COPY.about.text,
      path: ROUTES.about,
    };
  }

  if (route === ROUTES.admin) {
    return {
      title: `${SITE_NAME} | Gestion`,
      description: 'Espace prive de gestion du catalogue.',
      path: ROUTES.admin,
    };
  }

  return {
    title: homeTitle,
    description: DEFAULT_DESCRIPTION,
    path: route || ROUTES.home,
  };
};

export const applyRouteMeta = (route, products = []) => {
  setPageMeta(getMetaForRoute(route, products));
};
