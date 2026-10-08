import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

// ─── localStorage access helpers (exported for use in ResearchDetailPage) ─────
const LS_KEY       = 'researchPaperAccess';
const LS_RESET_KEY = 'researchAccessDemoReset_v1'; // bump suffix to re-trigger reset

/**
 * ONE-TIME demo reset.
 * Clears any leftover test purchase from previous sessions so the paper
 * always starts locked in the hackathon demo.
 * Runs exactly once per browser (guarded by LS_RESET_KEY).
 * Safe to call on every page mount — subsequent calls are no-ops.
 */
export function clearDemoAccessOnce() {
  if (localStorage.getItem(LS_RESET_KEY)) return; // already done
  // Wipe every key that might hold old access state
  [
    'researchPaperAccess',
    'paperAccess',
    'purchasedPapers',
    'unlockedResearch',
    'researchPurchase',
  ].forEach((k) => localStorage.removeItem(k));
  localStorage.setItem(LS_RESET_KEY, '1');
}

export function getAccessState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { type: 'none', remaining: 0, unlockedIds: [] };
    return JSON.parse(raw);
  } catch { return { type: 'none', remaining: 0, unlockedIds: [] }; }
}

/**
 * Grant access to a specific paper.
 * - Single plan  : unlocks only that paper ID, no credits.
 * - Bundle plans : unlocks the current paper + stores (papers - 1) credits for
 *                  future papers. Each new paper auto-consumes one credit.
 */
export function grantAccess(plan, paperId) {
  const current = getAccessState();
  const unlockedIds = [...new Set([...(current.unlockedIds || []), paperId].filter(Boolean))];

  const state =
    plan.papers === 1
      ? { type: 'single',                            remaining: current.remaining || 0,               unlockedIds }
      : { type: plan.papers === 5 ? 'bundle5' : 'bundle100', remaining: (current.remaining || 0) + plan.papers - 1, unlockedIds };

  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

/**
 * Check if a specific paper is accessible.
 * If the user has bundle credits and has NOT unlocked this paper yet,
 * consume one credit and unlock it automatically.
 */
export function hasAccess(paperId) {
  const state = getAccessState();
  if ((state.unlockedIds || []).includes(paperId)) return true;
  if ((state.remaining || 0) > 0) {
    localStorage.setItem(LS_KEY, JSON.stringify({
      ...state,
      remaining: state.remaining - 1,
      unlockedIds: [...new Set([...(state.unlockedIds || []), paperId])],
    }));
    return true;
  }
  return false;
}

// ─── Demo transaction store ───────────────────────────────────────────────────
export const TXN_STORE_KEY = 'demoResearchTransactions';

export function getDemoTransactions() {
  try { return JSON.parse(localStorage.getItem(TXN_STORE_KEY) || '[]'); }
  catch { return []; }
}

/**
 * Record a completed demo purchase with full 40/60 revenue split metadata.
 * Prepends newest transaction first.
 */
export function recordDemoTransaction(txnId, plan, paperId, buyerEmail) {
  const platformShare  = +(plan.price * 0.4).toFixed(2);
  const publisherShare = +(plan.price * 0.6).toFixed(2);

  const txn = {
    transactionId:       txnId,
    paperId:             paperId || 'DEMO-PAPER',
    paperTitle:          'Demo Research Paper',
    purchaserId:         `USER-${buyerEmail.replace(/\W/g, '').toUpperCase().slice(0, 8)}`,
    publisherId:         'RESEARCHER-001',
    publisherName:       'Demo Researcher / Publisher',
    buyerEmail,
    planId:              plan.id,
    planLabel:           plan.label,
    totalAmount:         plan.price,
    platformShare,
    publisherShare,
    platformPercentage:  40,
    publisherPercentage: 60,
    status:              'SUCCESS',
    paymentType:         'DEMO',
    timestamp:           new Date().toISOString(),
  };

  const existing = getDemoTransactions();
  localStorage.setItem(TXN_STORE_KEY, JSON.stringify([txn, ...existing]));
  return txn;
}
const PLANS = [
  { id: 'single',    label: '1 Research Paper',    papers: 1,   price: 10, saving: null,       highlight: false, description: 'Access 1 specific research paper' },
  { id: 'bundle5',   label: '5 Research Papers',   papers: 5,   price: 30, saving: 'Save $20', highlight: true,  description: 'Access any 5 separate research papers' },
  { id: 'bundle100', label: '100 Research Papers', papers: 100, price: 50, saving: 'Save $950', highlight: false, description: 'Access any 100 separate research papers' },
];

// ─── Demo transaction ID ──────────────────────────────────────────────────────
function genTxnId() {
  const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const s = (n) => Array.from({ length: n }, () => c[Math.floor(Math.random() * c.length)]).join('');
  return `BLP-${s(4)}-${s(6)}-${s(4)}`;
}

// ─── Form validation ──────────────────────────────────────────────────────────
function validate(form) {
  const err = {};
  if (!form.name.trim())  err.name  = 'Full name is required.';
  if (!form.email.trim()) err.email = 'Email address is required.';
  else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Enter a valid email address.';

  if (form.method === 'card') {
    const digits = form.cardNumber.replace(/\s/g, '');
    if (!digits || digits.length < 13) err.cardNumber = 'Enter a valid card number.';
    if (!form.expiry.trim())           err.expiry     = 'Expiry is required (MM/YY).';
    else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) err.expiry = 'Format: MM/YY';
    if (!form.cvv.trim() || form.cvv.length < 3)  err.cvv    = 'Enter a valid CVV.';
    if (!form.cardName.trim())         err.cardName   = 'Name on card is required.';
  }
  if (form.method === 'upi') {
    if (!form.upiId.trim())          err.upiId = 'UPI ID is required.';
    else if (!form.upiId.includes('@')) err.upiId = 'Enter a valid UPI ID (e.g. name@bank)';
  }
  return err;
}

// ─── Small field wrapper ──────────────────────────────────────────────────────
function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ResearchPaymentPage() {
  const location   = useLocation();
  const navigate   = useNavigate();

  const initPlanId = location.state?.planId   || 'single';
  const paperId    = location.state?.paperId  || null;
  const returnPath = location.state?.returnPath || '/research';

  const [selectedPlan, setSelectedPlan] = useState(() => PLANS.find((p) => p.id === initPlanId) || PLANS[0]);
  const [form, setForm] = useState({ name: '', email: '', method: 'card', cardNumber: '', expiry: '', cvv: '', cardName: '', upiId: '' });
  const [errors,  setErrors]  = useState({});
  const [stage,   setStage]   = useState('form');   // form | processing | success
  const [txnId,   setTxnId]   = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const set = (field) => (e) => {
    let val = e.target.value;
    if (field === 'cardNumber') val = val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    if (field === 'expiry')     { val = val.replace(/\D/g, '').slice(0, 4); if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2); }
    if (field === 'cvv')        val = val.replace(/\D/g, '').slice(0, 4);
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => { const e = { ...p }; delete e[field]; return e; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStage('processing');
    await new Promise((r) => setTimeout(r, 1600));
    const id = genTxnId();
    setTxnId(id);
    grantAccess(selectedPlan, paperId);
    recordDemoTransaction(id, selectedPlan, paperId, form.email);
    setStage('success');
  };

  // ── SUCCESS SCREEN ──────────────────────────────────────────────────────────
  if (stage === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-8 text-center text-white">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 text-4xl">✓</div>
              <h2 className="text-2xl font-bold">Payment Successful</h2>
              <p className="mt-2 text-emerald-100 text-sm">Your research paper access has been activated.</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Transaction details */}
              <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedPlan.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">${selectedPlan.price}</span>
                </div>
                {selectedPlan.papers > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Credits</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      1 used · {selectedPlan.papers - 1} remaining
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-xs font-semibold text-primary-700 dark:text-primary-400">{txnId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[180px]">{form.email}</span>
                </div>
              </div>

              {/* Revenue split */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">💰 Revenue Distribution</p>
                </div>
                <div className="px-4 pt-4 pb-2">
                  <div className="flex h-5 rounded-full overflow-hidden w-full">
                    <div className="bg-primary-600 flex items-center justify-center text-[10px] font-bold text-white" style={{ width: '40%' }}>40%</div>
                    <div className="bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white" style={{ width: '60%' }}>60%</div>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                    <span>Platform share</span>
                    <span>Researcher / Publisher share</span>
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-2.5">
                  {/* Platform row */}
                  <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-base flex-shrink-0">🏛️</div>
                      <div>
                        <p className="text-sm font-semibold text-primary-800 dark:text-primary-200">Bharat Land Platform</p>
                        <p className="text-xs text-primary-500 dark:text-primary-400">Infrastructure · Services</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-black text-primary-700 dark:text-primary-300">${(selectedPlan.price * 0.4).toFixed(2)}</p>
                      <p className="text-[10px] text-primary-400 font-semibold">40%</p>
                    </div>
                  </div>
                  {/* Publisher row */}
                  <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-base flex-shrink-0">👩‍🔬</div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Researcher / Publisher</p>
                        <p className="text-xs text-emerald-500 dark:text-emerald-400">Direct payout · Research contribution</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">${(selectedPlan.price * 0.6).toFixed(2)}</p>
                      <p className="text-[10px] text-emerald-400 font-semibold">60%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo label */}
              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-300 text-center">
                🔬 Demo transaction — no real money has been transferred. Hackathon Prototype only.
              </div>

              <button onClick={() => navigate(returnPath, { state: { unlocked: true } })}
                className="btn-primary w-full justify-center text-base font-bold py-3">
                📄 Read Full Paper →
              </button>
              <Link to="/research" className="block text-center text-sm text-gray-500 hover:text-primary-600 transition-colors">
                ← Back to Research Repository
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── PROCESSING SCREEN ───────────────────────────────────────────────────────
  if (stage === 'processing') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-full border-4 border-primary-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-lg font-semibold text-gray-800 dark:text-white">Processing Payment…</p>
          <p className="text-sm text-gray-500">Please wait. Do not close this page.</p>
          <p className="text-xs text-amber-600 dark:text-amber-400">🔬 Demo Payment – Hackathon Prototype</p>
        </div>
      </div>
    );
  }

  // ── PAYMENT FORM ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-screen-lg mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link><span>/</span>
          <Link to="/research" className="hover:text-primary-600">Research</Link><span>/</span>
          <span className="text-gray-800 dark:text-gray-200">Complete Purchase</span>
        </div>

        {/* Demo banner */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
          <span className="text-lg flex-shrink-0">🔬</span>
          <span><strong>Hackathon Prototype – Demo Payment.</strong> No real transaction will be processed. Do not enter real card details.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: form ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Your Purchase</h1>
              <p className="text-sm text-gray-500 mt-1">Research Paper Access · Bharat Land Portal</p>
            </div>

            {/* Plan selector */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Selected Plan</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {PLANS.map((plan) => (
                  <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan)}
                    className={`relative text-left rounded-xl border-2 p-4 transition-all ${
                      selectedPlan.id === plan.id
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}>
                    {plan.highlight && (
                      <span className="absolute -top-2.5 left-3 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">POPULAR</span>
                    )}
                    {plan.saving && (
                      <span className="absolute -top-2.5 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{plan.saving}</span>
                    )}
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{plan.label}</p>
                    <p className="text-2xl font-black text-primary-700 dark:text-primary-400 mt-1">${plan.price}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{plan.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Customer info */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">Customer Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" id="name" error={errors.name}>
                    <input id="name" type="text" value={form.name} onChange={set('name')}
                      placeholder="Your full name" autoComplete="name"
                      className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
                  </Field>
                  <Field label="Email Address" id="email" error={errors.email}>
                    <input id="email" type="email" value={form.email} onChange={set('email')}
                      placeholder="your@email.com" autoComplete="email"
                      className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
                  </Field>
                </div>
              </div>

              {/* Payment method */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-4 mt-6">
                <h2 className="font-semibold text-gray-900 dark:text-white">Payment Method</h2>
                <div className="flex gap-3">
                  {[{ key:'card', label:'💳 Card' }, { key:'upi', label:'📱 UPI' }, { key:'paypal', label:'🅿️ PayPal' }].map((m) => (
                    <button key={m.key} type="button"
                      onClick={() => { setForm((p) => ({ ...p, method: m.key })); setErrors({}); }}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                        form.method === m.key
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
                      }`}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {form.method === 'card' && (
                  <div className="space-y-4">
                    <Field label="Card Number" id="cardNumber" error={errors.cardNumber}>
                      <input id="cardNumber" type="text" value={form.cardNumber} onChange={set('cardNumber')}
                        placeholder="1234 5678 9012 3456" inputMode="numeric"
                        className={`input-field font-mono ${errors.cardNumber ? 'border-red-400' : ''}`} />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Expiry (MM/YY)" id="expiry" error={errors.expiry}>
                        <input id="expiry" type="text" value={form.expiry} onChange={set('expiry')}
                          placeholder="MM/YY" inputMode="numeric"
                          className={`input-field ${errors.expiry ? 'border-red-400' : ''}`} />
                      </Field>
                      <Field label="CVV" id="cvv" error={errors.cvv}>
                        <input id="cvv" type="password" value={form.cvv} onChange={set('cvv')}
                          placeholder="•••" maxLength={4}
                          className={`input-field ${errors.cvv ? 'border-red-400' : ''}`} />
                      </Field>
                      <Field label="Name on Card" id="cardName" error={errors.cardName}>
                        <input id="cardName" type="text" value={form.cardName} onChange={set('cardName')}
                          placeholder="As on card"
                          className={`input-field ${errors.cardName ? 'border-red-400' : ''}`} />
                      </Field>
                    </div>
                  </div>
                )}

                {form.method === 'upi' && (
                  <Field label="UPI ID" id="upiId" error={errors.upiId}>
                    <input id="upiId" type="text" value={form.upiId} onChange={set('upiId')}
                      placeholder="yourname@bank"
                      className={`input-field ${errors.upiId ? 'border-red-400' : ''}`} />
                  </Field>
                )}

                {form.method === 'paypal' && (
                  <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 text-sm text-blue-700 dark:text-blue-300 text-center">
                    <p className="text-lg mb-1">🅿️</p>
                    <p className="font-semibold">PayPal Demo Mode</p>
                    <p className="text-xs mt-1">Click "Pay Securely" to simulate a PayPal payment.</p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="mt-6 space-y-3">
                <button type="submit" className="btn-primary w-full justify-center py-4 text-base font-bold rounded-xl">
                  🔒 Pay Securely — ${selectedPlan.price}
                </button>
                <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                  <span>🔒</span>
                  <span>Secure Demo Payment · Your information is protected · Hackathon Prototype</span>
                </p>
              </div>
            </form>
          </div>

          {/* ── RIGHT: order summary ────────────────────────────── */}
          <div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm sticky top-5 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedPlan.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Papers</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{selectedPlan.papers === 100 ? 'Up to 100' : selectedPlan.papers}</span>
                </div>
                {selectedPlan.saving && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-xs">
                    <span>Savings</span>
                    <span className="font-semibold">{selectedPlan.saving}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between text-base font-bold">
                  <span className="text-gray-800 dark:text-white">Total</span>
                  <span className="text-primary-700 dark:text-primary-400">${selectedPlan.price}</span>
                </div>
              </div>

              <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-4 space-y-2 text-xs text-primary-700 dark:text-primary-300">
                <p className="font-semibold">🔒 What you get:</p>
                <ul className="space-y-1 pl-4">
                  {selectedPlan.papers === 1   && <li>✓ Full access to this 1 research paper only</li>}
                  {selectedPlan.papers === 5   && <><li>✓ Credits to unlock any 5 separate papers</li><li>✓ Each paper unlocked on first open</li></>}
                  {selectedPlan.papers === 100 && <><li>✓ Credits to unlock any 100 papers</li><li>✓ Each paper unlocked on first open</li><li>✓ Best value for researchers</li></>}
                  <li>✓ Full methodology, findings & conclusions</li>
                  <li>✓ Policy recommendations section</li>
                  <li>✓ Immediate access after payment</li>
                </ul>
              </div>

              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-[11px] text-amber-800 dark:text-amber-300">
                🔬 DEMO / Hackathon Prototype · No real payment · No real data stored.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
