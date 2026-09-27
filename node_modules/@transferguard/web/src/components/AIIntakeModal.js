import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Sparkles, ArrowRight, X, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../services/api';
export const AIIntakeModal = ({ isOpen, onClose, onConverted }) => {
    const [inputText, setInputText] = useState("Urgent: Please update Acme Supplies' banking details to First National Bank (routing 071000013, acct ****9174) and process today's invoice INV-8841 for $480,000 immediately.");
    const [isExtracting, setIsExtracting] = useState(false);
    const [extraction, setExtraction] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    if (!isOpen)
        return null;
    const presets = [
        {
            title: 'Acme Supplies Account Update ($480k)',
            text: "Urgent: Please update Acme Supplies' banking details to First National Bank (routing 071000013, acct ****9174) and process today's invoice INV-8841 for $480,000 immediately."
        },
        {
            title: 'Apex Offshore Directive ($480k)',
            text: "Strictly confidential directive: Please wire $480,000 immediately to Apex Global Holdings offshore account ****0099 for project advisory retainer. Do not delay."
        },
        {
            title: 'Project Horizon M&A Wire ($8M)',
            text: "Wire $8,000,000 to NewCo Holdings LLC per Definitive Acquisition Agreement ACQ-AGMT-2026-99 Section 4.2 approved by the Board yesterday. Escrow account ****5501."
        }
    ];
    const handleExtract = async () => {
        if (!inputText.trim())
            return;
        setIsExtracting(true);
        try {
            const data = await api.extractIntake(inputText);
            setExtraction(data);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsExtracting(false);
        }
    };
    const handleConvert = async () => {
        if (!extraction)
            return;
        setIsConverting(true);
        try {
            const result = await api.convertIntakeToTransaction(extraction, inputText);
            onConverted(result);
            onClose();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsConverting(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-[#0f1523] border border-[#1e293b] rounded-lg max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-start justify-between pb-3 border-b border-[#1e293b]", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-bold text-base text-slate-100", children: "AI Payment Intake Assistant" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Extract structured claims from unstructured messages for deterministic verification" })] }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-200 p-1 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[10px] font-semibold text-slate-400 uppercase tracking-wider", children: "Sample Directives:" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2", children: presets.map((p, idx) => (_jsx("button", { onClick: () => {
                                    setInputText(p.text);
                                    setExtraction(null);
                                }, className: "p-2 text-left rounded bg-[#090d16] border border-[#1e293b] hover:border-slate-600 text-xs text-slate-300 transition-colors line-clamp-2", children: p.title }, idx))) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 uppercase tracking-wider", children: "Raw Message / Directive Text" }), _jsx("textarea", { value: inputText, onChange: (e) => setInputText(e.target.value), rows: 3, placeholder: "Paste raw email, Slack message, or wire memo...", className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed" })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: handleExtract, disabled: isExtracting || !inputText.trim(), className: "px-4 py-2 rounded-md bg-[#161f30] hover:bg-[#1e293b] text-slate-200 border border-[#222f46] text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50", children: isExtracting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), _jsx("span", { children: "Extracting Entities..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsx("span", { children: "Extract Structured Claims" })] })) }) }), extraction && (_jsxs("div", { className: "space-y-3 pt-3 border-t border-[#1e293b]", children: [_jsxs("h4", { className: "text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400" }), "Extracted Parameters"] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2.5 p-3 rounded-md bg-[#090d16] border border-[#1e293b] font-mono text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-500 text-[10px] block uppercase", children: "Counterparty" }), _jsx("span", { className: "font-semibold text-slate-200", children: extraction.vendor_name })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 text-[10px] block uppercase", children: "Amount" }), _jsxs("span", { className: "font-bold text-emerald-400", children: ["$", extraction.amount.toLocaleString(), " USD"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 text-[10px] block uppercase", children: "Action" }), _jsx("span", { className: "font-semibold text-amber-300", children: extraction.requested_action })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 text-[10px] block uppercase", children: "Invoice" }), _jsx("span", { className: "text-slate-300", children: extraction.invoice_number || 'N/A' })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 text-[10px] block uppercase", children: "Account" }), _jsx("span", { className: "text-slate-300", children: extraction.beneficiary_account_masked || '****9174' })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 text-[10px] block uppercase", children: "Urgency" }), _jsx("span", { className: "font-semibold uppercase text-rose-400", children: extraction.urgency })] })] }), extraction.confidence_notes && (_jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: "text-[11px] font-medium text-slate-400", children: "Signals & Extraction Lineage:" }), _jsx("ul", { className: "text-xs text-slate-300 space-y-1 list-disc list-inside bg-[#090d16] p-2.5 rounded border border-[#1e293b] font-mono text-[11px]", children: extraction.confidence_notes.map((note, i) => (_jsx("li", { children: note }, i))) })] })), _jsx("div", { className: "pt-2 flex justify-end gap-3", children: _jsx("button", { onClick: handleConvert, disabled: isConverting, className: "px-4 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm", children: isConverting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), _jsx("span", { children: "Evaluating via Decision Engine..." })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "Submit to Decision Engine" }), _jsx(ArrowRight, { className: "w-4 h-4" })] })) }) })] }))] }) }));
};
