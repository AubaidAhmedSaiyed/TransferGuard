import React from 'react';
import { Clock, CheckCircle2, Play, ArrowRight, X, Sparkles, ShieldCheck, PlusCircle } from 'lucide-react';

interface PresenterGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (txId: string) => void;
}

export const PresenterGuide: React.FC<PresenterGuideProps> = ({
  isOpen,
  onClose,
  onSelectScenario
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      time: '0:00 - 0:25',
      title: 'Demo 1: Live User Transaction Creation & AI Intent Analysis',
      badge: 'LIVE WORKFLOW',
      badgeColor: 'text-indigo-400 bg-indigo-950 border-indigo-800',
      script: 'Click "Create Transaction". Enter natural language: "Please pay Acme Supplies $480,000 for invoice INV-8841. They sent updated banking details this morning." Click "Analyze with TransferGuard". Show AI structured extraction, safety signals, and human inspection stage. Submit and show the immediate VERIFY decision!'
    },
    {
      time: '0:25 - 0:45',
      title: 'Demo 2: Targeted Human Verification Resolution',
      actionTxId: 'tx-1002',
      badge: 'KEY SAFETY MOMENT',
      badgeColor: 'text-amber-400 bg-amber-950 border-amber-800',
      script: 'Show that Invoice, PO, Vendor, and Requestor are all VERIFIED. The only missing fact is beneficiary provenance. Click "Verify Beneficiary via Callback". Complete out-of-band phone callback confirmation to Elena Rostova. Watch decision transition from VERIFY → ALLOW.'
    },
    {
      time: '0:45 - 1:05',
      title: 'Demo 3: Genuine Unusual Transfer ($8,000,000 M&A Closing)',
      actionTxId: 'tx-1004',
      badge: 'UNUSUAL ≠ FRAUD',
      badgeColor: 'text-purple-400 bg-purple-950 border-purple-800',
      script: 'Show TX-1004 ($8,000,000 to NewCo Holdings). Explain: A traditional black-box anomaly detector would block this $8M wire. TransferGuard allows it because Board Resolution, CFO signing, and Definitive Agreement are authoritative.'
    },
    {
      time: '1:05 - 1:20',
      title: 'Demo 4: Policy Bypass Directive Block',
      actionTxId: 'tx-1003',
      badge: 'BLOCK',
      badgeColor: 'text-rose-400 bg-rose-950 border-rose-800',
      script: 'Show TX-1003 ($480,000 to offshore Cayman entity). Directive said "Skip normal approval because CFO is unavailable". Deterministic Policy Engine strictly enforces rule and returns BLOCK.'
    },
    {
      time: '1:20 - 1:30',
      title: 'Step 5: Closing Pitch & Core Architecture',
      actionTxId: null,
      badge: 'PITCH CLOSING',
      badgeColor: 'text-emerald-400 bg-emerald-950 border-emerald-800',
      script: '"AI can understand an instruction. That does not mean it should be trusted to execute the consequence. TransferGuard creates the verifiable safety layer between the two: AI can understand. Evidence must authorize."'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#131b2e] border border-emerald-500/50 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">90-Second Hackathon Demo Playbook</h3>
              <p className="text-xs text-slate-400">
                Official presentation script & acceptance test walkthrough for judges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-3 pt-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">{step.time}</span>
                  <span className="text-xs font-bold text-slate-200">{step.title}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${step.badgeColor}`}>
                  {step.badge}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/80 font-mono">
                "{step.script}"
              </p>

              {step.actionTxId && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      onSelectScenario(step.actionTxId!);
                      onClose();
                    }}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Jump directly to {step.actionTxId.toUpperCase()}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span className="font-mono">Tip: Use "Create Transaction" or "Create Test Attack" for real-time live demonstrations.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
          >
            Got it, Let's Demo
          </button>
        </div>
      </div>
    </div>
  );
};
