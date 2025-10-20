// src/pages/OrderDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import  orderApi  from "../api/orderApi"; // ✅ sửa lại import đúng

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const res = await orderApi.getById(Number(id));
          setOrder(res.data);
        } catch (err) {
          console.error("❌ Lỗi khi tải đơn hàng:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Đang tải dữ liệu đơn hàng...
      </p>
    );
  }

  if (!order) {
    return (
      <p className="text-center mt-10 text-red-500">
        ❌ Không tìm thấy đơn hàng.
      </p>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "⏳ Chờ thanh toán";
      case "paid":
        return "✅ Đã thanh toán";
      case "shipped":
        return "🚚 Đã giao hàng";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">
        Chi tiết đơn hàng #{order.id}
      </h1>

      <div className="space-y-2 text-gray-700">
        <p>
          <strong>🧾 Trạng thái:</strong>{" "}
          <span className="font-medium text-indigo-700">
            {getStatusText(order.status)}
          </span>
        </p>
        <p>
          <strong>💰 Tổng tiền:</strong>{" "}
          <span className="text-red-600 font-semibold">
            {order.total?.toLocaleString()}₫
          </span>
        </p>
        {order.paymentMethod && (
          <p>
            <strong>💳 Phương thức:</strong> {order.paymentMethod}
          </p>
        )}
        {order.createdAt && (
          <p>
            <strong>📅 Ngày đặt:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        )}
      </div>

      <h2 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
        🛍️ Sản phẩm trong đơn:
      </h2>
      <ul className="divide-y divide-gray-200 bg-gray-50 rounded-lg">
        {order.items?.map((item: any) => (
          <li
            key={item.id}
            className="py-2 px-3 flex justify-between text-gray-700"
          >
            <span>
              Sản phẩm #{item.productId} × {item.quantity}
            </span>
            <span className="font-medium text-indigo-700">
              {(item.price * item.quantity).toLocaleString()}₫
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <Link to="/orders">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition">
            ← Quay lại danh sách
          </button>
        </Link>
      </div>
    </div>
  );
}
