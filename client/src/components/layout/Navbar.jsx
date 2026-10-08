import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleDarkMode } from '../../store/slices/uiSlice';

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/research', label: 'Research' },
  { to: '/datasets', label: 'Datasets' },
  { to: '/policies', label: 'Policies' },
  { to: '/gis-map', label: 'GIS Map' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/innovation', label: 'Innovation' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { darkMode } = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getDashboardPath = () => {
    if (!user) return '/login';
    const map = { admin: '/admin', researcher: '/researcher', government: '/government', public: '/profile' };
    return map[user.role] || '/profile';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setUserMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-2 py-1 rounded ${
      isActive
        ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
        : 'text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400'
    }`;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 shadow-sm">
      {/* Top Government Bar */}
      <div className="bg-primary-900 text-white py-1 px-4 text-xs flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span>🇮🇳</span>
          <span className="hidden sm:inline">भारत सरकार | Government of India</span>
          <span className="sm:hidden">GoI</span>
        </span>
        <span className="text-primary-200">SIH26019 – National Digital Platform for Land Governance</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              भ
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-gray-900 dark:text-white text-sm leading-tight">
                Bharat Land Portal
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Research & Governance</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <NavLink key={to} to={to} end={exact} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 text-gray-500 hover:text-primary-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-primary-800 dark:text-primary-300 max-w-[100px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <svg className={`w-3 h-3 text-primary-600 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <Link to={getDashboardPath()} onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span>🏠</span> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span>👤</span> Profile
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="xl:hidden pb-4 border-t border-gray-100 dark:border-gray-800 pt-3 animate-fade-in">
            <div className="grid grid-cols-2 gap-1">
              {NAV_LINKS.map(({ to, label, exact }) => (
                <NavLink
                  key={to} to={to} end={exact}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
