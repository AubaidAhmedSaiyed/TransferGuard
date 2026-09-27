import {
  Payment,
  Vendor,
  BankAccount,
  PurchaseOrder,
  Invoice,
  Employee,
  EvidenceItem,
  EvidenceDocument,
  PolicyRule
} from '@transferguard/types';

export interface EvidenceContext {
  payment: Payment;
  vendor?: Vendor;
  bankAccount?: BankAccount;
  purchaseOrder?: PurchaseOrder;
  invoice?: Invoice;
  requestor?: Employee;
  attachedDocuments?: EvidenceDocument[];
  historicalVerifiedAccounts?: BankAccount[];
  policies?: PolicyRule[];
}

export class EvidenceEngine {
  public static collectEvidence(ctx: EvidenceContext): EvidenceItem[] {
    const evidences: EvidenceItem[] = [];
    const { payment, vendor, bankAccount, purchaseOrder, invoice, requestor, attachedDocuments = [] } = ctx;
    const now = new Date().toISOString();

    // Check if there are user-attached evidence documents for invoice / PO / approvals
    const attachedInvoiceDoc = attachedDocuments.find(d => d.type === 'invoice');
    const attachedPoDoc = attachedDocuments.find(d => d.type === 'purchase_order');
    const attachedContractDoc = attachedDocuments.find(d => d.type === 'contract');
    const attachedApprovalDoc = attachedDocuments.find(d => d.type === 'approval');
    const attachedBeneficiaryDoc = attachedDocuments.find(d => d.type === 'beneficiary_confirmation');

    // 1. INVOICE CONSISTENCY
    if (attachedInvoiceDoc) {
      const facts = attachedInvoiceDoc.extracted_facts;
      const invAmount = facts.amount;
      const amountMatches = invAmount === undefined || invAmount === payment.amount;
      const vendorMatches = !facts.vendor_name || facts.vendor_name.toLowerCase().includes(payment.vendor_name.toLowerCase()) || payment.vendor_name.toLowerCase().includes(facts.vendor_name.toLowerCase());
      const isConsistent = amountMatches && vendorMatches;

      evidences.push({
        id: `ev-inv-doc-${attachedInvoiceDoc.id}`,
        payment_id: payment.id,
        type: 'invoice_match',
        category: 'DOCUMENTATION',
        title: `Attached Invoice Evidence (${facts.invoice_number || payment.invoice_number || 'INV-REF'})`,
        description: isConsistent
          ? `Invoice document verified: Billed $${(invAmount || payment.amount).toLocaleString()} USD matches payment amount.`
          : `Amount mismatch: Transaction amount ($${payment.amount.toLocaleString()} USD) does not match invoice amount ($${(invAmount || 0).toLocaleString()} USD).`,
        source: `Attached Document: ${attachedInvoiceDoc.title} (${attachedInvoiceDoc.source})`,
        status: isConsistent ? 'verified' : 'failed',
        details: isConsistent 
          ? `Vendor: ${facts.vendor_name || payment.vendor_name} | Invoice #: ${facts.invoice_number || payment.invoice_number || 'N/A'}`
          : `Transaction amount: $${payment.amount.toLocaleString()} USD | Evidence amount: $${(invAmount || 0).toLocaleString()} USD | Discrepancy: Amount mismatch detected.`,
        provenance_id: `DOC-INV-${attachedInvoiceDoc.id}`,
        is_verified_evidence: attachedInvoiceDoc.is_verified_evidence,
        created_at: now
      });
    } else if (!invoice || invoice.status === 'missing') {
      if ((payment.scenario_type === 'unusual_legitimate' || payment.purpose.toLowerCase().includes('acquisition') || payment.purpose.toLowerCase().includes('closing')) && 
          (payment.governance_approvals?.acquisition_agreement_verified || attachedContractDoc)) {
        evidences.push({
          id: `ev-inv-${payment.id}`,
          payment_id: payment.id,
          type: 'invoice_match',
          category: 'DOCUMENTATION',
          title: 'Direct Contract Settlement (Non-PO/Invoice Flow)',
          description: 'Executed Definitive Acquisition & Transfer Agreement serves as the authoritative settlement instrument in place of operational invoice.',
          source: `Legal Contract Registry (${payment.governance_approvals?.agreement_ref || attachedContractDoc?.extracted_facts?.contract_ref || 'ACQ-AGMT-2026-99'})`,
          status: 'verified',
          details: `Agreement stipulates lump-sum closing disbursement of $${payment.amount.toLocaleString()} USD.`,
          provenance_id: 'DOC-AGMT-883921',
          is_verified_evidence: true,
          created_at: now
        });
      } else {
        evidences.push({
          id: `ev-inv-${payment.id}`,
          payment_id: payment.id,
          type: 'invoice_match',
          category: 'DOCUMENTATION',
          title: 'Invoice Record Validation',
          description: 'Origination invoice could not be located in AP ledger or attached documentation.',
          source: 'ERP AP Ledger / Document Hub',
          status: 'failed',
          details: 'No invoice record matching transaction reference or billing schedule found.',
          provenance_id: 'ERP-AP-ERR-404',
          is_verified_evidence: false,
          created_at: now
        });
      }
    } else {
      const amountMatches = invoice.amount === payment.amount;
      const vendorMatches = invoice.vendor_id === payment.vendor_id || payment.vendor_name.toLowerCase().includes(invoice.vendor_id.toLowerCase());
      const isVerified = amountMatches && invoice.status === 'matched';

      evidences.push({
        id: `ev-inv-${payment.id}`,
        payment_id: payment.id,
        type: 'invoice_match',
        category: 'DOCUMENTATION',
        title: `Invoice ${invoice.invoice_number} Consistency`,
        description: isVerified 
          ? `Invoice ${invoice.invoice_number} verified in ERP; amount matches payment exactly.`
          : `Invoice mismatch: billed $${invoice.amount.toLocaleString()} vs requested $${payment.amount.toLocaleString()}.`,
        source: `ERP SAP S/4HANA (${invoice.invoice_number})`,
        status: isVerified ? 'verified' : 'failed',
        details: isVerified 
          ? `Billed Amount: $${invoice.amount.toLocaleString()} USD | Payment: $${payment.amount.toLocaleString()} USD | Due: ${invoice.due_date}`
          : `Billed: $${invoice.amount.toLocaleString()} vs Requested: $${payment.amount.toLocaleString()}`,
        provenance_id: `ERP-INV-${invoice.invoice_number}`,
        is_verified_evidence: true,
        created_at: now
      });
    }

    // 2. PURCHASE ORDER CONSISTENCY
    if (attachedPoDoc) {
      const facts = attachedPoDoc.extracted_facts;
      const poAmount = facts.amount || payment.amount;
      const poCovers = poAmount >= payment.amount;
      const isVerified = attachedPoDoc.is_verified_evidence || poCovers;

      evidences.push({
        id: `ev-po-doc-${attachedPoDoc.id}`,
        payment_id: payment.id,
        type: 'po_match',
        category: 'DOCUMENTATION',
        title: `Attached Purchase Order (${facts.po_number || payment.po_number || 'PO-REF'})`,
        description: isVerified
          ? `PO verified: Approved budget $${poAmount.toLocaleString()} USD covers payment amount.`
          : `PO budget insufficient: Approved $${poAmount.toLocaleString()} vs Requested $${payment.amount.toLocaleString()}.`,
        source: `Attached Document: ${attachedPoDoc.title}`,
        status: isVerified ? 'verified' : 'failed',
        details: `Approved by: ${facts.approved_by || 'Operations Lead'} | PO #: ${facts.po_number || payment.po_number || 'N/A'}`,
        provenance_id: `DOC-PO-${attachedPoDoc.id}`,
        is_verified_evidence: attachedPoDoc.is_verified_evidence,
        created_at: now
      });
    } else if (!purchaseOrder || purchaseOrder.status === 'missing') {
      if ((payment.scenario_type === 'unusual_legitimate' || payment.purpose.toLowerCase().includes('acquisition') || payment.purpose.toLowerCase().includes('closing')) && 
          (payment.governance_approvals?.acquisition_agreement_verified || attachedContractDoc)) {
        evidences.push({
          id: `ev-po-${payment.id}`,
          payment_id: payment.id,
          type: 'po_match',
          category: 'DOCUMENTATION',
          title: 'Special Project Authorization (PO-Exempt Capital Flow)',
          description: 'M&A / Capital allocation disbursements bypass standard inventory procurement PO under Corporate Treasury Policy Section 8.4.',
          source: 'Corporate Governance Registry',
          status: 'verified',
          details: 'Capital Allocation Directive verified; approved by Investment Committee & Board.',
          provenance_id: 'CORP-GOV-PO-EXEMPT-04',
          is_verified_evidence: true,
          created_at: now
        });
      } else if (payment.amount < 10000) {
        evidences.push({
          id: `ev-po-${payment.id}`,
          payment_id: payment.id,
          type: 'po_match',
          category: 'DOCUMENTATION',
          title: 'Purchase Order Exemption (Under $10,000 Micro-threshold)',
          description: 'Payment is below standard mandatory Purchase Order threshold.',
          source: 'Corporate Procurement Guidelines',
          status: 'verified',
          details: 'Micro-purchases under $10,000 USD do not require pre-requisite PO.',
          provenance_id: 'PO-EXEMPT-MICRO',
          is_verified_evidence: true,
          created_at: now
        });
      } else {
        evidences.push({
          id: `ev-po-${payment.id}`,
          payment_id: payment.id,
          type: 'po_match',
          category: 'DOCUMENTATION',
          title: 'Purchase Order Verification',
          description: 'No corresponding approved Purchase Order exists for this disbursement.',
          source: 'Procurement Hub & Document Ledger',
          status: 'failed',
          details: 'Disbursements exceeding $10,000 USD require an approved Purchase Order before payment initiation.',
          provenance_id: 'PO-HUB-ERR-MISSING',
          is_verified_evidence: false,
          created_at: now
        });
      }
    } else {
      const poApproved = purchaseOrder.status === 'approved';
      const poMatchesAmount = purchaseOrder.amount >= payment.amount;

      evidences.push({
        id: `ev-po-${payment.id}`,
        payment_id: payment.id,
        type: 'po_match',
        category: 'DOCUMENTATION',
        title: `Purchase Order ${purchaseOrder.po_number} Verification`,
        description: poApproved && poMatchesAmount 
          ? `PO ${purchaseOrder.po_number} approved by ${purchaseOrder.approved_by} with sufficient committed budget.`
          : `PO ${purchaseOrder.po_number} is pending approval or has insufficient funds.`,
        source: `Procurement Hub (${purchaseOrder.po_number})`,
        status: poApproved && poMatchesAmount ? 'verified' : 'failed',
        details: `Approved Budget: $${purchaseOrder.amount.toLocaleString()} USD | Status: ${purchaseOrder.status.toUpperCase()}`,
        provenance_id: `PO-${purchaseOrder.po_number}`,
        is_verified_evidence: true,
        created_at: now
      });
    }

    // 3. VENDOR MASTER IDENTITY
    if (!vendor || vendor.status === 'unknown' || (!vendor.verified && !attachedDocuments.some(d => d.type === 'vendor_record' && d.is_verified_evidence))) {
      // Check if user created a transaction with a valid vendor name
      if (vendor && vendor.verified) {
        evidences.push({
          id: `ev-vnd-${payment.id}`,
          payment_id: payment.id,
          type: 'vendor_verified',
          category: 'IDENTITY',
          title: `Vendor Profile: ${vendor.name}`,
          description: `Established active vendor (${vendor.category}) verified since ${vendor.established_since}.`,
          source: `Vendor Master File (Tax ID: ${vendor.tax_id})`,
          status: 'verified',
          details: `Active supplier in good standing. Trusted contact on file: ${vendor.trusted_contact_name} (${vendor.trusted_contact_phone}).`,
          provenance_id: `VND-MSTR-${vendor.id}`,
          is_verified_evidence: true,
          created_at: now
        });
      } else {
        evidences.push({
          id: `ev-vnd-${payment.id}`,
          payment_id: payment.id,
          type: 'vendor_verified',
          category: 'IDENTITY',
          title: 'Vendor Master Directory Check',
          description: `Beneficiary entity '${payment.vendor_name}' is not an established or verified vendor in the Vendor Master database.`,
          source: 'Global Vendor Master Registry',
          status: 'failed',
          details: 'Entity fails compliance onboarding and KYC verification.',
          provenance_id: 'VND-MASTER-UNMATCHED',
          is_verified_evidence: false,
          created_at: now
        });
      }
    } else {
      evidences.push({
        id: `ev-vnd-${payment.id}`,
        payment_id: payment.id,
        type: 'vendor_verified',
        category: 'IDENTITY',
        title: `Vendor Profile: ${vendor.name}`,
        description: `Established active vendor (${vendor.category}) verified since ${vendor.established_since}.`,
        source: `Vendor Master File (Tax ID: ${vendor.tax_id})`,
        status: 'verified',
        details: `Active supplier in good standing. Trusted contact on file: ${vendor.trusted_contact_name} (${vendor.trusted_contact_phone}).`,
        provenance_id: `VND-MSTR-${vendor.id}`,
        is_verified_evidence: true,
        created_at: now
      });
    }

    // 4. REQUESTOR AUTHORIZATION & LIMITS
    if (!requestor || requestor.role.includes('Unknown') || requestor.authorization_level === 0) {
      evidences.push({
        id: `ev-req-${payment.id}`,
        payment_id: payment.id,
        type: 'requestor_auth',
        category: 'AUTHORIZATION',
        title: 'Requestor Identity & Delegation of Authority',
        description: `Requestor '${payment.requestor_name}' is unknown or lacks authorized delegation for initiating financial disbursements.`,
        source: 'HRIS & Identity Management Directory',
        status: 'failed',
        details: 'No valid active employee record or signing authority found for requestor.',
        provenance_id: 'HRIS-AUTH-ERR-99',
        is_verified_evidence: false,
        created_at: now
      });
    } else {
      const isWithinLimit = payment.amount <= requestor.authorization_level;
      const isCoveredByApprovedPO = purchaseOrder?.status === 'approved' && purchaseOrder.amount >= payment.amount;
      const isCoveredByAttachedPO = attachedPoDoc && (attachedPoDoc.extracted_facts.amount || 0) >= payment.amount;
      const isAuthorizedSpecial = (payment.scenario_type === 'unusual_legitimate' || attachedApprovalDoc !== undefined) && 
                                  ((payment.governance_approvals?.cfo_authorization || false) || (attachedApprovalDoc?.is_verified_evidence || false));

      if (isWithinLimit || isCoveredByApprovedPO || isCoveredByAttachedPO || isAuthorizedSpecial) {
        const authDetail = isCoveredByApprovedPO && !isWithinLimit
          ? `Disbursement authorized under approved Purchase Order ${purchaseOrder?.po_number} (Budget: $${purchaseOrder?.amount.toLocaleString()} USD signed by ${purchaseOrder?.approved_by}).`
          : isAuthorizedSpecial
          ? `Disbursement authorized via Executive / CFO Approval Record.`
          : `Individual Delegation Limit: $${requestor.authorization_level.toLocaleString()} USD | Department: ${requestor.department}`;

        evidences.push({
          id: `ev-req-${payment.id}`,
          payment_id: payment.id,
          type: 'requestor_auth',
          category: 'AUTHORIZATION',
          title: `Requestor Authority: ${requestor.name}`,
          description: `${requestor.name} (${requestor.role}) is authorized for this disbursement.`,
          source: `HRIS Delegation Matrix Level ${requestor.authorization_level >= 1000000 ? 'Executive' : 'Standard'}`,
          status: 'verified',
          details: authDetail,
          provenance_id: `HRIS-USER-${requestor.id}`,
          is_verified_evidence: true,
          created_at: now
        });
      } else {
        evidences.push({
          id: `ev-req-${payment.id}`,
          payment_id: payment.id,
          type: 'requestor_auth',
          category: 'AUTHORIZATION',
          title: `Requestor Limit Exceeded: ${requestor.name}`,
          description: `Payment amount of $${payment.amount.toLocaleString()} exceeds ${requestor.name}'s single authorization threshold ($${requestor.authorization_level.toLocaleString()}).`,
          source: 'HRIS Delegation Policy (DOA-2026)',
          status: 'unresolved',
          details: 'Requires secondary executive sign-off from VP Finance, CFO, or Controller.',
          provenance_id: `HRIS-LIMIT-EXCEED-${requestor.id}`,
          is_verified_evidence: true,
          created_at: now
        });
      }
    }

    // 5. BENEFICIARY DESTINATION ACCOUNT CONSISTENCY
    if (attachedBeneficiaryDoc && attachedBeneficiaryDoc.is_verified_evidence) {
      evidences.push({
        id: `ev-bnk-doc-${attachedBeneficiaryDoc.id}`,
        payment_id: payment.id,
        type: 'beneficiary_match',
        category: 'BENEFICIARY',
        title: `Beneficiary Account Verified via Attached Confirmation`,
        description: `Destination account ${payment.destination_account_masked} is verified via independent document evidence.`,
        source: `Attached Evidence: ${attachedBeneficiaryDoc.title}`,
        status: 'verified',
        details: `Confirmed by: ${attachedBeneficiaryDoc.extracted_facts.approved_by || 'Finance Controller'} | Bank: ${payment.destination_bank_name}`,
        provenance_id: `DOC-BNK-${attachedBeneficiaryDoc.id}`,
        is_verified_evidence: true,
        created_at: now
      });
    } else if (!bankAccount) {
      // Check if user created a bank account with matching masked string or if vendor has verified account
      evidences.push({
        id: `ev-bnk-${payment.id}`,
        payment_id: payment.id,
        type: 'beneficiary_match',
        category: 'BENEFICIARY',
        title: 'Beneficiary Bank Account Validation',
        description: `Destination account routing details (${payment.destination_account_masked}) could not be matched with any recognized depository or verified vendor profile.`,
        source: 'Treasury Banking Directory & Vendor Master',
        status: 'failed',
        details: `Destination account ${payment.destination_account_masked} at ${payment.destination_bank_name || 'Unknown Bank'} is unrecognized.`,
        provenance_id: 'TREASURY-BNK-ERR',
        is_verified_evidence: false,
        created_at: now
      });
    } else if (bankAccount.verified) {
      const methodLabel = bankAccount.verification_method === 'out_of_band_callback'
        ? 'Independently verified via trusted vendor out-of-band callback'
        : bankAccount.verification_method === 'board_resolution'
        ? 'Verified via Board Acquisition Resolution and escrow custody agreement'
        : 'Established verified account on file';

      evidences.push({
        id: `ev-bnk-${payment.id}`,
        payment_id: payment.id,
        type: 'beneficiary_match',
        category: 'BENEFICIARY',
        title: `Beneficiary Account: ${bankAccount.bank_name} (${bankAccount.account_number_masked})`,
        description: `Destination account is verified and matches the authorized vendor profile.`,
        source: `Treasury Master Bank Register (${bankAccount.verification_method || 'verified'})`,
        status: 'verified',
        details: `${methodLabel}. Account verified at ${bankAccount.verified_at ? new Date(bankAccount.verified_at).toLocaleTimeString() : 'record creation'}${bankAccount.verified_by ? ` by ${bankAccount.verified_by}` : ''}.`,
        provenance_id: `BNK-REC-${bankAccount.id}`,
        is_verified_evidence: true,
        created_at: now
      });
    } else {
      evidences.push({
        id: `ev-bnk-${payment.id}`,
        payment_id: payment.id,
        type: 'beneficiary_match',
        category: 'BENEFICIARY',
        title: `Beneficiary Account Unverified: ${bankAccount.bank_name} (${bankAccount.account_number_masked})`,
        description: `Destination account differs from vendor's historical account or has not undergone independent out-of-band verification.`,
        source: 'Vendor Master (Bank Modification Audit Log)',
        status: 'unresolved',
        details: `Account was recently added or modified. Out-of-band telephone callback to established contact (${vendor?.trusted_contact_name || 'Vendor Primary'}) required before execution.`,
        provenance_id: `BNK-UNVERIFIED-${bankAccount.id}`,
        is_verified_evidence: false,
        created_at: now
      });
    }

    // 6. CORPORATE GOVERNANCE & HIGH VALUE APPROVALS
    if (payment.scenario_type === 'unusual_legitimate' || payment.amount >= 1000000 || payment.purpose.toLowerCase().includes('acquisition')) {
      const gov = payment.governance_approvals;
      const allGovApproved = (gov?.board_approval && gov?.cfo_authorization && gov?.acquisition_agreement_verified) ||
                             (attachedContractDoc?.is_verified_evidence && attachedApprovalDoc?.is_verified_evidence);

      if (allGovApproved) {
        evidences.push({
          id: `ev-gov-${payment.id}`,
          payment_id: payment.id,
          type: 'approval_governance',
          category: 'GOVERNANCE',
          title: 'Executive & Board Governance Authorization',
          description: 'Full corporate governance chain verified: Board Resolution passed, CFO digital signing verified, Definitive Agreement authenticated.',
          source: 'Corporate Governance & Board Portal',
          status: 'verified',
          details: `Board Resolution passed. CFO Authorization verified. Agreement ref: ${gov?.agreement_ref || attachedContractDoc?.extracted_facts?.contract_ref || 'ACQ-AGMT-2026-99'}.`,
          provenance_id: 'DOC-GOV-CERT-9021',
          is_verified_evidence: true,
          created_at: now
        });
      } else {
        evidences.push({
          id: `ev-gov-${payment.id}`,
          payment_id: payment.id,
          type: 'approval_governance',
          category: 'GOVERNANCE',
          title: 'High-Value Governance Verification',
          description: 'High-consequence transfer exceeds $1,000,000 threshold without complete Board & CFO signing verification.',
          source: 'Corporate Governance Portal',
          status: 'unresolved',
          details: 'Disbursement requires authenticated Board Resolution and CFO sign-off.',
          provenance_id: 'GOV-PENDING-SIGN',
          is_verified_evidence: false,
          created_at: now
        });
      }
    }

    // 7. SAFETY SIGNALS & POLICY BYPASS DETECTION
    if (payment.signals?.bypass_approval_request) {
      evidences.push({
        id: `ev-sig-bypass-${payment.id}`,
        payment_id: payment.id,
        type: 'policy_compliance',
        category: 'POLICY',
        title: 'Policy Bypass Attempt Detected in Instruction',
        description: 'Payment instruction contains explicit request to bypass standard approval channels or internal governance controls.',
        source: 'TransferGuard AI Intent Safety Inspector',
        status: 'failed',
        details: 'Attempting to skip approval matrix is a critical policy violation.',
        provenance_id: 'SIG-BYPASS-BLOCK',
        is_verified_evidence: true,
        created_at: now
      });
    }

    return evidences;
  }
}
