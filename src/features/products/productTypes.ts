// src/features/products/productTypes.ts
export type Product = {
  
  
  productId: number;             // ID sản phẩm (theo DB)
  sku: string;                   // Mã sản phẩm
  name: string;                  // Tên sản phẩm
  description?: string;          // Mô tả sản phẩm
  basePrice: number;             // Giá gốc sản phẩm
  categoryName: string;          // Tên danh mục
  supplierName: string;          // Tên nhà cung cấp
  imageUrls: string[];           // Danh sách ảnh
  variantNames?: string[];       // Danh sách biến thể
  categoryId?: number;
  totalStock?: number;           // Tổng số lượng tồn kho
};

export type ProductsState = {
  items: Product[];
  loading: boolean;
  error?: string | null;
};
