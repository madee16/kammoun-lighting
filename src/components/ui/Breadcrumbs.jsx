import { ChevronRight } from 'lucide-react';
import { buildBreadcrumbs } from '../../lib/breadcrumbs.js';

export function Breadcrumbs({ route, products = [], navigate }) {
  const crumbs = buildBreadcrumbs(route, products);
  if (!crumbs.length) return null;

  return (
    <nav className="breadcrumbs" aria-label="Fil d'Ariane">
      <ol>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          if (isLast) {
            return (
              <li aria-current="page" key={`${crumb.label}-last`}>
                {crumb.label}
              </li>
            );
          }

          return (
            <li key={crumb.label}>
              <button type="button" onClick={() => navigate(crumb.path)}>
                {crumb.label}
              </button>
              <ChevronRight size={14} aria-hidden="true" />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}