import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Plus, 
  SlidersHorizontal,
  Layers,
  FileClock,
  LayoutGrid,
  CheckSquare,
  Settings,
  Building2,
  LogOut,
  ChevronDown,
  Code2,
  Plug,
  Home
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export type WorkspaceTab = 
  | 'overview' 
  | 'transfers' 
  | 'approvals' 
  | 'evidence' 
  | 'policies' 
  | 'audit' 
  | 'integrations' 
  | 'developer' 
  | 'settings';

interface WorkspaceHeaderProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onReset: () => void;
  selectedTxId: string | null;
  onSelectTx: (id: string | null) => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  activeTab,
  onTabChange,
  onReset,
  selectedTxId,
  onSelectTx
}) => {
  const { user, org, logout } = useAuth();
  const { navigate } = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const navClass = (isActive: boolean) =>
    `px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-medium ${
      isActive
        ? 'bg-atmospheric-nav-active text-white font-semibold border border-slate-700/70 shadow-sm'
        : 'text-slate-400 hover:text-slate-200 hover:bg-[#12192a]/60'
    }`;

  return (
    <header className="border-b border-[#1e293b]/70 bg-[#070a12]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Brand & Organization Indicator */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              onSelectTx(null);
              onTabChange('overview');
              navigate('/app');
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
            </div>
          </button>

          {/* Org Name Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-[#0e1628] to-[#0a101d] border border-[#1e293b] text-xs text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">{org?.name || 'Corporate Treasury'}</span>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('overview');
                navigate('/app');
              }}
              className={navClass(activeTab === 'overview' && !selectedTxId)}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('transfers');
                navigate('/app/transfers');
              }}
              className={navClass((activeTab === 'transfers' || Boolean(selectedTxId)) && activeTab !== 'overview' && activeTab !== 'approvals' && activeTab !== 'policies' && activeTab !== 'evidence' && activeTab !== 'audit' && activeTab !== 'integrations' && activeTab !== 'developer' && activeTab !== 'settings')}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Transfers</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('approvals');
                navigate('/app/approvals');
              }}
              className={navClass(activeTab === 'approvals')}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Approvals</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('evidence');
                navigate('/app/evidence');
              }}
              className={navClass(activeTab === 'evidence')}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Evidence</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('policies');
                navigate('/app/policies');
              }}
              className={navClass(activeTab === 'policies')}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Policies</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('audit');
                navigate('/app/audit');
              }}
              className={navClass(activeTab === 'audit')}
            >
              <FileClock className="w-3.5 h-3.5" />
              <span>Audit</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('integrations');
                navigate('/app/integrations');
              }}
              className={navClass(activeTab === 'integrations')}
            >
              <Plug className="w-3.5 h-3.5" />
              <span>Integrations</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('developer');
                navigate('/app/developer');
              }}
              className={navClass(activeTab === 'developer')}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Developer</span>
            </button>

            <button
              onClick={() => {
                onSelectTx(null);
                onTabChange('settings');
                navigate('/app/settings');
              }}
              className={navClass(activeTab === 'settings')}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center gap-3">
          {/* Reset Baseline */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#141d2e] border border-transparent hover:border-slate-800 text-xs transition-colors"
            title="Reset platform baseline data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Primary CTA: Create Transfer */}
          <button
            onClick={() => navigate('/app/transfers/new')}
            className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Transfer</span>
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-gradient-to-b from-[#101728] to-[#0c1220] border border-slate-800/80 hover:border-slate-700 text-xs transition-colors"
            >
              <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <span className="hidden sm:inline font-medium text-slate-200 max-w-[100px] truncate text-[11px]">
                {user?.name || 'Account'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-atmospheric-card border border-slate-800 shadow-2xl py-1 text-xs z-50">
                <div className="px-3 py-2 border-b border-[#1e293b]">
                  <div className="font-semibold text-slate-100">{user?.name || 'Treasury User'}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email || 'user@company.com'}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-mono">{user?.role || 'Signatory'}</div>
                </div>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onTabChange('settings');
                    navigate('/app/settings');
                  }}
                  className="w-full px-3 py-2 text-left text-slate-300 hover:bg-[#161f30] hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Workspace Settings</span>
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onTabChange('developer');
                    navigate('/app/developer');
                  }}
                  className="w-full px-3 py-2 text-left text-slate-300 hover:bg-[#161f30] hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Developer API Keys</span>
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors border-t border-[#1e293b]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
