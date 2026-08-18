import React, { useEffect, useState } from 'react';
import { MapPin, Map, Eye, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import UpgradeProOverlay from '../components/UpgradeProOverlay';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ locations: 124, maps: 3, views: 12050 });

  const chartData = [
    { name: 'Mon', views: 400, searches: 240 },
    { name: 'Tue', views: 300, searches: 139 },
    { name: 'Wed', views: 200, searches: 980 },
    { name: 'Thu', views: 278, searches: 390 },
    { name: 'Fri', views: 189, searches: 480 },
    { name: 'Sat', views: 239, searches: 380 },
    { name: 'Sun', views: 349, searches: 430 },
  ];

  const kpis = [
    { title: 'Total Locations', value: stats.locations, icon: <MapPin className="text-blue-500" size={24} /> },
    { title: 'Active Maps', value: stats.maps, icon: <Map className="text-emerald-500" size={24} /> },
    { title: 'Total Views', value: stats.views.toLocaleString(), icon: <Eye className="text-purple-500" size={24} /> },
    { title: 'Search Queries', value: '4,392', icon: <Search className="text-orange-500" size={24} /> },
  ];

  return (
    <div className="w-full pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your directories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
              <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Advanced Analytics (PRO) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
          <UpgradeProOverlay 
            title="Advanced Analytics" 
            description="View daily search volumes, map views, and directions clicks in beautiful charts." 
          />
          <h2 className="text-lg font-semibold text-gray-800 mb-6 opacity-40">Weekly Performance</h2>
          <div className="h-64 opacity-40 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="searches" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/locations/new" className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors group no-underline">
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Add New Location</span>
              <MapPin size={16} className="text-gray-400 group-hover:text-blue-600" />
            </Link>
            <Link to="/maps/new" className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors group no-underline">
              <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">Create New Map</span>
              <Map size={16} className="text-gray-400 group-hover:text-emerald-600" />
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
