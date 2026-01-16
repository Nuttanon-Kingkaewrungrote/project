import React, { useState } from 'react';
import Tooltip from './Tooltip';

const StatsTable = ({ statsRows, activeFilter, getTooltipText, historyLength }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = มากไปน้อย, 'asc' = น้อยไปมาก

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Function to extract percentage from frequency string
  const getPercentage = (frequency) => {
    if (frequency === '-') return 0;
    const match = frequency.match(/= (\d+)%/);
    return match ? parseInt(match[1]) : 0;
  };

  // Sort statsRows by frequency
  const sortedRows = [...statsRows].sort((a, b) => {
    const percentA = getPercentage(a.frequency);
    const percentB = getPercentage(b.frequency);
    
    // Sort by type first (to keep categories together in 'all' view)
    const typeOrder = { single: 1, pair: 2, triple: 3, sum: 4 };
    const typeCompare = typeOrder[a.type] - typeOrder[b.type];
    
    if (activeFilter === 'all' && typeCompare !== 0) {
      // In 'all' view, keep types together
      return typeCompare;
    }
    
    // Within same type, sort by percentage
    if (sortOrder === 'desc') {
      return percentB - percentA; // มากไปน้อย
    } else {
      return percentA - percentB; // น้อยไปมาก
    }
  });

  // Group by type for 'all' view and sort within groups
  const getGroupedAndSortedRows = () => {
    if (activeFilter !== 'all') {
      return sortedRows;
    }

    // Group by type
    const groups = {
      single: [],
      pair: [],
      triple: [],
      sum: []
    };

    // Remove all labels first
    statsRows.forEach(row => {
      groups[row.type].push({
        ...row,
        label: '' // เคลียร์ label เดิมออกก่อน
      });
    });

    // Sort each group and add label to first item
    const labelMap = {
      single: 'ผลลัพธ์ของลูกเต๋าแต่ละหน้า',
      pair: 'ผลลัพธ์ของลูกเต๋าที่เป็นคู่',
      triple: 'ผลลัพธ์ของลูกเต๋าสามลูก',
      sum: 'ผลรวมของค่าลูกเต๋า'
    };

    Object.keys(groups).forEach(type => {
      groups[type].sort((a, b) => {
        const percentA = getPercentage(a.frequency);
        const percentB = getPercentage(b.frequency);
        
        if (sortOrder === 'desc') {
          return percentB - percentA;
        } else {
          return percentA - percentB;
        }
      });

      // Add label to first item in each group (after sort)
      if (groups[type].length > 0) {
        groups[type][0] = {
          ...groups[type][0],
          label: labelMap[type]
        };
      }
    });

    // Combine groups back together
    return [
      ...groups.single,
      ...groups.pair,
      ...groups.triple,
      ...groups.sum
    ];
  };

  const displayRows = getGroupedAndSortedRows();

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
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-2 font-semibold transition-all duration-200"
                  title={sortOrder === 'desc' ? 'คลิกเพื่อเรียงน้อยไปมาก' : 'คลิกเพื่อเรียงมากไปน้อย'}
                >
                  <span>Frequency</span>
                  {sortOrder === 'desc' ? (
                    // มากไปน้อย: ยาว-กลาง-สั้น
                    <div className="flex flex-col items-center gap-0.5 w-4">
                      <div className="h-0.5 bg-white rounded-full" style={{width: '16px'}}></div>
                      <div className="h-0.5 bg-white rounded-full" style={{width: '12px'}}></div>
                      <div className="h-0.5 bg-white rounded-full" style={{width: '8px'}}></div>
                    </div>
                  ) : (
                    // น้อยไปมาก: สั้น-กลาง-ยาว
                    <div className="flex flex-col items-center gap-0.5 w-4">
                      <div className="h-0.5 bg-white rounded-full" style={{width: '8px'}}></div>
                      <div className="h-0.5 bg-white rounded-full" style={{width: '12px'}}></div>
                      <div className="h-0.5 bg-white rounded-full" style={{width: '16px'}}></div>
                    </div>
                  )}
                </button>
              </div>
            </th>
          </tr>
        </thead>
      </table>

      {/* ===== Scrollable Body ===== */}
      <div className="rounded-b-xl overflow-hidden">
        <div className="max-h-[473px] overflow-y-auto">
          <table className="w-full border-separate border-spacing-0">
            <tbody>
              {displayRows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-gray-400">
                    {historyLength === 0
                      ? 'กรุณาใส่ตัวเลข และกด Enter เพื่อเริ่มบันทึก'
                      : 'ไม่มีข้อมูลในหมวดนี้'}
                  </td>
                </tr>
              ) : (
                displayRows.map((row, idx) => (
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