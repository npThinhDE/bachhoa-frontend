import React from 'react';

const TestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  console.log('🔥 TestModal rendering...');
  
  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Test Modal</h2>
        <p className="mb-4">Modal hoạt động bình thường!</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default TestModal;