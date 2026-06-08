import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const emptyProduct = { name: '', description: '', price: '', unit: 'piece', image: '', category: '', stock: 100, isAvailable: true };

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editProduct, setEditProduct] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchData();
  }, [user]);

  const fetchData = () => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {});
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  };

  const openAdd = () => { setEditProduct(emptyProduct); setModal('add'); };
  const openEdit = (p) => {
    setEditProduct({ ...p, category: p.category?._id || p.category });
    setModal('edit');
  };

  const saveProduct = async () => {
    if (!editProduct.name || !editProduct.price || !editProduct.category) {
      toast.error('Name, price, and category are required');
      return;
    }
    setLoading(true);
    try {
      if (modal === 'add') {
        await api.post('/products', editProduct);
        toast.success('Product added!');
      } else {
        await api.put(`/products/${editProduct._id}`, editProduct);
        toast.success('Product updated!');
      }
      setModal(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Manage products and categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Products', value: products.length, icon: '📦' },
          { label: 'Categories', value: categories.length, icon: '🗂️' },
          { label: 'Available', value: products.filter(p => p.isAvailable).length, icon: '✅' },
          { label: 'Unavailable', value: products.filter(p => !p.isAvailable).length, icon: '❌' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="card overflow-x-auto">
        <div className="p-5 border-b">
          <h2 className="font-bold text-gray-800">Products</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-gray-50/50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image || `https://via.placeholder.com/40`} alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                      onError={e => e.target.src = 'https://via.placeholder.com/40'} />
                    <div>
                      <div className="font-semibold text-gray-800">{p.name}</div>
                      <div className="text-gray-400 text-xs truncate max-w-[150px]">{p.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.category?.icon} {p.category?.name}</td>
                <td className="px-4 py-3 font-semibold text-primary-600">${p.price.toFixed(2)}/{p.unit}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                    {p.isAvailable ? 'Available' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-700 font-medium text-xs px-2 py-1 bg-blue-50 rounded">Edit</button>
                    <button onClick={() => deleteProduct(p._id)} className="text-red-400 hover:text-red-600 font-medium text-xs px-2 py-1 bg-red-50 rounded">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-gray-400">No products yet. Add your first product!</div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto fade-in">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800">{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Name *</label>
                <input value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                  className="input-field" placeholder="Product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                  className="input-field resize-none h-20" placeholder="Short description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price ($) *</label>
                  <input type="number" step="0.01" value={editProduct.price}
                    onChange={e => setEditProduct({ ...editProduct, price: e.target.value })}
                    className="input-field" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Unit</label>
                  <select value={editProduct.unit} onChange={e => setEditProduct({ ...editProduct, unit: e.target.value })} className="input-field">
                    {['piece', 'kg', 'pack', 'litre', 'dozen'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category *</label>
                <select value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} className="input-field">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Image URL</label>
                <input value={editProduct.image} onChange={e => setEditProduct({ ...editProduct, image: e.target.value })}
                  className="input-field" placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="avail" checked={editProduct.isAvailable}
                  onChange={e => setEditProduct({ ...editProduct, isAvailable: e.target.checked })}
                  className="w-4 h-4 accent-primary-600" />
                <label htmlFor="avail" className="text-sm text-gray-600">Available for purchase</label>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setModal(null)} className="btn-outline">Cancel</button>
              <button onClick={saveProduct} disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? 'Saving...' : modal === 'add' ? 'Add Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}