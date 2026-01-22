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

  // Calculate all statistics
  const calculateStats = useCallback(() => {
    const stats = {
      faceCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      pairs: {},
      triples: {},
      sums: {}
    };

    history.forEach(roll => {
      const uniqueFaces = [...new Set(roll)];
      uniqueFaces.forEach(face => {
        stats.faceCount[face]++;
      });

      const sum = roll.reduce((a, b) => a + b, 0);
      stats.sums[sum] = (stats.sums[sum] || 0) + 1;

      const sorted = [...roll].sort((a, b) => a - b);
      const allPairs = [
        [sorted[0], sorted[1]].sort((a, b) => a - b).join(''),
        [sorted[0], sorted[2]].sort((a, b) => a - b).join(''),
        [sorted[1], sorted[2]].sort((a, b) => a - b).join('')
      ];
      
      const uniquePairs = [...new Set(allPairs)];
      
      uniquePairs.forEach(pairKey => {
        stats.pairs[pairKey] = (stats.pairs[pairKey] || 0) + 1;
      });

      const tripleKey = sorted.join('');
      stats.triples[tripleKey] = (stats.triples[tripleKey] || 0) + 1;
    });

    return stats;
  }, [history]);

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

  const stats = calculateStats();

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
    if (history.length === 0) return '-';
    const pct = ((count / history.length) * 100).toFixed(0);
    return `${count}/${history.length} = ${pct}%`;
  };

  const getFaceFrequency = (count) => {
    if (history.length === 0) return '-';
    const pct = ((count / history.length) * 100).toFixed(0);
    return `${count}/${history.length} = ${pct}%`;
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
      for (let i = 1; i <= 6; i++) {
        if (stats.faceCount[i] > 0) {
          rows.push({
            dice: String(i),
            label: (faceFirstRow && activeFilter === 'all') ? 'ผลลัพธ์ของลูกเต๋าแต่ละหน้า' : '',
            frequency: getFaceFrequency(stats.faceCount[i]),
            type: 'single'
          });
          faceFirstRow = false;
        }
      }
    }

    if (activeFilter === 'all' || activeFilter === 'pair') {
      const pairEntries = Object.entries(stats.pairs)
        .filter(entry => entry[1] > 0)
        .sort((a, b) => a[0].localeCompare(b[0]));
      
      pairEntries.forEach((entry, idx) => {
        const pairFormatted = entry[0].split('').join(',');
        rows.push({
          dice: pairFormatted,
          label: (idx === 0 && activeFilter === 'all') ? 'ผลลัพธ์ของลูกเต๋าที่เป็นคู่' : '',
          frequency: getFrequency(entry[1]),
          type: 'pair'
        });
      });
    }

    if (activeFilter === 'all' || activeFilter === 'triple') {
      const tripleEntries = Object.entries(stats.triples)
        .filter(entry => entry[1] > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      tripleEntries.forEach((entry, idx) => {
        const tripleFormatted = entry[0].split('').join(',');
        rows.push({
          dice: tripleFormatted,
          label: (idx === 0 && activeFilter === 'all') ? 'ผลลัพธ์ของลูกเต๋าสามลูก' : '',
          frequency: getFrequency(entry[1]),
          type: 'triple'
        });
      });
    }

    if (activeFilter === 'all' || activeFilter === 'sum') {
      const sumEntries = Object.entries(stats.sums)
        .filter(entry => entry[1] > 0)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      
      sumEntries.forEach((entry, idx) => {
        rows.push({
          dice: `Sum ${entry[0]}`,
          label: (idx === 0 && activeFilter === 'all') ? 'ผลรวมของค่าลูกเต๋า' : '',
          frequency: getFrequency(entry[1]),
          type: 'sum'
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
                🎲 Dice Tracker Dashboard
              </h1>
            </div>
            <p className="font-normal text-gray-500">
              Analyze dice frequency patterns from your input data
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