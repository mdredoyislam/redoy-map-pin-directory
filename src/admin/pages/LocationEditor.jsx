import React, { useState } from 'react';
import { Save, ArrowLeft, MapPin } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../utils/api';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  React.useEffect(() => {
    if (position && position.lat && position.lng) {
      map.flyTo([position.lat, position.lng], map.getZoom(), { animate: false });
      setTimeout(() => { map.invalidateSize(); }, 100);
    }
  }, [position.lat, position.lng, map]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} draggable={true} eventHandlers={{
        dragend: (e) => setPosition(e.target.getLatLng())
    }} />
  );
}

function MapResizer() {
  const map = useMap();
  React.useEffect(() => {
    // Small delay ensures the parent container has finished rendering/animating its dimensions
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function LocationEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [position, setPosition] = useState({ lat: 40.7128, lng: -74.0060 });
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    address: '',
    category: 'all',
    status: 'active'
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    api.get('/categories').then(data => {
      setCategories(Array.isArray(data) ? data : []);
    }).catch(console.error);
    
    if (id) {
      // Fetch location if editing
      api.get('/locations').then(locations => {
        const loc = locations.find(l => l.id == id);
        if (loc) {
          setFormData({
            id: loc.id,
            title: loc.title || '',
            description: loc.description || '',
            address: loc.address || '',
            category: loc.category || 'all',
            status: loc.status || 'active'
          });
          if (loc.lat && loc.lng) {
            setPosition({ lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) });
          }
        }
      }).catch(console.error);
    }
  }, [id]);

  const handleSave = async () => {
    if (!formData.title) return toast.error('Title is required');
    try {
      setSaving(true);
      await api.post('/locations', {
        ...formData,
        lat: position.lat,
        lng: position.lng
      });
      toast.success('Location saved successfully!');
      navigate('/locations');
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Error saving location');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSearch = async () => {
    if (!formData.address) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setPosition({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        setFormData({ ...formData, address: data[0].display_name });
      } else {
        toast.error('Location not found. Try a more specific search term.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error searching for location.');
    }
  };

  return (
    <div className="w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/locations" className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex-1">{id ? 'Edit Location' : 'Add Location'}</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Location'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" 
                  placeholder="e.g. Central Cafe" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows="4" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" 
                  placeholder="Details about this location..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                >
                  <option value="all">Uncategorized</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2 !flex justify-between items-center">
              Map Location
              <MapPin size={18} className="text-gray-400" />
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Search</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" 
                  placeholder="e.g. Dhaka, Bangladesh" 
                />
                <button 
                  onClick={handleAddressSearch}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-300"
                >
                  Search
                </button>
              </div>
            </div>
            
            <div className="h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4 relative z-0">
              <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationMarker position={position} setPosition={setPosition} />
                <MapResizer />
              </MapContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                <input type="text" value={position.lat.toFixed(6)} readOnly className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                <input type="text" value={position.lng.toFixed(6)} readOnly className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Status & Visibility</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'active' : 'pending'})}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">Publish immediately</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
