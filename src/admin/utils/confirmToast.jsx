import React from 'react';
import toast from 'react-hot-toast';

export const confirmToast = (message, onConfirm) => {
  toast((t) => (
    <div className="flex flex-col gap-4 p-1 min-w-[250px]">
      <div className="text-gray-900 font-medium">{message}</div>
      <div className="flex gap-2 justify-end">
        <button 
          onClick={() => toast.dismiss(t.id)} 
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => { 
            toast.dismiss(t.id); 
            onConfirm(); 
          }} 
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  ), { 
    duration: Infinity,
    position: 'top-center',
    style: {
      padding: '16px',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)'
    }
  });
};
