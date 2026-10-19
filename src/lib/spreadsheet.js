import { mapCsvProduct, normalizeHeader } from './csv.js';

export const spreadsheetRowsToProducts = (rows) => {
  if (!rows.length) return [];
  const headers = rows[0].map(normalizeHeader);

  return rows.slice(1).map((cells) => {
    const row = headers.reduce((result, header, index) => {
      result[header] = cells[index] == null ? '' : String(cells[index]);
      return result;
    }, {});

    return mapCsvProduct(row);
  });
};
