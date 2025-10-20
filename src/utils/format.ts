// src/utils/format.ts
export const formatCurrency = (n: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(n);
};
export const shortText = (s?: string, len = 120) => (s && s.length > len ? s.slice(0, len) + '...' : s ?? '');

export function formatDate(d?: string | number) {
  if (!d) return 'Không xác định';
  const date = new Date(d);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
