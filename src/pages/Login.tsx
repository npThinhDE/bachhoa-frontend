import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login as loginAction } from '../features/auth/authSlice';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';

// Schema validation cho form đăng nhập
const schema = z.object({
  identifier: z.string().min(3, 'Tên đăng nhập hoặc số điện thoại là bắt buộc'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  // State để quản lý thông báo thành công
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { errors } = formState;

  // Xử lý khi submit form
  const onSubmit = async (data: FormData) => {
    try {
      // Dispatch action đăng nhập và dùng unwrap() để bắt lỗi
      await dispatch(loginAction({ identifier: data.identifier, password: data.password })).unwrap();

      // Nếu thành công, hiển thị thông báo
      setSuccessMessage('Đăng nhập thành công! Đang chuyển đến trang chủ...');

      // Đợi 3 giây rồi chuyển hướng về trang chủ
      setTimeout(() => {
        navigate('/'); // Chuyển hướng về trang chủ
      }, 3000);

    } catch (error) {
      // Lỗi đã được authSlice xử lý, chỉ cần log ra console
      console.error("Đăng nhập thất bại:", error);
    }
  };

  return (
    <div className="max-w-l mx-auto p-6 bg-white shadow rounded">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Đăng nhập</h1>
        <p className="text-gray-500 text-sm mt-1">Đăng nhập để có những trải nghiệm tốt hơn!</p>
      </div>

      {/* Hiển thị thông báo lỗi hoặc thành công */}
      {auth.error && !successMessage && <div className="mb-3 text-red-600 text-sm p-3 bg-red-100 rounded">{auth.error}</div>}
      {successMessage && <div className="mb-3 text-green-700 text-sm p-3 bg-green-100 rounded">{successMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tên đăng nhập hoặc Số điện thoại</label>
          <input {...register('identifier')} className="w-full border rounded px-3 py-2" placeholder="Nhập tên đăng nhập hoặc số điện thoại" />
          {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu</label>
          <input {...register('password')} type="password" className="w-full border rounded px-3 py-2" placeholder="••••••••" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center gap-x-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300" disabled={auth.loading || !!successMessage}>
            {auth.loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          <Link to="/forgotpassword" className="text-sm text-blue-600 hover:underline">Quên mật khẩu</Link>
          <Link to="/register" className="text-sm text-blue-600 hover:underline">Chưa có tài khoản?</Link>
        </div>
      </form>
    </div>
  );
}
