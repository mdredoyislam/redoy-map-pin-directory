import React from 'react';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UpgradeProOverlay({ title, description }) {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl border border-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 max-w-sm text-center">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Feature</h3>
        <p className="text-gray-500 mb-6 text-sm">{title || 'This feature is locked.'} {description}</p>
        <button onClick={() => toast.success('Redirecting to Map Pin Directory Pro checkout...')} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all transform hover:scale-[1.02]">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
