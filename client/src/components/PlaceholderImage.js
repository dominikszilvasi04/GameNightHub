import React from 'react';

const PlaceholderImage = ({ text }) => {
  return (

    // Its parent will now control its height.
    <div className="w-48 bg-gray-700 flex items-center justify-center text-white font-bold text-center p-2 flex-shrink-0">
      <span>{text}</span>
    </div>
  );
};

export default PlaceholderImage;