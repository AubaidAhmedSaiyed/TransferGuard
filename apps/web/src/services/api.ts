import {
  Payment,
  DashboardMetrics,
  DecisionEvaluation,
  EvidenceItem,
  EvidenceDocument,
  PolicyRule,
  Vendor,
  BankAccount,
  PurchaseOrder,
  Invoice,
  Employee,
  AuditLogEntry,
  VerificationRecord,
  UnstructuredIntakeExtraction,
  AIIntentAnalysis,
  AIDocumentExtraction
} from '@transferguard/types';

export interface TransactionDetailResponse {
  payment: Payment;
  vendor?: Vendor;
  bankAccount?: BankAccount;
  purchaseOrder?: PurchaseOrder;
  invoice?: Invoice;
  requestor?: Employee;
  attachedDocuments?: EvidenceDocument[];
  evidences: EvidenceItem[];
  evaluation: DecisionEvaluation;
  auditLogs: AuditLogEntry[];
  verifications?: VerificationRecord[];
}

export interface TransactionSummaryItem {
  id: string;
  tx_code: string;
  vendor_name: string;
  amount: number;
  currency: string;
  requestor_name: string;
  purpose: string;
  scenario_type: string;
  scenario_title: string;
  is_unusual_amount: boolean;
  current_decision: 'ALLOW' | 'VERIFY' | 'BLOCK';
  lifecycle_state: string;
  is_user_created?: boolean;
  evidence_summary: {
    total: number;
    verified_count: number;
    unresolved_count: number;
    failed_count: number;
  };
  created_at: string;
}

const RAW_API_BASE = (import.meta as any).env?.VITE_API_URL || '';
const API_BASE = RAW_API_BASE 
  ? (RAW_API_BASE.endsWith('/api') ? RAW_API_BASE : `${RAW_API_BASE}/api`)
  : '/api';

export const api = {
  // Metrics
  async getMetrics(): Promise<DashboardMetrics> {
    const res = await fetch(`${API_BASE}/metrics`);
    const json = await res.json();
    return json.data;
  },

  // Transactions
  async getTransactions(): Promise<TransactionSummaryItem[]> {
    const res = await fetch(`${API_BASE}/transactions`);
    const json = await res.json();
    return json.data;
  },

  async getTransaction(id: string): Promise<TransactionDetailResponse> {
    const res = await fetch(`${API_BASE}/transactions/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch transaction');
    return json.data;
  },

  async createTransaction(payload: any): Promise<TransactionDetailResponse> {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create transaction');
    return json.data;
  },

  async deleteTransaction(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to delete transaction');
  },

  async evaluateTransaction(id: string): Promise<TransactionDetailResponse> {
    const res = await fetch(`${API_BASE}/transactions/${id}/evaluate`, {
      method: 'POST'
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to evaluate transaction');
    return json.data;
  },

  async analyzeTransactionText(id: string, text?: string): Promise<{ analysis: AIIntentAnalysis; evaluated: TransactionDetailResponse }> {
    const res = await fetch(`${API_BASE}/transactions/${id}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to analyze transaction');
    return json.data;
  },

  async addEvidence(id: string, evidenceData: { title?: string; content: string; type?: string; source?: string; mark_verified?: boolean }): Promise<{ document: EvidenceDocument; evaluated: TransactionDetailResponse }> {
    const res = await fetch(`${API_BASE}/transactions/${id}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evidenceData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to add evidence');
    return json.data;
  },

  async verifyEvidence(id: string, evidenceId: string, isVerified: boolean = true, verifiedBy?: string): Promise<TransactionDetailResponse> {
    const res = await fetch(`${API_BASE}/transactions/${id}/evidence/${evidenceId}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_verified: isVerified, verified_by: verifiedBy })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to update evidence status');
    return json.data;
  },

  async verifyBeneficiary(
    id: string, 
    params: { 
      verification_method?: string; 
      confirmed_by?: string; 
      confirmed_role?: string; 
      statement?: string; 
      reason?: string; 
      notes?: string;
    } = {}
  ): Promise<TransactionDetailResponse> {
    const res = await fetch(`${API_BASE}/transactions/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to verify transaction');
    return json.data;
  },

  // Policies
  async getPolicies(): Promise<PolicyRule[]> {
    const res = await fetch(`${API_BASE}/policies`);
    const json = await res.json();
    return json.data;
  },

  async createPolicy(policyData: Partial<PolicyRule>): Promise<PolicyRule> {
    const res = await fetch(`${API_BASE}/policies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policyData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create policy');
    return json.data;
  },

  async updatePolicy(id: string, policyData: Partial<PolicyRule>): Promise<PolicyRule> {
    const res = await fetch(`${API_BASE}/policies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policyData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to update policy');
    return json.data;
  },

  async deletePolicy(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/policies/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to delete policy');
  },

  async proposePolicy(text: string): Promise<Partial<PolicyRule>> {
    const res = await fetch(`${API_BASE}/policies/propose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to parse natural language policy');
    return json.data;
  },

  // Evidence Hub
  async getAllEvidence(): Promise<EvidenceDocument[]> {
    const res = await fetch(`${API_BASE}/evidence`);
    const json = await res.json();
    return json.data;
  },

  async analyzeEvidenceText(text: string, document_type: string = 'invoice'): Promise<AIDocumentExtraction> {
    const res = await fetch(`${API_BASE}/evidence/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, document_type })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to analyze evidence text');
    return json.data;
  },

  // AI Intake
  async extractAIIntent(text: string): Promise<AIIntentAnalysis> {
    const res = await fetch(`${API_BASE}/ai/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to analyze intent');
    return json.data;
  },

  async extractIntake(text: string): Promise<UnstructuredIntakeExtraction> {
    const res = await fetch(`${API_BASE}/intake/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to extract text');
    return json.data;
  },

  async convertIntakeToTransaction(extraction: UnstructuredIntakeExtraction, rawText: string): Promise<TransactionDetailResponse> {
    const res = await fetch(`${API_BASE}/intake/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ extraction, raw_text: rawText })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to convert intake');
    return json.data;
  },

  async getAIStatus(): Promise<{ online: boolean; model: string; host: string }> {
    const res = await fetch(`${API_BASE}/ai/status`);
    const json = await res.json();
    return json.data;
  },

  // Simulations
  async runSimulation(type: 'interception' | 'unsupported' | 'acquisition' | 'normal'): Promise<TransactionDetailResponse> {
    const res = await fetch(`${API_BASE}/simulate/${type}`, {
      method: 'POST'
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to trigger simulation');
    return json.data;
  },

  async createTestAttack(): Promise<TransactionDetailResponse> {
    const res = await fetch(`${API_BASE}/simulate/attack-create`, {
      method: 'POST'
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create test attack');
    return json.data;
  },

  async resetData(): Promise<void> {
    const res = await fetch(`${API_BASE}/transactions/reset`, {
      method: 'POST'
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to reset data');
  }
};
