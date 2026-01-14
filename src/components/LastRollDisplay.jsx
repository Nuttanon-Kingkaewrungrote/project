import React from 'react';
import DiceFace from './DiceFace';

const LastRollDisplay = ({ lastRoll, historyLength }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Dice + Result */}
      <div className="flex items-center gap-8 bg-slate-50 border border-slate-200 px-10 py-5 rounded-xl shadow-md flex-1 min-h-[96px]">
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
          <div className="text-4xl font-bold text-gray-800 px-6 py-2 rounded-lg">
            {lastRoll.join('')}
          </div>
        )}
      </div>

      {/* Count Dice */}
      <div className="border border-blue-200 bg-sky-50 text-blue-600 px-10 py-6 rounded-xl shadow-md min-w-[110px]">
        <div className="text-2xl font-bold text-center">{historyLength}</div>
        <div className="text-xs text-center">Count Dice</div>
      </div>
    </div>
  );
};

export default LastRollDisplay;