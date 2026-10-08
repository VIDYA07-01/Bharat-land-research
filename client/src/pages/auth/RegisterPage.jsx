import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { INDIAN_STATES } from '../../utils/constants';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'public', organization: '', state: '', designation: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 8) e.password = 'Min 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      e.password = 'Must contain uppercase, lowercase, and number';
    }
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const { confirmPassword, ...submitData } = form;
    const result = await dispatch(registerUser(submitData));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Welcome to Bharat Land Portal.');
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center text-white font-bold">भ</div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">Bharat Land Portal</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join the national land governance research platform</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input type="text" required value={form.name} onChange={set('name')} placeholder="Dr. Priya Sharma" className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input type="email" required value={form.email} onChange={set('email')} placeholder="you@organization.in" className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={set('password')} placeholder="Min 8 chars, uppercase + number" className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? '🙈' : '👁️'}</button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="label">Confirm Password *</label>
                <input type="password" required value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat password" className={`input-field ${errors.confirmPassword ? 'border-red-400' : ''}`} />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="label">Account Role *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    value: 'public',
                    icon: '👤',
                    label: 'Public User',
                    desc: 'Browse & Explore',
                  },
                  {
                    value: 'researcher',
                    icon: '🔬',
                    label: 'Researcher / Publisher',
                    desc: 'Upload, Publish & Collaborate',
                  },
                  {
                    value: 'government',
                    icon: '🏛️',
                    label: 'Government / Administrator',
                    desc: 'Policy, Analytics & Administration',
                  },
                ].map(({ value, icon, label, desc }) => (
                  <button
                    key={value} type="button"
                    onClick={() => setForm({ ...form, role: value })}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      form.role === value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug">{label}</div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Organization</label>
                <input type="text" value={form.organization} onChange={set('organization')} placeholder="IIT Delhi, Ministry, etc." className="input-field" />
              </div>
              <div>
                <label className="label">State</label>
                <select value={form.state} onChange={set('state')} className="input-field">
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {(form.role === 'researcher' || form.role === 'government') && (
              <div>
                <label className="label">Designation</label>
                <input type="text" value={form.designation} onChange={set('designation')} placeholder="Senior Researcher, District Collector, etc." className="input-field" />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-700 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
