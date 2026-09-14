import { Home, PackageSearch } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero.jsx';
import { ROUTES } from '../data/siteContent.js';

export function NotFoundPage({ navigate }) {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="Page introuvable"
        text="La page que vous cherchez n'existe pas ou a ete deplacee."
      />
      <section className="section">
        <div className="empty-state-actions">
          <button className="primary-button" type="button" onClick={() => navigate(ROUTES.home)}>
            <Home size={18} />
            Retour a l'accueil
          </button>
          <button className="secondary-button" type="button" onClick={() => navigate(ROUTES.catalog)}>
            <PackageSearch size={18} />
            Voir le catalogue
          </button>
        </div>
      </section>
    </>
  );
}