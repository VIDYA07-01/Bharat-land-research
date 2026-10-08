import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { INDIAN_STATES } from '../../utils/constants';
import DemoBadge from '../../components/common/DemoBadge';

const ImpactBar = ({ label, value, maxValue = 100, color = 'blue', suffix = '' }) => {
  const pct = maxValue ? Math.min(100, (value / maxValue) * 100) : 0;
  const colors = { blue: 'bg-blue-500', green: 'bg-green-500', red: 'bg-red-500', orange: 'bg-orange-500', purple: 'bg-purple-500' };
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-800 dark:text-gray-200">{value}{suffix}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div className={`${colors[color]} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
};

const ScenarioCard = ({ scenario, color }) => {
  if (!scenario) return null;
  const r = scenario.results;
  return (
    <div className={`card p-5 border-t-4 ${color}`}>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{scenario.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{scenario.description}</p>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</span>
          <span className={`text-2xl font-bold ${r.overallScore >= 65 ? 'text-green-600' : 'text-orange-600'}`}>
            {r.overallScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${r.overallScore >= 65 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${r.overallScore}%` }}></div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Land Use */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">🌾 Land Use Impact</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{r.landUseImpact?.description}</p>
          <div className="space-y-1.5">
            <ImpactBar label="Agricultural Change (%/yr)" value={r.landUseImpact?.agriculturalChange} maxValue={5} color={r.landUseImpact?.agriculturalChange > -1.5 ? 'green' : 'red'} suffix="%/yr" />
            <ImpactBar label="Urban Growth (%/yr)" value={r.landUseImpact?.urbanGrowth} maxValue={5} color="orange" suffix="%/yr" />
          </div>
        </div>

        {/* Economic */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">💰 Economic Impact</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{r.economicImpact?.description}</p>
          <ImpactBar label="GDP Contribution (scaled)" value={r.economicImpact?.gdpContribution} maxValue={5} color="green" />
          <ImpactBar label="Investment Score" value={r.economicImpact?.investmentAttractionScore} color="blue" />
        </div>

        {/* Environmental */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">🌿 Environmental Impact</p>
          <ImpactBar label="Biodiversity Score" value={r.environmentalImpact?.biodiversityScore} color="green" />
          <ImpactBar label="Water Retention (relative)" value={Math.max(0, r.environmentalImpact?.waterRetention + 20)} color="blue" />
        </div>

        {/* Social */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">👥 Social Impact</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{r.socialImpact?.description}</p>
          <ImpactBar label="Land Access Score" value={r.socialImpact?.accessToLandScore} color="purple" />
        </div>
      </div>

      {/* Policy Changes */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-500 mb-2">📋 Policy Changes</p>
        <ul className="space-y-1">
          {scenario.policyChanges?.map((p, i) => (
            <li key={i} className="text-xs text-gray-500 flex items-start gap-1">
              <span>•</span><span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function PolicySimulationPage() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [params, setParams] = useState({
    region: '', state: '', landCategory: 'agricultural', policyType: 'land_reform',
    population: 1000000, developmentLevel: 'medium', climateRisk: 'medium', timeHorizon: 10,
  });
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');

  const set = (k) => (e) => setParams({ ...params, [k]: e.target.value });

  const runSimulation = async () => {
    if (!params.region) { alert('Please specify a region name'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/simulation/run', {
        title: title || `Simulation – ${params.region}`,
        parameters: { ...params, population: parseInt(params.population) },
      });
      setSimulation(data.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="text-5xl mb-4">🔬</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Login Required</h2>
        <p className="text-gray-500 mb-6">Please login as a researcher or government official to use the Policy Simulation tool.</p>
        <Link to="/login" className="btn-primary">Login to Access</Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Policy Simulation</h1>
        <p className="text-gray-500 mt-1">Model the impact of different land governance policies</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-4 flex gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Prototype Simulation Tool</p>
          <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">
            SIMULATION BASED ON DEMO/MODEL DATA – Not an official government prediction. Results are illustrative only and should not be used for actual policy decisions.
          </p>
        </div>
      </div>

      {/* Parameters */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Simulation Parameters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">Simulation Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Karnataka Land Reform 2026" className="input-field" />
          </div>
          <div>
            <label className="label">Region / Area *</label>
            <input type="text" value={params.region} onChange={set('region')} required placeholder="e.g., Bangalore Rural District" className="input-field" />
          </div>
          <div>
            <label className="label">State</label>
            <select value={params.state} onChange={set('state')} className="input-field">
              <option value="">Select State</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Land Category</label>
            <select value={params.landCategory} onChange={set('landCategory')} className="input-field">
              {['agricultural', 'urban', 'forest', 'mixed', 'tribal'].map((v) => (
                <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Policy Type</label>
            <select value={params.policyType} onChange={set('policyType')} className="input-field">
              {[
                ['land_reform', 'Land Reform'], ['urban_development', 'Urban Development'],
                ['forest_protection', 'Forest Protection'], ['agricultural', 'Agricultural Policy'],
                ['climate_adaptation', 'Climate Adaptation'],
              ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Population</label>
            <input type="number" value={params.population} onChange={set('population')} className="input-field" min="1000" />
          </div>
          <div>
            <label className="label">Development Level</label>
            <select value={params.developmentLevel} onChange={set('developmentLevel')} className="input-field">
              {['low', 'medium', 'high'].map((v) => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Climate Risk</label>
            <select value={params.climateRisk} onChange={set('climateRisk')} className="input-field">
              {['low', 'medium', 'high'].map((v) => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Time Horizon (Years)</label>
            <input type="number" value={params.timeHorizon} onChange={set('timeHorizon')} className="input-field" min="5" max="30" />
          </div>
        </div>

        <div className="mt-5">
          <button onClick={runSimulation} disabled={loading || !params.region} className="btn-primary py-3 px-8 text-base">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running Simulation...</>
            ) : '🔬 Run Simulation'}
          </button>
        </div>
      </div>

      {/* Results */}
      {simulation && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
              Simulation Results: {simulation.title}
            </h2>
            <DemoBadge text="Demo Results Only" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {simulation.scenarios?.map((s, i) => (
              <ScenarioCard
                key={s.name}
                scenario={s}
                color={i === 0 ? 'border-orange-400' : 'border-green-500'}
              />
            ))}
          </div>

          {simulation.scenarios?.length === 2 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">📊 Scenario Comparison</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Metric</p>
                </div>
                {simulation.scenarios.map((s) => (
                  <div key={s.name} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{s.name}</p>
                  </div>
                ))}
                {[
                  ['Overall Score', (s) => s.results.overallScore],
                  ['Investment Score', (s) => s.results.economicImpact.investmentAttractionScore],
                  ['Biodiversity Score', (s) => s.results.environmentalImpact.biodiversityScore],
                  ['Land Access Score', (s) => s.results.socialImpact.accessToLandScore],
                ].map(([label, getter]) => (
                  <>
                    <div key={`l-${label}`} className="text-sm text-gray-600 dark:text-gray-400 py-2 pl-2">{label}</div>
                    {simulation.scenarios.map((s) => {
                      const val = getter(s);
                      const other = getter(simulation.scenarios.find((o) => o.name !== s.name));
                      const better = val >= other;
                      return (
                        <div key={`${label}-${s.name}`} className={`text-center py-2 font-bold text-lg ${better ? 'text-green-600' : 'text-orange-600'}`}>
                          {val}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-center text-gray-400">
            ⚠️ {simulation.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
