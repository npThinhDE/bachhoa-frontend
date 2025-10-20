import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  DocumentTextIcon, 
  UsersIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      name: 'Tổng sản phẩm',
      value: '150',
      change: '+12%',
      changeType: 'increase',
      icon: ShoppingBagIcon,
      href: '/admin/products'
    },
    {
      name: 'Đơn hàng',
      value: '89',
      change: '+5%',
      changeType: 'increase',
      icon: DocumentTextIcon,
      href: '/admin/orders'
    },
    {
      name: 'Người dùng',
      value: '1,234',
      change: '+8%',
      changeType: 'increase',
      icon: UsersIcon,
      href: '/admin/users'
    },
    {
      name: 'Doanh thu',
      value: '₫2,450,000',
      change: '+15%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      href: '/admin/reports'
    }
  ];

  const quickActions = [
    {
      title: 'Thêm sản phẩm mới',
      description: 'Thêm sản phẩm vào cửa hàng',
      action: () => navigate('/admin/products'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Xem đơn hàng',
      description: 'Quản lý đơn hàng mới',
      action: () => navigate('/admin/orders'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Quản lý người dùng',
      description: 'Xem danh sách người dùng',
      action: () => navigate('/admin/users'),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Chào mừng quay trở lại! Đây là tổng quan về cửa hàng của bạn.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(stat.href)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 ml-1">so với tháng trước</span>
              </div>
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
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">#DH00{item}</p>
                    <p className="text-sm text-gray-600">Khách hàng {item}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₫{(item * 150000).toLocaleString()}</p>
                    <p className="text-sm text-green-600">Đã thanh toán</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Xem tất cả đơn hàng →
              </button>
            </div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Sản phẩm sắp hết hàng</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'Gạo ST25', stock: 5 },
                { name: 'Thịt heo ba chỉ', stock: 3 },
                { name: 'Cà rót tươi', stock: 8 }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">Còn {product.stock} sản phẩm</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Sắp hết
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/admin/products')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Quản lý kho hàng →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;