import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ShieldCheck, RotateCcw, Plus, SlidersHorizontal, Layers, FileClock, LayoutGrid } from 'lucide-react';
import { api } from '../services/api';
export const Header = ({ activeTab, onTabChange, onReset, onOpenCreateTransaction, selectedTxId, onSelectTx }) => {
    const [aiStatus, setAiStatus] = useState(null);
    useEffect(() => {
        api.getAIStatus().then(res => setAiStatus(res)).catch(() => { });
    }, []);
    return (_jsx("header", { className: "border-b border-[#1e293b] bg-[#090d16]/95 backdrop-blur-md sticky top-0 z-40", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-8", children: [_jsxs("button", { onClick: () => {
                                onSelectTx(null);
                                onTabChange('dashboard');
                            }, className: "flex items-center gap-2.5 text-left group", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400", children: _jsx(ShieldCheck, { className: "w-4.5 h-4.5" }) }), _jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "font-bold text-base text-slate-100 tracking-tight group-hover:text-white", children: "TransferGuard" }), _jsx("span", { className: "text-[11px] text-slate-400 font-normal hidden sm:inline", children: "Pre-Transfer Verification" })] })] }), _jsxs("nav", { className: "hidden md:flex items-center gap-1 text-xs font-medium", children: [_jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('dashboard');
                                    }, className: `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${activeTab === 'dashboard' && !selectedTxId
                                        ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                                        : 'text-slate-400 hover:text-slate-200'}`, children: [_jsx(LayoutGrid, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Overview" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('transactions');
                                    }, className: `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${activeTab === 'transactions' || selectedTxId
                                        ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                                        : 'text-slate-400 hover:text-slate-200'}`, children: [_jsx(ShieldCheck, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Transactions" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('policies');
                                    }, className: `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${activeTab === 'policies'
                                        ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                                        : 'text-slate-400 hover:text-slate-200'}`, children: [_jsx(SlidersHorizontal, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Policies" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('evidence');
                                    }, className: `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${activeTab === 'evidence'
                                        ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                                        : 'text-slate-400 hover:text-slate-200'}`, children: [_jsx(Layers, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Evidence" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('audit');
                                    }, className: `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${activeTab === 'audit'
                                        ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                                        : 'text-slate-400 hover:text-slate-200'}`, children: [_jsx(FileClock, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Audit Log" })] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [aiStatus && (_jsxs("div", { className: "hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0f1523] border border-[#1e293b] text-[11px] text-slate-400 font-mono", title: aiStatus.online ? `Connected to local LLM: ${aiStatus.model}` : 'Local deterministic heuristic engine active', children: [_jsx("span", { className: `w-1.5 h-1.5 rounded-full ${aiStatus.online ? 'bg-emerald-400' : 'bg-slate-400'}` }), _jsx("span", { children: aiStatus.online ? `Ollama (${aiStatus.model})` : 'Local Heuristic Engine' })] })), _jsx("button", { onClick: onReset, className: "p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#161f30] border border-transparent hover:border-[#1e293b] text-xs transition-colors", title: "Reset to pristine baseline state", children: _jsx(RotateCcw, { className: "w-3.5 h-3.5" }) }), _jsxs("button", { onClick: onOpenCreateTransaction, className: "px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Create Transaction" })] })] })] }) }));
};
