import { useEffect, useMemo, useState } from 'react';
import readXlsxFile from 'read-excel-file/browser';
import { LogOut } from 'lucide-react';
import { ConfirmModal } from '../components/ui/ConfirmModal.jsx';
import { SetupNotice } from '../components/ui/SetupNotice.jsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';
import { AdminLoginGate } from '../components/admin/AdminLoginGate.jsx';
import { AdminProductForm } from '../components/admin/AdminProductForm.jsx';
import { AdminInventoryList } from '../components/admin/AdminInventoryList.jsx';
import { AdminTestimonialsList } from '../components/admin/AdminTestimonialsList.jsx';
import {
  ADMIN_COPY,
  ADMIN_DEVICE_ACCESS_KEY,
  ADMIN_DEVICE_PASSPHRASE_HASH,
  ADMIN_STATS,
  DEFAULT_CATEGORIES,
  EMPTY_PRODUCT,
} from '../data/siteContent.js';
import {
  downloadCsvFile,
  mapCsvProduct,
  parseCsv,
  productsToCsv,
  validateProductBatch,
} from '../lib/csv.js';
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
  const [deviceUnlocked, setDeviceUnlocked] = useState(
    () => localStorage.getItem(ADMIN_DEVICE_ACCESS_KEY) === '1',
  );
  const [devicePassphrase, setDevicePassphrase] = useState('');
  const [deviceError, setDeviceError] = useState(false);
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

  const requireServerSession = () => {
    if (supabase && session) return true;
    report('Session expiree. Reconnecte-toi pour continuer.', 'error');
    return false;
  };

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

  const unlockDevice = async (event) => {
    event.preventDefault();
    const data = new TextEncoder().encode(devicePassphrase);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const hash = [...new Uint8Array(digest)]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    if (hash !== ADMIN_DEVICE_PASSPHRASE_HASH) {
      setDeviceError(true);
      return;
    }

    localStorage.setItem(ADMIN_DEVICE_ACCESS_KEY, '1');
    setDeviceUnlocked(true);
    setDeviceError(false);
    setDevicePassphrase('');
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    if (!requireServerSession()) return;
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
      message: 'Cette action est definitive et ne peut pas etre annulee.',
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        setConfirmAction(null);
        if (!requireServerSession()) return;
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
    if (!requireServerSession()) return;

    report('Import fichier...');
    try {
      const isExcel = /\.(xlsx|xls)$/i.test(file.name);
      const rows = isExcel
        ? spreadsheetRowsToProducts(await readXlsxFile(file))
        : parseCsv(await file.text()).map(mapCsvProduct);

      const { validProducts, invalidRows } = validateProductBatch(rows);

      if (validProducts.length === 0) {
        const errorDetail = invalidRows[0]?.errors[0] || 'Aucun produit valide trouvé.';
        report(`Import impossible: ${errorDetail}`, 'error');
        return;
      }

      const { error } = await supabase
        .from('products')
        .upsert(validProducts, { onConflict: 'reference' });

      if (error) {
        report(error.message, 'error');
      } else {
        const summary = invalidRows.length
          ? `${validProducts.length} produit(s) importé(s), ${invalidRows.length} ligne(s) ignorée(s).`
          : `${validProducts.length} produit(s) importé(s) avec succès.`;
        report(summary, invalidRows.length ? 'info' : 'success');
      }
      loadAdminProducts(setProducts, setStatus);
    } catch (err) {
      report(`Erreur lors de la lecture du fichier: ${err.message}`, 'error');
    }
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
    if (!requireServerSession()) return;

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
      const path = `public/${Date.now()}-${safeName}`;

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
      image_urls: [
        ...String(value.image_urls || '').split('\n').filter(Boolean),
        ...urls.slice(value.image_url ? 0 : 1),
      ].join('\n'),
    }));
    report(`${urls.length} image(s) ajoutee(s).`, 'success');
  };

  const approveTestimonial = async (testimonial) => {
    if (!requireServerSession()) return;
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
      message: 'Cet avis sera supprime definitivement.',
      confirmLabel: ADMIN_COPY.deleteLabel,
      onConfirm: async () => {
        setConfirmAction(null);
        if (!requireServerSession()) return;
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

  if (!deviceUnlocked || !session) {
    return (
      <AdminLoginGate
        deviceUnlocked={deviceUnlocked}
        devicePassphrase={devicePassphrase}
        setDevicePassphrase={setDevicePassphrase}
        deviceError={deviceError}
        unlockDevice={unlockDevice}
        session={session}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        signIn={signIn}
        status={status}
      />
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
          <AdminProductForm
            form={form}
            setForm={setForm}
            editing={editing}
            setEditing={setEditing}
            saveProduct={saveProduct}
            status={status}
            knownBrands={knownBrands}
            knownCategories={knownCategories}
            uploadImage={uploadImage}
            importCsv={importCsv}
          />

          <AdminInventoryList
            filteredAdminProducts={filteredAdminProducts}
            lowStockProducts={lowStockProducts}
            inventoryQuery={inventoryQuery}
            setInventoryQuery={setInventoryQuery}
            exportCsv={exportCsv}
            startEdit={startEdit}
            removeProduct={removeProduct}
          />
        </div>

        <AdminTestimonialsList
          adminTestimonials={adminTestimonials}
          testimonialStatus={testimonialStatus}
          approveTestimonial={approveTestimonial}
          removeTestimonial={removeTestimonial}
        />
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