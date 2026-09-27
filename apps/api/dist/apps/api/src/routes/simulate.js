"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../db/store");
const transactions_1 = require("./transactions");
const router = (0, express_1.Router)();
// POST /api/simulate/interception - Simulate Scenario 2: Beneficiary Manipulation
router.post('/interception', (req, res) => {
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
    payment.lifecycle_state = 'VERIFY_REQUIRED';
    payment.updated_at = new Date().toISOString();
    store_1.db.updatePayment(payment);
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
// POST /api/simulate/unsupported - Simulate Scenario 3: Unsupported Transfer (CEO Fraud)
router.post('/unsupported', (req, res) => {
    const payment = store_1.db.getPayment('tx-1003');
    if (!payment) {
        res.status(404).json({ success: false, error: 'TX-1003 not found' });
        return;
    }
    payment.current_decision = 'BLOCK';
    payment.lifecycle_state = 'BLOCKED';
    payment.updated_at = new Date().toISOString();
    store_1.db.updatePayment(payment);
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: new Date().toISOString(),
        time_offset_label: new Date().toLocaleTimeString(),
        actor: 'Attack Simulation Framework',
        action: 'Simulated Unsupported Transfer Triggered',
        details: 'Ingested spoofed directive with missing PO, missing invoice, unauthorized requestor and unregistered beneficiary.',
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
    payment.lifecycle_state = 'APPROVED';
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
    payment.lifecycle_state = 'APPROVED';
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
// POST /api/simulate/attack-create - Dynamically create a real attack transaction (Section 40)
router.post('/attack-create', (req, res) => {
    const txNumber = Math.floor(2000 + Math.random() * 7000);
    const txId = `tx-attack-${Date.now().toString().slice(-6)}`;
    const txCode = `TX-ATK-${txNumber}`;
    // Use valid vendor Acme Supplies, valid invoice INV-8841, valid PO-7281, but intercepted account
    const vendor = store_1.db.vendors.get('vnd-acme');
    // Create an unverified rogue account
    const rogueAccountId = `bnk-rogue-${Date.now().toString().slice(-4)}`;
    const rogueAccount = {
        id: rogueAccountId,
        vendor_id: vendor.id,
        bank_name: 'Rogue First National Bank',
        account_number_masked: '****6619',
        routing_number: '071000013',
        account_type: 'checking',
        verified: false,
        verification_method: 'unverified',
        created_at: new Date().toISOString(),
        is_primary: false
    };
    store_1.db.bankAccounts.set(rogueAccountId, rogueAccount);
    const newPayment = {
        id: txId,
        tx_code: txCode,
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        invoice_id: 'inv-8841',
        invoice_number: 'INV-8841',
        purchase_order_id: 'po-7281',
        po_number: 'PO-7281',
        beneficiary_account_id: rogueAccountId,
        destination_account_masked: rogueAccount.account_number_masked,
        destination_bank_name: rogueAccount.bank_name,
        amount: 480000,
        currency: 'USD',
        requestor_id: 'emp-sarah-chen',
        requestor_name: 'Sarah Chen',
        requestor_role: 'Senior Procurement Specialist',
        purpose: 'Interception Test: Staging automation settlement to hijacked account ****6619',
        payment_method: 'wire',
        scenario_type: 'beneficiary_manipulation',
        scenario_title: `Live Interception Attack Simulation (${txCode})`,
        is_unusual_amount: false,
        historical_baseline_note: 'Interception attack: valid invoice & PO maintained, but bank coordinates intercepted.',
        unstructured_intake_text: 'Urgent payment for INV-8841 to updated account ****6619.',
        current_decision: 'VERIFY',
        lifecycle_state: 'VERIFY_REQUIRED',
        claims: ['Valid Acme invoice INV-8841', 'Approved PO-7281', 'Beneficiary changed to rogue account ****6619'],
        signals: {
            beneficiary_change: true,
            unusual_urgency: true
        },
        is_user_created: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    store_1.db.createPayment(newPayment);
    store_1.db.addAuditLog(newPayment.id, {
        payment_id: newPayment.id,
        timestamp: new Date().toISOString(),
        time_offset_label: new Date().toLocaleTimeString(),
        actor: 'Attack Simulator Engine',
        action: 'Synthetic Attack Transaction Generated',
        details: `Created live transaction ${txCode} ($480,000 USD) with intercepted beneficiary ${rogueAccount.account_number_masked}.`,
        decision_snapshot: 'PENDING'
    });
    const evaluated = (0, transactions_1.evaluatePayment)(newPayment);
    store_1.db.addAuditLog(newPayment.id, {
        payment_id: newPayment.id,
        timestamp: new Date(Date.now() + 500).toISOString(),
        time_offset_label: new Date(Date.now() + 500).toLocaleTimeString(),
        actor: 'Decision Engine',
        action: 'Attack Evaluation Completed',
        details: `Beneficiary modification detected without callback confirmation. Decision: VERIFY.`,
        decision_snapshot: 'VERIFY'
    });
    evaluated.auditLogs = store_1.db.getAuditLogs(newPayment.id);
    res.status(201).json({
        success: true,
        message: 'Synthetic attack transaction created and evaluated.',
        data: evaluated
    });
});
exports.default = router;
