"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_1 = require("../services/ai");
const store_1 = require("../db/store");
const router = (0, express_1.Router)();
// GET /api/ai/status - Health and provider info
router.get('/status', async (req, res) => {
    const status = await ai_1.AIService.getStatus();
    res.json({ success: true, data: status });
});
// POST /api/ai/intent - Natural-language request -> structured action
router.post('/intent', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
        res.status(400).json({ success: false, error: 'Text prompt is required.' });
        return;
    }
    const analysis = await ai_1.AIService.analyzeIntent(text);
    // AI Request Logging (store request type, model, structured output without sensitive secrets)
    console.log(`[AI Intake] Intent analyzed: ${analysis.action} | Vendor: ${analysis.vendor} | Amount: $${analysis.amount} | Urgency: ${analysis.urgency}`);
    res.json({
        success: true,
        data: analysis
    });
});
// POST /api/ai/evidence - Unstructured document text -> extracted claims
router.post('/evidence', async (req, res) => {
    const { text, document_type = 'invoice' } = req.body;
    if (!text || typeof text !== 'string') {
        res.status(400).json({ success: false, error: 'Document text is required.' });
        return;
    }
    const extracted = await ai_1.AIService.extractEvidence(text, document_type);
    res.json({
        success: true,
        data: extracted
    });
});
// POST /api/ai/conflicts - Compare claims across documents vs payment
router.post('/conflicts', async (req, res) => {
    const { payment_id, payment: customPayment } = req.body;
    const payment = customPayment || (payment_id ? store_1.db.getPayment(payment_id) : undefined);
    if (!payment) {
        res.status(400).json({ success: false, error: 'Valid payment object or payment_id is required.' });
        return;
    }
    const evidenceDocs = store_1.db.getEvidenceDocuments(payment.id);
    const conflicts = await ai_1.AIService.detectConflicts(payment, evidenceDocs);
    res.json({
        success: true,
        data: { conflicts }
    });
});
// POST /api/ai/policy - Convert natural language rule to structured policy candidate
router.post('/policy', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
        res.status(400).json({ success: false, error: 'Policy text is required.' });
        return;
    }
    const policyCandidate = await ai_1.AIService.parseNaturalLanguagePolicy(text);
    res.json({
        success: true,
        data: policyCandidate
    });
});
exports.default = router;
