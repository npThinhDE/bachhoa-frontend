import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
            {/* Logo */}
            <div className="mb-8">
                <Link to="/" className="flex items-center gap-3">
                    <img src="/logo.png" alt="logo" className="w-12 h-12 object-contain" />
                    <div className="font-semibold text-2xl text-gray-800">Bách Hóa Online</div>
                </Link>
            </div>

            {/*Nơi các trang Login, Register... được hiển thị */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}
