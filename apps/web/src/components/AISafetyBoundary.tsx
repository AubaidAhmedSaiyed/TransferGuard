import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AISafetyBoundaryProps {
  compact?: boolean;
}

export const AISafetyBoundary: React.FC<AISafetyBoundaryProps> = () => {
  return (
    <div className="rounded-lg bg-atmospheric-card border border-slate-800/80 px-4 py-2.5 text-xs text-slate-300 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-slate-400">AI:</span> Interpretation only
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Policy Engine:</span> Final decision authority
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-slate-400">Human:</span> Required for unresolved actions
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="text-slate-400">Execution:</span> Never performed by AI
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 md:border-l md:border-[#1e293b] md:pl-3 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>AI can understand. <strong className="text-slate-200 font-semibold">Evidence must authorize.</strong></span>
        </div>
      </div>
    </div>
  );
};
