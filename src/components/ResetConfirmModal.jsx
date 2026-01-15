import React from 'react';

const ResetConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center"
        style={{width: '400px', height: '250px'}}
      >
        {/* Icon */}
        <div 
          className="rounded-full flex items-center justify-center mb-4"
          style={{
            width: '48px',
            height: '48px',
            minWidth: '48px',
            minHeight: '48px',
            background: '#DC2627',
            boxShadow: '0px 4px 12px rgba(220, 38, 39, 0.3)',
            aspectRatio: '1/1'
          }}
        >
          <svg className="w-6 h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 12c0 5.2-4.3 9.5-9.5 9.5S2.5 17.2 2.5 12 6.8 2.5 12 2.5c3.3 0 6.2 1.7 7.9 4.3"/>
            <path d="M19.9 2.5v4.8h-4.8"/>
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-normal text-gray-800 mb-0">Reset</h2>
        
        {/* Message */}
        <p className="text-center text-gray-500 mb-6 text-sm">
          Are you sure you want to clear all history? This action cannot be undone
        </p>

        {/* Buttons */}
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={onCancel}
            className="bg-white text-gray-800 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
            style={{
              width: '168px',
              height: '49px',
              backgroundColor: '#FFFFFF',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E2E2E2'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            className="text-white font-semibold rounded-lg transition-colors"
            style={{
              width: '168px',
              height: '49px',
              backgroundColor: '#DC2627',
              border: '1px solid #FF2B2C',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#BB2021'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#DC2627'}
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmModal;