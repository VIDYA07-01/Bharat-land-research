import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import datasetService from '../../services/datasetService';
import { INDIAN_STATES, DATASET_CATEGORIES, YEARS } from '../../utils/constants';

export default function UploadDatasetPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', organization: '', category: '',
    state: '', year: '', source: '', sourceUrl: '',
    geographicCoverage: '', dataFormat: '', license: 'Open Data Commons', tags: '',
  });
  const [file, setFile] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
    if (file) formData.append('file', file);
    try {
      await datasetService.create(formData);
      toast.success('Dataset submitted for review!');
      navigate('/researcher/my-datasets');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/researcher" className="text-gray-400 hover:text-gray-600">← Dashboard</Link>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Upload Dataset</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Dataset Information</h2>
          <div>
            <label className="label">Dataset Name *</label>
            <input type="text" required value={form.name} onChange={set('name')} placeholder="Descriptive dataset name" className="input-field" />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea required rows={4} value={form.description} onChange={set('description')} placeholder="Describe the dataset, what it contains and how it can be used..." className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Organization</label>
              <input type="text" value={form.organization} onChange={set('organization')} placeholder="Source organization" className="input-field" />
            </div>
            <div>
              <label className="label">Category *</label>
              <select required value={form.category} onChange={set('category')} className="input-field">
                <option value="">Select category</option>
                {DATASET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">State</label>
              <select value={form.state} onChange={set('state')} className="input-field">
                <option value="">National</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Data Format *</label>
              <select required value={form.dataFormat} onChange={set('dataFormat')} className="input-field">
                <option value="">Select format</option>
                {['CSV', 'JSON', 'GeoJSON', 'Shapefile', 'Excel', 'PDF', 'ZIP', 'Other'].map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Year</label>
              <select value={form.year} onChange={set('year')} className="input-field">
                <option value="">Select year</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Source</label>
              <input type="text" value={form.source} onChange={set('source')} placeholder="Data source name" className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Geographic Coverage</label>
            <input type="text" value={form.geographicCoverage} onChange={set('geographicCoverage')} placeholder="e.g., All 28 states and 8 UTs, 766 districts" className="input-field" />
          </div>
          <div>
            <label className="label">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={set('tags')} placeholder="land use, agriculture, GIS, district" className="input-field" />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">File Upload</h2>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
            <input type="file" accept=".csv,.json,.geojson,.xlsx,.xls,.zip,.pdf,.shp" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="dataset-upload" />
            <label htmlFor="dataset-upload" className="cursor-pointer">
              <div className="text-3xl mb-2">📊</div>
              {file ? (
                <p className="text-sm font-medium text-primary-700">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
              ) : (
                <>
                  <p className="text-sm text-gray-500">Click to upload dataset file</p>
                  <p className="text-xs text-gray-400 mt-1">CSV, JSON, GeoJSON, Excel, ZIP – max 10MB</p>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link to="/researcher" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-primary py-3 px-8">
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</> : '📊 Submit Dataset'}
          </button>
        </div>
      </form>
    </div>
  );
}
