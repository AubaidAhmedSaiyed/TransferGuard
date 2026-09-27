import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import transactionsRouter from './routes/transactions';
import simulateRouter from './routes/simulate';
import metricsRouter from './routes/metrics';
import intakeRouter from './routes/intake';
import aiRouter from './routes/ai';
import policiesRouter from './routes/policies';
import evidenceRouter from './routes/evidence';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TransferGuard Pre-Transfer Safety Platform',
    version: '2.0.0',
    philosophy: 'AI can understand. Evidence must authorize.',
    timestamp: new Date().toISOString()
  });
});

// Register routes
app.use('/api/transactions', transactionsRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/ai', aiRouter);
app.use('/api/simulate', simulateRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/intake', intakeRouter);

// Serve static frontend assets if built
const clientDistCandidates = [
  path.resolve(__dirname, '../../web/dist'),
  path.resolve(process.cwd(), 'apps/web/dist'),
  path.resolve(process.cwd(), '../web/dist'),
  path.resolve(__dirname, '../../../apps/web/dist')
];

let clientDistPath = clientDistCandidates.find(p => fs.existsSync(p));

if (clientDistPath) {
  console.log(`[Static] Serving frontend SPA from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath!, 'index.html'));
  });
}

// Fallback error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  TRANSFERGUARD PRE-TRANSFER SAFETY PLATFORM`);
  console.log(`   Philosophy: AI can understand. Evidence must authorize.`);
  console.log(`   Port: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
