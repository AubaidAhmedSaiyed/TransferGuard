import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Building, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  PhoneCall, 
  SlidersHorizontal, 
  Loader2, 
  FileClock,
  Plus
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { api, TransactionDetailResponse } from '../services/api';
import { VerificationModal } from '../components/VerificationModal';

const PRESET_PROMPTS = [
  {
    label: 'Acme Supplies $480k (Urgent Wire + Account Change)',
    text: 'Please urgently wire $480,000 to Acme Supplies Corp for invoice INV-8841. They sent updated banking coordinates to PNC Bank account ending in 1288 due to an internal treasury migration. Needs immediate release today.'
  },
  {
    label: 'Cloudflare $14,200 (Verified Monthly SaaS)',
    text: 'Disburse $14,200 USD to Cloudflare Inc for enterprise edge CDN hosting invoice INV-2024-9912. Standard payment terms Net 30.'
  },
  {
    label: 'Pacific Maritime $88,000 (Urgent Fuel Surcharge)',
    text: 'Authorize wire of $88,000 to Pacific Maritime Logistics for emergency port demurrage and fuel surcharges under PO-7719. High urgency.'
  }
];

export const NewTransferPage: React.FC = () => {
  const { navigate } = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [intakeMode, setIntakeMode] = useState<'ai' | 'manual'>('ai');

  // Step 1: Raw Intake
  const [rawText, setRawText] = useState('');
  const [extracting, setExtracting] = useState(false);

  // Step 2: Form / Extracted Claims
  const [vendorName, setVendorName] = useState('Acme Supplies Corp');
  const [amount, setAmount] = useState<number>(480000);
  const [currency, setCurrency] = useState('USD');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('****1288');
  const [destinationBank, setDestinationBank] = useState('PNC Bank Commercial');
  const [purpose, setPurpose] = useState('Vendor invoice payment');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-8841');
  const [requestorName, setRequestorName] = useState('Alex Rivera (Operations)');
  const [isUrgent, setIsUrgent] = useState(true);

  // Supporting Evidence input
  const [evidenceText, setEvidenceText] = useState('');
  const [evidenceType, setEvidenceType] = useState('invoice');

  // Step 3 & 4: Evaluated Transaction
  const [evaluating, setEvaluating] = useState(false);
  const [evaluatedResult, setEvaluatedResult] = useState<TransactionDetailResponse | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // AI Extraction handler
  const handleExtractWithAI = async () => {
    if (!rawText.trim()) return;
    try {
      setExtracting(true);
      const result = await api.extractIntake(rawText);
      if (result) {
        if (result.vendor_name) setVendorName(result.vendor_name);
        if (result.amount) setAmount(result.amount);
        if (result.currency) setCurrency(result.currency);
        if (result.beneficiary_account_masked) setBeneficiaryAccount(result.beneficiary_account_masked);
        if (result.bank_name) setDestinationBank(result.bank_name);
        if (result.purpose) setPurpose(result.purpose);
        if (result.invoice_number) setInvoiceNumber(result.invoice_number);
        if (result.urgency === 'high' || result.urgency === 'critical') setIsUrgent(true);
      }
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setExtracting(false);
    }
  };

  // Submit and Evaluate Transaction
  const handleRunEvaluation = async () => {
    try {
      setEvaluating(true);
      const payload = {
        vendor_name: vendorName,
        amount: Number(amount),
        currency,
        beneficiary_account_masked: beneficiaryAccount,
        destination_bank_name: destinationBank,
        purpose,
        invoice_number: invoiceNumber,
        requestor_name: requestorName,
        is_urgent: isUrgent,
        unstructured_memo: rawText || purpose
      };

      const result = await api.createTransaction(payload);
      
      // If user pasted supporting evidence text, attach it now
      if (evidenceText.trim() && result.payment?.id) {
        await api.addEvidence(result.payment.id, {
          title: `Supporting Document (${evidenceType})`,
          content: evidenceText,
          type: evidenceType,
          source: 'manual_upload'
        });
        const fresh = await api.getTransaction(result.payment.id);
        setEvaluatedResult(fresh);
      } else {
        setEvaluatedResult(result);
      }

      setStep(3);
    } catch (e) {
      console.error('Failed to create and evaluate transfer:', e);
    } finally {
      setEvaluating(false);
    }
  };

  const handleVerificationCompleted = (updated: TransactionDetailResponse) => {
    setEvaluatedResult(updated);
    setIsVerificationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-200">
      {/* Top Header */}
      <header className="border-b border-[#1e293b] bg-[#090d16]/95 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app')}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#161f30] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">Create Transfer Request</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Runtime Safety Verification
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Pill */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {[
              { num: 1, label: 'Intake' },
              { num: 2, label: 'Claims' },
              { num: 3, label: 'Evaluation' },
              { num: 4, label: 'Release' }
            ].map((s) => (
              <span
                key={s.num}
                className={`px-2.5 py-1 rounded text-[11px] ${
                  step === s.num
                    ? 'bg-emerald-600 text-slate-950 font-bold'
                    : step > s.num
                    ? 'bg-[#161f30] text-emerald-400 border border-emerald-800/40'
                    : 'bg-[#0f1523] text-slate-500 border border-[#1e293b]'
                }`}
              >
                {s.num}. {s.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Ingest Intent */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-[#1e293b] gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
                    Step 1: Ingest Payment Intent & Instructions
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Paste an email, Slack payment request, invoice memo, or choose a benchmark scenario.
                  </p>
                </div>

                <div className="flex bg-[#090d16] p-1 rounded-md border border-[#1e293b] text-xs">
                  <button
                    onClick={() => setIntakeMode('ai')}
                    className={`px-3 py-1 rounded font-medium transition-colors ${
                      intakeMode === 'ai' ? 'bg-[#161f30] text-slate-100 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    AI Natural Language
                  </button>
                  <button
                    onClick={() => {
                      setIntakeMode('manual');
                      setStep(2);
                    }}
                    className={`px-3 py-1 rounded font-medium transition-colors ${
                      intakeMode === 'manual' ? 'bg-[#161f30] text-slate-100 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Manual Entry Form
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mt-5 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  Quick Benchmark Samples:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PRESET_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setRawText(p.text)}
                      className="p-3 text-left rounded-lg bg-[#090d16] border border-[#1e293b] hover:border-slate-600 transition-colors group"
                    >
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                        {p.label}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-1">
                        {p.text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="mt-5">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Payment Request Memo / Email Text
                </label>
                <textarea
                  rows={6}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste invoice text, executive instruction, vendor wire change memo, or raw payment details..."
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                />
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#1e293b]">
                <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  AI extracts claims only; deterministic engine enforces rules.
                </span>

                <button
                  onClick={handleExtractWithAI}
                  disabled={!rawText.trim() || extracting}
                  className="px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {extracting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Extract & Review Claims</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review Claims & Supporting Documents */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 sm:p-8 shadow-2xl">
              <div className="pb-5 border-b border-[#1e293b]">
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-emerald-400" />
                  Step 2: Review Structured Claims & Supporting Evidence
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect extracted claims before running deterministic safety checks. Attach supporting ground-truth documents.
                </p>
              </div>

              {/* Natural AI Understanding Summary */}
              <div className="mt-5 p-4 rounded-lg bg-[#090d16] border border-[#1e293b] space-y-2">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>TransferGuard Understood:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Counterparty</span>
                    <span className="text-slate-200 font-medium">{vendorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Amount</span>
                    <span className="text-slate-100 font-mono font-bold">${Number(amount || 0).toLocaleString()} {currency}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Destination Account</span>
                    <span className="text-slate-200 font-mono">{beneficiaryAccount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Signals</span>
                    <span className={isUrgent ? 'text-amber-300 font-semibold' : 'text-slate-300'}>
                      {isUrgent ? 'Urgency Detected' : 'Standard Priority'}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 pt-1.5 border-t border-[#1e293b]/60 flex items-center justify-between">
                  <span>Review extracted information before continuing to policy evaluation.</span>
                  <span className="text-[10px] font-mono text-slate-500">All fields editable below</span>
                </div>
              </div>

              {/* Structured Fields Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Beneficiary / Vendor Name
                  </label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Transfer Amount & Currency
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="flex-1 bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-24 bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Beneficiary Account Mask / IBAN
                  </label>
                  <input
                    type="text"
                    value={beneficiaryAccount}
                    onChange={(e) => setBeneficiaryAccount(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Destination Bank Name
                  </label>
                  <input
                    type="text"
                    value={destinationBank}
                    onChange={(e) => setDestinationBank(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Invoice / Reference Identifier
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Requestor / Authorized Operator
                  </label>
                  <input
                    type="text"
                    value={requestorName}
                    onChange={(e) => setRequestorName(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Business Purpose / Memo
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Supporting Evidence Attachment Section */}
              <div className="mt-6 pt-5 border-t border-[#1e293b]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Attach Supporting Document / Ground Truth Evidence (Optional)
                  </label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value)}
                    className="bg-[#090d16] border border-[#1e293b] rounded px-2 py-1 text-[11px] text-slate-300"
                  >
                    <option value="invoice">Invoice Document</option>
                    <option value="contract">Vendor Master Contract</option>
                    <option value="bank_letter">Bank Verification Letter</option>
                    <option value="po">Purchase Order</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder="Paste invoice text, PO statement, or vendor banking letter to correlate claims against independent ground truth..."
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded-md p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Actions */}
              <div className="mt-8 pt-4 border-t border-[#1e293b] flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-md bg-[#161f30] hover:bg-[#1f2c42] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Intake</span>
                </button>

                <button
                  onClick={handleRunEvaluation}
                  disabled={evaluating}
                  className="px-6 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {evaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
                  <span>Evaluate Safety Policies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Policy & Decision Evaluation */}
        {step === 3 && evaluatedResult && (
          <div className="space-y-6">
            <div className="bg-[#0f1523] border border-[#1e293b] rounded-xl p-6 sm:p-8 shadow-2xl">
              <div className="pb-5 border-b border-[#1e293b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <SlidersHorizontal className="w-4.5 h-4.5 text-emerald-400" />
                    Step 3: Deterministic Policy Verdict
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Evaluated against active dual-control thresholds, vendor master records, and risk policies.
                  </p>
                </div>
                <div className="font-mono text-xs text-slate-400">
                  Ref: <span className="text-emerald-400 font-bold">{evaluatedResult.payment.tx_code}</span>
                </div>
              </div>

              {/* Big Decision Banner */}
              <div className="mt-6">
                {evaluatedResult.evaluation.decision === 'ALLOW' ? (
                  <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/60 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          READY TO RELEASE • ALL CHECKS PASSED
                        </div>
                        <div className="text-sm font-semibold text-slate-100 mt-0.5">
                          Deterministic safety verification succeeded. Zero blocking violations.
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-emerald-600 text-slate-950">
                      ALLOW
                    </span>
                  </div>
                ) : evaluatedResult.evaluation.decision === 'VERIFY' ? (
                  <div className="p-5 rounded-xl bg-amber-950/40 border border-amber-500/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                          REVIEW REQUIRED • HUMAN VERIFICATION MANDATORY
                        </div>
                        <div className="text-sm font-semibold text-slate-100 mt-0.5">
                          {evaluatedResult.evaluation.summary || evaluatedResult.evaluation.headline || 'Beneficiary coordinates changed or dual-control threshold exceeded.'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsVerificationModalOpen(true)}
                      className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Perform Out-of-Band Callback</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-rose-950/40 border border-rose-500/60 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                          BLOCKED • CRITICAL POLICY VIOLATION
                        </div>
                        <div className="text-sm font-semibold text-slate-100 mt-0.5">
                          {evaluatedResult.evaluation.summary || evaluatedResult.evaluation.headline || 'Transfer violates mandatory compliance safety rules.'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-rose-600 text-white">
                      BLOCKED
                    </span>
                  </div>
                )}
              </div>

              {/* Policy Rules & Evidence Breakdown */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rules */}
                <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b]">
                  <div className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Evaluated Policy Rules</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {evaluatedResult.evaluation.applied_policies?.map((rule, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-[#0f1523] border border-[#1e293b] flex items-center justify-between"
                      >
                        <span className="text-slate-300 font-mono text-[11px]">{rule.policy_name || rule.policy_id}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            rule.passed
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {rule.passed ? 'PASSED' : 'TRIGGERED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Checks */}
                <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b]">
                  <div className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Evidence Summary</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {evaluatedResult.evidences?.map((ev, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-[#0f1523] border border-[#1e293b] flex items-center justify-between"
                      >
                        <span className="text-slate-300 text-[11px] truncate max-w-[200px]">
                          {ev.title}: {ev.details || ev.description}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            ev.status === 'verified'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-4 border-t border-[#1e293b] flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-md bg-[#161f30] hover:bg-[#1f2c42] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modify Details</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/app/transfers/${evaluatedResult.payment.id}`)}
                    className="px-4 py-2 rounded-md bg-[#161f30] hover:bg-[#1f2c42] border border-[#2a3a55] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FileClock className="w-3.5 h-3.5" />
                    <span>Inspect Full Audit Log</span>
                  </button>

                  <button
                    onClick={() => navigate('/app')}
                    className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <span>Return to Queue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Out of Band Verification Modal */}
      {evaluatedResult && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onConfirm={async (data) => {
            const updated = await api.verifyBeneficiary(evaluatedResult.payment.id, data);
            handleVerificationCompleted(updated);
          }}
          vendor={evaluatedResult.vendor}
          bankAccount={evaluatedResult.bankAccount}
          amount={evaluatedResult.payment.amount}
        />
      )}
    </div>
  );
};
