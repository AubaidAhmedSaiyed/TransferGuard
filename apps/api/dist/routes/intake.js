"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../db/store");
const transactions_1 = require("./transactions");
const router = (0, express_1.Router)();
// Context extraction helper
function extractContextFromText(rawText) {
    const text = rawText.toLowerCase();
    let vendorName = 'Unknown Vendor';
    let amount = 0;
    let currency = 'USD';
    let invoiceNumber = undefined;
    let poNumber = undefined;
    let requestorName = 'Sarah Chen';
    let requestedAction = 'standard_payment';
    let urgency = 'medium';
    let beneficiaryMasked = undefined;
    const confidenceNotes = [];
    // Vendor matching
    if (text.includes('acme') || text.includes('acme supplies')) {
        vendorName = 'Acme Supplies';
        confidenceNotes.push('Matched vendor: Acme Supplies (Vendor ID vnd-acme)');
    }
    else if (text.includes('northstar') || text.includes('northstar industrial')) {
        vendorName = 'Northstar Industrial Supplies';
        confidenceNotes.push('Matched vendor: Northstar Industrial Supplies');
    }
    else if (text.includes('newco') || text.includes('newco holdings') || text.includes('acquisition')) {
        vendorName = 'NewCo Holdings LLC';
        confidenceNotes.push('Matched corporate counterparty: NewCo Holdings LLC');
    }
    else if (text.includes('apex') || text.includes('offshore') || text.includes('cayman')) {
        vendorName = 'Apex Global Holdings / Unregistered';
        confidenceNotes.push('Unrecognized vendor entity flagged.');
    }
    // Amount extraction
    const amountMatch = rawText.match(/\$([0-9,]+(\.[0-9]{2})?)/) || rawText.match(/([0-9,]+(\.[0-9]{2})?)\s*(usd|dollars)/i);
    if (amountMatch) {
        amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        confidenceNotes.push(`Extracted explicit dollar amount: $${amount.toLocaleString()}`);
    }
    else if (text.includes('480,000') || text.includes('480000') || text.includes('480k')) {
        amount = 480000;
    }
    else if (text.includes('12,400') || text.includes('12400')) {
        amount = 12400;
    }
    else if (text.includes('8,000,000') || text.includes('8000000') || text.includes('8m')) {
        amount = 8000000;
    }
    // Invoice extraction
    const invMatch = rawText.match(/(INV-[0-9A-Z]+)/i) || rawText.match(/invoice\s*#?\s*([0-9A-Z-]+)/i);
    if (invMatch) {
        invoiceNumber = invMatch[1].toUpperCase();
        confidenceNotes.push(`Extracted invoice identifier: ${invoiceNumber}`);
    }
    // PO extraction
    const poMatch = rawText.match(/(PO-[0-9A-Z]+)/i) || rawText.match(/purchase order\s*#?\s*([0-9A-Z-]+)/i);
    if (poMatch) {
        poNumber = poMatch[1].toUpperCase();
        confidenceNotes.push(`Extracted purchase order reference: ${poNumber}`);
    }
    // Account change / manipulation signals
    if (text.includes('new account') || text.includes('banking details') || text.includes('update') || text.includes('routing') || text.includes('bank change')) {
        requestedAction = 'change_beneficiary_and_pay';
        confidenceNotes.push('Detected intent to redirect payment destination to new banking details.');
    }
    // Account number extraction
    const acctMatch = rawText.match(/\*{0,4}(\d{4})\b/) || rawText.match(/acct\s*#?\s*(\d+)/i);
    if (acctMatch) {
        beneficiaryMasked = `****${acctMatch[1].slice(-4)}`;
    }
    // Urgency
    if (text.includes('urgent') || text.includes('immediately') || text.includes('asap') || text.includes('today')) {
        urgency = 'high';
    }
    if (text.includes('confidential') || text.includes('do not delay') || text.includes('emergency')) {
        urgency = 'critical';
    }
    // Suggested scenario
    let suggestedScenario = 'normal';
    if (requestedAction === 'change_beneficiary_and_pay') {
        suggestedScenario = 'beneficiary_manipulation';
    }
    else if (vendorName.includes('Unregistered') || (!invoiceNumber && !poNumber && amount > 100000 && !text.includes('acquisition'))) {
        suggestedScenario = 'unsupported';
    }
    else if (amount >= 1000000 || text.includes('acquisition')) {
        suggestedScenario = 'unusual_legitimate';
    }
    return {
        vendor_name: vendorName,
        amount,
        currency,
        invoice_number: invoiceNumber,
        po_number: poNumber,
        requestor_name: requestorName,
        purpose: rawText.slice(0, 120) + (rawText.length > 120 ? '...' : ''),
        requested_action: requestedAction,
        beneficiary_account_masked: beneficiaryMasked || '****9174',
        urgency,
        confidenceNotes,
        suggested_scenario_type: suggestedScenario
    };
}
// POST /api/intake/extract - Extract structured context from unstructured text
router.post('/extract', (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
        res.status(400).json({ success: false, error: 'Text prompt is required.' });
        return;
    }
    const extraction = extractContextFromText(text);
    res.json({
        success: true,
        data: extraction
    });
});
// POST /api/intake/convert - Convert extracted intake into a live evaluated transaction
router.post('/convert', (req, res) => {
    const { extraction, raw_text } = req.body;
    let baseTxId = 'tx-1002';
    if (extraction.suggested_scenario_type === 'unsupported') {
        baseTxId = 'tx-1003';
    }
    else if (extraction.suggested_scenario_type === 'unusual_legitimate') {
        baseTxId = 'tx-1004';
    }
    else if (extraction.suggested_scenario_type === 'normal') {
        baseTxId = 'tx-1001';
    }
    const template = store_1.db.getPayment(baseTxId);
    if (!template) {
        res.status(404).json({ success: false, error: 'Base transaction template not found' });
        return;
    }
    const customId = `tx-custom-${Date.now().toString().slice(-4)}`;
    const newPayment = {
        ...template,
        id: customId,
        tx_code: `TX-${Date.now().toString().slice(-4)}`,
        amount: extraction.amount || template.amount,
        purpose: extraction.purpose || template.purpose,
        unstructured_intake_text: raw_text,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    store_1.db.payments.set(newPayment.id, newPayment);
    // Add intake audit log
    store_1.db.addAuditLog(newPayment.id, {
        payment_id: newPayment.id,
        timestamp: new Date().toISOString(),
        time_offset_label: new Date().toLocaleTimeString(),
        actor: 'AI Unstructured Intake Engine',
        action: 'Payment Request Ingested from Natural Language Text',
        details: `Extracted Vendor: ${extraction.vendor_name} | Amount: $${(extraction.amount || template.amount).toLocaleString()} USD | Action: ${extraction.requested_action}`,
        decision_snapshot: 'PENDING'
    });
    const evaluated = (0, transactions_1.evaluatePayment)(newPayment);
    res.json({
        success: true,
        message: 'Payment extracted and evaluated successfully.',
        data: evaluated
    });
});
exports.default = router;
