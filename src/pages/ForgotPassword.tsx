import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authApi } from '../api/authApi';

// Schema validation cho form
const schema = z
    .object({
        username: z.string().min(3, 'Tên đăng nhập là bắt buộc'),
        phoneNumber: z.string().min(10, 'Số điện thoại không hợp lệ'),
        newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
        confirmPassword: z.string().min(6, 'Mật khẩu xác nhận là bắt buộc'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
    });

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setApiError('');
        setSuccessMessage('');
        try {
            await authApi.forgotPassword({
                username: data.username,
                phoneNumber: data.phoneNumber,
                newPassword: data.newPassword
            });

            setSuccessMessage('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...');

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error: any) {
            setApiError(error.response?.data?.error || 'Đã xảy ra lỗi không mong muốn.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto p-6 bg-white shadow rounded mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-center">Quên Mật Khẩu</h2>

            {apiError && <div className="mb-3 text-red-600 text-sm p-3 bg-red-100 rounded">{apiError}</div>}
            {successMessage && <div className="mb-3 text-green-700 text-sm p-3 bg-green-100 rounded">{successMessage}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                    <input {...register('username')} className="w-full border rounded px-3 py-2" placeholder="Tên đăng nhập của bạn" />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại đã đăng ký</label>
                    <input {...register('phoneNumber')} type="tel" className="w-full border rounded px-3 py-2" placeholder="Số điện thoại của bạn" />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                    <input {...register('newPassword')} type="password" className="w-full border rounded px-3 py-2" placeholder="••••••••" />
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu mới</label>
                    <input {...register('confirmPassword')} type="password" className="w-full border rounded px-3 py-2" placeholder="••••••••" />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <div className="flex items-center gap-x-3">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading || !!successMessage}>
                        {isLoading ? 'Đang xử lý...' : 'Xác Nhận'}
                    </button>
                    <Link to="/login" className="text-sm text-blue-600 hover:underline">Quay lại đăng nhập</Link>
                </div>
            </form>
        </div>
    );
}

