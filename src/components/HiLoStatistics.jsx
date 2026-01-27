import React, { useState, useCallback, useEffect } from 'react';
import DiceInput from './DiceInput';
import LastRollDisplay from './LastRollDisplay';
import FilterButton from './FilterButton';
import StatsTable from './StatsTable';
import HistoryStrip from './HistoryStrip';
import ResetConfirmModal from './ResetConfirmModal';

const HiLoStatistics = () => {
  // Load history from localStorage on mount
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('diceHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [manualInput, setManualInput] = useState("");
  
  const [lastRoll, setLastRoll] = useState(() => {
    const saved = localStorage.getItem('diceHistory');
    if (saved) {
      const data = JSON.parse(saved);
      return data.length > 0 ? data[data.length - 1] : null;
    }
    return null;
  });
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [showHistory, setShowHistory] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [scale, setScale] = useState(1);

  // Calculate scale based on viewport
  useEffect(() => {
    const calculateScale = () => {
      const widthScale = (window.innerWidth - 40) / 798;
      const heightScale = (window.innerHeight - 40) / 1034;
      const newScale = Math.min(widthScale, heightScale, 1);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('diceHistory', JSON.stringify(history));
  }, [history]);

  // Helper: Check if pattern matches (all permutations)
  const matchesTriple = (roll1, roll2) => {
    const sorted1 = [...roll1].sort().join('');
    const sorted2 = [...roll2].sort().join('');
    return sorted1 === sorted2;
  };

  // Helper: Check if has any matching pair
  const matchesPair = (roll1, roll2) => {
    const pairs1 = new Set();
    const sorted1 = [...roll1].sort();
    pairs1.add([sorted1[0], sorted1[1]].sort().join(''));
    pairs1.add([sorted1[0], sorted1[2]].sort().join(''));
    pairs1.add([sorted1[1], sorted1[2]].sort().join(''));

    const pairs2 = new Set();
    const sorted2 = [...roll2].sort();
    pairs2.add([sorted2[0], sorted2[1]].sort().join(''));
    pairs2.add([sorted2[0], sorted2[2]].sort().join(''));
    pairs2.add([sorted2[1], sorted2[2]].sort().join(''));

    for (let p of pairs1) {
      if (pairs2.has(p)) return true;
    }
    return false;
  };

  // Helper: Check if sum matches
  const matchesSum = (roll1, roll2) => {
    const sum1 = roll1.reduce((a, b) => a + b, 0);
    const sum2 = roll2.reduce((a, b) => a + b, 0);
    return sum1 === sum2;
  };

  // Calculate predictions based on last roll
  const calculatePredictions = useCallback(() => {
    if (!lastRoll || history.length < 2) {
      return {
        faceCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        pairs: {},
        triples: {},
        sums: {},
        totalMatches: 0
      };
    }

    const predictions = {
      faceCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      pairs: {},
      triples: {},
      sums: {},
      totalMatches: 0
    };

    // Loop through history to find patterns matching lastRoll
    for (let i = 0; i < history.length - 1; i++) {
      const currentRoll = history[i];
      const nextRoll = history[i + 1];

      // Check if current roll matches any pattern with lastRoll (ไม่รวม single ในการ match)
      const hasTripleMatch = matchesTriple(currentRoll, lastRoll);
      const hasPairMatch = matchesPair(currentRoll, lastRoll);
      const hasSumMatch = matchesSum(currentRoll, lastRoll);

      // If ANY pattern matches (ไม่รวม single), count what came next
      // แต่ไม่นับถ้า nextRoll คือ lastRoll เอง (เช็คว่าเป็น index ของ lastRoll)
      const isNextRollTheLastOne = (i + 1 === history.length - 1);
      
      if ((hasTripleMatch || hasPairMatch || hasSumMatch) && !isNextRollTheLastOne) {
        predictions.totalMatches++;

        // Count singles (unique faces only - แสดงแต่ไม่นับใน totalMatches)
        const uniqueFaces = [...new Set(nextRoll)];
        uniqueFaces.forEach(face => {
          predictions.faceCount[face]++;
        });

        // Count pairs
        const sorted = [...nextRoll].sort((a, b) => a - b);
        const allPairs = [
          [sorted[0], sorted[1]].sort((a, b) => a - b).join(''),
          [sorted[0], sorted[2]].sort((a, b) => a - b).join(''),
          [sorted[1], sorted[2]].sort((a, b) => a - b).join('')
        ];
        const uniquePairs = [...new Set(allPairs)];
        uniquePairs.forEach(pairKey => {
          predictions.pairs[pairKey] = (predictions.pairs[pairKey] || 0) + 1;
        });

        // Count triples
        const tripleKey = sorted.join('');
        predictions.triples[tripleKey] = (predictions.triples[tripleKey] || 0) + 1;

        // Count sums
        const sum = nextRoll.reduce((a, b) => a + b, 0);
        predictions.sums[sum] = (predictions.sums[sum] || 0) + 1;
      }
    }

    return predictions;
  }, [history, lastRoll]);

  const handleEditHistory = (index, newDice) => {
    const newHistory = [...history];
    newHistory[index] = newDice;
    setHistory(newHistory);
    if (index === history.length - 1) {
      setLastRoll(newDice);
    }
  };

  const handleDeleteHistory = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    if (index === history.length - 1) {
      setLastRoll(newHistory[newHistory.length - 1] || null);
    }
  };

  const predictions = calculatePredictions();

  const handleManualEntrySingle = () => {
    if (manualInput.length !== 3) {
      alert("Please enter exactly 3 digits");
      return;
    }

    const dice = manualInput.split("").map(Number);
    if (dice.some(d => d < 1 || d > 6)) {
      alert("Dice number must be between 1 and 6");
      return;
    }

    setHistory(prev => [...prev, dice]);
    setLastRoll(dice);
    setManualInput("");
  };

  const handleClear = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    setHistory([]);
    setLastRoll(null);
    setShowResetModal(false);
  };

  const handleCancelReset = () => {
    setShowResetModal(false);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const getFrequency = (count) => {
    if (predictions.totalMatches === 0) return '-';
    const pct = ((count / predictions.totalMatches) * 100).toFixed(0);
    return `${count}/${predictions.totalMatches} = ${pct}%`;
  };

  const getFaceFrequency = (count) => {
    if (predictions.totalMatches === 0) return '-';
    const pct = ((count / predictions.totalMatches) * 100).toFixed(0);
    return `${count}/${predictions.totalMatches} = ${pct}%`;
  };

  // Get tooltip text based on active filter
  const getTooltipText = () => {
    switch(activeFilter) {
      case 'single':
        return 'ผลลัพธ์ของลูกเต๋าแต่ละหน้า';
      case 'pair':
        return 'ผลลัพธ์ของลูกเต๋าที่เป็นคู่';
      case 'triple':
        return 'ผลลัพธ์ของลูกเต๋าสามลูก';
      case 'sum':
        return 'ผลรวมของค่าลูกเต๋า';
      default:
        return '';
    }
  };

  // Build unified stats rows with filtering
  const buildStatsRows = () => {
    const rows = [];

    if (activeFilter === 'all' || activeFilter === 'single') {
      let faceFirstRow = true;
      // เรียง 1-6 ตามลำดับ
      for (let i = 1; i <= 6; i++) {
        if (predictions.faceCount[i] > 0) {
          rows.push({
            dice: String(i),
            label: (faceFirstRow && activeFilter === 'all') ? 'ผลลัพธ์ของลูกเต๋าแต่ละหน้า' : '',
            frequency: getFaceFrequency(predictions.faceCount[i]),
            type: 'single',
            sortValue: i, // ใช้สำหรับ sort
            count: predictions.faceCount[i] // เพิ่ม count สำหรับ sort by %
          });
          faceFirstRow = false;
        }
      }
    }

    if (activeFilter === 'all' || activeFilter === 'pair') {
      const pairEntries = Object.entries(predictions.pairs)
        .filter(entry => entry[1] > 0)
        .sort((a, b) => a[0].localeCompare(b[0])); // เรียงตามลำดับ 11, 12, 13, ...
      
      pairEntries.forEach((entry, idx) => {
        const pairFormatted = entry[0].split('').join(',');
        rows.push({
          dice: pairFormatted,
          label: (idx === 0 && activeFilter === 'all') ? 'ผลลัพธ์ของลูกเต๋าที่เป็นคู่' : '',
          frequency: getFrequency(entry[1]),
          type: 'pair',
          sortValue: entry[0], // ใช้สำหรับ sort
          count: entry[1]
        });
      });
    }

    if (activeFilter === 'all' || activeFilter === 'triple') {
      const tripleEntries = Object.entries(predictions.triples)
        .filter(entry => entry[1] > 0)
        .sort((a, b) => a[0].localeCompare(b[0])); // เรียงตามลำดับเลข (ปกติ)
      
      tripleEntries.forEach((entry, idx) => {
        const tripleFormatted = entry[0].split('').join(',');
        rows.push({
          dice: tripleFormatted,
          label: (idx === 0 && activeFilter === 'all') ? 'ผลลัพธ์ของลูกเต๋าสามลูก' : '',
          frequency: getFrequency(entry[1]),
          type: 'triple',
          sortValue: entry[0], // ใช้สำหรับ sort
          count: entry[1]
        });
      });
    }

    if (activeFilter === 'all' || activeFilter === 'sum') {
      const sumEntries = Object.entries(predictions.sums)
        .filter(entry => entry[1] > 0)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0])); // เรียง 3-18
      
      sumEntries.forEach((entry, idx) => {
        rows.push({
          dice: `Sum ${entry[0]}`,
          label: (idx === 0 && activeFilter === 'all') ? 'ผลรวมของค่าลูกเต๋า' : '',
          frequency: getFrequency(entry[1]),
          type: 'sum',
          sortValue: parseInt(entry[0]), // ใช้สำหรับ sort
          count: entry[1]
        });
      });
    }

    return rows;
  };

  const statsRows = buildStatsRows();

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center overflow-x-hidden">
      {/* Gradient Border Wrapper */}
      <div 
        className="rounded-3xl p-4 shadow-2xl my-2"
        style={{
          width: '798px',
          minHeight: '1034px',
          background: 'linear-gradient(to bottom, #FFFFFF, #EBEFF7, #F6F3FF)',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div className="mx-auto" style={{width: '734px'}}>

          {/* Page Title */}
          <div className="mb-4 text-center space-y-4">
            <div className="border border-blue-600 bg-blue-600 rounded-xl h-[72px] flex items-center justify-center">
              <h1 className="text-2xl font-bold text-white">
                🎲 Dice Prediction Dashboard
              </h1>
            </div>
            <p className="font-normal text-gray-500">
              Predict next dice patterns based on historical data
            </p>
          </div>

          {/* Last Roll Display - Responsive */}
          <LastRollDisplay 
            lastRoll={lastRoll} 
            historyLength={history.length}
          />

          {/* Input Section - Responsive */}
          <DiceInput
            manualInput={manualInput}
            setManualInput={setManualInput}
            onManualEntry={handleManualEntrySingle}
            onClear={handleClear}
            showHistory={showHistory}
            onToggleHistory={toggleHistory}
          />

          {/* Stats Table or History */}
          {!showHistory ? (
            <>
              {/* Filter Buttons */}
              <div 
                className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 flex items-center justify-center"
                style={{width: '734px', height: '46px', padding: '4px'}}
              >
                <div className="flex gap-1 w-full">
                  <FilterButton label="All" value="all" activeFilter={activeFilter} onClick={setActiveFilter} />
                  <FilterButton label="Single" value="single" activeFilter={activeFilter} onClick={setActiveFilter} />
                  <FilterButton label="Pair" value="pair" activeFilter={activeFilter} onClick={setActiveFilter} />
                  <FilterButton label="Triple" value="triple" activeFilter={activeFilter} onClick={setActiveFilter} />
                  <FilterButton label="Sum" value="sum" activeFilter={activeFilter} onClick={setActiveFilter} />
                </div>
              </div>

              {/* Stats Table */}
              <StatsTable 
                statsRows={statsRows}
                activeFilter={activeFilter}
                getTooltipText={getTooltipText}
                historyLength={history.length}
                isPrediction={true}
                totalMatches={predictions.totalMatches}
              />
            </>
          ) : (
            <HistoryStrip history={history} fullView={true} onEdit={handleEditHistory} onDelete={handleDeleteHistory} />
          )}

          {/* History Strip - Only show when not in full history view */}
          {!showHistory && <HistoryStrip history={history} />}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal 
        isOpen={showResetModal}
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </div>
  );
};

export default HiLoStatistics;