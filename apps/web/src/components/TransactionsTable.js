import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CheckCircle2, AlertCircle, XCircle, Search, ArrowRight, Plus } from 'lucide-react';
export const TransactionsTable = ({ transactions, onSelectTx, selectedId, onOpenCreateModal }) => {
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const filtered = transactions.filter(tx => {
        if (filter === 'ACTION_REQUIRED' && tx.current_decision === 'ALLOW')
            return false;
        if (filter === 'ALLOW' && tx.current_decision !== 'ALLOW')
            return false;
        if (filter === 'VERIFY' && tx.current_decision !== 'VERIFY')
            return false;
        if (filter === 'BLOCK' && tx.current_decision !== 'BLOCK')
            return false;
        if (filter === 'USER_CREATED' && !tx.is_user_created)
            return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (tx.tx_code.toLowerCase().includes(term) ||
                tx.vendor_name.toLowerCase().includes(term) ||
                tx.requestor_name.toLowerCase().includes(term) ||
                tx.purpose.toLowerCase().includes(term));
        }
        return true;
    });
    const getStatusBadge = (decision) => {
        switch (decision) {
            case 'ALLOW':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60", children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), " ALLOW"] }));
            case 'VERIFY':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60", children: [_jsx(AlertCircle, { className: "w-3 h-3" }), " VERIFY"] }));
            case 'BLOCK':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-800/60", children: [_jsx(XCircle, { className: "w-3 h-3" }), " BLOCK"] }));
        }
    };
    const getExceptionNote = (tx) => {
        if (tx.current_decision === 'BLOCK') {
            return _jsx("span", { className: "text-rose-400", children: "Critical verification failure" });
        }
        if (tx.current_decision === 'VERIFY') {
            return _jsx("span", { className: "text-amber-300", children: "Beneficiary coordinates unverified" });
        }
        if (tx.amount >= 1000000) {
            return _jsx("span", { className: "text-slate-400", children: "High-value governance verified" });
        }
        return _jsx("span", { className: "text-slate-500", children: "Standard operational disbursement" });
    };
    return (_jsxs("div", { className: "rounded-lg bg-atmospheric-card border border-slate-800/80 overflow-hidden shadow-sm", children: [_jsxs("div", { className: "p-4 sm:p-5 border-b border-[#1e293b] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-sm text-slate-100 flex items-center gap-2", children: [_jsx("span", { children: "Transaction Review Queue" }), _jsxs("span", { className: "text-xs font-normal text-slate-400", children: ["(", filtered.length, " of ", transactions.length, ")"] })] }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Pre-transfer evaluation of originations, supporting evidence, and compliance policies" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" }), _jsx("input", { type: "text", placeholder: "Search vendor, ID, requestor...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full sm:w-56 bg-[#090d16] border border-[#1e293b] rounded-md pl-8.5 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" })] }), _jsx("div", { className: "flex bg-[#090d16] p-1 rounded-md border border-[#1e293b] text-xs", children: ['ALL', 'ACTION_REQUIRED', 'ALLOW', 'USER_CREATED'].map((tab) => (_jsx("button", { onClick: () => setFilter(tab), className: `px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap text-[11px] ${filter === tab
                                        ? 'bg-[#161f30] text-slate-100 font-semibold shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200'}`, children: tab === 'ACTION_REQUIRED' ? 'Action Required' : tab === 'USER_CREATED' ? 'Custom' : tab }, tab))) }), onOpenCreateModal && (_jsxs("button", { onClick: onOpenCreateModal, className: "px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Create Transaction" })] }))] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-xs", children: [_jsx("thead", { className: "bg-[#090d16] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1e293b]", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-semibold", children: "Transaction ID" }), _jsx("th", { className: "px-4 py-3 font-semibold", children: "Counterparty" }), _jsx("th", { className: "px-4 py-3 font-semibold text-right", children: "Amount (USD)" }), _jsx("th", { className: "px-4 py-3 font-semibold", children: "Decision" }), _jsx("th", { className: "px-4 py-3 font-semibold", children: "Risk & Exception Analysis" }), _jsx("th", { className: "px-4 py-3 font-semibold", children: "Evidence Status" }), _jsx("th", { className: "px-4 py-3 font-semibold text-right", children: "Action" })] }) }), _jsx("tbody", { className: "divide-y divide-[#1e293b]", children: filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-4 py-16 text-center", children: _jsxs("div", { className: "max-w-sm mx-auto flex flex-col items-center justify-center space-y-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-[#161f30] border border-[#1e293b] flex items-center justify-center text-slate-400", children: _jsx(Search, { className: "w-5 h-5" }) }), _jsx("div", { className: "text-sm font-semibold text-slate-200", children: "No Transactions Found" }), _jsx("p", { className: "text-xs text-slate-400", children: transactions.length === 0
                                                    ? 'No transfer requests have been submitted to this workspace yet.'
                                                    : 'No transactions match the selected filter criteria.' }), onOpenCreateModal && (_jsxs("button", { onClick: onOpenCreateModal, className: "mt-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Create Transfer Request" })] }))] }) }) })) : (filtered.map((tx) => {
                                const isSelected = selectedId === tx.id;
                                return (_jsxs("tr", { onClick: () => onSelectTx(tx.id), className: `cursor-pointer transition-colors group ${isSelected
                                        ? 'bg-[#161f30] border-l-2 border-l-emerald-400'
                                        : 'hover:bg-[#121826]'}`, children: [_jsx("td", { className: "px-4 py-3.5 font-mono text-slate-300 font-medium group-hover:text-emerald-300", children: _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { children: tx.tx_code }), tx.is_user_created && (_jsx("span", { className: "text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-sans", children: "Custom" }))] }) }), _jsxs("td", { className: "px-4 py-3.5", children: [_jsx("div", { className: "font-medium text-slate-200 group-hover:text-white", children: tx.vendor_name }), _jsx("div", { className: "text-[11px] text-slate-400", children: tx.purpose })] }), _jsxs("td", { className: "px-4 py-3.5 text-right font-mono font-semibold text-slate-100", children: ["$", tx.amount.toLocaleString(), " ", _jsx("span", { className: "text-[10px] text-slate-400 font-sans", children: tx.currency })] }), _jsx("td", { className: "px-4 py-3.5", children: getStatusBadge(tx.current_decision) }), _jsx("td", { className: "px-4 py-3.5 text-xs", children: getExceptionNote(tx) }), _jsxs("td", { className: "px-4 py-3.5 font-mono text-[11px]", children: [_jsx("span", { className: "text-emerald-400 font-semibold", children: tx.evidence_summary?.verified_count || 0 }), _jsxs("span", { className: "text-slate-500", children: [" / ", tx.evidence_summary?.total || 0, " checks"] })] }), _jsx("td", { className: "px-4 py-3.5 text-right", children: _jsx("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    onSelectTx(tx.id);
                                                }, className: "p-1 rounded text-slate-400 group-hover:text-emerald-300 transition-colors", title: "View Transaction Detail", children: _jsx(ArrowRight, { className: "w-4 h-4" }) }) })] }, tx.id));
                            })) })] }) })] }));
};
