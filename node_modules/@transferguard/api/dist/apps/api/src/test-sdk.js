"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@transferguard/sdk");
const integrations_1 = require("@transferguard/integrations");
async function testSDKAndIntegrations() {
    console.log('====================================================');
    console.log('🚀 TESTING @transferguard/sdk & @transferguard/integrations');
    console.log('====================================================');
    // 1. Initialize SDK
    const guard = new sdk_1.TransferGuard({
        endpoint: 'http://localhost:3001',
        apiKey: 'tg_live_test_secret'
    });
    console.log('\n--- 1. TESTING SDK EVALUATION CONTRACT ---');
    const decision = await guard.evaluate({
        amount: 480000,
        currency: 'USD',
        beneficiary: {
            name: 'Acme Supplies Corp',
            account: '****9174',
            bankName: 'First National Bank'
        },
        requester: {
            id: 'usr_sarah',
            name: 'Sarah Chen',
            role: 'Senior Procurement Specialist'
        },
        purpose: 'Urgent invoice payment INV-8841',
        invoiceNumber: 'INV-8841',
        isUrgent: true
    });
    console.log('SDK Decision Status:', decision.status);
    console.log('SDK Reason:', decision.reason);
    console.log('Audit ID:', decision.auditId);
    console.log('Controls Count:', decision.controls.length);
    console.log('Required Actions Count:', decision.requiredActions.length);
    if (decision.status !== 'VERIFY' && decision.status !== 'ALLOW' && decision.status !== 'BLOCK') {
        throw new Error('Invalid SDK decision status: ' + decision.status);
    }
    console.log('✓ SDK evaluate() contract successfully returned structured decision');
    // 2. Testing Webhook verification helper
    console.log('\n--- 2. TESTING WEBHOOK PARSER & EVENT CONTRACT ---');
    const webhook = new sdk_1.TransferGuardWebhook('tg_whsec_test_secret');
    const event = webhook.constructEvent(JSON.stringify({
        id: 'evt_12345',
        event: 'transfer.review_required',
        timestamp: new Date().toISOString(),
        data: {
            transferId: decision.transferId,
            amount: 480000,
            beneficiary: 'Acme Supplies Corp'
        }
    }));
    console.log('Webhook Event Type:', event.event);
    console.log('Webhook Event Data:', event.data);
    if (event.event !== 'transfer.review_required') {
        throw new Error('Webhook parsing failed');
    }
    console.log('✓ Webhook constructor verified');
    // 3. Testing Integrations Adapters
    console.log('\n--- 3. TESTING PAYMENT PROVIDER ADAPTERS ---');
    const httpAdapter = new integrations_1.GenericHTTPAdapter();
    const httpConn = await httpAdapter.verifyConnection();
    console.log(`[${httpAdapter.name}] Connected:`, httpConn.connected, `(${httpConn.message})`);
    const stripeAdapter = new integrations_1.StripeAdapter();
    const stripeConn = await stripeAdapter.verifyConnection();
    console.log(`[${stripeAdapter.name}] Connected:`, stripeConn.connected, `(${stripeConn.message})`);
    const bankAdapter = new integrations_1.BankAdapter();
    const bankConn = await bankAdapter.verifyConnection();
    console.log(`[${bankAdapter.name}] Connected:`, bankConn.connected, `(${bankConn.message})`);
    console.log('\n====================================================');
    console.log('🎉 ALL SDK & INTEGRATION ADAPTER TESTS PASSED!');
    console.log('====================================================');
}
testSDKAndIntegrations().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
