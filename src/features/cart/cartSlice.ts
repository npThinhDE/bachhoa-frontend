// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartItem } from './cartTypes';

const persistKey = 'market_cart_v1';

const loadState = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(persistKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveState = (items: CartItem[]) => {
  try {
    localStorage.setItem(persistKey, JSON.stringify(items));
  } catch {}
};

const initialState: CartState = { items: loadState() };

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.qty += action.payload.qty;
        if (existing.qty <= 0) {
          // auto remove nếu qty <= 0
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        }
      } else if (action.payload.qty > 0) {
        state.items.push(action.payload);
      }
      saveState(state.items);
    },
    remove(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveState(state.items);
    },
    updateQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const it = state.items.find((i) => i.id === action.payload.id);
      if (it) {
        if (action.payload.qty > 0) {
          it.qty = action.payload.qty;
        } else {
          // nếu qty <= 0 thì xóa luôn
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        }
      }
      saveState(state.items);
    },
    clear(state) {
      state.items = [];
      saveState(state.items);
    },
  },
});

export const { add, remove, updateQty, clear } = slice.actions;
export default slice.reducer;
