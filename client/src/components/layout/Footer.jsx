import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-white">
      {/* Main Footer */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                भ
              </div>
              <div>
                <div className="font-display font-bold text-base">Bharat Land Portal</div>
                <div className="text-xs text-primary-300">Research & Governance</div>
              </div>
            </div>
            <p className="text-primary-300 text-sm leading-relaxed">
              National Digital Platform for Land Research, Policy Innovation and Evidence-Based Land Governance (SIH26019).
            </p>
            <div className="mt-4 flex items-center gap-1">
              <span className="demo-badge bg-amber-900/30 border-amber-700 text-amber-300">
                🔶 Demo Prototype
              </span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2">
              {[
                ['/', 'Home'],
                ['/research', 'Research Repository'],
                ['/datasets', 'Dataset Repository'],
                ['/policies', 'Policy Documents'],
                ['/gis-map', 'GIS Land Map'],
                ['/analytics', 'Analytics Dashboard'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-primary-300 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Tools & More</h3>
            <ul className="space-y-2">
              {[
                ['/ai-assistant', 'AI Research Assistant'],
                ['/case-studies', 'Case Studies'],
                ['/innovation', 'Innovation Portal'],
                ['/simulation', 'Policy Simulation'],
                ['/search', 'Search Knowledge'],
                ['/about', 'About Platform'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-primary-300 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Information</h3>
            <div className="space-y-3 text-sm text-primary-300">
              <div className="flex items-start gap-2">
                <span>📧</span>
                <span>support@bharatlandportal.gov.in</span>
              </div>
              <div className="flex items-start gap-2">
                <span>🏛️</span>
                <span>Ministry of Rural Development, GoI</span>
              </div>
              <div className="flex items-start gap-2">
                <span>📋</span>
                <span>SIH 2026 Problem: SIH26019</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-primary-900/50 rounded-lg border border-primary-800">
              <p className="text-xs text-amber-300">
                ⚠️ This is a prototype built for Smart India Hackathon 2026. All data shown is for demonstration purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-400">
          <p>© 2026 Bharat Land Research & Governance Portal. SIH26019 Prototype.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              API Online
            </span>
            <span>Built with MERN Stack</span>
            <span>🇮🇳 Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
