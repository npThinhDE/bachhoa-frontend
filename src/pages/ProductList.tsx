import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";

const STATIC_CATEGORIES = [
  { categoryId: 1, name: "Rau củ" },
  { categoryId: 2, name: "Đồ khô" },
  { categoryId: 3, name: "Gia vị" },
];

export default function ProductList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.products);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    dispatch(fetchProducts({}));

    const refreshHandler: EventListener = () => {
      dispatch(fetchProducts({}));
    };

    window.addEventListener("products-refresh", refreshHandler);
    return () => {
      window.removeEventListener("products-refresh", refreshHandler);
    };
  }, [dispatch]);

  const categories = STATIC_CATEGORIES;

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
  };

  const handlePriceFilter = (label: string) => {
    setSelectedPrice(label);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Sidebar */}
      <aside className="col-span-4 md:col-span-1 space-y-3">
        {/* Bộ lọc danh mục */}
        <CategoryFilter
          categories={categories}
          onChange={handleCategoryChange}
          active={selectedCategory}
        />

          {/* Bộ lọc giá nhanh */}
          <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-medium mb-2 text-sm">Khoảng giá</h2>
              <ul className="space-y-1 text-sm">
                  <li>
                      <button
                        onClick={() => handlePriceFilter("under-50")}
                        className={selectedPrice === "under-50" ? "font-semibold text-green-600" : ""}
                      >
                        Dưới 50k
                      </button>
                  </li>
                  <li>
                      <button
                        onClick={() => handlePriceFilter("50-100")}
                        className={selectedPrice === "50-100" ? "font-semibold text-green-600" : ""}
                      >
                        50k - 100k
                      </button>
                  </li>
                  <li>
                      <button
                        onClick={() => handlePriceFilter("100-300")}
                        className={selectedPrice === "100-300" ? "font-semibold text-green-600" : ""}
                      >
                        100k - 300k
                      </button>
                  </li>
                  <li>
                      <button
                        onClick={() => handlePriceFilter("over-300")}
                        className={selectedPrice === "over-300" ? "font-semibold text-green-600" : ""}
                      >
                        Từ 300k trở lên
                      </button>
                  </li>
              </ul>
          </div>

          {/*Bộ lọc sắp xếp */}
          <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-medium mb-2 text-sm">Sắp xếp theo</h2>
              <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="border p-1 w-full text-sm"
              >
                  <option value="">Mặc định</option>
                  <option value="price_asc">Giá ↑</option>
                  <option value="price_desc">Giá ↓</option>
                  <option value="name_az">Tên A–Z</option>
                  <option value="name_za">Tên Z–A</option>
              </select>
          </div>
      </aside>

      {/* Main content */}
      <section className="col-span-4 md:col-span-3">
        <h1 className="text-xl font-semibold mb-4">Sản phẩm</h1>

        {loading && <div>Đang tải…</div>}
        {!loading && error && <div className="text-red-600">Lỗi: {String(error)}</div>}
        {!loading && !error && items?.length === 0 && <div>Chưa có sản phẩm.</div>}

        {!loading && !error && items?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items
              // .filter((p) => (p.totalStock ?? 0) > 0) // Tạm comment để debug - Chỉ hiển thị sản phẩm còn hàng
              .map((p) => (
                <ProductCard key={p.productId} product={p} disableNavigation />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
