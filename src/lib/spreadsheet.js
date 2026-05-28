import { mapCsvProduct } from './csv.js';

const normalizeSpreadsheetHeader = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

export const spreadsheetRowsToProducts = (rows) => {
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
