import { Router, Request, Response } from 'express';
import { db } from '../db/store';

const router = Router();

// GET /api/metrics - Real dynamically calculated dashboard metrics
router.get('/', (req: Request, res: Response) => {
  const metrics = db.getDashboardMetrics();
  res.json({
    success: true,
    data: metrics
  });
});

export default router;
