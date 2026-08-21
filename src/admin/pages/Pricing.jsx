import React from 'react';
import { Check, X, CreditCard, ShieldCheck } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="w-full pb-12">
      <div className="text-center mb-12 mt-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade to Map Pin Directory Pro</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center" style={{ textAlign: 'center', margin: '0 auto' }}>
          Unlock unlimited maps, locations, and premium features to build the ultimate directory for your WordPress site.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full">
        {/* Free Tier */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
            CURRENT PLAN
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#111827' }}>Free Version</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-extrabold text-gray-900">$0</span>
          </div>
          <p className="text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
            Perfect for small local businesses starting out.
          </p>
          
          <ul className="space-y-4 mb-8 flex-1 text-sm">
            <li className="flex items-center gap-3">
              <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div>
              <span className="text-gray-700">Up to 5 Maps</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div>
              <span className="text-gray-700">Up to 5 Locations</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div>
              <span className="text-gray-700">Up to 3 Categories</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div>
              <span className="text-gray-700">Basic Location Search</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div>
              <span className="text-gray-700">Standard Map Markers</span>
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <div className="bg-red-100 p-1 rounded-full"><X size={14} className="text-red-500" /></div>
              <span className="text-gray-500 line-through">Custom Map Themes</span>
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <div className="bg-red-100 p-1 rounded-full"><X size={14} className="text-red-500" /></div>
              <span className="text-gray-500 line-through">Import / Export Data</span>
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <div className="bg-red-100 p-1 rounded-full"><X size={14} className="text-red-500" /></div>
              <span className="text-gray-500 line-through">Analytics & Stats</span>
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <div className="bg-red-100 p-1 rounded-full"><X size={14} className="text-red-500" /></div>
              <span className="text-gray-500 line-through">Premium Support</span>
            </li>
          </ul>
          
          <button disabled className="w-full py-2.5 px-4 rounded-xl font-semibold bg-gray-100 text-gray-500 cursor-not-allowed">
            Your Current Plan
          </button>
        </div>

        {/* Pro Yearly Tier */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-orange-500/10 border-2 border-orange-500 p-8 flex flex-col relative transform md:scale-105 z-10">
          <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg rounded-tr-xl tracking-wider">
            RECOMMENDED
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#111827' }}>Pro Yearly</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-extrabold text-orange-500">$59</span>
            <span className="text-gray-500 font-medium">/year</span>
          </div>
          <p className="text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
            Great for growing directories on a single site.
          </p>
          
          <ul className="space-y-4 mb-8 flex-1 text-sm">
            <li className="flex items-center gap-3">
              <div className="bg-orange-100 p-1 rounded-full"><Check size={14} className="text-orange-600" /></div>
              <span className="text-gray-900 font-medium">Up to 20 Maps</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-orange-100 p-1 rounded-full"><Check size={14} className="text-orange-600" /></div>
              <span className="text-gray-900 font-medium">Up to 50 Locations</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-orange-100 p-1 rounded-full"><Check size={14} className="text-orange-600" /></div>
              <span className="text-gray-900 font-medium">Up to 10 Categories</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-orange-100 p-1 rounded-full"><Check size={14} className="text-orange-600" /></div>
              <span className="text-gray-900 font-medium">Advanced Search & Filters</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-orange-100 p-1 rounded-full"><Check size={14} className="text-orange-600" /></div>
              <span className="text-gray-900 font-medium">Custom Image Markers</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-orange-100 p-1 rounded-full"><Check size={14} className="text-orange-600" /></div>
              <span className="text-gray-900 font-medium">Custom Map Styling</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-orange-100 p-1 rounded-full"><Check size={14} className="text-orange-600" /></div>
              <span className="text-gray-900 font-medium">Import / Export Data</span>
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <div className="bg-red-100 p-1 rounded-full"><X size={14} className="text-red-500" /></div>
              <span className="text-gray-500 line-through">White Label Ready</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-orange-100 p-1 rounded-full"><Check size={14} className="text-orange-600" /></div>
              <span className="text-gray-900 font-medium">1 Year Support & Updates</span>
            </li>
          </ul>
          
          <a href="https://github.com/mdredoyislam" target="_blank" rel="noreferrer" className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
            <CreditCard size={18} />
            Get Pro Yearly
          </a>
        </div>

        {/* Pro Lifetime Tier */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 flex flex-col relative">
          <h3 className="text-xl font-bold mb-2" style={{ color: '#111827' }}>Agency Lifetime</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-extrabold text-gray-900">$99</span>
            <span className="text-gray-500 font-medium">/one-time</span>
          </div>
          <p className="text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
            Unlimited everything. Pay once, use forever.
          </p>
          
          <ul className="space-y-4 mb-8 flex-1 text-sm">
            <li className="flex items-center gap-3">
              <div className="bg-blue-100 p-1 rounded-full"><Check size={14} className="text-blue-600" /></div>
              <span className="text-gray-700">Unlimited Maps</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-blue-100 p-1 rounded-full"><Check size={14} className="text-blue-600" /></div>
              <span className="text-gray-700">Unlimited Locations</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-blue-100 p-1 rounded-full"><Check size={14} className="text-blue-600" /></div>
              <span className="text-gray-700">Unlimited Categories</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-blue-100 p-1 rounded-full"><Check size={14} className="text-blue-600" /></div>
              <span className="text-gray-700">Everything in Yearly</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-blue-100 p-1 rounded-full"><Check size={14} className="text-blue-600" /></div>
              <span className="text-gray-700">White Label Ready</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-amber-100 p-1 rounded-full"><Check size={14} className="text-amber-600" /></div>
              <span className="text-amber-700">Unlimited Sites</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-blue-100 p-1 rounded-full"><Check size={14} className="text-blue-600" /></div>
              <span className="text-gray-700">Lifetime Updates</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-blue-100 p-1 rounded-full"><Check size={14} className="text-blue-600" /></div>
              <span className="text-gray-700">Priority Developer Support</span>
            </li>
          </ul>
          
          <a href="https://github.com/mdredoyislam" target="_blank" rel="noreferrer" className="w-full py-2.5 px-4 rounded-xl font-bold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
            <CreditCard size={18} />
            Upgrade Now
          </a>
          
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck size={14} />
            <span>14-day Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
