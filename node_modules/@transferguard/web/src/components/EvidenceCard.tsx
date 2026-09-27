import React from 'react';
import { EvidenceItem } from '@transferguard/types';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Building2, 
  UserCheck, 
  CreditCard, 
  Scale
} from 'lucide-react';

interface EvidenceCardProps {
  evidence: EvidenceItem;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
  const getIcon = () => {
    switch (evidence.type) {
      case 'invoice_match':
        return <FileText className="w-3.5 h-3.5" />;
      case 'po_match':
        return <FileText className="w-3.5 h-3.5" />;
      case 'vendor_verified':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'requestor_auth':
        return <UserCheck className="w-3.5 h-3.5" />;
      case 'beneficiary_match':
        return <CreditCard className="w-3.5 h-3.5" />;
      case 'approval_governance':
        return <Scale className="w-3.5 h-3.5" />;
      default:
        return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const getStatusBadge = () => {
    switch (evidence.status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </span>
        );
      case 'unresolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">
            <AlertCircle className="w-3 h-3" /> HOLD
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-800/60">
            <XCircle className="w-3 h-3" /> FAILED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 rounded-lg bg-atmospheric-card border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between shadow-sm">
      <div>
        {/* Header: Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#1a2336]">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <span className="text-slate-400">{getIcon()}</span>
            <span className="text-[11px] text-slate-400 font-sans">{evidence.category}</span>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-xs text-slate-100">{evidence.title}</h4>

        {/* Claim / Description */}
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{evidence.description}</p>

        {/* Details snippet */}
        {evidence.details && (
          <div className="mt-2.5 p-2 rounded bg-[#090d16] border border-[#1a2336] text-[11px] text-slate-300 font-mono">
            {evidence.details}
          </div>
        )}
      </div>

      {/* Provenance Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#1a2336] flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[200px]" title={evidence.source}>
          Source: <strong className="text-slate-300 font-medium">{evidence.source}</strong>
        </span>
        <span className="font-mono text-[10px] text-slate-500">{evidence.provenance_id}</span>
      </div>
    </div>
  );
};
