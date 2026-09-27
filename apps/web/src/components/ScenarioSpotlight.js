import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, AlertCircle, XCircle, ArrowRight } from 'lucide-react';
export const ScenarioSpotlight = ({ transactions, onSelectTx, selectedId }) => {
    const getTx = (code) => transactions.find(t => t.tx_code === code);
    const tx1 = getTx('TX-1001');
    const tx2 = getTx('TX-1002');
    const tx3 = getTx('TX-1003');
    const tx4 = getTx('TX-1004');
    const cases = [
        {
            tx: tx1,
            tag: 'Recurring Settlement',
            vendor: 'Northstar Industrial Supplies',
            amount: '$12,400 USD',
            detail: 'Invoice & PO verified • Established bank coordinates',
            decision: tx1?.current_decision || 'ALLOW'
        },
        {
            tx: tx2,
            tag: 'Beneficiary Update Alert',
            vendor: 'Acme Supplies',
            amount: '$480,000 USD',
            detail: 'Invoice matched • Unverified destination account',
            decision: tx2?.current_decision || 'VERIFY'
        },
        {
            tx: tx3,
            tag: 'Unauthorized Directive',
            vendor: 'Apex Global Holdings / Unregistered',
            amount: '$480,000 USD',
            detail: 'Unregistered entity • Missing PO & invoice • Bypass attempt',
            decision: tx3?.current_decision || 'BLOCK'
        },
        {
            tx: tx4,
            tag: 'Strategic M&A Transfer',
            vendor: 'NewCo Holdings LLC',
            amount: '$8,000,000 USD',
            detail: 'Definitive agreement • Board resolution • Escrow verified',
            decision: tx4?.current_decision || 'ALLOW'
        }
    ];
    return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400", children: "Featured Operational Cases" }), _jsx("span", { className: "text-xs text-slate-500", children: "Select any case to inspect evidence" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3", children: cases.map((c, i) => {
                    if (!c.tx)
                        return null;
                    const isSelected = selectedId === c.tx.id;
                    return (_jsxs("button", { onClick: () => c.tx && onSelectTx(c.tx.id), className: `p-4 rounded-lg border text-left transition-all flex flex-col justify-between ${isSelected
                            ? 'bg-[#161f30] border-emerald-500/80 shadow-sm'
                            : 'bg-[#0f1523] border-[#1e293b] hover:border-[#2b3a54] hover:bg-[#131b2c]'}`, children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [_jsx("span", { className: "text-[11px] font-mono font-medium text-slate-400", children: c.tx.tx_code }), _jsxs("span", { className: `inline-flex items-center gap-1 text-[11px] font-semibold ${c.decision === 'ALLOW'
                                                    ? 'text-emerald-400'
                                                    : c.decision === 'VERIFY'
                                                        ? 'text-amber-400'
                                                        : 'text-rose-400'}`, children: [c.decision === 'ALLOW' && _jsx(CheckCircle2, { className: "w-3 h-3" }), c.decision === 'VERIFY' && _jsx(AlertCircle, { className: "w-3 h-3" }), c.decision === 'BLOCK' && _jsx(XCircle, { className: "w-3 h-3" }), _jsx("span", { children: c.decision })] })] }), _jsx("div", { className: "font-semibold text-xs text-slate-200 line-clamp-1", children: c.vendor }), _jsx("div", { className: "text-sm font-bold font-sans text-slate-100 mt-1", children: c.amount }), _jsx("p", { className: "text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed", children: c.detail })] }), _jsxs("div", { className: "mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400 font-medium", children: [_jsx("span", { children: c.tag }), _jsx(ArrowRight, { className: "w-3.5 h-3.5 text-slate-500" })] })] }, i));
                }) })] }));
};
