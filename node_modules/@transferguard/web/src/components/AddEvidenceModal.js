import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../services/api';
export const AddEvidenceModal = ({ isOpen, onClose, transactionId, vendorName, onEvidenceAdded }) => {
    const [docType, setDocType] = useState('invoice');
    const [source, setSource] = useState('user_provided');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!isOpen)
        return null;
    const presets = [
        {
            label: 'Invoice Match Document',
            type: 'invoice',
            title: `Invoice from ${vendorName}`,
            content: `INVOICE REFERENCE: INV-8841\nVendor: ${vendorName}\nBilled Amount: $480,000 USD\nPayment Terms: Net 30\nApproved by: Jonathan Miller (VP Supply Chain)`
        },
        {
            label: 'Purchase Order Approval',
            type: 'purchase_order',
            title: `Purchase Order PO-7281`,
            content: `PURCHASE ORDER: PO-7281\nVendor: ${vendorName}\nApproved Amount: $500,000 USD\nAccount Code: 6100-Hardware\nStatus: APPROVED\nAuthorized by: Jonathan Miller`
        },
        {
            label: 'Beneficiary Confirmation Letter',
            type: 'beneficiary_confirmation',
            title: `Beneficiary Account Confirmation Letter`,
            content: `CONFIRMATION OF BANKING COORDINATES\nBeneficiary: ${vendorName}\nBank: First National Bank\nAccount: ****9174\nRouting: 071000013\nConfirmed by: Elena Rostova (VP Finance, ${vendorName})\nDate: 2026-09-22`
        },
        {
            label: 'Executive Board Resolution',
            type: 'approval',
            title: `Board Resolution & CFO Approval Memo`,
            content: `EXECUTIVE AUTHORIZATION MEMO\nProject Horizon Capital Allocation\nAmount: $8,000,000 USD\nCounterparty: ${vendorName}\nSignatories: Marcus Vance (CFO), Board of Directors (Resolution #BR-2026-088)`
        }
    ];
    const handleApplyPreset = (p) => {
        setDocType(p.type);
        setTitle(p.title);
        setContent(p.content);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim())
            return;
        setIsSubmitting(true);
        try {
            const res = await api.addEvidence(transactionId, {
                type: docType,
                source,
                title: title || `${docType.toUpperCase()} Supporting Evidence`,
                content,
                mark_verified: true
            });
            onEvidenceAdded(res.evaluated);
            onClose();
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-atmospheric-card border border-slate-800/80 rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-start justify-between pb-3 border-b border-[#1e293b]", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-bold text-base text-slate-100", children: "Attach Supporting Evidence" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Attach invoice, purchase order, or approval document for cross-verification" })] }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-200 p-1 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[10px] font-semibold text-slate-400 uppercase tracking-wider", children: "Templates:" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: presets.map((p, idx) => (_jsx("button", { type: "button", onClick: () => handleApplyPreset(p), className: "p-2 text-left rounded bg-[#090d16] border border-[#1e293b] hover:border-slate-600 text-xs text-slate-300 transition-colors", children: _jsx("div", { className: "font-medium text-slate-200", children: p.label }) }, idx))) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-3.5 text-xs", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Document Type" }), _jsxs("select", { value: docType, onChange: (e) => setDocType(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500", children: [_jsx("option", { value: "invoice", children: "Invoice" }), _jsx("option", { value: "purchase_order", children: "Purchase Order (PO)" }), _jsx("option", { value: "approval", children: "Executive Approval / Memo" }), _jsx("option", { value: "contract", children: "Legal Contract" }), _jsx("option", { value: "beneficiary_confirmation", children: "Beneficiary Confirmation" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Source System" }), _jsxs("select", { value: source, onChange: (e) => setSource(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500", children: [_jsx("option", { value: "user_provided", children: "User Uploaded" }), _jsx("option", { value: "internal_record", children: "Internal ERP Record" }), _jsx("option", { value: "verified_external", children: "External Confirmation" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Title / Reference" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Acme Supplies Invoice INV-8841", className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Document Content" }), _jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), rows: 5, placeholder: "Paste raw invoice text, approval memo, or PO details...", required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed" })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-3 py-1.5 rounded-md bg-[#161f30] text-slate-300 text-xs", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting || !content.trim(), className: "px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), _jsx("span", { children: "Attaching..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Attach & Re-Evaluate" })] })) })] })] })] }) }));
};
