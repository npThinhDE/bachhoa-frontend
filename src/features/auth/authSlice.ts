// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { authApi, LoginPayload, RegisterPayload } from '../../api/authApi';
import { setAccessToken, setRefreshToken, clearTokens } from '../../utils/token';
import type { AuthState, User } from './authTypes';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isInitialized: false,
};

// --- ASYNC THUNKS ---

export const login = createAsyncThunk<User, LoginPayload>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.login(payload);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      // Sau khi có token, gọi API để lấy đầy đủ thông tin người dùng
      const userProfile = await authApi.me();
      return userProfile;
    } catch (err: any) {
      clearTokens(); // Dọn dẹp token nếu có lỗi
      return rejectWithValue(err?.response?.data?.error || 'Đăng nhập thất bại.');
    }
  }
);

export const register = createAsyncThunk<User, RegisterPayload>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      // Sau khi có token, gọi API để lấy đầy đủ thông tin người dùng
      const userProfile = await authApi.me();
      return userProfile;
    } catch (err: any) {
      clearTokens(); // Dọn dẹp token nếu có lỗi
      return rejectWithValue(err?.response?.data?.error || 'Đăng ký thất bại.');
    }
  });

export const fetchMe = createAsyncThunk<User, void>(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.me();
      return user;
    } catch (err: any) {
      // Không cần rejectWithValue với message vì lỗi này chỉ đơn giản là không có phiên đăng nhập
      return rejectWithValue('Failed to auto-login');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    // Gọi API logout trước để server có thể vô hiệu hóa token (nếu có)
    await authApi.logout();
  } finally {
    // Luôn dọn dẹp token ở client dù API có lỗi hay không
    clearTokens();
  }
});

// --- SLICE ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    // Dùng để cập nhật thông tin user sau khi chỉnh sửa hồ sơ
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    // Dùng khi app khởi động và không có token, để bỏ qua màn hình loading
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(login.pending, register.pending, fetchMe.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(login.fulfilled, register.fulfilled, fetchMe.fulfilled),
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
          state.isInitialized = true; // Đánh dấu đã khởi tạo xong khi có user
        }
      )
      .addMatcher(
        isAnyOf(login.rejected, register.rejected, fetchMe.rejected),
        (state, action) => {
          state.loading = false;
          state.user = null;
          // Chỉ đánh lỗi cho login/register, fetchMe thất bại là bình thường
          if (action.type === fetchMe.rejected.type) {
            state.isInitialized = true; // Đã thử tự đăng nhập và thất bại -> khởi tạo xong
          } else {
            state.error = action.payload as string;
          }
        }
      );
  },
});

export const { clearError, setUser, setInitialized } = authSlice.actions;

export default authSlice.reducer;