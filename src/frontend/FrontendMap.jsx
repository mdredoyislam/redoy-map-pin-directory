import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { api } from '../admin/utils/api';
import FilterBar from './components/FilterBar';
import ResultList from './components/ResultList';
import MapPopupCard from './components/MapPopupCard';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to fly to selected location
function MapController({ selectedLocation }) {
  const map = useMap();
  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 15, { animate: false });
      setTimeout(() => { map.invalidateSize(); }, 100);
    }
  }, [selectedLocation, map]);
  return null;
}

// Auto-fit bounds to show all markers
function BoundsController({ locations, selectedLocation }) {
  const map = useMap();
  useEffect(() => {
    if (locations && locations.length > 0 && !selectedLocation) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [locations, selectedLocation, map]);
  return null;
}

function MapResizer() {
  const map = useMap();
  React.useEffect(() => {
    // Small delay ensures the parent container has finished rendering its dimensions
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function FrontendMap({ mapId }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    loadLocations();
    loadCategories();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.get('/settings');
      if (data) setSettings(data);
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.get('/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await api.get('/locations');
      setLocations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load map locations', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const titleMatch = loc.title ? loc.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const addressMatch = loc.address ? loc.address.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const matchesSearch = titleMatch || addressMatch;
      
      const matchesCategory = category === 'all' || (loc.category && loc.category.toLowerCase() === category.toLowerCase()); 
      
      return matchesSearch && matchesCategory;
    });
  }, [locations, searchQuery, category]);

  if (loading) {
    return <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center animate-pulse rounded-lg border border-gray-200">
      <span className="text-gray-500 font-medium">Loading Map...</span>
    </div>;
  }

  const defaultCenter = locations.length > 0 
    ? [locations[0].lat, locations[0].lng] 
    : [40.7128, -74.0060];

  return (
    <div className="w-full h-[700px] flex flex-col rounded-xl overflow-hidden shadow-lg border border-gray-200 font-sans">
      <FilterBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        category={category} 
        setCategory={setCategory}
        categories={categories}
      />
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-0">
        {/* Left Side: Result List */}
        <div className="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <ResultList 
            locations={filteredLocations} 
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation} 
          />
        </div>

        {/* Right Side: Map */}
        <div className="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full relative z-0">
          <MapContainer center={defaultCenter} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            <MapController selectedLocation={selectedLocation} />
            <BoundsController locations={filteredLocations} selectedLocation={selectedLocation} />
            <MapResizer />

            {filteredLocations.map((loc) => (
              <Marker 
                key={loc.id} 
                position={[loc.lat, loc.lng]}
                eventHandlers={{
                  click: () => setSelectedLocation(loc),
                }}
              >
                <Popup closeButton={true}>
                  <MapPopupCard loc={loc} variant={settings.popupStyle || 'original'} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
