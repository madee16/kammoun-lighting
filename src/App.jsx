import logo from "D01E7C7C-3E94-4CC5-8F9C-A3D92F26C5BF.PNG";
import { useEffect, useMemo, useState } from 'react';
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
  Star,
  Tags,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { sampleProducts } from './data/sampleProducts.js';
import { mapCsvProduct, parseCsv } from './lib/csv.js';
import { hasSupabaseConfig, supabase, whatsappNumber } from './lib/supabase.js';

const emptyProduct = {
  name: '',
  reference: '',
  brand: '',
  category: '',
  description: '',
  wattage: '',
  color_temperature: '',
  stock_quantity: 0,
  price: '',
  show_price: false,
  image_url: '',
  image_urls: '',
  availability_status: 'auto',
  is_new: false,
  sort_order: 0,
  active: true,
  featured: false,
};

const storeInfo = {
  legalName: "Societe MEM d'Electricite",
  brandName: 'Kammoun Lighting',
  phone: '+216 22 400 000',
  address: 'Tunisie, Sfax',
  mapUrl: 'https://maps.app.goo.gl/ggYgdYcYCyWqdn5i7',
  facebookUrl: 'https://www.facebook.com/p/Sté-MEM-délectricité-100054271100283/',
  openingHours: [
    'Lundi - Vendredi: 8AM -> 6PM',
    'Samedi: 8AM -> 3PM',
  ],
};

const defaultCategories = [
  { name: 'Projecteurs', text: 'Facades, depots et espaces exterieurs.' },
  { name: 'Panneaux LED', text: 'Bureaux, magasins et plafonds modernes.' },
  { name: 'Rubans LED', text: 'Vitrines, decoration et eclairage indirect.' },
  { name: 'Accessoires', text: 'Alimentations, supports et pieces utiles.' },
];

const route = () => window.location.pathname.replace(/\/$/, '') || '/';

const productPath = (product) =>
  `/produit/${encodeURIComponent(
    product.slug || product.reference || product.id || product.name,
  )}`;

const productMatchesPath = (product, value) => {
  const decoded = decodeURIComponent(value || '').toLowerCase();
  return [product.slug, product.reference, product.id, product.name]
    .filter(Boolean)
    .some((candidate) => String(candidate).toLowerCase() === decoded);
};

const productUrl = (product) => `${window.location.origin}${productPath(product)}`;

const productImages = (product) => {
  const gallery = Array.isArray(product.image_urls)
    ? product.image_urls
    : String(product.image_urls || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

  return [product.image_url, ...gallery].filter(Boolean);
};

const availabilityLabel = (product) => {
  if (product.availability_status === 'order') return 'Sur commande';
  if (product.availability_status === 'request') return 'Sur demande';
  if (product.availability_status === 'available') return 'Disponible';
  return product.stock_quantity > 0 ? 'Disponible' : 'Sur demande';
};

const cleanSlug = (value) => encodeURIComponent(String(value || '').trim());

const whatsappProductMessage = (product, action = 'details', quantity = '') => {
  const labels = {
    details: "plus d'informations",
    price: 'le prix',
    availability: 'la disponibilite',
  };

  return encodeURIComponent(
    `Bonjour, je veux ${labels[action]} sur ce produit: ${product.name}${
      product.reference ? ` (${product.reference})` : ''
    }\nQuantite souhaitee: ${quantity || 'a preciser'}\nLien: ${productUrl(product)}`,
  );
};

const whatsappSimpleMessage = (text) =>
  encodeURIComponent(
    text,
  );

function App() {
  const [currentRoute, setCurrentRoute] = useState(route());
  const { products, loading } = useProducts();

  useEffect(() => {
    const onPopState = () => setCurrentRoute(route());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(route());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentRoute === '/gestion') {
    return <AdminPage />;
  }

  if (currentRoute === '/catalogue') {
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

  if (currentRoute === '/categories') {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <CategoriesPage products={products} navigate={navigate} />
      </PublicLayout>
    );
  }

  if (currentRoute.startsWith('/categorie/')) {
    const categoryName = decodeURIComponent(currentRoute.replace('/categorie/', ''));

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

  if (currentRoute === '/marques') {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <BrandsPage products={products} navigate={navigate} />
      </PublicLayout>
    );
  }

  if (currentRoute.startsWith('/marque/')) {
    const brandName = decodeURIComponent(currentRoute.replace('/marque/', ''));

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

  if (currentRoute.startsWith('/produit/')) {
    const productKey = currentRoute.replace('/produit/', '');
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

  if (currentRoute === '/contact') {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <ContactPage />
      </PublicLayout>
    );
  }

  if (currentRoute === '/a-propos') {
    return (
      <PublicLayout currentRoute={currentRoute} navigate={navigate}>
        <AboutPage navigate={navigate} />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout currentRoute="/" navigate={navigate}>
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

function sortProducts(products) {
  return [...products].sort((a, b) => {
    const sortA = Number(a.sort_order || 0);
    const sortB = Number(b.sort_order || 0);
    if (sortA !== sortB) return sortA - sortB;
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });
}

const normalizeSpreadsheetHeader = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

const spreadsheetRowsToProducts = (rows) => {
  if (!rows.length) return [];
  const headers = rows[0].map(normalizeSpreadsheetHeader);

  return rows.slice(1).map((cells) => {
    const row = headers.reduce((result, header, index) => {
      result[header] = cells[index] == null ? '' : String(cells[index]);
      return result;
    }, {});

    return mapCsvProduct(row);
  });
};

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
      <section className="section home-intro">
        <div>
          <p className="eyebrow">Magasin d'eclairage</p>
          <h2>Des produits clairs, un contact direct.</h2>
        </div>
        <p>
          Le site sert de catalogue simple pour consulter les arrivages, verifier
          les gammes disponibles et demander les details directement par
          WhatsApp.
        </p>
      </section>

      <section className="section featured-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Selection</p>
            <h2>Produits a consulter</h2>
          </div>
          <button
            className="secondary-action"
            type="button"
            onClick={() => navigate('/catalogue')}
          >
            Tout le catalogue
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Chargement du catalogue...</div>
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
          <div className="empty-state">Les produits seront ajoutes bientot.</div>
        )}
      </section>

      <section className="section trust-section">
        <div className="trust-panel">
          <p className="eyebrow">Confiance</p>
          <h2>{storeInfo.legalName}</h2>
          <p>
            Kammoun Lighting presente les produits disponibles au magasin et
            garde le contact direct avec les clients pour confirmer les prix,
            les quantites et les disponibilites.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => navigate('/a-propos')}>
              En savoir plus
            </button>
            <button className="secondary-action" type="button" onClick={() => navigate('/contact')}>
              Contact
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function CatalogPage({
  products,
  loading,
  navigate,
  initialCategory = 'Tous',
  initialBrand = 'Toutes',
  eyebrow = 'Catalogue',
  title = 'Produits disponibles',
  text = 'Parcourez les gammes, filtrez par marque ou categorie, puis demandez les details du produit sur WhatsApp.',
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const [stockOnly, setStockOnly] = useState(false);

  const categories = useMemo(
    () => [
      'Tous',
      ...new Set([
        ...defaultCategories.map((item) => item.name),
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
              placeholder="Rechercher un produit, une marque, une reference..."
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
            En stock
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Chargement du catalogue...</div>
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
          <div className="empty-state">Aucun produit ne correspond a cette recherche.</div>
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
        <PageHero eyebrow="Produit" title="Chargement..." text="Recherche du produit." />
        <section className="section">
          <div className="empty-state">Chargement du produit...</div>
        </section>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <PageHero
          eyebrow="Produit"
          title="Produit introuvable"
          text="Ce produit n'est plus disponible dans le catalogue public."
        />
        <section className="section">
          <button className="primary-button" type="button" onClick={() => navigate('/catalogue')}>
            <ArrowLeft size={18} />
            Retour au catalogue
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
        eyebrow={product.category || 'Produit'}
        title={product.name}
        text={product.description || 'Details disponibles sur WhatsApp.'}
      />
      <section className="section product-detail">
        <div>
          <div className="detail-image">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} />
            ) : (
              <ImagePlus size={46} />
            )}
            {product.is_new && <span className="badge new-badge">Nouveaute</span>}
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
          <button className="text-button" type="button" onClick={() => navigate('/catalogue')}>
            <ArrowLeft size={17} />
            Retour au catalogue
          </button>
          <p className="product-meta">
            {[product.category, product.brand].filter(Boolean).join(' | ') || 'Eclairage'}
          </p>
          <h2>{product.name}</h2>
          <p>{product.description || 'Details disponibles sur WhatsApp.'}</p>
          <dl className="detail-specs">
            {product.reference && (
              <>
                <dt>Reference</dt>
                <dd>{product.reference}</dd>
              </>
            )}
            {product.brand && (
              <>
                <dt>Marque</dt>
                <dd>{product.brand}</dd>
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
            <dt>Disponibilite</dt>
            <dd>{availabilityLabel(product)}</dd>
          </dl>
          <label className="quantity-field">
            Quantite souhaitee
            <input
              type="number"
              min="1"
              placeholder="Ex: 2"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>
          <div className="detail-actions">
            <span className="price">
              {priceVisible ? `${product.price} TND` : 'Prix sur demande'}
            </span>
            <a
              className="whatsapp-button"
              href={`https://wa.me/${whatsappNumber}?text=${detailMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              Demander sur WhatsApp
            </a>
            <a
              className="secondary-action"
              href={`https://wa.me/${whatsappNumber}?text=${priceMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              Demander le prix
            </a>
            <a
              className="secondary-action"
              href={`https://wa.me/${whatsappNumber}?text=${availabilityMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              Verifier disponibilite
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactPage() {
  const photoMessage = whatsappSimpleMessage(
    'Bonjour, je veux envoyer une photo de mon besoin en eclairage.',
  );

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlez directement avec le magasin"
        text="Pour confirmer le stock, demander un prix ou envoyer une photo du besoin, WhatsApp reste le chemin le plus rapide."
      />
      <section className="section contact-grid">
        <a
          className="contact-card"
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={26} />
          <span>WhatsApp</span>
          <strong>+216 22 400 000</strong>
        </a>
        <a className="contact-card" href="tel:+21622400000">
          <Phone size={26} />
          <span>Telephone</span>
          <strong>+216 22 400 000</strong>
        </a>
        <div className="contact-card">
          <MapPin size={26} />
          <span>Magasin</span>
          <strong>{storeInfo.address}</strong>
        </div>
      </section>
      <section className="section contact-details">
        <div className="info-panel">
          <Clock3 size={24} />
          <h2>Horaires</h2>
          {storeInfo.openingHours.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <div className="info-panel">
          <MapPin size={24} />
          <h2>Adresse</h2>
          <p>{storeInfo.address}</p>
          {storeInfo.mapUrl ? (
            <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer">
              Ouvrir Google Maps <ExternalLink size={16} />
            </a>
          ) : (
            <p>Adresse exacte a ajouter.</p>
          )}
        </div>
        <div className="info-panel">
          <MessageCircle size={24} />
          <h2>Photo du besoin</h2>
          <p>Le client peut envoyer une photo de la lampe, piece ou espace.</p>
          <a
            className="whatsapp-button"
            href={`https://wa.me/${whatsappNumber}?text=${photoMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            Envoyer une photo
          </a>
        </div>
      </section>
    </>
  );
}

function AboutPage({ navigate }) {
  return (
    <>
      <PageHero
        eyebrow="A propos"
        title={storeInfo.legalName}
        text="Kammoun Lighting presente les produits d'eclairage disponibles et facilite le contact direct avec les clients."
      />
      <section className="section about-layout">
        <div className="about-copy">
          <p className="eyebrow">Kammoun Lighting</p>
          <h2>Un catalogue simple pour un magasin reel.</h2>
          <p>
            Le site aide les clients a voir les gammes, choisir un produit et
            demander rapidement le prix ou la disponibilite. Les commandes et
            confirmations restent sur WhatsApp, comme le magasin travaille deja
            avec ses clients.
          </p>
          <button className="primary-button" type="button" onClick={() => navigate('/catalogue')}>
            Voir les produits
          </button>
        </div>
        <div className="about-facts">
          <div>
            <Building2 size={22} />
            <span>Societe</span>
            <strong>{storeInfo.legalName}</strong>
          </div>
          <div>
            <MessageCircle size={22} />
            <span>Contact</span>
            <strong>{storeInfo.phone}</strong>
          </div>
          <div>
            <Tags size={22} />
            <span>Produits</span>
            <strong>LED, projecteurs, panneaux et accessoires</strong>
          </div>
        </div>
      </section>
    </>
  );
}

function CategoriesPage({ products, navigate }) {
  const categories = defaultCategories.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.name).length,
  }));

  return (
    <>
      <PageHero
        eyebrow="Categories"
        title="Gammes de produits"
        text="Choisissez une famille de produits pour ouvrir un catalogue filtre."
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
            <strong>{category.count ? `${category.count} produit(s)` : 'A completer'}</strong>
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
        eyebrow="Marques"
        title="Marques disponibles"
        text="Les marques dependent du stock et des arrivages du magasin."
      />
      <section className="section tile-grid">
        {(brands.length ? brands : ['Platinum', 'Somef']).map((brand) => (
          <button
            className="large-tile brand-tile"
            key={brand}
            type="button"
            onClick={() => navigate(`/marque/${cleanSlug(brand)}`)}
          >
            <span>{brand}</span>
            <p>Voir les produits disponibles de cette marque.</p>
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
    <section className="brand-strip" aria-label="Marques">
      <span>Marques</span>
      {brands.map((brand) => (
        <button
          type="button"
          key={brand}
          onClick={() => navigate(`/marque/${cleanSlug(brand)}`)}
        >
          {brand}
        </button>
      ))}
      <button type="button" onClick={() => navigate('/marques')}>
        Voir tout
      </button>
    </section>
  );
}

function NavBar({ currentRoute, navigate }) {
  const navItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Catalogue', path: '/catalogue' },
    { label: 'Categories', path: '/categories' },
    { label: 'Marques', path: '/marques' },
    { label: 'A propos', path: '/a-propos' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="site-nav">
      <a
            className="brand-lockup"
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigate('/');
                }}
      >
      <span className="brand-mark">
          <img
              src="D01E7C7C-3E94-4CC5-8F9C-A3D92F26C5BF.PNG"
              alt="Kammoun Lighting Logo"
          />
      </span>

      <span>
          <strong>Kammoun Lighting</strong>
          <small>{storeInfo.legalName}</small>
      </span>
    </a>
      <nav aria-label="Navigation principale">
        {navItems.map((item) => (
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
        <p className="eyebrow">Societe MEM d'Electricite</p>
        <h1>Kammoun Lighting</h1>
        <p>
          Solutions d'eclairage pour maisons, commerces et chantiers:
          projecteurs, panneaux LED, rubans, accessoires et arrivages selon le
          stock du magasin.
        </p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => navigate('/catalogue')}>
            Voir le catalogue
          </button>
          <a
            className="secondary-button"
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Nous contacter
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
      {defaultCategories.map((item) => (
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
  const availabilityMessage = whatsappProductMessage(product, 'availability');
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
          {product.is_new && <span className="badge new-badge">Nouveaute</span>}
        </div>
        <div>
          <p className="product-meta">
            {[product.category, product.brand].filter(Boolean).join(' | ') || 'Eclairage'}
          </p>
          <h3>{product.name}</h3>
          <p>{product.description || 'Details disponibles sur WhatsApp.'}</p>
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
            {priceVisible ? `${product.price} TND` : 'Prix sur demande'}
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
          <a
            className="secondary-action compact-action"
            href={`https://wa.me/${whatsappNumber}?text=${availabilityMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            Stock
          </a>
        </div>
      </div>
    </article>
  );
}

function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [status, setStatus] = useState('');
  const knownCategories = useMemo(
    () => [
      ...new Set([
        ...defaultCategories.map((item) => item.name),
        ...products.map((product) => product.category).filter(Boolean),
      ]),
    ],
    [products],
  );
  const knownBrands = useMemo(
    () => [...new Set(products.map((product) => product.brand).filter(Boolean))].sort(),
    [products],
  );

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
    setForm(emptyProduct);
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
      ...emptyProduct,
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

  const adminStats = useMemo(() => {
    const visible = products.filter((product) => product.active).length;
    const lowStock = products.filter(
      (product) => product.active && product.stock_quantity > 0 && product.stock_quantity <= 3,
    ).length;
    const outOfStock = products.filter(
      (product) => product.active && product.stock_quantity === 0,
    ).length;

    return [
      { label: 'Visibles', value: visible },
      { label: 'Stock faible', value: lowStock },
      { label: 'Sur demande', value: outOfStock },
    ];
  }, [products]);

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
            <p className="eyebrow">Espace prive</p>
            <h1>Gestion Kammoun Lighting</h1>
          </div>
          <p>Connecte-toi pour gerer les produits, le stock et les photos.</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="primary-button" type="submit">
            <LogIn size={18} />
            Se connecter
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
            <p className="eyebrow">Administration</p>
            <h1>Gestion des produits</h1>
            <span>Catalogue, stock, images et import Excel.</span>
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
                <h2>{editing ? 'Modifier un produit' : 'Ajouter un produit'}</h2>
                <p>Les champs peuvent etre completes plus tard.</p>
              </div>
              {editing ? <Edit3 size={22} /> : <Plus size={22} />}
            </div>

            <div className="form-grid">
              <label>
                Nom du produit
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </label>
              <label>
                Reference
                <input
                  value={form.reference || ''}
                  onChange={(event) => setForm({ ...form, reference: event.target.value })}
                />
              </label>
              <label>
                Marque
                <input
                  list="brand-options"
                  value={form.brand || ''}
                  onChange={(event) => setForm({ ...form, brand: event.target.value })}
                />
              </label>
              <label>
                Categorie
                <input
                  list="category-options"
                  value={form.category || ''}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                />
              </label>
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
                Puissance
                <input
                  value={form.wattage || ''}
                  onChange={(event) => setForm({ ...form, wattage: event.target.value })}
                />
              </label>
              <label>
                Couleur
                <input
                  value={form.color_temperature || ''}
                  onChange={(event) =>
                    setForm({ ...form, color_temperature: event.target.value })
                  }
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  min="0"
                  value={form.stock_quantity}
                  onChange={(event) =>
                    setForm({ ...form, stock_quantity: event.target.value })
                  }
                />
              </label>
              <label>
                Prix
                <input
                  value={form.price || ''}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  placeholder="Optionnel"
                />
              </label>
              <label>
                Statut
                <select
                  value={form.availability_status || 'auto'}
                  onChange={(event) =>
                    setForm({ ...form, availability_status: event.target.value })
                  }
                >
                  <option value="auto">Auto selon le stock</option>
                  <option value="available">Disponible</option>
                  <option value="request">Sur demande</option>
                  <option value="order">Sur commande</option>
                </select>
              </label>
              <label>
                Ordre accueil
                <input
                  type="number"
                  value={form.sort_order || 0}
                  onChange={(event) => setForm({ ...form, sort_order: event.target.value })}
                />
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
              <label className="file-button">
                <Upload size={17} />
                Ajouter images
                <input type="file" accept="image/*" multiple onChange={uploadImage} />
              </label>
              <label className="file-button">
                <Upload size={17} />
                Import Excel/CSV
                <input type="file" accept=".csv,text/csv,.xlsx,.xls" onChange={importCsv} />
              </label>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={form.show_price}
                  onChange={(event) => setForm({ ...form, show_price: event.target.checked })}
                />
                Afficher le prix
              </label>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                />
                Produit en avant
              </label>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={form.is_new}
                  onChange={(event) => setForm({ ...form, is_new: event.target.checked })}
                />
                Nouveaute
              </label>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm({ ...form, active: event.target.checked })}
                />
                Produit visible
              </label>
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
                    setForm(emptyProduct);
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
                <h2>Inventaire</h2>
                <p>Produits enregistres dans Supabase.</p>
              </div>
              <PackageSearch size={22} />
            </div>
            <div className="admin-list">
              {products.length ? (
                products.map((product) => (
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
                <div className="empty-state">Aucun produit pour le moment.</div>
              )}
            </div>
          </div>
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

function SetupNotice() {
  return (
    <main className="admin-shell">
      <section className="login-card setup-card">
        <ShieldCheck size={34} />
        <h1>Supabase pas encore connecte</h1>
        <p>
          Ajoute les variables de <code>.env.example</code> dans un fichier{' '}
          <code>.env.local</code>, puis relance le site.
        </p>
      </section>
    </main>
  );
}

function Footer({ navigate }) {
  return (
    <footer>
      <button type="button" onClick={() => navigate('/')}>
        <strong>Kammoun Lighting</strong>
      </button>
      <span>Societe MEM d'Electricite</span>
      <button type="button" onClick={() => navigate('/catalogue')}>
        Catalogue
      </button>
      <button type="button" onClick={() => navigate('/categories')}>
        Categories
      </button>
      <button type="button" onClick={() => navigate('/marques')}>
        Marques
      </button>
      <button type="button" onClick={() => navigate('/a-propos')}>
        A propos
      </button>
      <button type="button" onClick={() => navigate('/contact')}>
        Contact
      </button>
      <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
        +216 22 400 000
      </a>
    </footer>
  );
}

export default App;
