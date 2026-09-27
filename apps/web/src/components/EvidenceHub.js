import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FileText, Sparkles, CheckCircle2, Layers, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { AISafetyBoundary } from './AISafetyBoundary';
export const EvidenceHub = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    // Standalone Document Analyzer
    const [docType, setDocType] = useState('invoice');
    const [rawText, setRawText] = useState("INVOICE #INV-8841\nVendor: Acme Supplies\nDate: 2026-09-22\nAmount: $480,000.00 USD\nDescription: Automated Conveyor Staging Module B-7\nApproved by: Sarah Chen (Senior Procurement)");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [extraction, setExtraction] = useState(null);
    const loadEvidence = async () => {
        try {
            setLoading(true);
            const docs = await api.getAllEvidence();
            setDocuments(docs);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadEvidence();
    }, []);
    const handleAnalyze = async () => {
        if (!rawText.trim())
            return;
        setIsAnalyzing(true);
        try {
            const data = await api.analyzeEvidenceText(rawText, docType);
            setExtraction(data);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(Layers, { className: "w-5 h-5 text-emerald-400" }), _jsx("h1", { className: "text-xl font-bold text-slate-100", children: "Enterprise Evidence & Fact Extraction" })] }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Grounded facts, cross-system document extraction, and immutable provenance records" })] }) }), _jsx(AISafetyBoundary, { compact: true }), _jsxs("div", { className: "rounded-lg bg-[#0f1523] border border-[#1e293b] p-5 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-[#1a2336]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-4 h-4 text-emerald-400" }), _jsx("h3", { className: "font-semibold text-xs uppercase tracking-wider text-slate-200", children: "Document Claim Extractor" })] }), _jsx("span", { className: "text-xs font-mono text-slate-500", children: "Unstructured Document \u2192 Structured Claims" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex gap-2", children: _jsxs("select", { value: docType, onChange: (e) => setDocType(e.target.value), className: "bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500", children: [_jsx("option", { value: "invoice", children: "Invoice Document" }), _jsx("option", { value: "purchase_order", children: "Purchase Order (PO)" }), _jsx("option", { value: "approval", children: "Executive Approval Memo" }), _jsx("option", { value: "contract", children: "Definitive Legal Contract" }), _jsx("option", { value: "beneficiary_confirmation", children: "Beneficiary Confirmation Letter" })] }) }), _jsx("textarea", { value: rawText, onChange: (e) => setRawText(e.target.value), rows: 6, placeholder: "Paste document text...", className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 leading-relaxed" }), _jsx("button", { onClick: handleAnalyze, disabled: isAnalyzing || !rawText.trim(), className: "px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-all disabled:opacity-50", children: isAnalyzing ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), _jsx("span", { children: "Extracting Claims..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Extract Structured Claims" })] })) })] }), _jsx("div", { className: "p-4 rounded-md bg-[#090d16] border border-[#1e293b] flex flex-col justify-between", children: extraction ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-[#1e293b]", children: [_jsxs("span", { className: "text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), "Extracted Document Claims:"] }), _jsx("span", { className: "text-[10px] font-mono text-slate-500", children: "Grounded by Document" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs font-mono", children: [_jsxs("div", { className: "p-2 rounded bg-[#0f1523] border border-[#1e293b]", children: [_jsx("span", { className: "text-slate-500 text-[10px] block uppercase", children: "Vendor / Counterparty" }), _jsx("span", { className: "font-semibold text-slate-200", children: extraction.vendor_name || 'N/A' })] }), _jsxs("div", { className: "p-2 rounded bg-[#0f1523] border border-[#1e293b]", children: [_jsx("span", { className: "text-slate-500 text-[10px] block uppercase", children: "Amount" }), _jsx("span", { className: "font-bold text-emerald-400", children: extraction.amount ? `$${extraction.amount.toLocaleString()} USD` : 'N/A' })] }), _jsxs("div", { className: "p-2 rounded bg-[#0f1523] border border-[#1e293b]", children: [_jsx("span", { className: "text-slate-500 text-[10px] block uppercase", children: "Reference Number" }), _jsx("span", { className: "font-semibold text-slate-200", children: extraction.invoice_number || extraction.po_number || extraction.contract_ref || 'N/A' })] }), _jsxs("div", { className: "p-2 rounded bg-[#0f1523] border border-[#1e293b]", children: [_jsx("span", { className: "text-slate-500 text-[10px] block uppercase", children: "Signatory / Approver" }), _jsx("span", { className: "font-semibold text-slate-200", children: extraction.approved_by || 'N/A' })] })] }), extraction.claims.length > 0 && (_jsxs("div", { className: "space-y-1 pt-1", children: [_jsx("span", { className: "text-[11px] font-medium text-slate-400", children: "Structured Fact Assertions:" }), _jsx("ul", { className: "text-xs text-slate-300 space-y-1 list-disc list-inside bg-[#0f1523] p-2.5 rounded border border-[#1e293b] font-mono text-[11px]", children: extraction.claims.map((c, i) => (_jsx("li", { children: c }, i))) })] }))] })) : (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8 text-center", children: [_jsx(FileText, { className: "w-7 h-7 text-slate-600 mb-2" }), _jsx("span", { children: "Paste invoice, PO, or approval text on the left and click Extract" })] })) })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "font-semibold text-xs uppercase tracking-wider text-slate-300", children: ["Attached Evidence Repository (", documents.length, " Records)"] }), _jsx("span", { className: "text-xs font-mono text-slate-500", children: "Immutable document ledger" })] }), documents.length === 0 ? (_jsx("div", { className: "p-8 rounded-lg bg-[#0f1523] border border-[#1e293b] text-center text-xs text-slate-400", children: "No external evidence documents attached yet. Documents attached during transaction intake or review will appear here." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: documents.map((doc) => (_jsxs("div", { className: "p-4 rounded-lg bg-[#0f1523] border border-[#1e293b] space-y-2.5 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#1a2336]", children: [_jsx("span", { className: "font-semibold text-xs text-slate-200 truncate", children: doc.title }), _jsx("span", { className: `text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold shrink-0 ${doc.is_verified_evidence
                                                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                                                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'}`, children: doc.is_verified_evidence ? 'Verified Evidence' : 'Extracted Claim' })] }), _jsx("div", { className: "p-2.5 bg-[#090d16] rounded border border-[#1a2336] font-mono text-[11px] text-slate-300 line-clamp-3", children: doc.content })] }), _jsxs("div", { className: "flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-[#1a2336]", children: [_jsxs("span", { children: ["Source: ", doc.source] }), _jsx("span", { children: new Date(doc.created_at).toLocaleDateString() })] })] }, doc.id))) }))] })] }));
};
