# TransferGuard

> **AI can understand. Evidence must authorize.**
> Runtime safety and verification layer for consequential financial actions.

TransferGuard is a **pre-transfer safety and runtime verification platform** designed to prevent unauthorized or manipulated high-consequence financial disbursements before money moves.

It does **NOT** attempt black-box ML fraud prediction or probabilistic risk scoring. Instead, it converts natural-language instructions and supporting documents into structured claims, validates them against authoritative organizational evidence and configurable policies, and enforces deterministic safety decisions: **ALLOW**, **VERIFY**, or **BLOCK**.

---

## 🛡️ Core Philosophy & Product Definition

```text
USER / SYSTEM INSTRUCTION
        ↓
AI UNDERSTANDS INTENT (NLP Entity & Signal Extraction)
        ↓
STRUCTURED ACTION (Human Review & Correction Stage)
        ↓
EVIDENCE COLLECTION (Invoices, POs, Contracts, Approvals)
        ↓
POLICY & AUTHORIZATION ENFORCEMENT
        ↓
CONSISTENCY VERIFICATION (Cross-Claim Discrepancy Checks)
        ↓
DETERMINISTIC DECISION ENGINE
        ↓
ALLOW  /  VERIFY  /  BLOCK
        ↓ (IF VERIFY)
TARGETED VERIFICATION WORKFLOW (Out-of-band Callback / Dual Sign-off)
        ↓
RE-EVALUATION
        ↓
ALLOW  /  BLOCK (Full Audit Lineage Recorded)
```

### The Architectural Boundary
* **AI Role:** Unstructured intent extraction, safety-relevant signal identification, document fact extraction, and decision explainability.
* **Deterministic Engine Role:** Absolute authority over decision evaluation, policy compliance, consistency validation, and action gating.
* **AI Cannot:** Authorize funds, override policies, invent evidence, or mark verification complete without human verification.

---

## ⚡ The Three Safety Decisions

| Decision | Meaning | Engine Action |
| :--- | :--- | :--- |
| **ALLOW** | Required evidence, authorizations, and policy checks are fully established and consistent. | Payment is cleared for safe execution. |
| **VERIFY** | Transaction is coherent, but an essential condition (e.g. unverified destination account) requires targeted out-of-band confirmation. | Halts execution and presents a structured verification workflow. Re-evaluates upon confirmation. |
| **BLOCK** | Critical policy violation, unauthorized actor, missing prerequisite evidence, or policy bypass attempt. | Stops disbursement permanently with explicit failure lineage. |

---

## 🚀 Key Platform Capabilities

### 1. Real User-Created Transactions
Users and judges can create arbitrary payment transactions from scratch:
- Enter natural-language instructions (e.g. *"Please pay Acme Supplies $480,000 for invoice INV-8841. They sent updated banking details this morning."*)
- AI extracts structured action, urgency, counterparty, amount, and safety signals.
- Users inspect and edit extracted fields before submission.
- Transactions are persisted to backend storage and evaluated dynamically.

### 2. AI Safety Signals & Cross-Claim Conflict Detection
- Identifies beneficiary modifications, unusual urgency, requests to bypass approvals, unregistered counterparties, and social-engineering directives.
- Compares claims across payment requests and attached evidence (e.g. invoice billed amount vs requested amount, recorded bank account vs requested destination).

### 3. Configurable Organizational Policy Engine
- Configure, enable, disable, and test enterprise governance rules:
  - **High-Value Transfers:** Transactions > $100,000 require CFO / VP Treasury sign-off.
  - **Beneficiary Changes:** Any new or modified destination account requires independent out-of-band telephone callback verification.
  - **New Vendor Identity:** Unverified entities require compliance onboarding before disbursement.
  - **Policy Bypass Directives:** Instructions attempting to skip approval are strictly blocked.
- **Natural Language Policy Builder:** Convert plain-English rules (*"Any payment above $250,000 requires CFO approval"*) into structured policies with human approval before activation.

### 4. Interactive Targeted Verification Workflow
When `VERIFY` is returned:
- Out-of-band callback to established vendor master contact.
- Executive / CFO dual authorization override.
- Board resolution & escrow custody agreement authentication.
- Automatically re-evaluates and records immutable audit history.

---

## 🎯 Acceptance Tests (Section 53)

The platform is designed to pass all 5 formal acceptance tests:

| Test | Parameters | Expected Result | Resolution |
| :--- | :--- | :--- | :--- |
| **Test A** | $12,400, Existing vendor (Northstar), Verified account (`****3188`), Valid invoice (INV-1042), Approved PO (PO-8842), Authorized user | **ALLOW** | Sits in approved queue. |
| **Test B** | $480,000, Existing vendor (Acme Supplies), Valid invoice (INV-8841), Approved PO (PO-7281), **NEW beneficiary account (`****9174`)** | **VERIFY** | Conduct out-of-band callback to Elena Rostova → Re-evaluates to **ALLOW**. |
| **Test C** | $480,000, Unauthorized requestor, Missing invoice, Missing PO, Offshore destination (`****0099`), Bypass directive | **BLOCK** | Permanent block with 4 critical failure items. |
| **Test D** | $8,000,000, Counterparty (NewCo Holdings), Acquisition closing, Verified Definitive Agreement, Board Resolution #BR-2026-088, CFO authorization | **ALLOW** | Unusual amount allowed because authoritative governance is established (**UNUSUAL ≠ FRAUD**). |
| **Test E** | Arbitrary user-created transaction (e.g. $175,000 to Test Supplier) | **Evaluates Dynamically** | Evaluated via active policy rules without requiring hardcoded IDs. |

---

## 🏗️ Technical Architecture & Directory Structure

```text
transferguard/
│
├── apps/
│   ├── web/                    # React 18 + Vite + Tailwind CSS + Lucide
│   │   ├── src/
│   │   │   ├── pages/          # LandingPage, LoginPage, SignupPage, OnboardingPage,
│   │   │   │                   # OverviewPage, NewTransferPage, DeveloperPage,
│   │   │   │                   # IntegrationsPage, SettingsPage
│   │   │   ├── components/     # WorkspaceHeader, TransactionDetail, TransactionsTable,
│   │   │   │                   # EvidenceCard, AuditTrail, VerificationModal, AddEvidenceModal
│   │   │   ├── context/        # AuthContext, RouterContext
│   │   │   └── services/api.ts # Full REST API client with local synchronization
│   │
│   └── api/                    # Express + TypeScript Pre-Transfer Safety API
│       ├── src/
│       │   ├── db/store.ts     # Persistent store with auto-save to disk & dynamic metrics
│       │   ├── services/ai.ts  # Clean AI Service boundary (Ollama + NLP fallback parser)
│       │   ├── routes/         # /transactions, /policies, /evidence, /ai, /simulate, /metrics
│       │   └── index.ts        # Express runtime server on port 3001
│
├── packages/
│   ├── sdk/                    # @transferguard/sdk: Node.js/TypeScript developer client & webhooks
│   ├── integrations/           # @transferguard/integrations: Adapters for Stripe, PayPal, Banks
│   ├── decision-engine/        # Deterministic explainable policy & decision rules
│   ├── evidence-engine/        # Cross-system evidence aggregation & consistency checks
│   └── types/                  # Shared TypeScript contracts, lifecycle & AI schemas
│
└── README.md
```

---

## 🚀 Quickstart & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. (Optional) Run Local AI with Ollama
If Ollama is running locally on `http://localhost:11434`, TransferGuard automatically uses your local model (e.g. `qwen3:4b` or `llama3`). If Ollama is unavailable, TransferGuard gracefully falls back to deterministic heuristic parsing without faking AI responses.

```bash
# In a separate terminal (optional)
ollama run qwen3:4b
```

### 3. Start Both API & Web Frontend (Concurrent)
```bash
npm run dev
```
* **Web Application:** [http://localhost:5173](http://localhost:5173)
* **API Health Endpoint:** [http://localhost:3001/api/health](http://localhost:3001/api/health)

### 4. Run Automated Test Suites
TransferGuard includes comprehensive automated tests for SDK contracts, judge acceptance criteria, and black-box product verification:

```bash
# Run all test suites
npm test

# Or run individual test suites:
npm run test:sdk          # Tests @transferguard/sdk & @transferguard/integrations adapters
npm run test:acceptance   # Tests 5 core transfer scenarios (Test A through E)
npm run test:blackbox     # Full black-box first-time judge simulation
```

### 5. Production Build
```bash
npm run build
```

---

## 🎙️ 90-Second Demo Script for Judges

| Time | Action / Screen | Talking Points |
| :--- | :--- | :--- |
| **0:00 - 0:25** | Click **"Create Transaction"** | *"TransferGuard is a runtime verification layer. Watch what happens when an employee enters: 'Please pay Acme Supplies $480,000 for invoice INV-8841 with updated bank details.' AI extracts structured claims and flags the beneficiary change. We inspect the fields and evaluate."* |
| **0:25 - 0:45** | Review Result (**VERIFY**) → **Resolve** | *"The decision is **VERIFY**—not an opaque fraud score. The invoice and PO are valid, but the bank coordinates are unverified. We click 'Verify Beneficiary via Callback', complete telephone confirmation with the established vendor contact, and watch the decision safely transition to **ALLOW**."* |
| **0:45 - 1:05** | Open **$8M Acquisition (`TX-1004`)** | *"Here is an $8,000,000 acquisition transfer. A standard black-box anomaly detector blocks it because it is unprecedented. TransferGuard ALLOWS it because **Unusual does not mean Fraud**—the Board resolution, CFO signing, and contract are authoritative."* |
| **1:05 - 1:20** | Open **Spoofed Directive (`TX-1003`)** | *"Here is a spoofed wire claiming urgency and asking to skip approval. TransferGuard's deterministic policy engine catches the policy bypass attempt and immediately **BLOCKS** it with transparent audit points."* |
| **1:20 - 1:30** | Closing Summary | *"AI can understand an instruction. That does not mean it should be trusted to execute the consequence. TransferGuard creates the verifiable safety layer: **AI can understand. Evidence must authorize.**"* |

---

## 🔒 Honest Limitations & Disclosures

1. **Synthetic Settlement Environment:** All bank accounts, routing codes, corporate entities, and wire transactions are synthetic demonstration records for runtime safety evaluation. No live banking APIs are connected and no real funds are moved.
2. **Designed Integration Boundaries:** Designed architecture integration points represent where enterprise ERP (SAP), Procurement (Coupa), HRIS (Workday), and Corporate Governance (Docusign) connectors attach in production deployments.
3. **AI Boundaries:** AI is strictly constrained to unstructured extraction, signal identification, and summarization. AI has zero autonomous authority to approve financial transactions or alter active policies without human authorization.
