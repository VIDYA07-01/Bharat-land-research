import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatDate, getStatusBadgeClass } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { toast } from 'react-toastify';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', state: '' });
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/projects', form);
      toast.success('Project created!');
      setShowModal(false);
      setForm({ title: '', description: '', category: '', state: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    } finally { setCreating(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Research Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Collaborative research workspace</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ New Project</button>
      </div>

      {loading ? <LoadingSpinner /> : projects.length === 0 ? (
        <EmptyState icon="🤝" title="No projects yet" description="Start a research project and collaborate with other researchers."
          action={<button onClick={() => setShowModal(true)} className="btn-primary">Create Project</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <div key={p._id} className="card-hover p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{p.title}</h3>
                <span className={`flex-shrink-0 ${getStatusBadgeClass(p.status)}`}>{p.status?.replace('_', ' ')}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span>👤 {p.owner?.name} • {p.members?.length || 0} members</span>
                <span>Updated {formatDate(p.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Research Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Project Title *</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="E.g., Land Use Change Analysis in Western Ghats" className="input-field" />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is the project about?" className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Land Use, GIS, etc." className="input-field" />
            </div>
            <div>
              <label className="label">State</label>
              <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State focus" className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={creating} className="btn-primary">
              {creating ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
