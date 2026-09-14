import { IconByName } from './IconByName.jsx';
import { whatsappNumber } from '../../lib/supabase.js';

export function ContactCard({ card }) {
  const href =
    card.hrefType === 'whatsapp'
      ? `https://wa.me/${whatsappNumber}`
      : card.href;
  const content = (
    <>
      <IconByName name={card.icon} />
      <span>{card.label}</span>
      <strong>{card.value}</strong>
    </>
  );

  if (!href) {
    return <div className="contact-card">{content}</div>;
  }

  return (
    <a
      className="contact-card"
      href={href}
      target={card.hrefType === 'whatsapp' ? '_blank' : undefined}
      rel={card.hrefType === 'whatsapp' ? 'noreferrer' : undefined}
    >
      {content}
    </a>
  );
}