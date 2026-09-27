import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  Code2, 
  ShieldCheck, 
  ArrowRight,
  Server,
  Key,
  Webhook,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';

interface IntegrationItem {
  id: string;
  name: string;
  category: 'PAYMENT' | 'BUSINESS' | 'IDENTITY';
  description: string;
  status: 'Active' | 'Available through adapter' | 'Available through API' | 'Coming soon';
  type: string;
  docsUrl?: string;
}

const INTEGRATIONS: IntegrationItem[] = [
  // Payment Infrastructure
  {
    id: 'generic-http',
    name: 'Universal HTTP Webhook Gateway',
    category: 'PAYMENT',
    description: 'Direct webhook integration for custom backend payment systems and ERP disbursement queues.',
    status: 'Active',
    type: 'Payment Dispatch'
  },
  {
    id: 'bank-iso',
    name: 'Commercial Bank API (ISO 20022 / SWIFT)',
    category: 'PAYMENT',
    description: 'Pre-flight wire instruction gate for corporate banking APIs and treasury management gateways.',
    status: 'Active',
    type: 'Bank Wire'
  },
  {
    id: 'stripe',
    name: 'Stripe Transfers & Payouts',
    category: 'PAYMENT',
    description: 'Pre-transfer control layer for Stripe payout and connect transfer workflows.',
    status: 'Available through adapter',
    type: 'Payment Platform'
  },
  {
    id: 'paypal',
    name: 'PayPal Payouts API',
    category: 'PAYMENT',
    description: 'Adapter abstraction for PayPal bulk and automated payouts.',
    status: 'Available through adapter',
    type: 'Payment Platform'
  },

  // Business Systems
  {
    id: 'sap',
    name: 'SAP S/4HANA ERP',
    category: 'BUSINESS',
    description: 'Direct ingestion of purchase orders, invoices, and vendor master data from SAP.',
    status: 'Available through API',
    type: 'Enterprise ERP'
  },
  {
    id: 'netsuite',
    name: 'Oracle NetSuite',
    category: 'BUSINESS',
    description: 'Synchronize payment requests and vendor master records with NetSuite Financials.',
    status: 'Available through API',
    type: 'Accounting & ERP'
  },
  {
    id: 'workday',
    name: 'Workday Financial Management',
    category: 'BUSINESS',
    description: 'Reconcile employee authorization levels and procurement workflows against Workday.',
    status: 'Available through API',
    type: 'Financial Management'
  },
  {
    id: 'kyriba',
    name: 'Kyriba Treasury Management',
    category: 'BUSINESS',
    description: 'Direct pre-release verification integration for corporate treasury workstations.',
    status: 'Coming soon',
    type: 'Treasury Workstation'
  },

  // Identity & Directory
  {
    id: 'okta',
    name: 'SSO & SAML 2.0 (Okta / Auth0)',
    category: 'IDENTITY',
    description: 'Enterprise single sign-on and multi-factor authentication for treasury operators.',
    status: 'Active',
    type: 'Enterprise Identity'
  },
  {
    id: 'azure-ad',
    name: 'Azure AD / SCIM Directory',
    category: 'IDENTITY',
    description: 'Automated role synchronization and employee authorization mapping.',
    status: 'Active',
    type: 'Directory Sync'
  },
  {
    id: 'rbac',
    name: 'Internal Dual-Control Engine',
    category: 'IDENTITY',
    description: 'Built-in role-based access control and segregation of duties engine.',
    status: 'Active',
    type: 'Governance'
  }
];

export const IntegrationsPage: React.FC = () => {
  const { navigate } = useRouter();
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'PAYMENT' | 'BUSINESS' | 'IDENTITY'>('ALL');

  const apiKey = 'tg_live_sandbox_99a8b1c4e2f7';
  const webhookUrl = 'https://api.yourcompany.com/transferguard/webhook';

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const filtered = INTEGRATIONS.filter(item => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const getStatusBadge = (status: IntegrationItem['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        );
      case 'Available through adapter':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-950 text-blue-300 border border-blue-800">
            <Code2 className="w-3 h-3" /> Available through adapter
          </span>
        );
      case 'Available through API':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <Server className="w-3 h-3" /> Available through API
          </span>
        );
      case 'Coming soon':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-900 text-slate-500 border border-slate-800">
            <Clock className="w-3 h-3" /> Coming soon
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Soft Atmospheric Gradient */}
      <div className="bg-gradient-to-r from-[#0f172a]/90 via-[#0d1627]/80 to-[#0a101d]/90 border border-slate-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-100">Integrations</h2>
          <p className="text-xs text-slate-400 mt-1">
            Connect TransferGuard to the systems your organization already uses.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/developer')}
          className="px-3.5 py-1.5 rounded-lg bg-[#141d2e] hover:bg-[#1a263d] text-slate-200 border border-[#22314d] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>SDK & Developer Guide</span>
        </button>
      </div>

      {/* API Key & Webhook Quick Card */}
      <div className="p-4 rounded-2xl bg-atmospheric-card border border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span>Workspace API Key</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="flex-1 bg-[#070b14] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono"
            />
            <button
              onClick={copyApiKey}
              className="p-1.5 rounded-lg bg-[#162035] hover:bg-[#1f2c47] text-slate-300 border border-slate-700/60 text-xs transition-colors"
              title="Copy API Key"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Webhook className="w-3.5 h-3.5 text-blue-400" />
            <span>Webhook Endpoint</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="flex-1 bg-[#070b14] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1 text-xs">
          {[
            { id: 'ALL', label: 'All Integrations' },
            { id: 'PAYMENT', label: 'Payment Infrastructure' },
            { id: 'BUSINESS', label: 'Business Systems (ERP)' },
            { id: 'IDENTITY', label: 'Identity & Directory' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategory === tab.id
                  ? 'bg-atmospheric-nav-active text-white font-semibold border border-slate-700/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          {filtered.length} Connectors Available
        </span>
      </div>

      {/* Cards Grid with Soft Gradient Backgrounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-atmospheric-card border border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">{item.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{item.type}</span>
                </div>
                {getStatusBadge(item.status)}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-mono">
                {item.category === 'PAYMENT' ? 'Downstream Execution' : item.category === 'BUSINESS' ? 'Context Ingestion' : 'Authentication'}
              </span>
              <button
                onClick={() => navigate('/app/developer')}
                className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 text-[11px]"
              >
                <span>Integration Docs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
