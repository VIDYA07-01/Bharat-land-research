import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import { INDIAN_STATES } from '../../utils/constants';
import { formatDate, getRoleBadgeClass } from '../../utils/helpers';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', organization: user?.organization || '',
    state: user?.state || '', designation: user?.designation || '',
    bio: user?.bio || '', phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated!');
      setEditing(false);
    } else {
      toast.error('Update failed');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-primary-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={getRoleBadgeClass(user?.role)}>{user?.role}</span>
              <span className={user?.isActive ? 'badge-green' : 'badge-red'}>{user?.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Member since {formatDate(user?.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-1.5">Edit Profile</button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label">Organization</label>
                <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label">State</label>
                <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field">
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Designation</label>
                <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
              </div>
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field resize-none" placeholder="Tell us about yourself..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-sm">
            {[
              ['Organization', user?.organization],
              ['State', user?.state],
              ['Designation', user?.designation],
              ['Phone', user?.phone],
              ['Bio', user?.bio],
              ['Last Login', user?.lastLogin ? formatDate(user.lastLogin) : 'N/A'],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <span className="text-gray-500 w-28 flex-shrink-0">{label}</span>
                <span className="text-gray-800 dark:text-gray-200">{value || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
