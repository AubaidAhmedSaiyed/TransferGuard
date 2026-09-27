"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePayment = evaluatePayment;
const express_1 = require("express");
const store_1 = require("../db/store");
const index_1 = require("../../../packages/evidence-engine/src/index");
const index_2 = require("../../../packages/decision-engine/src/index");
const router = (0, express_1.Router)();
// Helper to build context and evaluate a payment
function evaluatePayment(payment) {
    const vendor = store_1.db.vendors.get(payment.vendor_id);
    const bankAccount = store_1.db.bankAccounts.get(payment.beneficiary_account_id);
    const purchaseOrder = payment.purchase_order_id ? store_1.db.purchaseOrders.get(payment.purchase_order_id) : undefined;
    const invoice = payment.invoice_id ? store_1.db.invoices.get(payment.invoice_id) : undefined;
    const requestor = store_1.db.employees.get(payment.requestor_id);
    const ctx = {
        payment,
        vendor,
        bankAccount,
        purchaseOrder,
        invoice,
        requestor
    };
    const evidences = index_1.EvidenceEngine.collectEvidence(ctx);
    const evaluation = index_2.DecisionEngine.evaluate(payment, evidences);
    // Sync payment current_decision with engine result
    if (payment.current_decision !== evaluation.decision) {
        payment.current_decision = evaluation.decision;
        payment.updated_at = new Date().toISOString();
        store_1.db.updatePayment(payment);
    }
    return {
        payment,
        vendor,
        bankAccount,
        purchaseOrder,
        invoice,
        requestor,
        evidences,
        evaluation,
        auditLogs: store_1.db.getAuditLogs(payment.id)
    };
}
// GET /api/transactions - List all transactions
router.get('/', (req, res) => {
    const payments = store_1.db.getAllPayments();
    const summaryList = payments.map(p => {
        const evaluated = evaluatePayment(p);
        return {
            id: p.id,
            tx_code: p.tx_code,
            vendor_name: p.vendor_name,
            amount: p.amount,
            currency: p.currency,
            requestor_name: p.requestor_name,
            purpose: p.purpose,
            scenario_type: p.scenario_type,
            scenario_title: p.scenario_title,
            is_unusual_amount: p.is_unusual_amount,
            current_decision: p.current_decision,
            evidence_summary: evaluated.evaluation.evidence_summary,
            created_at: p.created_at
        };
    });
    res.json({ success: true, count: summaryList.length, data: summaryList });
});
// GET /api/transactions/:id - Detail of a specific transaction
router.get('/:id', (req, res) => {
    const paymentId = req.params.id.toLowerCase();
    const payment = store_1.db.getPayment(paymentId) || Array.from(store_1.db.payments.values()).find(p => p.tx_code.toLowerCase() === paymentId);
    if (!payment) {
        res.status(404).json({ success: false, error: `Transaction '${req.params.id}' not found.` });
        return;
    }
    const result = evaluatePayment(payment);
    res.json({ success: true, data: result });
});
// POST /api/transactions/:id/evaluate - Deterministic re-evaluation
router.post('/:id/evaluate', (req, res) => {
    const paymentId = req.params.id.toLowerCase();
    const payment = store_1.db.getPayment(paymentId) || Array.from(store_1.db.payments.values()).find(p => p.tx_code.toLowerCase() === paymentId);
    if (!payment) {
        res.status(404).json({ success: false, error: `Transaction '${req.params.id}' not found.` });
        return;
    }
    const result = evaluatePayment(payment);
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: new Date().toISOString(),
        time_offset_label: new Date().toLocaleTimeString(),
        actor: 'Decision Engine (On-Demand Evaluation)',
        action: 'Transaction Re-Evaluated',
        details: `Evaluated ${result.evidences.length} evidence items. Decision calculated: ${result.evaluation.decision}.`,
        decision_snapshot: result.evaluation.decision
    });
    result.auditLogs = store_1.db.getAuditLogs(payment.id);
    res.json({ success: true, data: result });
});
// POST /api/transactions/:id/verify - Perform targeted verification (The key Hackathon moment!)
router.post('/:id/verify', (req, res) => {
    const paymentId = req.params.id.toLowerCase();
    const payment = store_1.db.getPayment(paymentId) || Array.from(store_1.db.payments.values()).find(p => p.tx_code.toLowerCase() === paymentId);
    if (!payment) {
        res.status(404).json({ success: false, error: `Transaction '${req.params.id}' not found.` });
        return;
    }
    const { verification_type = 'beneficiary_out_of_band', notes, verified_by = 'sarah.chen@treasury.corp' } = req.body;
    const vendor = store_1.db.vendors.get(payment.vendor_id);
    const bankAccount = store_1.db.bankAccounts.get(payment.beneficiary_account_id);
    if (!bankAccount) {
        res.status(400).json({ success: false, error: 'Beneficiary account not found.' });
        return;
    }
    // Update bank account to verified
    bankAccount.verified = true;
    bankAccount.verified_at = new Date().toISOString();
    bankAccount.verified_by = `${verified_by} via trusted contact (${vendor?.trusted_contact_name || 'Vendor Primary'})`;
    bankAccount.verification_method = 'out_of_band_callback';
    store_1.db.bankAccounts.set(bankAccount.id, bankAccount);
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    // Audit trail step 1: Verification action performed
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: now.toISOString(),
        time_offset_label: timeStr,
        actor: verified_by,
        action: 'Beneficiary Verification Completed',
        details: `Independently verified new destination account ${payment.destination_account_masked} via trusted out-of-band telephone callback to ${vendor?.trusted_contact_name || 'Elena Rostova'} (${vendor?.trusted_contact_phone || '+1 555-014-9922'}). ${notes ? `Note: ${notes}` : ''}`,
        decision_snapshot: 'PENDING'
    });
    // Re-evaluate immediately with updated state
    const evaluated = evaluatePayment(payment);
    // Audit trail step 2: Re-evaluation resulting in ALLOW
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: new Date(Date.now() + 500).toISOString(),
        time_offset_label: new Date(Date.now() + 500).toLocaleTimeString(),
        actor: 'Decision Engine',
        action: 'Transaction Re-evaluated Post-Verification',
        details: `All supporting evidence and beneficiary credentials now confirmed. Decision transitioned: VERIFY → ALLOW.`,
        decision_snapshot: evaluated.evaluation.decision
    });
    evaluated.auditLogs = store_1.db.getAuditLogs(payment.id);
    res.json({
        success: true,
        message: 'Beneficiary independently verified. Transaction re-evaluated successfully.',
        data: evaluated
    });
});
// POST /api/transactions/reset - Restore pristine demo state
router.post('/reset', (req, res) => {
    store_1.db.seed();
    res.json({
        success: true,
        message: 'TransferGuard demo state has been reset to default pristine baseline.'
    });
});
exports.default = router;
