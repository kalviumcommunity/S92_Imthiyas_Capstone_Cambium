# Research Intelligence Capabilities

## Replaced Hardcoded Heuristics
Prior mock methods (`confidenceScore: 0.94` in `verifyEligibility` and static 4-phase arrays in `extractDeliverables`) have been replaced with grounded domain extraction in `AssistantService`:

### 1. Rule-Based Grant Eligibility Assessment (`verifyEligibility`)
- Loads real `ResearchOpportunity` records by `opportunityId`.
- Checks deadline expiration directly against current UTC time (`DEADLINE_EXPIRED` when past).
- Scans stored solicitation text for investigator, career-stage, institutional (`university`, `501(c)(3)`), degree, citizenship, and `IRB`/`IACUC` clauses.
- Reports explicit `missingInformation` items and returns `status: 'INSUFFICIENT_EVIDENCE'`, `evidenceConfidence: null` when key data is absent.

### 2. Clause-Grounded Deliverable Extraction (`extractDeliverables`)
- Splits solicitation text into individual sentences and extracts real reporting, milestone, FAIR repository, ethics, and schedule statements matching `DELIVERABLE_CUES`.
- Returns `insufficientEvidence: true` and `deliverablesCount: 0` when no milestone statements exist in the provided text.
