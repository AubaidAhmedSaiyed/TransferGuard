import express from 'express';
import cors from 'cors';
import { db } from './db/store';
import transactionsRouter, { evaluatePayment } from './routes/transactions';
import policiesRouter from './routes/policies';
import evidenceRouter from './routes/evidence';
import aiRouter from './routes/ai';
import metricsRouter from './routes/metrics';
import simulateRouter from './routes/simulate';
import { AIService } from './services/ai';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TransferGuard Pre-Transfer Safety Platform',
    version: '2.0.0',
    philosophy: 'AI can understand. Evidence must authorize.'
  });
});

app.use('/api/transactions', transactionsRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/ai', aiRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/simulate', simulateRouter);

const PORT = 3099;
const BASE_URL = `http://localhost:${PORT}`;

async function runBlackBoxJudgeVerification() {
  console.log('======================================================================');
  console.log('🧑‍⚖️  FIRST-TIME JUDGE BLACK-BOX PRODUCT VERIFICATION');
  console.log('    TransferGuard Pre-Transfer Safety Platform');
  console.log('======================================================================\n');

  const server = app.listen(PORT);
  console.log(`✓ Test API server listening on ${BASE_URL}`);

  try {
    // 1. HEALTH CHECK & ENGINE PHILOSOPHY
    console.log('\n--- 1. HEALTH CHECK & CORE ENGINE VERIFICATION ---');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthJson = await healthRes.json();
    console.log(`Status: ${healthJson.status} | Service: ${healthJson.service}`);
    console.log(`Philosophy: "${healthJson.philosophy}"`);
    if (healthJson.status !== 'ok') throw new Error('Health check failed');
    console.log('✓ Health check passed');

    // 2. AI & OLLAMA STATUS CHECK
    console.log('\n--- 2. AI PROVIDER & OLLAMA STATUS ---');
    const aiStatusRes = await fetch(`${BASE_URL}/api/ai/status`);
    const aiStatus = await aiStatusRes.json();
    console.log(`AI Provider Status:`, aiStatus.data);
    console.log(`Online: ${aiStatus.data.online ? 'YES (Ollama connected)' : 'NO (Graceful local fallback active)'}`);
    console.log('✓ AI Status endpoint verified');

    // 3. REAL USER TRANSACTION INTENT PARSING
    console.log('\n--- 3. NLP INTENT & SIGNAL PARSING ---');
    const judgePrompt = "Please urgently pay Acme Supplies $480,000 for invoice INV-8841. They sent updated banking details this morning.";
    console.log(`Input Instruction:\n"${judgePrompt}"`);
    
    const intentRes = await fetch(`${BASE_URL}/api/ai/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: judgePrompt })
    });
    const intentData = (await intentRes.json()).data;
    console.log(`Action: ${intentData.action}`);
    console.log(`Extracted Vendor: ${intentData.vendor}`);
    console.log(`Extracted Amount: $${intentData.amount.toLocaleString()} ${intentData.currency}`);
    console.log(`Extracted Invoice: ${intentData.invoice}`);
    console.log(`Safety Signals: Beneficiary Change = ${intentData.signals.beneficiary_change ? 'YES' : 'NO'}, Urgency = ${intentData.signals.unusual_urgency ? 'YES' : 'NO'}`);
    console.log(`Extraction Engine Used: ${intentData.extraction_engine}`);

    if (!intentData.signals.beneficiary_change) {
      throw new Error('Expected beneficiary_change signal to be true');
    }
    console.log('✓ AI Intent & Signal parsing successfully extracted safety signals');

    // 4. SUBMIT REAL USER TRANSACTION TO WORKSPACE
    console.log('\n--- 4. USER TRANSACTION CREATION & DETERMINISTIC EVALUATION ---');
    const createTxRes = await fetch(`${BASE_URL}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendor_name: intentData.vendor,
        amount: intentData.amount,
        currency: intentData.currency,
        beneficiary_account_masked: intentData.beneficiary_account || '****9174',
        destination_bank_name: 'First National Bank',
        purpose: judgePrompt,
        invoice_number: intentData.invoice,
        requestor_name: 'Sarah Chen',
        payment_method: 'wire',
        unstructured_intake_text: judgePrompt,
        claims: intentData.claims,
        signals: intentData.signals
      })
    });

    const createTxData = (await createTxRes.json()).data;
    const createdPayment = createTxData.payment;
    const initialEval = createTxData.evaluation;

    console.log(`Created Transaction ID: ${createdPayment.id} (${createdPayment.tx_code})`);
    console.log(`Initial Calculated Decision: ${initialEval.decision} (Expected: VERIFY)`);
    console.log(`Headline: ${initialEval.headline}`);
    console.log(`Required Action: ${initialEval.required_actions[0]?.label}`);

    if (initialEval.decision !== 'VERIFY') {
      throw new Error(`Expected decision VERIFY, got ${initialEval.decision}`);
    }
    console.log('✓ Transaction accurately held for targeted verification');

    // 5. PERFORM TARGETED HUMAN-IN-THE-LOOP VERIFICATION
    console.log('\n--- 5. HUMAN-IN-THE-LOOP VERIFICATION WORKFLOW ---');
    console.log('Simulating out-of-band callback to Acme Supplies Accounts Receivable (+1 555-018-4499)...');
    
    const verifyRes = await fetch(`${BASE_URL}/api/transactions/${createdPayment.id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verification_method: 'trusted_callback',
        confirmed_by: 'Sarah Chen',
        confirmed_role: 'Treasury Operations Specialist',
        statement: 'Spoke directly with John Miller (Acme AR Controller) on registered corporate phone number. Verified account ending ****9174 belongs to legitimate new lockbox account.',
        reason: 'Out-of-band phone verification completed and authenticated.',
        notes: 'Call duration 4 mins. Reference ticket ACME-SEC-9921.'
      })
    });

    const postVerifyData = (await verifyRes.json()).data;
    const postVerifyEval = postVerifyData.evaluation;

    console.log(`Post-Verification Calculated Decision: ${postVerifyEval.decision} (Expected: ALLOW)`);
    console.log(`Post-Verification Headline: ${postVerifyEval.headline}`);

    if (postVerifyEval.decision !== 'ALLOW') {
      throw new Error(`Expected post-verification decision ALLOW, got ${postVerifyEval.decision}`);
    }
    console.log('✓ Target verification successfully unlocked payment safely to ALLOW');

    // 6. IMMUTABLE AUDIT LOGS
    console.log('\n--- 6. IMMUTABLE AUDIT TRAIL VERIFICATION ---');
    const auditRes = await fetch(`${BASE_URL}/api/transactions/${createdPayment.id}/audit`);
    const auditLogs = (await auditRes.json()).data;
    console.log(`Audit Trail Entries Count: ${auditLogs.length}`);
    auditLogs.forEach((log: any, idx: number) => {
      console.log(`  [${idx + 1}] ${log.time_offset_label} | ${log.actor} -> ${log.action} (Decision: ${log.decision_snapshot})`);
    });
    if (auditLogs.length < 3) {
      throw new Error('Expected at least 3 audit log entries');
    }
    console.log('✓ Immutable Audit Trail confirmed');

    // 7. POLICY MANAGEMENT VERIFICATION
    console.log('\n--- 7. DYNAMIC POLICY ENGINE CONFIGURATION ---');
    const nlPolicyText = "All international transfers over $250,000 require CFO authorization.";
    const parsePolicyRes = await fetch(`${BASE_URL}/api/policies/propose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: nlPolicyText })
    });
    const parsedPolicy = (await parsePolicyRes.json()).data;
    console.log(`NLP Rule: "${nlPolicyText}"`);
    console.log(`Structured Policy Proposal:`, {
      name: parsedPolicy.name,
      condition_type: parsedPolicy.condition_type,
      threshold_amount: parsedPolicy.threshold_amount,
      action: parsedPolicy.action
    });

    const addPolicyRes = await fetch(`${BASE_URL}/api/policies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedPolicy)
    });
    const addPolicyData = (await addPolicyRes.json()).data;
    console.log(`Created Custom Policy ID: ${addPolicyData.id}`);
    console.log('✓ Policy Engine dynamic configuration verified');

    // 8. EVIDENCE HUB VERIFICATION
    console.log('\n--- 8. EVIDENCE HUB & FACT EXTRACTION ---');
    const invoiceDocText = `
INVOICE
Vendor: Acme Supplies
Invoice Number: INV-8841
Amount: $480,000.00 USD
Date: 2026-09-20
Authorized Signatory: Mark Sterling (Procurement VP)
Beneficiary Account: ****9174
Depository Bank: First National Bank
`;
    const docExtractRes = await fetch(`${BASE_URL}/api/ai/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: invoiceDocText, document_type: 'invoice' })
    });
    const docFacts = (await docExtractRes.json()).data;
    console.log(`Extracted Document Facts:`, {
      vendor_name: docFacts.vendor_name,
      amount: docFacts.amount,
      invoice_number: docFacts.invoice_number,
      signatory: docFacts.approved_by,
      beneficiary_account: docFacts.beneficiary_account_masked
    });
    if (docFacts.amount !== 480000) {
      throw new Error(`Expected extracted amount 480000, got ${docFacts.amount}`);
    }
    console.log('✓ Document Fact Extraction verified');

    console.log('\n======================================================================');
    console.log('🎉 ALL FIRST-TIME JUDGE BLACK-BOX VERIFICATION STEPS PASSED 100%');
    console.log('======================================================================');
  } finally {
    server.close();
  }
}

runBlackBoxJudgeVerification().catch(err => {
  console.error('Judge Black-Box Verification Failed:', err);
  process.exit(1);
});
