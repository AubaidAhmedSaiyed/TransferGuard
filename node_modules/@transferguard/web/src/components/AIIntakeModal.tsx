import React, { useState } from 'react';
import { Sparkles, ArrowRight, X, CheckCircle2, Loader2 } from 'lucide-react';
import { api, TransactionDetailResponse } from '../services/api';
import { UnstructuredIntakeExtraction } from '@transferguard/types';

interface AIIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConverted: (detail: TransactionDetailResponse) => void;
}

export const AIIntakeModal: React.FC<AIIntakeModalProps> = ({
  isOpen,
  onClose,
  onConverted
}) => {
  const [inputText, setInputText] = useState(
    "Urgent: Please update Acme Supplies' banking details to First National Bank (routing 071000013, acct ****9174) and process today's invoice INV-8841 for $480,000 immediately."
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const [extraction, setExtraction] = useState<UnstructuredIntakeExtraction | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  if (!isOpen) return null;

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
    if (!inputText.trim()) return;
    setIsExtracting(true);
    try {
      const data = await api.extractIntake(inputText);
      setExtraction(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConvert = async () => {
    if (!extraction) return;
    setIsConverting(true);
    try {
      const result = await api.convertIntakeToTransaction(extraction, inputText);
      onConverted(result);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1523] border border-[#1e293b] rounded-lg max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1e293b]">
          <div>
            <h2 className="font-bold text-base text-slate-100">AI Payment Intake Assistant</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Extract structured claims from unstructured messages for deterministic verification
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Sample Directives:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(p.text);
                  setExtraction(null);
                }}
                className="p-2 text-left rounded bg-[#090d16] border border-[#1e293b] hover:border-slate-600 text-xs text-slate-300 transition-colors line-clamp-2"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Raw Message / Directive Text
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder="Paste raw email, Slack message, or wire memo..."
            className="w-full bg-[#090d16] border border-[#1e293b] rounded-md p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
          />
        </div>

        {/* Action Button: Extract */}
        <div className="flex justify-end">
          <button
            onClick={handleExtract}
            disabled={isExtracting || !inputText.trim()}
            className="px-4 py-2 rounded-md bg-[#161f30] hover:bg-[#1e293b] text-slate-200 border border-[#222f46] text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting Entities...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Extract Structured Claims</span>
              </>
            )}
          </button>
        </div>

        {/* Extraction Results */}
        {extraction && (
          <div className="space-y-3 pt-3 border-t border-[#1e293b]">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Extracted Parameters
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 p-3 rounded-md bg-[#090d16] border border-[#1e293b] font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Counterparty</span>
                <span className="font-semibold text-slate-200">{extraction.vendor_name}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Amount</span>
                <span className="font-bold text-emerald-400">${extraction.amount.toLocaleString()} USD</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Action</span>
                <span className="font-semibold text-amber-300">{extraction.requested_action}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Invoice</span>
                <span className="text-slate-300">{extraction.invoice_number || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Account</span>
                <span className="text-slate-300">{extraction.beneficiary_account_masked || '****9174'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Urgency</span>
                <span className="font-semibold uppercase text-rose-400">{extraction.urgency}</span>
              </div>
            </div>

            {/* Confidence Notes */}
            {extraction.confidence_notes && (
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-slate-400">
                  Signals & Extraction Lineage:
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside bg-[#090d16] p-2.5 rounded border border-[#1e293b] font-mono text-[11px]">
                  {extraction.confidence_notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Convert & Evaluate Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={handleConvert}
                disabled={isConverting}
                className="px-4 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating via Decision Engine...</span>
                  </>
                ) : (
                  <>
                    <span>Submit to Decision Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
