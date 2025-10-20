// src/components/ui/Button.tsx
import React from 'react';

// Giữ nguyên các variant cũ
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

// ✅ BƯỚC 1: Thêm định nghĩa cho các kích thước (size)
type Size = 'sm' | 'md' | 'lg';

// ✅ BƯỚC 2: Thêm `size` vào Props
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size; // Thêm dòng này
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md', // ✅ BƯỚC 3: Thêm `size` vào và đặt giá trị mặc định là 'md'
  className = '',
  ...rest
}: Props) {
  // Tách riêng các style chung, không bao gồm padding và font-size
  const base =
    'rounded-md font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Style cho các variant giữ nguyên
  const variantStyles: Record<Variant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-400',
  };

  // ✅ BƯỚC 4: Thêm một đối tượng style cho các kích thước
  const sizeStyles: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-xs', // Kích thước nhỏ
    md: 'px-4 py-2 text-sm',   // Kích thước trung bình (giống hệt button cũ của bạn)
    lg: 'px-6 py-3 text-base',  // Kích thước lớn
  };

  return (
    // ✅ BƯỚC 5: Kết hợp tất cả các style lại với nhau
    <button className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}