// src/utils/token.ts
const ACCESS_KEY = 'token';
const REFRESH_KEY = 'refreshToken';

export const getAccessToken = (): string | null => {
  try { return localStorage.getItem(ACCESS_KEY); } catch { return null; }
};
export const getRefreshToken = (): string | null => {
  try { return localStorage.getItem(REFRESH_KEY); } catch { return null; }
};
export const setAccessToken = (t: string) => {
  try { localStorage.setItem(ACCESS_KEY, t); } catch { }
};
export const setRefreshToken = (t: string) => {
  try { localStorage.setItem(REFRESH_KEY, t); } catch { }
};
export const clearTokens = () => {
  try { localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY); } catch { }
};
