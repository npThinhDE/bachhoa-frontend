// src/api/categoryApi.ts
import axiosClient from "./axiosClient";

export interface Category {
  categoryId: number;
  name: string;
}

export const categoryApi = {
  list(): Promise<Category[]> {
    return axiosClient.get("/categories").then((res) => {
      const data = res.data?.data ?? res.data;
      return Array.isArray(data) ? data : [];
    });
  },
};
