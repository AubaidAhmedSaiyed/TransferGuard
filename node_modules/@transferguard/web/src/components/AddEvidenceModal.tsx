import React, { useState } from 'react';
import { FileText, X, Sparkles, Loader2 } from 'lucide-react';
import { api, TransactionDetailResponse } from '../services/api';

interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  vendorName: string;
  onEvidenceAdded: (updated: TransactionDetailResponse) => void;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  isOpen,
  onClose,
  transactionId,
  vendorName,
  onEvidenceAdded
}) => {
  const [docType, setDocType] = useState<string>('invoice');
  const [source, setSource] = useState<string>('user_provided');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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

  const handleApplyPreset = (p: typeof presets[0]) => {
    setDocType(p.type);
    setTitle(p.title);
    setContent(p.content);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

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
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-atmospheric-card border border-slate-800/80 rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-3 border-b border-[#1e293b]">
          <div>
            <h2 className="font-bold text-base text-slate-100">Attach Supporting Evidence</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Attach invoice, purchase order, or approval document for cross-verification
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
            Templates:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="p-2 text-left rounded bg-[#090d16] border border-[#1e293b] hover:border-slate-600 text-xs text-slate-300 transition-colors"
              >
                <div className="font-medium text-slate-200">{p.label}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="invoice">Invoice</option>
                <option value="purchase_order">Purchase Order (PO)</option>
                <option value="approval">Executive Approval / Memo</option>
                <option value="contract">Legal Contract</option>
                <option value="beneficiary_confirmation">Beneficiary Confirmation</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Source System</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="user_provided">User Uploaded</option>
                <option value="internal_record">Internal ERP Record</option>
                <option value="verified_external">External Confirmation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Title / Reference</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acme Supplies Invoice INV-8841"
              className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Document Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Paste raw invoice text, approval memo, or PO details..."
              required
              className="w-full bg-[#090d16] border border-[#1e293b] rounded-md p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-[#161f30] text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Attaching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Attach & Re-Evaluate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
