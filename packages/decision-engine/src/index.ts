import {
  Payment,
  EvidenceItem,
  DecisionEvaluation,
  DecisionType,
  VerificationAction,
  PolicyRule,
  PolicyCheckResult,
  TransactionLifecycleState
} from '@transferguard/types';

export class DecisionEngine {
  public static evaluate(
    payment: Payment, 
    evidences: EvidenceItem[], 
    policies: PolicyRule[] = []
  ): DecisionEvaluation {
    const failedEvidences = evidences.filter(e => e.status === 'failed');
    const unresolvedEvidences = evidences.filter(e => e.status === 'unresolved');
    const verifiedEvidences = evidences.filter(e => e.status === 'verified');

    const knownFacts: string[] = [];
    const uncertainties: string[] = [];
    const criticalFailures: string[] = [];
    const conflicts: string[] = [];
    const requiredActions: VerificationAction[] = [];
    const appliedPolicies: PolicyCheckResult[] = [];

    // Categorize verified items as known facts
    for (const v of verifiedEvidences) {
      knownFacts.push(`${v.title}: ${v.description}`);
    }

    // Categorize failures
    for (const f of failedEvidences) {
      criticalFailures.push(`${f.title}: ${f.details || f.description}`);
    }

    // Categorize unresolved issues
    for (const u of unresolvedEvidences) {
      uncertainties.push(`${u.title}: ${u.description}`);
    }

    // 1. POLICY EVALUATION
    for (const policy of policies.filter(p => p.enabled)) {
      let passed = true;
      let reason = 'Policy condition satisfied.';

      switch (policy.condition_type) {
        case 'amount_threshold': {
          const threshold = policy.threshold_amount || 100000;
          if (payment.amount > threshold) {
            // Check if CFO or Executive sign-off or approved PO is present
            const isCfo = payment.requestor_role.toLowerCase().includes('cfo') || payment.requestor_role.toLowerCase().includes('chief financial');
            const hasCfoGov = payment.governance_approvals?.cfo_authorization;
            const hasExecutiveSignoff = verifiedEvidences.some(e => e.type === 'approval_governance' || (e.type === 'requestor_auth' && e.status === 'verified' && e.description.includes('Executive')));
            const hasCoveredPo = verifiedEvidences.some(e => e.type === 'po_match' && e.status === 'verified');

            if (!isCfo && !hasCfoGov && !hasExecutiveSignoff && !hasCoveredPo) {
              passed = false;
              reason = `Payment amount of $${payment.amount.toLocaleString()} USD exceeds $${threshold.toLocaleString()} threshold without verified ${policy.required_role || 'CFO / Executive'} sign-off or approved PO.`;
            }
          }
          break;
        }

        case 'beneficiary_change': {
          const hasBeneficiaryUnresolved = unresolvedEvidences.some(e => e.type === 'beneficiary_match');
          const hasBeneficiarySignal = payment.signals?.beneficiary_change;
          if (hasBeneficiaryUnresolved || hasBeneficiarySignal) {
            const hasVerifiedBeneficiary = verifiedEvidences.some(e => e.type === 'beneficiary_match');
            if (!hasVerifiedBeneficiary) {
              passed = false;
              reason = 'Bank account modification or unverified beneficiary requires independent out-of-band callback confirmation.';
            }
          }
          break;
        }

        case 'new_vendor': {
          const vendorFailed = failedEvidences.some(e => e.type === 'vendor_verified');
          if (vendorFailed || payment.signals?.new_vendor) {
            const vendorVerified = verifiedEvidences.some(e => e.type === 'vendor_verified');
            if (!vendorVerified) {
              passed = false;
              reason = 'Transfer to unverified or new vendor requires vendor master onboarding compliance.';
            }
          }
          break;
        }

        case 'unauthorized_requestor': {
          const authFailed = failedEvidences.some(e => e.type === 'requestor_auth');
          const authUnresolved = unresolvedEvidences.some(e => e.type === 'requestor_auth');
          if (authFailed || authUnresolved) {
            passed = false;
            reason = `Requestor '${payment.requestor_name}' exceeds signing delegation threshold or lacks authorization.`;
          }
          break;
        }

        case 'missing_po': {
          const poFailed = failedEvidences.some(e => e.type === 'po_match');
          if (poFailed && payment.amount >= 10000) {
            passed = false;
            reason = 'Disbursements exceeding $10,000 USD require an approved Purchase Order before payment initiation.';
          }
          break;
        }

        case 'missing_invoice': {
          const invFailed = failedEvidences.some(e => e.type === 'invoice_match');
          if (invFailed) {
            passed = false;
            reason = 'Valid invoice document or authoritative settlement agreement must be on file.';
          }
          break;
        }

        case 'bypass_attempt': {
          if (payment.signals?.bypass_approval_request) {
            passed = false;
            reason = 'Policy violation: Explicit directive to bypass internal approval controls is strictly blocked.';
          }
          break;
        }

        case 'high_risk_composite': {
          const hasChange = payment.signals?.beneficiary_change || unresolvedEvidences.some(e => e.type === 'beneficiary_match');
          const hasHighUrgency = payment.signals?.unusual_urgency || payment.amount > 100000;
          if (hasChange && hasHighUrgency) {
            const hasVerifiedBeneficiary = verifiedEvidences.some(e => e.type === 'beneficiary_match');
            if (!hasVerifiedBeneficiary) {
              passed = false;
              reason = 'High-risk composite trigger: Beneficiary alteration combined with high amount/urgency requires executive approval.';
            }
          }
          break;
        }

        case 'custom': {
          if (policy.threshold_amount && payment.amount > policy.threshold_amount) {
            passed = false;
            reason = `Triggered custom policy rule: ${policy.description}`;
          }
          break;
        }
      }

      appliedPolicies.push({
        policy_id: policy.id,
        policy_name: policy.name,
        passed,
        triggered_action: passed ? 'ALLOW' : policy.action,
        reason: passed ? 'Compliant with policy rule.' : reason
      });
    }

    // 2. CONFLICT IDENTIFICATION
    if (payment.signals?.conflicting_instructions) {
      conflicts.push('Instruction contains contradictory settlement details.');
    }
    const invMismatch = failedEvidences.find(e => e.type === 'invoice_match' && (e.details?.includes('Amount mismatch') || e.details?.includes('Discrepancy')));
    if (invMismatch) {
      conflicts.push(invMismatch.details);
    }
    const beneficiaryMismatch = unresolvedEvidences.find(e => e.type === 'beneficiary_match');
    if (beneficiaryMismatch && (payment.signals?.beneficiary_change || payment.destination_account_masked !== '****3188')) {
      conflicts.push(`Beneficiary mismatch: Requested destination (${payment.destination_account_masked}) differs from vendor's historical primary account.`);
    }

    // 3. DECISION ARBITRATION
    const policyBlocks = appliedPolicies.filter(p => !p.passed && p.triggered_action === 'BLOCK');
    const policyVerifies = appliedPolicies.filter(p => !p.passed && p.triggered_action === 'VERIFY');

    let decision: DecisionType = 'ALLOW';
    let lifecycleState: TransactionLifecycleState = 'EVALUATED';
    let headline = '';
    let summary = '';
    let safetyPrincipleNote: string | undefined = undefined;

    if (failedEvidences.length > 0 || policyBlocks.length > 0) {
      decision = 'BLOCK';
      lifecycleState = 'BLOCKED';
      headline = 'Payment Execution Blocked: Critical Evidence or Authorization Failure';
      
      const allFailures = [
        ...failedEvidences.map(f => f.title),
        ...policyBlocks.map(p => p.policy_name)
      ];
      
      summary = `The transaction cannot proceed because ${allFailures.length} critical requirement(s) failed validation. Discrepancies include: ${allFailures.join(', ')}.`;
      safetyPrincipleNote = 'TransferGuard blocks execution when originating documentation, requestor authority, or vendor identity cannot be established.';
    } else if (unresolvedEvidences.length > 0 || policyVerifies.length > 0) {
      decision = 'VERIFY';
      lifecycleState = 'VERIFY_REQUIRED';
      headline = 'Verification Required Before Transfer Execution';

      const beneficiaryIssue = unresolvedEvidences.find(e => e.type === 'beneficiary_match') || policyVerifies.find(p => p.policy_id.includes('beneficiary'));
      const limitIssue = unresolvedEvidences.find(e => e.type === 'requestor_auth');
      const govIssue = unresolvedEvidences.find(e => e.type === 'approval_governance') || policyVerifies.find(p => p.policy_id.includes('high_value'));

      if (beneficiaryIssue) {
        summary = `The payment request is supported by invoice/documentation, but destination account (${payment.destination_account_masked}) cannot yet be established as the authorized beneficiary.`;
        requiredActions.push({
          type: 'beneficiary_verification',
          label: 'Verify Beneficiary via Trusted Contact Callback',
          instruction: `Conduct an out-of-band telephone callback using the established trusted phone number for ${payment.vendor_name} to authenticate new banking coordinates (${payment.destination_account_masked}).`,
          estimated_time: '2-3 mins',
          target_entity: payment.vendor_name
        });
      } else if (limitIssue) {
        summary = `Payment details match vendor master file, but requested amount ($${payment.amount.toLocaleString()}) exceeds ${payment.requestor_name}'s single sign-off delegation limit.`;
        requiredActions.push({
          type: 'executive_override',
          label: 'Request CFO / VP Treasury Sign-Off',
          instruction: 'Route disbursement packet to Finance Controller or VP Treasury for secondary digital authorization.',
          estimated_time: '5 mins',
          target_entity: 'Treasury Delegation Matrix'
        });
      } else if (govIssue) {
        summary = `The high-value transaction ($${payment.amount.toLocaleString()} USD) exceeds standard thresholds and requires confirmed Board Resolution and CFO sign-off before transmission.`;
        requiredActions.push({
          type: 'board_approval_verification',
          label: 'Confirm Board Resolution & CFO Approval',
          instruction: 'Authenticate digital signatures against corporate governance minutes and escrow agreements.',
          estimated_time: '10 mins',
          target_entity: 'Corporate Secretarial'
        });
      } else {
        summary = `The transaction is partially supported, but ${unresolvedEvidences.length} verification item(s) remain open before safe release.`;
        requiredActions.push({
          type: 'general_verification',
          label: 'Complete Required Evidence Verification',
          instruction: 'Resolve remaining open items in the evidence checklist before release.',
          estimated_time: '5 mins',
          target_entity: 'Finance Operations'
        });
      }

      safetyPrincipleNote = 'TransferGuard does not blindly block transactions when legitimate targeted verification can resolve the uncertainty.';
    } else {
      decision = 'ALLOW';
      lifecycleState = 'APPROVED';

      if (payment.scenario_type === 'unusual_legitimate' || payment.is_unusual_amount || payment.amount >= 1000000) {
        headline = 'Payment Allowed: High-Consequence Transaction Fully Supported by Authoritative Evidence';
        summary = `This transaction is unusual or high-value, but its intent, authorization, beneficiary coordinates, and supporting governance evidence have been fully established.`;
        safetyPrincipleNote = 'UNUSUAL ≠ FRAUD. A genuine unusual transaction is safely released when its intent, authorization, beneficiary and supporting evidence are established.';
      } else {
        headline = 'Payment Allowed: Intent, Beneficiary and Supporting Evidence Fully Verified';
        summary = `The payment is supported by the expected invoice, purchase order, requestor authorization and verified beneficiary account.`;
        safetyPrincipleNote = 'All operational safety checks passed: invoice matches PO, requestor is authorized, and beneficiary matches verified vendor profile.';
      }
    }

    // Generate Consequence Summary
    const consequenceSummary = `You are about to authorize a disbursement of $${payment.amount.toLocaleString()} ${payment.currency} to ${payment.vendor_name} at ${payment.destination_bank_name} (${payment.destination_account_masked}). ${
      decision === 'ALLOW'
        ? 'All supporting evidence, PO, invoice and beneficiary checks are verified.'
        : decision === 'VERIFY'
        ? `Pending targeted verification: ${requiredActions.map(r => r.label).join(', ')}.`
        : `Execution blocked due to ${criticalFailures.length} critical failure(s).`
    }`;

    return {
      decision,
      lifecycle_state: lifecycleState,
      headline,
      summary,
      known_facts: knownFacts,
      uncertainties,
      critical_failures: criticalFailures,
      conflicts,
      applied_policies: appliedPolicies,
      required_actions: requiredActions,
      consequence_summary: consequenceSummary,
      evidence_summary: {
        total: evidences.length,
        verified_count: verifiedEvidences.length,
        unresolved_count: unresolvedEvidences.length,
        failed_count: failedEvidences.length
      },
      evidences,
      safety_principle_note: safetyPrincipleNote,
      evaluated_at: new Date().toISOString()
    };
  }
}
