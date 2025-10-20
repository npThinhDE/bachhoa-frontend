// src/pages/admin/ManageUsers.tsx


import { useEffect, useState } from 'react';
import { userApi } from '../../api/userApi';

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userApi.list().then(d => setUsers(d)).catch(() => setUsers([]));
  }, []);

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-brown-900 mb-3">Users</h2>
      <input 
        placeholder="Search users..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        className="border border-brown-300 p-2 rounded w-full mb-4"
      />
      <div className="space-y-2">
        {filtered.map(u => (
          <div key={u.id} className="flex justify-between border p-2 rounded">
            <div>{u.name} ({u.email})</div>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800"><i className="fas fa-edit"></i></button>
              <button className="text-red-600 hover:text-red-800"><i className="fas fa-trash"></i></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
