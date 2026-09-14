import { useEffect, useMemo, useState } from 'react';
import readXlsxFile from 'read-excel-file/browser';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Download,
  Edit3,
  ImagePlus,
  LogIn,
  LogOut,
  MessageCircle,
  PackageSearch,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { AdminTextField } from '../components/ui/AdminTextField.jsx';
import { ConfirmModal } from '../components/ui/ConfirmModal.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { FormStatus } from '../components/ui/FormStatus.jsx';
import { SetupNotice } from '../components/ui/SetupNotice.jsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';
import {
  ADMIN_CHECKBOX_FIELDS,
  ADMIN_COPY,
  ADMIN_FILE_ACTIONS,
  ADMIN_STATS,
  ADMIN_TEXT_FIELDS,
  AVAILABILITY_OPTIONS,
  DEFAULT_CATEGORIES,
  EMPTY_PRODUCT,
} from '../data/siteContent.js';
import { downloadCsvFile, mapCsvProduct, parseCsv, productsToCsv } from '../lib/csv.js';
import {
  availabilityLabel,
  productImages,
  sortProducts,
  uniqueProductValues,
} from '../lib/productUtils.js';
import { spreadsheetRowsToProducts } from '../lib/spreadsheet.js';
import { hasSupabaseConfig, supabase } from '../lib/supabase.js';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

export function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [status, setStatus] = useState({ text: '', type: 'info' });
  const [inventoryQuery, setInventoryQuery] = useState('');
  const [adminTestimonials, setAdminTestimonials] = useState([]);
  const [testimonialStatus, setTestimonialStatus] = useState({ text: '', type: 'info' });
  const [confirmAction, setConfirmAction] = useState(null);
  const report = (text, type = 'info') => setStatus({ text, type });
  const reportTestimonial = (text, type = 'info') => setTestimonialStatus({ text, type });
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
    report('Connexion...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    report(error ? error.message : 'Connecte.', error ? 'error' : 'success');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProducts([]);
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    report('Enregistrement...');

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
      report(error.message, 'error');
      return;
    }

    report('Produit enregistre.', 'success');
    setForm(EMPTY_PRODUCT);
    setEditing(null);
    loadAdminProducts(setProducts, setStatus);
  };

  const removeProduct = (product) => {
    setConfirmAction({
      title: `Supprimer ${product.name} ?`,
      message: "Cette action est definitive et ne peut pas etre annulee.",
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        setConfirmAction(null);
        report('Suppression...');
        const { error } = await supabase.from('products').delete().eq('id', product.id);
        report(error ? error.message : 'Produit supprime.', error ? 'error' : 'success');
        loadAdminProducts(setProducts, setStatus);
      },
    });
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

    report('Import fichier...');
    const isExcel = /\.(xlsx|xls)$/i.test(file.name);
    const rows = isExcel
      ? spreadsheetRowsToProducts(await readXlsxFile(file))
      : parseCsv(await file.text()).map(mapCsvProduct);
    const cleanRows = rows.filter((row) => row.name);

    const { error } = await supabase
      .from('products')
      .upsert(cleanRows, { onConflict: 'reference' });

    report(error ? error.message : `${cleanRows.length} produit(s) importe(s).`, error ? 'error' : 'success');
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

  const lowStockProducts = useMemo(
    () =>
      products.filter(
        (product) => product.active && product.stock_quantity > 0 && product.stock_quantity <= 3,
      ),
    [products],
  );

  const exportCsv = () => {
    downloadCsvFile(
      `inventaire-kammoun-${new Date().toISOString().slice(0, 10)}.csv`,
      productsToCsv(filteredAdminProducts),
    );
    report(`${filteredAdminProducts.length} produit(s) exporte(s).`, 'success');
  };

  const uploadImage = async (event) => {
    const files = [...(event.target.files || [])];
    if (!files.length) return;

    report('Televersement images...');
    const urls = [];

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        report(`Format image refuse: ${file.name}.`, 'error');
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        report(`Image trop lourde (max 5 Mo): ${file.name}.`, 'error');
        return;
      }

      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      const path = `${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: false });

      if (error) {
        report(error.message, 'error');
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
    report(`${urls.length} image(s) ajoutee(s).`, 'success');
  };

  const approveTestimonial = async (testimonial) => {
    reportTestimonial('Validation...');
    const { error } = await supabase
      .from('testimonials')
      .update({ approved: true })
      .eq('id', testimonial.id);

    reportTestimonial(error ? error.message : ADMIN_COPY.approvedLabel, error ? 'error' : 'success');
    loadAdminTestimonials(setAdminTestimonials, setTestimonialStatus);
  };

  const removeTestimonial = (testimonial) => {
    setConfirmAction({
      title: `${ADMIN_COPY.deleteLabel} ${testimonial.name} ?`,
      message: "Cet avis sera supprime definitivement.",
      confirmLabel: ADMIN_COPY.deleteLabel,
      onConfirm: async () => {
        setConfirmAction(null);
        reportTestimonial('Suppression...');
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', testimonial.id);

        reportTestimonial(error ? error.message : 'Avis supprime.', error ? 'error' : 'success');
        loadAdminTestimonials(setAdminTestimonials, setTestimonialStatus);
      },
    });
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
            aria-label={ADMIN_COPY.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder={ADMIN_COPY.passwordPlaceholder}
            aria-label={ADMIN_COPY.passwordPlaceholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="primary-button" type="submit">
            <LogIn size={18} />
            {ADMIN_COPY.loginCta}
          </button>
          <FormStatus status={status} />
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
          <ThemeToggle className="icon-button" />
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
            <FormStatus status={status} />
          </form>

          <div className="admin-list-panel">
            <div className="panel-title">
              <div>
                <h2>{ADMIN_COPY.inventoryTitle}</h2>
                <p>{ADMIN_COPY.inventoryHint}</p>
              </div>
              <PackageSearch size={22} />
            </div>
            {lowStockProducts.length > 0 && (
              <div className="low-stock-alert">
                <AlertTriangle size={19} />
                <div>
                  <strong>Stock faible ({lowStockProducts.length})</strong>
                  <span>{lowStockProducts.map((product) => product.name).join(', ')}</span>
                </div>
              </div>
            )}
            <div className="admin-inventory-toolbar">
              <label className="admin-search">
                <Search size={17} />
                <input
                  type="search"
                  placeholder={ADMIN_COPY.inventorySearchPlaceholder}
                  value={inventoryQuery}
                  onChange={(event) => setInventoryQuery(event.target.value)}
                />
              </label>
              <button
                className="secondary-button admin-export"
                type="button"
                onClick={exportCsv}
                title="Exporter l'inventaire en CSV"
              >
                <Download size={17} />
                CSV
              </button>
            </div>
            <div className="admin-list">
              {filteredAdminProducts.length ? (
                filteredAdminProducts.map((product) => (
                  <div className="admin-row" key={product.id}>
                    <div className="admin-product-main">
                      <span className="admin-thumb">
                        {productImages(product)[0] ? (
                          <img src={productImages(product)[0]} alt="" loading="lazy" decoding="async" />
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
                    <div className={`stock-pill ${product.stock_quantity === 0 ? 'out' : product.stock_quantity <= 3 ? 'low' : 'ok'}`}>
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
                <EmptyState
                  icon={PackageSearch}
                  title="Inventaire vide"
                  text={ADMIN_COPY.emptyInventory}
                />
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
                    <span className="admin-row-meta">
                      <span className={`approval-badge ${testimonial.approved ? 'approved' : 'pending'}`}>
                        {testimonial.approved ? ADMIN_COPY.approvedLabel : 'En attente'}
                      </span>
                      {testimonial.location}
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
                <EmptyState
                  icon={MessageCircle}
                  title="Aucun avis"
                  text={ADMIN_COPY.emptyTestimonials}
                />
              )}
          </div>
          <FormStatus status={testimonialStatus} />
        </div>
      </section>
      <ConfirmModal
        open={Boolean(confirmAction)}
        title={confirmAction?.title || ''}
        message={confirmAction?.message}
        confirmLabel={confirmAction?.confirmLabel}
        onConfirm={() => confirmAction?.onConfirm()}
        onCancel={() => setConfirmAction(null)}
      />
    </main>
  );
}

async function loadAdminProducts(setProducts, setStatus) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    setStatus({ text: error.message, type: 'error' });
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
    setStatus({ text: ADMIN_COPY.testimonialsTableMissing, type: 'error' });
    return;
  }

  setTestimonials(data || []);
}