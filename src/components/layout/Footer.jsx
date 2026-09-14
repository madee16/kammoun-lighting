import { Clock3, Facebook, MapPin, MessageCircle } from 'lucide-react';
import { NAV_ITEMS, ROUTES, STORE_INFO } from '../../data/siteContent.js';
import { whatsappNumber } from '../../lib/supabase.js';

export function Footer({ navigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <button
            type="button"
            className="footer-logo"
            onClick={() => navigate(ROUTES.home)}
          >
            {STORE_INFO.brandName}
          </button>
          <p>{STORE_INFO.legalName}</p>
          <address className="footer-address">
            <MapPin size={16} />
            <span>{STORE_INFO.address}</span>
          </address>
          <div className="footer-social">
            <a href={STORE_INFO.facebookPageUrl} target="_blank" rel="noreferrer" title="Page Facebook du magasin">
              <Facebook size={17} />
              Page
            </a>
            <a href={STORE_INFO.facebookOwnerUrl} target="_blank" rel="noreferrer" title="Profil Facebook">
              <Facebook size={17} />
              Profil
            </a>
          </div>
        </div>

        <div className="footer-nav">
          <h3 className="footer-title">Navigation</h3>
          <nav>
            {NAV_ITEMS.filter((item) => item.path !== ROUTES.home).map((item) => (
              <button type="button" key={item.path} onClick={() => navigate(item.path)}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="footer-contact">
          <h3 className="footer-title">Contact</h3>
          <a
            className="footer-contact-item"
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            <span>{STORE_INFO.phone}</span>
          </a>
          <div className="footer-contact-item footer-contact-muted">
            <Clock3 size={17} />
            <span>{STORE_INFO.openingHours[0]}</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          &copy; {currentYear} {STORE_INFO.brandName}. Tous droits reserves.
        </span>
        <span>{STORE_INFO.legalName}</span>
      </div>
    </footer>
  );
}