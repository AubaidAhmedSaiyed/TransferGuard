import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, Mail, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
export const LoginPage = () => {
    const { navigate } = useRouter();
    const { login, demoLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);
    const [error, setError] = useState('');
    const handleLogin = async (e) => {
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
        }
        catch (err) {
            setError(err?.message || 'Login failed. Please verify credentials.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDemoSignIn = async () => {
        try {
            setDemoLoading(true);
            await demoLogin();
            navigate('/app');
        }
        catch {
            setError('Failed to launch demo.');
        }
        finally {
            setDemoLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-atmospheric-hero text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/20 selection:text-emerald-200 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/5 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10", children: [_jsxs("button", { onClick: () => navigate('/'), className: "inline-flex items-center gap-2.5 group", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors shadow-sm", children: _jsx(ShieldCheck, { className: "w-5 h-5" }) }), _jsx("span", { className: "font-bold text-lg text-slate-100 tracking-tight", children: "TransferGuard" })] }), _jsx("h2", { className: "mt-4 text-xl font-bold tracking-tight text-slate-100", children: "Sign in to your Treasury Workspace" }), _jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Enter your corporate credentials to access the pre-transfer safety console." })] }), _jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md relative z-10", children: [_jsxs("div", { className: "bg-atmospheric-card py-8 px-6 shadow-2xl border border-slate-800/80 rounded-xl sm:px-10 backdrop-blur-sm", children: [_jsxs("div", { className: "mb-6 p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("span", { className: "font-semibold text-emerald-400 flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " Demo Sandbox Access"] }), _jsx("span", { className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-300", children: "Frictionless" })] }), _jsx("p", { className: "text-slate-300 text-[11px] mb-3 leading-relaxed", children: "Evaluating TransferGuard? Sign in instantly as Head of Treasury at Acme Global." }), _jsxs("button", { type: "button", onClick: handleDemoSignIn, disabled: demoLoading, className: "w-full py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98 disabled:opacity-50", children: [demoLoading ? _jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : _jsx(ShieldCheck, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Demo Account Quick Launch" })] })] }), _jsxs("div", { className: "relative mb-6", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-[#1e293b]" }) }), _jsx("div", { className: "relative flex justify-center text-xs uppercase", children: _jsx("span", { className: "bg-[#0f1523] px-2 text-slate-500 font-mono text-[10px]", children: "Or sign in with work email" }) })] }), error && (_jsx("div", { className: "mb-4 p-3 rounded-md bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300", children: error })), _jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-300 mb-1", children: "Corporate Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "w-4 h-4 text-slate-500 absolute left-3 top-2.5" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "treasury@company.com", className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("label", { className: "block text-xs font-medium text-slate-300", children: "Password" }), _jsx("span", { className: "text-[10px] text-slate-500", children: "SSO Enabled" })] }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "w-4 h-4 text-slate-500 absolute left-3 top-2.5" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" })] })] }), _jsxs("button", { type: "submit", disabled: loading, className: "w-full py-2 px-4 rounded-md bg-[#161f30] hover:bg-[#1f2c42] border border-[#2a3a55] text-slate-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-98 disabled:opacity-50", children: [loading ? _jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : _jsx(ArrowRight, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Sign In" })] })] }), _jsxs("div", { className: "mt-6 text-center text-xs text-slate-400", children: ["Don't have a workspace yet?", ' ', _jsx("button", { onClick: () => navigate('/signup'), className: "text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2", children: "Create Organization" })] })] }), _jsxs("div", { className: "mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsx("span", { children: "Encrypted with TLS 1.3 \u2022 Zero LLM financial authority" })] })] })] }));
};
