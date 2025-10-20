import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: HomeIcon,
      disabled: true,
    },
    {
      name: 'Quản lý sản phẩm',
      href: '/admin/products',
      icon: ShoppingBagIcon,
      disabled: false,
    },
    {
      name: 'Quản lý đơn hàng',
      href: '/admin/orders',
      icon: DocumentTextIcon,
      disabled: true,
    },
    {
      name: 'Quản lý người dùng',
      href: '/admin/users',
      icon: UsersIcon,
      disabled: true,
    },
    {
      name: 'Cài đặt',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
      disabled: true,
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Bach Hoa Admin</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = location.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={item.disabled ? undefined : () => navigate(item.href)}
                  disabled={item.disabled}
                  className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                    isCurrent
                      ? 'bg-blue-100 text-blue-900'
                      : item.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 w-64 p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Quản trị hệ thống
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
                >
                  Về trang mua hàng
                </button>
                <span className="text-sm text-gray-500">Admin User</span>
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;