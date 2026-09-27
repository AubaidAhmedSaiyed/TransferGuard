import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Plus, 
  Layers, 
  PhoneCall,
  SlidersHorizontal,
  Clock,
  Sparkles,
  Inbox
} from 'lucide-react';
import { TransactionSummaryItem } from '../services/api';
import { DashboardMetrics } from '@transferguard/types';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

interface OverviewPageProps {
  metrics: DashboardMetrics | null;
  transactions: TransactionSummaryItem[];
  onSelectTx: (id: string) => void;
  onLoadSampleData?: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  metrics,
  transactions,
  onSelectTx,
  onLoadSampleData
}) => {
  const { user, org } = useAuth();
  const { navigate } = useRouter();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Operator';
  const needsAttentionList = transactions.filter(t => t.current_decision === 'VERIFY' || t.lifecycle_state === 'REQUIRES_HUMAN_CALL');
  const readyList = transactions.filter(t => t.current_decision === 'ALLOW');
  const blockedList = transactions.filter(t => t.current_decision === 'BLOCK');

  const totalExposure = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  // If new organization has 0 transactions: Clean Atmospheric Empty State
  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        {/* Welcome Banner with Soft Atmospheric Gradient */}
        <div className="bg-gradient-to-r from-[#0f172a]/90 via-[#0d1627]/80 to-[#0a101d]/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-100">
              Good day, {firstName}.
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Welcome to <span className="text-emerald-400 font-semibold">{org?.name || 'your Organization'}</span> TransferGuard Control Layer.
            </p>
          </div>

          <button
            onClick={() => navigate('/app/transfers/new')}
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Transfer Request</span>
          </button>
        </div>

        {/* Clean Empty State Card with Soft Environmental Radial Background */}
        <div className="bg-atmospheric-empty border border-slate-800/80 rounded-2xl p-12 text-center shadow-lg backdrop-blur-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#192338] to-[#101726] border border-slate-700/60 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-sm">
            <Inbox className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-slate-100">Your transfer workspace is ready.</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1.5 leading-relaxed">
            No transfers have been reviewed yet. Submit a wire request, ingest an invoice, or connect your payment pipeline to begin runtime verification.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/app/transfers/new')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Transfer</span>
            </button>

            <button
              onClick={() => navigate('/app/integrations')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#141d2e] hover:bg-[#1a263d] text-slate-200 border border-[#22314d] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Connect an Integration</span>
            </button>
          </div>

          {onLoadSampleData && (
            <div className="mt-8 pt-6 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-500 mr-2">Evaluating the platform?</span>
              <button
                onClick={onLoadSampleData}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2"
              >
                Load sample workspace transfers
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Welcome Greeting with Soft Atmospheric Gradient */}
      <div className="bg-gradient-to-r from-[#0f172a]/90 via-[#0d1627]/80 to-[#0a101d]/90 border border-slate-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-100">
            Good day, {firstName}.
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Transfer control overview for <span className="text-emerald-400 font-semibold">{org?.name || 'Corporate Treasury'}</span>.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/transfers/new')}
          className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Transfer</span>
        </button>
      </div>

      {/* Operational Metric Cards with Soft Gradient Surfaces */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-b from-[#161722] to-[#0c0f1a] border border-amber-900/40 shadow-sm">
          <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">Needs Attention</div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {needsAttentionList.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verification required</div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-b from-[#0f1b1c] to-[#0a1114] border border-emerald-900/40 shadow-sm">
          <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Ready</div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {readyList.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Policy compliant</div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-b from-[#1b1014] to-[#120a0d] border border-rose-900/40 shadow-sm">
          <div className="text-[10px] font-mono text-rose-400 uppercase tracking-wider font-semibold">Blocked</div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {blockedList.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Violations held</div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-b from-[#0e1628] to-[#0a0f1c] border border-slate-800/80 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Review Volume</div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
            ${(totalExposure / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Total exposure</div>
        </div>
      </div>

      {/* Needs Your Attention Section (if any) */}
      {needsAttentionList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Needs Your Attention ({needsAttentionList.length})</span>
            </h3>
            <button
              onClick={() => navigate('/app/approvals')}
              className="text-xs text-slate-400 hover:text-slate-200 font-medium"
            >
              View Approvals Queue →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {needsAttentionList.map(tx => (
              <div
                key={tx.id}
                onClick={() => onSelectTx(tx.id)}
                className="p-4 rounded-xl bg-gradient-to-b from-[#14121a] to-[#0c0d14] border border-amber-900/50 hover:border-amber-600/70 transition-colors cursor-pointer group flex items-start justify-between gap-3 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-100 group-hover:text-amber-300">{tx.vendor_name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{tx.tx_code}</span>
                  </div>
                  <div className="text-xs text-amber-300">
                    Beneficiary coordinates changed. Telephone callback required.
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Amount: <span className="text-slate-200 font-bold">${tx.amount.toLocaleString()} {tx.currency}</span>
                  </div>
                </div>

                <button className="text-xs font-semibold text-amber-400 group-hover:text-white flex items-center gap-1 shrink-0 mt-1">
                  <span>Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity / All Transfers Table summary */}
      <div className="rounded-2xl bg-atmospheric-card border border-slate-800/80 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Recent Transfer Control Activity</h3>
            <p className="text-xs text-slate-400 mt-0.5">Evaluated originations and evidence status</p>
          </div>
          <button
            onClick={() => navigate('/app/transfers')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            View Full Queue ({transactions.length}) →
          </button>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {transactions.slice(0, 5).map(tx => (
            <div
              key={tx.id}
              onClick={() => onSelectTx(tx.id)}
              className="py-3 flex items-center justify-between hover:bg-[#12192a] px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-400">{tx.tx_code}</span>
                <span className="font-medium text-slate-200">{tx.vendor_name}</span>
                <span className="text-slate-500 text-[11px] hidden sm:inline">• {tx.purpose}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono font-semibold text-slate-100">${tx.amount.toLocaleString()}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  tx.current_decision === 'ALLOW' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : tx.current_decision === 'VERIFY' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {tx.current_decision}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
