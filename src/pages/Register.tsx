import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { register as registerAction } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Schema validation không thay đổi
const schema = z
  .object({
    username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
    phoneNumber: z.string().min(10, 'Số điện thoại không hợp lệ'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirm: z.string().min(6, 'Mật khẩu xác nhận là bắt buộc'),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Mật khẩu không khớp',
    path: ['confirm'],
  });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState('');
  //State để quản lý các lỗi chung 
  const [genericError, setGenericError] = useState('');

  //Lấy thêm hàm `setError` từ useForm
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Xóa các thông báo cũ trước khi submit
    setSuccessMessage('');
    setGenericError('');

    try {
      await dispatch(registerAction({
        username: data.username,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password
      })).unwrap();

      setSuccessMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error: any) {
      const errorMessage = error as string;
      console.error("Đăng ký thất bại:", errorMessage);

      // Dựa vào nội dung của thông báo lỗi từ backend để gán nó vào đúng trường.
      if (errorMessage.toLowerCase().includes('tên đăng nhập')) {
        setError('username', { type: 'server', message: errorMessage });
      } else if (errorMessage.toLowerCase().includes('số điện thoại')) {
        setError('phoneNumber', { type: 'server', message: errorMessage });
      } else if (errorMessage.toLowerCase().includes('email')) {
        setError('email', { type: 'server', message: errorMessage });
      } else {
        // Đối với các lỗi khác, hiển thị ở đầu form
        setGenericError(errorMessage);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Card className="shadow-lg rounded-xl border border-gray-200">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tạo tài khoản mới</h1>
            <p className="text-gray-500 text-sm mt-1">Bắt đầu hành trình mua sắm của bạn!</p>
          </div>

          {/* Cập nhật để hiển thị lỗi chung */}
          {genericError && !successMessage && (
            <div className="mb-4 text-red-700 text-sm p-3 bg-red-100 rounded-lg">
              {genericError}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-700 text-sm p-3 bg-green-100 rounded-lg">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
              <input {...register('username')} className="w-full border rounded px-3 py-2" placeholder="Tên đăng nhập" />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input {...register('phoneNumber')} type="tel" className="w-full border rounded px-3 py-2" placeholder="Số điện thoại" />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input {...register('email')} type="email" className="w-full border rounded px-3 py-2" placeholder="Email" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mật khẩu</label>
              <input {...register('password')} type="password" className="w-full border rounded px-3 py-2" placeholder="******" />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
              <input {...register('confirm')} type="password" className="w-full border rounded px-3 py-2" placeholder="******" />
              {errors.confirm && <p className="text-red-500 text-sm mt-1">{errors.confirm.message}</p>}
            </div>

            <div className="flex items-center gap-x-2">
              <Button type="submit" className="w-full sm:w-auto" disabled={auth.loading || !!successMessage}>
                {auth.loading ? 'Đang tạo...' : 'Tạo tài khoản'}
              </Button>
              <Link to="/login" className="text-sm text-blue-600 hover:underline">
                Đã có tài khoản?
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}