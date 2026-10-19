import { useEffect, useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { NAV_ITEMS, ROUTES, STORE_INFO } from '../../data/siteContent.js';
import { whatsappNumber } from '../../lib/supabase.js';

const HOME_SECTION_NAV = [
  ['.category-band', ROUTES.home],
  ['.marquee', ROUTES.home],
  ['.brand-panel', ROUTES.brands],
  ['.brand-logo-section', ROUTES.brands],
  ['.intro-spotlight', ROUTES.catalog],
  ['.featured-section', ROUTES.catalog],
  ['.trust-section', ROUTES.catalog],
  ['.testimonials-section', ROUTES.contact],
];

export function NavBar({ currentRoute, navigate, isNavigating = false }) {
  const [progress, setProgress] = useState(0);
  const [sectionPath, setSectionPath] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navigatingPath, setNavigatingPath] = useState(null);
  const activePath = currentRoute === ROUTES.home && sectionPath ? sectionPath : currentRoute;

  useEffect(() => {
    if (!isNavigating) {
      setNavigatingPath(null);
    }
  }, [isNavigating]);

  useEffect(() => {
    setMenuOpen(false);
  }, [currentRoute]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (currentRoute !== ROUTES.home) {
      setSectionPath(null);
      return;
    }

    const pathByEl = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setSectionPath(pathByEl.get(visible.target));
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0.1, 0.4, 0.8] },
    );

    HOME_SECTION_NAV.forEach(([selector, path]) => {
      document.querySelectorAll(selector).forEach((element) => {
        pathByEl.set(element, path);
        observer.observe(element);
      });
    });

    return () => observer.disconnect();
  }, [currentRoute]);

  const go = (event, path) => {
    event.preventDefault();
    if (path !== currentRoute) {
      setNavigatingPath(path);
    }
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="site-header">
        <div className={`site-nav${isNavigating ? ' is-navigating' : ''}`}>
          <button
            aria-controls="mobile-nav"
            aria-expanded={menuOpen}
            aria-label="Ouvrir le menu"
            className="mobile-menu-button"
            onClick={() => setMenuOpen(true)}
            type="button"
          >
            <Menu size={20} />
          </button>
          <a className="brand-lockup" href="/" onClick={(event) => go(event, ROUTES.home)}>
            <img
              className="brand-logo"
              src={STORE_INFO.logoPath}
              alt={STORE_INFO.brandName}
            />
            <span>
              <strong>{STORE_INFO.brandName}</strong>
              <small>{STORE_INFO.legalName}</small>
            </span>
          </a>
          <nav aria-label="Navigation principale">
            {NAV_ITEMS.map((item) => {
              const isActive = activePath === item.path;
              const isTarget = isNavigating && navigatingPath === item.path;
              return (
                <a
                  className={`${isActive ? 'active' : ''}${isTarget ? ' is-nav-target' : ''}`}
                  href={item.path}
                  key={item.path}
                  onClick={(event) => go(event, item.path)}
                >
                  <span>{item.label}</span>
                  {isTarget && <span className="nav-shimmer-dot" aria-hidden="true" />}
                </a>
              );
            })}
          </nav>
          <a
            className="nav-whatsapp"
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            title="WhatsApp"
          >
            <MessageCircle size={19} />
          </a>
        </div>
        <div className="scroll-progress" aria-hidden="true">
          <span
            className="scroll-progress-bar"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </header>

      {menuOpen && (
        <>
          <button
            aria-hidden="true"
            className="mobile-nav-scrim"
            onClick={() => setMenuOpen(false)}
            tabIndex={-1}
            type="button"
          />
          <aside aria-label="Menu" className="mobile-nav" id="mobile-nav">
            <div className="mobile-nav-head">
              <strong>Menu</strong>
              <button
                aria-label="Fermer le menu"
                className="mobile-nav-close"
                onClick={() => setMenuOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="mobile-nav-links">
              {NAV_ITEMS.map((item) => {
                const isActive = activePath === item.path;
                const isTarget = isNavigating && navigatingPath === item.path;
                return (
                  <a
                    className={`${isActive ? 'active' : ''}${isTarget ? ' is-nav-target' : ''}`}
                    href={item.path}
                    key={item.path}
                    onClick={(event) => go(event, item.path)}
                  >
                    <span>{item.label}</span>
                    {isTarget && <span className="nav-shimmer-dot" aria-hidden="true" />}
                  </a>
                );
              })}
            </nav>
            <div className="mobile-nav-extra">
              <a href={ROUTES.categories} onClick={(event) => go(event, ROUTES.categories)}>
                Toutes les categories
              </a>
              <a href={ROUTES.brands} onClick={(event) => go(event, ROUTES.brands)}>
                Toutes les marques
              </a>
            </div>
            <a
              className="mobile-nav-whatsapp"
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              Ecrire sur WhatsApp
            </a>
          </aside>
        </>
      )}
    </>
  );
}