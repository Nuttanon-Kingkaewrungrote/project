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
      <h2 className="px-2 text-lg font-medium text-gray-800 mb-0">
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
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow transition-colors"
            style={{width: '100px', height: '48px'}}
          >
            Enter
          </button>
        </div>
        <button
          onClick={onClear}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition-colors flex items-center justify-center gap-1"
          style={{width: '100px', height: '48px'}}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 15 15">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
          </svg>
          Reset
        </button>
        <button
          onClick={onToggleHistory}
          className="font-semibold rounded-lg shadow transition-colors bg-white border-2 border-blue-500 text-blue-500 hover:bg-sky-100 flex items-center justify-center gap-1"
          style={{width: '121px', height: '48px'}}
        >
          {showHistory ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DiceInput;