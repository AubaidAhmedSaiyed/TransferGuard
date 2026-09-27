import React, { useState } from 'react';
import { 
  Building2, 
  SlidersHorizontal, 
  Users, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Save, 
  Key,
  Plug,
  Bell,
  UserCheck,
  Code2,
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

type SettingsTab = 
  | 'organization'
  | 'users'
  | 'approval_rules'
  | 'policies'
  | 'beneficiaries'
  | 'trusted_contacts'
  | 'notifications'
  | 'integrations'
  | 'developer'
  | 'security';

export const SettingsPage: React.FC = () => {
  const { org, updateOrg } = useAuth();
  const { navigate } = useRouter();

  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('organization');

  const [name, setName] = useState(org?.name || 'Acme Global Treasury Corp');
  const [domain, setDomain] = useState(org?.domain || 'acmeglobal.com');
  const [industry, setIndustry] = useState(org?.industry || 'Enterprise Technology & Logistics');
  const [currency, setCurrency] = useState(org?.currency || 'USD');
  const [dualControlThreshold, setDualControlThreshold] = useState(org?.dualControlThreshold || 100000);
  const [callbackThreshold, setCallbackThreshold] = useState(org?.callbackThreshold || 50000);
  const [requireBeneficiaryLock, setRequireBeneficiaryLock] = useState(org?.requireBeneficiaryLock ?? true);

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    updateOrg({
      name,
      domain,
      industry,
      currency,
      dualControlThreshold,
      callbackThreshold,
      requireBeneficiaryLock
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const navItems = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'approval_rules', label: 'Approval Rules', icon: SlidersHorizontal },
    { id: 'policies', label: 'Policies', icon: ShieldCheck },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: Layers },
    { id: 'trusted_contacts', label: 'Trusted Contacts', icon: UserCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'developer', label: 'Developer', icon: Code2 },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast */}
      {savedToast && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved and synchronized with deterministic runtime engine.</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-4.5 h-4.5 text-emerald-400" />
            <span>Workspace Settings & Governance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your organization controls, signers, policy thresholds, and infrastructure settings.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Nav */}
        <div className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'integrations') {
                    navigate('/app/integrations');
                  } else if (item.id === 'developer') {
                    navigate('/app/developer');
                  } else if (item.id === 'policies') {
                    navigate('/app/policies');
                  } else {
                    setActiveSettingsTab(item.id as any);
                  }
                }}
                className={`w-full px-3 py-2 rounded-lg text-left text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  activeSettingsTab === item.id
                    ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                    : 'text-slate-400 hover:bg-[#121826] hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Pane */}
        <div className="md:col-span-3 space-y-5">
          {/* Organization Profile */}
          {activeSettingsTab === 'organization' && (
            <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 border-b border-[#1e293b] pb-3">
                Corporate Workspace Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Organization Legal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Domain Name</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Base Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Approval Rules */}
          {(activeSettingsTab === 'approval_rules' || activeSettingsTab === 'organization') && (
            <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 border-b border-[#1e293b] pb-3 flex items-center justify-between">
                <span>Runtime Approval Rules & Thresholds</span>
                <span className="text-[10px] font-mono text-emerald-400">DETERMINISTIC</span>
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Strict Beneficiary Change Lock</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Automatically mandate telephone callback verification if coordinates differ from master record.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireBeneficiaryLock}
                    onChange={(e) => setRequireBeneficiaryLock(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b]">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Dual-Control Threshold ($)
                    </label>
                    <input
                      type="number"
                      value={dualControlThreshold}
                      onChange={(e) => setDualControlThreshold(Number(e.target.value))}
                      className="w-full bg-[#0f1523] border border-[#1e293b] rounded px-3 py-1.5 text-xs text-slate-100 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Wires exceeding this amount require two independent signers.
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b]">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Callback Verification Threshold ($)
                    </label>
                    <input
                      type="number"
                      value={callbackThreshold}
                      onChange={(e) => setCallbackThreshold(Number(e.target.value))}
                      className="w-full bg-[#0f1523] border border-[#1e293b] rounded px-3 py-1.5 text-xs text-slate-100 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Transfers above this amount enforce contact phone check.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users & Roles */}
          {activeSettingsTab === 'users' && (
            <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 border-b border-[#1e293b] pb-3">
                Authorized Signatories & Reviewers
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Lin', role: 'Head of Treasury', email: 's.lin@company.corp', level: 'Level 3 ($25M+)' },
                  { name: 'Marcus Vance', role: 'Chief Financial Officer', email: 'm.vance@company.corp', level: 'Level 3 ($25M+)' },
                  { name: 'Jonathan Miller', role: 'VP Supply Chain', email: 'j.miller@company.corp', level: 'Level 2 ($500K)' }
                ].map((u, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{u.name}</div>
                      <div className="text-slate-400 text-[11px]">{u.email} • {u.role}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161f30] text-emerald-400 border border-[#222f46]">
                      {u.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trusted Contacts */}
          {activeSettingsTab === 'trusted_contacts' && (
            <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 border-b border-[#1e293b] pb-3">
                Vendor Master Trusted Callback Directory
              </h3>
              <p className="text-xs text-slate-400">
                Authorized phone contacts used for out-of-band telephone verification.
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Acme Supplies Corp (Accounts Receivable)</div>
                    <div className="text-slate-400 text-[11px]">Contact: Robert Hayes • +1 (555) 018-4499</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Verified Master
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Security & Audit */}
          {activeSettingsTab === 'security' && (
            <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 border-b border-[#1e293b] pb-3">
                Security & Cryptographic Audit Standards
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>• Zero LLM Financial Authority: Large Language Models are mathematically isolated from approving transactions.</p>
                <p>• Immutable Audit Trail: Hash-chained operational logs recorded across all evaluations and human callbacks.</p>
                <p>• TLS 1.3 encryption for all SDK and API communications.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
