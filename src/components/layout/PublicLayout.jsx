import { Footer } from './Footer.jsx';
import { NavBar } from './NavBar.jsx';
import { BackToTop } from '../ui/BackToTop.jsx';
import { Breadcrumbs } from '../ui/Breadcrumbs.jsx';
import { FloatingWhatsApp } from '../ui/FloatingWhatsApp.jsx';
import { PageLoader } from '../ui/PageLoader.jsx';

export function PublicLayout({
  children,
  currentRoute,
  navigate,
  products = [],
  isNavigating = false,
}) {
  return (
    <main>
      <PageLoader isNavigating={isNavigating} />
      <NavBar currentRoute={currentRoute} navigate={navigate} isNavigating={isNavigating} />
      <Breadcrumbs route={currentRoute} products={products} navigate={navigate} />
      <div
        className={`page-content-wrapper${isNavigating ? ' page-loading' : ' page-entered'}`}
        key={currentRoute}
      >
        {children}
      </div>
      <Footer navigate={navigate} />
      <BackToTop />
      <FloatingWhatsApp />
    </main>
  );
}