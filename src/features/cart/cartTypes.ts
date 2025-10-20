// src/features/cart/cartTypes.ts
export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string | null;
};
export type CartState = {
  items: CartItem[];
};
