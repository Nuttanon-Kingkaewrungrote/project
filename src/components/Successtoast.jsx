import React, { useEffect } from 'react';

const SuccessToast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000); // Hide after 1 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10001] animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-100"
        style={{ width: '216px', height: '59px', padding: '0 16px' }}
      >
        {/* Green Check Icon */}
        <div 
          className="rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#22C55E'
          }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Message Text */}
        <div className="text-sm font-normal text-gray-800 whitespace-nowrap">
          {message}
        </div>
      </div>
    </div>
  );
};

export default SuccessToast;