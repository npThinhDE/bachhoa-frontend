export interface AdminProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName?: string;
  supplierId?: number;
  supplierName?: string;
  imageUrl?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  supplierId?: number;
  imageUrl?: string;
  status: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}