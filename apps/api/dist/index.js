"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const simulate_1 = __importDefault(require("./routes/simulate"));
const metrics_1 = __importDefault(require("./routes/metrics"));
const intake_1 = __importDefault(require("./routes/intake"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'TransferGuard Decision Infrastructure API',
        version: '1.0.0',
        philosophy: 'Verify intent before money moves.',
        timestamp: new Date().toISOString()
    });
});
// Register routes
app.use('/api/transactions', transactions_1.default);
app.use('/api/simulate', simulate_1.default);
app.use('/api/metrics', metrics_1.default);
app.use('/api/intake', intake_1.default);
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
    console.log(`🛡️  TRANSFERGUARD API ENGINE RUNNING ON PORT ${PORT}`);
    console.log(`   Tagline: Verify intent before money moves.`);
    console.log(`   Environment: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
});
