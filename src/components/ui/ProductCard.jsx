import { ArrowUpRight, ImagePlus, MessageCircle } from 'lucide-react';
import { PAGE_COPY } from '../../data/siteContent.js';
import {
  availabilityLabel,
  productImages,
  productPath,
  whatsappProductMessage,
} from '../../lib/productUtils.js';
import { whatsappNumber } from '../../lib/supabase.js';

export function ProductCard({ product, navigate }) {
  const available = product.stock_quantity > 0;
  const priceMessage = whatsappProductMessage(product, 'price');
  const priceVisible = product.show_price && product.price;
  const mainImage = productImages(product)[0];

  return (
    <article className="product-card">
      <button
        className="product-link"
        type="button"
        onClick={() => navigate(productPath(product))}
      >
        <div className="product-image">
          {mainImage ? (
            <img src={mainImage} alt={product.name} loading="lazy" decoding="async" />
          ) : (
            <ImagePlus size={34} />
          )}
          <span className={available ? 'badge in-stock' : 'badge out-stock'}>
            {availabilityLabel(product)}
          </span>
          {product.is_new && <span className="badge new-badge">{PAGE_COPY.product.newBadge}</span>}
        </div>

        <div className="product-info">
          <p className="product-meta">
            {[product.category, product.brand].filter(Boolean).join(' | ') || PAGE_COPY.product.fallbackMeta}
          </p>
          <h3>{product.name}</h3>
          <p className="product-desc">{product.description || PAGE_COPY.product.fallbackDetails}</p>
        </div>
      </button>

      <dl className="specs">
        {product.reference && (
          <>
            <dt>Ref</dt>
            <dd>{product.reference}</dd>
          </>
        )}
        {product.wattage && (
          <>
            <dt>Puissance</dt>
            <dd>{product.wattage}</dd>
          </>
        )}
        {product.color_temperature && (
          <>
            <dt>Couleur</dt>
            <dd>{product.color_temperature}</dd>
          </>
        )}
      </dl>

      <div className="product-footer">
        <span className="price">
          {priceVisible ? `${product.price} TND` : PAGE_COPY.product.priceOnRequest}
        </span>
        <div className="product-footer-actions">
          <a
            className="whatsapp-button"
            href={`https://wa.me/${whatsappNumber}?text=${priceMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            Prix
          </a>
          <button
            className="product-open"
            type="button"
            aria-label={`Ouvrir ${product.name}`}
            onClick={() => navigate(productPath(product))}
          >
            <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}