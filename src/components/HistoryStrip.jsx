import React, { useState } from 'react';
import SuccessToast from './SuccessToast';

const HistoryStrip = ({ history, fullView = false, onEdit, onDelete }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleEditClick = (idx, roll) => {
    setEditingIndex(idx);
    setEditValue(roll.join(''));
    setDeletingIndex(null);
  };

  const handleDeleteClick = (idx) => {
    setDeletingIndex(idx);
    setEditingIndex(null);
  };

  const handleSave = (idx) => {
    if (editValue.length === 3) {
      const dice = editValue.split('').map(Number);
      if (dice.every(d => d >= 1 && d <= 6)) {
        onEdit(idx, dice);
        setEditingIndex(null);
        setEditValue('');
        setToastMessage('Saved successfully');
        setShowToast(true);
      } else {
        alert("Dice number must be between 1 and 6");
      }
    } else {
      alert("Please enter exactly 3 digits");
    }
  };

  const handleConfirmDelete = (idx) => {
    // Show toast first
    setToastMessage('Deleted successfully');
    setShowToast(true);
    
    // Then delete after a small delay to ensure toast renders
    setTimeout(() => {
      onDelete(idx);
      setDeletingIndex(null);
    }, 50);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setDeletingIndex(null);
    setEditValue('');
  };

  // Render toast outside of conditional rendering
  const toastComponent = (
    <SuccessToast 
      message={toastMessage}
      isVisible={showToast}
      onClose={() => setShowToast(false)}
    />
  );
  
  if (history.length === 0) {
    if (fullView) {
      return (
        <>
          {toastComponent}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent History</h2>
            <div className="text-center text-gray-400 py-8">
              กรุณาใส่ตัวเลข และกด Enter เพื่อเริ่มบันทึก
            </div>
          </div>
        </>
      );
    }
    return toastComponent;
  }
  
  if (fullView) {
    const reversedHistory = history.slice().reverse();
    
    return (
      <>
        {toastComponent}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-1">
          <svg className="w-6 h-6" fill="none" stroke="#3B82F6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent History
        </h2>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {reversedHistory.map((roll, idx) => {
            const originalIdx = history.length - 1 - idx;
            const sum = roll.reduce((a, b) => a + b, 0);
            const hiLo = sum >= 11 ? 'Hi' : 'Lo';
            const hiLoColor = sum >= 11 ? 'text-blue-600' : 'text-red-600';
            const isEditing = editingIndex === originalIdx;
            const isDeleting = deletingIndex === originalIdx;
            
            // Edit Mode
            if (isEditing) {
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border-2 border-blue-500 rounded-xl bg-blue-50"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        if (v.length <= 3) setEditValue(v);
                      }}
                      className="w-24 px-3 py-2 text-lg font-bold text-center border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSave(originalIdx)}
                      className="px-6 py-2 text-white font-semibold rounded-lg transition-colors"
                      style={{ backgroundColor: '#2563EB' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#1E52C4'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#2563EB'}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 font-semibold rounded-lg transition-colors"
                      style={{ backgroundColor: '#E5E7EB', color: '#374151' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#C7C8CB'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            // Delete Mode
            if (isDeleting) {
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border-2 border-red-500 rounded-xl bg-red-50"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(220, 38, 39, 0.3), 0 2px 4px -1px rgba(220, 38, 39, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${hiLoColor}`}>
                      {roll.join('')}
                    </span>
                    <span className="text-gray-600">Delete this input?</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleConfirmDelete(originalIdx)}
                      className="px-6 py-2 text-white font-semibold rounded-lg transition-colors"
                      style={{ backgroundColor: '#DC2627' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#AF1E1E'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#DC2627'}
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 font-semibold rounded-lg transition-colors"
                      style={{ backgroundColor: '#E5E7EB', color: '#374151' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#C7C8CB'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            // Normal Mode
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-bold ${hiLoColor}`}>
                    {roll.join('')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-semibold ${hiLoColor} min-w-[40px] text-center`}>
                    {hiLo}
                  </span>
                  <button 
                    onClick={() => handleEditClick(originalIdx, roll)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg border-2 border-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(originalIdx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg border-2 border-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </>
    );
  }

  // Original compact view
  return (
    <>
      {toastComponent}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      <div className="text-sm text-gray-500 mb-2">Recent History:</div>
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
    </>
  );
};

export default HistoryStrip;