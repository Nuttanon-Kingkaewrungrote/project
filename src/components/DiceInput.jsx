import React from 'react';

const DiceInput = ({ 
  manualInput, 
  setManualInput, 
  onManualEntry, 
  onClear,
  showHistory,
  onToggleHistory
}) => {
  return (
    <div 
      className="bg-slate-50 rounded-xl p-4 mb-5 border border-neutral-300"
      style={{width: '734px', height: '123px'}}
    >
      <h2 className="px-4 text-md font-medium text-gray-800 mb-0">
        Enter dice numbers
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              if (v.length <= 3) setManualInput(v);
            }}
            placeholder="Enter 3 digits"
            className="w-[343px] h-[48px] text-center text-lg font-inter bg-slate-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={onManualEntry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-semibold shadow transition-colors"
          >
            Enter
          </button>
        </div>
        <button
          onClick={onClear}
          className="px-6 py-3 bg-red-600 hover:bg-red-400 text-white font-semibold rounded-lg shadow transition-colors"
        >
          Reset
        </button>
        <button
          onClick={onToggleHistory}
          className="px-9 py-3 font-semibold rounded-lg shadow transition-colors bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
        >
          {showHistory ? '← Back' : 'History'}
        </button>
      </div>
    </div>
  );
};

export default DiceInput;