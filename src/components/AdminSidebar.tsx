// src/components/AdminSidebar.tsx
import { FaHome, FaUser, FaBox, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

interface AdminSidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function AdminSidebar({ isOpen, toggle }: AdminSidebarProps) {
  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/admin' },
    { name: 'Products', icon: <FaBox />, path: '/admin/products' },
    { name: 'Orders', icon: <FaShoppingCart />, path: '/admin/orders' },
    { name: 'Users', icon: <FaUser />, path: '/admin/users' },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <span className="text-lg font-bold text-brown-900">Admin Panel</span>
        <button
          className="md:hidden text-brown-900 p-1 rounded hover:bg-gray-200"
          onClick={toggle}
        >
          <FaTimes />
        </button>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded hover:bg-gray-100 ${
                isActive ? 'bg-gold text-brown-900 font-semibold' : 'text-brown-700'
              }`
            }
            onClick={() => {
              if (isOpen && window.innerWidth < 768) toggle(); // auto close on mobile
            }}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
