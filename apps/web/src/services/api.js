const RAW_API_BASE = import.meta.env?.VITE_API_URL || '';
const API_BASE = RAW_API_BASE
    ? (RAW_API_BASE.endsWith('/api') ? RAW_API_BASE : `${RAW_API_BASE}/api`)
    : '/api';
export const api = {
    // Metrics
    async getMetrics() {
        const res = await fetch(`${API_BASE}/metrics`);
        const json = await res.json();
        return json.data;
    },
    // Transactions
    async getTransactions() {
        const res = await fetch(`${API_BASE}/transactions`);
        const json = await res.json();
        return json.data;
    },
    async getTransaction(id) {
        const res = await fetch(`${API_BASE}/transactions/${id}`);
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to fetch transaction');
        return json.data;
    },
    async createTransaction(payload) {
        const res = await fetch(`${API_BASE}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to create transaction');
        return json.data;
    },
    async deleteTransaction(id) {
        const res = await fetch(`${API_BASE}/transactions/${id}`, {
            method: 'DELETE'
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to delete transaction');
    },
    async evaluateTransaction(id) {
        const res = await fetch(`${API_BASE}/transactions/${id}/evaluate`, {
            method: 'POST'
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to evaluate transaction');
        return json.data;
    },
    async analyzeTransactionText(id, text) {
        const res = await fetch(`${API_BASE}/transactions/${id}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to analyze transaction');
        return json.data;
    },
    async addEvidence(id, evidenceData) {
        const res = await fetch(`${API_BASE}/transactions/${id}/evidence`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(evidenceData)
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to add evidence');
        return json.data;
    },
    async verifyEvidence(id, evidenceId, isVerified = true, verifiedBy) {
        const res = await fetch(`${API_BASE}/transactions/${id}/evidence/${evidenceId}/verify`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_verified: isVerified, verified_by: verifiedBy })
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to update evidence status');
        return json.data;
    },
    async verifyBeneficiary(id, params = {}) {
        const res = await fetch(`${API_BASE}/transactions/${id}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to verify transaction');
        return json.data;
    },
    // Policies
    async getPolicies() {
        const res = await fetch(`${API_BASE}/policies`);
        const json = await res.json();
        return json.data;
    },
    async createPolicy(policyData) {
        const res = await fetch(`${API_BASE}/policies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(policyData)
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to create policy');
        return json.data;
    },
    async updatePolicy(id, policyData) {
        const res = await fetch(`${API_BASE}/policies/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(policyData)
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to update policy');
        return json.data;
    },
    async deletePolicy(id) {
        const res = await fetch(`${API_BASE}/policies/${id}`, {
            method: 'DELETE'
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to delete policy');
    },
    async proposePolicy(text) {
        const res = await fetch(`${API_BASE}/policies/propose`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to parse natural language policy');
        return json.data;
    },
    // Evidence Hub
    async getAllEvidence() {
        const res = await fetch(`${API_BASE}/evidence`);
        const json = await res.json();
        return json.data;
    },
    async analyzeEvidenceText(text, document_type = 'invoice') {
        const res = await fetch(`${API_BASE}/evidence/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, document_type })
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to analyze evidence text');
        return json.data;
    },
    // AI Intake
    async extractAIIntent(text) {
        const res = await fetch(`${API_BASE}/ai/intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to analyze intent');
        return json.data;
    },
    async extractIntake(text) {
        const res = await fetch(`${API_BASE}/intake/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to extract text');
        return json.data;
    },
    async convertIntakeToTransaction(extraction, rawText) {
        const res = await fetch(`${API_BASE}/intake/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ extraction, raw_text: rawText })
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to convert intake');
        return json.data;
    },
    async getAIStatus() {
        const res = await fetch(`${API_BASE}/ai/status`);
        const json = await res.json();
        return json.data;
    },
    // Simulations
    async runSimulation(type) {
        const res = await fetch(`${API_BASE}/simulate/${type}`, {
            method: 'POST'
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to trigger simulation');
        return json.data;
    },
    async createTestAttack() {
        const res = await fetch(`${API_BASE}/simulate/attack-create`, {
            method: 'POST'
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to create test attack');
        return json.data;
    },
    async resetData() {
        const res = await fetch(`${API_BASE}/transactions/reset`, {
            method: 'POST'
        });
        const json = await res.json();
        if (!json.success)
            throw new Error(json.error || 'Failed to reset data');
    }
};
