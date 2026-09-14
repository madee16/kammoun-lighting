import { useEffect, useState } from 'react';
import { PublicLayout } from './components/layout/PublicLayout.jsx';
import { ROUTES } from './data/siteContent.js';
import { useProducts } from './hooks/useProducts.js';
import { applyRouteMeta } from './lib/seo.js';
import { currentRoute as getCurrentRoute, productMatchesPath } from './lib/productUtils.js';
import { AboutPage } from './pages/AboutPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { BrandsPage } from './pages/BrandsPage.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { CategoriesPage } from './pages/CategoriesPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';

const isKnownRoute = (route) =>
  route === ROUTES.home ||
  route === ROUTES.catalog ||
  route === ROUTES.categories ||
  route === ROUTES.brands ||
  route === ROUTES.contact ||
  route === ROUTES.about ||
  route.startsWith(ROUTES.categoryPrefix) ||
  route.startsWith(ROUTES.brandPrefix) ||
  route.startsWith(ROUTES.productPrefix);

function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute());
  const { products, loading } = useProducts();

  useEffect(() => {
    const onPopState = () => setCurrentRoute(getCurrentRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    applyRouteMeta(currentRoute, products);
  }, [currentRoute, products]);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(getCurrentRoute());
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  if (currentRoute === ROUTES.admin) {
    return <AdminPage />;
  }

  if (currentRoute === ROUTES.catalog) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate} products={products}>
        <CatalogPage
          products={products}
          loading={loading}
          navigate={navigate}
        />
      </PublicLayout>
    );
  }

  if (currentRoute === ROUTES.categories) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate} products={products}>
        <CategoriesPage products={products} navigate={navigate} />
      </PublicLayout>
    );
  }

  if (currentRoute.startsWith(ROUTES.categoryPrefix)) {
    const categoryName = decodeURIComponent(currentRoute.replace(ROUTES.categoryPrefix, ''));

    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate} products={products}>
        <CatalogPage
          key={currentRoute}
          products={products}
          loading={loading}
          navigate={navigate}
          initialCategory={categoryName}
          eyebrow="Categorie"
          title={categoryName}
          text="Produits filtres par categorie."
        />
      </PublicLayout>
    );
  }

  if (currentRoute === ROUTES.brands) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate} products={products}>
        <BrandsPage products={products} navigate={navigate} />
      </PublicLayout>
    );
  }

  if (currentRoute.startsWith(ROUTES.brandPrefix)) {
    const brandName = decodeURIComponent(currentRoute.replace(ROUTES.brandPrefix, ''));

    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate} products={products}>
        <CatalogPage
          key={currentRoute}
          products={products}
          loading={loading}
          navigate={navigate}
          initialBrand={brandName}
          eyebrow="Marque"
          title={brandName}
          text="Produits filtres par marque."
        />
      </PublicLayout>
    );
  }

  if (currentRoute.startsWith(ROUTES.productPrefix)) {
    const productKey = currentRoute.replace(ROUTES.productPrefix, '');
    const product = products.find((item) => productMatchesPath(item, productKey));

    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate} products={products}>
        <ProductDetailPage
          product={product}
          loading={loading}
          navigate={navigate}
        />
      </PublicLayout>
    );
  }

  if (currentRoute === ROUTES.contact) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate} products={products}>
        <ContactPage />
      </PublicLayout>
    );
  }

  if (currentRoute === ROUTES.about) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate} products={products}>
        <AboutPage navigate={navigate} />
      </PublicLayout>
    );
  }

  if (!isKnownRoute(currentRoute)) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate} products={products}>
        <NotFoundPage navigate={navigate} />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout currentRoute={ROUTES.home} navigate={navigate} products={products}>
      <HomePage products={products} loading={loading} navigate={navigate} />
    </PublicLayout>
  );
}

export default App;