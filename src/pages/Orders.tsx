// src/pages/Orders.tsx
import React, { useEffect, useState } from "react";
import  orderApi  from "../api/orderApi"; // ✅ import thật
import { useNavigate } from "react-router-dom";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  status: string;
}

interface Order {
  id: number;
  status: string;
  total: number;
  createdAt?: string;
  paymentMethod?: string;
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getAll(); // ✅ gọi API thật
        setOrders(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách đơn hàng:", error);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending_payment":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        🛒 Đơn hàng của tôi
      </h1>

      {orders.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-lg text-center text-gray-600">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <div>
                  <div className="font-semibold text-lg text-gray-800">
                    Đơn hàng #{o.id}
                  </div>
                  {o.createdAt && (
                    <div className="text-sm text-gray-500">
                      Ngày đặt: {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    o.status
                  )}`}
                >
                  {o.status === "pending_payment"
                    ? "Chờ thanh toán"
                    : o.status === "paid"
                    ? "Đã thanh toán"
                    : o.status === "shipped"
                    ? "Đã giao"
                    : o.status}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {o.items?.map((it) => (
                  <div
                    key={it.id}
                    className="flex justify-between text-gray-700 text-sm"
                  >
                    <span>
                      🧾 Sản phẩm #{it.productId} × {it.quantity}
                    </span>
                    <span>
                      {(it.price * it.quantity).toLocaleString()}₫
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-between items-center border-t pt-3">
                <span className="font-semibold text-gray-800">Tổng cộng:</span>
                <span className="text-lg font-bold text-green-600">
                  {o.total.toLocaleString()}₫
                </span>
              </div>

              {/* Nút hành động */}
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => navigate(`/orders/${o.id}`)}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
