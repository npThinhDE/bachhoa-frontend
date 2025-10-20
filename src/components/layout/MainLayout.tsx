import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Giả sử Navbar.tsx nằm cùng thư mục
import Footer from './Footer'; // Giả sử bạn có component Footer

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-50">
                {/* Đây là nơi các trang Home, Products... sẽ được hiển thị */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
