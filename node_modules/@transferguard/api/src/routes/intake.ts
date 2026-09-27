import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { AIService } from '../services/ai';
import { evaluatePayment } from './transactions';
import { Payment } from '@transferguard/types';

const router = Router();

// POST /api/intake/extract - Extract structured context from unstructured text
router.post('/extract', async (req: Request, res: Response): Promise<void> => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    res.status(400).json({ success: false, error: 'Text prompt is required.' });
    return;
  }

  const extraction = await AIService.analyzeIntent(text);

  res.json({
    success: true,
    data: {
      vendor_name: extraction.vendor,
      amount: extraction.amount,
      currency: extraction.currency,
      invoice_number: extraction.invoice,
      po_number: extraction.po_number,
      requestor_name: 'Sarah Chen',
      purpose: extraction.purpose,
      requested_action: extraction.action,
      beneficiary_account_masked: extraction.beneficiary_account || (extraction.signals.beneficiary_change ? '****9174' : '****3188'),
      bank_name: extraction.bank_name || 'First National Bank',
      urgency: extraction.urgency,
      confidence_notes: extraction.confidence_notes,
      suggested_scenario_type: extraction.suggested_scenario_type,
      claims: extraction.claims,
      signals: extraction.signals
    }
  });
});

// POST /api/intake/convert - Convert extracted intake into a live evaluated transaction
router.post('/convert', async (req: Request, res: Response): Promise<void> => {
  const { extraction, raw_text } = req.body;

  if (!extraction) {
    res.status(400).json({ success: false, error: 'Extraction data required.' });
    return;
  }

  // Find or create vendor
  let vendor = Array.from(db.vendors.values()).find(
    v => v.name.toLowerCase() === (extraction.vendor_name || '').toLowerCase()
  );
  if (!vendor) {
    const vendorId = `vnd-${Date.now().toString().slice(-4)}`;
    vendor = {
      id: vendorId,
      name: extraction.vendor_name || 'External Vendor',
      status: 'active',
      verified: !extraction.vendor_name?.toLowerCase().includes('unregistered'),
      tax_id: 'US-90182914',
      category: 'Commercial Vendor',
      established_since: '2023-01-01',
      trusted_contact_name: `${extraction.vendor_name || 'Vendor'} Accounts`,
      trusted_contact_phone: '+1 (555) 019-2831',
      trusted_contact_email: 'ar@vendor.corp'
    };
    db.vendors.set(vendor.id, vendor);
  }

  // Bank account
  const isChanged = extraction.signals?.beneficiary_change || extraction.requested_action?.includes('beneficiary');
  const acctMasked = extraction.beneficiary_account_masked || (isChanged ? '****9174' : '****3188');
  let bankAccount = Array.from(db.bankAccounts.values()).find(
    b => b.vendor_id === vendor?.id && b.account_number_masked === acctMasked
  );
  if (!bankAccount) {
    const bnkId = `bnk-${Date.now().toString().slice(-4)}`;
    bankAccount = {
      id: bnkId,
      vendor_id: vendor.id,
      bank_name: extraction.bank_name || (isChanged ? 'First National Bank' : 'Commercial Depository'),
      account_number_masked: acctMasked,
      routing_number: '021000021',
      account_type: 'operating',
      verified: !isChanged && vendor.verified,
      verification_method: isChanged ? 'unverified' : 'vendor_master_initial',
      created_at: new Date().toISOString(),
      is_primary: true
    };
    db.bankAccounts.set(bankAccount.id, bankAccount);
  }

  const customId = `tx-ai-${Date.now().toString().slice(-4)}`;
  const txCode = `TX-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPayment: Payment = {
    id: customId,
    tx_code: txCode,
    vendor_id: vendor.id,
    vendor_name: vendor.name,
    invoice_number: extraction.invoice_number || (extraction.amount === 480000 ? 'INV-8841' : undefined),
    po_number: extraction.po_number || (extraction.amount === 480000 ? 'PO-7281' : undefined),
    beneficiary_account_id: bankAccount.id,
    destination_account_masked: bankAccount.account_number_masked,
    destination_bank_name: bankAccount.bank_name,
    amount: extraction.amount || 480000,
    currency: extraction.currency || 'USD',
    requestor_id: 'emp-sarah-chen',
    requestor_name: extraction.requestor_name || 'Sarah Chen',
    requestor_role: 'Senior Procurement Specialist',
    purpose: extraction.purpose || raw_text || 'Payment instruction from AI Intake',
    payment_method: 'wire',
    scenario_type: extraction.suggested_scenario_type || 'custom',
    scenario_title: `AI Ingested: ${vendor.name} ($${(extraction.amount || 0).toLocaleString()} USD)`,
    is_unusual_amount: (extraction.amount || 0) >= 1000000,
    historical_baseline_note: `Created from natural language AI extraction.`,
    unstructured_intake_text: raw_text,
    current_decision: 'ALLOW',
    lifecycle_state: 'ANALYZED',
    claims: extraction.claims || [`Instruction extracted by AI for ${vendor.name}`],
    signals: extraction.signals || {},
    is_user_created: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.createPayment(newPayment);

  // Add intake audit log
  db.addAuditLog(newPayment.id, {
    payment_id: newPayment.id,
    timestamp: new Date().toISOString(),
    time_offset_label: new Date().toLocaleTimeString(),
    actor: 'TransferGuard AI Intake Service',
    action: 'Payment Request Ingested from Natural Language Directive',
    details: `Extracted Counterparty: ${extraction.vendor_name} | Amount: $${(extraction.amount || 0).toLocaleString()} USD | Action: ${extraction.requested_action}`,
    decision_snapshot: 'PENDING'
  });

  const evaluated = evaluatePayment(newPayment);

  db.addAuditLog(newPayment.id, {
    payment_id: newPayment.id,
    timestamp: new Date(Date.now() + 500).toISOString(),
    time_offset_label: new Date(Date.now() + 500).toLocaleTimeString(),
    actor: 'Decision Engine',
    action: 'Evaluation Completed',
    details: `Evaluated against active organizational policies. Decision: ${evaluated.evaluation.decision}.`,
    decision_snapshot: evaluated.evaluation.decision
  });

  evaluated.auditLogs = db.getAuditLogs(newPayment.id);

  res.json({
    success: true,
    message: 'Payment extracted and evaluated successfully.',
    data: evaluated
  });
});

export default router;
