import { MessageCircle } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { NAV_ITEMS, ROUTES, STORE_INFO } from '../../data/siteContent.js';
import { whatsappNumber } from '../../lib/supabase.js';

export function NavBar({ currentRoute, navigate }) {
  return (
    <header className="site-header">
      <div className="site-nav">
        <a
          className="brand-lockup"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            navigate(ROUTES.home);
          }}
        >
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
          {NAV_ITEMS.map((item) => (
            <a
              className={currentRoute === item.path ? 'active' : ''}
              href={item.path}
              key={item.path}
              onClick={(event) => {
                event.preventDefault();
                navigate(item.path);
              }}
            >
              {item.label}
            </a>
          ))}
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
        <ThemeToggle className="nav-whatsapp" />
      </div>
    </header>
  );
}