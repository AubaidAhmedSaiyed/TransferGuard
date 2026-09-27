import fs from 'fs';
import path from 'path';
import {
  Employee,
  Vendor,
  BankAccount,
  PurchaseOrder,
  Invoice,
  Payment,
  AuditLogEntry,
  VerificationRecord,
  EvidenceDocument,
  PolicyRule,
  DashboardMetrics
} from '@transferguard/types';

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

export class Store {
  public employees: Map<string, Employee> = new Map();
  public vendors: Map<string, Vendor> = new Map();
  public bankAccounts: Map<string, BankAccount> = new Map();
  public purchaseOrders: Map<string, PurchaseOrder> = new Map();
  public invoices: Map<string, Invoice> = new Map();
  public payments: Map<string, Payment> = new Map();
  public evidenceDocuments: Map<string, EvidenceDocument> = new Map();
  public policies: Map<string, PolicyRule> = new Map();
  public auditLogs: Map<string, AuditLogEntry[]> = new Map();
  public verifications: Map<string, VerificationRecord[]> = new Map();

  constructor() {
    this.init();
  }

  private init(): void {
    if (fs.existsSync(DB_FILE)) {
      try {
        const loaded = this.loadFromDisk();
        if (loaded) {
          console.log(`[Store] Loaded persistent state from ${DB_FILE}`);
          return;
        }
      } catch (e) {
        console.warn(`[Store] Failed to load from disk, seeding defaults.`, e);
      }
    }
    this.seed();
    this.saveToDisk();
  }

  public seed(): void {
    this.employees.clear();
    this.vendors.clear();
    this.bankAccounts.clear();
    this.purchaseOrders.clear();
    this.invoices.clear();
    this.payments.clear();
    this.evidenceDocuments.clear();
    this.policies.clear();
    this.auditLogs.clear();
    this.verifications.clear();

    // 1. EMPLOYEES
    const employeesData: Employee[] = [
      {
        id: 'emp-sarah-chen',
        name: 'Sarah Chen',
        role: 'Senior Procurement Specialist',
        department: 'Operations & Procurement',
        email: 'sarah.chen@enterprise.corp',
        authorization_level: 50000
      },
      {
        id: 'emp-jonathan-miller',
        name: 'Jonathan Miller',
        role: 'VP Supply Chain',
        department: 'Operations',
        email: 'j.miller@enterprise.corp',
        authorization_level: 500000
      },
      {
        id: 'emp-marcus-vance',
        name: 'Marcus Vance',
        role: 'Chief Financial Officer (CFO)',
        department: 'Executive Treasury',
        email: 'marcus.vance@enterprise.corp',
        authorization_level: 25000000
      },
      {
        id: 'emp-david-ross',
        name: 'David Ross',
        role: 'IT Infrastructure Director',
        department: 'Information Technology',
        email: 'd.ross@enterprise.corp',
        authorization_level: 100000
      },
      {
        id: 'emp-elena-garcia',
        name: 'Elena Garcia',
        role: 'General Counsel',
        department: 'Legal & Compliance',
        email: 'elena.garcia@enterprise.corp',
        authorization_level: 500000
      },
      {
        id: 'emp-unknown',
        name: 'Unknown / External Actor',
        role: 'Unregistered Requestor',
        department: 'Unknown',
        email: 'external-temp@relay-node.net',
        authorization_level: 0
      }
    ];
    employeesData.forEach(e => this.employees.set(e.id, e));

    // 2. VENDORS
    const vendorsData: Vendor[] = [
      {
        id: 'vnd-northstar',
        name: 'Northstar Industrial Supplies',
        status: 'active',
        verified: true,
        tax_id: 'US-90182914',
        category: 'Industrial Consumables & Equipment',
        established_since: '2019-04-12',
        trusted_contact_name: 'Dave Miller (Accounts Receivable)',
        trusted_contact_phone: '+1 (555) 019-2831',
        trusted_contact_email: 'dave.miller@northstar-supplies.com'
      },
      {
        id: 'vnd-acme',
        name: 'Acme Supplies',
        status: 'active',
        verified: true,
        tax_id: 'US-48192038',
        category: 'Enterprise Logistics & Hardware',
        established_since: '2021-08-15',
        trusted_contact_name: 'Elena Rostova (VP Finance)',
        trusted_contact_phone: '+1 (555) 014-9922',
        trusted_contact_email: 'e.rostova@acme-supplies-global.com'
      },
      {
        id: 'vnd-newco',
        name: 'NewCo Holdings LLC',
        status: 'active',
        verified: true,
        tax_id: 'DE-88392019',
        category: 'Strategic Asset & Holding Entity',
        established_since: '2016-11-04',
        trusted_contact_name: 'Dr. Klaus Richter (Managing Director)',
        trusted_contact_phone: '+49 (30) 555-9012',
        trusted_contact_email: 'klaus.richter@newco-holdings.de'
      },
      {
        id: 'vnd-amazon-web',
        name: 'Amazon Web Services Inc.',
        status: 'active',
        verified: true,
        tax_id: 'US-91192837',
        category: 'Cloud Infrastructure & Hosting',
        established_since: '2018-01-10',
        trusted_contact_name: 'AWS Enterprise Billing Team',
        trusted_contact_phone: '+1 (800) 555-0199',
        trusted_contact_email: 'aws-billing@amazon.com'
      },
      {
        id: 'vnd-wilson-sonsini',
        name: 'Wilson Sonsini Goodrich & Rosati',
        status: 'active',
        verified: true,
        tax_id: 'US-94182741',
        category: 'Legal Counsel & Regulatory Advisory',
        established_since: '2020-03-22',
        trusted_contact_name: 'Robert Hastings (Partner)',
        trusted_contact_phone: '+1 (650) 555-0144',
        trusted_contact_email: 'rhastings@wsgr.law'
      },
      {
        id: 'vnd-test-supplier',
        name: 'Test Supplier',
        status: 'active',
        verified: true,
        tax_id: 'US-77182900',
        category: 'General Equipment & Test Supplies',
        established_since: '2022-01-15',
        trusted_contact_name: 'Mark Vance (Customer Operations)',
        trusted_contact_phone: '+1 (555) 012-3344',
        trusted_contact_email: 'support@testsupplier.corp'
      },
      {
        id: 'vnd-unknown',
        name: 'Apex Global Holdings / Unverified',
        status: 'unknown',
        verified: false,
        tax_id: 'UNKNOWN-0000',
        category: 'Unclassified External Entity',
        established_since: 'N/A',
        trusted_contact_name: 'N/A (Unverified)',
        trusted_contact_phone: 'N/A',
        trusted_contact_email: 'contact@apex-global-trust.org'
      }
    ];
    vendorsData.forEach(v => this.vendors.set(v.id, v));

    // 3. BANK ACCOUNTS
    const bankAccountsData: BankAccount[] = [
      {
        id: 'bnk-northstar-primary',
        vendor_id: 'vnd-northstar',
        bank_name: 'JPMorgan Chase Commercial Bank',
        account_number_masked: '****3188',
        routing_number: '021000021',
        account_type: 'operating',
        verified: true,
        verified_at: '2019-04-15T09:00:00Z',
        verified_by: 'Treasury Operations (Vendor Master)',
        verification_method: 'vendor_master_initial',
        created_at: '2019-04-12T00:00:00Z',
        is_primary: true
      },
      {
        id: 'bnk-acme-original',
        vendor_id: 'vnd-acme',
        bank_name: 'Wells Fargo Commercial Banking',
        account_number_masked: '****4421',
        routing_number: '121000247',
        account_type: 'operating',
        verified: true,
        verified_at: '2021-08-20T10:30:00Z',
        verified_by: 'Treasury Master File',
        verification_method: 'vendor_master_initial',
        created_at: '2021-08-15T00:00:00Z',
        is_primary: false
      },
      {
        id: 'bnk-acme-new',
        vendor_id: 'vnd-acme',
        bank_name: 'First National Bank',
        account_number_masked: '****9174',
        routing_number: '071000013',
        account_type: 'checking',
        verified: false,
        verification_method: 'unverified',
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        is_primary: true
      },
      {
        id: 'bnk-newco-escrow',
        vendor_id: 'vnd-newco',
        bank_name: 'Citibank Global Escrow Agency',
        account_number_masked: '****5501',
        routing_number: '021000089',
        account_type: 'escrow',
        verified: true,
        verified_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        verified_by: 'Marcus Vance (CFO) & Docusign Escrow Custody Agreement',
        verification_method: 'board_resolution',
        created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        is_primary: true
      },
      {
        id: 'bnk-aws-primary',
        vendor_id: 'vnd-amazon-web',
        bank_name: 'Bank of America Corporate',
        account_number_masked: '****7721',
        routing_number: '026009593',
        account_type: 'operating',
        verified: true,
        verified_at: '2018-01-15T00:00:00Z',
        verification_method: 'vendor_master_initial',
        created_at: '2018-01-10T00:00:00Z',
        is_primary: true
      },
      {
        id: 'bnk-wsgr-primary',
        vendor_id: 'vnd-wilson-sonsini',
        bank_name: 'Silicon Valley Bank / First Citizens',
        account_number_masked: '****8812',
        routing_number: '121140399',
        account_type: 'operating',
        verified: true,
        verified_at: '2020-03-25T00:00:00Z',
        verification_method: 'vendor_master_initial',
        created_at: '2020-03-22T00:00:00Z',
        is_primary: true
      },
      {
        id: 'bnk-test-supplier-primary',
        vendor_id: 'vnd-test-supplier',
        bank_name: 'PNC Bank Commercial',
        account_number_masked: '****1288',
        routing_number: '043000096',
        account_type: 'operating',
        verified: true,
        verified_at: '2022-01-20T00:00:00Z',
        verification_method: 'vendor_master_initial',
        created_at: '2022-01-15T00:00:00Z',
        is_primary: true
      },
      {
        id: 'bnk-apex-fraud',
        vendor_id: 'vnd-unknown',
        bank_name: 'Offshore Cayman Depository Trust',
        account_number_masked: '****0099',
        routing_number: '099900011',
        account_type: 'checking',
        verified: false,
        verification_method: 'unverified',
        created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        is_primary: false
      }
    ];
    bankAccountsData.forEach(b => this.bankAccounts.set(b.id, b));

    // 4. PURCHASE ORDERS
    const poData: PurchaseOrder[] = [
      {
        id: 'po-8842',
        po_number: 'PO-8842',
        vendor_id: 'vnd-northstar',
        amount: 12400,
        currency: 'USD',
        approved_by: 'Michael Scott (VP Operations)',
        approved_at: '2026-09-15T14:20:00Z',
        status: 'approved',
        description: 'Q3 plant manufacturing consumables, safety equipment & assembly supplies.'
      },
      {
        id: 'po-7281',
        po_number: 'PO-7281',
        vendor_id: 'vnd-acme',
        amount: 500000,
        currency: 'USD',
        approved_by: 'Jonathan Miller (VP Supply Chain)',
        approved_at: '2026-09-18T11:00:00Z',
        status: 'approved',
        description: 'Automated warehouse staging hardware and multi-zone distribution tooling.'
      },
      {
        id: 'po-9102',
        po_number: 'PO-9102',
        vendor_id: 'vnd-amazon-web',
        amount: 50000,
        currency: 'USD',
        approved_by: 'David Ross (IT Director)',
        approved_at: '2026-09-01T08:00:00Z',
        status: 'approved',
        description: 'September Dedicated Cloud Cluster & GPU Compute Capacity.'
      },
      {
        id: 'po-9188',
        po_number: 'PO-9188',
        vendor_id: 'vnd-wilson-sonsini',
        amount: 100000,
        currency: 'USD',
        approved_by: 'Elena Garcia (General Counsel)',
        approved_at: '2026-09-10T16:00:00Z',
        status: 'approved',
        description: 'Q3 M&A Advisory, Antitrust Filing, and Corporate Structuring Retainer.'
      }
    ];
    poData.forEach(p => this.purchaseOrders.set(p.id, p));

    // 5. INVOICES
    const invoiceData: Invoice[] = [
      {
        id: 'inv-1042',
        invoice_number: 'INV-1042',
        purchase_order_id: 'po-8842',
        vendor_id: 'vnd-northstar',
        amount: 12400,
        currency: 'USD',
        issued_date: '2026-09-18',
        due_date: '2026-10-18',
        status: 'matched',
        line_items: [
          { description: 'Precision Cutting Blades (Pack of 50)', quantity: 20, unit_price: 220, total: 4400 },
          { description: 'Industrial Protective Gear Set (Grade 4)', quantity: 80, unit_price: 100, total: 8000 }
        ]
      },
      {
        id: 'inv-8841',
        invoice_number: 'INV-8841',
        purchase_order_id: 'po-7281',
        vendor_id: 'vnd-acme',
        amount: 480000,
        currency: 'USD',
        issued_date: '2026-09-22',
        due_date: '2026-09-29',
        status: 'matched',
        line_items: [
          { description: 'Automated Conveyor Staging Module B-7', quantity: 2, unit_price: 180000, total: 360000 },
          { description: 'Optical Sorting Diagnostic Sensors & Hub', quantity: 4, unit_price: 30000, total: 120000 }
        ]
      },
      {
        id: 'inv-aws-0926',
        invoice_number: 'INV-AWS-99201',
        purchase_order_id: 'po-9102',
        vendor_id: 'vnd-amazon-web',
        amount: 42500,
        currency: 'USD',
        issued_date: '2026-09-02',
        due_date: '2026-10-02',
        status: 'matched',
        line_items: [
          { description: 'AWS EC2 + Bedrock Enterprise Reservation', quantity: 1, unit_price: 42500, total: 42500 }
        ]
      },
      {
        id: 'inv-wsgr-402',
        invoice_number: 'INV-WSGR-4029',
        purchase_order_id: 'po-9188',
        vendor_id: 'vnd-wilson-sonsini',
        amount: 85000,
        currency: 'USD',
        issued_date: '2026-09-12',
        due_date: '2026-09-26',
        status: 'matched',
        line_items: [
          { description: 'Project Horizon Definitive Agreement Legal Review', quantity: 1, unit_price: 85000, total: 85000 }
        ]
      }
    ];
    invoiceData.forEach(i => this.invoices.set(i.id, i));

    // 6. DEFAULT POLICIES
    const policiesData: PolicyRule[] = [
      {
        id: 'pol-high-value',
        name: 'High-Value Transfer Governance',
        description: 'Transactions exceeding $100,000 USD require confirmed CFO / VP Treasury sign-off.',
        condition_type: 'amount_threshold',
        threshold_amount: 100000,
        required_role: 'CFO',
        action: 'VERIFY',
        reason: 'Large disbursements require executive dual sign-off per corporate DOA.',
        enabled: true,
        created_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'pol-beneficiary-change',
        name: 'Beneficiary Modification Control',
        description: 'Any new or unverified bank account requires independent out-of-band telephone callback verification.',
        condition_type: 'beneficiary_change',
        action: 'VERIFY',
        reason: 'Payment destination change must be confirmed out-of-band via established trusted contacts.',
        enabled: true,
        created_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'pol-new-vendor',
        name: 'New Vendor Onboarding & KYC Check',
        description: 'Transfers to unverified or new vendors require vendor master onboarding compliance.',
        condition_type: 'new_vendor',
        action: 'BLOCK',
        reason: 'Unregistered entities cannot receive disbursements without compliance onboarding.',
        enabled: true,
        created_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'pol-unauthorized-requestor',
        name: 'Requestor Authority Enforcement',
        description: 'Transfers initiated by unknown actors or exceeding delegation limit without sign-off are blocked.',
        condition_type: 'unauthorized_requestor',
        action: 'BLOCK',
        reason: 'Requestor must possess verified signing authority.',
        enabled: true,
        created_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'pol-bypass-attempt',
        name: 'Policy Bypass Directive Block',
        description: 'Any natural language instruction attempting to skip normal approvals or override controls is blocked.',
        condition_type: 'bypass_attempt',
        action: 'BLOCK',
        reason: 'Explicit requests to bypass internal controls constitute an immediate safety violation.',
        enabled: true,
        created_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'pol-po-mandate',
        name: 'Mandatory Purchase Order (> $10k)',
        description: 'Commercial supplier disbursements above $10,000 USD require an approved Purchase Order.',
        condition_type: 'missing_po',
        threshold_amount: 10000,
        action: 'BLOCK',
        reason: 'Procurement policy requires approved PO commitment before fund release.',
        enabled: true,
        created_at: '2026-01-01T00:00:00Z'
      }
    ];
    policiesData.forEach(p => this.policies.set(p.id, p));

    // 7. PAYMENTS (Deterministic Demo Scenarios)
    const paymentsData: Payment[] = [
      // SCENARIO 1: Normal Payment -> ALLOW
      {
        id: 'tx-1001',
        tx_code: 'TX-1001',
        vendor_id: 'vnd-northstar',
        vendor_name: 'Northstar Industrial Supplies',
        invoice_id: 'inv-1042',
        invoice_number: 'INV-1042',
        purchase_order_id: 'po-8842',
        po_number: 'PO-8842',
        beneficiary_account_id: 'bnk-northstar-primary',
        destination_account_masked: '****3188',
        destination_bank_name: 'JPMorgan Chase Commercial Bank',
        amount: 12400,
        currency: 'USD',
        requestor_id: 'emp-sarah-chen',
        requestor_name: 'Sarah Chen',
        requestor_role: 'Senior Procurement Specialist',
        purpose: 'Settlement of invoice INV-1042 for Q3 manufacturing consumables',
        payment_method: 'ach',
        scenario_type: 'normal',
        scenario_title: 'Normal Recurring Vendor Settlement',
        is_unusual_amount: false,
        historical_baseline_note: '34 recurring monthly payments to this vendor over 3 years. Average monthly spend: $11,800 USD.',
        current_decision: 'ALLOW',
        lifecycle_state: 'APPROVED',
        claims: ['Invoice INV-1042 verified', 'PO-8842 approved', 'Primary bank account ****3188 active'],
        signals: {},
        is_user_created: false,
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },

      // SCENARIO 2: Beneficiary Manipulation -> VERIFY
      {
        id: 'tx-1002',
        tx_code: 'TX-1002',
        vendor_id: 'vnd-acme',
        vendor_name: 'Acme Supplies',
        invoice_id: 'inv-8841',
        invoice_number: 'INV-8841',
        purchase_order_id: 'po-7281',
        po_number: 'PO-7281',
        beneficiary_account_id: 'bnk-acme-new',
        destination_account_masked: '****9174',
        destination_bank_name: 'First National Bank',
        amount: 480000,
        currency: 'USD',
        requestor_id: 'emp-sarah-chen',
        requestor_name: 'Sarah Chen',
        requestor_role: 'Senior Procurement Specialist',
        purpose: 'Payment for INV-8841 warehouse staging automation modules',
        payment_method: 'wire',
        scenario_type: 'beneficiary_manipulation',
        scenario_title: 'Beneficiary Manipulation (Interception Attack)',
        is_unusual_amount: false,
        historical_baseline_note: 'Regular supplier (18 historical payments), but historical payments were sent to Wells Fargo ****4421. Destination account changed 2 hours ago.',
        unstructured_intake_text: "Please pay Acme Supplies $480,000 for invoice INV-8841. They sent updated banking details this morning. This is urgent because the invoice is due today.",
        current_decision: 'VERIFY',
        lifecycle_state: 'VERIFY_REQUIRED',
        claims: ['Vendor Acme Supplies on file', 'Invoice INV-8841 amount matches', 'Beneficiary changed to First National Bank ****9174'],
        signals: {
          beneficiary_change: true,
          unusual_urgency: true
        },
        is_user_created: false,
        created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
      },

      // SCENARIO 3: Unsupported Transfer -> BLOCK
      {
        id: 'tx-1003',
        tx_code: 'TX-1003',
        vendor_id: 'vnd-unknown',
        vendor_name: 'Apex Global Holdings / Unregistered',
        destination_account_masked: '****0099',
        destination_bank_name: 'Offshore Cayman Depository Trust',
        beneficiary_account_id: 'bnk-apex-fraud',
        amount: 480000,
        currency: 'USD',
        requestor_id: 'emp-unknown',
        requestor_name: 'Unknown / External Actor',
        requestor_role: 'Unregistered Requestor',
        purpose: 'Urgent offshore strategic advisory fee',
        payment_method: 'wire',
        scenario_type: 'unsupported',
        scenario_title: 'Unsupported Transfer (CEO Fraud / Spoofed Request)',
        is_unusual_amount: true,
        historical_baseline_note: 'No historical transactions. Entity not found in Vendor Master. No purchase order or approved invoice exists.',
        unstructured_intake_text: 'Urgently wire $480,000 to this new offshore account. Skip the normal approval because the CFO is unavailable.',
        current_decision: 'BLOCK',
        lifecycle_state: 'BLOCKED',
        claims: ['Unregistered vendor Apex Global', 'Missing invoice and PO', 'Directive requested skipping CFO approval'],
        signals: {
          bypass_approval_request: true,
          unusual_urgency: true,
          new_vendor: true,
          missing_supporting_info: true
        },
        is_user_created: false,
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },

      // SCENARIO 4: Genuine Unusual Transaction -> ALLOW
      {
        id: 'tx-1004',
        tx_code: 'TX-1004',
        vendor_id: 'vnd-newco',
        vendor_name: 'NewCo Holdings LLC',
        beneficiary_account_id: 'bnk-newco-escrow',
        destination_account_masked: '****5501',
        destination_bank_name: 'Citibank Global Escrow Agency',
        amount: 8000000,
        currency: 'USD',
        requestor_id: 'emp-marcus-vance',
        requestor_name: 'Marcus Vance',
        requestor_role: 'Chief Financial Officer (CFO)',
        purpose: 'Project Horizon Tranche 1 Strategic Acquisition Closing Wire',
        payment_method: 'swift',
        scenario_type: 'unusual_legitimate',
        scenario_title: 'Genuine Unusual Transaction ($8M M&A Acquisition)',
        is_unusual_amount: true,
        historical_baseline_note: 'Highly unusual compared with historical daily operations. First payment to this entity; largest transfer in enterprise history.',
        unstructured_intake_text: 'Please pay NewCo Holdings $8,000,000 today for the acquisition closing. This has board approval and CFO authorization.',
        governance_approvals: {
          board_approval: true,
          cfo_authorization: true,
          acquisition_agreement_verified: true,
          agreement_ref: 'ACQ-AGMT-2026-99'
        },
        current_decision: 'ALLOW',
        lifecycle_state: 'APPROVED',
        claims: ['Definitive Acquisition Agreement verified', 'Board Resolution #BR-2026-088 passed', 'CFO authorized', 'Escrow account ****5501 verified'],
        signals: {
          unusual_payment_purpose: true,
          requestor_claiming_authority: true
        },
        is_user_created: false,
        created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      },

      {
        id: 'tx-1005',
        tx_code: 'TX-1005',
        vendor_id: 'vnd-amazon-web',
        vendor_name: 'Amazon Web Services Inc.',
        invoice_id: 'inv-aws-0926',
        invoice_number: 'INV-AWS-99201',
        purchase_order_id: 'po-9102',
        po_number: 'PO-9102',
        beneficiary_account_id: 'bnk-aws-primary',
        destination_account_masked: '****7721',
        destination_bank_name: 'Bank of America Corporate',
        amount: 42500,
        currency: 'USD',
        requestor_id: 'emp-david-ross',
        requestor_name: 'David Ross',
        requestor_role: 'IT Infrastructure Director',
        purpose: 'Monthly AWS Cloud Infrastructure & GPU cluster billing',
        payment_method: 'ach',
        scenario_type: 'normal',
        scenario_title: 'Regular Cloud Infrastructure Billing',
        is_unusual_amount: false,
        historical_baseline_note: 'Standard recurring monthly vendor with automated reconciliation.',
        current_decision: 'ALLOW',
        lifecycle_state: 'APPROVED',
        claims: ['AWS Invoice matched', 'IT PO-9102 approved', 'Corporate account ****7721 verified'],
        signals: {},
        is_user_created: false,
        created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
      },
      {
        id: 'tx-1006',
        tx_code: 'TX-1006',
        vendor_id: 'vnd-wilson-sonsini',
        vendor_name: 'Wilson Sonsini Goodrich & Rosati',
        invoice_id: 'inv-wsgr-402',
        invoice_number: 'INV-WSGR-4029',
        purchase_order_id: 'po-9188',
        po_number: 'PO-9188',
        beneficiary_account_id: 'bnk-wsgr-primary',
        destination_account_masked: '****8812',
        destination_bank_name: 'Silicon Valley Bank / First Citizens',
        amount: 85000,
        currency: 'USD',
        requestor_id: 'emp-elena-garcia',
        requestor_name: 'Elena Garcia',
        requestor_role: 'General Counsel',
        purpose: 'Legal advisory retainer for Project Horizon regulatory filings',
        payment_method: 'wire',
        scenario_type: 'normal',
        scenario_title: 'Legal Counsel Retainer Settlement',
        is_unusual_amount: false,
        historical_baseline_note: 'Quarterly legal retainer matching verified engagement letter.',
        current_decision: 'ALLOW',
        lifecycle_state: 'APPROVED',
        claims: ['Legal invoice INV-WSGR-4029 verified', 'Retainer PO-9188 approved', 'Verified depository account ****8812'],
        signals: {},
        is_user_created: false,
        created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
      }
    ];

    paymentsData.forEach(p => this.payments.set(p.id, p));

    // 8. INITIAL AUDIT LOGS
    this.auditLogs.set('tx-1001', [
      {
        id: 'log-1001-1',
        payment_id: 'tx-1001',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        time_offset_label: '10:41:00',
        actor: 'ERP Integration (SAP S/4HANA)',
        action: 'Payment Request Ingested',
        details: 'Amount: $12,400 USD | Vendor: Northstar Industrial Supplies | Requestor: Sarah Chen',
        decision_snapshot: 'PENDING'
      },
      {
        id: 'log-1001-2',
        payment_id: 'tx-1001',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000 + 1000).toISOString(),
        time_offset_label: '10:41:01',
        actor: 'Evidence Engine',
        action: 'Supporting Evidence Reconciled',
        details: 'Matched Invoice INV-1042 ($12,400), PO-8842, and verified primary beneficiary account ****3188.',
        decision_snapshot: 'PENDING'
      },
      {
        id: 'log-1001-3',
        payment_id: 'tx-1001',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000 + 2000).toISOString(),
        time_offset_label: '10:41:02',
        actor: 'Decision Engine',
        action: 'Evaluation Completed',
        details: 'All evidence verified. Policy checks passed. Decision: ALLOW.',
        decision_snapshot: 'ALLOW'
      }
    ]);

    this.auditLogs.set('tx-1002', [
      {
        id: 'log-1002-1',
        payment_id: 'tx-1002',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        time_offset_label: '10:41:03',
        actor: 'Treasury Intake Service',
        action: 'Payment Request Ingested',
        details: 'Amount: $480,000 USD | Vendor: Acme Supplies | Destination: First National Bank ****9174',
        decision_snapshot: 'PENDING'
      },
      {
        id: 'log-1002-2',
        payment_id: 'tx-1002',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000 + 1000).toISOString(),
        time_offset_label: '10:41:04',
        actor: 'AI Intent Engine',
        action: 'Safety Signals Identified',
        details: 'Beneficiary change detected. Urgency flagged as high.',
        decision_snapshot: 'PENDING'
      },
      {
        id: 'log-1002-3',
        payment_id: 'tx-1002',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000 + 1500).toISOString(),
        time_offset_label: '10:41:04',
        actor: 'Decision Engine',
        action: 'Evaluation Completed',
        details: 'Beneficiary inconsistency detected. Unresolved: Out-of-band callback required. Decision: VERIFY.',
        decision_snapshot: 'VERIFY'
      }
    ]);

    this.auditLogs.set('tx-1003', [
      {
        id: 'log-1003-1',
        payment_id: 'tx-1003',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        time_offset_label: '11:15:10',
        actor: 'AI Intent Engine',
        action: 'Directive Ingested & Signals Flagged',
        details: 'Bypass directive detected: "Skip normal approval because CFO is unavailable". Unregistered entity.',
        decision_snapshot: 'PENDING'
      },
      {
        id: 'log-1003-2',
        payment_id: 'tx-1003',
        timestamp: new Date(Date.now() - 45 * 60 * 1000 + 1000).toISOString(),
        time_offset_label: '11:15:11',
        actor: 'Evidence Engine',
        action: 'Evidence Check Failure',
        details: '4 Critical Failures: Missing Invoice, Missing PO, Unauthorized Requestor, Unregistered beneficiary.',
        decision_snapshot: 'PENDING'
      },
      {
        id: 'log-1003-3',
        payment_id: 'tx-1003',
        timestamp: new Date(Date.now() - 45 * 60 * 1000 + 2000).toISOString(),
        time_offset_label: '11:15:12',
        actor: 'Decision Engine',
        action: 'Execution Blocked',
        details: 'Policy bypass violation & missing evidence. Decision: BLOCK.',
        decision_snapshot: 'BLOCK'
      }
    ]);

    this.auditLogs.set('tx-1004', [
      {
        id: 'log-1004-1',
        payment_id: 'tx-1004',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        time_offset_label: '11:35:00',
        actor: 'Executive Treasury Portal',
        action: 'High-Consequence Wire Initiated',
        details: 'Amount: $8,000,000 USD | Counterparty: NewCo Holdings LLC | Requestor: Marcus Vance (CFO)',
        decision_snapshot: 'PENDING'
      },
      {
        id: 'log-1004-2',
        payment_id: 'tx-1004',
        timestamp: new Date(Date.now() - 25 * 60 * 1000 + 1500).toISOString(),
        time_offset_label: '11:35:02',
        actor: 'Evidence Engine',
        action: 'Authoritative Corporate Governance Verified',
        details: 'Definitive Acquisition Agreement ACQ-AGMT-2026-99 authenticated. Board Resolution #BR-2026-088 verified. CFO signing verified. Escrow account ****5501 verified.',
        decision_snapshot: 'PENDING'
      },
      {
        id: 'log-1004-3',
        payment_id: 'tx-1004',
        timestamp: new Date(Date.now() - 25 * 60 * 1000 + 3000).toISOString(),
        time_offset_label: '11:35:03',
        actor: 'Decision Engine',
        action: 'Evaluation Completed',
        details: 'Unusual amount ($8,000,000) supported by authoritative governance evidence. UNUSUAL != FRAUD. Decision: ALLOW.',
        decision_snapshot: 'ALLOW'
      }
    ]);
  }

  // --- PERSISTENCE HELPERS ---
  public saveToDisk(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      const data = {
        employees: Array.from(this.employees.entries()),
        vendors: Array.from(this.vendors.entries()),
        bankAccounts: Array.from(this.bankAccounts.entries()),
        purchaseOrders: Array.from(this.purchaseOrders.entries()),
        invoices: Array.from(this.invoices.entries()),
        payments: Array.from(this.payments.entries()),
        evidenceDocuments: Array.from(this.evidenceDocuments.entries()),
        policies: Array.from(this.policies.entries()),
        verifications: Array.from(this.verifications.entries()),
        auditLogs: Array.from(this.auditLogs.entries())
      };

      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (e) {
      console.error('[Store] Error saving to disk:', e);
    }
  }

  public loadFromDisk(): boolean {
    if (!fs.existsSync(DB_FILE)) return false;
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);

      this.employees = new Map(data.employees || []);
      this.vendors = new Map(data.vendors || []);
      this.bankAccounts = new Map(data.bankAccounts || []);
      this.purchaseOrders = new Map(data.purchaseOrders || []);
      this.invoices = new Map(data.invoices || []);
      this.payments = new Map(data.payments || []);
      this.evidenceDocuments = new Map(data.evidenceDocuments || []);
      this.policies = new Map(data.policies || []);
      this.verifications = new Map(data.verifications || []);
      this.auditLogs = new Map(data.auditLogs || []);

      return true;
    } catch (e) {
      console.error('[Store] Error reading store from disk:', e);
      return false;
    }
  }

  // --- METRICS (Derived dynamically from DB) ---
  public getDashboardMetrics(): DashboardMetrics {
    const payments = Array.from(this.payments.values());
    const allowed = payments.filter(p => p.current_decision === 'ALLOW').length;
    const verifyReq = payments.filter(p => p.current_decision === 'VERIFY').length;
    const blocked = payments.filter(p => p.current_decision === 'BLOCK').length;
    const totalExposure = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      transactions_reviewed: payments.length,
      awaiting_verification_count: verifyReq,
      allowed_count: allowed,
      verify_required_count: verifyReq,
      blocked_count: blocked,
      total_exposure_reviewed: totalExposure,
      avg_resolution_time_minutes: 1.8,
      is_demo_environment: true
    };
  }

  // --- CRUD PAYMENTS ---
  public getPayment(id: string): Payment | undefined {
    return this.payments.get(id) || Array.from(this.payments.values()).find(p => p.tx_code.toLowerCase() === id.toLowerCase());
  }

  public getAllPayments(): Payment[] {
    return Array.from(this.payments.values()).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public createPayment(payment: Payment): Payment {
    this.payments.set(payment.id, payment);
    this.saveToDisk();
    return payment;
  }

  public updatePayment(payment: Payment): void {
    payment.updated_at = new Date().toISOString();
    this.payments.set(payment.id, payment);
    this.saveToDisk();
  }

  public deletePayment(id: string): boolean {
    const deleted = this.payments.delete(id);
    this.evidenceDocuments.forEach((doc, docId) => {
      if (doc.payment_id === id) this.evidenceDocuments.delete(docId);
    });
    this.auditLogs.delete(id);
    this.verifications.delete(id);
    this.saveToDisk();
    return deleted;
  }

  // --- EVIDENCE DOCUMENTS ---
  public addEvidenceDocument(doc: EvidenceDocument): EvidenceDocument {
    this.evidenceDocuments.set(doc.id, doc);
    this.saveToDisk();
    return doc;
  }

  public getEvidenceDocuments(paymentId: string): EvidenceDocument[] {
    return Array.from(this.evidenceDocuments.values()).filter(d => d.payment_id === paymentId);
  }

  public getAllEvidenceDocuments(): EvidenceDocument[] {
    return Array.from(this.evidenceDocuments.values());
  }

  public updateEvidenceDocument(doc: EvidenceDocument): void {
    this.evidenceDocuments.set(doc.id, doc);
    this.saveToDisk();
  }

  // --- POLICIES ---
  public getPolicies(): PolicyRule[] {
    return Array.from(this.policies.values());
  }

  public getPolicy(id: string): PolicyRule | undefined {
    return this.policies.get(id);
  }

  public addPolicy(policy: PolicyRule): PolicyRule {
    this.policies.set(policy.id, policy);
    this.saveToDisk();
    return policy;
  }

  public updatePolicy(policy: PolicyRule): void {
    this.policies.set(policy.id, policy);
    this.saveToDisk();
  }

  public deletePolicy(id: string): boolean {
    const res = this.policies.delete(id);
    this.saveToDisk();
    return res;
  }

  // --- VERIFICATIONS ---
  public addVerification(record: VerificationRecord): VerificationRecord {
    const list = this.verifications.get(record.payment_id) || [];
    list.push(record);
    this.verifications.set(record.payment_id, list);
    this.saveToDisk();
    return record;
  }

  public getVerifications(paymentId: string): VerificationRecord[] {
    return this.verifications.get(paymentId) || [];
  }

  // --- AUDIT LOGS ---
  public addAuditLog(paymentId: string, entry: Omit<AuditLogEntry, 'id'>): AuditLogEntry {
    const list = this.auditLogs.get(paymentId) || [];
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${paymentId}-${Date.now()}-${list.length + 1}`
    };
    list.push(newEntry);
    this.auditLogs.set(paymentId, list);
    this.saveToDisk();
    return newEntry;
  }

  public getAuditLogs(paymentId?: string): AuditLogEntry[] {
    if (paymentId) {
      return this.auditLogs.get(paymentId) || [];
    }
    // Return all audit logs flattened
    const all: AuditLogEntry[] = [];
    this.auditLogs.forEach(logs => all.push(...logs));
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const db = new Store();
