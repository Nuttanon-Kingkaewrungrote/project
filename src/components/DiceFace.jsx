import React from 'react';

const DiceFace = ({ value, size = 'lg' }) => {
  const dotPositions = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  return (
    <div className={`${sizeClasses[size]} bg-white rounded-lg shadow-md relative border border-gray-200`}>
      {dotPositions[value]?.map((pos, idx) => (
        <div
          key={idx}
          className={`${dotSizes[size]} bg-red-600 rounded-full absolute transform -translate-x-1/2 -translate-y-1/2`}
          style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
        />
      ))}
    </div>
  );
};

export default DiceFace;