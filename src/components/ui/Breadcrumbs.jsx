import { ChevronRight, Home } from 'lucide-react';
import { buildBreadcrumbs } from '../../lib/breadcrumbs.js';

export function Breadcrumbs({ route, products = [], navigate }) {
  const crumbs = buildBreadcrumbs(route, products);
  if (!crumbs.length) return null;

  return (
    <nav className="breadcrumbs" aria-label="Fil d'Ariane">
      <div className="breadcrumbs-inner">
        <ol className="breadcrumbs-list">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            if (isLast) {
              return (
                <li className="breadcrumbs-item current" aria-current="page" key={`${crumb.label}-last`}>
                  <span>{crumb.label}</span>
                </li>
              );
            }

            return (
              <li className="breadcrumbs-item" key={crumb.label}>
                <button
                  type="button"
                  className="breadcrumbs-link"
                  onClick={() => navigate(crumb.path)}
                >
                  {index === 0 && <Home size={13} className="breadcrumbs-home-icon" aria-hidden="true" />}
                  <span>{crumb.label}</span>
                </button>
                <ChevronRight size={13} className="breadcrumbs-separator" aria-hidden="true" />
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}