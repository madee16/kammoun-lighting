import { ROUTES } from '../data/siteContent.js';
import { productMatchesPath } from './productUtils.js';

export function buildBreadcrumbs(route, products = []) {
  const crumbs = [{ label: 'Accueil', path: ROUTES.home }];

  if (route === ROUTES.catalog) {
    crumbs.push({ label: 'Catalogue', path: ROUTES.catalog });
  } else if (route === ROUTES.categories) {
    crumbs.push({ label: 'Categories', path: ROUTES.categories });
  } else if (route.startsWith(ROUTES.categoryPrefix)) {
    crumbs.push({ label: 'Categories', path: ROUTES.categories });
    crumbs.push({
      label: decodeURIComponent(route.replace(ROUTES.categoryPrefix, '')),
      current: true,
    });
  } else if (route === ROUTES.brands) {
    crumbs.push({ label: 'Marques', path: ROUTES.brands });
  } else if (route.startsWith(ROUTES.brandPrefix)) {
    crumbs.push({ label: 'Marques', path: ROUTES.brands });
    crumbs.push({
      label: decodeURIComponent(route.replace(ROUTES.brandPrefix, '')),
      current: true,
    });
  } else if (route.startsWith(ROUTES.productPrefix)) {
    crumbs.push({ label: 'Catalogue', path: ROUTES.catalog });
    const key = route.replace(ROUTES.productPrefix, '');
    const product = products.find((item) => productMatchesPath(item, key));
    crumbs.push({ label: product?.name || 'Produit', current: true });
  } else if (route === ROUTES.contact) {
    crumbs.push({ label: 'Contact', current: true });
  } else if (route === ROUTES.about) {
    crumbs.push({ label: 'A propos', current: true });
  } else {
    return [];
  }

  return crumbs;
}