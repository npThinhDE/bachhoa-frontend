// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductList from '../pages/ProductList';
import ProductManagement from '../pages/admin/ProductManagement';
import AdminLayout from '../components/layout/AdminLayout';
import MainLayout from '../components/layout/MainLayout';

// HOA: Trang "/" dùng ProductList để hiện data thật từ BE (tránh data mock ở Home)
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductList />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
        <Route path="/admin/products" element={<ProductManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}
