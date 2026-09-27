"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferGuardWebhook = void 0;
class TransferGuardWebhook {
    secret;
    constructor(secret = 'tg_whsec_default') {
        this.secret = secret;
    }
    /**
     * Constructs and verifies a TransferGuard webhook event from incoming raw payload.
     */
    constructEvent(rawPayload, signature) {
        let parsed;
        if (typeof rawPayload === 'string') {
            try {
                parsed = JSON.parse(rawPayload);
            }
            catch {
                throw new Error('Invalid JSON payload for TransferGuard webhook');
            }
        }
        else if (Buffer.isBuffer(rawPayload)) {
            parsed = JSON.parse(rawPayload.toString('utf-8'));
        }
        else {
            parsed = rawPayload;
        }
        if (!parsed.event || !parsed.data) {
            throw new Error('Malformed webhook payload: missing event or data field');
        }
        return {
            id: parsed.id || 'evt_' + Math.random().toString(36).substring(2, 9),
            event: parsed.event,
            timestamp: parsed.timestamp || new Date().toISOString(),
            data: parsed.data,
            signature
        };
    }
}
exports.TransferGuardWebhook = TransferGuardWebhook;
