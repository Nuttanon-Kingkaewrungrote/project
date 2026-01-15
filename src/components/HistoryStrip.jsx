import React from 'react';

const HistoryStrip = ({ history, fullView = false }) => {
  if (history.length === 0) {
    if (fullView) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent History</h2>
          <div className="text-center text-gray-400 py-8">
            ยังไม่มีประวัติ - เริ่มบันทึกข้อมูลเพื่อดูประวัติ
          </div>
        </div>
      );
    }
    return null;
  }
  
  if (fullView) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-1">
          <svg className="w-6 h-6" fill="none" stroke="#3B82F6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent History
        </h2>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {history.slice().reverse().map((roll, idx) => {
            const sum = roll.reduce((a, b) => a + b, 0);
            const hiLo = sum >= 11 ? 'Hi' : 'Lo';
            const hiLoColor = sum >= 11 ? 'text-blue-600' : 'text-red-600';
            
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-bold font-inter ${hiLoColor}`}>
                    {roll.join('')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-semibold ${hiLoColor} min-w-[40px] text-center`}>
                    {hiLo}
                  </span>
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg border-2 border-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg border-2 border-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Original compact view
  //return (
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
  //);
};

export default HistoryStrip;