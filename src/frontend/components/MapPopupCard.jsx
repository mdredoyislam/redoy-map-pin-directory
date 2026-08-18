import React from 'react';
import { MapPin, Navigation, Clock, Share2 } from 'lucide-react';

export default function MapPopupCard({ loc, variant }) {
  const mapLink = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
  const shareLink = `https://twitter.com/intent/tweet?text=Check out ${loc.title} at ${mapLink}`;

  if (variant === 'variant-a') {
    return (
      <div className="flex flex-col w-[260px] rounded-[16px] overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="h-[72px] bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <MapPin size={24} className="text-white" />
          </div>
        </div>
        <div className="bg-white -mt-3 rounded-t-[16px] p-5 relative z-10 flex flex-col">
          <h3 className="text-[18px] font-medium text-gray-900 mb-1 leading-tight">{loc.title}</h3>
          <p className="text-[13px] text-gray-500 mb-4 leading-relaxed line-clamp-2">
            {loc.description || 'No description provided.'}
          </p>
          
          <div className="w-full h-[0.5px] bg-gray-200 mb-3"></div>
          
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-start gap-2 text-[13px] text-gray-500">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span className="leading-tight">{loc.address || 'No address provided'}</span>
            </div>
            {/* Fallback for timezone, as it doesn't exist in DB yet */}
            <div className="flex items-center gap-2 text-[13px] text-gray-500">
              <Clock size={14} className="shrink-0" />
              <span>Local Time</span>
            </div>
          </div>
          
          <a 
            href={mapLink}
            target="_blank" 
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 py-[9px] px-[14px] rounded-lg text-sm font-medium transition-colors no-underline"
          >
            <Navigation size={16} />
            Get directions
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'variant-b') {
    return (
      <div className="flex flex-col w-[260px] rounded-[16px] overflow-hidden bg-white shadow-sm border border-gray-100">
        {/* Abstract Map Preview Background */}
        <div className="h-[90px] bg-[#E8F0E3] relative overflow-hidden flex items-center justify-center">
          {/* Faux map lines to look like a map preview */}
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `linear-gradient(#d1e4c9 1px, transparent 1px), linear-gradient(90deg, #d1e4c9 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
          <div className="absolute w-full h-3 bg-[#D4E2F3] top-1/2 -mt-1 transform rotate-0 opacity-70"></div>
          <div className="absolute h-full w-4 bg-[#E0E9CE] left-1/3 opacity-70"></div>
          
          {/* Faux Pin Dot */}
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm relative z-10"></div>
        </div>
        
        <div className="p-4 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-2">
            {loc.category && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[11px] font-medium border border-blue-100">
                {loc.category}
              </span>
            )}
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[11px] font-medium border border-blue-100">
              Location
            </span>
          </div>
          
          <h3 className="text-[16px] font-medium text-gray-900 leading-tight mb-1">{loc.title}</h3>
          <p className="text-[12px] text-gray-500 mb-4 line-clamp-1">
            {loc.city ? `${loc.city}, ${loc.country || ''}` : (loc.address || 'Unknown Region')}
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            <a 
              href={shareLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-2 rounded-lg text-[13px] font-medium transition-colors no-underline"
            >
              <Share2 size={14} />
              Share
            </a>
            <a 
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-lg text-[13px] font-medium transition-colors no-underline"
            >
              <Navigation size={14} />
              Directions
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to Original Style
  return (
    <div className="flex flex-col w-[260px] rounded-lg overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white">
          <MapPin size={32} opacity={0.5} />
      </div>
      
      <div className="p-4 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{loc.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{loc.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{loc.address || 'No address provided'}</span>
          </div>
        </div>
        
        <a 
          href={mapLink}
          target="_blank" 
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 rounded-lg text-sm font-medium transition-colors no-underline"
        >
          <Navigation size={16} />
          Get Directions
        </a>
      </div>
    </div>
  );
}
