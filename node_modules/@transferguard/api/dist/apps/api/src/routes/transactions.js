"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePayment = evaluatePayment;
const express_1 = require("express");
const store_1 = require("../db/store");
const evidence_engine_1 = require("@transferguard/evidence-engine");
const decision_engine_1 = require("@transferguard/decision-engine");
const ai_1 = require("../services/ai");
const router = (0, express_1.Router)();
// Central evaluation helper
function evaluatePayment(payment) {
    const vendor = store_1.db.vendors.get(payment.vendor_id);
    const bankAccount = store_1.db.bankAccounts.get(payment.beneficiary_account_id);
    const purchaseOrder = payment.purchase_order_id ? store_1.db.purchaseOrders.get(payment.purchase_order_id) : undefined;
    const invoice = payment.invoice_id ? store_1.db.invoices.get(payment.invoice_id) : undefined;
    const requestor = store_1.db.employees.get(payment.requestor_id);
    const attachedDocuments = store_1.db.getEvidenceDocuments(payment.id);
    const policies = store_1.db.getPolicies();
    const ctx = {
        payment,
        vendor,
        bankAccount,
        purchaseOrder,
        invoice,
        requestor,
        attachedDocuments,
        policies
    };
    const evidences = evidence_engine_1.EvidenceEngine.collectEvidence(ctx);
    const evaluation = decision_engine_1.DecisionEngine.evaluate(payment, evidences, policies);
    // Sync payment state with engine result
    if (payment.current_decision !== evaluation.decision || payment.lifecycle_state !== evaluation.lifecycle_state) {
        payment.current_decision = evaluation.decision;
        payment.lifecycle_state = evaluation.lifecycle_state;
        payment.updated_at = new Date().toISOString();
        store_1.db.updatePayment(payment);
    }
    return {
        payment,
        vendor,
        bankAccount,
        purchaseOrder,
        invoice,
        requestor,
        attachedDocuments,
        evidences,
        evaluation,
        auditLogs: store_1.db.getAuditLogs(payment.id),
        verifications: store_1.db.getVerifications(payment.id)
    };
}
// GET /api/transactions - List all transactions
router.get('/', (req, res) => {
    const payments = store_1.db.getAllPayments();
    const summaryList = payments.map(p => {
        const evaluated = evaluatePayment(p);
        return {
            id: p.id,
            tx_code: p.tx_code,
            vendor_name: p.vendor_name,
            amount: p.amount,
            currency: p.currency,
            requestor_name: p.requestor_name,
            purpose: p.purpose,
            scenario_type: p.scenario_type,
            scenario_title: p.scenario_title,
            is_unusual_amount: p.is_unusual_amount,
            current_decision: p.current_decision,
            lifecycle_state: p.lifecycle_state,
            is_user_created: p.is_user_created,
            evidence_summary: evaluated.evaluation.evidence_summary,
            created_at: p.created_at
        };
    });
    res.json({ success: true, count: summaryList.length, data: summaryList });
});
// POST /api/transactions - Real user-created transaction endpoint
router.post('/', async (req, res) => {
    try {
        const { vendor_name = 'Test Supplier', amount = 0, currency = 'USD', beneficiary_account_masked = '****1288', destination_bank_name = 'PNC Bank Commercial', purpose = 'Operational disbursement', invoice_number, po_number, requestor_name = 'Sarah Chen', payment_method = 'wire', unstructured_intake_text, claims = [], signals = {}, attached_evidence = [] } = req.body;
        const numAmount = Number(amount) || 0;
        const txNumber = Math.floor(1000 + Math.random() * 9000);
        const txId = `tx-custom-${Date.now().toString().slice(-6)}`;
        const txCode = `TX-${txNumber}`;
        // 1. Resolve or create Vendor
        let vendor = Array.from(store_1.db.vendors.values()).find(v => v.name.toLowerCase() === vendor_name.toLowerCase());
        if (!vendor) {
            const vendorId = `vnd-cust-${Date.now().toString().slice(-4)}`;
            vendor = {
                id: vendorId,
                name: vendor_name,
                status: 'active',
                verified: !vendor_name.toLowerCase().includes('unknown') && !vendor_name.toLowerCase().includes('unregistered'),
                tax_id: `US-${Math.floor(10000000 + Math.random() * 89999999)}`,
                category: 'Commercial Vendor',
                established_since: '2023-01-01',
                trusted_contact_name: `${vendor_name} Finance Team`,
                trusted_contact_phone: '+1 (555) 018-4499',
                trusted_contact_email: `ar@${vendor_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
            };
            store_1.db.vendors.set(vendor.id, vendor);
        }
        // 2. Resolve or create Bank Account
        let bankAccount = Array.from(store_1.db.bankAccounts.values()).find(b => b.vendor_id === vendor?.id && b.account_number_masked === beneficiary_account_masked);
        if (!bankAccount) {
            const bnkId = `bnk-cust-${Date.now().toString().slice(-4)}`;
            const isBeneficiaryChanged = signals.beneficiary_change || false;
            bankAccount = {
                id: bnkId,
                vendor_id: vendor.id,
                bank_name: destination_bank_name || 'Commercial Depository Bank',
                account_number_masked: beneficiary_account_masked,
                routing_number: '021000021',
                account_type: 'operating',
                verified: !isBeneficiaryChanged && vendor.verified,
                verification_method: isBeneficiaryChanged ? 'unverified' : 'vendor_master_initial',
                created_at: new Date().toISOString(),
                is_primary: true
            };
            store_1.db.bankAccounts.set(bankAccount.id, bankAccount);
        }
        // 3. Resolve or create Requestor
        let requestor = Array.from(store_1.db.employees.values()).find(e => e.name.toLowerCase() === requestor_name.toLowerCase());
        if (!requestor) {
            const empId = `emp-cust-${Date.now().toString().slice(-4)}`;
            const isUnknown = requestor_name.toLowerCase().includes('unknown') || requestor_name.toLowerCase().includes('external');
            requestor = {
                id: empId,
                name: requestor_name,
                role: isUnknown ? 'Unregistered Requestor' : 'Procurement Lead',
                department: isUnknown ? 'Unknown' : 'Operations',
                email: `${requestor_name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@enterprise.corp`,
                authorization_level: isUnknown ? 0 : 100000
            };
            store_1.db.employees.set(requestor.id, requestor);
        }
        // 4. Resolve or create PO
        let purchaseOrderId = undefined;
        if (po_number) {
            let po = Array.from(store_1.db.purchaseOrders.values()).find(p => p.po_number.toUpperCase() === po_number.toUpperCase());
            if (!po) {
                po = {
                    id: `po-${po_number.toLowerCase()}`,
                    po_number: po_number.toUpperCase(),
                    vendor_id: vendor.id,
                    amount: Math.max(numAmount, 10000),
                    currency,
                    approved_by: 'Jonathan Miller (VP Supply Chain)',
                    approved_at: new Date().toISOString(),
                    status: 'approved',
                    description: `Authorized PO for ${vendor.name}`
                };
                store_1.db.purchaseOrders.set(po.id, po);
            }
            purchaseOrderId = po.id;
        }
        // 5. Resolve or create Invoice
        let invoiceId = undefined;
        if (invoice_number) {
            let inv = Array.from(store_1.db.invoices.values()).find(i => i.invoice_number.toUpperCase() === invoice_number.toUpperCase());
            if (inv) {
                invoiceId = inv.id;
                if (!purchaseOrderId && inv.purchase_order_id) {
                    purchaseOrderId = inv.purchase_order_id;
                }
            }
            else {
                inv = {
                    id: `inv-${invoice_number.toLowerCase()}`,
                    invoice_number: invoice_number.toUpperCase(),
                    purchase_order_id: purchaseOrderId,
                    vendor_id: vendor.id,
                    amount: numAmount,
                    currency,
                    issued_date: new Date().toISOString().split('T')[0],
                    due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                    status: 'matched',
                    line_items: [
                        { description: `${purpose || 'Commercial services'}`, quantity: 1, unit_price: numAmount, total: numAmount }
                    ]
                };
                store_1.db.invoices.set(inv.id, inv);
                invoiceId = inv.id;
            }
        }
        // If still no purchase order, check if vendor has an existing active PO in ERP covering the amount
        if (!purchaseOrderId && vendor) {
            const existingPo = Array.from(store_1.db.purchaseOrders.values()).find(p => p.vendor_id === vendor?.id && p.status === 'approved' && p.amount >= numAmount);
            if (existingPo) {
                purchaseOrderId = existingPo.id;
            }
        }
        // 6. Build Payment Entity
        const newPayment = {
            id: txId,
            tx_code: txCode,
            vendor_id: vendor.id,
            vendor_name: vendor.name,
            invoice_id: invoiceId,
            invoice_number: invoice_number || undefined,
            purchase_order_id: purchaseOrderId,
            po_number: po_number || undefined,
            beneficiary_account_id: bankAccount.id,
            destination_account_masked: beneficiary_account_masked,
            destination_bank_name: destination_bank_name || bankAccount.bank_name,
            amount: numAmount,
            currency,
            requestor_id: requestor.id,
            requestor_name: requestor.name,
            requestor_role: requestor.role,
            purpose,
            payment_method,
            scenario_type: numAmount >= 1000000 ? 'unusual_legitimate' : signals.beneficiary_change ? 'beneficiary_manipulation' : 'custom',
            scenario_title: signals.beneficiary_change
                ? 'User Transaction (Beneficiary Update)'
                : numAmount >= 1000000
                    ? 'User Transaction (High-Value Transfer)'
                    : 'User Created Transaction',
            is_unusual_amount: numAmount > 500000,
            historical_baseline_note: `User initiated disbursement request via TransferGuard Workspace.`,
            current_decision: 'ALLOW',
            lifecycle_state: 'ANALYZED',
            claims: claims.length > 0 ? claims : [`Payment requested for ${vendor.name} ($${numAmount.toLocaleString()} ${currency})`],
            signals: signals,
            is_user_created: true,
            unstructured_intake_text,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        store_1.db.createPayment(newPayment);
        // 7. Attach any initial evidence documents
        if (Array.isArray(attached_evidence)) {
            for (const ev of attached_evidence) {
                if (ev.content) {
                    const docId = `doc-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
                    const doc = {
                        id: docId,
                        payment_id: newPayment.id,
                        type: ev.type || 'invoice',
                        source: ev.source || 'user_provided',
                        title: ev.title || `${ev.type || 'Document'} Evidence`,
                        content: ev.content,
                        status: 'verified',
                        is_verified_evidence: true,
                        extracted_facts: ev.extracted_facts || {},
                        created_at: new Date().toISOString()
                    };
                    store_1.db.addEvidenceDocument(doc);
                }
            }
        }
        // 8. Add Audit Log
        store_1.db.addAuditLog(newPayment.id, {
            payment_id: newPayment.id,
            timestamp: new Date().toISOString(),
            time_offset_label: new Date().toLocaleTimeString(),
            actor: `${requestor.name} (${requestor.role})`,
            action: 'Transaction Created in Workspace',
            details: `Disbursement of $${numAmount.toLocaleString()} ${currency} to ${vendor.name} (${beneficiary_account_masked}).`,
            decision_snapshot: 'PENDING'
        });
        // 9. Initial Evaluation
        const result = evaluatePayment(newPayment);
        store_1.db.addAuditLog(newPayment.id, {
            payment_id: newPayment.id,
            timestamp: new Date(Date.now() + 500).toISOString(),
            time_offset_label: new Date(Date.now() + 500).toLocaleTimeString(),
            actor: 'Decision Engine',
            action: 'Initial Policy & Evidence Evaluation Completed',
            details: `Evaluated ${result.evidences.length} evidence items and ${result.evaluation.applied_policies.length} organizational policies. Calculated Decision: ${result.evaluation.decision}.`,
            decision_snapshot: result.evaluation.decision
        });
        result.auditLogs = store_1.db.getAuditLogs(newPayment.id);
        res.status(201).json({
            success: true,
            message: 'Transaction created and evaluated successfully.',
            data: result
        });
    }
    catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({ success: false, error: err.message || 'Failed to create transaction' });
    }
});
// GET /api/transactions/:id - Detail of a specific transaction
router.get('/:id', (req, res) => {
    const paymentId = req.params.id.toLowerCase();
    const payment = store_1.db.getPayment(paymentId);
    if (!payment) {
        res.status(404).json({ success: false, error: `Transaction '${req.params.id}' not found.` });
        return;
    }
    const result = evaluatePayment(payment);
    res.json({ success: true, data: result });
});
// POST /api/transactions/:id/analyze - AI Intent analysis on existing transaction text
router.post('/:id/analyze', async (req, res) => {
    const paymentId = req.params.id.toLowerCase();
    const payment = store_1.db.getPayment(paymentId);
    if (!payment) {
        res.status(404).json({ success: false, error: `Transaction '${req.params.id}' not found.` });
        return;
    }
    const { text } = req.body;
    const analysisText = text || payment.unstructured_intake_text || payment.purpose;
    const analysis = await ai_1.AIService.analyzeIntent(analysisText, payment);
    // Update payment signals and claims if new signals found
    payment.signals = { ...payment.signals, ...analysis.signals };
    payment.claims = Array.from(new Set([...payment.claims, ...analysis.claims]));
    payment.lifecycle_state = 'ANALYZED';
    store_1.db.updatePayment(payment);
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: new Date().toISOString(),
        time_offset_label: new Date().toLocaleTimeString(),
        actor: 'AI Intent Analysis Engine',
        action: 'Intent & Safety Signals Analyzed',
        details: `Identified action: ${analysis.action}, Urgency: ${analysis.urgency}, Signals: ${Object.keys(analysis.signals).filter(k => analysis.signals[k]).join(', ') || 'None'}.`,
        decision_snapshot: payment.current_decision
    });
    const result = evaluatePayment(payment);
    res.json({
        success: true,
        data: {
            analysis,
            evaluated: result
        }
    });
});
// POST /api/transactions/:id/evidence - Attach evidence document
router.post('/:id/evidence', async (req, res) => {
    const paymentId = req.params.id.toLowerCase();
    const payment = store_1.db.getPayment(paymentId);
    if (!payment) {
        res.status(404).json({ success: false, error: `Transaction '${req.params.id}' not found.` });
        return;
    }
    const { title, content, type = 'invoice', source = 'user_provided', mark_verified = true } = req.body;
    if (!content) {
        res.status(400).json({ success: false, error: 'Evidence content text is required.' });
        return;
    }
    // Run AI fact extraction on the document
    const extracted = await ai_1.AIService.extractEvidence(content, type);
    const docId = `doc-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const doc = {
        id: docId,
        payment_id: payment.id,
        type,
        source,
        title: title || `${type.toUpperCase()} Evidence Document`,
        content,
        status: mark_verified ? 'verified' : 'extracted',
        is_verified_evidence: Boolean(mark_verified),
        extracted_facts: extracted,
        created_at: new Date().toISOString()
    };
    store_1.db.addEvidenceDocument(doc);
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: new Date().toISOString(),
        time_offset_label: new Date().toLocaleTimeString(),
        actor: 'Evidence Engine',
        action: `Evidence Document Attached (${type.toUpperCase()})`,
        details: `Attached '${doc.title}'. Extracted facts: Vendor: ${extracted.vendor_name || 'N/A'}, Amount: $${(extracted.amount || 0).toLocaleString()}, Signatory: ${extracted.approved_by || 'N/A'}. Verified: ${doc.is_verified_evidence ? 'YES' : 'PENDING'}.`,
        decision_snapshot: 'PENDING'
    });
    const result = evaluatePayment(payment);
    res.json({
        success: true,
        message: 'Evidence document added and transaction re-evaluated.',
        data: {
            document: doc,
            evaluated: result
        }
    });
});
// PUT /api/transactions/:id/evidence/:evidenceId/verify - Confirm / verify attached evidence
router.put('/:id/evidence/:evidenceId/verify', (req, res) => {
    const { id: paymentId, evidenceId } = req.params;
    const payment = store_1.db.getPayment(paymentId);
    const doc = store_1.db.evidenceDocuments.get(evidenceId);
    if (!payment || !doc) {
        res.status(404).json({ success: false, error: 'Transaction or evidence document not found.' });
        return;
    }
    const { is_verified = true, verified_by = 'Sarah Chen' } = req.body;
    doc.is_verified_evidence = Boolean(is_verified);
    doc.status = is_verified ? 'verified' : 'rejected';
    store_1.db.updateEvidenceDocument(doc);
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: new Date().toISOString(),
        time_offset_label: new Date().toLocaleTimeString(),
        actor: verified_by,
        action: `Evidence Document Verified (${doc.title})`,
        details: `Evidence status updated to: ${doc.status.toUpperCase()}.`,
        decision_snapshot: 'PENDING'
    });
    const result = evaluatePayment(payment);
    res.json({ success: true, data: result });
});
// POST /api/transactions/:id/evaluate - Deterministic re-evaluation
router.post('/:id/evaluate', (req, res) => {
    const paymentId = req.params.id.toLowerCase();
    const payment = store_1.db.getPayment(paymentId);
    if (!payment) {
        res.status(404).json({ success: false, error: `Transaction '${req.params.id}' not found.` });
        return;
    }
    const result = evaluatePayment(payment);
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: new Date().toISOString(),
        time_offset_label: new Date().toLocaleTimeString(),
        actor: 'Decision Engine (On-Demand Evaluation)',
        action: 'Transaction Re-Evaluated',
        details: `Evaluated ${result.evidences.length} evidence items and ${result.evaluation.applied_policies.length} policies. Decision calculated: ${result.evaluation.decision}.`,
        decision_snapshot: result.evaluation.decision
    });
    result.auditLogs = store_1.db.getAuditLogs(payment.id);
    res.json({ success: true, data: result });
});
// POST /api/transactions/:id/verify - Real human verification workflow
router.post('/:id/verify', (req, res) => {
    const paymentId = req.params.id.toLowerCase();
    const payment = store_1.db.getPayment(paymentId);
    if (!payment) {
        res.status(404).json({ success: false, error: `Transaction '${req.params.id}' not found.` });
        return;
    }
    const { verification_method = 'trusted_callback', confirmed_by = 'Sarah Chen', confirmed_role = 'Treasury Operations Specialist', statement = 'I confirm the beneficiary banking coordinates are authentic.', reason = 'Out-of-band telephone confirmation completed.', notes } = req.body;
    const vendor = store_1.db.vendors.get(payment.vendor_id);
    const bankAccount = store_1.db.bankAccounts.get(payment.beneficiary_account_id);
    const prevDecision = payment.current_decision;
    // 1. Update bank account if beneficiary verification
    if (bankAccount) {
        bankAccount.verified = true;
        bankAccount.verified_at = new Date().toISOString();
        bankAccount.verified_by = `${confirmed_by} (${confirmed_role})`;
        bankAccount.verification_method = verification_method === 'trusted_callback' ? 'out_of_band_callback' : 'board_resolution';
        store_1.db.bankAccounts.set(bankAccount.id, bankAccount);
    }
    // 2. Update governance approvals if executive sign-off
    if (verification_method === 'executive_override' || verification_method === 'board_resolution') {
        payment.governance_approvals = {
            ...payment.governance_approvals,
            cfo_authorization: true,
            board_approval: true,
            acquisition_agreement_verified: true
        };
    }
    // 3. Record Verification History
    const verificationRecord = {
        id: `ver-${Date.now().toString().slice(-6)}`,
        payment_id: payment.id,
        verification_method,
        method_label: verification_method === 'trusted_callback'
            ? 'Out-of-Band Callback to Trusted Contact'
            : verification_method === 'executive_override'
                ? 'Executive / CFO Authorization Override'
                : 'Authoritative Corporate Record Match',
        confirmed_by,
        confirmed_role,
        statement,
        reason,
        notes,
        contact_used: vendor?.trusted_contact_phone || vendor?.trusted_contact_name,
        previous_decision: prevDecision,
        new_decision: 'ALLOW',
        verified_at: new Date().toISOString()
    };
    store_1.db.addVerification(verificationRecord);
    // 4. Audit Log Step 1: Verification performed
    const now = new Date();
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: now.toISOString(),
        time_offset_label: now.toLocaleTimeString(),
        actor: `${confirmed_by} (${confirmed_role})`,
        action: 'Trusted Verification Recorded in TransferGuard',
        details: `${verificationRecord.method_label}. Statement: "${statement}". Contact: ${vendor?.trusted_contact_name || 'Vendor Primary'} (${vendor?.trusted_contact_phone || '+1 555-014-9922'}). ${notes ? `Notes: ${notes}` : ''}`,
        decision_snapshot: 'PENDING'
    });
    // 5. Re-evaluate automatically
    const evaluated = evaluatePayment(payment);
    verificationRecord.new_decision = evaluated.evaluation.decision;
    // 6. Audit Log Step 2: Decision transition
    store_1.db.addAuditLog(payment.id, {
        payment_id: payment.id,
        timestamp: new Date(Date.now() + 500).toISOString(),
        time_offset_label: new Date(Date.now() + 500).toLocaleTimeString(),
        actor: 'Decision Engine',
        action: 'Transaction Re-evaluated Post-Verification',
        details: `All supporting evidence and beneficiary credentials now confirmed. Decision transitioned: ${prevDecision} → ${evaluated.evaluation.decision}.`,
        decision_snapshot: evaluated.evaluation.decision
    });
    evaluated.auditLogs = store_1.db.getAuditLogs(payment.id);
    evaluated.verifications = store_1.db.getVerifications(payment.id);
    res.json({
        success: true,
        message: 'Verification recorded in TransferGuard. Transaction re-evaluated successfully.',
        data: evaluated
    });
});
// GET /api/transactions/:id/audit - Audit trail for specific transaction
router.get('/:id/audit', (req, res) => {
    const paymentId = req.params.id.toLowerCase();
    const logs = store_1.db.getAuditLogs(paymentId);
    res.json({ success: true, count: logs.length, data: logs });
});
// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', (req, res) => {
    const paymentId = req.params.id.toLowerCase();
    const deleted = store_1.db.deletePayment(paymentId);
    if (!deleted) {
        res.status(404).json({ success: false, error: `Transaction '${req.params.id}' not found.` });
        return;
    }
    res.json({ success: true, message: `Transaction '${req.params.id}' deleted.` });
});
// POST /api/transactions/reset - Restore baseline state
router.post('/reset', (req, res) => {
    store_1.db.seed();
    store_1.db.saveToDisk();
    res.json({
        success: true,
        message: 'TransferGuard environment reset to default baseline state.'
    });
});
exports.default = router;
