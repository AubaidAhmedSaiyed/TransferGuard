import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ShieldCheck, RotateCcw, Plus, SlidersHorizontal, Layers, FileClock, LayoutGrid, CheckSquare, Settings, Building2, LogOut, ChevronDown, Code2, Plug, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
export const WorkspaceHeader = ({ activeTab, onTabChange, onReset, selectedTxId, onSelectTx }) => {
    const { user, org, logout } = useAuth();
    const { navigate } = useRouter();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const handleSignOut = () => {
        logout();
        navigate('/login');
    };
    const navClass = (isActive) => `px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-medium ${isActive
        ? 'bg-atmospheric-nav-active text-white font-semibold border border-slate-700/70 shadow-sm'
        : 'text-slate-400 hover:text-slate-200 hover:bg-[#12192a]/60'}`;
    return (_jsx("header", { className: "border-b border-[#1e293b]/70 bg-[#070a12]/90 backdrop-blur-md sticky top-0 z-40", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("button", { onClick: () => {
                                onSelectTx(null);
                                onTabChange('overview');
                                navigate('/app');
                            }, className: "flex items-center gap-2.5 text-left group", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400", children: _jsx(ShieldCheck, { className: "w-4.5 h-4.5" }) }), _jsx("div", { className: "flex items-baseline gap-2", children: _jsx("span", { className: "font-bold text-base text-slate-100 tracking-tight group-hover:text-white", children: "TransferGuard" }) })] }), _jsxs("div", { className: "hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-[#0e1628] to-[#0a101d] border border-[#1e293b] text-xs text-slate-300", children: [_jsx(Building2, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsx("span", { className: "font-semibold text-slate-200", children: org?.name || 'Corporate Treasury' })] }), _jsxs("nav", { className: "hidden lg:flex items-center gap-1", children: [_jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('overview');
                                        navigate('/app');
                                    }, className: navClass(activeTab === 'overview' && !selectedTxId), children: [_jsx(Home, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Overview" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('transfers');
                                        navigate('/app/transfers');
                                    }, className: navClass((activeTab === 'transfers' || Boolean(selectedTxId)) && activeTab !== 'overview' && activeTab !== 'approvals' && activeTab !== 'policies' && activeTab !== 'evidence' && activeTab !== 'audit' && activeTab !== 'integrations' && activeTab !== 'developer' && activeTab !== 'settings'), children: [_jsx(LayoutGrid, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Transfers" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('approvals');
                                        navigate('/app/approvals');
                                    }, className: navClass(activeTab === 'approvals'), children: [_jsx(CheckSquare, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Approvals" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('evidence');
                                        navigate('/app/evidence');
                                    }, className: navClass(activeTab === 'evidence'), children: [_jsx(Layers, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Evidence" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('policies');
                                        navigate('/app/policies');
                                    }, className: navClass(activeTab === 'policies'), children: [_jsx(SlidersHorizontal, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Policies" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('audit');
                                        navigate('/app/audit');
                                    }, className: navClass(activeTab === 'audit'), children: [_jsx(FileClock, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Audit" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('integrations');
                                        navigate('/app/integrations');
                                    }, className: navClass(activeTab === 'integrations'), children: [_jsx(Plug, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Integrations" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('developer');
                                        navigate('/app/developer');
                                    }, className: navClass(activeTab === 'developer'), children: [_jsx(Code2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Developer" })] }), _jsxs("button", { onClick: () => {
                                        onSelectTx(null);
                                        onTabChange('settings');
                                        navigate('/app/settings');
                                    }, className: navClass(activeTab === 'settings'), children: [_jsx(Settings, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Settings" })] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: onReset, className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#141d2e] border border-transparent hover:border-slate-800 text-xs transition-colors", title: "Reset platform baseline data", children: _jsx(RotateCcw, { className: "w-3.5 h-3.5" }) }), _jsxs("button", { onClick: () => navigate('/app/transfers/new'), className: "px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "New Transfer" })] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setUserMenuOpen(!userMenuOpen), className: "flex items-center gap-2 p-1.5 rounded-lg bg-gradient-to-b from-[#101728] to-[#0c1220] border border-slate-800/80 hover:border-slate-700 text-xs transition-colors", children: [_jsx("div", { className: "w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]", children: user?.name ? user.name[0] : 'U' }), _jsx("span", { className: "hidden sm:inline font-medium text-slate-200 max-w-[100px] truncate text-[11px]", children: user?.name || 'Account' }), _jsx(ChevronDown, { className: "w-3 h-3 text-slate-400" })] }), userMenuOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-56 rounded-xl bg-atmospheric-card border border-slate-800 shadow-2xl py-1 text-xs z-50", children: [_jsxs("div", { className: "px-3 py-2 border-b border-[#1e293b]", children: [_jsx("div", { className: "font-semibold text-slate-100", children: user?.name || 'Treasury User' }), _jsx("div", { className: "text-[11px] text-slate-400 truncate", children: user?.email || 'user@company.com' }), _jsx("div", { className: "text-[10px] text-emerald-400 mt-0.5 font-mono", children: user?.role || 'Signatory' })] }), _jsxs("button", { onClick: () => {
                                                setUserMenuOpen(false);
                                                onTabChange('settings');
                                                navigate('/app/settings');
                                            }, className: "w-full px-3 py-2 text-left text-slate-300 hover:bg-[#161f30] hover:text-white flex items-center gap-2 transition-colors", children: [_jsx(Settings, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Workspace Settings" })] }), _jsxs("button", { onClick: () => {
                                                setUserMenuOpen(false);
                                                onTabChange('developer');
                                                navigate('/app/developer');
                                            }, className: "w-full px-3 py-2 text-left text-slate-300 hover:bg-[#161f30] hover:text-white flex items-center gap-2 transition-colors", children: [_jsx(Code2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Developer API Keys" })] }), _jsxs("button", { onClick: () => {
                                                setUserMenuOpen(false);
                                                handleSignOut();
                                            }, className: "w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors border-t border-[#1e293b]", children: [_jsx(LogOut, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Sign Out" })] })] }))] })] })] }) }));
};
