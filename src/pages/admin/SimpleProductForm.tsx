import React, { useState, useEffect, useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AdminProduct, CreateProductRequest } from '../../types/admin';

interface ProductFormProps {
  product?: AdminProduct | null;
  onSave: (product: CreateProductRequest | Partial<CreateProductRequest>) => void;
  onCancel: () => void;
}

const SimpleProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  // console.log('🔥 SimpleProductForm rendering...', { product });
  
  // Memoize product ID to avoid unnecessary re-renders
  const productId = useMemo(() => product?.id, [product?.id]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 1,
    supplierId: 1,
    imageUrl: '',
    status: true,
  });

  // Initialize form data when product ID changes (not the whole product object)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        categoryId: product.categoryId || 1,
        supplierId: product.supplierId || 1,
        imageUrl: product.imageUrl || '',
        status: product.status ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: 1,
        supplierId: 1,
        imageUrl: '',
        status: true,
      });
    }
  }, [productId, product]); // Use productId to avoid unnecessary re-renders

  const [loading, setLoading] = useState(false);

  const isEditing = !!product;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔥 Form submit:', formData);
    
    if (!formData.name.trim()) {
      alert('Tên sản phẩm không được để trống!');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      console.log('🔥 Form saved successfully');
    } catch (error) {
      console.error('🔥 Form save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? parseFloat(value) || 0
        : type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : name === 'categoryId' || name === 'supplierId'
            ? parseInt(value) || 1  // Convert categoryId and supplierId to number
            : value
    }));
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onCancel}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={onCancel}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (VNĐ) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tồn kho *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Thực phẩm tươi sống</option>
                <option value={2}>Rau củ</option>
                <option value={3}>Đồ đông lạnh</option>
                <option value={4}>Gia vị</option>
                <option value={5}>Thực phẩm đóng gói sẵn</option>
              </select>
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhà cung cấp
              </label>
              <select
                name="supplierId"
                value={formData.supplierId || 1}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>CP Foods</option>
                <option value={2}>Dalat Farm</option>
                <option value={3}>Vissan</option>
                <option value={4}>Acecook Việt Nam</option>
                <option value={5}>Tường An</option>
                <option value={6}>Nam Ngư</option>
                <option value={7}>Hải Châu Food</option>
                <option value={8}>Milo Nestlé</option>
                <option value={9}>CP Frozen Food</option>
                <option value={10}>Oishi Việt Nam</option>
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL hình ảnh
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="images/product.jpg"
              />
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Sản phẩm đang hoạt động
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleProductForm;