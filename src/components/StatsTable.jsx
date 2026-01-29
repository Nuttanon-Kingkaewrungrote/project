import React, { useState } from 'react';
import Tooltip from './Tooltip';

const StatsTable = ({ statsRows, activeFilter, getTooltipText, historyLength, isPrediction = false, totalMatches = 0 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'normal' = เรียงตามปกติ, 'desc' = มากไปน้อย

  const toggleSort = () => {
    setSortOrder(prev => prev === 'normal' ? 'desc' : 'normal');
  };

  // Function to extract percentage from frequency string
  const getPercentage = (frequency) => {
    if (frequency === '-') return 0;
    const match = frequency.match(/= (\d+)%/);
    return match ? parseInt(match[1]) : 0;
  };

  // Sort statsRows by frequency only if sortOrder is 'desc'
  const getSortedRows = () => {
    if (sortOrder === 'normal') {
      return statsRows; // Return original order (เรียงตามเลข)
    }

    // Sort by count/percentage (desc)
    return [...statsRows].sort((a, b) => {
      // ใช้ count ที่เก็บไว้ใน row
      const countA = a.count || getPercentage(a.frequency);
      const countB = b.count || getPercentage(b.frequency);
      
      // Sort by type first (to keep categories together in 'all' view)
      const typeOrder = { single: 1, pair: 2, triple: 3, sum: 4 };
      const typeCompare = typeOrder[a.type] - typeOrder[b.type];
      
      if (activeFilter === 'all' && typeCompare !== 0) {
        // In 'all' view, keep types together
        return typeCompare;
      }
      
      // Within same type, sort by count (มากไปน้อย)
      return countB - countA;
    });
  };

  // Group by type for 'all' view and sort within groups
  const getGroupedAndSortedRows = () => {
    const sortedRows = getSortedRows();

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
    sortedRows.forEach(row => {
      groups[row.type].push({
        ...row,
        label: '' // เคลียร์ label เดิมออกก่อน
      });
    });

    // If sorting, sort each group
    if (sortOrder === 'desc') {
      Object.keys(groups).forEach(type => {
        groups[type].sort((a, b) => {
          const percentA = getPercentage(a.frequency);
          const percentB = getPercentage(b.frequency);
          return percentB - percentA;
        });
      });
    }

    // Add label to first item in each group
    const labelMap = {
      single: 'ผลลัพธ์ของลูกเต๋าแต่ละหน้า',
      pair: 'ผลลัพธ์ของลูกเต๋าที่เป็นคู่',
      triple: 'ผลลัพธ์ของลูกเต๋าสามลูก',
      sum: 'ผลรวมของค่าลูกเต๋า'
    };

    Object.keys(groups).forEach(type => {
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

  // Get empty state message
  const getEmptyMessage = () => {
    if (historyLength === 0) {
      return 'กรุณาใส่ตัวเลข และกด Enter เพื่อเริ่มบันทึก';
    }
    if (isPrediction && historyLength < 2) {
      return 'ต้องการข้อมูลอย่างน้อย 2 รายการเพื่อทำนาย';
    }
    if (isPrediction && totalMatches === 0) {
      return 'ไม่พบรูปแบบที่ตรงกันในประวัติ';
    }
    return 'ไม่มีข้อมูลในหมวดนี้';
  };

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
                  title={sortOrder === 'normal' ? 'คลิกเพื่อเรียงมากไปน้อย' : 'คลิกเพื่อกลับสู่ลำดับปกติ'}
                >
                  <span>Frequency</span>
                  {sortOrder === 'normal' ? (
                    // Normal: ยาว-กลาง-สั้น (เหมือน max to min เดิม)
                    <div className="flex flex-col items-center gap-0.5 w-4">
                      <div className="h-0.5 bg-white rounded-full" style={{width: '16px'}}></div>
                      <div className="h-0.5 bg-white rounded-full" style={{width: '12px'}}></div>
                      <div className="h-0.5 bg-white rounded-full" style={{width: '8px'}}></div>
                    </div>
                  ) : (
                    // Max to Min: ลูกศรลงมีขีด
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-4-4m4 4l4-4" />
                    </svg>
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
                    {getEmptyMessage()}
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