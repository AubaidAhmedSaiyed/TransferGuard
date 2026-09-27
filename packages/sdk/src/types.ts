export type TransferGuardDecisionStatus = 'ALLOW' | 'VERIFY' | 'BLOCK';

export interface EvaluateTransferRequest {
  amount: number;
  currency: string;
  beneficiary: {
    name: string;
    account?: string;
    bankName?: string;
    routingNumber?: string;
  };
  requester?: {
    id?: string;
    name?: string;
    role?: string;
  };
  purpose?: string;
  invoiceNumber?: string;
  purchaseOrderNumber?: string;
  isUrgent?: boolean;
  rawMemo?: string;
  supportingDocuments?: {
    title: string;
    content: string;
    type?: string;
  }[];
}

export interface EvaluateTransferDecision {
  status: TransferGuardDecisionStatus;
  reason: string;
  controls: {
    id: string;
    name: string;
    passed: boolean;
    reason: string;
  }[];
  evidence: {
    type: string;
    title: string;
    status: 'verified' | 'unresolved' | 'failed' | 'not_required';
    details?: string;
  }[];
  requiredActions: {
    type: string;
    label: string;
    instruction: string;
  }[];
  auditId: string;
  transferId: string;
  evaluatedAt: string;
}

export interface TransferGuardConfig {
  apiKey?: string;
  endpoint?: string;
  timeoutMs?: number;
  organizationId?: string;
}

export interface WebhookEvent<T = any> {
  id: string;
  event: 
    | 'transfer.review_required' 
    | 'transfer.verified' 
    | 'transfer.allowed' 
    | 'transfer.blocked';
  timestamp: string;
  data: T;
  signature?: string;
}
