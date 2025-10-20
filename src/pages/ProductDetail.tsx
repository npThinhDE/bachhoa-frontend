// src/pages/ProductDetail.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getProductDetail,
  type ProductDetail as Detail,
  type VariantDTO as ProductVariant,
  type ImageDTO as ProductImage,
} from "@/api/productDetailApi";
import RelatedProducts from "@/components/RelatedProducts";
import { useDispatch } from "react-redux";
import { add as addToCart } from "@/features/cart/cartSlice";
import type { CartItem } from "@/features/cart/cartTypes";
import ProductReviews from '@/components/ProductReviews';

// Ghép URL ảnh từ BE (nếu DB lưu "/images/xxx.jpg")
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/bachhoa";
const resolveUrl = (u?: string | null) => {
  if (!u) return "/placeholder.png";
  if (/^https?:\/\//i.test(u)) return u;
  return `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
};

// Hiển thị nhãn biến thể đẹp từ JSON ({"size":"1kg","color":"xanh"})
const prettyVariantName = (name: string | null | undefined, fallback?: string) => {
  if (!name) return fallback ?? "";
  try {
    const o = JSON.parse(name);
    if (o && typeof o === "object") {
      return Object.entries(o)
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join(", ");
    }
  } catch {/* ignore */}
  return name || fallback || "";
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id ?? 0);

  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [variantIdx, setVariantIdx] = useState(0);
  const [mainImgIdx, setMainImgIdx] = useState(0);

  // ====== SỐ LƯỢNG: cho phép gõ tự do, chỉ chuẩn hoá khi blur hoặc khi nhấn +/- ======
  const [qtyInput, setQtyInput] = useState("1");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formatPrice = (v: number) =>
    v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // ===== Hooks (đặt trước mọi return) =====
  const images: ProductImage[] = useMemo(() => detail?.images ?? [], [detail]);
  const variants: ProductVariant[] = useMemo(() => detail?.variants ?? [], [detail]);

  const currentPrice = useMemo(() => {
    const base = detail?.basePrice ?? 0;
    if (!variants.length) return base;
    const v = variants[Math.min(variantIdx, variants.length - 1)];
    return v?.price ?? base;
  }, [detail?.basePrice, variants, variantIdx]);

  const stockLeft = useMemo(
    () => variants[variantIdx]?.stockQuantity ?? null,
    [variants, variantIdx]
  );

  // qty số hợp lệ suy ra từ chuỗi người dùng gõ
  const qty = useMemo(() => {
    const n = parseInt(qtyInput, 10);
    if (Number.isNaN(n)) return 1;
    const cap = stockLeft ?? 99;
    return Math.min(cap, Math.max(1, n));
  }, [qtyInput, stockLeft]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProductDetail(productId)
      .then((d) => {
        if (!mounted) return;
        setDetail(d);
        setVariantIdx(0);
        setMainImgIdx(0);
        setQtyInput("1");
        setError(null);
      })
      .catch(() => mounted && setError("Không tải được chi tiết sản phẩm."))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [productId]);

  useEffect(() => {
    if (detail?.name) document.title = `${detail.name} | Bách Hóa Online`;
  }, [detail?.name]);

  // đảm bảo index ảnh hợp lệ
  useEffect(() => {
    // Nếu KHÔNG có ảnh HOẶC index ảnh đang nằm ngoài phạm vi
    if (!images.length || mainImgIdx > images.length - 1) {
      setMainImgIdx(0);
    }
  }, [images.length, mainImgIdx]);

  const handleSelectVariant = useCallback(
    (idx: number) => {
      setVariantIdx(idx);
      // nếu có ảnh gắn variant thì auto chọn
      const targetVariantId = variants[idx]?.variantId ?? null;
      if (targetVariantId) {
        const foundIdx = images.findIndex((im) => im.variantId === targetVariantId);
        if (foundIdx >= 0) setMainImgIdx(foundIdx);
      }
      setQtyInput("1");
    },
    [variants, images]
  );

  const handleThumbClick = useCallback((idx: number) => setMainImgIdx(idx), []);

  // ===== Handlers số lượng =====
  const onQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    // chỉ cho tối đa 2 chữ số, cho phép rỗng khi đang gõ
    if (/^\d{0,2}$/.test(v)) setQtyInput(v);
  };
  const onQtyBlur = () => {
    // chuẩn hoá khi rời focus
    if (qtyInput === "" || qty < 1) setQtyInput("1");
    else setQtyInput(String(qty));
  };
  const decQty = () => setQtyInput(String(Math.max(1, qty - 1)));
  const incQty = () => {
    const cap = stockLeft ?? 99;
    setQtyInput(String(Math.min(cap, qty + 1))); // ✅ tăng đúng 1, không nhảy 99
  };

  // Build CartItem đúng shape của cartTypes.ts
  const buildCartItem = (): CartItem => {
    const v = variants[variantIdx];
    const price = v?.price ?? detail!.basePrice ?? 0;
    return {
      id: `${detail!.productId}:${v?.variantId ?? "none"}`, // gộp theo product+variant
      name: detail!.name,
      price,
      qty, // số hợp lệ đã chuẩn hoá
      image: resolveUrl(images[mainImgIdx]?.imageUrl ?? null),
    };
  };

  const handleAddToCart = () => {
    if (!detail) return;
    dispatch(addToCart(buildCartItem()));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout"); // hoặc "/cart" tuỳ flow nhóm
  };

  // ===== Renders =====
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse text-gray-500">Đang tải chi tiết sản phẩm…</div>
      </div>
    );
  }
  if (error || !detail) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-rose-600">{error ?? "Không tìm thấy sản phẩm."}</div>
        <Link to="/" className="inline-block mt-4 text-indigo-600 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  const cap = stockLeft ?? 99;
  const canDec = qty > 1;
  const canInc = qty < cap;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 space-x-1">
        <Link to="/" className="hover:underline">Trang chủ</Link>
        <span>/</span>
        <Link to="/products" className="hover:underline">Sản phẩm</Link>
        <span>/</span>
        <span className="text-gray-700">{detail.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery */}
        <section>
          <div className="relative w-full aspect-square bg-white border rounded-2xl flex items-center justify-center overflow-hidden">
            {images.length ? (
              <img
                src={resolveUrl(images[mainImgIdx]?.imageUrl)}
                alt={detail.name}
                className="max-h-full max-w-full object-contain select-none"
                draggable={false}
              />
            ) : (
              <div className="text-sm text-gray-400">Chưa có ảnh</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((img, idx) => (
                <button
                  key={img.imageId}
                  onClick={() => handleThumbClick(idx)}
                  className={`border rounded-lg overflow-hidden ${
                    idx === mainImgIdx ? "ring-2 ring-emerald-500" : ""
                  }`}
                  title={`Ảnh ${idx + 1}`}
                >
                  <img
                    src={resolveUrl(img.imageUrl)}
                    alt={`thumb-${idx}`}
                    className="w-full h-20 object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Info */}
        <section>
          <h1 className="text-2xl font-semibold">{detail.name}</h1>
          <div className="text-sm text-gray-500 mt-1">
            {detail.categoryName} • {detail.supplierName}
          </div>

          <div className="mt-4 text-emerald-600 text-xl font-bold">
            {formatPrice(currentPrice)}
          </div>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Chọn phân loại:</div>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, idx) => {
                  const label =
                    prettyVariantName(v.name, v.sku ?? undefined) || `Mẫu ${idx + 1}`;
                  return (
                    <button
                      key={v.variantId}
                      onClick={() => handleSelectVariant(idx)}
                      className={`px-3 py-2 rounded-full border text-sm ${
                        idx === variantIdx
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "hover:border-emerald-400"
                      }`}
                      title={v.sku ?? ""}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {stockLeft !== null && (
                <div className="mt-2 text-xs text-gray-500">Tồn kho: {stockLeft}</div>
              )}
            </div>
          )}

          {/* Qty + Actions */}
          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center border rounded-xl overflow-hidden">
              <button
                onClick={decQty}
                disabled={!canDec}
                className={`w-9 h-9 ${!canDec ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                −
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-12 h-9 text-center outline-none"
                value={qtyInput}
                onChange={onQtyChange}
                onBlur={onQtyBlur}
              />
              <button
                onClick={incQty}
                disabled={!canInc}
                className={`w-9 h-9 ${!canInc ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={stockLeft === 0}
              className={`px-5 py-3 rounded-xl text-white ${
                stockLeft === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600"
              }`}
            >
              Thêm vào giỏ
            </button>

            <button
              onClick={handleBuyNow}
              disabled={stockLeft === 0}
              className={`px-5 py-3 rounded-xl text-white ${
                stockLeft === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500"
              }`}
            >
              Mua ngay
            </button>

            <Link to="/products" className="px-5 py-3 rounded-xl border hover:bg-gray-50">
              Quay lại
            </Link>
          </div>

          {/* Mô tả */}
          {detail.description && (
            <div className="mt-8 prose max-w-none">
              <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
              <p className="whitespace-pre-line text-gray-700">{detail.description}</p>
            </div>
          )}
        </section>
      </div>

      <div className="mt-10">
        <RelatedProducts productId={productId} />
      </div>

      {/* ✅ Phần đánh giá sản phẩm */}
      <div className="mt-10">
        <ProductReviews productId={productId} />
      </div>
    </div>
  );
}
