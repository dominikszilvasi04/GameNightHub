import React from 'react';

const Button = ({ children, onClick, type = 'button', fullWidth = false }) => {
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${widthClass}`}
    >
      {children}
    </button>
  );
};

export default Button;