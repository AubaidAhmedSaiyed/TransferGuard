"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferGuard = void 0;
class TransferGuard {
    apiKey;
    endpoint;
    timeoutMs;
    organizationId;
    constructor(config = {}) {
        this.apiKey = config.apiKey || process?.env?.TRANSFERGUARD_API_KEY || 'tg_live_mock_key';
        this.endpoint = (config.endpoint || process?.env?.TRANSFERGUARD_URL || 'http://localhost:3001').replace(/\/$/, '');
        this.timeoutMs = config.timeoutMs || 10000;
        this.organizationId = config.organizationId;
    }
    /**
     * Evaluates a requested financial transfer against business intent,
     * independent evidence, and organizational policies.
     *
     * Does NOT execute the payment. Returns ALLOW, VERIFY, or BLOCK.
     */
    async evaluate(request) {
        const payload = {
            vendor_name: request.beneficiary.name,
            amount: request.amount,
            currency: request.currency || 'USD',
            beneficiary_account_masked: request.beneficiary.account || '****0000',
            destination_bank_name: request.beneficiary.bankName || 'Unknown Bank',
            purpose: request.purpose || 'Direct API transfer evaluation',
            invoice_number: request.invoiceNumber,
            po_number: request.purchaseOrderNumber,
            requestor_name: request.requester?.name || 'API Client',
            is_urgent: request.isUrgent ?? false,
            unstructured_memo: request.rawMemo || request.purpose || ''
        };
        try {
            const response = await fetch(`${this.endpoint}/api/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    ...(this.organizationId ? { 'X-Organization-ID': this.organizationId } : {})
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`TransferGuard API error: ${response.status} ${response.statusText}`);
            }
            const json = await response.json();
            const data = json.data;
            // Map backend response into clean SDK decision contract
            const decision = {
                status: data.evaluation?.decision || 'VERIFY',
                reason: data.evaluation?.summary || data.evaluation?.headline || 'Evaluation completed',
                controls: (data.evaluation?.applied_policies || []).map((p) => ({
                    id: p.policy_id,
                    name: p.policy_name,
                    passed: p.passed,
                    reason: p.reason
                })),
                evidence: (data.evidences || []).map((ev) => ({
                    type: ev.type,
                    title: ev.title,
                    status: ev.status,
                    details: ev.details || ev.description
                })),
                requiredActions: (data.evaluation?.required_actions || []).map((act) => ({
                    type: act.type,
                    label: act.label,
                    instruction: act.instruction
                })),
                auditId: data.payment?.id || 'aud_' + Math.random().toString(36).substring(2, 9),
                transferId: data.payment?.tx_code || data.payment?.id || 'tx_' + Math.random().toString(36).substring(2, 9),
                evaluatedAt: data.evaluation?.evaluated_at || new Date().toISOString()
            };
            return decision;
        }
        catch (err) {
            // Return safe, high-integrity deterministic fallback if connection fails
            return {
                status: 'VERIFY',
                reason: `TransferGuard connection error: ${err.message || 'Offline'}. Workflow held for safety.`,
                controls: [],
                evidence: [],
                requiredActions: [
                    {
                        type: 'manual_hold',
                        label: 'Network Safety Hold',
                        instruction: 'Verify TransferGuard API endpoint connectivity before releasing payment.'
                    }
                ],
                auditId: 'aud_fallback_' + Date.now(),
                transferId: 'tx_fallback',
                evaluatedAt: new Date().toISOString()
            };
        }
    }
    /**
     * Retrieves the current verification and audit status of a transfer.
     */
    async getTransferStatus(transferId) {
        try {
            const response = await fetch(`${this.endpoint}/api/transactions/${transferId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    ...(this.organizationId ? { 'X-Organization-ID': this.organizationId } : {})
                }
            });
            if (!response.ok)
                return null;
            const json = await response.json();
            const data = json.data;
            return {
                status: data.evaluation?.decision || 'VERIFY',
                reason: data.evaluation?.summary || data.evaluation?.headline || '',
                controls: (data.evaluation?.applied_policies || []).map((p) => ({
                    id: p.policy_id,
                    name: p.policy_name,
                    passed: p.passed,
                    reason: p.reason
                })),
                evidence: (data.evidences || []).map((ev) => ({
                    type: ev.type,
                    title: ev.title,
                    status: ev.status,
                    details: ev.details || ev.description
                })),
                requiredActions: (data.evaluation?.required_actions || []).map((act) => ({
                    type: act.type,
                    label: act.label,
                    instruction: act.instruction
                })),
                auditId: data.payment?.id,
                transferId: data.payment?.tx_code || data.payment?.id,
                evaluatedAt: data.evaluation?.evaluated_at || new Date().toISOString()
            };
        }
        catch {
            return null;
        }
    }
}
exports.TransferGuard = TransferGuard;
