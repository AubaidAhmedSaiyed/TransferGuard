import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, AlertCircle, XCircle, FileText, Building2, UserCheck, CreditCard, Scale } from 'lucide-react';
export const EvidenceCard = ({ evidence }) => {
    const getIcon = () => {
        switch (evidence.type) {
            case 'invoice_match':
                return _jsx(FileText, { className: "w-3.5 h-3.5" });
            case 'po_match':
                return _jsx(FileText, { className: "w-3.5 h-3.5" });
            case 'vendor_verified':
                return _jsx(Building2, { className: "w-3.5 h-3.5" });
            case 'requestor_auth':
                return _jsx(UserCheck, { className: "w-3.5 h-3.5" });
            case 'beneficiary_match':
                return _jsx(CreditCard, { className: "w-3.5 h-3.5" });
            case 'approval_governance':
                return _jsx(Scale, { className: "w-3.5 h-3.5" });
            default:
                return _jsx(FileText, { className: "w-3.5 h-3.5" });
        }
    };
    const getStatusBadge = () => {
        switch (evidence.status) {
            case 'verified':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60", children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), " VERIFIED"] }));
            case 'unresolved':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60", children: [_jsx(AlertCircle, { className: "w-3 h-3" }), " HOLD"] }));
            case 'failed':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-800/60", children: [_jsx(XCircle, { className: "w-3 h-3" }), " FAILED"] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "p-4 rounded-lg bg-atmospheric-card border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between shadow-sm", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#1a2336]", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs font-medium text-slate-300", children: [_jsx("span", { className: "text-slate-400", children: getIcon() }), _jsx("span", { className: "text-[11px] text-slate-400 font-sans", children: evidence.category })] }), _jsx("div", { children: getStatusBadge() })] }), _jsx("h4", { className: "font-semibold text-xs text-slate-100", children: evidence.title }), _jsx("p", { className: "text-xs text-slate-300 mt-1.5 leading-relaxed", children: evidence.description }), evidence.details && (_jsx("div", { className: "mt-2.5 p-2 rounded bg-[#090d16] border border-[#1a2336] text-[11px] text-slate-300 font-mono", children: evidence.details }))] }), _jsxs("div", { className: "mt-3 pt-2.5 border-t border-[#1a2336] flex items-center justify-between text-[11px] text-slate-400", children: [_jsxs("span", { className: "truncate max-w-[200px]", title: evidence.source, children: ["Source: ", _jsx("strong", { className: "text-slate-300 font-medium", children: evidence.source })] }), _jsx("span", { className: "font-mono text-[10px] text-slate-500", children: evidence.provenance_id })] })] }));
};
