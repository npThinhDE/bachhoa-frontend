// src/pages/admin/ManageProducts.tsx
import { useEffect, useState } from 'react';
import { productApi, Product } from '../../api/productApi';

export default function ManageProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState<Omit<Product, 'id'>>({ name: '', price: 0, brand: '', stock: 0 });
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Product, 'id'>>({ name: '', price: 0, brand: '', stock: 0 });

  // Load products
  const load = () => productApi.list({ take: 200 }).then(d => setItems(d)).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  // Create product
  const create = async () => {
    if (!form.name || form.price < 0 || form.stock < 0) return;
    await productApi.create({ ...form, price: Number(form.price), images: [] });
    setForm({ name: '', price: 0, brand: '', stock: 0 });
    load();
  };

  // Remove product
  const remove = async (id: string) => {
    await productApi.remove(id);
    load();
  };

  // Start editing product
  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({ name: p.name, price: p.price, brand: p.brand, stock: p.stock });
  };

  // Save edited product
  const saveEdit = async (id: string) => {
    await productApi.update(id, { ...editForm, price: Number(editForm.price) });
    setEditingId(null);
    load();
  };

  const filtered = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold text-brown-900 mb-2 md:mb-0">Products Management</h2>
        <div className="flex space-x-2 w-full md:w-auto">
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-brown-300 p-2 rounded w-full md:w-auto"
          />
          <button onClick={create} className="bg-brown-800 text-cream px-4 py-2 rounded hover:bg-brown-900 transition">
            Add Product
          </button>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="border p-2 rounded" />
        <input placeholder="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="border p-2 rounded" />
        <button onClick={create} className="bg-gold text-brown-900 px-4 py-2 rounded hover:bg-opacity-90 transition">Create</button>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="flex flex-col md:flex-row justify-between items-start md:items-center border p-2 rounded">
            {editingId === p.id ? (
              <div className="flex flex-col md:flex-row md:space-x-2 w-full md:w-auto mb-2 md:mb-0">
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="border p-2 rounded" />
                <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} className="border p-2 rounded" />
                <input value={editForm.brand} onChange={e => setEditForm({ ...editForm, brand: e.target.value })} className="border p-2 rounded" />
                <input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: Number(e.target.value) })} className="border p-2 rounded" />
              </div>
            ) : (
              <div>{p.name} - ${(p.price || 0).toFixed(2)} | {p.stock} in stock</div>
            )}

            <div className="flex space-x-2 mt-2 md:mt-0">
              {editingId === p.id ? (
                <>
                  <button onClick={() => saveEdit(p.id)} className="text-green-600 hover:text-green-800">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-800">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(p)} className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button onClick={() => remove(p.id)} className="text-red-600 hover:text-red-800">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
