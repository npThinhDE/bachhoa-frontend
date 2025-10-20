// src/pages/Checkout.tsx
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import orderApi from "../api/orderApi";
import { clear } from "../features/cart/cartSlice";
import { useNavigate, useLocation } from "react-router-dom";

interface ItemPayload {
  productId: number;
  quantity: number;
  price: number;
}

interface OrderPayload {
  paymentMethod: string;
  items: ItemPayload[];
  totalPrice: number;
  promotionCode?: string;
}

export default function Checkout() {
  const location = useLocation();
  const singleProduct = location.state?.product;

  const cartItems = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [promoCode, setPromoCode] = useState<string>("");

  // Xác định items để mua
  const items: ItemPayload[] = singleProduct
    ? [
        {
          productId: Number(singleProduct.productId.split(":")[0]),
          quantity: 1,
          price: singleProduct.basePrice,
        },
      ]
    : cartItems.map((i) => ({
        productId: Number(i.id.split(":")[0]),
        quantity: i.qty,
        price: i.price,
      }));

  // Nếu items rỗng, không cho gửi
  const hasItems = items.length > 0;

  // Tính tổng tiền
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPrice = subtotal; // promo code chưa apply

  const createOrder = async () => {
    if (!hasItems) {
      alert("Giỏ hàng đang trống, không thể đặt hàng!");
      return;
    }

    const payload: OrderPayload = {
      paymentMethod,
      items,
      totalPrice,
    };

    if (promoCode.trim()) {
      payload.promotionCode = promoCode.trim();
    }

    try {
      console.log("🚀 Gửi payload:", JSON.stringify(payload, null, 2));
      const res = await orderApi.create(payload);
      console.log("✅ Đặt hàng thành công:", res.data);
      alert("🎉 Đặt hàng thành công!");
      if (!singleProduct) dispatch(clear());
      navigate("/orders");
    } catch (err) {
      console.error("❌ Lỗi khi tạo đơn:", err);
      alert("❌ Không thể đặt hàng, kiểm tra console!");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
        🧾 Thanh toán đơn hàng
      </h1>

      {!hasItems ? (
        <p className="text-gray-600 text-center">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 mb-4">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between py-2 text-gray-700"
              >
                <span>
                  {item.productId} × {item.quantity}
                </span>
                <span className="font-semibold">
                  {(item.price * item.quantity).toLocaleString()}₫
                </span>
              </li>
            ))}
          </ul>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Mã khuyến mãi:
            </label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Nhập mã khuyến mãi..."
            />
          </div>

          <div className="flex justify-between text-lg mb-2">
            <span>Tạm tính:</span>
            <span>{subtotal.toLocaleString()}₫</span>
          </div>

          <div className="flex justify-between font-semibold text-xl mb-6">
            <span>Tổng tiền:</span>
            <span className="text-red-600">{totalPrice.toLocaleString()}₫</span>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Phương thức thanh toán:
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="cod">💵 Thanh toán khi nhận hàng (COD)</option>
              <option value="credit_card">💳 Thẻ tín dụng</option>
              <option value="momo">📱 Ví MoMo</option>
            </select>
          </div>

          <button
            onClick={createOrder}
            className="bg-indigo-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Xác nhận đặt hàng
          </button>
        </>
      )}
    </div>
  );
}
