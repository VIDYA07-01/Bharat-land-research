import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import researchService from '../../services/researchService';
import { INDIAN_STATES, RESEARCH_CATEGORIES, YEARS } from '../../utils/constants';

export default function UploadResearchPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', institution: '', abstract: '', methodology: '', findings: '',
    category: '', state: '', district: '', publicationYear: '',
    keywords: '', authorName: '', authorAffiliation: '',
  });
  const [file, setFile] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
    if (form.authorName) {
      formData.set('authors', JSON.stringify([{ name: form.authorName, affiliation: form.authorAffiliation }]));
    }
    if (file) formData.append('document', file);

    try {
      await researchService.create(formData);
      toast.success('Research submitted for review!');
      navigate('/researcher/my-research');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/researcher" className="text-gray-400 hover:text-gray-600">← Dashboard</Link>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Upload Research Paper</h1>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
        📋 Your submission will be reviewed by platform administrators before being published.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Basic Information</h2>

          <div>
            <label className="label">Research Title *</label>
            <input type="text" required value={form.title} onChange={set('title')} placeholder="Full title of your research paper" className="input-field" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Lead Author Name *</label>
              <input type="text" required value={form.authorName} onChange={set('authorName')} placeholder="Dr. Priya Sharma" className="input-field" />
            </div>
            <div>
              <label className="label">Author Affiliation</label>
              <input type="text" value={form.authorAffiliation} onChange={set('authorAffiliation')} placeholder="IIT Delhi" className="input-field" />
            </div>
          </div>

          <div>
            <label className="label">Institution</label>
            <input type="text" value={form.institution} onChange={set('institution')} placeholder="Organizing institution" className="input-field" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Category *</label>
              <select required value={form.category} onChange={set('category')} className="input-field">
                <option value="">Select</option>
                {RESEARCH_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
              <label className="label">Publication Year</label>
              <select value={form.publicationYear} onChange={set('publicationYear')} className="input-field">
                <option value="">Select</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Research Content</h2>
          <div>
            <label className="label">Abstract * (min 100 characters)</label>
            <textarea required rows={5} value={form.abstract} onChange={set('abstract')} placeholder="Provide a comprehensive abstract of your research..." className="input-field resize-none" minLength={100} />
          </div>
          <div>
            <label className="label">Methodology</label>
            <textarea rows={3} value={form.methodology} onChange={set('methodology')} placeholder="Research methodology used..." className="input-field resize-none" />
          </div>
          <div>
            <label className="label">Key Findings</label>
            <textarea rows={3} value={form.findings} onChange={set('findings')} placeholder="Key findings and conclusions..." className="input-field resize-none" />
          </div>
          <div>
            <label className="label">Keywords (comma-separated)</label>
            <input type="text" value={form.keywords} onChange={set('keywords')} placeholder="land use, GIS, climate, policy" className="input-field" />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Document Upload</h2>
          <div>
            <label className="label">Research Document (PDF, DOC, DOCX – max 10MB)</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-3xl mb-2">📤</div>
                {file ? (
                  <p className="text-sm font-medium text-primary-700">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link to="/researcher" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-primary py-3 px-8">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
            ) : '📤 Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
