// src/utils/url.ts
export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/bachhoa"
).replace(/\/+$/, ""); // bỏ dấu / cuối

const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i; // http:, https:, //host
const SPECIAL_SCHEME = /^(data:|blob:)/i;

export function resolveUrl(u?: string | null): string {
  if (!u) return "/placeholder.png";
  if (ABSOLUTE_URL.test(u) || SPECIAL_SCHEME.test(u)) return u;
  const clean = String(u).replace(/^\/+/, ""); // bỏ / đầu
  return `${API_BASE}/${clean}`;
}

// Alias dùng cho ảnh
export const imgUrl = resolveUrl;

// Lấy ảnh chính từ nhiều dạng DTO (tuỳ backend trả về)
export function mainImageOf(p: any): string | undefined {
  return (
    p?.imageUrl ??
    (Array.isArray(p?.imageUrls) ? p.imageUrls[0] : undefined) ??
    (Array.isArray(p?.images)
      ? p.images.find((i: any) => i?.isMain)?.imageUrl ?? p.images[0]?.imageUrl
      : undefined)
  );
}
