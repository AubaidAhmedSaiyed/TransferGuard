import React, { useState, useEffect } from 'react';
import { useRouter } from './context/RouterContext';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { NewTransferPage } from './pages/NewTransferPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { SettingsPage } from './pages/SettingsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { DeveloperPage } from './pages/DeveloperPage';
import { OverviewPage } from './pages/OverviewPage';
import { WorkspaceHeader, WorkspaceTab } from './components/WorkspaceHeader';
import { TransactionsTable } from './components/TransactionsTable';
import { TransactionDetail } from './components/TransactionDetail';
import { PoliciesManager } from './components/PoliciesManager';
import { EvidenceHub } from './components/EvidenceHub';
import { AuditHub } from './components/AuditHub';
import { CreateTransactionModal } from './components/CreateTransactionModal';
import { AIIntakeModal } from './components/AIIntakeModal';
import { api, TransactionSummaryItem, TransactionDetailResponse } from './services/api';
import { DashboardMetrics } from '@transferguard/types';
import { ShieldCheck, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const { path, navigate, params } = useRouter();
  const { isAuthenticated, isOnboarded, demoLogin } = useAuth();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [allTransactions, setAllTransactions] = useState<TransactionSummaryItem[]>([]);
  const [showSamples, setShowSamples] = useState<boolean>(() => {
    return localStorage.getItem('tg_show_samples') === 'true';
  });

  const [selectedTxId, setSelectedTxId] = useState<string | null>(params.id || null);
  const [selectedTxDetail, setSelectedTxDetail] = useState<TransactionDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIIntakeOpen, setIsAIIntakeOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [m, t] = await Promise.all([api.getMetrics(), api.getTransactions()]);
      setMetrics(m);
      setAllTransactions(t);
    } catch (e) {
      console.error('Failed to load platform data:', e);
      showToast('Error connecting to TransferGuard API server.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (id: string) => {
    try {
      setDetailLoading(true);
      const detail = await api.getTransaction(id);
      setSelectedTxDetail(detail);
    } catch (e) {
      console.error('Failed to load transaction detail:', e);
      showToast(`Could not load transaction ${id}.`, 'warning');
    } finally {
      setDetailLoading(false);
    }
  };

  // Sync tab with URL
  useEffect(() => {
    if (path === '/app/approvals') {
      setActiveTab('approvals');
      setSelectedTxId(null);
    } else if (path === '/app/policies') {
      setActiveTab('policies');
      setSelectedTxId(null);
    } else if (path === '/app/evidence') {
      setActiveTab('evidence');
      setSelectedTxId(null);
    } else if (path === '/app/audit') {
      setActiveTab('audit');
      setSelectedTxId(null);
    } else if (path === '/app/integrations') {
      setActiveTab('integrations');
      setSelectedTxId(null);
    } else if (path === '/app/developer') {
      setActiveTab('developer');
      setSelectedTxId(null);
    } else if (path === '/app/settings') {
      setActiveTab('settings');
      setSelectedTxId(null);
    } else if (path.startsWith('/app/transfers/') && path !== '/app/transfers/new') {
      const id = path.replace('/app/transfers/', '');
      setActiveTab('transfers');
      setSelectedTxId(id);
    } else if (path === '/app/transfers') {
      setActiveTab('transfers');
      setSelectedTxId(null);
    } else if (path === '/app') {
      setActiveTab('overview');
      setSelectedTxId(null);
    }
  }, [path]);

  // Load platform data when on workspace routes
  useEffect(() => {
    if (path.startsWith('/app')) {
      if (!isAuthenticated) {
        demoLogin();
      }
      loadData();
    }
  }, [path, isAuthenticated]);

  useEffect(() => {
    if (selectedTxId) {
      loadDetail(selectedTxId);
    } else {
      setSelectedTxDetail(null);
    }
  }, [selectedTxId]);

  const handleSelectTx = (id: string | null) => {
    setSelectedTxId(id);
    if (id) {
      navigate(`/app/transfers/${id}`);
    } else {
      navigate('/app/transfers');
    }
  };

  const handleReset = async () => {
    try {
      await api.resetData();
      await loadData();
      if (selectedTxId) {
        await loadDetail(selectedTxId);
      }
      showToast('TransferGuard baseline state restored.', 'success');
    } catch (e) {
      console.error(e);
      showToast('Reset failed.', 'warning');
    }
  };

  const handleLoadSampleWorkspace = () => {
    setShowSamples(true);
    localStorage.setItem('tg_show_samples', 'true');
    showToast('Sample enterprise workspace loaded.', 'success');
  };

  const handleTransactionUpdated = async (updated: TransactionDetailResponse) => {
    setSelectedTxDetail(updated);
    const m = await api.getMetrics();
    const t = await api.getTransactions();
    setMetrics(m);
    setAllTransactions(t);
    showToast(`Transaction ${updated.payment.tx_code} updated → Decision: ${updated.evaluation.decision}`, 'success');
  };

  const handleTransactionCreated = async (detail: TransactionDetailResponse) => {
    await loadData();
    setSelectedTxId(detail.payment.id);
    setSelectedTxDetail(detail);
    navigate(`/app/transfers/${detail.payment.id}`);
    showToast(`Transaction ${detail.payment.tx_code} created → Decision: ${detail.evaluation.decision}`, 'success');
  };

  // Transactions visible to the user:
  // If user has not enabled sample transfers, only show transactions they created or newly submitted!
  // If showSamples is true, show all.
  const visibleTransactions = showSamples 
    ? allTransactions 
    : allTransactions.filter(t => t.is_user_created);

  // Top-level Public Routes
  if (path === '/') {
    return <LandingPage />;
  }

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/signup') {
    return <SignupPage />;
  }

  if (path === '/onboarding') {
    return <OnboardingPage />;
  }

  if (path === '/app/transfers/new') {
    return <NewTransferPage />;
  }

  // TransferGuard Authenticated Workspace Layout
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-200 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-4 py-3 rounded-lg border shadow-xl flex items-center gap-3 text-xs font-medium ${
            toast.type === 'success'
              ? 'bg-[#0f1523] border-emerald-500/50 text-emerald-300'
              : toast.type === 'warning'
              ? 'bg-[#0f1523] border-amber-500/50 text-amber-300'
              : 'bg-[#0f1523] border-[#1e293b] text-slate-200'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white ml-2 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Workspace Header */}
      <WorkspaceHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedTxId(null);
        }}
        onReset={handleReset}
        selectedTxId={selectedTxId}
        onSelectTx={handleSelectTx}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
        {loading && !selectedTxDetail ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            <span className="text-xs font-mono">Loading TransferGuard Workspace...</span>
          </div>
        ) : selectedTxId && selectedTxDetail ? (
          detailLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
              <span className="text-xs font-mono">Reconciling Evidence & Evaluating Policy...</span>
            </div>
          ) : (
            <TransactionDetail
              data={selectedTxDetail}
              onBack={() => handleSelectTx(null)}
              onUpdated={handleTransactionUpdated}
            />
          )
        ) : activeTab === 'overview' ? (
          <OverviewPage
            metrics={metrics}
            transactions={visibleTransactions}
            onSelectTx={handleSelectTx}
            onLoadSampleData={!showSamples ? handleLoadSampleWorkspace : undefined}
          />
        ) : activeTab === 'approvals' ? (
          <ApprovalsPage />
        ) : activeTab === 'integrations' ? (
          <IntegrationsPage />
        ) : activeTab === 'developer' ? (
          <DeveloperPage />
        ) : activeTab === 'policies' ? (
          <PoliciesManager />
        ) : activeTab === 'evidence' ? (
          <EvidenceHub />
        ) : activeTab === 'audit' ? (
          <AuditHub />
        ) : activeTab === 'settings' ? (
          <SettingsPage />
        ) : (
          /* Transfers Queue */
          <div className="space-y-6">
            <TransactionsTable
              transactions={visibleTransactions}
              onSelectTx={handleSelectTx}
              selectedId={selectedTxId}
              onOpenCreateModal={() => navigate('/app/transfers/new')}
            />
          </div>
        )}
      </main>

      {/* Modals for Quick In-Place Action */}
      <CreateTransactionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleTransactionCreated}
      />

      <AIIntakeModal
        isOpen={isAIIntakeOpen}
        onClose={() => setIsAIIntakeOpen(false)}
        onConverted={handleTransactionCreated}
      />

      {/* Enterprise Workspace Footer */}
      <footer className="border-t border-[#1e293b] bg-[#090d16] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">TransferGuard</span>
            <span>— Pre-transfer control infrastructure for consequential financial actions</span>
          </div>
          <div className="text-[11px] text-slate-400">
            AI can understand • Evidence must authorize
          </div>
        </div>
      </footer>
    </div>
  );
};
