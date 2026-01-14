import React, { useState } from 'react';

const StatsTable = ({ statsRows, activeFilter, getTooltipText, historyLength }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6" style={{overflow: 'visible'}}>
      <table className="w-full" style={{overflow: 'visible', borderCollapse: 'separate', borderSpacing: 0}}>
        <thead style={{overflow: 'visible'}}>
          <tr className="bg-blue-600 text-white" style={{overflow: 'visible'}}>
            <th className="py-3 px-4 text-center font-semibold border-r border-white w-1/2 rounded-tl-xl" style={{overflow: 'visible'}}>
              <div className="flex items-center justify-center gap-2" style={{overflow: 'visible'}}>
                <span>Dice</span>
                {activeFilter !== 'all' && (
                  <div className="relative inline-block" style={{overflow: 'visible'}}>
                    <button
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="rounded-full border border-white text-white flex items-center justify-center font-bold hover:bg-white hover:text-blue-600 transition-colors"
                      style={{
                        width: '15px',
                        height: '15px',
                        fontSize: '10px',
                        lineHeight: '1',
                        padding: 0
                      }}
                    >
                      i
                    </button>
                    {showTooltip && (
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-sm px-8 py-5 rounded-lg whitespace-nowrap z-[9999] shadow-2xl border border-gray-200">
                        {getTooltipText()}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-white" style={{marginTop: '-1px'}}></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </th>
            <th className="py-3 px-4 text-center font-semibold w-1/2 rounded-tr-xl">Frequency</th>
          </tr>
        </thead>
      </table>
      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full" style={{borderCollapse: 'separate', borderSpacing: 0}}>
          <tbody>
            {statsRows.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-8 text-center text-gray-400">
                  {historyLength === 0 
                    ? 'ยังไม่มีข้อมูล - กดปุ่ม Enter หรือ Random เพื่อเริ่มบันทึก'
                    : 'ไม่มีข้อมูลในหมวดนี้'
                  }
                </td>
              </tr>
            ) : (
              statsRows.map((row, idx) => (
                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'} border-b border-gray-200`}>
                  <td className="py-3 px-4 border-r border-gray-200 w-1/2 text-center">
                    <div className="inline-block relative">
                      <span className="font-mono font-semibold text-gray-700">{row.dice}</span>
                      {row.label && (
                        <span className="text-gray-400 text-xs whitespace-nowrap absolute left-full ml-3 top-1/2 -translate-y-1/2">// {row.label}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-center w-1/2">{row.frequency}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;