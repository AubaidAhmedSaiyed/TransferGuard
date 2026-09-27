import React, { useState } from 'react';
import { TransactionDetailResponse, api } from '../services/api';
import { EvidenceCard } from './EvidenceCard';
import { AuditTrail } from './AuditTrail';
import { VerificationModal } from './VerificationModal';
import { AddEvidenceModal } from './AddEvidenceModal';
import { AISafetyBoundary } from './AISafetyBoundary';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  PhoneCall, 
  RotateCw, 
  ArrowLeft,
  Terminal,
  ChevronDown,
  ChevronUp,
  Plus,
  SlidersHorizontal,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface TransactionDetailProps {
  data: TransactionDetailResponse;
  onBack: () => void;
  onUpdated: (updated: TransactionDetailResponse) => void;
}

export const TransactionDetail: React.FC<TransactionDetailProps> = ({
  data,
  onBack,
  onUpdated
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [isReevaluating, setIsReevaluating] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const { payment, vendor, bankAccount, evidences, evaluation, auditLogs } = data;

  const handleReevaluate = async () => {
    setIsReevaluating(true);
    try {
      const updated = await api.evaluateTransaction(payment.id);
      onUpdated(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReevaluating(false);
    }
  };

  const handleVerifyBeneficiary = async (verifyParams: any) => {
    const updated = await api.verifyBeneficiary(payment.id, verifyParams);
    onUpdated(updated);
  };

  const renderDecisionPanel = () => {
    const decision = evaluation.decision;
    const isAllow = decision === 'ALLOW';
    const isVerify = decision === 'VERIFY';
    const isBlock = decision === 'BLOCK';

    return (
      <div className={`p-6 rounded-lg border ${
        isAllow 
          ? 'bg-[#0b161c] border-emerald-500/40' 
          : isVerify 
          ? 'bg-[#181512] border-amber-500/50' 
          : 'bg-[#181013] border-rose-500/50'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
              isAllow 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : isVerify 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              {isAllow && <CheckCircle2 className="w-7 h-7" />}
              {isVerify && <AlertCircle className="w-7 h-7" />}
              {isBlock && <XCircle className="w-7 h-7" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className={`text-xl font-bold font-sans tracking-tight ${
                  isAllow ? 'text-emerald-400' : isVerify ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {decision}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-medium">
                  {isAllow ? 'Payment Allowed & Fully Supported' : isVerify ? 'Targeted Verification Required' : 'Payment Execution Blocked'}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-100">
                {evaluation.headline}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {evaluation.summary}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-center">
            {isVerify && (
              <button
                onClick={() => setIsVerifying(true)}
                className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Verify Beneficiary</span>
              </button>
            )}

            <button
              onClick={handleReevaluate}
              disabled={isReevaluating}
              className="px-3.5 py-2 rounded-md bg-[#0f1523] hover:bg-[#161f30] text-xs font-medium text-slate-200 border border-[#1e293b] flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isReevaluating ? 'animate-spin' : ''}`} />
              <span>Re-evaluate</span>
            </button>
          </div>
        </div>

        {evaluation.safety_principle_note && (
          <div className={`mt-4 pt-3 border-t text-xs font-medium flex items-center gap-2 ${
            isAllow ? 'border-emerald-900/30 text-emerald-300' : isVerify ? 'border-amber-900/30 text-amber-300' : 'border-rose-900/30 text-rose-300'
          }`}>
            <span>Principle: {evaluation.safety_principle_note}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-md bg-[#0f1523] border border-[#1e293b] hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-colors"
            title="Back to queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-slate-400">{payment.tx_code}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans">
                {payment.payment_method.toUpperCase()} · Initiated by {payment.requestor_name} ({payment.requestor_role})
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mt-0.5">
              {payment.vendor_name}
            </h1>
          </div>
        </div>

        {/* Large Amount */}
        <div className="text-left sm:text-right">
          <div className="text-3xl font-bold font-sans text-slate-100 tracking-tight">
            ${payment.amount.toLocaleString()} <span className="text-base font-normal text-slate-400">{payment.currency}</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Destination: {payment.destination_bank_name} ({payment.destination_account_masked})
          </div>
        </div>
      </div>

      {/* ONE Dominant Decision Panel */}
      {renderDecisionPanel()}

      {/* Compact Architectural Strip */}
      <AISafetyBoundary compact />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Transaction Context & Reconciled Evidence (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Structured Transaction Parameters */}
          <div className="rounded-lg bg-atmospheric-card border border-slate-800/80 p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-xs text-slate-300 uppercase tracking-wider">
              Transaction Parameters
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Counterparty</span>
                <span className="font-semibold text-slate-200">{payment.vendor_name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Amount</span>
                <span className="font-semibold text-slate-200 font-mono">${payment.amount.toLocaleString()} {payment.currency}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Transfer Method</span>
                <span className="font-semibold text-slate-200 uppercase">{payment.payment_method}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Destination Bank</span>
                <span className="font-semibold text-slate-200">{payment.destination_bank_name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Destination Account</span>
                <span className="font-semibold text-slate-200 font-mono">{payment.destination_account_masked}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Requestor</span>
                <span className="font-semibold text-slate-200">{payment.requestor_name}</span>
              </div>
              <div className="col-span-2 sm:col-span-3 pt-2 border-t border-[#1a2336]">
                <span className="text-slate-400 text-[11px] block">Stated Purpose</span>
                <span className="text-slate-300">{payment.purpose}</span>
              </div>
            </div>
          </div>

          {/* AI Intake Directive (Neutral) */}
          {payment.unstructured_intake_text && (
            <div className="rounded-lg bg-atmospheric-card border border-slate-800/80 p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#1a2336]">
                <span className="font-semibold text-xs text-slate-300 uppercase tracking-wider">
                  Original Intake Instruction
                </span>
                <span className="text-xs font-mono text-slate-500">Unstructured Intake</span>
              </div>

              <div className="p-3 rounded bg-[#090d16] border border-[#1a2336] text-xs text-slate-300 font-mono leading-relaxed">
                "{payment.unstructured_intake_text}"
              </div>

              {payment.claims && payment.claims.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    Extracted Claims (Evaluated by Decision Engine):
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside font-mono">
                    {payment.claims.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Supporting Evidence Ledger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-200">Supporting Evidence Ledger</h3>
                <p className="text-xs text-slate-400">
                  Cross-system verification across ERP, Procurement Hub, HRIS, and Bank Master
                </p>
              </div>

              <button
                onClick={() => setIsAddingEvidence(true)}
                className="px-3 py-1.5 rounded-md bg-[#161f30] hover:bg-[#1e293b] text-slate-200 text-xs font-medium border border-[#222f46] flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Attach Evidence</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {evidences.map((ev) => (
                <EvidenceCard key={ev.id} evidence={ev} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Policies, Conflicts, Action & Audit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Targeted Verification Callout (if VERIFY) */}
          {evaluation.decision === 'VERIFY' && evaluation.required_actions.length > 0 && (
            <div className="rounded-lg bg-[#181512] border border-amber-500/40 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>Required Verification Action</span>
              </div>

              {evaluation.required_actions.map((act, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="font-semibold text-xs text-slate-100">{act.label}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{act.instruction}</p>
                </div>
              ))}

              <button
                onClick={() => setIsVerifying(true)}
                className="w-full mt-2 py-2.5 px-4 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Execute Verification Workflow</span>
              </button>
            </div>
          )}

          {/* Cross-Document Conflicts / Discrepancies */}
          {evaluation.conflicts && evaluation.conflicts.length > 0 && (
            <div className="rounded-lg bg-[#181013] border border-rose-500/40 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Cross-Source Discrepancies</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-200">
                {evaluation.conflicts.map((conf, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 shrink-0 font-bold">•</span>
                    <span>{conf}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Active Organizational Policies Evaluated */}
          {evaluation.applied_policies && evaluation.applied_policies.length > 0 && (
            <div className="rounded-lg bg-atmospheric-card border border-slate-800/80 p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#1a2336]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                  <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
                    Policy Enforcement Matrix
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {evaluation.applied_policies.filter(p => p.passed).length}/{evaluation.applied_policies.length} Compliant
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {evaluation.applied_policies.map((pol, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-md bg-[#090d16] border border-[#1a2336] flex items-start justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium text-slate-200">{pol.policy_name}</div>
                      <div className="text-[11px] text-slate-400 leading-tight">{pol.reason}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase shrink-0 ${
                      pol.passed
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                        : pol.triggered_action === 'BLOCK'
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                    }`}>
                      {pol.passed ? 'PASS' : pol.triggered_action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Trail Timeline */}
          <AuditTrail logs={auditLogs} />

          {/* Raw Engine JSON Proof Inspector (Collapsible) */}
          <div className="rounded-lg bg-atmospheric-card border border-slate-800/80 overflow-hidden shadow-sm">
            <button
              onClick={() => setShowJson(!showJson)}
              className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">Decision Engine Proof Payload (JSON)</span>
              </div>
              {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showJson && (
              <div className="p-4 bg-[#090d16] border-t border-[#1e293b] font-mono text-[11px] text-emerald-400/90 overflow-x-auto max-h-80">
                <pre>{JSON.stringify({ evaluation, payment, evidences }, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <VerificationModal
        isOpen={isVerifying}
        onClose={() => setIsVerifying(false)}
        onConfirm={handleVerifyBeneficiary}
        vendor={vendor}
        bankAccount={bankAccount}
        amount={payment.amount}
      />

      <AddEvidenceModal
        isOpen={isAddingEvidence}
        onClose={() => setIsAddingEvidence(false)}
        transactionId={payment.id}
        vendorName={payment.vendor_name}
        onEvidenceAdded={(updated) => onUpdated(updated)}
      />
    </div>
  );
};
