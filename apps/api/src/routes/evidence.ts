import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { AIService } from '../services/ai';

const router = Router();

// GET /api/evidence - List all evidence documents
router.get('/', (req: Request, res: Response) => {
  const documents = db.getAllEvidenceDocuments();
  res.json({
    success: true,
    count: documents.length,
    data: documents
  });
});

// POST /api/evidence/analyze - Standalone document text analysis
router.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  const { text, document_type = 'invoice' } = req.body;
  if (!text) {
    res.status(400).json({ success: false, error: 'Document text is required.' });
    return;
  }

  const extracted = await AIService.extractEvidence(text, document_type);
  res.json({
    success: true,
    data: extracted
  });
});

export default router;
