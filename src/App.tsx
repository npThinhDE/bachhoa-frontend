import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks'; // 
import { fetchMe, setInitialized } from './features/auth/authSlice';
import { getAccessToken } from './utils/token';
import { RootState } from './app/store'; // 

export default function App() {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state: RootState) => state.auth);

  // Logic giữ đăng nhập khi tải lại trang
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      // Nếu có token, cố gắng fetch thông tin người dùng
      dispatch(fetchMe());
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  // Nếu ứng dụng chưa khởi tạo xong (chưa biết người dùng đăng nhập hay chưa),
  // hiển thị một màn hình chờ.
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Bạn có thể thêm một spinner đẹp hơn ở đây */}
        <p>Đang tải ứng dụng...</p>
      </div>
    );
  }

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}
