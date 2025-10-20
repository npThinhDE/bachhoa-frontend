import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AdminProduct } from '../../types/admin';
import { getImageUrl } from '../../utils/imageUrl';

interface ProductViewModalProps {
  product: AdminProduct | null;
  onClose: () => void;
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết sản phẩm</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Image */}
          {product.imageUrl && (
            <div className="flex justify-center">
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                className="w-48 h-48 object-cover rounded-lg shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.jpg';
                }}
              />
            </div>
          )}

          {/* Product Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {product.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded min-h-[60px]">
                  {product.description || 'Chưa có mô tả'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá bán
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded font-semibold">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tồn kho
                </label>
                <p className={`text-sm p-2 rounded font-medium ${
                  product.stock > 10 
                    ? 'text-green-900 bg-green-50' 
                    : product.stock > 0 
                      ? 'text-yellow-900 bg-yellow-50'
                      : 'text-red-900 bg-red-50'
                }`}>
                  {product.stock} sản phẩm
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {product.categoryName || `ID: ${product.categoryId}`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhà cung cấp
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {product.supplierName || `ID: ${product.supplierId || 'N/A'}`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.status
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày tạo
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {product.createdAt ? formatDate(product.createdAt) : 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cập nhật lần cuối
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {product.updatedAt ? formatDate(product.updatedAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Product ID */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>ID sản phẩm: #{product.id}</span>
              <span>Lần cuối cập nhật: {product.updatedAt ? formatDate(product.updatedAt) : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;