import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Building2, SlidersHorizontal, Users, Layers, ShieldCheck, CheckCircle2, Lock, Save, Plug, Bell, UserCheck, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
export const SettingsPage = () => {
    const { org, updateOrg } = useAuth();
    const { navigate } = useRouter();
    const [activeSettingsTab, setActiveSettingsTab] = useState('organization');
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
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto", children: [savedToast && (_jsxs("div", { className: "p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400" }), _jsx("span", { children: "Settings saved and synchronized with deterministic runtime engine." })] })), _jsxs("div", { className: "bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-base font-bold text-slate-100 flex items-center gap-2", children: [_jsx(Building2, { className: "w-4.5 h-4.5 text-emerald-400" }), _jsx("span", { children: "Workspace Settings & Governance" })] }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Manage your organization controls, signers, policy thresholds, and infrastructure settings." })] }), _jsxs("button", { onClick: handleSave, className: "px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95", children: [_jsx(Save, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Save Changes" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "space-y-1", children: navItems.map(item => {
                            const Icon = item.icon;
                            return (_jsxs("button", { onClick: () => {
                                    if (item.id === 'integrations') {
                                        navigate('/app/integrations');
                                    }
                                    else if (item.id === 'developer') {
                                        navigate('/app/developer');
                                    }
                                    else if (item.id === 'policies') {
                                        navigate('/app/policies');
                                    }
                                    else {
                                        setActiveSettingsTab(item.id);
                                    }
                                }, className: `w-full px-3 py-2 rounded-lg text-left text-xs font-medium flex items-center gap-2.5 transition-colors ${activeSettingsTab === item.id
                                    ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                                    : 'text-slate-400 hover:bg-[#121826] hover:text-slate-200'}`, children: [_jsx(Icon, { className: "w-4 h-4 text-slate-400" }), _jsx("span", { children: item.label })] }, item.id));
                        }) }), _jsxs("div", { className: "md:col-span-3 space-y-5", children: [activeSettingsTab === 'organization' && (_jsxs("div", { className: "bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 space-y-4", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-200 border-b border-[#1e293b] pb-3", children: "Corporate Workspace Profile" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-300 mb-1", children: "Organization Legal Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-300 mb-1", children: "Domain Name" }), _jsx("input", { type: "text", value: domain, onChange: (e) => setDomain(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-300 mb-1", children: "Industry Sector" }), _jsx("input", { type: "text", value: industry, onChange: (e) => setIndustry(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-300 mb-1", children: "Base Currency" }), _jsxs("select", { value: currency, onChange: (e) => setCurrency(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500", children: [_jsx("option", { value: "USD", children: "USD ($)" }), _jsx("option", { value: "EUR", children: "EUR (\u20AC)" }), _jsx("option", { value: "GBP", children: "GBP (\u00A3)" }), _jsx("option", { value: "CAD", children: "CAD ($)" })] })] })] })] })), (activeSettingsTab === 'approval_rules' || activeSettingsTab === 'organization') && (_jsxs("div", { className: "bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 space-y-4", children: [_jsxs("h3", { className: "text-sm font-semibold text-slate-200 border-b border-[#1e293b] pb-3 flex items-center justify-between", children: [_jsx("span", { children: "Runtime Approval Rules & Thresholds" }), _jsx("span", { className: "text-[10px] font-mono text-emerald-400", children: "DETERMINISTIC" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs font-semibold text-slate-200", children: "Strict Beneficiary Change Lock" }), _jsx("div", { className: "text-xs text-slate-400 mt-0.5", children: "Automatically mandate telephone callback verification if coordinates differ from master record." })] }), _jsx("input", { type: "checkbox", checked: requireBeneficiaryLock, onChange: (e) => setRequireBeneficiaryLock(e.target.checked), className: "w-4 h-4 accent-emerald-500 cursor-pointer" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 rounded-lg bg-[#090d16] border border-[#1e293b]", children: [_jsx("label", { className: "block text-xs font-medium text-slate-300 mb-1", children: "Dual-Control Threshold ($)" }), _jsx("input", { type: "number", value: dualControlThreshold, onChange: (e) => setDualControlThreshold(Number(e.target.value)), className: "w-full bg-[#0f1523] border border-[#1e293b] rounded px-3 py-1.5 text-xs text-slate-100 font-mono" }), _jsx("span", { className: "text-[10px] text-slate-500 block mt-1", children: "Wires exceeding this amount require two independent signers." })] }), _jsxs("div", { className: "p-4 rounded-lg bg-[#090d16] border border-[#1e293b]", children: [_jsx("label", { className: "block text-xs font-medium text-slate-300 mb-1", children: "Callback Verification Threshold ($)" }), _jsx("input", { type: "number", value: callbackThreshold, onChange: (e) => setCallbackThreshold(Number(e.target.value)), className: "w-full bg-[#0f1523] border border-[#1e293b] rounded px-3 py-1.5 text-xs text-slate-100 font-mono" }), _jsx("span", { className: "text-[10px] text-slate-500 block mt-1", children: "Transfers above this amount enforce contact phone check." })] })] })] })] })), activeSettingsTab === 'users' && (_jsxs("div", { className: "bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 space-y-4", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-200 border-b border-[#1e293b] pb-3", children: "Authorized Signatories & Reviewers" }), _jsx("div", { className: "space-y-3", children: [
                                            { name: 'Sarah Lin', role: 'Head of Treasury', email: 's.lin@company.corp', level: 'Level 3 ($25M+)' },
                                            { name: 'Marcus Vance', role: 'Chief Financial Officer', email: 'm.vance@company.corp', level: 'Level 3 ($25M+)' },
                                            { name: 'Jonathan Miller', role: 'VP Supply Chain', email: 'j.miller@company.corp', level: 'Level 2 ($500K)' }
                                        ].map((u, i) => (_jsxs("div", { className: "p-3 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between text-xs", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-slate-200", children: u.name }), _jsxs("div", { className: "text-slate-400 text-[11px]", children: [u.email, " \u2022 ", u.role] })] }), _jsx("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-[#161f30] text-emerald-400 border border-[#222f46]", children: u.level })] }, i))) })] })), activeSettingsTab === 'trusted_contacts' && (_jsxs("div", { className: "bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 space-y-4", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-200 border-b border-[#1e293b] pb-3", children: "Vendor Master Trusted Callback Directory" }), _jsx("p", { className: "text-xs text-slate-400", children: "Authorized phone contacts used for out-of-band telephone verification." }), _jsx("div", { className: "space-y-2 text-xs", children: _jsxs("div", { className: "p-3 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-slate-200", children: "Acme Supplies Corp (Accounts Receivable)" }), _jsx("div", { className: "text-slate-400 text-[11px]", children: "Contact: Robert Hayes \u2022 +1 (555) 018-4499" })] }), _jsx("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800", children: "Verified Master" })] }) })] })), activeSettingsTab === 'security' && (_jsxs("div", { className: "bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 space-y-4", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-200 border-b border-[#1e293b] pb-3", children: "Security & Cryptographic Audit Standards" }), _jsxs("div", { className: "space-y-3 text-xs text-slate-300 leading-relaxed", children: [_jsx("p", { children: "\u2022 Zero LLM Financial Authority: Large Language Models are mathematically isolated from approving transactions." }), _jsx("p", { children: "\u2022 Immutable Audit Trail: Hash-chained operational logs recorded across all evaluations and human callbacks." }), _jsx("p", { children: "\u2022 TLS 1.3 encryption for all SDK and API communications." })] })] }))] })] })] }));
};
