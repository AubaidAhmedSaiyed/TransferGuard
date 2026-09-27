import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  SlidersHorizontal,
  Check,
  ToggleLeft,
  ToggleRight,
  Loader2
} from 'lucide-react';
import { PolicyRule } from '@transferguard/types';
import { api } from '../services/api';

export const PoliciesManager: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Natural Language Policy Generator
  const [nlPrompt, setNlPrompt] = useState('Any payment above $250,000 requires CFO approval');
  const [isProposing, setIsProposing] = useState(false);
  const [proposedPolicy, setProposedPolicy] = useState<Partial<PolicyRule> | null>(null);

  // Manual Builder Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [conditionType, setConditionType] = useState<PolicyRule['condition_type']>('amount_threshold');
  const [thresholdAmount, setThresholdAmount] = useState<number | string>(100000);
  const [requiredRole, setRequiredRole] = useState('CFO');
  const [action, setAction] = useState<'VERIFY' | 'BLOCK' | 'ALLOW'>('VERIFY');
  const [reason, setReason] = useState('');

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await api.getPolicies();
      setPolicies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const handleToggle = async (policy: PolicyRule) => {
    try {
      const updated = await api.updatePolicy(policy.id, { enabled: !policy.enabled });
      setPolicies(policies.map(p => p.id === policy.id ? updated : p));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deletePolicy(id);
      setPolicies(policies.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleProposeNL = async () => {
    if (!nlPrompt.trim()) return;
    setIsProposing(true);
    try {
      const candidate = await api.proposePolicy(nlPrompt);
      setProposedPolicy(candidate);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProposing(false);
    }
  };

  const handleApproveProposed = async () => {
    if (!proposedPolicy) return;
    try {
      const created = await api.createPolicy(proposedPolicy);
      setPolicies([...policies, created]);
      setProposedPolicy(null);
      setNlPrompt('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleManualCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createPolicy({
        name,
        description,
        condition_type: conditionType,
        threshold_amount: thresholdAmount ? Number(thresholdAmount) : undefined,
        required_role: requiredRole,
        action,
        reason: reason || description,
        enabled: true,
        is_custom: true
      });
      setPolicies([...policies, created]);
      setIsCreating(false);
      setName('');
      setDescription('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-100">Organizational Policy Rules</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic governance constraints evaluated on every transaction before funds release
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Policy Rule</span>
        </button>
      </div>

      {/* Natural Language Rule Assistant (Calm, structured) */}
      <div className="rounded-lg bg-[#0f1523] border border-[#1e293b] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-200">
              Policy Rule Drafting Assistant
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Natural-language translation to deterministic rule schema
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={nlPrompt}
            onChange={(e) => setNlPrompt(e.target.value)}
            placeholder="e.g. All payments above $250,000 require CFO authorization"
            className="flex-1 bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={handleProposeNL}
            disabled={isProposing || !nlPrompt.trim()}
            className="px-4 py-2 rounded-md bg-[#161f30] hover:bg-[#1e293b] border border-[#222f46] text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
          >
            {isProposing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Structuring Rule...</span>
              </>
            ) : (
              <span>Draft Policy Candidate</span>
            )}
          </button>
        </div>

        {/* Proposed Candidate */}
        {proposedPolicy && (
          <div className="p-4 rounded-md bg-[#090d16] border border-emerald-500/40 space-y-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Draft Candidate Preview:
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 uppercase">
                Action: {proposedPolicy.action}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-[#0f1523] rounded border border-[#1e293b]">
                <span className="text-slate-500 text-[10px] block">RULE NAME</span>
                <span className="text-slate-200 font-medium">{proposedPolicy.name}</span>
              </div>
              <div className="p-2.5 bg-[#0f1523] rounded border border-[#1e293b]">
                <span className="text-slate-500 text-[10px] block">CONDITION</span>
                <span className="text-slate-200 font-mono">{proposedPolicy.condition_type} ({proposedPolicy.threshold_amount ? `$${proposedPolicy.threshold_amount.toLocaleString()} USD` : 'all'})</span>
              </div>
              <div className="p-2.5 bg-[#0f1523] rounded border border-[#1e293b]">
                <span className="text-slate-500 text-[10px] block">SIGNATORY REQUIRED</span>
                <span className="text-slate-200 font-medium">{proposedPolicy.required_role || 'Executive Sign-Off'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setProposedPolicy(null)}
                className="px-3 py-1.5 rounded bg-[#161f30] hover:bg-[#1e293b] text-xs text-slate-400"
              >
                Discard
              </button>
              <button
                onClick={handleApproveProposed}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Activate Rule</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Form (Drawer) */}
      {isCreating && (
        <form onSubmit={handleManualCreate} className="rounded-lg bg-[#0f1523] border border-[#1e293b] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-200">
              Manual Policy Configuration
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Policy Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. High Value Transfer Sign-Off"
                required
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Condition Type</label>
              <select
                value={conditionType}
                onChange={(e: any) => setConditionType(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="amount_threshold">Amount Threshold Exceeded</option>
                <option value="beneficiary_change">Beneficiary Modification / Unverified Account</option>
                <option value="new_vendor">New / Unverified Vendor Entity</option>
                <option value="unauthorized_requestor">Unauthorized Requestor / Limit Exceeded</option>
                <option value="missing_po">Missing Purchase Order (&gt; $10k)</option>
                <option value="missing_invoice">Missing Invoice Document</option>
                <option value="bypass_attempt">Policy Bypass Directive Detected</option>
                <option value="custom">Custom Rule</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Threshold Amount (USD)</label>
              <input
                type="number"
                value={thresholdAmount}
                onChange={(e) => setThresholdAmount(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Required Signatory / Role</label>
              <input
                type="text"
                value={requiredRole}
                onChange={(e) => setRequiredRole(e.target.value)}
                placeholder="e.g. CFO or VP Treasury"
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Action</label>
              <select
                value={action}
                onChange={(e: any) => setAction(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="VERIFY">VERIFY (Targeted Verification Required)</option>
                <option value="BLOCK">BLOCK (Strict Execution Rejection)</option>
                <option value="ALLOW">ALLOW (Explicit Exemption)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Operational purpose of this policy"
                required
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-md bg-[#161f30] text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs"
            >
              Save Policy
            </button>
          </div>
        </form>
      )}

      {/* Policies Table */}
      <div className="rounded-lg bg-[#0f1523] border border-[#1e293b] overflow-hidden">
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-300">
            Active Governance Rules ({policies.filter(p => p.enabled).length} of {policies.length} Enabled)
          </h3>
          <span className="text-xs text-slate-500">
            Real-time deterministic evaluation
          </span>
        </div>

        <div className="divide-y divide-[#1e293b]">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                policy.enabled ? 'bg-[#0f1523] hover:bg-[#131b2c]' : 'bg-[#090d16]/60 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-xs text-slate-100">{policy.name}</h4>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                    policy.action === 'BLOCK'
                      ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                  }`}>
                    {policy.action}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  {policy.description}
                </p>
                <div className="text-[11px] text-slate-500 font-mono pt-1">
                  Condition: <span className="text-slate-300">{policy.condition_type}</span>
                  {policy.threshold_amount ? ` (Threshold: $${policy.threshold_amount.toLocaleString()} USD)` : ''}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleToggle(policy)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    policy.enabled ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                  title={policy.enabled ? 'Disable Policy' : 'Enable Policy'}
                >
                  {policy.enabled ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                  <span className="text-[11px]">{policy.enabled ? 'Active' : 'Disabled'}</span>
                </button>

                {policy.is_custom && (
                  <button
                    onClick={() => handleDelete(policy.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete Custom Policy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
