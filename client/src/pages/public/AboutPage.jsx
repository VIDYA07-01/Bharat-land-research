import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="page-header">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-display font-bold mb-2">About the Platform</h1>
          <p className="text-primary-200">National Digital Platform for Land Research & Policy Innovation</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Problem Statement */}
        <div className="card p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🏛️</div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-1">
                SIH26019 – Problem Statement
              </h2>
              <p className="text-primary-600 dark:text-primary-400 font-medium">Smart India Hackathon 2026</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            <strong>National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance</strong> — This platform addresses the critical need for a centralized, digital ecosystem that bridges the gap between land governance research, policy formulation, and implementation in India.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            India faces significant challenges in land governance including widespread land disputes, fragmented land records, inadequate research-policy linkage, and limited use of geospatial intelligence in decision-making. This platform aims to solve these challenges through a unified digital ecosystem.
          </p>
        </div>

        {/* Mission */}
        <div className="card p-8">
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4">🎯 Platform Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Create a centralized digital platform where researchers, policymakers, government officials, academic institutions, industry experts, and public users can discover land-governance research, analyze data, collaborate, and make evidence-based decisions.
          </p>
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-xl p-4">
            <p className="text-primary-700 dark:text-primary-300 font-mono text-sm text-center font-semibold">
              DATA → RESEARCH → AI ANALYSIS → GIS → INSIGHTS → POLICY DECISION
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="card p-8">
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">⚡ Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['📄', 'Research Repository', 'Searchable database of land governance research papers'],
              ['💾', 'Dataset Repository', 'Land, climate, and geospatial datasets for analysis'],
              ['📋', 'Policy Repository', 'Government policies and legal documents'],
              ['🗺️', 'GIS Map', 'Interactive India land map with multiple data layers'],
              ['📊', 'Analytics Dashboard', 'Charts and visualizations of land use trends'],
              ['🤖', 'AI Assistant', 'AI-powered research queries and synthesis'],
              ['📚', 'Case Studies', 'Real-world land governance success stories'],
              ['🔬', 'Policy Simulation', 'Prototype policy scenario modeling tool'],
              ['🤝', 'Collaboration', 'Research project workspace for teams'],
              ['💡', 'Innovation Portal', 'Hackathons, grants, and opportunities'],
              ['🔐', 'Role-Based Access', 'Public, Researcher, Government, and Admin roles'],
              ['📱', 'Responsive Design', 'Works on desktop, tablet, and mobile'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="card p-8">
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">🛠️ Technology Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              ['⚛️', 'React.js', 'Frontend'],
              ['🟢', 'Node.js', 'Backend Runtime'],
              ['🚂', 'Express.js', 'Web Framework'],
              ['🍃', 'MongoDB', 'Database'],
              ['🔑', 'JWT + bcrypt', 'Authentication'],
              ['🗺️', 'Leaflet.js', 'GIS Maps'],
              ['📊', 'Recharts', 'Data Visualization'],
              ['🎨', 'Tailwind CSS', 'Styling'],
              ['📦', 'Multer', 'File Handling'],
              ['🔒', 'Helmet + Rate Limit', 'Security'],
              ['📚', 'Swagger', 'API Docs'],
              ['🔄', 'Redux Toolkit', 'State Management'],
            ].map(([icon, name, category]) => (
              <div key={name} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{name}</p>
                <p className="text-gray-400 text-xs">{category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Prototype Disclaimer</h3>
              <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
                This is a prototype application built for Smart India Hackathon 2026. All data, statistics, and information displayed on this platform are for demonstration purposes only and do not represent official Government of India data or policy positions. Maps and boundaries shown are illustrative and not geographically precise. AI responses are generated from demo data and should not be used for official decision-making.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="btn-primary py-3 px-8">← Back to Platform</Link>
        </div>
      </div>
    </div>
  );
}
