import { Fragment, useEffect, useMemo, useState } from 'react';
import readXlsxFile from 'read-excel-file/browser';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  Edit3,
  ExternalLink,
  Filter,
  ImagePlus,
  LogIn,
  LogOut,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Tags,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  ABOUT_FACTS,
  ADMIN_CHECKBOX_FIELDS,
  ADMIN_COPY,
  ADMIN_FILE_ACTIONS,
  ADMIN_STATS,
  ADMIN_TEXT_FIELDS,
  AVAILABILITY_OPTIONS,
  BRAND_LOGOS,
  CONTACT_CARDS,
  CONTACT_INFO_PANELS,
  DEFAULT_CATEGORIES,
  EMPTY_PRODUCT,
  NAV_ITEMS,
  PAGE_COPY,
  PRODUCT_DETAIL_FIELDS,
  ROUTES,
  STORE_INFO,
  TESTIMONIALS,
} from './data/siteContent.js';
import { sampleProducts } from './data/sampleProducts.js';
import { mapCsvProduct, parseCsv } from './lib/csv.js';
import {
  availabilityLabel,
  cleanSlug,
  currentRoute as getCurrentRoute,
  productImages,
  productMatchesPath,
  productPath,
  sortProducts,
  uniqueProductValues,
  whatsappProductMessage,
  whatsappSimpleMessage,
} from './lib/productUtils.js';
import { spreadsheetRowsToProducts } from './lib/spreadsheet.js';
import { hasSupabaseConfig, supabase, whatsappNumber } from './lib/supabase.js';

function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute());
  const { products, loading } = useProducts();

  useEffect(() => {
    const onPopState = () => setCurrentRoute(getCurrentRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(getCurrentRoute());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentRoute === ROUTES.admin) {
    return <AdminPage />;
  }

  if (currentRoute === ROUTES.catalog) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <CatalogPage
          products={products}
          loading={loading}
          navigate={navigate}
        />
      </PublicLayout>
    );
  }

  if (currentRoute === ROUTES.categories) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <CategoriesPage products={products} navigate={navigate} />
      </PublicLayout>
    );
  }

  if (currentRoute.startsWith(ROUTES.categoryPrefix)) {
    const categoryName = decodeURIComponent(currentRoute.replace(ROUTES.categoryPrefix, ''));

    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <CatalogPage
          key={currentRoute}
          products={products}
          loading={loading}
          navigate={navigate}
          initialCategory={categoryName}
          eyebrow="Categorie"
          title={categoryName}
          text="Produits filtres par categorie."
        />
      </PublicLayout>
    );
  }

  if (currentRoute === ROUTES.brands) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <BrandsPage products={products} navigate={navigate} />
      </PublicLayout>
    );
  }

  if (currentRoute.startsWith(ROUTES.brandPrefix)) {
    const brandName = decodeURIComponent(currentRoute.replace(ROUTES.brandPrefix, ''));

    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <CatalogPage
          key={currentRoute}
          products={products}
          loading={loading}
          navigate={navigate}
          initialBrand={brandName}
          eyebrow="Marque"
          title={brandName}
          text="Produits filtres par marque."
        />
      </PublicLayout>
    );
  }

  if (currentRoute.startsWith(ROUTES.productPrefix)) {
    const productKey = currentRoute.replace(ROUTES.productPrefix, '');
    const product = products.find((item) => productMatchesPath(item, productKey));

    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <ProductDetailPage
          product={product}
          loading={loading}
          navigate={navigate}
        />
      </PublicLayout>
    );
  }

  if (currentRoute === ROUTES.contact) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <ContactPage />
      </PublicLayout>
    );
  }

  if (currentRoute === ROUTES.about) {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <AboutPage navigate={navigate} />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout currentRoute={ROUTES.home} navigate={navigate}>
      <HomePage products={products} loading={loading} navigate={navigate} />
    </PublicLayout>
  );
}

function useProducts() {
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(hasSupabaseConfig);

  useEffect(() => {
    const loadProducts = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('name');

      if (!error) {
        setProducts(sortProducts(data || []));
      }

      setLoading(false);
    };

    loadProducts();
  }, []);

  return { products, loading };
}

function PublicLayout({ children, currentRoute, navigate }) {
  return (
    <main>
      <NavBar currentRoute={currentRoute} navigate={navigate} />
      {children}
      <Footer navigate={navigate} />
    </main>
  );
}

function HomePage({ products, loading, navigate }) {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  const fallbackProducts = products.slice(0, 3);

  return (
    <>
      <Hero navigate={navigate} />
      <CategoryHighlights navigate={navigate} />
      <BrandStrip products={products} navigate={navigate} />
      <BrandLogosSection />
      <section className="section home-intro">
        <div>
          <p className="eyebrow">{PAGE_COPY.homeIntro.eyebrow}</p>
          <h2>{PAGE_COPY.homeIntro.title}</h2>
        </div>
        <p>{PAGE_COPY.homeIntro.text}</p>
      </section>

      <section className="section featured-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">{PAGE_COPY.featured.eyebrow}</p>
            <h2>{PAGE_COPY.featured.title}</h2>
          </div>
          <button
            className="secondary-action"
            type="button"
            onClick={() => navigate(ROUTES.catalog)}
          >
            {PAGE_COPY.featured.cta}
          </button>
        </div>

        {loading ? (
          <div className="empty-state">{PAGE_COPY.featured.loading}</div>
        ) : featuredProducts.length || fallbackProducts.length ? (
          <div className="product-grid compact-grid">
            {(featuredProducts.length ? featuredProducts : fallbackProducts).map((product) => (
              <ProductCard
                key={product.id || product.reference || product.name}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">{PAGE_COPY.featured.empty}</div>
        )}
      </section>

      <section className="section trust-section">
        <div className="trust-panel">
          <p className="eyebrow">{PAGE_COPY.trust.eyebrow}</p>
          <h2>{PAGE_COPY.trust.title}</h2>
          <p>{PAGE_COPY.trust.text}</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => navigate(ROUTES.about)}>
              {PAGE_COPY.trust.aboutCta}
            </button>
            <button className="secondary-action" type="button" onClick={() => navigate(ROUTES.contact)}>
              {PAGE_COPY.trust.contactCta}
            </button>
          </div>
        </div>
      </section>
      <TestimonialsSection />
    </>
  );
}

function BrandLogosSection() {
  return (
    <section className="section brand-logo-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">{PAGE_COPY.brandLogos.eyebrow}</p>
          <h2>{PAGE_COPY.brandLogos.title}</h2>
        </div>
        <p className="section-note">{PAGE_COPY.brandLogos.text}</p>
      </div>
      <div className="brand-logo-grid">
        {BRAND_LOGOS.map((brand) => {
          const content = (
            <>
              <img src={brand.logoUrl} alt={brand.name} />
              <strong>{brand.name}</strong>
            </>
          );

          return brand.website ? (
            <a
              className="brand-logo-card"
              href={brand.website}
              key={brand.name}
              target="_blank"
              rel="noreferrer"
            >
              {content}
            </a>
          ) : (
            <div className="brand-logo-card" key={brand.name}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [visitorName, setVisitorName] = useState('');
  const [visitorLocation, setVisitorLocation] = useState('');
  const [comment, setComment] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [approvedTestimonials, setApprovedTestimonials] = useState(TESTIMONIALS);

  useEffect(() => {
    const loadTestimonials = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('testimonials')
        .select('id,name,location,comment,created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (!error && data?.length) {
        setApprovedTestimonials(
          data.map((testimonial) => ({
            ...testimonial,
            text: testimonial.comment,
          })),
        );
      }
    };

    loadTestimonials();
  }, []);

  const submitComment = async (event) => {
    event.preventDefault();

    if (!visitorName.trim() || !comment.trim()) {
      setFormStatus(PAGE_COPY.testimonials.missingFieldsMessage);
      return;
    }

    if (!supabase) {
      setFormStatus(PAGE_COPY.testimonials.errorMessage);
      return;
    }

    const { error } = await supabase.from('testimonials').insert({
      name: visitorName.trim(),
      location: visitorLocation.trim() || null,
      comment: comment.trim(),
      approved: false,
    });

    if (error) {
      setFormStatus(PAGE_COPY.testimonials.errorMessage);
      return;
    }

    setVisitorName('');
    setVisitorLocation('');
    setComment('');
    setFormStatus(PAGE_COPY.testimonials.successMessage);
  };

  return (
    <section className="section testimonials-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">{PAGE_COPY.testimonials.eyebrow}</p>
          <h2>{PAGE_COPY.testimonials.title}</h2>
        </div>
        <p className="section-note">{PAGE_COPY.testimonials.text}</p>
      </div>
      <div className="testimonial-layout">
        <div className="testimonial-grid">
          {approvedTestimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.id || testimonial.name}>
              <p>{testimonial.text}</p>
              <div>
                <strong>{testimonial.name}</strong>
                {testimonial.location && <span>{testimonial.location}</span>}
              </div>
            </article>
          ))}
        </div>
        <form className="comment-form" onSubmit={submitComment}>
          <h3>{PAGE_COPY.testimonials.formTitle}</h3>
          <input
            value={visitorName}
            onChange={(event) => setVisitorName(event.target.value)}
            placeholder={PAGE_COPY.testimonials.namePlaceholder}
          />
          <input
            value={visitorLocation}
            onChange={(event) => setVisitorLocation(event.target.value)}
            placeholder={PAGE_COPY.testimonials.locationPlaceholder}
          />
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={PAGE_COPY.testimonials.commentPlaceholder}
            rows="4"
          />
          <button className="primary-button" type="submit">
            {PAGE_COPY.testimonials.submitLabel}
          </button>
          <p>{PAGE_COPY.testimonials.helperText}</p>
          {formStatus && <p className="form-status">{formStatus}</p>}
        </form>
      </div>
    </section>
  );
}

function CatalogPage({
  products,
  loading,
  navigate,
  initialCategory = 'Tous',
  initialBrand = 'Toutes',
  eyebrow = PAGE_COPY.catalog.eyebrow,
  title = PAGE_COPY.catalog.title,
  text = PAGE_COPY.catalog.text,
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const [stockOnly, setStockOnly] = useState(false);

  const categories = useMemo(
    () => [
      'Tous',
      ...new Set([
        ...DEFAULT_CATEGORIES.map((item) => item.name),
        ...products.map((item) => item.category).filter(Boolean),
      ]),
    ],
    [products],
  );
  const brands = useMemo(
    () => ['Toutes', ...new Set(products.map((item) => item.brand).filter(Boolean))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesText = [
        product.name,
        product.brand,
        product.category,
        product.reference,
        product.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle);
      const matchesCategory = category === 'Tous' || product.category === category;
      const matchesBrand = brand === 'Toutes' || product.brand === brand;
      const matchesStock = !stockOnly || product.stock_quantity > 0;

      return matchesText && matchesCategory && matchesBrand && matchesStock;
    });
  }, [brand, category, products, query, stockOnly]);

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        text={text}
      />
      <section className="section catalog-section">
        <div className="filters" aria-label="Filtres du catalogue">
          <label className="search-field">
            <Search size={18} />
            <input
              type="search"
              placeholder={PAGE_COPY.catalog.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label>
            <Filter size={16} />
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            <PackageSearch size={16} />
            <select value={brand} onChange={(event) => setBrand(event.target.value)}>
              {brands.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <button
            className={stockOnly ? 'toggle active' : 'toggle'}
            type="button"
            onClick={() => setStockOnly((value) => !value)}
          >
            <CheckCircle2 size={17} />
            {PAGE_COPY.catalog.stockOnly}
          </button>
        </div>

        {loading ? (
          <div className="empty-state">{PAGE_COPY.catalog.loading}</div>
        ) : filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id || product.reference || product.name}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">{PAGE_COPY.catalog.empty}</div>
        )}
      </section>
    </>
  );
}

function ProductDetailPage({ product, loading, navigate }) {
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
          <div className="empty-state">{PAGE_COPY.product.loadingText}</div>
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
          <button className="primary-button" type="button" onClick={() => navigate(ROUTES.catalog)}>
            <ArrowLeft size={18} />
            {PAGE_COPY.product.backToCatalog}
          </button>
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
              <img src={selectedImage} alt={product.name} />
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
                  <img src={image} alt="" />
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

function ContactPage() {
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

function IconByName({ name, size = 26 }) {
  const icons = {
    building: Building2,
    clock: Clock3,
    map: MapPin,
    phone: Phone,
    tags: Tags,
    whatsapp: MessageCircle,
  };
  const Icon = icons[name] || MessageCircle;
  return <Icon size={size} />;
}

function ContactCard({ card }) {
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

function ContactInfoPanel({ panel, photoMessage }) {
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

function AboutPage({ navigate }) {
  return (
    <>
      <PageHero
        eyebrow={PAGE_COPY.about.eyebrow}
        title={PAGE_COPY.about.title}
        text={PAGE_COPY.about.text}
      />
      <section className="section about-layout">
        <div className="about-copy">
          <p className="eyebrow">{PAGE_COPY.about.sectionEyebrow}</p>
          <h2>{PAGE_COPY.about.sectionTitle}</h2>
          <p>{PAGE_COPY.about.sectionText}</p>
          <button className="primary-button" type="button" onClick={() => navigate(ROUTES.catalog)}>
            {PAGE_COPY.about.cta}
          </button>
        </div>
        <div className="about-facts">
          {ABOUT_FACTS.map((fact) => (
            <div key={fact.label}>
              <IconByName name={fact.icon} size={22} />
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CategoriesPage({ products, navigate }) {
  const categories = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.name).length,
  }));

  return (
    <>
      <PageHero
        eyebrow={PAGE_COPY.categories.eyebrow}
        title={PAGE_COPY.categories.title}
        text={PAGE_COPY.categories.text}
      />
      <section className="section tile-grid">
        {categories.map((category) => (
          <button
            className="large-tile"
            key={category.name}
            type="button"
            onClick={() => navigate(`/categorie/${cleanSlug(category.name)}`)}
          >
            <span>{category.name}</span>
            <p>{category.text}</p>
            <strong>{category.count ? `${category.count} produit(s)` : PAGE_COPY.categories.emptyCount}</strong>
          </button>
        ))}
      </section>
    </>
  );
}

function BrandsPage({ products, navigate }) {
  const brands = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ].sort();

  return (
    <>
      <PageHero
        eyebrow={PAGE_COPY.brands.eyebrow}
        title={PAGE_COPY.brands.title}
        text={PAGE_COPY.brands.text}
      />
      <section className="section tile-grid">
        {(brands.length ? brands : PAGE_COPY.brands.fallback).map((brand) => (
          <button
            className="large-tile brand-tile"
            key={brand}
            type="button"
            onClick={() => navigate(`/marque/${cleanSlug(brand)}`)}
          >
            <span>{brand}</span>
            <p>{PAGE_COPY.brands.tileText}</p>
          </button>
        ))}
      </section>
    </>
  );
}

function BrandStrip({ products, navigate }) {
  const brands = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ].slice(0, 6);

  if (!brands.length) return null;

  return (
    <section className="brand-strip" aria-label={PAGE_COPY.brands.eyebrow}>
      <span>{PAGE_COPY.brands.eyebrow}</span>
      {brands.map((brand) => (
        <button
          type="button"
          key={brand}
          onClick={() => navigate(`/marque/${cleanSlug(brand)}`)}
        >
          {brand}
        </button>
      ))}
      <button type="button" onClick={() => navigate(ROUTES.brands)}>
        {PAGE_COPY.brands.allCta}
      </button>
    </section>
  );
}

function NavBar({ currentRoute, navigate }) {
  return (
    <header className="site-nav">
      <a
        className="brand-lockup"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          navigate(ROUTES.home);
        }}
      >
        <img className="brand-logo" src={STORE_INFO.logoPath} alt={STORE_INFO.brandName} />
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
    </header>
  );
}

function Hero({ navigate }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{PAGE_COPY.hero.eyebrow}</p>
        <h1>{PAGE_COPY.hero.title}</h1>
        <p>{PAGE_COPY.hero.text}</p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => navigate(ROUTES.catalog)}>
            {PAGE_COPY.hero.catalogCta}
          </button>
          <a
            className="secondary-button"
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            {PAGE_COPY.hero.contactCta}
          </a>
        </div>
      </div>
    </section>
  );
}

function PageHero({ eyebrow, title, text }) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function CategoryHighlights({ navigate }) {
  return (
    <section className="category-band" aria-label="Gammes de produits">
      {DEFAULT_CATEGORIES.map((item) => (
        <button
          className="category-tile"
          key={item.name}
          type="button"
          onClick={() => navigate(`/categorie/${cleanSlug(item.name)}`)}
          aria-label={item.name}
        >
          <span>{item.name}</span>
          <p>{item.text}</p>
        </button>
      ))}
    </section>
  );
}

function ProductCard({ product, navigate }) {
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
            <img src={mainImage} alt={product.name} />
          ) : (
            <ImagePlus size={34} />
          )}
          <span className={available ? 'badge in-stock' : 'badge out-stock'}>
            {availabilityLabel(product)}
          </span>
          {product.is_new && <span className="badge new-badge">{PAGE_COPY.product.newBadge}</span>}
        </div>
        <div>
          <p className="product-meta">
            {[product.category, product.brand].filter(Boolean).join(' | ') || PAGE_COPY.product.fallbackMeta}
          </p>
          <h3>{product.name}</h3>
          <p>{product.description || PAGE_COPY.product.fallbackDetails}</p>
        </div>
      </button>
      <div className="product-body">
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
          <a
            className="whatsapp-button"
            href={`https://wa.me/${whatsappNumber}?text=${priceMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Prix
          </a>
        </div>
      </div>
    </article>
  );
}

function AdminTextField({ field, form, setForm }) {
  return (
    <label>
      {field.label}
      <input
        list={field.list}
        min={field.min}
        placeholder={field.placeholder}
        required={field.required}
        type={field.type || 'text'}
        value={form[field.key] || ''}
        onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
      />
    </label>
  );
}

function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [status, setStatus] = useState('');
  const [inventoryQuery, setInventoryQuery] = useState('');
  const [adminTestimonials, setAdminTestimonials] = useState([]);
  const [testimonialStatus, setTestimonialStatus] = useState('');
  const knownCategories = useMemo(
    () => [
      ...new Set([
        ...DEFAULT_CATEGORIES.map((item) => item.name),
        ...products.map((product) => product.category).filter(Boolean),
      ]),
    ],
    [products],
  );
  const knownBrands = useMemo(() => uniqueProductValues(products, 'brand'), [products]);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, authSession) => {
      setSession(authSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadAdminProducts(setProducts, setStatus);
      loadAdminTestimonials(setAdminTestimonials, setTestimonialStatus);
    }
  }, [session]);

  const signIn = async (event) => {
    event.preventDefault();
    setStatus('Connexion...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatus(error ? error.message : 'Connecte.');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProducts([]);
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setStatus('Enregistrement...');

    const payload = {
      ...form,
      stock_quantity: Number.parseInt(form.stock_quantity, 10) || 0,
      price: form.price === '' ? null : Number.parseFloat(String(form.price).replace(',', '.')),
      reference: form.reference || null,
      brand: form.brand || null,
      category: form.category || null,
      description: form.description || null,
      wattage: form.wattage || null,
      color_temperature: form.color_temperature || null,
      image_url: form.image_url || null,
      image_urls: String(form.image_urls || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      availability_status: form.availability_status || 'auto',
      is_new: Boolean(form.is_new),
      sort_order: Number.parseInt(form.sort_order, 10) || 0,
      featured: Boolean(form.featured),
      active: Boolean(form.active),
      show_price: Boolean(form.show_price),
    };

    const query = editing
      ? supabase.from('products').update(payload).eq('id', editing.id)
      : supabase.from('products').insert(payload);

    const { error } = await query;

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus('Produit enregistre.');
    setForm(EMPTY_PRODUCT);
    setEditing(null);
    loadAdminProducts(setProducts, setStatus);
  };

  const removeProduct = async (product) => {
    const confirmed = window.confirm(`Supprimer ${product.name} ?`);
    if (!confirmed) return;

    const { error } = await supabase.from('products').delete().eq('id', product.id);
    setStatus(error ? error.message : 'Produit supprime.');
    loadAdminProducts(setProducts, setStatus);
  };

  const startEdit = (product) => {
    setEditing(product);
    setForm({
      ...EMPTY_PRODUCT,
      ...product,
      price: product.price || '',
      image_urls: productImages(product).filter((image) => image !== product.image_url).join('\n'),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const importCsv = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('Import fichier...');
    const isExcel = /\.(xlsx|xls)$/i.test(file.name);
    const rows = isExcel
      ? spreadsheetRowsToProducts(await readXlsxFile(file))
      : parseCsv(await file.text()).map(mapCsvProduct);
    const cleanRows = rows.filter((row) => row.name);

    const { error } = await supabase
      .from('products')
      .upsert(cleanRows, { onConflict: 'reference' });

    setStatus(error ? error.message : `${cleanRows.length} produit(s) importe(s).`);
    loadAdminProducts(setProducts, setStatus);
  };

  const adminStats = useMemo(
    () => ADMIN_STATS.map((item) => ({ label: item.label, value: item.compute(products) })),
    [products],
  );
  const filteredAdminProducts = useMemo(() => {
    const needle = inventoryQuery.trim().toLowerCase();
    if (!needle) return products;

    return products.filter((product) =>
      [
        product.name,
        product.reference,
        product.brand,
        product.category,
        product.description,
        availabilityLabel(product),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [inventoryQuery, products]);

  const uploadImage = async (event) => {
    const files = [...(event.target.files || [])];
    if (!files.length) return;

    setStatus('Televersement images...');
    const urls = [];

    for (const file of files) {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      const path = `${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: false });

      if (error) {
        setStatus(error.message);
        return;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    setForm((value) => ({
      ...value,
      image_url: value.image_url || urls[0],
      image_urls: [...String(value.image_urls || '').split('\n').filter(Boolean), ...urls.slice(value.image_url ? 0 : 1)].join('\n'),
    }));
    setStatus(`${urls.length} image(s) ajoutee(s).`);
  };

  const approveTestimonial = async (testimonial) => {
    setTestimonialStatus('Validation...');
    const { error } = await supabase
      .from('testimonials')
      .update({ approved: true })
      .eq('id', testimonial.id);

    setTestimonialStatus(error ? error.message : ADMIN_COPY.approvedLabel);
    loadAdminTestimonials(setAdminTestimonials, setTestimonialStatus);
  };

  const removeTestimonial = async (testimonial) => {
    const confirmed = window.confirm(`${ADMIN_COPY.deleteLabel} ${testimonial.name} ?`);
    if (!confirmed) return;

    setTestimonialStatus('Suppression...');
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', testimonial.id);

    setTestimonialStatus(error ? error.message : 'Avis supprime.');
    loadAdminTestimonials(setAdminTestimonials, setTestimonialStatus);
  };

  if (!hasSupabaseConfig) {
    return <SetupNotice />;
  }

  if (!session) {
    return (
      <main className="admin-shell">
        <form className="login-card" onSubmit={signIn}>
          <span className="admin-logo">
            <ShieldCheck size={30} />
          </span>
          <div>
            <p className="eyebrow">{ADMIN_COPY.privateEyebrow}</p>
            <h1>{ADMIN_COPY.loginTitle}</h1>
          </div>
          <p>{ADMIN_COPY.loginText}</p>
          <input
            type="email"
            placeholder={ADMIN_COPY.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder={ADMIN_COPY.passwordPlaceholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="primary-button" type="submit">
            <LogIn size={18} />
            {ADMIN_COPY.loginCta}
          </button>
          {status && <p className="form-status">{status}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-layout">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">{ADMIN_COPY.adminEyebrow}</p>
            <h1>{ADMIN_COPY.adminTitle}</h1>
            <span>{ADMIN_COPY.adminSubtitle}</span>
          </div>
          <button className="icon-button" type="button" onClick={signOut} title="Deconnexion">
            <LogOut size={20} />
          </button>
        </div>

        <div className="admin-stats">
          {adminStats.map((item) => (
            <div className="stat-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="admin-content">
          <form className="product-form" onSubmit={saveProduct}>
            <div className="panel-title">
              <div>
                <h2>{editing ? ADMIN_COPY.formTitleEdit : ADMIN_COPY.formTitleAdd}</h2>
                <p>{ADMIN_COPY.formHint}</p>
              </div>
              {editing ? <Edit3 size={22} /> : <Plus size={22} />}
            </div>

            <div className="form-grid">
              {ADMIN_TEXT_FIELDS.map((field) => (
                <AdminTextField
                  field={field}
                  form={form}
                  key={field.key}
                  setForm={setForm}
                />
              ))}
              <datalist id="brand-options">
                {knownBrands.map((brand) => (
                  <option key={brand} value={brand} />
                ))}
              </datalist>
              <datalist id="category-options">
                {knownCategories.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
              <label>
                Statut
                <select
                  value={form.availability_status || 'auto'}
                  onChange={(event) =>
                    setForm({ ...form, availability_status: event.target.value })
                  }
                >
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Description
              <textarea
                value={form.description || ''}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows="3"
              />
            </label>

            <label>
              Image principale
              <input
                value={form.image_url || ''}
                onChange={(event) => setForm({ ...form, image_url: event.target.value })}
                placeholder="URL de l'image"
              />
            </label>

            <label>
              Galerie images
              <textarea
                value={form.image_urls || ''}
                onChange={(event) => setForm({ ...form, image_urls: event.target.value })}
                placeholder="Une URL par ligne"
                rows="3"
              />
            </label>

            <div className="form-actions">
              {ADMIN_FILE_ACTIONS.map((action) => (
                <label className="file-button" key={action.label}>
                  <Upload size={17} />
                  {action.label}
                  <input
                    type="file"
                    accept={action.accept}
                    multiple={action.multiple}
                    onChange={action.action === 'images' ? uploadImage : importCsv}
                  />
                </label>
              ))}
              {ADMIN_CHECKBOX_FIELDS.map((field) => (
                <label className="check-row" key={field.key}>
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.key])}
                    onChange={(event) =>
                      setForm({ ...form, [field.key]: event.target.checked })
                    }
                  />
                  {field.label}
                </label>
              ))}
            </div>

            <div className="form-actions">
              <button className="primary-button" type="submit">
                {editing ? <Edit3 size={18} /> : <Plus size={18} />}
                {editing ? 'Modifier' : 'Ajouter'}
              </button>
              {editing && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm(EMPTY_PRODUCT);
                  }}
                >
                  <X size={18} />
                  Annuler
                </button>
              )}
            </div>
            {status && <p className="form-status">{status}</p>}
          </form>

          <div className="admin-list-panel">
            <div className="panel-title">
              <div>
                <h2>{ADMIN_COPY.inventoryTitle}</h2>
                <p>{ADMIN_COPY.inventoryHint}</p>
              </div>
              <PackageSearch size={22} />
            </div>
            <label className="admin-search">
              <Search size={17} />
              <input
                type="search"
                placeholder={ADMIN_COPY.inventorySearchPlaceholder}
                value={inventoryQuery}
                onChange={(event) => setInventoryQuery(event.target.value)}
              />
            </label>
            <div className="admin-list">
              {filteredAdminProducts.length ? (
                filteredAdminProducts.map((product) => (
                  <div className="admin-row" key={product.id}>
                    <div className="admin-product-main">
                      <span className="admin-thumb">
                        {productImages(product)[0] ? (
                          <img src={productImages(product)[0]} alt="" />
                        ) : (
                          <ImagePlus size={19} />
                        )}
                      </span>
                      <div>
                        <strong>{product.name}</strong>
                        <span>
                          {[product.reference, product.brand, product.category]
                            .filter(Boolean)
                            .join(' | ') || 'Produit'}
                        </span>
                      </div>
                    </div>
                    <div className="stock-pill">
                      {product.stock_quantity === 0 && <AlertCircle size={15} />}
                      {availabilityLabel(product)}
                    </div>
                    <div className="row-actions">
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => startEdit(product)}
                        title="Modifier"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        onClick={() => removeProduct(product)}
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">{ADMIN_COPY.emptyInventory}</div>
              )}
            </div>
          </div>
        </div>

        <div className="admin-list-panel testimonials-admin-panel">
          <div className="panel-title">
            <div>
              <h2>{ADMIN_COPY.testimonialsTitle}</h2>
              <p>{ADMIN_COPY.testimonialsHint}</p>
            </div>
            <MessageCircle size={22} />
          </div>
          <div className="admin-list">
            {adminTestimonials.length ? (
              adminTestimonials.map((testimonial) => (
                <div className="admin-row testimonial-admin-row" key={testimonial.id}>
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>
                      {[testimonial.location, testimonial.approved ? ADMIN_COPY.approvedLabel : 'En attente']
                        .filter(Boolean)
                        .join(' | ')}
                    </span>
                    <p>{testimonial.comment}</p>
                  </div>
                  <div className="row-actions">
                    {!testimonial.approved && (
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => approveTestimonial(testimonial)}
                        title={ADMIN_COPY.approveLabel}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    <button
                      className="icon-button danger"
                      type="button"
                      onClick={() => removeTestimonial(testimonial)}
                      title={ADMIN_COPY.deleteLabel}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">{ADMIN_COPY.emptyTestimonials}</div>
            )}
          </div>
          {testimonialStatus && <p className="form-status">{testimonialStatus}</p>}
        </div>
      </section>
    </main>
  );
}

async function loadAdminProducts(setProducts, setStatus) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    setStatus(error.message);
    return;
  }

  setProducts(sortProducts(data || []));
}

async function loadAdminTestimonials(setTestimonials, setStatus) {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id,name,location,comment,approved,created_at')
    .order('approved', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    setStatus(ADMIN_COPY.testimonialsTableMissing);
    return;
  }

  setTestimonials(data || []);
}

function SetupNotice() {
  return (
    <main className="admin-shell">
      <section className="login-card setup-card">
        <ShieldCheck size={34} />
        <h1>{ADMIN_COPY.setupTitle}</h1>
        <p>{ADMIN_COPY.setupText}</p>
      </section>
    </main>
  );
}

function Footer({ navigate }) {
  return (
    <footer>
      <button type="button" onClick={() => navigate(ROUTES.home)}>
        <strong>{STORE_INFO.brandName}</strong>
      </button>
      <span>{STORE_INFO.legalName}</span>
      {NAV_ITEMS.filter((item) => item.path !== ROUTES.home).map((item) => (
        <button type="button" key={item.path} onClick={() => navigate(item.path)}>
          {item.label}
        </button>
      ))}
      <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
        {STORE_INFO.phone}
      </a>
    </footer>
  );
}

export default App;




