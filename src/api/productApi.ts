import axiosClient from "./axiosClient";
import type { Product } from "../features/products/productTypes";

export interface ProductListQuery {
  take?: number;               // FE -> map sang limit của BE
  offset?: number;             // offset
  q?: string;                  // tìm theo tên
  categoryId?: number | string; // lọc theo danh mục
  supplierId?: number | string;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: string;
  sort?: string;
}

// Chuẩn hóa danh sách ảnh của sản phẩm
function normalizeImages(x: any): string[] {
  if (Array.isArray(x.imageUrls)) {
    return x.imageUrls
      .map((path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path; // đã đủ URL
        if (path.startsWith("/bachhoa")) return `http://localhost:8080${path}`;
        if (path.startsWith("images/")) return `http://localhost:8080/bachhoa/${path}`;
        return `http://localhost:8080/bachhoa/images/${path}`;
      })
      .filter(Boolean);
  }
  return [];
}

// Chuẩn hóa dữ liệu trả về từ BE sang dạng Product của FE
function toProduct(x: any): Product {
  return {
    productId: Number(x.productId ?? x.id ?? 0),
    sku: x.sku ?? "",
    name: x.name ?? "",
    description: x.description ?? "",
    basePrice: Number(x.basePrice ?? x.price ?? 0),
    categoryName: x.categoryName ?? "",
    supplierName: x.supplierName ?? "",
    imageUrls: normalizeImages(x),
    variantNames: Array.isArray(x.variants)
      ? x.variants.map((v: any) => v.name ?? v.variantName ?? "")
      : [],
    totalStock: Number(x.totalStock ?? 0), // Thêm trường totalStock
  };
}

// API sản phẩm
export const productApi = {
  // Lấy danh sách sản phẩm (có thể lọc theo danh mục, tìm kiếm, sắp xếp...)
  async list(q: ProductListQuery = {}): Promise<Product[]> {
    const params: Record<string, any> = {};
    if (q.take != null) params.limit = q.take;
    if (q.offset != null) params.offset = q.offset;
    if (q.q) params.q = q.q;
    if (q.categoryId) params.categoryId = q.categoryId;
    if (q.supplierId) params.supplierId = q.supplierId;
    if (q.minPrice != null) params.minPrice = q.minPrice;
    if (q.maxPrice != null) params.maxPrice = q.maxPrice;
    if (q.priceRange) params.priceRange = q.priceRange;
    if (q.sort) params.sort = q.sort;

    // Xác định có filter hay không
    const hasFilter =
      params.q ||
      params.categoryId ||
      params.supplierId ||
      params.minPrice ||
      params.maxPrice ||
      params.priceRange ||
      params.sort;

    const url = hasFilter ? "/products/filter" : "/products";

    const res = await axiosClient.get(url, { params });
    const data = res.data?.data ?? res.data;
    const arr = Array.isArray(data) ? data : [];
    return arr.map(toProduct);
  },

  // Lấy chi tiết sản phẩm theo ID
  async getById(id: number | string): Promise<Product> {
    const res = await axiosClient.get(`/products/${id}`);
    const data = res.data?.data ?? res.data;
    return toProduct(data);
  },

  // Lấy danh sách sản phẩm liên quan
  async related(id: number | string, limit = 8): Promise<Product[]> {
    const res = await axiosClient.get(`/products/${id}/related`, {
      params: { limit },
    });
    const data = res.data?.data ?? res.data;
    const arr = Array.isArray(data) ? data : [];
    return arr.map(toProduct);
  },
};

export default productApi;
