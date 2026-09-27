import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Loader2,
  Lock,
  UserCheck
} from 'lucide-react';
import { api, TransactionSummaryItem, TransactionDetailResponse } from '../services/api';
import { useRouter } from '../context/RouterContext';
import { VerificationModal } from '../components/VerificationModal';

export const ApprovalsPage: React.FC = () => {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState<TransactionSummaryItem[]>([]);
  const [selectedTxForVerify, setSelectedTxForVerify] = useState<{ id: string; tx_code: string; vendor_name: string; amount: number } | null>(null);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const all = await api.getTransactions();
      const verifyList = all.filter(t => t.current_decision === 'VERIFY' || t.lifecycle_state === 'REQUIRES_HUMAN_CALL');
      setPendingApprovals(verifyList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleVerified = async (updated: TransactionDetailResponse) => {
    setSelectedTxForVerify(null);
    await loadApprovals();
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">Approvals & Verification Queue</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {pendingApprovals.length} Pending Actions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Transfers flagged for out-of-band beneficiary callbacks, dual-control sign-offs, or urgency overrides.
          </p>
        </div>

        <button
          onClick={loadApprovals}
          className="px-3 py-1.5 rounded-md bg-[#161f30] hover:bg-[#1f2c42] text-slate-300 text-xs font-medium border border-[#2a3a55] transition-colors"
        >
          Refresh Queue
        </button>
      </div>

      {/* Approvals Table / Card List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
          <span className="text-xs font-mono">Loading pending approvals...</span>
        </div>
      ) : pendingApprovals.length === 0 ? (
        <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">No Transfers Awaiting Verification</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            All submitted payment instructions have met active deterministic policies or have been reconciled.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingApprovals.map((tx) => (
            <div
              key={tx.id}
              className="p-5 rounded-xl bg-[#0f1523] border border-amber-900/40 hover:border-amber-700/60 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">{tx.tx_code}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                    REVIEW REQUIRED
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{tx.vendor_name}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Purpose: <span className="text-slate-300">{tx.purpose}</span> • Requestor: <span className="text-slate-300">{tx.requestor_name}</span>
                </div>
                <div className="text-xs text-amber-300 flex items-center gap-1.5 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Beneficiary account changed or dual-control threshold exceeded. Out-of-band verification required.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                <div className="text-left sm:text-right">
                  <div className="font-mono text-base font-bold text-slate-100">
                    ${tx.amount.toLocaleString()} <span className="text-xs font-sans text-slate-400">{tx.currency}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {tx.evidence_summary?.verified_count || 0} / {tx.evidence_summary?.total || 0} checks passed
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTxForVerify({ id: tx.id, tx_code: tx.tx_code, vendor_name: tx.vendor_name, amount: tx.amount })}
                    className="px-3.5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Perform Callback</span>
                  </button>

                  <button
                    onClick={() => navigate(`/app/transfers/${tx.id}`)}
                    className="p-2 rounded-md bg-[#161f30] hover:bg-[#1f2c42] border border-[#2a3a55] text-slate-300 transition-colors"
                    title="Inspect Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification Modal */}
      {selectedTxForVerify && (
        <VerificationModal
          isOpen={true}
          onClose={() => setSelectedTxForVerify(null)}
          onConfirm={async (data) => {
            await api.verifyBeneficiary(selectedTxForVerify.id, data);
            setSelectedTxForVerify(null);
            await loadApprovals();
          }}
          amount={selectedTxForVerify.amount || 0}
        />
      )}
    </div>
  );
};
