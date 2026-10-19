import { useState } from 'react';
import { BRAND_LOGOS, PAGE_COPY } from '../../data/siteContent.js';

function BrandTile({ brand, ghost = false }) {
  const [imgFailed, setImgFailed] = useState(false);

  const content = (
    <>
      <div className="brand-logo-stage">
        {!imgFailed && brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt={brand.name}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="brand-logo-fallback" aria-hidden="true">
            {brand.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <strong>{brand.name}</strong>
    </>
  );
  const common = {
    className: 'brand-logo-card',
    'aria-hidden': ghost || undefined,
  };

  if (brand.website) {
    return (
      <a
        {...common}
        href={brand.website}
        tabIndex={ghost ? -1 : undefined}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return <div {...common}>{content}</div>;
}

export function BrandLogosSection() {
  return (
    <section className="section brand-logo-section">
      <div className="section-header">
        <div>
          <div className="section-index-row">
            <span className="section-index">01</span>
            <p className="eyebrow">{PAGE_COPY.brandLogos.eyebrow}</p>
          </div>
          <h2>{PAGE_COPY.brandLogos.title}</h2>
        </div>
        <p className="section-note">{PAGE_COPY.brandLogos.text}</p>
      </div>
      <div className="brand-logo-viewport">
        <div className="brand-logo-track">
          <div className="brand-logo-copy">
            {BRAND_LOGOS.map((brand) => (
              <BrandTile brand={brand} key={brand.name} />
            ))}
          </div>
          <div className="brand-logo-copy" data-ghost="true">
            {BRAND_LOGOS.map((brand) => (
              <BrandTile brand={brand} ghost key={`${brand.name}-clone`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}