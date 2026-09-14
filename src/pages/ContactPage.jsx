import { ContactCard } from '../components/ui/ContactCard.jsx';
import { ContactInfoPanel } from '../components/ui/ContactInfoPanel.jsx';
import { PageHero } from '../components/ui/PageHero.jsx';
import { CONTACT_CARDS, CONTACT_INFO_PANELS, PAGE_COPY } from '../data/siteContent.js';
import { whatsappSimpleMessage } from '../lib/productUtils.js';

export function ContactPage() {
  const photoMessage = whatsappSimpleMessage(PAGE_COPY.contact.photoMessage);

  return (
    <>
      <PageHero
        eyebrow={PAGE_COPY.contact.eyebrow}
        title={PAGE_COPY.contact.title}
        text={PAGE_COPY.contact.text}
      />
      <section className="section contact-grid">
        {CONTACT_CARDS.map((card) => (
          <ContactCard key={card.label} card={card} />
        ))}
      </section>
      <section className="section contact-details">
        {CONTACT_INFO_PANELS.map((panel) => (
          <ContactInfoPanel key={panel.title} panel={panel} photoMessage={photoMessage} />
        ))}
      </section>
    </>
  );
}