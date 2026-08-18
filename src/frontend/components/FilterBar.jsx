import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function FilterBar({ searchQuery, setSearchQuery, category, setCategory, categories }) {
  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex flex-col md:flex-row gap-4 shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search locations by name or address..."
          className="w-full !pl-10 !pr-4 !py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
        />
      </div>
      <div className="relative md:w-48">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full !pl-10 !pr-8 !py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none"
        >
          <option value="all">All Categories</option>
          {categories?.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
