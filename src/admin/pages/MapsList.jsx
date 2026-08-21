import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, Check, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { confirmToast } from '../utils/confirmToast';

export default function MapsList() {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadMaps();
  }, []);

  const loadMaps = async () => {
    try {
      setLoading(true);
      const data = await api.get('/maps');
      setMaps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load maps');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/maps/${id}`);
      toast.success('Map deleted successfully!');
      loadMaps(); // Refresh the list
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete map');
    }
  };

  const handleCopy = (id) => {
    const textToCopy = `[redoy_mpd_map map_id="${id}"]`;
    const onSuccess = () => {
      setCopiedId(id);
      toast.success('Shortcode copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(onSuccess)
        .catch(() => fallbackCopy(textToCopy, onSuccess));
    } else {
      fallbackCopy(textToCopy, onSuccess);
    }
  };

  const fallbackCopy = (text, onSuccess) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        onSuccess();
      } else {
        toast.error('Failed to copy shortcode');
      }
    } catch (err) {
      toast.error('Failed to copy shortcode');
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Maps</h1>
        <Link 
          to={maps.length >= 5 ? "#" : "/maps/new"} 
          onClick={(e) => {
            if (maps.length >= 5) {
              e.preventDefault();
              toast.error('Map limit reached in the Free version.');
            }
          }}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
            maps.length >= 5 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} />
          Create Map
        </Link>
      </div>

      {!loading && (
        <div className={`border px-4 py-3 rounded-lg mb-6 flex justify-between items-center shadow-sm ${maps.length >= 5 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <div className="flex items-center gap-2 font-medium text-sm">
            <ShieldAlert size={18} className={maps.length >= 5 ? 'text-amber-600' : 'text-blue-600'} />
            <span>You are using {maps.length} / 5 available maps in the Free version.</span>
          </div>
          <Link to="/pricing" className={`text-xs px-3 py-1.5 rounded font-semibold transition-colors no-underline ${maps.length >= 5 ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : 'bg-blue-100 hover:bg-blue-200 text-blue-900'}`}>
            Upgrade for Unlimited
          </Link>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Map Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Shortcode</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Loading maps...</td></tr>
            ) : maps.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No maps found. Click Create Map to get started.</td></tr>
            ) : maps.map((map) => (
              <tr key={map.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{map.title}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-2 w-max">
                      <span className="text-gray-400">&lt;&gt;</span>
                      [redoy_mpd_map map_id="{map.id}"]
                    </code>
                    <button
                      onClick={() => handleCopy(map.id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                      title="Copy Shortcode"
                    >
                      {copiedId === map.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 text-gray-400">
                    <Link to={`/maps/${map.id}`} className="hover:text-blue-600 transition-colors p-1"><Edit2 size={16} /></Link>
                    <button onClick={() => confirmToast('Are you sure you want to delete this map?', () => handleDelete(map.id))} className="hover:text-red-600 transition-colors p-1"><Trash2 size={16} /></button>
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
