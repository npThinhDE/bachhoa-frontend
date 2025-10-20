import axios from 'axios';
import axiosClient from './axiosClient';
import { AdminProduct, CreateProductRequest } from '../types/admin';

export interface AdminApiResponse<T> {
  data: T;
  error?: string;
}

// Admin Product API
const toNumber = (value: unknown): number | undefined => {
  if (value == null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrapProductPayload = (value: any): any => {
  let current = value;
  let guard = 0;

  while (
    current &&
    !Array.isArray(current) &&
    typeof current === 'object' &&
    guard < 5
  ) {
    if (Object.prototype.hasOwnProperty.call(current, 'product')) {
      current = current.product;
      guard += 1;
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(current, 'data')) {
      current = current.data;
      guard += 1;
      continue;
    }

    break;
  }

  return current;
};

const pickFirst = <T = unknown>(obj: Record<string, unknown>, keys: string[]): T | undefined => {
  for (const key of keys) {
    if (key in obj && obj[key] != null) return obj[key] as T;
    const snake = key.replace(/[A-Z]/g, (ch) => `_${ch.toLowerCase()}`);
    if (snake in obj && obj[snake] != null) return obj[snake] as T;
  }
  return undefined;
};

const pickErrorMessage = (payload: unknown): string | undefined => {
  if (!payload || typeof payload !== 'object') return undefined;
  const record = payload as Record<string, unknown>;
  return pickFirst<string>(record, ['error', 'message', 'detail']);
};

const throwAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message =
      pickErrorMessage(error.response?.data) ??
      error.message ??
      'Request failed';
    throw new Error(message);
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error('Unknown error');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeAdminProduct = (raw: any): AdminProduct => {
  const source = unwrapProductPayload(raw) ?? {};
  if (!source || typeof source !== 'object') {
    return {
      id: 0,
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: 0,
      imageUrl: '',
      status: true,
    } as AdminProduct;
  }

  const id = toNumber(pickFirst(source, ['productId', 'id', 'productID'])) ?? 0;
  const price = toNumber(pickFirst(source, ['basePrice', 'price'])) ?? 0;
  const stock = toNumber(pickFirst(source, ['totalStock', 'stock', 'quantity'])) ?? 0;
  const categoryId =
    toNumber(
      pickFirst(source, [
        'categoryId',
        'categoryID',
        'categoryIdFk',
      ]) ?? pickFirst(source.category ?? {}, ['categoryId', 'id'])
    ) ?? 0;
  const supplierId = toNumber(
    pickFirst(source, ['supplierId', 'supplierID']) ?? pickFirst(source.supplier ?? {}, ['supplierId', 'id'])
  );

  const imageUrl =
    pickFirst(source, ['imageUrl']) ??
    source?.images?.[0]?.imageUrl ??
    source?.imageUrls?.[0] ??
    '';

  return {
    id,
    name: (pickFirst(source, ['name', 'productName']) as string) ?? '',
    description: (pickFirst(source, ['description', 'details']) as string) ?? '',
    price,
    stock,
    categoryId,
    categoryName:
      (pickFirst(source, ['categoryName']) as string) ??
      (pickFirst(source.category ?? {}, ['name']) as string),
    supplierId: supplierId ?? 0,
    supplierName:
      (pickFirst(source, ['supplierName']) as string) ??
      (pickFirst(source.supplier ?? {}, ['name']) as string),
    imageUrl,
    status: (pickFirst(source, ['status', 'isActive']) as boolean) ?? true,
    createdAt: pickFirst(source, ['createdAt', 'created_at', 'createdDate', 'created_date']) as string | undefined,
    updatedAt: pickFirst(source, ['updatedAt', 'updated_at', 'updatedDate', 'updated_date']) as string | undefined,
  };
};

export const adminApi = {
  // Get all products (including inactive for admin)
  getAllProducts: async (params?: {
    categoryId?: number;
    status?: boolean;
    search?: string;
  }): Promise<AdminApiResponse<AdminProduct[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString());
    if (params?.status !== undefined) queryParams.append('status', params.status.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const url = `/admin/products${queryParams.toString() ? `?${queryParams}` : ''}`;
    try {
      const response = await axiosClient.get(url);
      // Map từ backend ProductDTO sang AdminProduct
      const rawList = unwrapProductPayload(response.data);

      if (rawList && typeof rawList === 'object' && !Array.isArray(rawList)) {
        const maybeError = rawList as { error?: unknown };
        if (maybeError?.error) {
          throw new Error(String(maybeError.error));
        }
      }

      const listWrapper = rawList as { items?: unknown } | null | undefined;
      const items = Array.isArray(rawList)
        ? rawList
        : Array.isArray(listWrapper?.items)
          ? (listWrapper?.items as unknown[])
          : [];

      const products = (items as unknown[]).map(normalizeAdminProduct);
      return { data: products };
    } catch (error) {
      return throwAxiosError(error);
    }
  },

  // Get product by ID
  getProductById: async (id: number): Promise<AdminApiResponse<AdminProduct>> => {
    return axiosClient.get(`/admin/products/${id}`);
  },

  // Create new product
  createProduct: async (product: CreateProductRequest): Promise<AdminApiResponse<AdminProduct>> => {
    // Map frontend data sang backend format
    const backendData = {
      name: product.name,
      // SKU sẽ được backend tự tạo
      description: product.description,
      basePrice: product.price,
      categoryId: product.categoryId || 1,
      supplierId: product.supplierId || 1, // From form or default
      stock: product.stock || 0,
      imageUrl: product.imageUrl || '',
    };
    try {
      const response = await axiosClient.post('/admin/products', backendData);
      const entity = unwrapProductPayload(response.data);

      if (entity && typeof entity === 'object' && 'error' in entity && !('productId' in entity) && !('id' in entity)) {
        throw new Error(String((entity as { error?: unknown }).error ?? 'Failed to create product'));
      }

      return { data: normalizeAdminProduct(entity) };
    } catch (error) {
      return throwAxiosError(error);
    }
  },

  // Update product
  updateProduct: async (id: number, product: Partial<CreateProductRequest>): Promise<AdminApiResponse<AdminProduct>> => {
    // Map frontend data sang backend format (giống createProduct)
    const backendData = {
      name: product.name,
      description: product.description,
      basePrice: product.price,
      categoryId: product.categoryId,
      supplierId: product.supplierId || 1, // From form or default
      stock: product.stock || 0,
      imageUrl: product.imageUrl || '',
    };
    try {
      const response = await axiosClient.put(`/admin/products/${id}`, backendData);
      const entity = unwrapProductPayload(response.data);

      if (entity && typeof entity === 'object' && 'error' in entity && !('productId' in entity) && !('id' in entity)) {
        throw new Error(String((entity as { error?: unknown }).error ?? 'Failed to update product'));
      }

      return { data: normalizeAdminProduct(entity) };
    } catch (error) {
      return throwAxiosError(error);
    }
  },

  // Delete product  
  deleteProduct: async (id: number): Promise<AdminApiResponse<{ message: string; id: number }>> => {
    await axiosClient.delete(`/admin/products/${id}`);
    return {
      data: {
        message: 'Product deleted successfully',
        id
      }
    };
  },

  // Bulk operations
  bulkUpdateStatus: async (ids: number[], status: boolean): Promise<AdminApiResponse<{ message: string }>> => {
    return axiosClient.post('/admin/products/bulk-status', { ids, status });
  },

  // Get categories for dropdown
  getCategories: async (): Promise<AdminApiResponse<{ id: number; name: string }[]>> => {
    return axiosClient.get('/categories');
  },
};

// Mock implementation for development (can be toggled)
const USE_MOCK = false; // Set to true for development without backend

// Mock database - in-memory storage
const mockProducts: AdminProduct[] = [
  {
    id: 1,
    name: 'Gạo ST25 Premium',
    description: 'Gạo thơm cao cấp từ An Giang',
    price: 85000,
    stock: 100,
    categoryId: 1,
    categoryName: 'Gạo - Ngũ cốc',
    imageUrl: '/images/gao-st25.jpg',
    status: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Thịt heo ba chỉ',
    description: 'Thịt heo tươi sạch',
    price: 150000,
    stock: 50,
    categoryId: 2,
    categoryName: 'Thịt tươi sống',
    imageUrl: '/images/thit-heo.jpg',
    status: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
];

let nextId = 3;

// Helper function to get category name
const getCategoryName = (categoryId: number): string => {
  const categories = {
    1: 'Gạo - Ngũ cốc',
    2: 'Thịt tươi sống',
    3: 'Rau củ quả',
    4: 'Đồ uống',
  };
  return categories[categoryId as keyof typeof categories] || 'Khác';
};

export const adminApiMock = {
  getAllProducts: async (): Promise<AdminApiResponse<AdminProduct[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    console.log('🔥 Mock API getAllProducts returning:', mockProducts);
    return {
      data: [...mockProducts] // Return copy to avoid mutation issues
    };
  },

  getProductById: async (id: number): Promise<AdminApiResponse<AdminProduct>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: {
        id,
        name: 'Mock Product',
        description: 'Mock description',
        price: 100000,
        stock: 10,
        categoryId: 1,
        imageUrl: '/images/mock.jpg',
        status: true,
      }
    };
  },

  createProduct: async (product: CreateProductRequest): Promise<AdminApiResponse<AdminProduct>> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newProduct: AdminProduct = {
      id: nextId++,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock ?? 0,
      categoryId: product.categoryId,
      categoryName: getCategoryName(product.categoryId),
      imageUrl: product.imageUrl || '/images/default.jpg',
      status: product.status ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockProducts.push(newProduct);
    console.log('🔥 Mock API created product:', newProduct);
    console.log('🔥 Mock products now:', mockProducts);
    
    return {
      data: newProduct
    };
  },

  updateProduct: async (id: number, product: Partial<CreateProductRequest>): Promise<AdminApiResponse<AdminProduct>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const existingIndex = mockProducts.findIndex(p => p.id === id);
    if (existingIndex === -1) {
      throw new Error('Product not found');
    }
    
    const existingProduct = mockProducts[existingIndex];
    const updatedProduct: AdminProduct = {
      ...existingProduct,
      name: product.name || existingProduct.name,
      description: product.description ?? existingProduct.description,
      price: product.price ?? existingProduct.price,
      stock: product.stock ?? existingProduct.stock,
      categoryId: product.categoryId ?? existingProduct.categoryId,
      categoryName: product.categoryId ? getCategoryName(product.categoryId) : existingProduct.categoryName,
      imageUrl: product.imageUrl ?? existingProduct.imageUrl,
      status: product.status ?? existingProduct.status,
    };
    
    mockProducts[existingIndex] = updatedProduct;
    console.log('🔥 Mock API updated product:', updatedProduct);
    
    return {
      data: updatedProduct
    };
  },

  deleteProduct: async (id: number): Promise<AdminApiResponse<{ message: string; id: number }>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const existingIndex = mockProducts.findIndex(p => p.id === id);
    if (existingIndex === -1) {
      throw new Error('Product not found');
    }
    
    const deletedProduct = mockProducts.splice(existingIndex, 1)[0];
    console.log('🔥 Mock API deleted product:', deletedProduct);
    console.log('🔥 Mock products now:', mockProducts);
    
    return {
      data: {
        message: 'Product deleted successfully',
        id
      }
    };
  },

  getCategories: async (): Promise<AdminApiResponse<{ id: number; name: string }[]>> => {
    return {
      data: [
        { id: 1, name: 'Gạo - Ngũ cốc' },
        { id: 2, name: 'Thịt tươi sống' },
        { id: 3, name: 'Rau củ quả' },
        { id: 4, name: 'Đồ uống' },
      ]
    };
  }
};

// Export the appropriate API based on environment
export default USE_MOCK ? adminApiMock : adminApi;