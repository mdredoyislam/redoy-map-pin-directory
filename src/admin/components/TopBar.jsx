import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 relative z-50">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search locations, maps..."
            className="w-full !pl-10 !pr-4 !py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button className="text-xs text-blue-600 hover:underline">Mark all as read</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-800 font-medium">New Review Received!</p>
                  <p className="text-xs text-gray-500 mt-1">John Doe left a 5-star review on "Central Park".</p>
                  <p className="text-xs text-gray-400 mt-2">2 minutes ago</p>
                </div>
                <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-800 font-medium">Map Pin Directory Pro</p>
                  <p className="text-xs text-gray-500 mt-1">Unlock advanced analytics and custom map themes today.</p>
                  <p className="text-xs text-gray-400 mt-2">1 day ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative border-l border-gray-200 pl-4 ml-2" ref={userRef}>
          <button 
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
              A
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1">
              <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@example.com</p>
              </div>
              <Link to="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings size={16} />
                Preferences
              </Link>
              <button onClick={() => { setShowUserMenu(false); setShowProfileModal(true); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User size={16} />
                Edit Profile
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button onClick={() => { setShowUserMenu(false); toast.error('Sign out coming soon!'); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">Edit Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  A
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors bg-blue-50/50">
                  Change Avatar
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" defaultValue="admin@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                <input type="password" placeholder="Leave blank to keep current" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button onClick={() => setShowProfileModal(false)} className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => {
                  toast.success('Profile updated successfully!');
                  setShowProfileModal(false);
                }} 
                className="px-5 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
