import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { authApi } from '../api/authApi';
import { toast } from 'react-toastify';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';

// Định nghĩa schema validation cho form đổi mật khẩu
const schema = z.object({
    oldPassword: z.string().min(6, 'Mật khẩu cũ phải có ít nhất 6 ký tự'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Mật khẩu xác nhận là bắt buộc'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu mới và mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], // Gán lỗi cho trường confirmPassword
});

type FormData = z.infer<typeof schema>;

export default function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    // Hàm xử lý khi submit form
    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const payload = { oldPassword: data.oldPassword, newPassword: data.newPassword };
            const response = await authApi.changePassword(payload);

            toast.success(response.message || "Đổi mật khẩu thành công!");
            reset(); // Xóa các trường trong form sau khi thành công

        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Đã xảy ra lỗi không mong muốn.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <Card className="shadow-lg rounded-xl border border-gray-200">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Đổi Mật Khẩu</h1>
                        <p className="text-gray-500 text-sm mt-1">Để bảo mật, vui lòng không chia sẻ mật khẩu mới của bạn.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Mật khẩu cũ</label>
                            <input {...register('oldPassword')} type="password" className="w-full border rounded px-3 py-2" placeholder="••••••••" />
                            {errors.oldPassword && <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>}
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

                        {/* Cập nhật khu vực nút bấm */}
                        <div className="pt-2 flex flex-col sm:flex-row gap-3">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                            </Button>

                            {/* Thêm nút "Trở Về" */}
                            <Link to="/profile" className="w-full">
                                <Button type="button" variant="secondary" className="w-full">
                                    Trở Về
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}

