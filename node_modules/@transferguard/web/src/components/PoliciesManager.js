import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, Sparkles, Trash2, SlidersHorizontal, Check, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';
export const PoliciesManager = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    // Natural Language Policy Generator
    const [nlPrompt, setNlPrompt] = useState('Any payment above $250,000 requires CFO approval');
    const [isProposing, setIsProposing] = useState(false);
    const [proposedPolicy, setProposedPolicy] = useState(null);
    // Manual Builder Form
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [conditionType, setConditionType] = useState('amount_threshold');
    const [thresholdAmount, setThresholdAmount] = useState(100000);
    const [requiredRole, setRequiredRole] = useState('CFO');
    const [action, setAction] = useState('VERIFY');
    const [reason, setReason] = useState('');
    const loadPolicies = async () => {
        try {
            setLoading(true);
            const data = await api.getPolicies();
            setPolicies(data);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadPolicies();
    }, []);
    const handleToggle = async (policy) => {
        try {
            const updated = await api.updatePolicy(policy.id, { enabled: !policy.enabled });
            setPolicies(policies.map(p => p.id === policy.id ? updated : p));
        }
        catch (e) {
            console.error(e);
        }
    };
    const handleDelete = async (id) => {
        try {
            await api.deletePolicy(id);
            setPolicies(policies.filter(p => p.id !== id));
        }
        catch (e) {
            console.error(e);
        }
    };
    const handleProposeNL = async () => {
        if (!nlPrompt.trim())
            return;
        setIsProposing(true);
        try {
            const candidate = await api.proposePolicy(nlPrompt);
            setProposedPolicy(candidate);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsProposing(false);
        }
    };
    const handleApproveProposed = async () => {
        if (!proposedPolicy)
            return;
        try {
            const created = await api.createPolicy(proposedPolicy);
            setPolicies([...policies, created]);
            setProposedPolicy(null);
            setNlPrompt('');
        }
        catch (e) {
            console.error(e);
        }
    };
    const handleManualCreate = async (e) => {
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
        }
        catch (e) {
            console.error(e);
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(SlidersHorizontal, { className: "w-5 h-5 text-emerald-400" }), _jsx("h1", { className: "text-xl font-bold text-slate-100", children: "Organizational Policy Rules" })] }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Deterministic governance constraints evaluated on every transaction before funds release" })] }), _jsxs("button", { onClick: () => setIsCreating(!isCreating), className: "px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-center", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "New Policy Rule" })] })] }), _jsxs("div", { className: "rounded-lg bg-[#0f1523] border border-[#1e293b] p-5 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-4 h-4 text-emerald-400" }), _jsx("h3", { className: "font-semibold text-xs uppercase tracking-wider text-slate-200", children: "Policy Rule Drafting Assistant" })] }), _jsx("span", { className: "text-[11px] text-slate-500", children: "Natural-language translation to deterministic rule schema" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2.5", children: [_jsx("input", { type: "text", value: nlPrompt, onChange: (e) => setNlPrompt(e.target.value), placeholder: "e.g. All payments above $250,000 require CFO authorization", className: "flex-1 bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" }), _jsx("button", { onClick: handleProposeNL, disabled: isProposing || !nlPrompt.trim(), className: "px-4 py-2 rounded-md bg-[#161f30] hover:bg-[#1e293b] border border-[#222f46] text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 disabled:opacity-50", children: isProposing ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), _jsx("span", { children: "Structuring Rule..." })] })) : (_jsx("span", { children: "Draft Policy Candidate" })) })] }), proposedPolicy && (_jsxs("div", { className: "p-4 rounded-md bg-[#090d16] border border-emerald-500/40 space-y-3 mt-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-semibold text-slate-200", children: "Draft Candidate Preview:" }), _jsxs("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 uppercase", children: ["Action: ", proposedPolicy.action] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs", children: [_jsxs("div", { className: "p-2.5 bg-[#0f1523] rounded border border-[#1e293b]", children: [_jsx("span", { className: "text-slate-500 text-[10px] block", children: "RULE NAME" }), _jsx("span", { className: "text-slate-200 font-medium", children: proposedPolicy.name })] }), _jsxs("div", { className: "p-2.5 bg-[#0f1523] rounded border border-[#1e293b]", children: [_jsx("span", { className: "text-slate-500 text-[10px] block", children: "CONDITION" }), _jsxs("span", { className: "text-slate-200 font-mono", children: [proposedPolicy.condition_type, " (", proposedPolicy.threshold_amount ? `$${proposedPolicy.threshold_amount.toLocaleString()} USD` : 'all', ")"] })] }), _jsxs("div", { className: "p-2.5 bg-[#0f1523] rounded border border-[#1e293b]", children: [_jsx("span", { className: "text-slate-500 text-[10px] block", children: "SIGNATORY REQUIRED" }), _jsx("span", { className: "text-slate-200 font-medium", children: proposedPolicy.required_role || 'Executive Sign-Off' })] })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [_jsx("button", { onClick: () => setProposedPolicy(null), className: "px-3 py-1.5 rounded bg-[#161f30] hover:bg-[#1e293b] text-xs text-slate-400", children: "Discard" }), _jsxs("button", { onClick: handleApproveProposed, className: "px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5", children: [_jsx(Check, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Activate Rule" })] })] })] }))] }), isCreating && (_jsxs("form", { onSubmit: handleManualCreate, className: "rounded-lg bg-[#0f1523] border border-[#1e293b] p-5 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-[#1e293b]", children: [_jsx("h3", { className: "font-semibold text-xs uppercase tracking-wider text-slate-200", children: "Manual Policy Configuration" }), _jsx("button", { type: "button", onClick: () => setIsCreating(false), className: "text-slate-400 hover:text-white text-xs", children: "Cancel" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Policy Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. High Value Transfer Sign-Off", required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Condition Type" }), _jsxs("select", { value: conditionType, onChange: (e) => setConditionType(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500", children: [_jsx("option", { value: "amount_threshold", children: "Amount Threshold Exceeded" }), _jsx("option", { value: "beneficiary_change", children: "Beneficiary Modification / Unverified Account" }), _jsx("option", { value: "new_vendor", children: "New / Unverified Vendor Entity" }), _jsx("option", { value: "unauthorized_requestor", children: "Unauthorized Requestor / Limit Exceeded" }), _jsx("option", { value: "missing_po", children: "Missing Purchase Order (> $10k)" }), _jsx("option", { value: "missing_invoice", children: "Missing Invoice Document" }), _jsx("option", { value: "bypass_attempt", children: "Policy Bypass Directive Detected" }), _jsx("option", { value: "custom", children: "Custom Rule" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Threshold Amount (USD)" }), _jsx("input", { type: "number", value: thresholdAmount, onChange: (e) => setThresholdAmount(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Required Signatory / Role" }), _jsx("input", { type: "text", value: requiredRole, onChange: (e) => setRequiredRole(e.target.value), placeholder: "e.g. CFO or VP Treasury", className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Action" }), _jsxs("select", { value: action, onChange: (e) => setAction(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold", children: [_jsx("option", { value: "VERIFY", children: "VERIFY (Targeted Verification Required)" }), _jsx("option", { value: "BLOCK", children: "BLOCK (Strict Execution Rejection)" }), _jsx("option", { value: "ALLOW", children: "ALLOW (Explicit Exemption)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Description" }), _jsx("input", { type: "text", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Operational purpose of this policy", required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: () => setIsCreating(false), className: "px-3 py-1.5 rounded-md bg-[#161f30] text-slate-300 text-xs font-medium", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs", children: "Save Policy" })] })] })), _jsxs("div", { className: "rounded-lg bg-[#0f1523] border border-[#1e293b] overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-[#1e293b] flex items-center justify-between", children: [_jsxs("h3", { className: "font-semibold text-xs uppercase tracking-wider text-slate-300", children: ["Active Governance Rules (", policies.filter(p => p.enabled).length, " of ", policies.length, " Enabled)"] }), _jsx("span", { className: "text-xs text-slate-500", children: "Real-time deterministic evaluation" })] }), _jsx("div", { className: "divide-y divide-[#1e293b]", children: policies.map((policy) => (_jsxs("div", { className: `p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${policy.enabled ? 'bg-[#0f1523] hover:bg-[#131b2c]' : 'bg-[#090d16]/60 opacity-60'}`, children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-semibold text-xs text-slate-100", children: policy.name }), _jsx("span", { className: `text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${policy.action === 'BLOCK'
                                                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                                                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'}`, children: policy.action })] }), _jsx("p", { className: "text-xs text-slate-400 leading-relaxed max-w-2xl", children: policy.description }), _jsxs("div", { className: "text-[11px] text-slate-500 font-mono pt-1", children: ["Condition: ", _jsx("span", { className: "text-slate-300", children: policy.condition_type }), policy.threshold_amount ? ` (Threshold: $${policy.threshold_amount.toLocaleString()} USD)` : ''] })] }), _jsxs("div", { className: "flex items-center gap-3 shrink-0 self-end sm:self-center", children: [_jsxs("button", { onClick: () => handleToggle(policy), className: `flex items-center gap-1.5 text-xs font-medium transition-colors ${policy.enabled ? 'text-emerald-400' : 'text-slate-600'}`, title: policy.enabled ? 'Disable Policy' : 'Enable Policy', children: [policy.enabled ? (_jsx(ToggleRight, { className: "w-6 h-6" })) : (_jsx(ToggleLeft, { className: "w-6 h-6" })), _jsx("span", { className: "text-[11px]", children: policy.enabled ? 'Active' : 'Disabled' })] }), policy.is_custom && (_jsx("button", { onClick: () => handleDelete(policy.id), className: "p-1 rounded text-slate-500 hover:text-rose-400 transition-colors", title: "Delete Custom Policy", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) }))] })] }, policy.id))) })] })] }));
};
