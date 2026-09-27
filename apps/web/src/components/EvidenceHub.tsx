import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Loader2
} from 'lucide-react';
import { EvidenceDocument, AIDocumentExtraction } from '@transferguard/types';
import { api } from '../services/api';
import { AISafetyBoundary } from './AISafetyBoundary';

export const EvidenceHub: React.FC = () => {
  const [documents, setDocuments] = useState<EvidenceDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Standalone Document Analyzer
  const [docType, setDocType] = useState('invoice');
  const [rawText, setRawText] = useState(
    "INVOICE #INV-8841\nVendor: Acme Supplies\nDate: 2026-09-22\nAmount: $480,000.00 USD\nDescription: Automated Conveyor Staging Module B-7\nApproved by: Sarah Chen (Senior Procurement)"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extraction, setExtraction] = useState<AIDocumentExtraction | null>(null);

  const loadEvidence = async () => {
    try {
      setLoading(true);
      const docs = await api.getAllEvidence();
      setDocuments(docs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvidence();
  }, []);

  const handleAnalyze = async () => {
    if (!rawText.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await api.analyzeEvidenceText(rawText, docType);
      setExtraction(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-100">Enterprise Evidence & Fact Extraction</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded facts, cross-system document extraction, and immutable provenance records
          </p>
        </div>
      </div>

      <AISafetyBoundary compact />

      {/* Standalone Document Extraction Tool */}
      <div className="rounded-lg bg-[#0f1523] border border-[#1e293b] p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1a2336]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-200">
              Document Claim Extractor
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Unstructured Document → Structured Claims
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="flex gap-2">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="invoice">Invoice Document</option>
                <option value="purchase_order">Purchase Order (PO)</option>
                <option value="approval">Executive Approval Memo</option>
                <option value="contract">Definitive Legal Contract</option>
                <option value="beneficiary_confirmation">Beneficiary Confirmation Letter</option>
              </select>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={6}
              placeholder="Paste document text..."
              className="w-full bg-[#090d16] border border-[#1e293b] rounded-md p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"
            />

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !rawText.trim()}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting Claims...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Extract Structured Claims</span>
                </>
              )}
            </button>
          </div>

          {/* Extracted Facts View */}
          <div className="p-4 rounded-md bg-[#090d16] border border-[#1e293b] flex flex-col justify-between">
            {extraction ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Extracted Document Claims:
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Grounded by Document
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-[#0f1523] border border-[#1e293b]">
                    <span className="text-slate-500 text-[10px] block uppercase">Vendor / Counterparty</span>
                    <span className="font-semibold text-slate-200">{extraction.vendor_name || 'N/A'}</span>
                  </div>
                  <div className="p-2 rounded bg-[#0f1523] border border-[#1e293b]">
                    <span className="text-slate-500 text-[10px] block uppercase">Amount</span>
                    <span className="font-bold text-emerald-400">
                      {extraction.amount ? `$${extraction.amount.toLocaleString()} USD` : 'N/A'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#0f1523] border border-[#1e293b]">
                    <span className="text-slate-500 text-[10px] block uppercase">Reference Number</span>
                    <span className="font-semibold text-slate-200">
                      {extraction.invoice_number || extraction.po_number || extraction.contract_ref || 'N/A'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#0f1523] border border-[#1e293b]">
                    <span className="text-slate-500 text-[10px] block uppercase">Signatory / Approver</span>
                    <span className="font-semibold text-slate-200">{extraction.approved_by || 'N/A'}</span>
                  </div>
                </div>

                {extraction.claims.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-medium text-slate-400">
                      Structured Fact Assertions:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside bg-[#0f1523] p-2.5 rounded border border-[#1e293b] font-mono text-[11px]">
                      {extraction.claims.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8 text-center">
                <FileText className="w-7 h-7 text-slate-600 mb-2" />
                <span>Paste invoice, PO, or approval text on the left and click Extract</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enterprise Attached Evidence Ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-300">
            Attached Evidence Repository ({documents.length} Records)
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Immutable document ledger
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 rounded-lg bg-[#0f1523] border border-[#1e293b] text-center text-xs text-slate-400">
            No external evidence documents attached yet. Documents attached during transaction intake or review will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-lg bg-[#0f1523] border border-[#1e293b] space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#1a2336]">
                    <span className="font-semibold text-xs text-slate-200 truncate">{doc.title}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold shrink-0 ${
                      doc.is_verified_evidence
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                    }`}>
                      {doc.is_verified_evidence ? 'Verified Evidence' : 'Extracted Claim'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#090d16] rounded border border-[#1a2336] font-mono text-[11px] text-slate-300 line-clamp-3">
                    {doc.content}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-[#1a2336]">
                  <span>Source: {doc.source}</span>
                  <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
