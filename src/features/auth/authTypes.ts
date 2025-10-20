// src/features/auth/authTypes.ts

// Định nghĩa kiểu cho một địa chỉ, khớp với AddressDTO từ backend
export interface Address {
  label: string;
  addressLine: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

// Cập nhật kiểu User để bao gồm mảng các địa chỉ
export interface User {
  userId: number;
  username: string;
  role: 'customer' | 'admin';
  phoneNumber: string;
  email: string;
  createdAt: string;
  addresses: Address[]; // <-- THÊM TRƯỜNG NÀY
}

// Kiểu cho state của Redux slice
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}