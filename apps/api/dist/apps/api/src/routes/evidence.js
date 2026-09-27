"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../db/store");
const ai_1 = require("../services/ai");
const router = (0, express_1.Router)();
// GET /api/evidence - List all evidence documents
router.get('/', (req, res) => {
    const documents = store_1.db.getAllEvidenceDocuments();
    res.json({
        success: true,
        count: documents.length,
        data: documents
    });
});
// POST /api/evidence/analyze - Standalone document text analysis
router.post('/analyze', async (req, res) => {
    const { text, document_type = 'invoice' } = req.body;
    if (!text) {
        res.status(400).json({ success: false, error: 'Document text is required.' });
        return;
    }
    const extracted = await ai_1.AIService.extractEvidence(text, document_type);
    res.json({
        success: true,
        data: extracted
    });
});
exports.default = router;
