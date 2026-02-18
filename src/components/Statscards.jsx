import React from 'react';

const StatsCards = ({ history }) => {
  // คำนวณสถิติจาก history
  const calculateStats = () => {
    let even = 0;
    let odd = 0;
    let hi = 0;
    let low = 0;

    history.forEach(roll => {
      const sum = roll.reduce((a, b) => a + b, 0);
      
      // นับ Even/Odd
      if (sum % 2 === 0) {
        even++;
      } else {
        odd++;
      }
      
      // นับ Hi/Low
      if (sum >= 11) {
        hi++;
      } else {
        low++;
      }
    });

    return { even, odd, hi, low };
  };

  const stats = calculateStats();

  return (
    <div className="flex gap-9 mb-5" style={{ width: '734px' }}>
      {/* Even Card */}
      <div 
        className="bg-white rounded-xl flex flex-col items-center justify-center"
        style={{
          width: '156.5px',
          height: '77px',
          border: '2px solid #5865F2',
          boxShadow: '0 4px 6px -1px rgba(88, 101, 242, 0.3), 0 2px 4px -1px rgba(88, 101, 242, 0.2)'
        }}
      >
        <div className="text-3xl font-bold" style={{ color: '#5865F2' }}>
          {stats.even}
        </div>
        <div className="text-sm font-medium" style={{ color: '#5865F2' }}>
          Even
        </div>
      </div>

      {/* Odd Card */}
      <div 
        className="bg-white rounded-xl flex flex-col items-center justify-center"
        style={{
          width: '156.5px',
          height: '77px',
          border: '2px solid #008F87',
          boxShadow: '0 4px 6px -1px rgba(0, 143, 135, 0.3), 0 2px 4px -1px rgba(0, 143, 135, 0.2)'
        }}
      >
        <div className="text-3xl font-bold" style={{ color: '#008F87' }}>
          {stats.odd}
        </div>
        <div className="text-sm font-medium" style={{ color: '#008F87' }}>
          Odd
        </div>
      </div>

      {/* Hi Card */}
      <div 
        className="bg-white rounded-xl flex flex-col items-center justify-center"
        style={{
          width: '156.5px',
          height: '77px',
          border: '2px solid #1F83FF',
          boxShadow: '0 4px 6px -1px rgba(31, 131, 255, 0.3), 0 2px 4px -1px rgba(31, 131, 255, 0.2)'
        }}
      >
        <div className="text-3xl font-bold" style={{ color: '#3B82F6' }}>
          {stats.hi}
        </div>
        <div className="text-sm font-medium" style={{ color: '#3B82F6' }}>
          Hi
        </div>
      </div>

      {/* Low Card */}
      <div 
        className="bg-white rounded-xl flex flex-col items-center justify-center"
        style={{
          width: '156.5px',
          height: '77px',
          border: '2px solid #EF4B58',
          boxShadow: '0 4px 6px -1px rgba(239, 75, 88, 0.3), 0 2px 4px -1px rgba(239, 75, 88, 0.2)'
        }}
      >
        <div className="text-3xl font-bold" style={{ color: '#EF4B58' }}>
          {stats.low}
        </div>
        <div className="text-sm font-medium" style={{ color: '#EF4B58' }}>
          Low
        </div>
      </div>
    </div>
  );
};

export default StatsCards;