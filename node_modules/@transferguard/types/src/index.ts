export type DecisionType = 'ALLOW' | 'VERIFY' | 'BLOCK';

export type TransactionLifecycleState = 
  | 'DRAFT'
  | 'ANALYZED'
  | 'EVALUATED'
  | 'VERIFY_REQUIRED'
  | 'VERIFICATION_SUBMITTED'
  | 'RE_EVALUATED'
  | 'APPROVED'
  | 'BLOCKED';

export type EvidenceStatus = 'verified' | 'unresolved' | 'failed' | 'not_required';

export type VerificationStatus = 'pending' | 'completed' | 'failed';

export type PaymentScenarioType = 
  | 'normal' 
  | 'beneficiary_manipulation' 
  | 'unsupported' 
  | 'unusual_legitimate' 
  | 'custom';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  authorization_level: number;
}

export interface Vendor {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'pending_verification' | 'unknown';
  verified: boolean;
  tax_id: string;
  category: string;
  established_since: string;
  trusted_contact_name: string;
  trusted_contact_phone: string;
  trusted_contact_email: string;
}

export interface BankAccount {
  id: string;
  vendor_id: string;
  bank_name: string;
  account_number_masked: string;
  routing_number: string;
  account_type: 'checking' | 'operating' | 'escrow';
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
  verification_method?: 'vendor_master_initial' | 'out_of_band_callback' | 'board_resolution' | 'unverified';
  created_at: string;
  is_primary: boolean;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  amount: number;
  currency: string;
  approved_by: string;
  approved_at: string;
  status: 'approved' | 'pending' | 'cancelled' | 'missing';
  description: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  purchase_order_id?: string;
  vendor_id: string;
  amount: number;
  currency: string;
  issued_date: string;
  due_date: string;
  status: 'matched' | 'unmatched' | 'disputed' | 'missing';
  line_items: InvoiceLineItem[];
}

export interface EvidenceDocument {
  id: string;
  payment_id: string;
  type: 'invoice' | 'purchase_order' | 'approval' | 'contract' | 'beneficiary_confirmation' | 'vendor_record' | 'other';
  source: 'user_provided' | 'internal_record' | 'verified_external' | 'system_record' | 'demo_record';
  title: string;
  content: string;
  status: 'pending_analysis' | 'extracted' | 'verified' | 'rejected';
  is_verified_evidence: boolean;
  extracted_facts: {
    vendor_name?: string;
    amount?: number;
    currency?: string;
    invoice_number?: string;
    po_number?: string;
    account_number_masked?: string;
    bank_name?: string;
    approved_by?: string;
    approval_role?: string;
    contract_ref?: string;
    date?: string;
    terms?: string;
    claims?: string[];
    raw_json?: Record<string, any>;
  };
  created_at: string;
}

export interface EvidenceItem {
  id: string;
  payment_id: string;
  type: 
    | 'invoice_match' 
    | 'po_match' 
    | 'vendor_verified' 
    | 'requestor_auth' 
    | 'beneficiary_match' 
    | 'approval_governance' 
    | 'amount_consistency'
    | 'policy_compliance'
    | 'document_evidence';
  category: 'DOCUMENTATION' | 'IDENTITY' | 'AUTHORIZATION' | 'BENEFICIARY' | 'GOVERNANCE' | 'POLICY';
  title: string;
  description: string;
  source: string;
  status: EvidenceStatus;
  details: string;
  provenance_id: string;
  is_verified_evidence?: boolean;
  created_at: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  condition_type: 
    | 'amount_threshold' 
    | 'beneficiary_change' 
    | 'new_vendor' 
    | 'unauthorized_requestor' 
    | 'missing_po' 
    | 'missing_invoice' 
    | 'bypass_attempt' 
    | 'high_risk_composite'
    | 'custom';
  threshold_amount?: number;
  required_role?: string;
  action: 'VERIFY' | 'BLOCK' | 'ALLOW';
  reason: string;
  enabled: boolean;
  is_custom?: boolean;
  created_at: string;
}

export interface PolicyCheckResult {
  policy_id: string;
  policy_name: string;
  passed: boolean;
  triggered_action: 'ALLOW' | 'VERIFY' | 'BLOCK';
  reason: string;
}

export interface VerificationAction {
  type: string;
  label: string;
  instruction: string;
  estimated_time: string;
  target_entity: string;
}

export interface VerificationRecord {
  id: string;
  payment_id: string;
  verification_method: 'trusted_callback' | 'executive_override' | 'vendor_master_check' | 'board_resolution' | 'manual_confirmation';
  method_label: string;
  confirmed_by: string;
  confirmed_role: string;
  statement: string;
  reason: string;
  notes?: string;
  contact_used?: string;
  previous_decision: DecisionType;
  new_decision: DecisionType;
  verified_at: string;
}

export interface AuditLogEntry {
  id: string;
  payment_id: string;
  timestamp: string;
  time_offset_label?: string;
  actor: string;
  action: string;
  details: string;
  decision_snapshot: DecisionType | 'PENDING';
}

export interface GovernanceApprovals {
  board_approval?: boolean;
  cfo_authorization?: boolean;
  acquisition_agreement_verified?: boolean;
  agreement_ref?: string;
}

export interface SafetySignals {
  beneficiary_change?: boolean;
  unusual_urgency?: boolean;
  bypass_approval_request?: boolean;
  requestor_claiming_authority?: boolean;
  new_vendor?: boolean;
  unusual_payment_purpose?: boolean;
  conflicting_instructions?: boolean;
  missing_supporting_info?: boolean;
  social_engineering_signals?: boolean;
  override_policy_attempts?: boolean;
}

export interface Payment {
  id: string;
  tx_code: string;
  vendor_id: string;
  vendor_name: string;
  invoice_id?: string;
  invoice_number?: string;
  purchase_order_id?: string;
  po_number?: string;
  beneficiary_account_id: string;
  destination_account_masked: string;
  destination_bank_name: string;
  amount: number;
  currency: string;
  requestor_id: string;
  requestor_name: string;
  requestor_role: string;
  purpose: string;
  payment_method: 'wire' | 'ach' | 'swift';
  payment_date?: string;
  scenario_type: PaymentScenarioType;
  scenario_title: string;
  is_unusual_amount: boolean;
  historical_baseline_note: string;
  governance_approvals?: GovernanceApprovals;
  current_decision: DecisionType;
  lifecycle_state: TransactionLifecycleState;
  claims: string[];
  signals: SafetySignals;
  is_user_created?: boolean;
  unstructured_intake_text?: string;
  created_at: string;
  updated_at: string;
}

export interface DecisionEvaluation {
  decision: DecisionType;
  lifecycle_state: TransactionLifecycleState;
  headline: string;
  summary: string;
  known_facts: string[];
  uncertainties: string[];
  critical_failures: string[];
  conflicts: string[];
  applied_policies: PolicyCheckResult[];
  required_actions: VerificationAction[];
  consequence_summary: string;
  evidence_summary: {
    total: number;
    verified_count: number;
    unresolved_count: number;
    failed_count: number;
  };
  evidences: EvidenceItem[];
  safety_principle_note?: string;
  evaluated_at: string;
}

export interface AIIntentAnalysis {
  action: string;
  vendor: string;
  amount: number;
  currency: string;
  invoice?: string;
  po_number?: string;
  beneficiary_account?: string;
  bank_name?: string;
  requested_changes: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  purpose: string;
  claims: string[];
  uncertainties: string[];
  missing_information: string[];
  conflicts: string[];
  signals: SafetySignals;
  confidence_notes: string[];
  suggested_scenario_type: PaymentScenarioType;
  consequence_summary: string;
  raw_ai_response?: string;
  extraction_engine?: string;
}

export interface AIDocumentExtraction {
  document_type: string;
  vendor_name?: string;
  amount?: number;
  currency?: string;
  invoice_number?: string;
  po_number?: string;
  beneficiary_account_masked?: string;
  bank_name?: string;
  approved_by?: string;
  approval_role?: string;
  contract_ref?: string;
  date?: string;
  terms?: string;
  claims: string[];
  uncertainties: string[];
  missing_information: string[];
  conflicts: string[];
  extraction_engine?: string;
}

export interface UnstructuredIntakeExtraction {
  vendor_name: string;
  amount: number;
  currency: string;
  invoice_number?: string;
  po_number?: string;
  requestor_name: string;
  purpose: string;
  requested_action: string;
  beneficiary_account_masked?: string;
  bank_name?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  confidence_notes: string[];
  suggested_scenario_type: PaymentScenarioType;
  claims?: string[];
  signals?: SafetySignals;
}

export interface DashboardMetrics {
  transactions_reviewed: number;
  awaiting_verification_count: number;
  allowed_count: number;
  verify_required_count: number;
  blocked_count: number;
  total_exposure_reviewed: number;
  avg_resolution_time_minutes: number;
  is_demo_environment: boolean;
}
