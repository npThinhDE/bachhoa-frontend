import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-green-700 text-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h1 className="heading-font text-4xl md:text-5xl font-bold mb-4">
          Mua sắm dễ dàng – Tươi ngon mỗi ngày
        </h1>
        <p className="text-xl mb-8">
          Cửa hàng bách hóa trực tuyến với hàng nghìn sản phẩm: thực phẩm, đồ gia dụng, nhu yếu phẩm, và nhiều hơn nữa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/products')}
            className="bg-yellow-400 text-green-900 font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition"
          >
            Mua Ngay
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
