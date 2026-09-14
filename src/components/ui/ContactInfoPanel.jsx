import { ExternalLink } from 'lucide-react';
import { IconByName } from './IconByName.jsx';
import { PAGE_COPY, STORE_INFO } from '../../data/siteContent.js';
import { whatsappNumber } from '../../lib/supabase.js';

export function ContactInfoPanel({ panel, photoMessage }) {
  if (panel.type === 'openingHours') {
    return (
      <div className="info-panel">
        <IconByName name={panel.icon} size={24} />
        <h2>{panel.title}</h2>
        {STORE_INFO.openingHours.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    );
  }

  if (panel.type === 'address') {
    return (
      <div className="info-panel">
        <IconByName name={panel.icon} size={24} />
        <h2>{panel.title}</h2>
        <p>{STORE_INFO.address}</p>
        {STORE_INFO.mapUrl ? (
          <a href={STORE_INFO.mapUrl} target="_blank" rel="noreferrer">
            {PAGE_COPY.contact.mapsCta} <ExternalLink size={16} />
          </a>
        ) : (
          <p>{PAGE_COPY.contact.missingAddress}</p>
        )}
      </div>
    );
  }

  return (
    <div className="info-panel">
      <IconByName name={panel.icon} size={24} />
      <h2>{panel.title}</h2>
      <p>{PAGE_COPY.contact.photoText}</p>
      <a
        className="whatsapp-button"
        href={`https://wa.me/${whatsappNumber}?text=${photoMessage}`}
        target="_blank"
        rel="noreferrer"
      >
        {PAGE_COPY.contact.photoCta}
      </a>
    </div>
  );
}