import React from 'react';

const HistoryStrip = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      <div className="text-sm text-gray-500 mb-2">Recent History:</div>
      <div className="flex flex-wrap gap-2">
        {history.slice(-15).reverse().map((roll, idx) => {
          const sum = roll.reduce((a, b) => a + b, 0);
          return (
            <div
              key={idx}
              className={`px-3 py-1 rounded-full text-sm font-mono font-semibold ${
                sum >= 11 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {roll.join('')}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryStrip;
