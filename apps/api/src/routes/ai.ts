import { Router, Request, Response } from 'express';
import { AIService } from '../services/ai';
import { db } from '../db/store';

const router = Router();

// GET /api/ai/status - Health and provider info
router.get('/status', async (req: Request, res: Response) => {
  const status = await AIService.getStatus();
  res.json({ success: true, data: status });
});

// POST /api/ai/intent - Natural-language request -> structured action
router.post('/intent', async (req: Request, res: Response): Promise<void> => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    res.status(400).json({ success: false, error: 'Text prompt is required.' });
    return;
  }

  const analysis = await AIService.analyzeIntent(text);

  // AI Request Logging (store request type, model, structured output without sensitive secrets)
  console.log(`[AI Intake] Intent analyzed: ${analysis.action} | Vendor: ${analysis.vendor} | Amount: $${analysis.amount} | Urgency: ${analysis.urgency}`);

  res.json({
    success: true,
    data: analysis
  });
});

// POST /api/ai/evidence - Unstructured document text -> extracted claims
router.post('/evidence', async (req: Request, res: Response): Promise<void> => {
  const { text, document_type = 'invoice' } = req.body;
  if (!text || typeof text !== 'string') {
    res.status(400).json({ success: false, error: 'Document text is required.' });
    return;
  }

  const extracted = await AIService.extractEvidence(text, document_type);
  res.json({
    success: true,
    data: extracted
  });
});

// POST /api/ai/conflicts - Compare claims across documents vs payment
router.post('/conflicts', async (req: Request, res: Response): Promise<void> => {
  const { payment_id, payment: customPayment } = req.body;
  const payment = customPayment || (payment_id ? db.getPayment(payment_id) : undefined);

  if (!payment) {
    res.status(400).json({ success: false, error: 'Valid payment object or payment_id is required.' });
    return;
  }

  const evidenceDocs = db.getEvidenceDocuments(payment.id);
  const conflicts = await AIService.detectConflicts(payment, evidenceDocs);

  res.json({
    success: true,
    data: { conflicts }
  });
});

// POST /api/ai/policy - Convert natural language rule to structured policy candidate
router.post('/policy', async (req: Request, res: Response): Promise<void> => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    res.status(400).json({ success: false, error: 'Policy text is required.' });
    return;
  }

  const policyCandidate = await AIService.parseNaturalLanguagePolicy(text);
  res.json({
    success: true,
    data: policyCandidate
  });
});

export default router;
