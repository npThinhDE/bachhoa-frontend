import { useEffect, useState } from "react";
import {
  getCartItems,
  updateQuantity,
  deleteCartItem,
  clearCart,
} from "../api/cartApi";
import { useNavigate } from "react-router-dom"; // ✅ dùng để điều hướng

export default function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ khởi tạo hook điều hướng

  const loadCart = async () => {
    const data = await getCartItems();
    setItems(data || []);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdate = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    setLoading(true);
    await updateQuantity(id, quantity);
    await loadCart();
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa sản phẩm này khỏi giỏ hàng?")) return;
    setLoading(true);
    await deleteCartItem(id);
    await loadCart();
    setLoading(false);
  };

  const handleClear = async () => {
    if (!confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng không?")) return;
    setLoading(true);
    await clearCart();
    await loadCart();
    setLoading(false);
  };  

  const handleCheckout = () => {
    navigate("/checkout"); // ✅ chuyển sang trang thanh toán
  };

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-green-50 rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        🛒 Giỏ hàng của bạn
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-600">Giỏ hàng trống.</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th className="border p-3 text-left">Sản phẩm</th>
                <th className="border p-3 text-right">Giá</th>
                <th className="border p-3 text-center">Số lượng</th>
                <th className="border p-3 text-right">Tổng</th>
                <th className="border p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr
                  key={it.id}
                  className="hover:bg-green-100 transition-colors duration-150"
                >
                  <td className="border p-3 font-medium">{it.name}</td>
                  <td className="border p-3 text-right text-gray-700">
                    {it.price.toLocaleString()} ₫
                  </td>
                  <td className="border p-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleUpdate(it.id, it.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                      >
                        –
                      </button>
                      <span className="w-8 text-center">{it.quantity}</span>
                      <button
                        onClick={() => handleUpdate(it.id, it.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="border p-3 text-right text-green-700 font-semibold">
                    {(it.price * it.quantity).toLocaleString()} ₫
                  </td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => handleDelete(it.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleClear}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Xóa toàn bộ giỏ hàng
            </button>

            <div className="text-right">
              <div className="text-xl font-bold text-green-800 mb-3">
                Tổng cộng: {total.toLocaleString()} ₫
              </div>

              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </>
      )}

      {loading && (
        <p className="text-gray-500 mt-4 italic animate-pulse">
          ⏳ Đang cập nhật...
        </p>
      )}
    </div>
  );
}
