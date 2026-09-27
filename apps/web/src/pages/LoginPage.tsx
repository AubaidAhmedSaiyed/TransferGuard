import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, Mail, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your corporate email address.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    try {
      setDemoLoading(true);
      await demoLogin();
      navigate('/app');
    } catch {
      setError('Failed to launch demo.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-atmospheric-hero text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/20 selection:text-emerald-200 relative overflow-hidden">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/5 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-100 tracking-tight">TransferGuard</span>
        </button>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-100">
          Sign in to your Treasury Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your corporate credentials to access the pre-transfer safety console.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-atmospheric-card py-8 px-6 shadow-2xl border border-slate-800/80 rounded-xl sm:px-10 backdrop-blur-sm">
          {/* Quick Demo Sign In Box */}
          <div className="mb-6 p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Demo Sandbox Access
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-300">
                Frictionless
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mb-3 leading-relaxed">
              Evaluating TransferGuard? Sign in instantly as Head of Treasury at Acme Global.
            </p>
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={demoLoading}
              className="w-full py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98 disabled:opacity-50"
            >
              {demoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Demo Account Quick Launch</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e293b]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f1523] px-2 text-slate-500 font-mono text-[10px]">
                Or sign in with work email
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="treasury@company.com"
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded-md pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <span className="text-[10px] text-slate-500">SSO Enabled</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded-md pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md bg-[#161f30] hover:bg-[#1f2c42] border border-[#2a3a55] text-slate-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-98 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              <span>Sign In</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have a workspace yet?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2"
            >
              Create Organization
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted with TLS 1.3 • Zero LLM financial authority</span>
        </div>
      </div>
    </div>
  );
};
