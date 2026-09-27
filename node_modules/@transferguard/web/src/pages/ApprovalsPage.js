import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { PhoneCall, ArrowRight, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useRouter } from '../context/RouterContext';
import { VerificationModal } from '../components/VerificationModal';
export const ApprovalsPage = () => {
    const { navigate } = useRouter();
    const [loading, setLoading] = useState(true);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [selectedTxForVerify, setSelectedTxForVerify] = useState(null);
    const loadApprovals = async () => {
        try {
            setLoading(true);
            const all = await api.getTransactions();
            const verifyList = all.filter(t => t.current_decision === 'VERIFY' || t.lifecycle_state === 'REQUIRES_HUMAN_CALL');
            setPendingApprovals(verifyList);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadApprovals();
    }, []);
    const handleVerified = async (updated) => {
        setSelectedTxForVerify(null);
        await loadApprovals();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h2", { className: "text-base font-bold text-slate-100", children: "Approvals & Verification Queue" }), _jsxs("span", { className: "text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30", children: [pendingApprovals.length, " Pending Actions"] })] }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Transfers flagged for out-of-band beneficiary callbacks, dual-control sign-offs, or urgency overrides." })] }), _jsx("button", { onClick: loadApprovals, className: "px-3 py-1.5 rounded-md bg-[#161f30] hover:bg-[#1f2c42] text-slate-300 text-xs font-medium border border-[#2a3a55] transition-colors", children: "Refresh Queue" })] }), loading ? (_jsxs("div", { className: "py-20 flex flex-col items-center justify-center gap-3 text-slate-400", children: [_jsx(Loader2, { className: "w-6 h-6 text-amber-400 animate-spin" }), _jsx("span", { className: "text-xs font-mono", children: "Loading pending approvals..." })] })) : pendingApprovals.length === 0 ? (_jsxs("div", { className: "bg-[#0f1523] border border-[#1e293b] rounded-xl p-12 text-center", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3", children: _jsx(CheckCircle2, { className: "w-6 h-6" }) }), _jsx("h3", { className: "text-sm font-semibold text-slate-200", children: "No Transfers Awaiting Verification" }), _jsx("p", { className: "text-xs text-slate-400 max-w-md mx-auto mt-1", children: "All submitted payment instructions have met active deterministic policies or have been reconciled." })] })) : (_jsx("div", { className: "space-y-3", children: pendingApprovals.map((tx) => (_jsxs("div", { className: "p-5 rounded-xl bg-[#0f1523] border border-amber-900/40 hover:border-amber-700/60 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1.5 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs font-mono font-bold text-amber-400", children: tx.tx_code }), _jsx("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800", children: "REVIEW REQUIRED" }), _jsx("span", { className: "text-xs font-semibold text-slate-200", children: tx.vendor_name })] }), _jsxs("div", { className: "text-xs text-slate-400", children: ["Purpose: ", _jsx("span", { className: "text-slate-300", children: tx.purpose }), " \u2022 Requestor: ", _jsx("span", { className: "text-slate-300", children: tx.requestor_name })] }), _jsxs("div", { className: "text-xs text-amber-300 flex items-center gap-1.5 pt-1", children: [_jsx(AlertTriangle, { className: "w-3.5 h-3.5 shrink-0" }), _jsx("span", { children: "Beneficiary account changed or dual-control threshold exceeded. Out-of-band verification required." })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0", children: [_jsxs("div", { className: "text-left sm:text-right", children: [_jsxs("div", { className: "font-mono text-base font-bold text-slate-100", children: ["$", tx.amount.toLocaleString(), " ", _jsx("span", { className: "text-xs font-sans text-slate-400", children: tx.currency })] }), _jsxs("div", { className: "text-[11px] text-slate-500 font-mono", children: [tx.evidence_summary?.verified_count || 0, " / ", tx.evidence_summary?.total || 0, " checks passed"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setSelectedTxForVerify({ id: tx.id, tx_code: tx.tx_code, vendor_name: tx.vendor_name, amount: tx.amount }), className: "px-3.5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95", children: [_jsx(PhoneCall, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Perform Callback" })] }), _jsx("button", { onClick: () => navigate(`/app/transfers/${tx.id}`), className: "p-2 rounded-md bg-[#161f30] hover:bg-[#1f2c42] border border-[#2a3a55] text-slate-300 transition-colors", title: "Inspect Details", children: _jsx(ArrowRight, { className: "w-4 h-4" }) })] })] })] }, tx.id))) })), selectedTxForVerify && (_jsx(VerificationModal, { isOpen: true, onClose: () => setSelectedTxForVerify(null), onConfirm: async (data) => {
                    await api.verifyBeneficiary(selectedTxForVerify.id, data);
                    setSelectedTxForVerify(null);
                    await loadApprovals();
                }, amount: selectedTxForVerify.amount || 0 }))] }));
};
