const normalizeHeader = (value) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

const parseLine = (line) => {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if ((char === ',' || char === ';') && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
};

export const parseCsv = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseLine(lines[0]).map(normalizeHeader);

  return lines.slice(1).map((line) => {
    const cells = parseLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = cells[index] || '';
      return row;
    }, {});
  });
};

export const mapCsvProduct = (row) => {
  const stockValue =
    row.stock_quantity || row.quantite || row.qte || row.stock || '0';
  const priceValue = row.price || row.prix || '';

  return {
    reference: row.reference || row.ref || row.code || null,
    name: row.name || row.nom || row.produit || 'Produit sans nom',
    brand: row.brand || row.marque || null,
    category: row.category || row.categorie || null,
    description: row.description || null,
    wattage: row.wattage || row.puissance || row.watts || null,
    color_temperature:
      row.color_temperature || row.couleur || row.temperature || null,
    stock_quantity: Number.parseInt(stockValue, 10) || 0,
    price: priceValue ? Number.parseFloat(priceValue.replace(',', '.')) : null,
    show_price: row.show_price === 'true' || row.afficher_prix === 'true',
    image_url: row.image_url || row.image || row.photo || null,
    image_urls: (row.image_urls || row.galerie || row.photos || '')
      .split('|')
      .map((item) => item.trim())
      .filter(Boolean),
    availability_status:
      row.availability_status || row.statut || row.disponibilite || 'auto',
    is_new: row.is_new === 'true' || row.nouveaute === 'true',
    featured: row.featured === 'true' || row.en_avant === 'true',
    sort_order:
      Number.parseInt(row.sort_order || row.ordre || row.position || '0', 10) ||
      0,
    active: row.active !== 'false' && row.actif !== 'false',
  };
};

const CSV_HEADERS = [
  'name',
  'reference',
  'brand',
  'category',
  'description',
  'wattage',
  'color_temperature',
  'stock_quantity',
  'price',
  'availability_status',
  'image_url',
  'image_urls',
  'active',
  'featured',
  'is_new',
  'show_price',
];

const csvCell = (value) => {
  const text = value == null ? '' : String(value);
  return /[";, \n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const productsToCsv = (products) => {
  const rows = products.map((product) =>
    Array.isArray(product.image_urls)
      ? { ...product, image_urls: product.image_urls.join('|') }
      : product,
  );
  const lines = rows.map((product) => CSV_HEADERS.map((header) => csvCell(product[header])).join(';'));
  return `\uFEFF${[CSV_HEADERS.join(';'), ...lines].join('\r\n')}`;
};

export const downloadCsvFile = (filename, content, type = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
