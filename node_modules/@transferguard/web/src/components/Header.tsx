import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Plus, 
  Sparkles,
  SlidersHorizontal,
  Layers,
  FileClock,
  LayoutGrid
} from 'lucide-react';
import { api } from '../services/api';

export type ActiveNavTab = 'dashboard' | 'transactions' | 'policies' | 'evidence' | 'audit';

interface HeaderProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  onReset: () => void;
  onOpenCreateTransaction: () => void;
  selectedTxId: string | null;
  onSelectTx: (id: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onReset,
  onOpenCreateTransaction,
  selectedTxId,
  onSelectTx
}) => {
  const [aiStatus, setAiStatus] = useState<{ online: boolean; model: string } | null>(null);

  useEffect(() => {
    api.getAIStatus().then(res => setAiStatus(res)).catch(() => {});
  }, []);

  return (
    <header className="border-b border-[#1e293b] bg-[#090d16]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => {
              onSelectTx(null);
              onTabChange('dashboard');
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base text-slate-100 tracking-tight group-hover:text-white">
                TransferGuard
              </span>
              <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                Pre-Transfer Verification
              </span>
            </div>
          </button>

          {/* Primary Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('dashboard');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'dashboard' && !selectedTxId
                  ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('transactions');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'transactions' || selectedTxId
                  ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Transactions</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('policies');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'policies'
                  ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Policies</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('evidence');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'evidence'
                  ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Evidence</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('audit');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'audit'
                  ? 'bg-[#161f30] text-slate-100 font-semibold border border-[#222f46]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileClock className="w-3.5 h-3.5" />
              <span>Audit Log</span>
            </button>
          </nav>
        </div>

        {/* Global Right Controls */}
        <div className="flex items-center gap-3">
          {/* AI Engine Status (Subtle) */}
          {aiStatus && (
            <div 
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0f1523] border border-[#1e293b] text-[11px] text-slate-400 font-mono"
              title={aiStatus.online ? `Connected to local LLM: ${aiStatus.model}` : 'Local deterministic heuristic engine active'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${aiStatus.online ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              <span>{aiStatus.online ? `Ollama (${aiStatus.model})` : 'Local Heuristic Engine'}</span>
            </div>
          )}

          {/* Reset Baseline */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#161f30] border border-transparent hover:border-[#1e293b] text-xs transition-colors"
            title="Reset to pristine baseline state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Primary CTA: Create Transaction */}
          <button
            onClick={onOpenCreateTransaction}
            className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Transaction</span>
          </button>
        </div>
      </div>
    </header>
  );
};
