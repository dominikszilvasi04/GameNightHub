import React from 'react';

const PlaceholderImage = ({ text }) => {
  return (
    <div className="w-48 h-full bg-gray-700 flex items-center justify-center text-white font-bold text-center p-2">
      <span>{text}</span>
    </div>
  );
};

export default PlaceholderImage;