import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, ArrowRight, X } from 'lucide-react';
export const PresenterGuide = ({ isOpen, onClose, onSelectScenario }) => {
    if (!isOpen)
        return null;
    const steps = [
        {
            time: '0:00 - 0:25',
            title: 'Demo 1: Live User Transaction Creation & AI Intent Analysis',
            badge: 'LIVE WORKFLOW',
            badgeColor: 'text-indigo-400 bg-indigo-950 border-indigo-800',
            script: 'Click "Create Transaction". Enter natural language: "Please pay Acme Supplies $480,000 for invoice INV-8841. They sent updated banking details this morning." Click "Analyze with TransferGuard". Show AI structured extraction, safety signals, and human inspection stage. Submit and show the immediate VERIFY decision!'
        },
        {
            time: '0:25 - 0:45',
            title: 'Demo 2: Targeted Human Verification Resolution',
            actionTxId: 'tx-1002',
            badge: 'KEY SAFETY MOMENT',
            badgeColor: 'text-amber-400 bg-amber-950 border-amber-800',
            script: 'Show that Invoice, PO, Vendor, and Requestor are all VERIFIED. The only missing fact is beneficiary provenance. Click "Verify Beneficiary via Callback". Complete out-of-band phone callback confirmation to Elena Rostova. Watch decision transition from VERIFY → ALLOW.'
        },
        {
            time: '0:45 - 1:05',
            title: 'Demo 3: Genuine Unusual Transfer ($8,000,000 M&A Closing)',
            actionTxId: 'tx-1004',
            badge: 'UNUSUAL ≠ FRAUD',
            badgeColor: 'text-purple-400 bg-purple-950 border-purple-800',
            script: 'Show TX-1004 ($8,000,000 to NewCo Holdings). Explain: A traditional black-box anomaly detector would block this $8M wire. TransferGuard allows it because Board Resolution, CFO signing, and Definitive Agreement are authoritative.'
        },
        {
            time: '1:05 - 1:20',
            title: 'Demo 4: Policy Bypass Directive Block',
            actionTxId: 'tx-1003',
            badge: 'BLOCK',
            badgeColor: 'text-rose-400 bg-rose-950 border-rose-800',
            script: 'Show TX-1003 ($480,000 to offshore Cayman entity). Directive said "Skip normal approval because CFO is unavailable". Deterministic Policy Engine strictly enforces rule and returns BLOCK.'
        },
        {
            time: '1:20 - 1:30',
            title: 'Step 5: Closing Pitch & Core Architecture',
            actionTxId: null,
            badge: 'PITCH CLOSING',
            badgeColor: 'text-emerald-400 bg-emerald-950 border-emerald-800',
            script: '"AI can understand an instruction. That does not mean it should be trusted to execute the consequence. TransferGuard creates the verifiable safety layer between the two: AI can understand. Evidence must authorize."'
        }
    ];
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn", children: _jsxs("div", { className: "bg-[#131b2e] border border-emerald-500/50 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400", children: _jsx(Clock, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-base text-slate-100", children: "90-Second Hackathon Demo Playbook" }), _jsx("p", { className: "text-xs text-slate-400", children: "Official presentation script & acceptance test walkthrough for judges" })] })] }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "space-y-3 pt-2", children: steps.map((step, idx) => (_jsxs("div", { className: "p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-mono text-xs font-bold text-emerald-400", children: step.time }), _jsx("span", { className: "text-xs font-bold text-slate-200", children: step.title })] }), _jsx("span", { className: `text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${step.badgeColor}`, children: step.badge })] }), _jsxs("p", { className: "text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/80 font-mono", children: ["\"", step.script, "\""] }), step.actionTxId && (_jsx("div", { className: "flex justify-end pt-1", children: _jsxs("button", { onClick: () => {
                                        onSelectScenario(step.actionTxId);
                                        onClose();
                                    }, className: "text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors", children: [_jsxs("span", { children: ["Jump directly to ", step.actionTxId.toUpperCase()] }), _jsx(ArrowRight, { className: "w-3 h-3" })] }) }))] }, idx))) }), _jsxs("div", { className: "pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400", children: [_jsx("span", { className: "font-mono", children: "Tip: Use \"Create Transaction\" or \"Create Test Attack\" for real-time live demonstrations." }), _jsx("button", { onClick: onClose, className: "px-4 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200", children: "Got it, Let's Demo" })] })] }) }));
};
