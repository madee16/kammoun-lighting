import { lazy, Suspense, useEffect, useState } from 'react';
import { PublicLayout } from './components/layout/PublicLayout.jsx';
import { ROUTES } from './data/siteContent.js';
import { useProducts } from './hooks/useProducts.js';
import { applyRouteMeta } from './lib/seo.js';
import { currentRoute as getCurrentRoute, productMatchesPath } from './lib/productUtils.js';
import { AboutPage } from './pages/AboutPage.jsx';
import { BrandsPage } from './pages/BrandsPage.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';

const AdminPage = lazy(() =>
  import('./pages/AdminPage.jsx').then((module) => ({ default: module.AdminPage })),
);
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
  const [isNavigating, setIsNavigating] = useState(false);
  const { products, loading } = useProducts();

  useEffect(() => {
    const onPopState = () => {
      setIsNavigating(true);
      setCurrentRoute(getCurrentRoute());
      window.scrollTo({ top: 0, behavior: 'auto' });
      const timer = window.setTimeout(() => setIsNavigating(false), 240);
      return () => window.clearTimeout(timer);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    applyRouteMeta(currentRoute, products);
  }, [currentRoute, products]);

  const navigate = (path) => {
    if (path === currentRoute) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }

    setIsNavigating(true);

    window.setTimeout(() => {
      window.history.pushState({}, '', path);
      setCurrentRoute(getCurrentRoute());
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'auto' });

      window.setTimeout(() => {
        setIsNavigating(false);
      }, 160);
    }, 110);
  };

  if (currentRoute === ROUTES.admin) {
    return (
      <Suspense
        fallback={
          <main className="admin-shell">
            <div className="login-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p className="eyebrow">{ROUTES.admin}</p>
              <h2>Chargement de la gestion...</h2>
            </div>
          </main>
        }
      >
        <AdminPage />
      </Suspense>
    );
  }

  const renderPublicPage = () => {
    if (currentRoute === ROUTES.catalog) {
      return (
        <CatalogPage
          products={products}
          loading={loading}
          navigate={navigate}
        />
      );
    }

    if (currentRoute === ROUTES.categories) {
      return <CategoriesPage products={products} navigate={navigate} />;
    }

    if (currentRoute.startsWith(ROUTES.categoryPrefix)) {
      const categoryName = decodeURIComponent(currentRoute.replace(ROUTES.categoryPrefix, ''));
      return (
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
      );
    }

    if (currentRoute === ROUTES.brands) {
      return <BrandsPage products={products} navigate={navigate} />;
    }

    if (currentRoute.startsWith(ROUTES.brandPrefix)) {
      const brandName = decodeURIComponent(currentRoute.replace(ROUTES.brandPrefix, ''));
      return (
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
      );
    }

    if (currentRoute.startsWith(ROUTES.productPrefix)) {
      const productKey = currentRoute.replace(ROUTES.productPrefix, '');
      const product = products.find((item) => productMatchesPath(item, productKey));
      return (
        <ProductDetailPage
          product={product}
          loading={loading}
          navigate={navigate}
        />
      );
    }

    if (currentRoute === ROUTES.contact) {
      return <ContactPage />;
    }

    if (currentRoute === ROUTES.about) {
      return <AboutPage navigate={navigate} />;
    }

    if (!isKnownRoute(currentRoute)) {
      return <NotFoundPage navigate={navigate} />;
    }

    return <HomePage products={products} loading={loading} navigate={navigate} />;
  };

  return (
    <PublicLayout
      currentRoute={currentRoute}
      navigate={navigate}
      products={products}
      isNavigating={isNavigating}
    >
      {renderPublicPage()}
    </PublicLayout>
  );
}

export default App;