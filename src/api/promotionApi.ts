// src/api/promotionApi.ts
import axios from "axios";


// === Instance chung ===
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/bachhoa",
  headers: { "Content-Type": "application/json" },
});

// === Kiểu dữ liệu tương ứng với backend PromotionDTO ===
export type PromotionDTO = {
  id: number;
  code: string;
  title: string;
  description?: string;
  discountType: "PERCENT" | "AMOUNT";
  discountValue: number;
  minOrderAmount?: number | null;
  active: boolean;
  startAt?: string | null;
  endAt?: string | null;
};

// === API Methods ===
export async function getAllPromotions(): Promise<PromotionDTO[]> {
  const { data } = await api.get("/api/promotions");
  return data.data as PromotionDTO[];
}

export async function getPromotionByCode(code: string): Promise<PromotionDTO | null> {
  try {
    const response = await api.get("/api/promotions", { params: { code } });
    const data = response.data;
    console.log("🔍 Raw API response:", data);

    // ✅ Trường hợp backend trả về object trực tiếp
    if (data && typeof data === "object" && data.code) {
      return data as PromotionDTO;
    }

    // ✅ Trường hợp backend trả list (nếu không lọc được theo code)
    if (Array.isArray(data)) {
      return data[0] ?? null;
    }

    // ✅ Trường hợp backend bọc trong { data: {...} }
    if (data?.data && typeof data.data === "object") {
      return data.data as PromotionDTO;
    }

    return null;
  } catch (err) {
    console.error("🚨 Lỗi getPromotionByCode:", err);
    return null;
  }
}


export async function createPromotion(promo: Partial<PromotionDTO>) {
  const { data } = await api.post("/api/promotions", promo);
  return data.data;
}

export async function updatePromotion(id: number, promo: Partial<PromotionDTO>) {
  const { data } = await api.put(`/api/promotions/${id}`, promo);
  return data.data;
}

export async function deletePromotion(id: number) {
  const { data } = await api.delete(`/api/promotions/${id}`);
  return data.data;
}
