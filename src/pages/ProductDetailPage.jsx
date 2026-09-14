import { Fragment, useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, MessageCircle, PackageSearch } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { LoadingDetail } from '../components/ui/LoadingDetail.jsx';
import { PageHero } from '../components/ui/PageHero.jsx';
import { PAGE_COPY, PRODUCT_DETAIL_FIELDS, ROUTES } from '../data/siteContent.js';
import {
  availabilityLabel,
  productImages,
  whatsappProductMessage,
} from '../lib/productUtils.js';
import { whatsappNumber } from '../lib/supabase.js';

export function ProductDetailPage({ product, loading, navigate }) {
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImage(productImages(product)[0] || '');
      setQuantity('');
    }
  }, [product]);

  if (loading) {
    return (
      <>
        <PageHero
          eyebrow={PAGE_COPY.product.fallbackEyebrow}
          title={PAGE_COPY.product.loadingTitle}
          text={PAGE_COPY.product.loadingText}
        />
        <section className="section">
          <LoadingDetail />
        </section>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <PageHero
          eyebrow="Produit"
          title={PAGE_COPY.product.missingTitle}
          text={PAGE_COPY.product.missingText}
        />
        <section className="section">
          <EmptyState
            icon={PackageSearch}
            title={PAGE_COPY.product.missingTitle}
            text={PAGE_COPY.product.missingText}
          />
          <div className="empty-state-actions">
            <button className="primary-button" type="button" onClick={() => navigate(ROUTES.catalog)}>
              <ArrowLeft size={18} />
              {PAGE_COPY.product.backToCatalog}
            </button>
          </div>
        </section>
      </>
    );
  }

  const available = product.stock_quantity > 0;
  const priceVisible = product.show_price && product.price;
  const detailMessage = whatsappProductMessage(product, 'details', quantity);
  const priceMessage = whatsappProductMessage(product, 'price', quantity);
  const availabilityMessage = whatsappProductMessage(product, 'availability', quantity);
  const images = productImages(product);

  return (
    <>
      <PageHero
        eyebrow={product.category || PAGE_COPY.product.fallbackEyebrow}
        title={product.name}
        text={product.description || PAGE_COPY.product.fallbackDetails}
      />
      <section className="section product-detail">
        <div>
          <div className="detail-image">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} decoding="async" />
            ) : (
              <ImagePlus size={46} />
            )}
            {product.is_new && <span className="badge new-badge">{PAGE_COPY.product.newBadge}</span>}
          </div>
          {images.length > 1 && (
            <div className="image-gallery">
              {images.map((image) => (
                <button
                  className={selectedImage === image ? 'active' : ''}
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-panel">
          <button className="text-button" type="button" onClick={() => navigate(ROUTES.catalog)}>
            <ArrowLeft size={17} />
            {PAGE_COPY.product.backToCatalog}
          </button>
          <p className="product-meta">
            {[product.category, product.brand].filter(Boolean).join(' | ') || PAGE_COPY.product.fallbackMeta}
          </p>
          <h2>{product.name}</h2>
          <p>{product.description || PAGE_COPY.product.fallbackDetails}</p>
          <dl className="detail-specs">
            {PRODUCT_DETAIL_FIELDS.filter((field) => product[field.key]).map((field) => (
              <Fragment key={field.key}>
                <dt>{field.label}</dt>
                <dd>{product[field.key]}</dd>
              </Fragment>
            ))}
            <dt>Disponibilite</dt>
            <dd>{availabilityLabel(product)}</dd>
          </dl>
          <label className="quantity-field">
            {PAGE_COPY.product.quantityLabel}
            <input
              type="number"
              min="1"
              placeholder={PAGE_COPY.product.quantityPlaceholder}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>
          <div className="detail-actions">
            <span className="price">
              {priceVisible ? `${product.price} TND` : PAGE_COPY.product.priceOnRequest}
            </span>
            <a
              className="whatsapp-button"
              href={`https://wa.me/${whatsappNumber}?text=${detailMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              {PAGE_COPY.product.askWhatsapp}
            </a>
            <a
              className="secondary-action"
              href={`https://wa.me/${whatsappNumber}?text=${priceMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              {PAGE_COPY.product.askPrice}
            </a>
            <a
              className="secondary-action"
              href={`https://wa.me/${whatsappNumber}?text=${availabilityMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              {PAGE_COPY.product.checkAvailability}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}