import React, { useState, useEffect, useRef } from 'react';
import { Save, ArrowLeft, Layers, Sliders, Settings } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../utils/api';

export default function MapBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const [theme, setTheme] = useState('light');
  const [zoom, setZoom] = useState(11);
  const [mapHeight, setMapHeight] = useState(400);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView([23.6850, 90.3563], 6); // Bangladesh center
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstanceRef.current);
      
      // Force a resize right after creation so tiles load correctly on first render
      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 300);
    }
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [zoom]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300); // wait for CSS transition to finish
    }
  }, [mapHeight]);

  useEffect(() => {
    if (id) {
      // Load map data if editing
      api.get(`/maps`).then(maps => {
        const map = maps.find(m => m.id === id);
        if (map) {
          setTitle(map.title);
          if (map.settings) {
            try {
              const settings = JSON.parse(map.settings);
              setTheme(settings.theme || 'light');
              setZoom(settings.zoom || 11);
              setMapHeight(settings.height || 400);
            } catch(e){}
          }
        }
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Map Name is required');
      return;
    }
    
    const mapData = {
      id: id || null,
      title: title,
      settings: {
        theme,
        zoom,
        height: mapHeight
      }
    };

    try {
      setSaving(true);
      await api.post('/maps', mapData);
      toast.success(id ? 'Map updated successfully!' : 'Map created successfully!');
      if (!id) navigate('/maps'); // Go back to maps list if it was a new map
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save map');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/maps" className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex-1">{id ? 'Edit Map' : 'Map Builder'}</h1>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Map'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Settings Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-md font-semibold text-gray-800 mb-4 !flex items-center gap-2">
              <Settings size={18} className="text-gray-400" />
              General
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Map Name</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 outline-none" 
                  placeholder="e.g. Store Locator" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-md font-semibold text-gray-800 mb-4 !flex items-center gap-2">
              <Layers size={18} className="text-gray-400" />
              Appearance
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Map Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`p-2 border rounded-lg text-sm text-center transition-colors ${theme === 'light' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`p-2 border rounded-lg text-sm text-center transition-colors ${theme === 'dark' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-md font-semibold text-gray-800 mb-4 !flex items-center gap-2">
              <Sliders size={18} className="text-gray-400" />
              Controls
            </h2>
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Default Zoom</span>
                  <span className="text-blue-600 font-bold">{zoom}</span>
                </label>
                <input 
                  type="range" 
                  min="1" max="18" 
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full accent-blue-600" 
                />
              </div>
              
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm text-gray-700">Enable Cluster Markers</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Map Height</span>
                  <span className="text-blue-600 font-bold">{mapHeight}px</span>
                </label>
                <input 
                  type="range" 
                  min="200" max="800" step="10"
                  value={mapHeight}
                  onChange={(e) => setMapHeight(e.target.value)}
                  className="w-full accent-blue-600" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded flex items-center gap-1">
                Preview Mode
              </span>
            </div>
            
            <div 
              className="w-full bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative transition-all duration-300" 
              style={{ height: `${mapHeight}px` }}
              ref={mapRef}
            >
               {/* Leaflet map injects here */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
