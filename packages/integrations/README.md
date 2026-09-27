# @transferguard/integrations

> Payment Provider Adapters for TransferGuard Pre-Transfer Control Layer

TransferGuard decouples **pre-transfer authorization & safety verification** from **payment execution**.

Organizations keep their existing payment infrastructure (PayPal, Stripe, ISO 20022 Bank Wires, ERPs), while TransferGuard serves as the pre-flight control firewall.

---

## Architecture

```
  Existing Business Workflow (ERP / Procurement / Slack)
                       │
                       ▼
             TransferGuard SDK / API
                       │
             ┌─────────┴─────────┐
             │                   │
       AI Understanding    Control Engine
             │                   │
             └─────────┬─────────┘
                       │
              ALLOW / VERIFY / BLOCK
                       │
                       ▼
           PaymentProvider Adapter
                       │
         ┌─────────────┼─────────────┐
         │             │             │
      PayPal        Stripe       Bank API
         │             │             │
         └─────────────┴─────────────┘
                       │
                     Money
```

---

## Available Adapters

- `GenericHTTPAdapter`: Universal webhook dispatch for custom backend payment systems and ERP webhooks.
- `PayPalAdapter`: Adapter contract for PayPal Payouts API.
- `StripeAdapter`: Adapter contract for Stripe Transfers and Payouts.
- `BankAdapter`: Adapter contract for ISO 20022 / SWIFT wire gateways.
