import React from 'react';
import { DashboardMetrics } from '@transferguard/types';
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  ShieldCheck,
  Clock
} from 'lucide-react';

interface MetricsBarProps {
  metrics: DashboardMetrics | null;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="h-24 rounded-lg bg-[#0f1523] border border-[#1e293b] animate-pulse" />
    );
  }

  const attentionRequiredCount = (metrics.verify_required_count || metrics.awaiting_verification_count || 0) + (metrics.blocked_count || 0);

  return (
    <div className="rounded-lg bg-[#0f1523] border border-[#1e293b] p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#1e293b]">
        {/* Operational Attention */}
        <div className="flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-400">
            Action Required
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-sans ${attentionRequiredCount > 0 ? 'text-amber-400' : 'text-slate-100'}`}>
              {attentionRequiredCount}
            </span>
            <span className="text-xs text-slate-400">
              transaction{attentionRequiredCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{metrics.verify_required_count || metrics.awaiting_verification_count || 0} Verify</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <XCircle className="w-3.5 h-3.5" />
              <span>{metrics.blocked_count} Block</span>
            </span>
          </div>
        </div>

        {/* Approved Transfers */}
        <div className="pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-400">
            Approved & Verified
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-sans text-emerald-400">
              {metrics.allowed_count}
            </span>
            <span className="text-xs text-slate-400">
              of {metrics.transactions_reviewed} total
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Fully grounded by verified evidence</span>
          </div>
        </div>

        {/* Exposure Under Review */}
        <div className="pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-400">
            Total Exposure Evaluated
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold font-sans text-slate-100">
              ${(metrics.total_exposure_reviewed / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-slate-400 ml-1.5">USD</span>
          </div>
          <div className="text-xs text-slate-400">
            Across all pending & processed transfers
          </div>
        </div>

        {/* Real-Time Decision Enforcement */}
        <div className="pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-400">
            Policy Engine Status
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-sans text-slate-100">
              Active
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              • 6 Rules Enforced
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Deterministic evaluation &lt; 50ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
