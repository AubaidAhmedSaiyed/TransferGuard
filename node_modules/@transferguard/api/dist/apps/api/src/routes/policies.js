"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../db/store");
const ai_1 = require("../services/ai");
const transactions_1 = require("./transactions");
const router = (0, express_1.Router)();
// GET /api/policies - List all organizational policies
router.get('/', (req, res) => {
    const policies = store_1.db.getPolicies();
    res.json({ success: true, count: policies.length, data: policies });
});
// POST /api/policies - Create a new policy
router.post('/', (req, res) => {
    const { name, description, condition_type, threshold_amount, required_role, action = 'VERIFY', reason } = req.body;
    if (!name || !description || !condition_type) {
        res.status(400).json({ success: false, error: 'Name, description, and condition_type are required.' });
        return;
    }
    const newPolicy = {
        id: `pol-custom-${Date.now().toString().slice(-6)}`,
        name,
        description,
        condition_type,
        threshold_amount: threshold_amount ? Number(threshold_amount) : undefined,
        required_role: required_role || undefined,
        action: (action === 'ALLOW' || action === 'BLOCK' || action === 'VERIFY') ? action : 'VERIFY',
        reason: reason || `Policy enforcement rule: ${name}`,
        enabled: true,
        is_custom: true,
        created_at: new Date().toISOString()
    };
    store_1.db.addPolicy(newPolicy);
    res.json({ success: true, message: 'Policy rule created successfully.', data: newPolicy });
});
// PUT /api/policies/:id - Update policy (enable/disable or edit)
router.put('/:id', (req, res) => {
    const policyId = req.params.id;
    const existing = store_1.db.getPolicy(policyId);
    if (!existing) {
        res.status(404).json({ success: false, error: `Policy '${policyId}' not found.` });
        return;
    }
    const updated = {
        ...existing,
        ...req.body,
        id: existing.id // protect ID
    };
    store_1.db.updatePolicy(updated);
    res.json({ success: true, message: 'Policy updated successfully.', data: updated });
});
// DELETE /api/policies/:id - Delete policy
router.delete('/:id', (req, res) => {
    const policyId = req.params.id;
    const existing = store_1.db.getPolicy(policyId);
    if (!existing) {
        res.status(404).json({ success: false, error: `Policy '${policyId}' not found.` });
        return;
    }
    store_1.db.deletePolicy(policyId);
    res.json({ success: true, message: `Policy '${policyId}' deleted.` });
});
// POST /api/policies/propose - Natural language rule proposal
router.post('/propose', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
        res.status(400).json({ success: false, error: 'Text requirement is required.' });
        return;
    }
    const candidate = await ai_1.AIService.parseNaturalLanguagePolicy(text);
    res.json({
        success: true,
        message: 'AI structured policy candidate generated. Human approval required to activate.',
        data: candidate
    });
});
// POST /api/policies/:id/test - Test a policy against a transaction
router.post('/:id/test', (req, res) => {
    const policyId = req.params.id;
    const { transaction_id } = req.body;
    const policy = store_1.db.getPolicy(policyId);
    const payment = transaction_id ? store_1.db.getPayment(transaction_id) : store_1.db.getAllPayments()[0];
    if (!policy || !payment) {
        res.status(404).json({ success: false, error: 'Policy or transaction not found for testing.' });
        return;
    }
    const result = (0, transactions_1.evaluatePayment)(payment);
    const policyResult = result.evaluation.applied_policies.find(p => p.policy_id === policyId);
    res.json({
        success: true,
        policy,
        tested_transaction: {
            id: payment.id,
            tx_code: payment.tx_code,
            amount: payment.amount,
            vendor_name: payment.vendor_name
        },
        result: policyResult || {
            policy_id: policy.id,
            policy_name: policy.name,
            passed: true,
            triggered_action: 'ALLOW',
            reason: 'Evaluated compliant.'
        }
    });
});
exports.default = router;
