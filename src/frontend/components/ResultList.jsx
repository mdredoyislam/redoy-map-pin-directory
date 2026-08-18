import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function ResultList({ locations, selectedLocation, setSelectedLocation }) {
  if (locations.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="font-medium text-gray-700 mb-1">No locations found</p>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {locations.map((loc) => (
        <div 
          key={loc.id}
          onClick={() => setSelectedLocation(loc)}
          className={`p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-white ${selectedLocation?.id === loc.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'bg-transparent border-l-4 border-l-transparent'}`}
        >
          <h3 className="text-base font-bold text-gray-900 mb-1">{loc.title}</h3>
          
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
            <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{loc.address || 'No address provided'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block !px-2.5 !py-1 !bg-gray-200 !text-gray-700 !rounded-md !text-xs !font-medium leading-none">
              {loc.category || 'General'}
            </span>
            {loc.status === 'active' && (
              <span className="inline-block !px-2.5 !py-1 !bg-emerald-100 !text-emerald-800 !rounded-md !text-xs !font-medium !border !border-emerald-200 leading-none">
                Open Now
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
