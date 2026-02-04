/**
 * CSV Export utilities for admin reports
 */

type ExportableData = Record<string, string | number | boolean | null | undefined | Date>;

/**
 * Convert data to CSV string
 */
export function toCSV<T extends ExportableData>(
  data: T[],
  columns: Array<{ key: keyof T; header: string }>
): string {
  if (data.length === 0) return '';

  // Header row
  const headers = columns.map((col) => escapeCSVValue(col.header)).join(',');

  // Data rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        const value = item[col.key];
        return escapeCSVValue(formatValue(value));
      })
      .join(',');
  });

  return [headers, ...rows].join('\n');
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format value for CSV
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

/**
 * Download CSV file in browser
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export users to CSV
 */
export function exportUsersCSV(users: Array<{
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  lastLogin: Date | null;
}>) {
  return toCSV(users, [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'createdAt', header: 'Created At' },
    { key: 'lastLogin', header: 'Last Login' },
  ]);
}

/**
 * Export listings to CSV
 */
export function exportListingsCSV(listings: Array<{
  id: number;
  title: string;
  price: number | null;
  status: string;
  listingType: string;
  location: string | null;
  views: number;
  createdAt: Date;
}>) {
  return toCSV(listings, [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Title' },
    { key: 'price', header: 'Price' },
    { key: 'status', header: 'Status' },
    { key: 'listingType', header: 'Type' },
    { key: 'location', header: 'Location' },
    { key: 'views', header: 'Views' },
    { key: 'createdAt', header: 'Created At' },
  ]);
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsCSV(transactions: Array<{
  id: number;
  type: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
}>) {
  return toCSV(transactions, [
    { key: 'id', header: 'ID' },
    { key: 'type', header: 'Type' },
    { key: 'amount', header: 'Amount' },
    { key: 'currency', header: 'Currency' },
    { key: 'status', header: 'Status' },
    { key: 'createdAt', header: 'Date' },
  ]);
}
