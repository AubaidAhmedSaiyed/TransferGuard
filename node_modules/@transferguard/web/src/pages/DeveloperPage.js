import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Terminal, Key, Webhook, Copy, Check, Play, CheckCircle2, AlertTriangle, XCircle, FileCode2 } from 'lucide-react';
import { api } from '../services/api';
export const DeveloperPage = () => {
    const [copiedInstall, setCopiedInstall] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    // Live Sandbox Testing state
    const [simAmount, setSimAmount] = useState(480000);
    const [simVendor, setSimVendor] = useState('Acme Supplies Corp');
    const [simAccount, setSimAccount] = useState('****9174');
    const [simRunning, setSimRunning] = useState(false);
    const [simResult, setSimResult] = useState(null);
    const apiKey = 'tg_live_sandbox_99a8b1c4e2f7';
    const webhookSecret = 'tg_whsec_77b319e048a1c9';
    const copyInstall = () => {
        navigator.clipboard.writeText('npm install @transferguard/sdk');
        setCopiedInstall(true);
        setTimeout(() => setCopiedInstall(false), 2000);
    };
    const copyKey = () => {
        navigator.clipboard.writeText(apiKey);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };
    const copySnippet = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };
    const handleTestEvaluate = async () => {
        try {
            setSimRunning(true);
            const res = await api.createTransaction({
                vendor_name: simVendor,
                amount: Number(simAmount),
                currency: 'USD',
                beneficiary_account_masked: simAccount,
                purpose: 'Developer API evaluation test'
            });
            setSimResult({
                status: res.evaluation.decision,
                reason: res.evaluation.summary || res.evaluation.headline,
                controls: res.evaluation.applied_policies.map(p => ({
                    id: p.policy_id,
                    name: p.policy_name,
                    passed: p.passed,
                    reason: p.reason
                })),
                evidence: res.evidences.map(e => ({
                    type: e.type,
                    title: e.title,
                    status: e.status
                })),
                requiredActions: res.evaluation.required_actions.map(a => ({
                    type: a.type,
                    label: a.label,
                    instruction: a.instruction
                })),
                auditId: res.payment.id,
                transferId: res.payment.tx_code,
                evaluatedAt: res.evaluation.evaluated_at
            });
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setSimRunning(false);
        }
    };
    const tsCode = `import { TransferGuard } from "@transferguard/sdk";

const guard = new TransferGuard({
  apiKey: process.env.TRANSFERGUARD_API_KEY,
  endpoint: process.env.TRANSFERGUARD_URL
});

// Evaluate transfer before triggering your payment system (PayPal, Stripe, Bank API)
const decision = await guard.evaluate({
  amount: 480000,
  currency: "USD",
  beneficiary: {
    name: "Acme Supplies Corp",
    account: "****9174"
  },
  requester: { id: "user_123" },
  purpose: "Invoice INV-8841"
});

if (decision.status === "BLOCK") {
  // Stop existing payment workflow
  abortPaymentWorkflow(decision.reason);
}

if (decision.status === "VERIFY") {
  // Pause workflow and require human action
  holdPaymentForVerification(decision.requiredActions);
}

if (decision.status === "ALLOW") {
  // Continue existing payment workflow
  await stripe.transfers.create({ ... });
}`;
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto", children: [_jsxs("div", { className: "bg-gradient-to-r from-[#0f172a]/90 via-[#0d1627]/80 to-[#0a101d]/90 border border-slate-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h2", { className: "text-base font-bold text-slate-100", children: "Developer Platform & SDK" }), _jsx("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30", children: "v1.0.0 Ready" })] }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Integrate TransferGuard into your payment workflow without replacing your existing payment infrastructure." })] }), _jsxs("button", { onClick: copyInstall, className: "px-3.5 py-1.5 rounded-lg bg-[#141d2e] hover:bg-[#1a263d] text-slate-300 border border-[#22314d] text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm", children: [copiedInstall ? _jsx(Check, { className: "w-3.5 h-3.5 text-emerald-400" }) : _jsx(Terminal, { className: "w-3.5 h-3.5" }), _jsx("span", { children: copiedInstall ? 'Copied' : 'npm install @transferguard/sdk' })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-5 rounded-2xl bg-atmospheric-card border border-slate-800/80 space-y-3 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-xs font-semibold text-slate-200 flex items-center gap-1.5", children: [_jsx(Key, { className: "w-3.5 h-3.5 text-emerald-400" }), " API Key (Sandbox)"] }), _jsx("span", { className: "text-[10px] font-mono text-slate-500", children: "Bearer Auth" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", readOnly: true, value: apiKey, className: "flex-1 bg-[#070b14] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono" }), _jsx("button", { onClick: copyKey, className: "p-1.5 rounded-lg bg-[#162035] hover:bg-[#1f2c47] text-slate-300 border border-slate-700/60 text-xs transition-colors", children: copiedKey ? _jsx(Check, { className: "w-3.5 h-3.5 text-emerald-400" }) : _jsx(Copy, { className: "w-3.5 h-3.5" }) })] })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-atmospheric-card border border-slate-800/80 space-y-3 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-xs font-semibold text-slate-200 flex items-center gap-1.5", children: [_jsx(Webhook, { className: "w-3.5 h-3.5 text-blue-400" }), " Webhook Signing Secret"] }), _jsx("span", { className: "text-[10px] font-mono text-slate-500", children: "HMAC SHA-256" })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("input", { type: "text", readOnly: true, value: webhookSecret, className: "flex-1 bg-[#070b14] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-400 font-mono" }) })] })] }), _jsxs("div", { className: "rounded-2xl bg-atmospheric-card border border-slate-800/80 overflow-hidden shadow-2xl", children: [_jsxs("div", { className: "p-3.5 bg-gradient-to-r from-[#0c1222] to-[#090d18] border-b border-[#1e293b] flex items-center justify-between text-xs", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileCode2, { className: "w-4 h-4 text-emerald-400" }), _jsx("span", { className: "font-mono text-slate-300 text-xs font-semibold", children: "SDK Integration Example (TypeScript / Node.js)" })] }), _jsxs("button", { onClick: () => copySnippet(tsCode), className: "px-2.5 py-1 rounded bg-[#162035] hover:bg-[#1f2c47] text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-colors border border-slate-700/60", children: [copiedCode ? _jsx(Check, { className: "w-3 h-3 text-emerald-400" }) : _jsx(Copy, { className: "w-3 h-3" }), _jsx("span", { children: copiedCode ? 'Copied' : 'Copy Code' })] })] }), _jsx("pre", { className: "p-5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed bg-[#060910]", children: _jsx("code", { children: tsCode }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 rounded-xl bg-gradient-to-b from-[#0f1c1a] to-[#0a1212] border border-emerald-900/40 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono uppercase mb-1.5", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), " ALLOW"] }), _jsx("p", { className: "text-xs text-slate-300 leading-relaxed", children: "All policy rules passed. Supporting evidence is reconciled. Continue with host payment execution." })] }), _jsxs("div", { className: "p-4 rounded-xl bg-gradient-to-b from-[#181512] to-[#0e0d0c] border border-amber-900/40 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase mb-1.5", children: [_jsx(AlertTriangle, { className: "w-4 h-4" }), " VERIFY"] }), _jsx("p", { className: "text-xs text-slate-300 leading-relaxed", children: "Beneficiary modified or dual-control threshold exceeded. Pause workflow and request human verification." })] }), _jsxs("div", { className: "p-4 rounded-xl bg-gradient-to-b from-[#1c0f13] to-[#110a0c] border border-rose-900/40 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-rose-400 font-mono uppercase mb-1.5", children: [_jsx(XCircle, { className: "w-4 h-4" }), " BLOCK"] }), _jsx("p", { className: "text-xs text-slate-300 leading-relaxed", children: "Critical violation or unresolvable conflict detected. Abort workflow and do not execute payment." })] })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-atmospheric-card border border-slate-800/80 space-y-4 shadow-sm", children: [_jsxs("h3", { className: "text-sm font-semibold text-slate-200 border-b border-slate-800/80 pb-3 flex items-center justify-between", children: [_jsx("span", { children: "Supported Webhook Events" }), _jsx("span", { className: "text-[10px] font-mono text-slate-400", children: "Asynchronous Verification Lifecycle" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs", children: [_jsxs("div", { className: "p-3.5 rounded-xl bg-[#090e1a] border border-[#1a2438]", children: [_jsx("span", { className: "font-mono text-amber-300 font-semibold", children: "transfer.review_required" }), _jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: "Dispatched when transfer needs human out-of-band telephone callback or secondary sign-off." })] }), _jsxs("div", { className: "p-3.5 rounded-xl bg-[#090e1a] border border-[#1a2438]", children: [_jsx("span", { className: "font-mono text-emerald-400 font-semibold", children: "transfer.allowed" }), _jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: "Dispatched when transfer is authorized and clear for downstream execution." })] }), _jsxs("div", { className: "p-3.5 rounded-xl bg-[#090e1a] border border-[#1a2438]", children: [_jsx("span", { className: "font-mono text-blue-400 font-semibold", children: "transfer.verified" }), _jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: "Dispatched when a treasury operator completes out-of-band telephone verification." })] }), _jsxs("div", { className: "p-3.5 rounded-xl bg-[#090e1a] border border-[#1a2438]", children: [_jsx("span", { className: "font-mono text-rose-400 font-semibold", children: "transfer.blocked" }), _jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: "Dispatched when a transfer is permanently rejected due to policy violations." })] })] })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-atmospheric-card border border-slate-800/80 space-y-4 shadow-sm", children: [_jsxs("div", { className: "border-b border-slate-800/80 pb-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-slate-200", children: "Interactive SDK Sandbox Test" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Test real SDK evaluation response contract from the browser." })] }), _jsxs("button", { onClick: handleTestEvaluate, disabled: simRunning, className: "px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50", children: [_jsx(Play, { className: "w-3.5 h-3.5 fill-current" }), _jsx("span", { children: simRunning ? 'Evaluating...' : 'Run evaluate()' })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-medium text-slate-400 mb-1", children: "Beneficiary Name" }), _jsx("input", { type: "text", value: simVendor, onChange: (e) => setSimVendor(e.target.value), className: "w-full bg-[#070b14] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-medium text-slate-400 mb-1", children: "Amount (USD)" }), _jsx("input", { type: "number", value: simAmount, onChange: (e) => setSimAmount(Number(e.target.value)), className: "w-full bg-[#070b14] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-medium text-slate-400 mb-1", children: "Beneficiary Account Mask" }), _jsx("input", { type: "text", value: simAccount, onChange: (e) => setSimAccount(e.target.value), className: "w-full bg-[#070b14] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono" })] })] }), simResult && (_jsxs("div", { className: "mt-4 p-4 rounded-xl bg-[#060910] border border-slate-800", children: [_jsxs("div", { className: "text-xs font-mono text-slate-400 mb-2 flex items-center justify-between", children: [_jsx("span", { children: "EvaluateTransferDecision JSON Output:" }), _jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${simResult.status === 'ALLOW' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : simResult.status === 'VERIFY' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`, children: simResult.status })] }), _jsx("pre", { className: "text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed", children: _jsx("code", { children: JSON.stringify(simResult, null, 2) }) })] }))] })] }));
};
