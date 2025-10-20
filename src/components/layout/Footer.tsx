// src/components/layout/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <a href="#" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="BachHoaHub logo" 
                  className="w-9 h-9 object-contain"
                />
              </div>
              <span className="heading-font text-2xl font-bold">BachHoa Online</span>
            </a>
            <p className="text-green-200 mb-4">
              Siêu thị trực tuyến cung cấp sản phẩm tươi sống, nhu yếu phẩm và hàng tiêu dùng với chất lượng đảm bảo.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-200 hover:text-yellow-400 transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-green-200 hover:text-yellow-400 transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-green-200 hover:text-yellow-400 transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-green-200 hover:text-yellow-400 transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-green-200 hover:text-yellow-400 transition">Thực phẩm tươi sống</a></li>
              <li><a href="#" className="text-green-200 hover:text-yellow-400 transition">Rau củ</a></li>
              <li><a href="#" className="text-green-200 hover:text-yellow-400 transition">Gia vị</a></li>
              <li><a href="#" className="text-green-200 hover:text-yellow-400 transition">Thực phẩm đóng gói sẵn</a></li>
              <li><a href="#" className="text-green-200 hover:text-yellow-400 transition">Thực phẩm đông lạnh</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Công ty</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-green-200 hover:text-yellow-400 transition">Về Chúng Tôi</a></li>
              <li><a href="#" className="text-green-200 hover:text-yellow-400 transition">Liên Hệ</a></li>
              <li><a href="#" className="text-green-200 hover:text-yellow-400 transition">Tuyển Dụng</a></li>
              <li><a href="#" className="text-green-200 hover:text-yellow-400 transition">Giao Hàng & Đổi Trả</a></li>
              <li><a href="#" className="text-green-200 hover:text-yellow-400 transition">Chính Sách Bảo Mật</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-green-200">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mr-2 mt-1 text-yellow-400"></i>
                <span>Số 1 Võ Văn Ngân</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2 text-yellow-400"></i>
                <span>(028) 555-6789</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2 text-yellow-400"></i>
                <span>support@bachhoahub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-700 mt-12 text-center text-green-300">
          <p className="py-1">&copy; {new Date().getFullYear()} BachHoaOnline - All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
