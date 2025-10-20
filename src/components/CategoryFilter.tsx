// src/components/CategoryFilter.tsx
import React from "react";

export interface CategoryItem {
  categoryId: number;
  name: string;
}

interface CategoryFilterProps {
  categories?: CategoryItem[];
  onChange?: (id: string) => void;
  active?: string;
}

export default function CategoryFilter({
  categories = [],
  onChange,
  active = "",
}: CategoryFilterProps) {
  return (
    <div className="bg-white p-3 rounded-xl shadow-md">
      <h4 className="font-semibold mb-3 text-gray-800">Categories</h4>
      <ul className="space-y-1">
        {/* Nút hiển thị tất cả sản phẩm */}
        <li>
          <button
            onClick={() => onChange?.("")}
            className={`text-left w-full px-3 py-2 rounded-lg font-medium transition-all duration-200
              ${
                active === ""
                  ? "bg-green-500 text-white shadow-md scale-[1.02]"
                  : "hover:bg-green-50 text-gray-700 hover:translate-x-1"
              }`}
          >
            All
          </button>
        </li>

        {/* Danh sách danh mục từ API */}
        {categories.map((c) => (
          <li key={c.categoryId}>
            <button
              onClick={() => onChange?.(String(c.categoryId))}
              className={`text-left w-full px-3 py-2 rounded-lg font-medium transition-all duration-200
                ${
                  active === String(c.categoryId)
                    ? "bg-green-500 text-white shadow-md scale-[1.02]"
                    : "hover:bg-green-50 text-gray-700 hover:translate-x-1"
                }`}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
