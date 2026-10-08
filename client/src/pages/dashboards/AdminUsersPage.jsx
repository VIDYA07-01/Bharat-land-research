import { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate, getRoleBadgeClass } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await api.get('/users', { params });
      setUsers(data.data || []);
      setTotal(data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, roleFilter]);

  const handleToggleActive = async (id, current) => {
    try {
      await api.put(`/users/${id}`, { isActive: !current });
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: !current } : u));
      toast.success(`User ${!current ? 'activated' : 'deactivated'}`);
    } catch (err) { toast.error('Failed to update user'); }
  };

  const handleChangeRole = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role } : u));
      toast.success('Role updated');
    } catch (err) { toast.error('Failed to update role'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, organization..."
            className="input-field w-64 text-sm py-2" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field w-auto text-sm py-2">
            <option value="">All Roles</option>
            {['public', 'researcher', 'government', 'admin'].map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {['Name', 'Email', 'Role', 'Organization', 'State', 'Status', 'Last Login', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-400 text-xs font-bold flex-shrink-0">
                          {u.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u._id, e.target.value)}
                        className="text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                      >
                        {['public', 'researcher', 'government', 'admin'].map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[130px] truncate">{u.organization || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{u.state || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={u.isActive ? 'badge-green' : 'badge-red'}>{u.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{u.lastLogin ? formatDate(u.lastLogin) : 'Never'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(u._id, u.isActive)}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${u.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
