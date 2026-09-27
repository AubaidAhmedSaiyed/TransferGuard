# @transferguard/sdk

> Pre-transfer control infrastructure for consequential financial actions.

TransferGuard evaluates whether a requested transfer is sufficiently supported by business intent, evidence, authorization, policy, and contextual consistency **before** the existing payment system is allowed to proceed.

TransferGuard does **not** move money. It provides the runtime control layer for your existing payment workflows (PayPal, Stripe, Bank APIs, ERPs).

---

## Installation

```bash
npm install @transferguard/sdk
```

---

## Quickstart

```typescript
import { TransferGuard } from "@transferguard/sdk";

const guard = new TransferGuard({
  apiKey: process.env.TRANSFERGUARD_API_KEY,
  endpoint: process.env.TRANSFERGUARD_URL || "https://api.transferguard.io"
});

// Evaluate payment intent before calling your payment provider
const decision = await guard.evaluate({
  amount: 480000,
  currency: "USD",
  beneficiary: {
    name: "Acme Supplies Corp",
    account: "****9174",
    bankName: "First National Bank"
  },
  requester: {
    id: "usr_treasury_44",
    name: "Sarah Chen",
    role: "Senior Procurement Specialist"
  },
  purpose: "Invoice INV-8841 settlement",
  invoiceNumber: "INV-8841",
  purchaseOrderNumber: "PO-7719"
});

// Workflow control logic
if (decision.status === "BLOCK") {
  // Stop workflow immediately — critical policy failure or tamper detected
  console.error("Transfer BLOCKED by TransferGuard:", decision.reason);
  abortPaymentWorkflow(decision.auditId);
}

if (decision.status === "VERIFY") {
  // Pause workflow and wait for out-of-band human verification
  console.warn("Transfer requires out-of-band verification:", decision.requiredActions);
  holdPaymentForVerification(decision.auditId);
}

if (decision.status === "ALLOW") {
  // Proceed with existing payment provider execution (PayPal, Stripe, Bank API)
  await stripe.transfers.create({ ... });
}
```

---

## Decision Contract

```typescript
interface EvaluateTransferDecision {
  status: "ALLOW" | "VERIFY" | "BLOCK";
  reason: string;
  controls: { id: string; name: string; passed: boolean; reason: string }[];
  evidence: { type: string; title: string; status: string; details?: string }[];
  requiredActions: { type: string; label: string; instruction: string }[];
  auditId: string;
  transferId: string;
  evaluatedAt: string;
}
```

---

## Webhook Verification

```typescript
import { TransferGuardWebhook } from "@transferguard/sdk";

const webhook = new TransferGuardWebhook(process.env.TRANSFERGUARD_WEBHOOK_SECRET);

app.post("/webhooks/transferguard", (req, res) => {
  const event = webhook.constructEvent(req.body, req.headers["x-transferguard-signature"]);

  switch (event.event) {
    case "transfer.allowed":
      resumePaymentWorkflow(event.data.transferId);
      break;
    case "transfer.blocked":
      cancelPaymentWorkflow(event.data.transferId);
      break;
    case "transfer.review_required":
      notifyTreasuryTeam(event.data);
      break;
  }

  res.json({ received: true });
});
```
