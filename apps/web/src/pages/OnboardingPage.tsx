import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  SlidersHorizontal, 
  PhoneCall, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth, Organization } from '../context/AuthContext';

export const OnboardingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { org, completeOnboarding } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [name, setName] = useState(org?.name || 'Apex Global Industries');
  const [domain, setDomain] = useState(org?.domain || 'apexglobal.com');
  const [industry, setIndustry] = useState(org?.industry || 'Enterprise SaaS & Cloud');
  const [currency, setCurrency] = useState(org?.currency || 'USD');

  const [approvalModel, setApprovalModel] = useState<'dual_threshold' | 'universal_dual' | 'single_callback'>(
    org?.approvalModel || 'dual_threshold'
  );
  const [dualControlThreshold, setDualControlThreshold] = useState<number>(org?.dualControlThreshold || 100000);
  const [callbackThreshold, setCallbackThreshold] = useState<number>(org?.callbackThreshold || 50000);
  const [requireBeneficiaryLock, setRequireBeneficiaryLock] = useState<boolean>(
    org?.requireBeneficiaryLock !== undefined ? org.requireBeneficiaryLock : true
  );

  const [primaryApproverName, setPrimaryApproverName] = useState('Sarah Lin');
  const [primaryApproverEmail, setPrimaryApproverEmail] = useState('s.lin@apexglobal.com');
  const [primaryApproverRole, setPrimaryApproverRole] = useState('Head of Treasury Operations');

  const [secondaryApproverName, setSecondaryApproverName] = useState('Marcus Vance');
  const [secondaryApproverEmail, setSecondaryApproverEmail] = useState('m.vance@apexglobal.com');
  const [secondaryApproverRole, setSecondaryApproverRole] = useState('Chief Financial Officer');

  const handleFinish = () => {
    const orgData: Partial<Organization> = {
      name,
      domain,
      industry,
      currency,
      approvalModel,
      dualControlThreshold,
      callbackThreshold,
      requireBeneficiaryLock,
      trustedApprovers: [
        { name: primaryApproverName, email: primaryApproverEmail, role: primaryApproverRole },
        { name: secondaryApproverName, email: secondaryApproverEmail, role: secondaryApproverRole }
      ]
    };
    completeOnboarding(orgData);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/20 selection:text-emerald-200">
      <div className="max-w-3xl w-full mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-lg text-slate-100 tracking-tight">TransferGuard</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Setup Treasury Safety Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure your organization's runtime verification policies and dual-control thresholds.
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-[#1e293b] -z-0" />
            {[
              { num: 1, label: 'Basics' },
              { num: 2, label: 'Governance' },
              { num: 3, label: 'Policies' },
              { num: 4, label: 'Approvers' },
              { num: 5, label: 'Launch' }
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= s.num
                      ? 'bg-emerald-600 text-slate-950 ring-4 ring-[#090d16]'
                      : 'bg-[#161f30] text-slate-500 border border-[#1e293b]'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-[10px] font-medium text-slate-400 mt-1.5 hidden sm:block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 sm:p-8 shadow-2xl">
          {/* Step 1: Workspace Basics */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e293b] pb-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Step 1: Workspace & Organization Identity
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Define your corporate identity and baseline operational currency.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Corporate Domain
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Enterprise SaaS & Cloud">Enterprise SaaS & Cloud</option>
                    <option value="Financial Services & Fintech">Financial Services & Fintech</option>
                    <option value="Manufacturing & Supply Chain">Manufacturing & Supply Chain</option>
                    <option value="Logistics & Maritime">Logistics & Maritime</option>
                    <option value="Healthcare & Bio">Healthcare & Bio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Base Operational Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="CAD">CAD ($ - Canadian Dollar)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Governance & Dual Control */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e293b] pb-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  Step 2: Approval Governance Architecture
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure how consequential payments are authorized by treasury officers.
                </p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setApprovalModel('dual_threshold')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    approvalModel === 'dual_threshold'
                      ? 'bg-[#161f30] border-emerald-500 text-slate-100 ring-1 ring-emerald-500'
                      : 'bg-[#090d16] border-[#1e293b] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-100">
                      Dual-Control Above Threshold (Recommended)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      Industry Standard
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Payments under the threshold require single verification; transfers exceeding threshold require independent secondary sign-off.
                  </p>
                </div>

                <div
                  onClick={() => setApprovalModel('universal_dual')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    approvalModel === 'universal_dual'
                      ? 'bg-[#161f30] border-emerald-500 text-slate-100 ring-1 ring-emerald-500'
                      : 'bg-[#090d16] border-[#1e293b] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-100">
                      Universal Dual-Control (Strict)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    All outbound wire transfers require two independent treasury approvers regardless of amount.
                  </p>
                </div>

                <div
                  onClick={() => setApprovalModel('single_callback')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    approvalModel === 'single_callback'
                      ? 'bg-[#161f30] border-emerald-500 text-slate-100 ring-1 ring-emerald-500'
                      : 'bg-[#090d16] border-[#1e293b] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-100">
                      Single Approver + Out-of-Band Callback
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    A single approver can release wires provided out-of-band telephone verification is recorded for changed coordinates.
                  </p>
                </div>
              </div>

              {approvalModel === 'dual_threshold' && (
                <div className="mt-4 p-4 rounded-lg bg-[#090d16] border border-[#1e293b]">
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Dual-Control Enforcement Threshold ($)</span>
                    <span className="font-mono text-emerald-400 font-bold">${dualControlThreshold.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={dualControlThreshold}
                    onChange={(e) => setDualControlThreshold(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>$10,000</span>
                    <span>$100,000 (Default)</span>
                    <span>$1,000,000</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Policy Thresholds */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e293b] pb-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Step 3: Runtime Verification Policies
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Activate deterministic safety rules evaluated at runtime on every transaction.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                      <span>Strict Beneficiary Change Lock</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                        Critical
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Automatically place any wire on REVIEW REQUIRED if destination IBAN/Routing differs from verified vendor master record.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireBeneficiaryLock}
                    onChange={(e) => setRequireBeneficiaryLock(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 mt-1 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-100">
                      Out-of-Band Callback Verification Limit ($)
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">${callbackThreshold.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Transfers exceeding this limit require recorded phone confirmation with authorized contact before authorization.
                  </p>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={callbackThreshold}
                    onChange={(e) => setCallbackThreshold(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs text-slate-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Heuristic social engineering and urgency detection are enabled automatically across all incoming memos and invoices.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Key Approvers */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e293b] pb-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Step 4: Authorizers & Trusted Contacts
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Designate authorized signatories permitted to perform dual-control approvals and callbacks.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b] space-y-3">
                  <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                    <span>Primary Authorizer (Lead)</span>
                    <span className="text-[10px] font-mono text-emerald-400">Level 1 Signatory</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={primaryApproverName}
                      onChange={(e) => setPrimaryApproverName(e.target.value)}
                      placeholder="Full Name"
                      className="bg-[#0f1523] border border-[#1e293b] rounded px-2.5 py-1.5 text-xs text-slate-100"
                    />
                    <input
                      type="email"
                      value={primaryApproverEmail}
                      onChange={(e) => setPrimaryApproverEmail(e.target.value)}
                      placeholder="Corporate Email"
                      className="bg-[#0f1523] border border-[#1e293b] rounded px-2.5 py-1.5 text-xs text-slate-100"
                    />
                    <input
                      type="text"
                      value={primaryApproverRole}
                      onChange={(e) => setPrimaryApproverRole(e.target.value)}
                      placeholder="Role Title"
                      className="bg-[#0f1523] border border-[#1e293b] rounded px-2.5 py-1.5 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b] space-y-3">
                  <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                    <span>Secondary Authorizer (Executive)</span>
                    <span className="text-[10px] font-mono text-emerald-400">Level 2 Signatory</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={secondaryApproverName}
                      onChange={(e) => setSecondaryApproverName(e.target.value)}
                      placeholder="Full Name"
                      className="bg-[#0f1523] border border-[#1e293b] rounded px-2.5 py-1.5 text-xs text-slate-100"
                    />
                    <input
                      type="email"
                      value={secondaryApproverEmail}
                      onChange={(e) => setSecondaryApproverEmail(e.target.value)}
                      placeholder="Corporate Email"
                      className="bg-[#0f1523] border border-[#1e293b] rounded px-2.5 py-1.5 text-xs text-slate-100"
                    />
                    <input
                      type="text"
                      value={secondaryApproverRole}
                      onChange={(e) => setSecondaryApproverRole(e.target.value)}
                      placeholder="Role Title"
                      className="bg-[#0f1523] border border-[#1e293b] rounded px-2.5 py-1.5 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Connect Workflow & Launch */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e293b] pb-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Step 5: Connect Workflow & Launch Control Layer
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose how your organization will submit transfers to the TransferGuard pre-flight control layer.
                </p>
              </div>

              {/* Workflow Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'sdk', title: 'TypeScript / Node SDK', desc: '@transferguard/sdk library for backend payment services', badge: 'Recommended' },
                  { id: 'api', title: 'REST API', desc: 'Direct JSON evaluation endpoint (/api/transactions)', badge: 'Universal' },
                  { id: 'webhook', title: 'Webhook Dispatcher', desc: 'Asynchronous event triggers and callback holds', badge: 'Async' },
                  { id: 'manual', title: 'Manual Web Workflow', desc: 'Interactive console for treasury and procurement teams', badge: 'Console' }
                ].map(opt => (
                  <div key={opt.id} className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b] hover:border-emerald-500/50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-slate-100">{opt.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{opt.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1e293b]">
                  <span className="text-slate-400">Organization</span>
                  <span className="font-semibold text-slate-200">{name} ({domain})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1e293b]">
                  <span className="text-slate-400">Governance Model</span>
                  <span className="font-semibold text-emerald-400 uppercase font-mono">
                    {approvalModel.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Designated Approvers</span>
                  <span className="text-slate-200">{primaryApproverName}, {secondaryApproverName}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Your TransferGuard control layer is ready.</span>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="mt-8 pt-4 border-t border-[#1e293b] flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 rounded-md bg-[#161f30] hover:bg-[#1f2c42] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <span>Launch TransferGuard Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
