import React, { useState } from 'react';
import { Save, Settings as SettingsIcon, Key, Globe, Database, Layout } from 'lucide-react';
import toast from 'react-hot-toast';
import UpgradeProOverlay from '../components/UpgradeProOverlay';
import { COUNTRIES } from '../utils/countries';
import { api } from '../utils/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    defaultCountry: 'us',
    defaultPinStyle: 'standard-red',
    popupStyle: 'original'
  });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    api.get('/settings').then(data => {
      if (data) setSettings(data);
    }).catch(err => console.error(err));
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post('/settings', settings);
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button disabled={saving} onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 p-4">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <SettingsIcon size={18} />
              General
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'api' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Key size={18} />
              API Keys
            </button>
            <button 
              onClick={() => setActiveTab('design')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'design' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Layout size={18} />
              Popup Design
            </button>
            <button 
              onClick={() => setActiveTab('advanced')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'advanced' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Database size={18} />
              Advanced (Pro)
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8">
          
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">General Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Country / Region</label>
                <select 
                  value={settings.defaultCountry}
                  onChange={(e) => setSettings({...settings, defaultCountry: e.target.value})}
                  className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer shadow-sm text-gray-700 font-medium"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code.toLowerCase()}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">Sets the default map bounds and coordinate system.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Map Pin Style</label>
                <select 
                  value={settings.defaultPinStyle}
                  onChange={(e) => setSettings({...settings, defaultPinStyle: e.target.value})}
                  className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer shadow-sm text-gray-700 font-medium"
                >
                  <option value="standard-red">Standard Red Marker</option>
                  <option value="standard-blue">Standard Blue Marker</option>
                  <option value="minimal-dot">Minimalist Dot</option>
                </select>
              </div>



              <div className="relative min-h-[280px] flex flex-col justify-center border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50/50 my-6">
                <UpgradeProOverlay title="Custom Map Pin Icons" description="Upload your own SVG or PNG map markers, or assign different icons to specific categories." />
                <div className="opacity-40 pointer-events-none">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Marker Icon</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-400">SVG/PNG</span>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700">Upload Icon</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Delete data on uninstall</span>
                    <span className="block text-sm text-gray-500">If checked, all locations will be permanently deleted when the plugin is removed.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">API Keys</h2>
              
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-6">
                Map Pin Directory uses free OpenStreetMap data by default, so you don't need any API keys to get started!
              </div>

              <div className="relative min-h-[280px] flex flex-col justify-center border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50/50 my-6">
                <UpgradeProOverlay title="Google Maps API" description="Unlock Google Maps tiles, Places Autocomplete, and advanced Directions routing." />
                
                <div className="opacity-40">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe size={16} /> Google Maps API Key
                  </label>
                  <input type="password" value="***********************" readOnly className="w-full max-w-md p-2.5 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Popup Design</h2>
              <p className="text-sm text-gray-500 mb-6">Customize how location information appears when a map pin is clicked.</p>
              
              <div className="relative min-h-[200px] flex flex-col justify-center border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50/50 my-6">
                <UpgradeProOverlay title="Pro Map Popups" description="Unlock gorgeous Map Preview and Clean Card popup designs for your locations." />
                
                <div className="opacity-40 pointer-events-none">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Map Popup Style</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm hover:border-blue-500 focus:outline-none ${settings.popupStyle === 'original' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 bg-white'}`}>
                      <input type="radio" name="popupStyle" value="original" className="sr-only" checked={settings.popupStyle === 'original'} onChange={(e) => setSettings({...settings, popupStyle: e.target.value})} />
                      <div className="flex flex-col">
                        <span className="block text-sm font-bold text-gray-900">Original Style</span>
                        <span className="mt-1 flex items-center text-xs text-gray-500">Standard clean look.</span>
                      </div>
                    </label>
                    
                    <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm hover:border-blue-500 focus:outline-none ${settings.popupStyle === 'variant-a' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 bg-white'}`}>
                      <input type="radio" name="popupStyle" value="variant-a" className="sr-only" checked={settings.popupStyle === 'variant-a'} onChange={(e) => setSettings({...settings, popupStyle: e.target.value})} />
                      <div className="flex flex-col">
                        <span className="block text-sm font-bold text-gray-900">Clean Card (Variant A)</span>
                        <span className="mt-1 flex items-center text-xs text-gray-500">Modern with gradient header.</span>
                      </div>
                    </label>
                    
                    <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm hover:border-blue-500 focus:outline-none ${settings.popupStyle === 'variant-b' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 bg-white'}`}>
                      <input type="radio" name="popupStyle" value="variant-b" className="sr-only" checked={settings.popupStyle === 'variant-b'} onChange={(e) => setSettings({...settings, popupStyle: e.target.value})} />
                      <div className="flex flex-col">
                        <span className="block text-sm font-bold text-gray-900">Map Preview (Variant B)</span>
                        <span className="mt-1 flex items-center text-xs text-gray-500">Includes map thumbnail.</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="relative min-h-[400px] p-6 border border-dashed border-gray-300 rounded-xl bg-gray-50/50 my-2">
              <UpgradeProOverlay title="Advanced Settings" description="Unlock import/export tools, custom CSS overrides, and white-labeling." />
              
              <div className="opacity-40 pointer-events-none space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Import / Export Data</h3>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700">Export CSV</button>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700">Import CSV</button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Custom CSS Overrides</h3>
                  <div className="w-full h-24 bg-gray-800 rounded-lg border border-gray-700 p-3">
                    <div className="h-2 w-1/3 bg-gray-600 rounded mb-2"></div>
                    <div className="h-2 w-1/4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-2 w-1/2 bg-gray-600 rounded"></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">White-labeling</h3>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300" disabled />
                    <span className="block text-sm font-medium text-gray-700">Hide Map Pin Directory branding</span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
