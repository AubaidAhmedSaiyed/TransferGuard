import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  SlidersHorizontal, 
  FileClock, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Building2, 
  Cpu, 
  FileCheck2, 
  PhoneCall, 
  Fingerprint,
  Code2,
  Terminal,
  Copy,
  Check,
  Server,
  ArrowDown
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { demoLogin } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleLaunchDemo = async () => {
    await demoLogin();
    navigate('/app');
  };

  const copyCode = () => {
    navigator.clipboard.writeText('npm install @transferguard/sdk');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-200 font-sans flex flex-col">
      {/* Public Navbar */}
      <header className="border-b border-[#1e293b]/70 bg-[#070a12]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base text-slate-100 tracking-tight">TransferGuard</span>
              <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">Pre-Transfer Control Infrastructure</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-slate-200 transition-colors">How It Works</a>
            <a href="#architecture" className="hover:text-slate-200 transition-colors">Architecture</a>
            <a href="#developer" className="hover:text-slate-200 transition-colors">SDK & API</a>
            <a href="#context" className="hover:text-slate-200 transition-colors">Business Context</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-[#161f30] border border-transparent hover:border-[#1e293b] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Soft Atmospheric Gradient Background */}
      <section className="relative pt-24 pb-24 overflow-hidden border-b border-[#1e293b]/60 bg-atmospheric-hero">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11192e] border border-[#1e2c4a] text-slate-300 text-xs font-mono uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Pre-Transfer Control Layer
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Verify intent before <br />
            <span className="text-emerald-400">money moves.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Pre-transfer control infrastructure for organizations handling consequential financial actions. TransferGuard evaluates business intent, evidence, and policy before existing payment systems proceed.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#141c2e] hover:bg-[#1a253d] text-slate-200 border border-[#22314d] font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Launch Live Workspace Demo</span>
            </button>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            Organizations keep their existing payment infrastructure. TransferGuard becomes the control layer.
          </div>

          {/* Architectural Diagram Hero Visual with Atmospheric Surface */}
          <div className="mt-14 p-6 rounded-2xl bg-atmospheric-surface border border-[#1e293b] shadow-2xl text-left backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-[#1e293b]/80 pb-3 mb-5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-semibold text-slate-200">Payment Workflow Architecture</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">TransferGuard sits between business systems and execution</span>
            </div>

            <div className="space-y-4">
              {/* Layer 1: Company Systems */}
              <div className="p-3.5 rounded-lg bg-[#090e1a] border border-[#1a2438]">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">1. Company Systems</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium text-slate-300">
                  <div className="p-2 rounded bg-[#0e1526] border border-[#1a263d]">ERP (SAP / NetSuite)</div>
                  <div className="p-2 rounded bg-[#0e1526] border border-[#1a263d]">Procurement & Invoices</div>
                  <div className="p-2 rounded bg-[#0e1526] border border-[#1a263d]">Treasury & Approvals</div>
                </div>
              </div>

              <div className="flex justify-center text-slate-500">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>

              {/* Layer 2: TransferGuard SDK / API & Control Engine */}
              <div className="p-4 rounded-lg bg-gradient-to-b from-[#0e182a] to-[#0a1220] border-2 border-emerald-500/40 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">2. TransferGuard Pre-Transfer Control Layer</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Decision: ALLOW | VERIFY | BLOCK
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="p-3 rounded bg-[#090e1a] border border-[#1a2438]">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>AI Understanding</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Intent extraction • Entity parsing • Contradictions • Explanations
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#090e1a] border border-[#1a2438]">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Control Engine</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Evidence matching • Deterministic policy • Authorization • Audit
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-slate-500">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>

              {/* Layer 3: Existing Payment Infrastructure */}
              <div className="p-3.5 rounded-lg bg-[#090e1a] border border-[#1a2438]">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">3. Existing Payment Infrastructure (Executes Money Movement)</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium text-slate-300">
                  <div className="p-2 rounded bg-[#0e1526] border border-[#1a263d]">PayPal Payouts</div>
                  <div className="p-2 rounded bg-[#0e1526] border border-[#1a263d]">Stripe Transfers</div>
                  <div className="p-2 rounded bg-[#0e1526] border border-[#1a263d]">Commercial Bank API / SWIFT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Business Context Section with Subtle Atmospheric Transition */}
      <section id="context" className="py-20 border-b border-[#1e293b]/60 bg-gradient-to-b from-[#0a0f1c] via-[#0c1220] to-[#070a12]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">The Positioning</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
              The payment system knows where money is going.<br />
              <span className="text-emerald-400">Your organization knows why.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
              Banks and payment providers execute payment transactions. Organizations possess the essential business context: invoices, purchase orders, contracts, internal authorizations, employee roles, vendor master records, and organizational policies. TransferGuard brings this context into the pre-transfer decision before funds leave accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-atmospheric-card border border-[#1a2438] hover:border-slate-700 transition-colors">
              <div className="font-semibold text-slate-200">Invoices & POs</div>
              <div className="text-slate-400 text-[11px] mt-1">Cross-system invoice matching and delivery confirmation.</div>
            </div>
            <div className="p-4 rounded-xl bg-atmospheric-card border border-[#1a2438] hover:border-slate-700 transition-colors">
              <div className="font-semibold text-slate-200">Vendor Master Files</div>
              <div className="text-slate-400 text-[11px] mt-1">Historical beneficiary account baseline reconciliation.</div>
            </div>
            <div className="p-4 rounded-xl bg-atmospheric-card border border-[#1a2438] hover:border-slate-700 transition-colors">
              <div className="font-semibold text-slate-200">Approval Governance</div>
              <div className="text-slate-400 text-[11px] mt-1">Deterministic dual-control and authorization limits.</div>
            </div>
            <div className="p-4 rounded-xl bg-atmospheric-card border border-[#1a2438] hover:border-slate-700 transition-colors">
              <div className="font-semibold text-slate-200">Human Verification</div>
              <div className="text-slate-400 text-[11px] mt-1">Out-of-band telephone verification for changed coordinates.</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-b border-[#1e293b]/60 bg-[#070a12]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">Workflow</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">How TransferGuard Operates</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              A 5-phase deterministic pipeline ensuring safety before execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-atmospheric-card border border-[#1a2438]">
              <div className="text-xs font-mono text-slate-400 mb-2">01</div>
              <h3 className="font-bold text-sm text-slate-100">Request</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Wire instruction or invoice submitted via SDK, API, or web intake.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-atmospheric-card border border-[#1a2438]">
              <div className="text-xs font-mono text-blue-400 mb-2">02</div>
              <h3 className="font-bold text-sm text-slate-100">Understand</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                AI extracts structured claims, entities, amounts, and urgency signals.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-atmospheric-card border border-[#1a2438]">
              <div className="text-xs font-mono text-indigo-400 mb-2">03</div>
              <h3 className="font-bold text-sm text-slate-100">Verify</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Evidence engine validates claims against vendor master records and POs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-atmospheric-card border border-[#1a2438]">
              <div className="text-xs font-mono text-emerald-400 mb-2">04</div>
              <h3 className="font-bold text-sm text-slate-100">Decide</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Deterministic policy yields ALLOW, VERIFY, or BLOCK.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-atmospheric-card border border-[#1a2438]">
              <div className="text-xs font-mono text-slate-300 mb-2">05</div>
              <h3 className="font-bold text-sm text-slate-100">Execute</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Existing payment infrastructure executes money movement only if allowed.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center text-xs font-mono text-slate-300">
            <span className="text-blue-400">AI understands</span> • <span className="text-indigo-400">Evidence establishes</span> • <span className="text-emerald-400">Policy constrains</span> • <span className="text-amber-400">Humans resolve uncertainty</span>
          </div>
        </div>
      </section>

      {/* Built For Section */}
      <section className="py-20 border-b border-[#1e293b]/60 bg-gradient-to-b from-[#070a12] via-[#090f1d] to-[#070a12]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">Use Cases</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Built for Consequential Financial Actions</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              { title: 'Beneficiary Changes', desc: 'Catches modified banking coordinates before wire dispatch.' },
              { title: 'High-Value Transfers', desc: 'Enforces deterministic dual-control and executive sign-offs.' },
              { title: 'New Counterparties', desc: 'Validates vendor master registration and tax ID consistency.' },
              { title: 'Urgent Requests', desc: 'Detects urgency language and social engineering signals in memos.' },
              { title: 'Missing Approvals', desc: 'Holds wires missing verified purchase order matching.' },
              { title: 'Conflicting Evidence', desc: 'Identifies discrepancies between invoices, contracts, and claims.' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-atmospheric-card border border-[#1a2438] hover:border-slate-700 transition-colors">
                <div className="font-semibold text-slate-200">{item.title}</div>
                <div className="text-slate-400 text-[11px] mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Experience / SDK Section with Soft Terminal Background */}
      <section id="developer" className="py-20 border-b border-[#1e293b]/60 bg-[#070a12]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">Developer Infrastructure</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Integrate Without Replacing Your Payment Stack</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Add runtime pre-transfer safety in a few lines of code with <code className="text-emerald-400 font-mono">@transferguard/sdk</code>.
            </p>
          </div>

          {/* Code Box */}
          <div className="rounded-2xl bg-atmospheric-card border border-[#1e293b] overflow-hidden shadow-2xl">
            <div className="p-3.5 bg-gradient-to-r from-[#0c1222] to-[#090d18] border-b border-[#1e293b] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-slate-300 text-[11px]">workflow-controller.ts</span>
              </div>
              <button
                onClick={copyCode}
                className="px-2.5 py-1 rounded bg-[#162035] hover:bg-[#1e2d4a] text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-colors border border-slate-700/60"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'npm install @transferguard/sdk'}</span>
              </button>
            </div>

            <pre className="p-5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed bg-[#060910]">
              <code>{`import { TransferGuard } from "@transferguard/sdk";

const guard = new TransferGuard({
  apiKey: process.env.TRANSFERGUARD_API_KEY,
  endpoint: process.env.TRANSFERGUARD_URL
});

// Evaluate before triggering your existing payment provider (PayPal, Stripe, Bank API)
const decision = await guard.evaluate({
  amount: 480000,
  currency: "USD",
  beneficiary: {
    name: "Acme Supplies",
    account: "****9174"
  },
  requester: { id: "user_123" },
  purpose: "Invoice INV-8841"
});

if (decision.status === "BLOCK") {
  // Stop existing payment workflow
  abortPayment(decision.reason);
}

if (decision.status === "VERIFY") {
  // Pause workflow and require out-of-band human verification
  holdForVerification(decision.requiredActions);
}

if (decision.status === "ALLOW") {
  // Continue existing payment workflow
  await existingPaymentProvider.executeTransfer({ ... });
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#070a12] to-[#0c1222]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-100">Ready to deploy pre-transfer control?</h2>
          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
            Your payment stack moves money. TransferGuard makes sure the organization is ready to let it move.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#141c2e] hover:bg-[#1a253d] text-slate-200 border border-[#22314d] font-semibold text-sm transition-colors"
            >
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e293b]/60 bg-[#070a12] py-10 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
            <span className="font-semibold text-slate-300">TransferGuard</span>
            <span>— Pre-transfer control infrastructure for consequential financial actions</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <span>SDK & API Layer</span>
            <span>Control Plane</span>
            <span>Deterministic Policy Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
