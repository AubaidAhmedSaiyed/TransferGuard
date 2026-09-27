"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../db/store");
const transactions_1 = require("./transactions");
const router = (0, express_1.Router)();
// POST /api/simulate/interception - Simulate Scenario 2: Beneficiary Manipulation
router.post('/interception', (req, res) => {
    // Ensure bank account for Acme is reset to unverified
    const bnk = store_1.db.bankAccounts.get('bnk-acme-new');
    if (bnk) {
        bnk.verified = false;
        bnk.verification_method = 'unverified';
        delete bnk.verified_at;
        delete bnk.verified_by;
        store_1.db.bankAccounts.set(bnk.id, bnk);
    }
    const payment = store_1.db.getPayment('tx-1002');
    if (!payment) {
        res.status(404).json({ success: false, error: 'TX-1002 not found' });
        return;
    }
    payment.current_decision = 'VERIFY';
    payment.updated_at = new Date().toISOString();
    store_1.db.updatePayment(payment);
    // Add simulation audit log
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: new Date().toISOString(),
        time_offset_label: new Date().toLocaleTimeString(),
        actor: 'Attack Simulation Framework',
        action: 'Simulated Payment Interception Triggered',
        details: 'Valid invoice INV-8841 and PO-7281 maintained. Beneficiary altered to new unverified account ****9174.',
        decision_snapshot: 'VERIFY'
    });
    const evaluated = (0, transactions_1.evaluatePayment)(payment);
    res.json({
        success: true,
        simulation_name: 'Payment Interception (Beneficiary Manipulation)',
        transaction_id: payment.id,
        data: evaluated
    });
});
// POST /api/simulate/unsupported - Simulate Scenario 3: Unsupported Transfer (CEO Fraud / Mismatch)
router.post('/unsupported', (req, res) => {
    const payment = store_1.db.getPayment('tx-1003');
    if (!payment) {
        res.status(404).json({ success: false, error: 'TX-1003 not found' });
        return;
    }
    payment.current_decision = 'BLOCK';
    payment.updated_at = new Date().toISOString();
    store_1.db.updatePayment(payment);
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: new Date().toISOString(),
        time_offset_label: new Date().toLocaleTimeString(),
        actor: 'Attack Simulation Framework',
        action: 'Simulated Unsupported Transfer Triggered',
        details: 'Ingested spoofed executive transfer directive with missing PO, missing invoice, unauthorized requestor and unregistered beneficiary.',
        decision_snapshot: 'BLOCK'
    });
    const evaluated = (0, transactions_1.evaluatePayment)(payment);
    res.json({
        success: true,
        simulation_name: 'Unsupported Transfer (Missing Evidence & Unauthorized)',
        transaction_id: payment.id,
        data: evaluated
    });
});
// POST /api/simulate/acquisition - Simulate Scenario 4: Genuine Unusual Transaction ($8M M&A)
router.post('/acquisition', (req, res) => {
    const payment = store_1.db.getPayment('tx-1004');
    if (!payment) {
        res.status(404).json({ success: false, error: 'TX-1004 not found' });
        return;
    }
    payment.current_decision = 'ALLOW';
    payment.updated_at = new Date().toISOString();
    store_1.db.updatePayment(payment);
    const evaluated = (0, transactions_1.evaluatePayment)(payment);
    res.json({
        success: true,
        simulation_name: 'Genuine Unusual Transaction ($8,000,000 Acquisition Wire)',
        transaction_id: payment.id,
        data: evaluated
    });
});
// POST /api/simulate/normal - Simulate Scenario 1: Normal Payment
router.post('/normal', (req, res) => {
    const payment = store_1.db.getPayment('tx-1001');
    if (!payment) {
        res.status(404).json({ success: false, error: 'TX-1001 not found' });
        return;
    }
    payment.current_decision = 'ALLOW';
    payment.updated_at = new Date().toISOString();
    store_1.db.updatePayment(payment);
    const evaluated = (0, transactions_1.evaluatePayment)(payment);
    res.json({
        success: true,
        simulation_name: 'Normal Recurring Payment ($12,400 Consumables)',
        transaction_id: payment.id,
        data: evaluated
    });
});
exports.default = router;
