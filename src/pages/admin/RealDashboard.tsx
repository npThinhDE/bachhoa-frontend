import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  DocumentTextIcon, 
  UsersIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { adminApi } from '../../api/adminApi';
import { toast } from 'react-toastify';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Lấy tổng số sản phẩm
      const productsResponse = await adminApi.getAllProducts();
      const totalProducts = productsResponse.data?.length || 0;

      // TODO: Thêm API cho orders, users, revenue khi backend hỗ trợ
      const totalOrders = 0; // await adminApi.getTotalOrders();
      const totalUsers = 0; // await adminApi.getTotalUsers(); 
      const totalRevenue = 0; // await adminApi.getTotalRevenue();

      setStats({
        totalProducts,
        totalOrders,
        totalUsers, 
        totalRevenue
      });

      // TODO: Lấy đơn hàng gần đây
      setRecentOrders([]);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const statsData = [
    {
      name: 'Tổng sản phẩm',
      value: loading ? '...' : stats.totalProducts.toString(),
      change: '', // Tạm thời bỏ % change vì cần data lịch sử
      changeType: 'neutral',
      icon: ShoppingBagIcon,
      href: '/admin/products'
    },
    {
      name: 'Đơn hàng',
      value: loading ? '...' : stats.totalOrders.toString(),
      change: '',
      changeType: 'neutral',
      icon: DocumentTextIcon,
      href: '/admin/orders'
    },
    {
      name: 'Người dùng',
      value: loading ? '...' : stats.totalUsers.toString(),
      change: '',
      changeType: 'neutral',
      icon: UsersIcon,
      href: '/admin/users'
    },
    {
      name: 'Doanh thu',
      value: loading ? '...' : `₫${stats.totalRevenue.toLocaleString()}`,
      change: '',
      changeType: 'neutral',
      icon: CurrencyDollarIcon,
      href: '/admin/reports'
    }
  ];

  const quickActions = [
    {
      title: 'Thêm sản phẩm mới',
      description: 'Tạo sản phẩm mới cho cửa hàng',
      action: () => navigate('/admin/products'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Xem đơn hàng',
      description: 'Quản lý đơn hàng từ khách hàng',
      action: () => navigate('/admin/orders'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Quản lý người dùng',
      description: 'Xem và quản lý tài khoản người dùng',
      action: () => navigate('/admin/users'),
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Chào mừng quay trở lại! Đây là tổng quan về cửa hàng của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              onClick={() => navigate(stat.href)}
              className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              {stat.change && (
                <div className="mt-2 flex items-baseline">
                  <span className={`text-sm font-semibold ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">so với tháng trước</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white p-6 rounded-lg text-left transition-colors`}
            >
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="opacity-90">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Đang tải...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có đơn hàng nào</p>
                <p className="text-sm text-gray-400 mt-1">
                  Đơn hàng sẽ hiển thị ở đây khi khách hàng đặt hàng
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₫{order.total.toLocaleString()}</p>
                      <p className="text-sm text-green-600">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin hệ thống</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Phiên bản:</span>
                <span className="text-gray-900 font-medium">v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="text-green-600 font-medium">Kết nối thành công</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cập nhật cuối:</span>
                <span className="text-gray-900 font-medium">
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;