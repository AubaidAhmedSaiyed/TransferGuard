import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CheckCircle2, Clock, Copy, Check, Code2, ArrowRight, Server, Key, Webhook } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
const INTEGRATIONS = [
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
export const IntegrationsPage = () => {
    const { navigate } = useRouter();
    const [copiedKey, setCopiedKey] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const apiKey = 'tg_live_sandbox_99a8b1c4e2f7';
    const webhookUrl = 'https://api.yourcompany.com/transferguard/webhook';
    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };
    const filtered = INTEGRATIONS.filter(item => {
        if (selectedCategory === 'ALL')
            return true;
        return item.category === selectedCategory;
    });
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950 text-emerald-400 border border-emerald-800", children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), " Active"] }));
            case 'Available through adapter':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-950 text-blue-300 border border-blue-800", children: [_jsx(Code2, { className: "w-3 h-3" }), " Available through adapter"] }));
            case 'Available through API':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700", children: [_jsx(Server, { className: "w-3 h-3" }), " Available through API"] }));
            case 'Coming soon':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-900 text-slate-500 border border-slate-800", children: [_jsx(Clock, { className: "w-3 h-3" }), " Coming soon"] }));
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-[#0f172a]/90 via-[#0d1627]/80 to-[#0a101d]/90 border border-slate-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-base font-bold text-slate-100", children: "Integrations" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Connect TransferGuard to the systems your organization already uses." })] }), _jsxs("button", { onClick: () => navigate('/app/developer'), className: "px-3.5 py-1.5 rounded-lg bg-[#141d2e] hover:bg-[#1a263d] text-slate-200 border border-[#22314d] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm", children: [_jsx(Code2, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsx("span", { children: "SDK & Developer Guide" })] })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-atmospheric-card border border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "text-xs font-semibold text-slate-200 flex items-center gap-1.5", children: [_jsx(Key, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsx("span", { children: "Workspace API Key" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", readOnly: true, value: apiKey, className: "flex-1 bg-[#070b14] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono" }), _jsx("button", { onClick: copyApiKey, className: "p-1.5 rounded-lg bg-[#162035] hover:bg-[#1f2c47] text-slate-300 border border-slate-700/60 text-xs transition-colors", title: "Copy API Key", children: copiedKey ? _jsx(Check, { className: "w-3.5 h-3.5 text-emerald-400" }) : _jsx(Copy, { className: "w-3.5 h-3.5" }) })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "text-xs font-semibold text-slate-200 flex items-center gap-1.5", children: [_jsx(Webhook, { className: "w-3.5 h-3.5 text-blue-400" }), _jsx("span", { children: "Webhook Endpoint" })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("input", { type: "text", readOnly: true, value: webhookUrl, className: "flex-1 bg-[#070b14] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-400 font-mono" }) })] })] }), _jsxs("div", { className: "flex items-center justify-between border-b border-slate-800/80 pb-3", children: [_jsx("div", { className: "flex items-center gap-1 text-xs", children: [
                            { id: 'ALL', label: 'All Integrations' },
                            { id: 'PAYMENT', label: 'Payment Infrastructure' },
                            { id: 'BUSINESS', label: 'Business Systems (ERP)' },
                            { id: 'IDENTITY', label: 'Identity & Directory' }
                        ].map(tab => (_jsx("button", { onClick: () => setSelectedCategory(tab.id), className: `px-3 py-1.5 rounded-lg font-medium transition-colors ${selectedCategory === tab.id
                                ? 'bg-atmospheric-nav-active text-white font-semibold border border-slate-700/70 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'}`, children: tab.label }, tab.id))) }), _jsxs("span", { className: "text-xs text-slate-500 font-mono hidden sm:inline", children: [filtered.length, " Connectors Available"] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map(item => (_jsxs("div", { className: "p-5 rounded-2xl bg-atmospheric-card border border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors shadow-sm", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-slate-100", children: item.name }), _jsx("span", { className: "text-[10px] text-slate-400 font-mono", children: item.type })] }), getStatusBadge(item.status)] }), _jsx("p", { className: "text-xs text-slate-400 leading-relaxed mt-2", children: item.description })] }), _jsxs("div", { className: "pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-[11px] text-slate-500 font-mono", children: item.category === 'PAYMENT' ? 'Downstream Execution' : item.category === 'BUSINESS' ? 'Context Ingestion' : 'Authentication' }), _jsxs("button", { onClick: () => navigate('/app/developer'), className: "text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 text-[11px]", children: [_jsx("span", { children: "Integration Docs" }), _jsx(ArrowRight, { className: "w-3 h-3" })] })] })] }, item.id))) })] }));
};
