import React from 'react';

const Button = ({ children, onClick, type = 'button', fullWidth = false }) => {
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      type={type}
      // We combine the new classes with our dynamic widthClass
      className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition hover:scale-110 ${widthClass}`}
    >
      {/* This span holds the button's text */}
      <span>{children}</span>
      
      {/* This div creates the sliding animation on hover */}
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
        <div className="relative h-full w-8 bg-white/20"></div>
      </div>
    </button>
  );
};

export default Button;