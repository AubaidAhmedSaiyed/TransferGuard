import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
export const VerificationModal = ({ isOpen, onClose, onConfirm, vendor, bankAccount, amount }) => {
    const [method, setMethod] = useState('trusted_callback');
    const [confirmedBy, setConfirmedBy] = useState('Sarah Chen');
    const [confirmedRole, setConfirmedRole] = useState('Senior Procurement Specialist');
    const [statement, setStatement] = useState(`I confirm that destination account ${bankAccount?.account_number_masked || '****9174'} at ${bankAccount?.bank_name || 'First National Bank'} is the authorized beneficiary account for ${vendor?.name || 'Acme Supplies'}.`);
    const [reason, setReason] = useState('Vendor beneficiary update confirmed via trusted callback.');
    const [notes, setNotes] = useState('Spoke directly with authorized contact on vendor master file.');
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!isOpen)
        return null;
    const handleMethodChange = (newMethod) => {
        setMethod(newMethod);
        if (newMethod === 'trusted_callback') {
            setStatement(`I confirm that destination account ${bankAccount?.account_number_masked || '****9174'} is the authorized beneficiary for ${vendor?.name || 'Vendor'}.`);
            setReason(`Confirmed via out-of-band telephone callback to established contact.`);
        }
        else if (newMethod === 'executive_override') {
            setConfirmedBy('Marcus Vance');
            setConfirmedRole('Chief Financial Officer (CFO)');
            setStatement(`As CFO, I authorize this high-consequence disbursement of $${amount.toLocaleString()} USD under executive delegation DOA-2026.`);
            setReason('Executive Treasury Dual Sign-off completed.');
        }
        else if (newMethod === 'board_resolution') {
            setStatement(`Disbursement authenticated against unanimous Board Resolution #BR-2026-088 and executed Definitive Agreement.`);
            setReason('Corporate Secretarial Governance Minutes verified.');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onConfirm({
                verification_method: method,
                confirmed_by: confirmedBy,
                confirmed_role: confirmedRole,
                statement,
                reason,
                notes
            });
            onClose();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-atmospheric-card border border-slate-800/80 rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-start justify-between pb-3 border-b border-[#1e293b]", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-bold text-base text-slate-100", children: "Targeted Intent Verification" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Confirm out-of-band contact or executive sign-off to authorize release" })] }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-200 p-1 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "text-slate-300 font-medium block mb-1", children: "Verification Method" }), _jsxs("select", { value: method, onChange: (e) => handleMethodChange(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500", children: [_jsx("option", { value: "trusted_callback", children: "Out-of-Band Callback to Established Vendor Contact" }), _jsx("option", { value: "executive_override", children: "Executive Sign-Off / CFO Authorization" }), _jsx("option", { value: "board_resolution", children: "Board Resolution & Custody Agreement Match" }), _jsx("option", { value: "manual_confirmation", children: "Manual Finance Controller Attestation" })] })] }), method === 'trusted_callback' && vendor && (_jsxs("div", { className: "p-3 rounded-md bg-[#090d16] border border-[#1e293b] text-xs space-y-1", children: [_jsx("div", { className: "text-slate-400", children: "Authoritative Vendor Master Contact on File:" }), _jsxs("div", { className: "font-mono text-emerald-400 font-semibold", children: [vendor.trusted_contact_name, " (", vendor.trusted_contact_phone, ")"] })] })), _jsxs("div", { children: [_jsx("label", { className: "text-slate-300 font-medium block mb-1", children: "Verification Statement / Attestation" }), _jsx("textarea", { value: statement, onChange: (e) => setStatement(e.target.value), rows: 3, required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500 leading-relaxed" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Confirmed By" }), _jsx("input", { type: "text", value: confirmedBy, onChange: (e) => setConfirmedBy(e.target.value), required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Role / Title" }), _jsx("input", { type: "text", value: confirmedRole, onChange: (e) => setConfirmedRole(e.target.value), required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Audit Notes" }), _jsx("input", { type: "text", value: reason, onChange: (e) => setReason(e.target.value), required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500" })] }), _jsxs("div", { className: "pt-2 flex justify-end gap-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-3.5 py-2 rounded-md bg-[#161f30] text-slate-300 text-xs", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting || !statement.trim(), className: "px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), _jsx("span", { children: "Recording Verification..." })] })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Confirm Verification & Re-Evaluate" })] })) })] })] })] }) }));
};
