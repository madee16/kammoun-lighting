import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Edit3,
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
  active: true,
  featured: false,
};

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
        <CatalogPage products={products} loading={loading} navigate={navigate} />
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
        setProducts(data || []);
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
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      <Hero navigate={navigate} />
      <CategoryHighlights navigate={navigate} />
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
        ) : featuredProducts.length ? (
          <div className="product-grid compact-grid">
            {featuredProducts.map((product) => (
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
    </>
  );
}

function CatalogPage({ products, loading, navigate }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tous');
  const [brand, setBrand] = useState('Toutes');
  const [stockOnly, setStockOnly] = useState(false);

  const categories = useMemo(
    () => ['Tous', ...new Set(products.map((item) => item.category).filter(Boolean))],
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
        eyebrow="Catalogue"
        title="Produits disponibles"
        text="Parcourez les gammes, filtrez par marque ou categorie, puis demandez les details du produit sur WhatsApp."
      />
      <section className="section catalog-section">
        <div className="filters" aria-label="Filtres du catalogue">
          <label className="search-field">
            <Search size={18} />
            <input
              type="search"
              placeholder="Rechercher un produit, une marque..."
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
  const message = encodeURIComponent(
    `Bonjour, je veux plus d'informations sur ce produit: ${product.name}${
      product.reference ? ` (${product.reference})` : ''
    }`,
  );

  return (
    <>
      <PageHero
        eyebrow={product.category || 'Produit'}
        title={product.name}
        text={product.description || 'Details disponibles sur WhatsApp.'}
      />
      <section className="section product-detail">
        <div className="detail-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <ImagePlus size={46} />
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
            <dd>{available ? 'En stock' : 'Sur demande'}</dd>
          </dl>
          <div className="detail-actions">
            <span className="price">
              {priceVisible ? `${product.price} TND` : 'Prix sur demande'}
            </span>
            <a
              className="whatsapp-button"
              href={`https://wa.me/${whatsappNumber}?text=${message}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              Demander sur WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactPage() {
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
          <strong>Tunisie</strong>
        </div>
      </section>
    </>
  );
}

function NavBar({ currentRoute, navigate }) {
  const navItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Catalogue', path: '/catalogue' },
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
        <span className="brand-mark">KL</span>
        <span>
          <strong>Kammoun Lighting</strong>
          <small>Societe MEM d'Electricite</small>
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
  const categories = [
    {
      name: 'Projecteurs',
      text: 'Facades, depots et espaces exterieurs.',
    },
    {
      name: 'Panneaux LED',
      text: 'Bureaux, magasins et plafonds modernes.',
    },
    {
      name: 'Rubans LED',
      text: 'Vitrines, decoration et eclairage indirect.',
    },
    {
      name: 'Accessoires',
      text: 'Alimentations, supports et pieces utiles.',
    },
  ];

  return (
    <section className="category-band" aria-label="Gammes de produits">
      {categories.map((item) => (
        <button
          className="category-tile"
          key={item.name}
          type="button"
          onClick={() => navigate('/catalogue')}
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
  const message = encodeURIComponent(
    `Bonjour, je veux plus d'informations sur ce produit: ${product.name}${
      product.reference ? ` (${product.reference})` : ''
    }`,
  );
  const priceVisible = product.show_price && product.price;

  return (
    <article className="product-card">
      <button
        className="product-link"
        type="button"
        onClick={() => navigate(productPath(product))}
      >
        <div className="product-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <ImagePlus size={34} />
          )}
          <span className={available ? 'badge in-stock' : 'badge out-stock'}>
            {available ? 'En stock' : 'Sur demande'}
          </span>
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
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Demander
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
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const importCsv = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('Import CSV...');
    const text = await file.text();
    const rows = parseCsv(text).map(mapCsvProduct);
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
    const file = event.target.files?.[0];
    if (!file) return;

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const path = `${Date.now()}-${safeName}`;
    setStatus('Televersement image...');

    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    setForm((value) => ({ ...value, image_url: data.publicUrl }));
    setStatus('Image ajoutee.');
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
                  value={form.brand || ''}
                  onChange={(event) => setForm({ ...form, brand: event.target.value })}
                />
              </label>
              <label>
                Categorie
                <input
                  value={form.category || ''}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                />
              </label>
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
              Image
              <input
                value={form.image_url || ''}
                onChange={(event) => setForm({ ...form, image_url: event.target.value })}
                placeholder="URL de l'image"
              />
            </label>

            <div className="form-actions">
              <label className="file-button">
                <Upload size={17} />
                Ajouter image
                <input type="file" accept="image/*" onChange={uploadImage} />
              </label>
              <label className="file-button">
                <Upload size={17} />
                Import CSV
                <input type="file" accept=".csv,text/csv" onChange={importCsv} />
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
                        {product.image_url ? (
                          <img src={product.image_url} alt="" />
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
                      {product.stock_quantity}
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

  setProducts(data || []);
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
