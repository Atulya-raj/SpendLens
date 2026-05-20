# SpendLens — Product Metrics & Analytics

This document defines the metrics framework, key performance indicators (KPIs), and tracking schemas for SpendLens.

---

## ⭐️ North Star Metric

- **North Star**: **Total Annualized Savings Identified**
- **Definition**: The sum of `totalAnnualSavings` across all unique submitted audits.
- **Why**: Indicates the total value delivered to the startup ecosystem, aligning directly with Credex's brand promise of reducing SaaS waste.

---

## 📈 Key Performance Indicators (KPIs)

| Metric | Target | Measurement Method |
|---|---|---|
| **Visitor-to-Audit Conversion** | > 15% | Audits submitted / Unique visitors |
| **Average Savings / Stack** | > $150/mo | Total savings / Total audits |
| **Lead Capture Conversion** | > 8% | Lead submissions / Audits with >$50 savings |
| **Report Share Rate** | > 5% | Copy-link/Tweet clicks / Unique report views |

---

## 🛠️ Analytics Tracking Events

We track three key customer milestones:

### 1. `audit_submitted`
- **Trigger**: User clicks "Run Cost Audit" and the API returns 200.
- **Properties**:
  - `toolsCount`: Number of tools in the stack.
  - `totalMonthlySavings`: Numeric savings identified.
  - `primaryUseCase`: Use case selection.

### 2. `lead_captured`
- **Trigger**: User submits the Credex credit discount form.
- **Properties**:
  - `auditId`: UUID link.
  - `savingsAmount`: Savings amount calculated.

### 3. `report_shared`
- **Trigger**: User clicks "Copy Audit Link" or "Share on X".
- **Properties**:
  - `shareType`: `copy_link` or `twitter`.
  - `savingsAmount`: Savings amount.
