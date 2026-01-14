import React from 'react';

const Tooltip = ({ children }) => {
  return (
    <div
      className="
        absolute z-[9999]
        bottom-full left-1/2 -translate-x-1/2
        mb-2
        bg-white text-gray-800 text-sm
        px-8 py-5 rounded-xl
        shadow-2xl border border-gray-200
        whitespace-nowrap
      "
    >
      {children}

      {/* Arrow */}
      <div
        className="
          absolute top-full left-1/2 -translate-x-1/2
          border-[6px] border-transparent border-t-white
        "
      />
    </div>
  );
};

export default Tooltip;