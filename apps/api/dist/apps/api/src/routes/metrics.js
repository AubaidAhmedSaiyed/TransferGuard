"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../db/store");
const router = (0, express_1.Router)();
// GET /api/metrics - Real dynamically calculated dashboard metrics
router.get('/', (req, res) => {
    const metrics = store_1.db.getDashboardMetrics();
    res.json({
        success: true,
        data: metrics
    });
});
exports.default = router;
