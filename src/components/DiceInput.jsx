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
      className="bg-slate-50 rounded-xl p-4 mb-6 border border-neutral-300"
      style={{width: '734px', height: '123px'}}
    >
      <h2 className="px-2 text-md font-medium text-gray-800 mb-0">
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
            className="text-center text-lg font-normal bg-slate-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-500"
            style={{width: '343px', height: '48px'}}
          />

          <button
            onClick={onManualEntry}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-semibold shadow transition-colors"
            style={{width: '100px', height: '48px'}}
          >
            Enter
          </button>
        </div>
        <button
          onClick={onClear}
          className="bg-red-600 hover:bg-red-400 text-white font-semibold rounded-lg shadow transition-colors"
          style={{width: '100px', height: '48px'}}
        >
          Reset
        </button>
        <button
          onClick={onToggleHistory}
          className="font-semibold rounded-lg shadow transition-colors bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
          style={{width: '121px', height: '48px'}}
        >
          {showHistory ? '← Back' : 'History'}
        </button>
      </div>
    </div>
  );
};

export default DiceInput;