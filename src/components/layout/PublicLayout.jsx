import { Footer } from './Footer.jsx';
import { NavBar } from './NavBar.jsx';
import { BackToTop } from '../ui/BackToTop.jsx';
import { Breadcrumbs } from '../ui/Breadcrumbs.jsx';

export function PublicLayout({ children, currentRoute, navigate, products = [] }) {
  return (
    <main>
      <NavBar currentRoute={currentRoute} navigate={navigate} />
      <Breadcrumbs route={currentRoute} products={products} navigate={navigate} />
      {children}
      <Footer navigate={navigate} />
      <BackToTop />
    </main>
  );
}