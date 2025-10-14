import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      {/* The content box: change max-w-md to max-w-3xl */}
      <div className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
export default Modal;