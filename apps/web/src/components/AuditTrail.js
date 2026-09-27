import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShieldCheck } from 'lucide-react';
export const AuditTrail = ({ logs }) => {
    const getDecisionBadge = (decision) => {
        switch (decision) {
            case 'ALLOW':
                return (_jsx("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-mono", children: "ALLOW" }));
            case 'VERIFY':
                return (_jsx("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60 font-mono", children: "VERIFY" }));
            case 'BLOCK':
                return (_jsx("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-800/60 font-mono", children: "BLOCK" }));
            default:
                return (_jsx("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800", children: decision || 'PENDING' }));
        }
    };
    return (_jsxs("div", { className: "rounded-lg bg-atmospheric-card border border-slate-800/80 p-5 space-y-4 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-[#1e293b]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-400" }), _jsx("h3", { className: "font-semibold text-xs text-slate-200 uppercase tracking-wider", children: "Immutable Audit Trail & Decision Lineage" })] }), _jsxs("span", { className: "text-xs font-mono text-slate-400", children: [logs.length, " logged event", logs.length !== 1 ? 's' : ''] })] }), _jsx("div", { className: "space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-[#1e293b]", children: logs.map((log, index) => {
                    const isLatest = index === logs.length - 1;
                    return (_jsxs("div", { className: "relative pl-7 text-xs", children: [_jsx("div", { className: `absolute left-3 top-1.5 w-2 h-2 rounded-full -translate-x-1/2 ${isLatest
                                    ? log.decision_snapshot === 'ALLOW'
                                        ? 'bg-emerald-400 ring-2 ring-emerald-500/20'
                                        : log.decision_snapshot === 'VERIFY'
                                            ? 'bg-amber-400 ring-2 ring-amber-500/20'
                                            : log.decision_snapshot === 'BLOCK'
                                                ? 'bg-rose-400 ring-2 ring-rose-500/20'
                                                : 'bg-slate-400'
                                    : 'bg-slate-600'}` }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs", children: [_jsx("span", { className: "font-mono text-slate-400", children: log.time_offset_label || new Date(log.timestamp).toLocaleTimeString() }), _jsx("span", { className: "text-slate-600", children: "\u2022" }), _jsx("span", { className: "font-semibold text-slate-200", children: log.action }), _jsx("span", { className: "text-slate-600", children: "\u2022" }), _jsx("span", { className: "text-slate-400", children: log.actor }), _jsx("div", { className: "ml-auto", children: getDecisionBadge(log.decision_snapshot) })] }), _jsx("div", { className: "text-slate-300 text-xs leading-relaxed bg-[#090d16] p-2.5 rounded border border-[#1a2336] font-mono text-[11px]", children: log.details })] })] }, log.id));
                }) })] }));
};
