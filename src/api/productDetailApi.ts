// src/api/productDetailApi.ts
import axiosClient from "./axiosClient";

export type VariantDTO = {
  variantId: number;
  sku: string | null;
  name: string | null;   // BE đang trả JSON attributes
  price: number;
  stockQuantity?: number;   
};

// === Types khớp BE DTO ===
export type ImageDTO = {
  imageId: number;
  imageUrl: string;
  isMain: boolean;
  variantId: number | null;
};


export type ProductDetail = {
  productId: number;
  sku?: string | null;
  name: string;
  description?: string | null;
  basePrice?: number | null;
  categoryId?: number | null;
  categoryName?: string | null;
  supplierId?: number | null;
  supplierName?: string | null;
  images: ImageDTO[];
  variants: VariantDTO[];
};

export type RelatedItem = {
  productId: number;
  name: string;
  basePrice?: number | null;
  imageUrl?: string | null;
};

export async function getProductDetail(id: number): Promise<ProductDetail> {
  const { data } = await axiosClient.get(`/products/${id}`);
  return data.data as ProductDetail; // BE bọc trong {data: ...}
}

// trả về danh sách rút gọn cho related
export async function getRelated(id: number, limit = 8): Promise<RelatedItem[]> {
  const { data } = await axiosClient.get(`/products/${id}/related`, { params: { limit } });
  return data.data as RelatedItem[];
}
