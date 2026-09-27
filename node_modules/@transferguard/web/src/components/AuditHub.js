import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FileClock, Search } from 'lucide-react';
import { AuditTrail } from './AuditTrail';
export const AuditHub = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const loadAuditLogs = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/transactions');
            const json = await res.json();
            if (json.success && json.data) {
                const allLogs = [];
                for (const tx of json.data) {
                    const detailRes = await fetch(`/api/transactions/${tx.id}`);
                    const detailJson = await detailRes.json();
                    if (detailJson.success && detailJson.data?.auditLogs) {
                        allLogs.push(...detailJson.data.auditLogs);
                    }
                }
                const unique = Array.from(new Map(allLogs.map(l => [l.id, l])).values());
                unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setLogs(unique);
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadAuditLogs();
    }, []);
    const filteredLogs = logs.filter(l => l.actor.toLowerCase().includes(filter.toLowerCase()) ||
        l.action.toLowerCase().includes(filter.toLowerCase()) ||
        l.details.toLowerCase().includes(filter.toLowerCase()));
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(FileClock, { className: "w-5 h-5 text-emerald-400" }), _jsx("h1", { className: "text-xl font-bold text-slate-100", children: "Immutable Audit Ledger" })] }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Tamper-evident chronological record of all intake events, AI extractions, verifications, and deterministic decisions" })] }), _jsxs("div", { className: "relative w-full sm:w-64", children: [_jsx(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" }), _jsx("input", { type: "text", value: filter, onChange: (e) => setFilter(e.target.value), placeholder: "Search audit trail...", className: "w-full bg-[#090d16] border border-[#1e293b] rounded-md pl-8.5 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500" })] })] }), _jsx(AuditTrail, { logs: filteredLogs })] }));
};
