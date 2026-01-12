import React, { useState, useCallback } from 'react';

const HiLoStatistics = () => {
  const [history, setHistory] = useState([
]);
  const [manualInput, setManualInput] = useState("");
  const [lastRoll, setLastRoll] = useState();
  const [isRolling, setIsRolling] = useState(false);

  // Calculate all statistics
  const calculateStats = useCallback(() => {
    const stats = {
      faceCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      pairs: {},
      triples: {},
      sums: {}
    };

    history.forEach(roll => {
      // Count individual faces (each roll counts once per unique face)
      const uniqueFaces = [...new Set(roll)];
      uniqueFaces.forEach(face => {
        stats.faceCount[face]++;
      });

      // Calculate sum
      const sum = roll.reduce((a, b) => a + b, 0);
      stats.sums[sum] = (stats.sums[sum] || 0) + 1;

      // Count all possible pairs (combinations of 2 from 3 dice, unique pairs only)
      const sorted = [...roll].sort((a, b) => a - b);
      const allPairs = [
        [sorted[0], sorted[1]].sort((a, b) => a - b).join(''),
        [sorted[0], sorted[2]].sort((a, b) => a - b).join(''),
        [sorted[1], sorted[2]].sort((a, b) => a - b).join('')
      ];
      
      // Remove duplicate pairs
      const uniquePairs = [...new Set(allPairs)];
      
      uniquePairs.forEach(pairKey => {
        stats.pairs[pairKey] = (stats.pairs[pairKey] || 0) + 1;
      });

      // Count triples
      const tripleKey = sorted.join('');
      stats.triples[tripleKey] = (stats.triples[tripleKey] || 0) + 1;
    });

    return stats;
  }, [history]);

  const stats = calculateStats();

  const handleManualEntrySingle = () => {
  if (manualInput.length !== 3) {
    alert("Please enter exactly 3 digits");
    return;
  }

  const dice = manualInput.split("").map(Number);
  if (dice.some(d => d < 1 || d > 6)) {
    alert("Dice number must be btween 1 and 6")
    return;
  }

  // 🔴 สำคัญ: ใช้ history + lastRoll เหมือนเดิม
  setHistory(prev => [...prev, dice]);
  setLastRoll(dice);

  setManualInput("");
};

  const handleClear = () => {
    setHistory([]);
    setLastRoll(null);
  };

  const handleRandom = () => {
    setIsRolling(true);
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const d3 = Math.floor(Math.random() * 6) + 1;
    setTimeout(() => {
      setHistory(prev => [...prev, [d1, d2, d3]]);
      setLastRoll([d1, d2, d3]);
      setIsRolling(false);
    }, 500);
  };

  const getFrequency = (count) => {
    if (history.length === 0) return '-';
    const pct = ((count / history.length) * 100).toFixed(0);
    return `${count}/${history.length} = ${pct}%`;
  };

  const getFaceFrequency = (count) => {
    if (history.length === 0) return '-';
    const pct = ((count / history.length) * 100).toFixed(0);
    return `${count}/${history.length} = ${pct}%`;
  };

  // Build unified stats rows
  const buildStatsRows = () => {
    const rows = [];

    // Individual faces
    for (let i = 1; i <= 6; i++) {
      rows.push({
        dice: String(i),
        label: i === 1 ? 'แต่ละหน้าทั้งหมด' : '',
        frequency: getFaceFrequency(stats.faceCount[i])
      });
    }

    // Pairs (sorted by key)
    const pairEntries = Object.entries(stats.pairs)
      .sort((a, b) => a[0].localeCompare(b[0]));
    
    pairEntries.forEach((entry, idx) => {
      rows.push({
        dice: entry[0],
        label: idx === 0 ? 'หน้าที่เกิดขึ้น จับคู่ ทั้งหมด' : '',
        frequency: getFrequency(entry[1])
      });
    });

    // Triples (sorted, top occurrences)
    const tripleEntries = Object.entries(stats.triples)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    tripleEntries.forEach((entry, idx) => {
      rows.push({
        dice: entry[0],
        label: idx === 0 ? 'หน้าที่เกิดขึ้นพร้อมกัน' : '',
        frequency: getFrequency(entry[1])
      });
    });

    // Sums (sorted by sum value)
    const sumEntries = Object.entries(stats.sums)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    
    sumEntries.forEach((entry, idx) => {
      rows.push({
        dice: `Sum ${entry[0]}`,
        label: idx === 0 ? 'ผลรวมของหน้าที่เคยเกิดขึ้น' : '',
        frequency: getFrequency(entry[1])
      });
    });

    return rows;
  };

  const statsRows = buildStatsRows();

  // Dice face component
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        {/* Page Title */}
        <div className="mb-6 text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-800">
            🎲 Dice Tracker Dashboard
          </h1>
        <p className="text-gray-500">
          Analyze dice frequency patterns from your input data
        </p>
      </div>

        {/* Last Roll Display */}
        <div className="flex items-center gap-4 mb-6">

          {/* Dice + Result */}
          <div className="flex items-center gap-8 bg-slate-50 border border-slate-200 px-10 py-5 rounded-xl shadow-md flex-1 min-h-[96px]">

            {/* Dice */}
            <div className={`flex gap-3 ${isRolling ? 'animate-pulse' : ''}`}>
              {lastRoll ? (
                lastRoll.map((d, i) => (
                  <DiceFace key={i} value={d} size="md" />
                ))
              ) : (
                <div className="text-3xl font-bold text-gray-400">- - -</div>
              )}
            </div>

            {/* Result */}
            {lastRoll && (
              <div className="text-4xl font-bold text-gray-800  px-6 py-2 rounded-lg">
                {lastRoll.join('')}
              </div>
            )}
          </div>

          {/* Count Dice */}
          <div className="border border-blue-200 bg-sky-50 text-blue-600 px-10 py-6 rounded-xl shadow-md min-w-[110px]">
            <div className="text-xs text-center">Count Dice</div>
            <div className="text-2xl font-bold text-center">{history.length}</div>
          </div>

        </div>


        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200">
          <h1 className="px-3 text-3x1 font-bold text-gray-800">
                Enter dice number
            </h1>
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
              className="px-6 py-2 text-center text-lg font-bold
              border border-gray-300 rounded-lg
              focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={handleManualEntrySingle}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Enter
            </button>
          </div>
            <button
              onClick={handleRandom}
              disabled={isRolling}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow transition-colors disabled:opacity-50"
            >
              🎲 Random
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Stats Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-left font-semibold">Dice</th>
                <th className="py-3 px-4 text-left font-semibold">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {statsRows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-gray-400">
                    ยังไม่มีข้อมูล - กดปุ่ม Entry หรือ Random เพื่อเริ่มบันทึก
                  </td>
                </tr>
              ) : (
                statsRows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-gray-700">{row.dice}</span>
                        {row.label && (
                          <span className="text-gray-400 text-sm">// {row.label}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-gray-600">{row.frequency}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* History Strip */}
        {history.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500 mb-2">Resent History :</div>
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
        )}
      </div>
    </div>
  );
};

export default HiLoStatistics;