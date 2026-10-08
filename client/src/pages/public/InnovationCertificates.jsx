import { Link } from 'react-router-dom';
import { DEMO_CERTIFICATES, TYPE_BADGE, TYPE_LABEL } from '../../data/innovationData';
import DemoBadge from '../../components/common/DemoBadge';

const INNO_GREEN = 'from-[#0f5c3a] via-[#1a7a4e] to-[#0d7a52]';

const POSITION_STYLE = {
  '1st Place':       'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  '2nd Place':       'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  '3rd Place':       'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Grant Recipient': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Participation':   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

function CertificateCard({ cert }) {
  return (
    <div className="card-hover overflow-hidden">
      {/* Certificate visual header */}
      <div className={`bg-gradient-to-r ${INNO_GREEN} p-6 text-white text-center space-y-2 relative`}>
        <div className="absolute top-3 right-3 opacity-20 text-6xl select-none">🏅</div>
        <p className="text-xs uppercase tracking-widest text-green-300">Certificate of Achievement</p>
        <p className="text-xs text-green-200">Demo Innovation Portal</p>
        <div className="w-14 h-14 mx-auto rounded-full bg-white/20 flex items-center justify-center text-3xl border-2 border-white/30">
          {cert.type === 'hackathon' ? '🏆' : cert.type === 'grant' ? '🌱' : '🥇'}
        </div>
        <h3 className="font-bold text-base leading-snug">{cert.title}</h3>
        <span className={`badge text-xs inline-block ${POSITION_STYLE[cert.position] || 'bg-white/20 text-white'}`}>
          {cert.position}
        </span>
      </div>

      {/* Details */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`badge text-xs ${TYPE_BADGE[cert.type]}`}>{TYPE_LABEL[cert.type]}</span>
          <span className="text-xs text-gray-400">{cert.issueDate}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{cert.description}</p>
        <p className="text-xs text-gray-400">🏛️ {cert.organization}</p>

        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex gap-2">
          <button className="flex-1 py-2 text-xs font-medium text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            📥 Download (Demo)
          </button>
          <button className="px-3 py-2 text-xs text-primary-600 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InnovationCertificates() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className={`bg-gradient-to-r ${INNO_GREEN} text-white py-10 px-4`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/innovation" className="hover:text-white">Innovation Portal</Link>
            <span>/</span>
            <span className="text-white">Results & Certificates</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold">Results & Certificates</h1>
            <DemoBadge text="Demo Data" />
          </div>
          <p className="text-green-200 text-sm mt-1">Your completed opportunities and achievement certificates.</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Certificates', value: DEMO_CERTIFICATES.length, icon: '🏅', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' },
            { label: 'Awards Won',          value: DEMO_CERTIFICATES.filter((c) => c.position.includes('Place')).length, icon: '🏆', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' },
            { label: 'Grants Received',     value: DEMO_CERTIFICATES.filter((c) => c.position === 'Grant Recipient').length, icon: '🌱', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' },
          ].map((s) => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_CERTIFICATES.map((cert) => <CertificateCard key={cert.id} cert={cert} />)}
        </div>

        <div className="card p-5 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            ⚠️ Demo Data: Certificates shown are sample records for demonstration only. They do not represent actual awards.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/innovation" className="btn-secondary text-sm">← Innovation Portal</Link>
          <Link to="/innovation/applications" className="btn-primary text-sm">📋 My Applications</Link>
        </div>
      </div>
    </div>
  );
}
