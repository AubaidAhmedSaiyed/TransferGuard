"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const simulate_1 = __importDefault(require("./routes/simulate"));
const metrics_1 = __importDefault(require("./routes/metrics"));
const intake_1 = __importDefault(require("./routes/intake"));
const ai_1 = __importDefault(require("./routes/ai"));
const policies_1 = __importDefault(require("./routes/policies"));
const evidence_1 = __importDefault(require("./routes/evidence"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json({ limit: '10mb' }));
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
app.use('/api/transactions', transactions_1.default);
app.use('/api/policies', policies_1.default);
app.use('/api/evidence', evidence_1.default);
app.use('/api/ai', ai_1.default);
app.use('/api/simulate', simulate_1.default);
app.use('/api/metrics', metrics_1.default);
app.use('/api/intake', intake_1.default);
// Serve static frontend assets if built
const clientDistCandidates = [
    path_1.default.resolve(__dirname, '../../web/dist'),
    path_1.default.resolve(process.cwd(), 'apps/web/dist'),
    path_1.default.resolve(process.cwd(), '../web/dist'),
    path_1.default.resolve(__dirname, '../../../apps/web/dist')
];
let clientDistPath = clientDistCandidates.find(p => fs_1.default.existsSync(p));
if (clientDistPath) {
    console.log(`[Static] Serving frontend SPA from: ${clientDistPath}`);
    app.use(express_1.default.static(clientDistPath));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path_1.default.join(clientDistPath, 'index.html'));
    });
}
// Fallback error handler
app.use((err, req, res, next) => {
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
