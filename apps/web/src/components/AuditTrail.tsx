import React from 'react';
import { AuditLogEntry } from '@transferguard/types';
import { ShieldCheck, User } from 'lucide-react';

interface AuditTrailProps {
  logs: AuditLogEntry[];
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ logs }) => {
  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'ALLOW':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-mono">
            ALLOW
          </span>
        );
      case 'VERIFY':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60 font-mono">
            VERIFY
          </span>
        );
      case 'BLOCK':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-800/60 font-mono">
            BLOCK
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
            {decision || 'PENDING'}
          </span>
        );
    }
  };

  return (
    <div className="rounded-lg bg-atmospheric-card border border-slate-800/80 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            Immutable Audit Trail & Decision Lineage
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {logs.length} logged event{logs.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-[#1e293b]">
        {logs.map((log, index) => {
          const isLatest = index === logs.length - 1;
          return (
            <div key={log.id} className="relative pl-7 text-xs">
              {/* Timeline Dot */}
              <div
                className={`absolute left-3 top-1.5 w-2 h-2 rounded-full -translate-x-1/2 ${
                  isLatest
                    ? log.decision_snapshot === 'ALLOW'
                      ? 'bg-emerald-400 ring-2 ring-emerald-500/20'
                      : log.decision_snapshot === 'VERIFY'
                      ? 'bg-amber-400 ring-2 ring-amber-500/20'
                      : log.decision_snapshot === 'BLOCK'
                      ? 'bg-rose-400 ring-2 ring-rose-500/20'
                      : 'bg-slate-400'
                    : 'bg-slate-600'
                }`}
              />

              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono text-slate-400">
                    {log.time_offset_label || new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="font-semibold text-slate-200">{log.action}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{log.actor}</span>
                  <div className="ml-auto">{getDecisionBadge(log.decision_snapshot)}</div>
                </div>

                <div className="text-slate-300 text-xs leading-relaxed bg-[#090d16] p-2.5 rounded border border-[#1a2336] font-mono text-[11px]">
                  {log.details}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
