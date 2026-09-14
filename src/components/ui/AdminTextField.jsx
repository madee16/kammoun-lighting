export function AdminTextField({ field, form, setForm }) {
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