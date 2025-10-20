// src/pages/admin/ManageOrders.tsx
import { useEffect, useState } from 'react';
import { orderApi } from '../../api/orderApi';

export default function ManageOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    orderApi.getAll().then(response => setOrders(response.data?.data || [])).catch(() => setOrders([]));
  }, []);

  const filtered = orders.filter(o => o.id.toString().includes(search) || o.status.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-brown-900 mb-3">Orders</h2>
      <input 
        placeholder="Search orders..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        className="border border-brown-300 p-2 rounded w-full mb-4"
      />
      <div className="space-y-2">
        {filtered.map(o => (
          <div key={o.id} className="flex justify-between border p-2 rounded">
            <div>#{o.id}</div>
            <div>{o.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

