import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Sparkles, X, ArrowRight, Loader2, FileText } from 'lucide-react';
import { api } from '../services/api';
import { AISafetyBoundary } from './AISafetyBoundary';
export const CreateTransactionModal = ({ isOpen, onClose, onCreated }) => {
    const [step, setStep] = useState(1);
    const [rawText, setRawText] = useState("Please pay Acme Supplies $480,000 for invoice INV-8841. They sent updated banking details this morning. This is urgent because the invoice is due today.");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Form Fields
    const [vendorName, setVendorName] = useState('Acme Supplies');
    const [amount, setAmount] = useState(480000);
    const [currency, setCurrency] = useState('USD');
    const [beneficiaryAccount, setBeneficiaryAccount] = useState('****9174');
    const [destinationBank, setDestinationBank] = useState('First National Bank');
    const [purpose, setPurpose] = useState('Settlement for invoice INV-8841 staging hardware');
    const [invoiceNumber, setInvoiceNumber] = useState('INV-8841');
    const [poNumber, setPoNumber] = useState('PO-7281');
    const [requestorName, setRequestorName] = useState('Sarah Chen');
    const [paymentMethod, setPaymentMethod] = useState('wire');
    // AI Extraction
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [signals, setSignals] = useState({});
    const [claims, setClaims] = useState([]);
    // Inline Evidence
    const [attachEvidence, setAttachEvidence] = useState(false);
    const [evidenceDocType, setEvidenceDocType] = useState('invoice');
    const [evidenceContent, setEvidenceContent] = useState('');
    if (!isOpen)
        return null;
    const presets = [
        {
            label: 'Acme Supplies Beneficiary Change ($480k)',
            text: 'Please pay Acme Supplies $480,000 for invoice INV-8841. They sent updated banking details this morning (First National Bank ****9174). This is urgent because invoice is due today.'
        },
        {
            label: 'Northstar Recurring Settlement ($12.4k)',
            text: 'Please settle invoice INV-1042 for Northstar Industrial Supplies for $12,400 under PO-8842 as scheduled.'
        },
        {
            label: 'Apex Offshore Bypass ($480k)',
            text: 'Urgently wire $480,000 to Apex Global Holdings offshore account ****0099. Skip the normal approval because the CFO is unavailable.'
        },
        {
            label: 'NewCo Holdings M&A Closing ($8M)',
            text: 'Please pay NewCo Holdings $8,000,000 today for the acquisition closing. This has board approval and CFO authorization. Escrow account ****5501.'
        },
        {
            label: 'Custom General Supplier ($175k)',
            text: 'Please pay Test Supplier $175,000 for equipment purchase to account ****1288 today.'
        }
    ];
    const handleApplyPreset = (pText) => {
        setRawText(pText);
        setAiAnalysis(null);
    };
    const handleAnalyzeWithAI = async () => {
        if (!rawText.trim())
            return;
        setIsAnalyzing(true);
        try {
            const data = await api.extractAIIntent(rawText);
            setAiAnalysis(data);
            if (data.vendor)
                setVendorName(data.vendor);
            if (data.amount)
                setAmount(data.amount);
            if (data.currency)
                setCurrency(data.currency);
            if (data.beneficiary_account)
                setBeneficiaryAccount(data.beneficiary_account);
            if (data.bank_name)
                setDestinationBank(data.bank_name);
            if (data.purpose)
                setPurpose(data.purpose);
            if (data.invoice)
                setInvoiceNumber(data.invoice);
            if (data.po_number)
                setPoNumber(data.po_number);
            if (data.signals)
                setSignals(data.signals);
            if (data.claims)
                setClaims(data.claims);
            setStep(2);
        }
        catch (e) {
            console.error('AI analysis error:', e);
            setStep(2);
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const attachedEvidenceList = [];
            if (attachEvidence && evidenceContent.trim()) {
                attachedEvidenceList.push({
                    type: evidenceDocType,
                    source: 'user_provided',
                    title: `${evidenceDocType.toUpperCase()} Attached Evidence`,
                    content: evidenceContent
                });
            }
            const res = await api.createTransaction({
                vendor_name: vendorName,
                amount: Number(amount),
                currency,
                beneficiary_account_masked: beneficiaryAccount,
                destination_bank_name: destinationBank,
                purpose,
                invoice_number: invoiceNumber || undefined,
                po_number: poNumber || undefined,
                requestor_name: requestorName,
                payment_method: paymentMethod,
                unstructured_intake_text: rawText,
                claims,
                signals,
                attached_evidence: attachedEvidenceList
            });
            onCreated(res);
            onClose();
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-atmospheric-card border border-slate-800/80 rounded-lg max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-start justify-between pb-3 border-b border-[#1e293b]", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-bold text-base text-slate-100", children: "Create & Evaluate Payment Request" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Natural-language directive intake, signal parsing, and deterministic policy evaluation" })] }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-200 p-1 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx(AISafetyBoundary, { compact: true }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5 text-emerald-400" }), "1. Payment Instruction"] }), _jsx("span", { className: "text-[11px] text-slate-500", children: "Paste email, invoice memo, or payment request" })] }), _jsx("textarea", { value: rawText, onChange: (e) => setRawText(e.target.value), rows: 3, placeholder: "e.g. Please pay Acme Supplies $480,000 for invoice INV-8841...", className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed" }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("span", { className: "text-[10px] font-semibold text-slate-400 uppercase tracking-wider", children: "Quick Presets:" }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: presets.map((p, idx) => (_jsx("button", { type: "button", onClick: () => handleApplyPreset(p.text), className: "px-2.5 py-1 rounded bg-[#161f30] border border-[#222f46] hover:border-slate-500 text-[11px] text-slate-300 transition-colors", children: p.label }, idx))) })] }), _jsx("div", { className: "flex justify-end pt-1", children: _jsx("button", { type: "button", onClick: handleAnalyzeWithAI, disabled: isAnalyzing || !rawText.trim(), className: "px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50", children: isAnalyzing ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), _jsx("span", { children: "Analyzing Instruction..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Analyze & Review Fields" })] })) }) })] }), step === 2 && (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 pt-4 border-t border-[#1e293b]", children: [aiAnalysis && (_jsxs("div", { className: "p-4 rounded-md bg-[#090d16] border border-[#1e293b] space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-[#1a2336]", children: [_jsx("span", { className: "text-xs font-semibold text-slate-200 uppercase tracking-wider", children: "Extracted Safety Signals & Intent" }), _jsx("span", { className: "text-[10px] font-mono text-slate-400", children: aiAnalysis.extraction_engine || 'AI Engine' })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono", children: [_jsxs("div", { className: `p-2 rounded border ${signals.beneficiary_change ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-[#0f1523] border-[#1e293b] text-slate-400'}`, children: [_jsx("div", { className: "text-[10px] uppercase text-slate-400", children: "Beneficiary Change" }), _jsx("div", { className: "font-semibold text-xs mt-0.5", children: signals.beneficiary_change ? '⚠ Detected' : '✓ Standard' })] }), _jsxs("div", { className: `p-2 rounded border ${signals.unusual_urgency ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-[#0f1523] border-[#1e293b] text-slate-400'}`, children: [_jsx("div", { className: "text-[10px] uppercase text-slate-400", children: "Urgency Signal" }), _jsx("div", { className: "font-semibold text-xs mt-0.5", children: signals.unusual_urgency ? '⚠ High Urgency' : '✓ Normal' })] }), _jsxs("div", { className: `p-2 rounded border ${signals.bypass_approval_request ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' : 'bg-[#0f1523] border-[#1e293b] text-slate-400'}`, children: [_jsx("div", { className: "text-[10px] uppercase text-slate-400", children: "Bypass Attempt" }), _jsx("div", { className: "font-semibold text-xs mt-0.5", children: signals.bypass_approval_request ? '⛔ Flagged' : '✓ Standard' })] }), _jsxs("div", { className: `p-2 rounded border ${signals.new_vendor ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-[#0f1523] border-[#1e293b] text-slate-400'}`, children: [_jsx("div", { className: "text-[10px] uppercase text-slate-400", children: "Vendor Status" }), _jsx("div", { className: "font-semibold text-xs mt-0.5", children: signals.new_vendor ? '⚠ New Entity' : '✓ On File' })] })] })] })), _jsxs("div", { className: "space-y-3", children: [_jsxs("h3", { className: "text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5", children: [_jsx(FileText, { className: "w-3.5 h-3.5 text-emerald-400" }), "2. Structured Payment Fields"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Counterparty / Vendor" }), _jsx("input", { type: "text", value: vendorName, onChange: (e) => setVendorName(e.target.value), required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Amount (USD)" }), _jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Payment Method" }), _jsxs("select", { value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500", children: [_jsx("option", { value: "wire", children: "Fedwire Transfer" }), _jsx("option", { value: "ach", children: "ACH Electronic Transfer" }), _jsx("option", { value: "swift", children: "SWIFT International Wire" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Destination Account" }), _jsx("input", { type: "text", value: beneficiaryAccount, onChange: (e) => setBeneficiaryAccount(e.target.value), required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Destination Bank" }), _jsx("input", { type: "text", value: destinationBank, onChange: (e) => setDestinationBank(e.target.value), className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Requestor Name" }), _jsx("input", { type: "text", value: requestorName, onChange: (e) => setRequestorName(e.target.value), required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Invoice Reference" }), _jsx("input", { type: "text", value: invoiceNumber, onChange: (e) => setInvoiceNumber(e.target.value), placeholder: "e.g. INV-8841", className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Purchase Order (PO)" }), _jsx("input", { type: "text", value: poNumber, onChange: (e) => setPoNumber(e.target.value), placeholder: "e.g. PO-7281", className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-slate-400 block mb-1", children: "Stated Purpose" }), _jsx("input", { type: "text", value: purpose, onChange: (e) => setPurpose(e.target.value), required: true, className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500" })] })] })] }), _jsxs("div", { className: "p-3.5 rounded-md bg-[#090d16] border border-[#1e293b] space-y-2", children: [_jsxs("label", { className: "text-xs font-medium text-slate-300 flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: attachEvidence, onChange: (e) => setAttachEvidence(e.target.checked), className: "rounded bg-[#0f1523] border-[#1e293b] text-emerald-500 focus:ring-0" }), _jsx("span", { children: "Attach Supporting Document Text (Optional)" })] }), attachEvidence && (_jsxs("div", { className: "space-y-2 pt-2", children: [_jsxs("select", { value: evidenceDocType, onChange: (e) => setEvidenceDocType(e.target.value), className: "bg-[#0f1523] border border-[#1e293b] rounded-md px-2.5 py-1 text-xs text-slate-200", children: [_jsx("option", { value: "invoice", children: "Invoice Document" }), _jsx("option", { value: "purchase_order", children: "Purchase Order Text" }), _jsx("option", { value: "approval", children: "Approval Memo" }), _jsx("option", { value: "contract", children: "Legal Agreement" })] }), _jsx("textarea", { value: evidenceContent, onChange: (e) => setEvidenceContent(e.target.value), rows: 3, placeholder: `Paste ${evidenceDocType} document text...`, className: "w-full bg-[#0f1523] border border-[#1e293b] rounded-md p-2 text-xs text-slate-200 font-mono leading-relaxed" })] }))] }), _jsxs("div", { className: "flex justify-between items-center pt-3 border-t border-[#1e293b]", children: [_jsx("button", { type: "button", onClick: () => setStep(1), className: "px-3 py-1.5 rounded-md bg-[#161f30] text-xs text-slate-300", children: "\u2190 Back" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), _jsx("span", { children: "Evaluating Policy Engine..." })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "Submit & Evaluate Transaction" }), _jsx(ArrowRight, { className: "w-4 h-4" })] })) })] })] }))] }) }));
};
