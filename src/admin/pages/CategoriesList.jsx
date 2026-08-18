import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { confirmToast } from '../utils/confirmToast';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({ id: null, name: '', color: 'bg-gray-100 text-gray-700' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.get('/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted successfully!');
      loadCategories();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete category');
    }
  };

  const openAddModal = () => {
    if (categories.length >= 3) {
      toast.error('Category limit (3) reached! Upgrade to Pro for unlimited categories.');
      return;
    }
    setModalMode('add');
    setFormData({ id: null, name: '', color: 'bg-gray-100 text-gray-700' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setModalMode('edit');
    setFormData({ id: cat.id, name: cat.name, color: cat.color });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSaving(true);
      await api.post('/categories', formData);
      toast.success(`Category ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${modalMode} category`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className={`border px-4 py-3 rounded-lg mb-6 flex justify-between items-center shadow-sm ${categories.length >= 3 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
        <div className="flex items-center gap-2 font-medium text-sm">
          <ShieldAlert size={18} className={categories.length >= 3 ? 'text-amber-600' : 'text-blue-600'} />
          <span>You are using {categories.length} / 3 available categories in the Free version.</span>
        </div>
        <Link to="/pricing" className={`text-xs px-3 py-1.5 rounded font-semibold transition-colors no-underline ${categories.length >= 3 ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : 'bg-blue-100 hover:bg-blue-200 text-blue-900'}`}>
          Upgrade for Unlimited
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Slug</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date Added</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Loading categories...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No categories found.</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${cat.color.split(' ')[0]}`}>
                      <Layers size={16} className={cat.color.split(' ')[1]} />
                    </div>
                    <span className="font-medium text-gray-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {cat.created_at ? new Date(cat.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 text-gray-400">
                    <button onClick={() => openEditModal(cat)} className="hover:text-blue-600 transition-colors p-1"><Edit2 size={16} /></button>
                    <button onClick={() => confirmToast('Are you sure you want to delete this category?', () => handleDelete(cat.id))} className="hover:text-red-600 transition-colors p-1"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">{modalMode === 'add' ? 'Add Category' : 'Edit Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" 
                  placeholder="e.g. Restaurants"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                <select 
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                >
                  <option value="bg-gray-100 text-gray-700">Gray</option>
                  <option value="bg-blue-100 text-blue-700">Blue</option>
                  <option value="bg-orange-100 text-orange-700">Orange</option>
                  <option value="bg-emerald-100 text-emerald-700">Emerald</option>
                  <option value="bg-purple-100 text-purple-700">Purple</option>
                  <option value="bg-rose-100 text-rose-700">Rose</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
