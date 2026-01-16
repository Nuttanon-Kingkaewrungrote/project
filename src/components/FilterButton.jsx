import React from 'react';

const FilterButton = ({ label, value, activeFilter, onClick }) => {
  const isActive = activeFilter === value;
  
  return (
    <button
      onClick={() => onClick(value)}
      className={`
        flex-1 font-semibold transition-all duration-200 rounded-lg
        ${isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-blue-500 hover:bg-blue-50'
        }
      `}
      style={{
        height: '38px',
        ...(isActive && {
          boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)'
        })
      }}
    >
      {label}
    </button>
  );
};

export default FilterButton;