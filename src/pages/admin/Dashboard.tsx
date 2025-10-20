// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from 'react';
import { FaBars, FaBell, FaSearch } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';
import ManageProducts from './ManageProducts';
import ManageOrders from './ManageOrders';
import ManageUsers from './ManageUsers';
import { productApi } from '../../api/productApi';
import { orderApi } from '../../api/orderApi';
import { userApi } from '../../api/userApi';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });

  useEffect(() => {
    async function loadStats() {
      const products: Product[] = await productApi.list().catch(() => []);
      const orders = await orderApi.getAll().then(response => response.data?.data || []).catch(() => []);
      const users = await userApi.list().catch(() => []);
      const revenue = products.reduce((sum: number, p: Product) => sum + (p.price || 0) * (p.stock || 0), 0);

      setStats({
        products: products.length,
        orders: orders.length,
        users: users.length,
        revenue
      });
    }
    loadStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-10 transition-all duration-300 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white shadow-md flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-brown-900">Admin Dashboard</h1>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-gold w-full md:w-64"
              />
              <FaSearch className="absolute left-3 top-2.5 text-brown-500" />
            </div>

            <button className="bg-brown-800 p-2 rounded hover:bg-brown-900 text-white">
              <FaBell />
            </button>

            <button
              className="md:hidden bg-brown-800 p-2 rounded hover:bg-brown-900 text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 flex flex-col overflow-auto p-4 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow">Total Products: {stats.products}</div>
            <div className="bg-white p-4 rounded shadow">Total Orders: {stats.orders}</div>
            <div className="bg-white p-4 rounded shadow">Total Users: {stats.users}</div>
            <div className="bg-white p-4 rounded shadow">Revenue: ${stats.revenue}</div>
          </div>

          {/* Manage Sections */}
          <ManageProducts />
          <ManageOrders />
          <ManageUsers />
        </div>
      </div>
    </div>

  );
}
