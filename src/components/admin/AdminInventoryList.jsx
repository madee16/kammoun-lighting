import {
  AlertCircle,
  AlertTriangle,
  Download,
  Edit3,
  ImagePlus,
  PackageSearch,
  Search,
  Trash2,
} from 'lucide-react';
import { EmptyState } from '../ui/EmptyState.jsx';
import { ADMIN_COPY } from '../../data/siteContent.js';
import { availabilityLabel, productImages } from '../../lib/productUtils.js';

export function AdminInventoryList({
  filteredAdminProducts,
  lowStockProducts,
  inventoryQuery,
  setInventoryQuery,
  exportCsv,
  startEdit,
  removeProduct,
}) {
  return (
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
  );
}
