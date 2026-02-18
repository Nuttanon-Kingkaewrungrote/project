import React from 'react';
import DiceFace from './DiceFace';

const LastRollDisplay = ({ lastRoll, historyLength }) => {
  return (
    <div className="flex items-center gap-4 mb-5">
      {/* Dice + Result */}
      <div 
        className="flex items-center justify-between bg-slate-50 border border-neutral-300 px-10 py-5 rounded-xl"
        style={{width: '562px', height: '114px'}}
      >
        {/* Dice */}
        <div className="flex gap-3">
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
          <div className="text-5xl font-bold text-gray-800 px-14 py-2 rounded-lg">
            {lastRoll.join('')}
          </div>
        )}
      </div>

      {/* Count Dice */}
      <div className="border border-blue-200 bg-sky-50 rounded-xl flex flex-col items-center justify-center" style={{ width: '157px', height: '114px' }}>
        <div className="text-4xl font-bold text-center text-blue-500">
          {historyLength}
        </div>
        <div className="text-sm text-center text-blue-800">
           Count Dice
        </div>
      </div>
    </div>
  );
};

export default LastRollDisplay;