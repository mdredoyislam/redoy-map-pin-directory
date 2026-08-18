import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { confirmToast } from '../utils/confirmToast';

export default function LocationsList() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await api.get('/locations');
      setLocations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load locations', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/locations/${id}`);
      toast.success('Location deleted successfully!');
      loadLocations(); // Refresh the list
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete location');
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
        <Link 
          to={locations.length >= 5 ? "#" : "/locations/new"} 
          onClick={(e) => {
            if (locations.length >= 5) {
              e.preventDefault();
              toast.error('Location limit reached in the Free version.');
            }
          }}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
            locations.length >= 5 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} />
          Add Location
        </Link>
      </div>
      
      {!loading && (
        <div className={`border px-4 py-3 rounded-lg mb-6 flex justify-between items-center shadow-sm ${locations.length >= 5 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <div className="flex items-center gap-2 font-medium text-sm">
            <ShieldAlert size={18} className={locations.length >= 5 ? 'text-amber-600' : 'text-blue-600'} />
            <span>You are using {locations.length} / 5 available locations in the Free version.</span>
          </div>
          <Link to="/pricing" className={`text-xs px-3 py-1.5 rounded font-semibold transition-colors no-underline ${locations.length >= 5 ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : 'bg-blue-100 hover:bg-blue-200 text-blue-900'}`}>
            Upgrade for Unlimited
          </Link>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Address</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Loading locations...</td></tr>
            ) : locations.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No locations found.</td></tr>
            ) : locations.map((loc) => (
              <tr key={loc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{loc.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{loc.address}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    loc.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {loc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 text-gray-400">
                    <Link to={`/locations/${loc.id}`} className="hover:text-blue-600 transition-colors p-1"><Edit2 size={16} /></Link>
                    <button onClick={() => confirmToast('Are you sure you want to delete this location?', () => handleDelete(loc.id))} className="hover:text-red-600 transition-colors p-1"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
