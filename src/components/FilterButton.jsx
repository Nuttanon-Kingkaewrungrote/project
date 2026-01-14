import React from 'react';

const FilterButton = ({ label, value, activeFilter, onClick }) => {
  const isActive = activeFilter === value;
  
  return (
    <button
      onClick={() => onClick(value)}
      className={`
        flex-1 px-6 py-2 font-normal transition-all duration-200 rounded-lg
        ${isActive 
          ? 'bg-blue-500 text-white shadow-md scale-[1.02]' 
          : 'bg-white text-blue-500 hover:bg-blue-50'
        }
      `}
    >
      {label}
    </button>
  );
};

export default FilterButton;