import { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { PAGE_COPY, ROUTES } from '../../data/siteContent.js';
import {
  availabilityLabel,
  cleanSlug,
  productImages,
  productPath,
  whatsappProductMessage,
} from '../../lib/productUtils.js';
import { whatsappNumber } from '../../lib/supabase.js';

export function BrandStrip({ products = [], navigate, spotlights }) {
  const brands = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ].slice(0, 6);

  const featured = spotlights && spotlights.length
    ? spotlights
    : products.filter((p) => p.featured).slice(0, 4);
  const items = (featured.length ? featured : products.slice(0, 4)).filter(Boolean);
  const count = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const safeIndex = count ? Math.min(active, count - 1) : 0;

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = window.setInterval(() => setActive((prev) => (prev + 1) % count), 6000);
    return () => window.clearInterval(id);
  }, [count, paused]);

  useEffect(() => {
    setActive(0);
  }, [count]);

  if (!brands.length && !items.length) return null;

  return (
    <section className="brand-panel" aria-label={PAGE_COPY.brands.eyebrow}>
      <div className="brand-panel-head">
        <div className="brand-panel-heading">
          <p className="eyebrow">{PAGE_COPY.brands.eyebrow}</p>
          <h2 className="brand-panel-title">{PAGE_COPY.brands.title}</h2>
        </div>
        {PAGE_COPY.brands.text && <p className="brand-panel-note">{PAGE_COPY.brands.text}</p>}
      </div>

      {brands.length > 0 && (
        <div className="brand-panel-grid">
          {brands.map((brand, index) => (
            <button
              type="button"
              key={brand}
              className="brand-chip"
              onClick={() => navigate(`/marque/${cleanSlug(brand)}`)}
            >
              <span className="brand-chip-index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="brand-chip-name">{brand}</span>
              <ArrowRight className="brand-chip-arrow" size={16} />
            </button>
          ))}
        </div>
      )}

      {count > 0 && (
        <aside
          className="brand-spotlight hero-spotlight"
          aria-label={items[safeIndex].name}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="spotlight-stack">
            {items.map((product, i) => {
              const image = productImages(product)[0];
              const activeSlide = i === safeIndex;
              return (
                <div
                  className={`spotlight-slide${activeSlide ? ' active' : ''}`}
                  key={product.id || product.reference || product.name}
                  aria-hidden={!activeSlide}
                  inert={!activeSlide}
                >
                  {image && (
                    <div className="spotlight-frame">
                      <img src={image} alt={product.name} loading="eager" decoding="async" />
                    </div>
                  )}
                  <div className="spotlight-content">
                    <div className="spotlight-tag-row">
                      <span className="spotlight-featured-pill">Produit a la une</span>
                      <p className="eyebrow">
                        {[product.category, product.brand].filter(Boolean).join(' | ')}
                      </p>
                    </div>
                    <h3 className="spotlight-title">{product.name}</h3>
                    {product.description && (
                      <p className="spotlight-description">{product.description}</p>
                    )}
                    <div className="spotlight-meta-row">
                      <span className="spotlight-meta">{availabilityLabel(product)}</span>
                      {product.wattage && (
                        <span className="spotlight-spec">{product.wattage}</span>
                      )}
                      {product.colorTemperature && (
                        <span className="spotlight-spec">{product.colorTemperature}</span>
                      )}
                    </div>
                    <div className="spotlight-actions">
                      <button
                        className="spotlight-view"
                        type="button"
                        onClick={() => navigate(productPath(product))}
                      >
                        Voir la fiche produit
                        <ArrowRight size={16} />
                      </button>
                      <a
                        className="spotlight-wa"
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappProductMessage(product, 'details')}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${PAGE_COPY.product.askWhatsapp} ${product.name}`}
                      >
                        <MessageCircle size={16} />
                        <span>Demander sur WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {count > 1 && (
            <div className="spotlight-dots" role="tablist" aria-label="Produits a la une">
              {items.map((product, i) => (
                <button
                  className={`spotlight-dot${i === safeIndex ? ' active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={i === safeIndex}
                  aria-label={`Produit ${i + 1}`}
                  key={product.id || product.reference || product.name}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
          )}
        </aside>
      )}

      <div className="brand-panel-foot">
        <button type="button" className="brand-panel-cta" onClick={() => navigate(ROUTES.brands)}>
          {PAGE_COPY.brands.allCta}
        </button>
      </div>
    </section>
  );
}