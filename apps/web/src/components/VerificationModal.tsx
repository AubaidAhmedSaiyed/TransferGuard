import React, { useState } from 'react';
import { PhoneCall, X, CheckCircle2, Loader2 } from 'lucide-react';
import { Vendor, BankAccount } from '@transferguard/types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    verification_method: string;
    confirmed_by: string;
    confirmed_role: string;
    statement: string;
    reason: string;
    notes?: string;
  }) => Promise<void>;
  vendor?: Vendor;
  bankAccount?: BankAccount;
  amount: number;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  vendor,
  bankAccount,
  amount
}) => {
  const [method, setMethod] = useState('trusted_callback');
  const [confirmedBy, setConfirmedBy] = useState('Sarah Chen');
  const [confirmedRole, setConfirmedRole] = useState('Senior Procurement Specialist');
  const [statement, setStatement] = useState(
    `I confirm that destination account ${bankAccount?.account_number_masked || '****9174'} at ${bankAccount?.bank_name || 'First National Bank'} is the authorized beneficiary account for ${vendor?.name || 'Acme Supplies'}.`
  );
  const [reason, setReason] = useState('Vendor beneficiary update confirmed via trusted callback.');
  const [notes, setNotes] = useState('Spoke directly with authorized contact on vendor master file.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleMethodChange = (newMethod: string) => {
    setMethod(newMethod);
    if (newMethod === 'trusted_callback') {
      setStatement(`I confirm that destination account ${bankAccount?.account_number_masked || '****9174'} is the authorized beneficiary for ${vendor?.name || 'Vendor'}.`);
      setReason(`Confirmed via out-of-band telephone callback to established contact.`);
    } else if (newMethod === 'executive_override') {
      setConfirmedBy('Marcus Vance');
      setConfirmedRole('Chief Financial Officer (CFO)');
      setStatement(`As CFO, I authorize this high-consequence disbursement of $${amount.toLocaleString()} USD under executive delegation DOA-2026.`);
      setReason('Executive Treasury Dual Sign-off completed.');
    } else if (newMethod === 'board_resolution') {
      setStatement(`Disbursement authenticated against unanimous Board Resolution #BR-2026-088 and executed Definitive Agreement.`);
      setReason('Corporate Secretarial Governance Minutes verified.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-atmospheric-card border border-slate-800/80 rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1e293b]">
          <div>
            <h2 className="font-bold text-base text-slate-100">Targeted Intent Verification</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Confirm out-of-band contact or executive sign-off to authorize release
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Method Selector */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Verification Method
            </label>
            <select
              value={method}
              onChange={(e) => handleMethodChange(e.target.value)}
              className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="trusted_callback">Out-of-Band Callback to Established Vendor Contact</option>
              <option value="executive_override">Executive Sign-Off / CFO Authorization</option>
              <option value="board_resolution">Board Resolution & Custody Agreement Match</option>
              <option value="manual_confirmation">Manual Finance Controller Attestation</option>
            </select>
          </div>

          {/* Trusted Contact Box (when callback) */}
          {method === 'trusted_callback' && vendor && (
            <div className="p-3 rounded-md bg-[#090d16] border border-[#1e293b] text-xs space-y-1">
              <div className="text-slate-400">Authoritative Vendor Master Contact on File:</div>
              <div className="font-mono text-emerald-400 font-semibold">{vendor.trusted_contact_name} ({vendor.trusted_contact_phone})</div>
            </div>
          )}

          {/* Verification Statement */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Verification Statement / Attestation
            </label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows={3}
              required
              className="w-full bg-[#090d16] border border-[#1e293b] rounded-md p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Confirmed By</label>
              <input
                type="text"
                value={confirmedBy}
                onChange={(e) => setConfirmedBy(e.target.value)}
                required
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Role / Title</label>
              <input
                type="text"
                value={confirmedRole}
                onChange={(e) => setConfirmedRole(e.target.value)}
                required
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Audit Notes</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-md bg-[#161f30] text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !statement.trim()}
              className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Recording Verification...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Verification & Re-Evaluate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
