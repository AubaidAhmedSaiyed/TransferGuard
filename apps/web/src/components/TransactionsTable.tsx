import React, { useState } from 'react';
import { TransactionSummaryItem } from '../services/api';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Search, 
  ArrowRight,
  Plus
} from 'lucide-react';

interface TransactionsTableProps {
  transactions: TransactionSummaryItem[];
  onSelectTx: (id: string) => void;
  selectedId: string | null;
  onOpenCreateModal?: () => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onSelectTx,
  selectedId,
  onOpenCreateModal
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTION_REQUIRED' | 'ALLOW' | 'VERIFY' | 'BLOCK' | 'USER_CREATED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(tx => {
    if (filter === 'ACTION_REQUIRED' && tx.current_decision === 'ALLOW') return false;
    if (filter === 'ALLOW' && tx.current_decision !== 'ALLOW') return false;
    if (filter === 'VERIFY' && tx.current_decision !== 'VERIFY') return false;
    if (filter === 'BLOCK' && tx.current_decision !== 'BLOCK') return false;
    if (filter === 'USER_CREATED' && !tx.is_user_created) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        tx.tx_code.toLowerCase().includes(term) ||
        tx.vendor_name.toLowerCase().includes(term) ||
        tx.requestor_name.toLowerCase().includes(term) ||
        tx.purpose.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getStatusBadge = (decision: 'ALLOW' | 'VERIFY' | 'BLOCK') => {
    switch (decision) {
      case 'ALLOW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3" /> ALLOW
          </span>
        );
      case 'VERIFY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">
            <AlertCircle className="w-3 h-3" /> VERIFY
          </span>
        );
      case 'BLOCK':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-800/60">
            <XCircle className="w-3 h-3" /> BLOCK
          </span>
        );
    }
  };

  const getExceptionNote = (tx: TransactionSummaryItem) => {
    if (tx.current_decision === 'BLOCK') {
      return <span className="text-rose-400">Critical verification failure</span>;
    }
    if (tx.current_decision === 'VERIFY') {
      return <span className="text-amber-300">Beneficiary coordinates unverified</span>;
    }
    if (tx.amount >= 1000000) {
      return <span className="text-slate-400">High-value governance verified</span>;
    }
    return <span className="text-slate-500">Standard operational disbursement</span>;
  };

  return (
    <div className="rounded-lg bg-atmospheric-card border border-slate-800/80 overflow-hidden shadow-sm">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-[#1e293b] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
            <span>Transaction Review Queue</span>
            <span className="text-xs font-normal text-slate-400">({filtered.length} of {transactions.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-transfer evaluation of originations, supporting evidence, and compliance policies
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search vendor, ID, requestor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-56 bg-[#090d16] border border-[#1e293b] rounded-md pl-8.5 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-[#090d16] p-1 rounded-md border border-[#1e293b] text-xs">
            {(['ALL', 'ACTION_REQUIRED', 'ALLOW', 'USER_CREATED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap text-[11px] ${
                  filter === tab
                    ? 'bg-[#161f30] text-slate-100 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'ACTION_REQUIRED' ? 'Action Required' : tab === 'USER_CREATED' ? 'Custom' : tab}
              </button>
            ))}
          </div>

          {onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#090d16] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3 font-semibold">Transaction ID</th>
              <th className="px-4 py-3 font-semibold">Counterparty</th>
              <th className="px-4 py-3 font-semibold text-right">Amount (USD)</th>
              <th className="px-4 py-3 font-semibold">Decision</th>
              <th className="px-4 py-3 font-semibold">Risk & Exception Analysis</th>
              <th className="px-4 py-3 font-semibold">Evidence Status</th>
              <th className="px-4 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-[#161f30] border border-[#1e293b] flex items-center justify-center text-slate-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-semibold text-slate-200">No Transactions Found</div>
                    <p className="text-xs text-slate-400">
                      {transactions.length === 0 
                        ? 'No transfer requests have been submitted to this workspace yet.'
                        : 'No transactions match the selected filter criteria.'}
                    </p>
                    {onOpenCreateModal && (
                      <button
                        onClick={onOpenCreateModal}
                        className="mt-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Transfer Request</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isSelected = selectedId === tx.id;
                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTx(tx.id)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? 'bg-[#161f30] border-l-2 border-l-emerald-400'
                        : 'hover:bg-[#121826]'
                    }`}
                  >
                    <td className="px-4 py-3.5 font-mono text-slate-300 font-medium group-hover:text-emerald-300">
                      <div className="flex items-center gap-1.5">
                        <span>{tx.tx_code}</span>
                        {tx.is_user_created && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-sans">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-200 group-hover:text-white">
                        {tx.vendor_name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {tx.purpose}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-100">
                      ${tx.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-sans">{tx.currency}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      {getStatusBadge(tx.current_decision)}
                    </td>

                    <td className="px-4 py-3.5 text-xs">
                      {getExceptionNote(tx)}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px]">
                      <span className="text-emerald-400 font-semibold">{tx.evidence_summary?.verified_count || 0}</span>
                      <span className="text-slate-500"> / {tx.evidence_summary?.total || 0} checks</span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTx(tx.id);
                        }}
                        className="p-1 rounded text-slate-400 group-hover:text-emerald-300 transition-colors"
                        title="View Transaction Detail"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
