import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { loading, error, isAuthenticated, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const map = { admin: '/admin', researcher: '/researcher', government: '/government', public: '/' };
      navigate(map[user.role] || '/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@bharatlandportal.gov.in', password: 'Admin@1234' },
      researcher: { email: 'priya.sharma@iitd.ac.in', password: 'Research@1234' },
      government: { email: 'rajesh.kumar@revenue.gov.in', password: 'Govt@1234' },
      public: { email: 'user@example.com', password: 'User@1234' },
    };
    setForm(creds[role]);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex-col justify-between p-12 text-white">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">भ</div>
            <div>
              <div className="font-display font-bold text-xl">Bharat Land Portal</div>
              <div className="text-primary-300 text-sm">Research & Governance</div>
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold mb-4 leading-tight">
            National Digital Platform for Land Research & Policy Innovation
          </h1>
          <p className="text-primary-200 text-lg leading-relaxed">
            Empowering evidence-based land governance through research, geospatial intelligence, AI and collaborative innovation.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          {[['📄', '500+', 'Research Papers'], ['💾', '200+', 'Datasets'], ['📋', '100+', 'Policies'], ['🤝', '50+', 'Projects']].map(([icon, val, label]) => (
            <div key={label} className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-bold">{val}</div>
              <div className="text-primary-300 text-xs">{label}</div>
            </div>
          ))}
        </div>

        <p className="text-primary-400 text-xs">SIH26019 Prototype – Demo Data Only</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center text-white font-bold">भ</div>
              <span className="font-display font-bold text-xl text-gray-900">Bharat Land Portal</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">Sign In</h2>
            <p className="text-gray-500 text-sm mb-6">Access the national land governance platform</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Demo credentials */}
            <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-medium text-amber-700 mb-2">🔑 Demo Credentials:</p>
              <div className="flex flex-wrap gap-1.5">
                {['admin', 'researcher', 'government', 'public'].map((role) => (
                  <button key={role} onClick={() => fillDemo(role)}
                    className="px-2.5 py-1 bg-white border border-amber-300 text-amber-700 text-xs rounded-lg hover:bg-amber-50 capitalize transition-colors">
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="input-field pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing In...</>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-700 font-medium hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
