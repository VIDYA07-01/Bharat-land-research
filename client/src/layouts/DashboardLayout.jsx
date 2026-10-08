import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const getSidebarLinks = (role) => {
  const common = [
    { to: '/profile', icon: '👤', label: 'Profile' },
  ];

  if (role === 'admin') return [
    { to: '/admin', icon: '🏠', label: 'Dashboard', exact: true },
    { to: '/admin/users', icon: '👥', label: 'User Management' },
    { to: '/admin/research', icon: '📄', label: 'Research' },
    { to: '/admin/datasets', icon: '💾', label: 'Datasets' },
    { to: '/admin/policies', icon: '📋', label: 'Policies' },
    { to: '/admin/case-studies', icon: '📚', label: 'Case Studies' },
    ...common,
  ];

  if (role === 'researcher') return [
    { to: '/researcher', icon: '🏠', label: 'Dashboard', exact: true },
    { to: '/researcher/upload-research', icon: '📤', label: 'Upload Research' },
    { to: '/researcher/upload-dataset', icon: '📊', label: 'Upload Dataset' },
    { to: '/researcher/my-research', icon: '📄', label: 'My Research' },
    { to: '/researcher/my-datasets', icon: '💾', label: 'My Datasets' },
    { to: '/researcher/projects', icon: '🤝', label: 'Projects' },
    { to: '/researcher/ai-tools', icon: '🤖', label: 'AI Tools' },
    ...common,
  ];

  if (role === 'government') return [
    { to: '/government', icon: '🏠', label: 'Dashboard', exact: true },
    { to: '/government/policy-performance', icon: '📈', label: 'Policy Performance' },
    { to: '/government/decision-support', icon: '🧠', label: 'Decision Support' },
    { to: '/government/simulation', icon: '🔬', label: 'Policy Simulation' },
    { to: '/government/analytics', icon: '📊', label: 'Land Analytics' },
    ...common,
  ];

  return common;
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = getSidebarLinks(user?.role);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-primary-950 text-white flex-shrink-0 transition-all duration-300 flex flex-col fixed h-full z-30`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary-800">
          {sidebarOpen && (
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">भ</div>
              <span className="font-display font-bold text-sm">Land Portal</span>
            </NavLink>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-primary-800 rounded-lg transition-colors ml-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
          </button>
        </div>

        {/* User Info */}
        {sidebarOpen && user && (
          <div className="p-4 border-b border-primary-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-primary-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {links.map(({ to, icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-700 text-white border-r-2 border-primary-400'
                    : 'text-primary-300 hover:bg-primary-800 hover:text-white'
                }`
              }
              title={!sidebarOpen ? label : ''}
            >
              <span className="text-base flex-shrink-0">{icon}</span>
              {sidebarOpen && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="p-4 border-t border-primary-800 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-2 py-2 text-sm text-primary-300 hover:text-white hover:bg-primary-800 rounded-lg transition-colors"
            title="Back to Site"
          >
            <span>🌐</span>{sidebarOpen && <span>Back to Site</span>}
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
            title="Logout"
          >
            <span>🚪</span>{sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <main className="min-h-screen p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
