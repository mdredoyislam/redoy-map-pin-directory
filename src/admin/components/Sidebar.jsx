import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, MapPin, Layers, Map, Settings, Star, CreditCard, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Locations', path: '/locations', icon: <MapPin size={20} /> },
  { name: 'Categories', path: '/categories', icon: <Layers size={20} /> },
  { name: 'Maps', path: '/maps', icon: <Map size={20} /> },
  { name: 'Reviews', path: '/reviews', icon: <Star size={20} /> },
  { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  { name: 'Pricing', path: '/pricing', icon: <CreditCard size={20} /> },
  { name: 'Documentation', path: '/docs', icon: <BookOpen size={20} /> },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Redoy Directory</h2>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link to="/pricing" className="block text-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium shadow hover:shadow-md transition-shadow">
          Upgrade Pro
        </Link>
      </div>
    </div>
  );
}
