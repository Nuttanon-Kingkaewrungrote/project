import React, { useState } from 'react';
import Tooltip from './Tooltip';

const StatsTable = ({ statsRows, activeFilter, getTooltipText, historyLength }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative bg-white rounded-xl border border-gray-200 mb-6"
      style={{width: '734px', maxHeight: '521px'}}
    >

      {/* ===== Header (Fixed) ===== */}
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="py-3 px-4 text-center font-semibold w-1/2 rounded-tl-xl">
              <div className="flex items-center justify-center gap-2">
                <span>Dice</span>

                {activeFilter !== 'all' && (
                  <div className="relative inline-flex">
                    <button
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="
                        w-[15px] h-[15px]
                        rounded-full border border-white
                        text-white text-[10px] font-bold
                        flex items-center justify-center
                        hover:bg-white hover:text-blue-600
                        transition-colors
                      "
                    >
                      i
                    </button>

                    {showTooltip && (
                      <Tooltip>
                        {getTooltipText()}
                      </Tooltip>
                    )}
                  </div>
                )}
              </div>
            </th>

            <th className="py-3 px-4 text-center font-semibold w-1/2 rounded-tr-xl">
              Frequency
            </th>
          </tr>
        </thead>
      </table>

      {/* ===== Scrollable Body ===== */}
      <div className="rounded-b-xl overflow-hidden">
        <div className="max-h-[473px] overflow-y-auto">
          <table className="w-full border-separate border-spacing-0">
            <tbody>
              {statsRows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-gray-400">
                    {historyLength === 0
                      ? 'กรุณาใส่ตัวเลข และกด Enter เพื่อเริ่มบันทึก'
                      : 'ไม่มีข้อมูลในหมวดนี้'}
                  </td>
                </tr>
              ) : (
                statsRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}
                  >
                    <td className="py-3 px-4 w-1/2 text-center">
                      <div className="inline-block relative">
                        <span className="font-mono font-semibold text-gray-700">
                          {row.dice}
                        </span>

                        {row.label && (
                          <span
                            className="
                              absolute left-full ml-1 top-1/2 -translate-y-1/2
                              text-gray-400 text-xs whitespace-nowrap
                            "
                          >
                            // {row.label}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-gray-600 text-center w-1/2">
                      {row.frequency}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StatsTable;