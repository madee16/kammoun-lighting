import { Edit3, Plus, Upload, X } from 'lucide-react';
import { AdminTextField } from '../ui/AdminTextField.jsx';
import { FormStatus } from '../ui/FormStatus.jsx';
import {
  ADMIN_CHECKBOX_FIELDS,
  ADMIN_COPY,
  ADMIN_FILE_ACTIONS,
  ADMIN_TEXT_FIELDS,
  AVAILABILITY_OPTIONS,
  EMPTY_PRODUCT,
} from '../../data/siteContent.js';

export function AdminProductForm({
  form,
  setForm,
  editing,
  setEditing,
  saveProduct,
  status,
  knownBrands,
  knownCategories,
  uploadImage,
  importCsv,
}) {
  return (
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
  );
}
