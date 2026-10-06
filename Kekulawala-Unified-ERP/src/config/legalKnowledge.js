// Sri Lanka Commercial, Industrial, Labor & Tax Legal Knowledge Base

export const LEGAL_CATEGORIES = [
  { id: "all", label: "All Laws & Acts" },
  { id: "labor", label: "Labor & Workforce Law" },
  { id: "tax", label: "Taxation & Inland Revenue" },
  { id: "contract", label: "Contracts & Agreements" },
  { id: "construction", label: "Construction & CIDA Rules" },
  { id: "debt_recovery", label: "Debt & Claim Recovery" },
];

export const SRI_LANKA_LEGAL_ACTS = [
  {
    id: "act-01",
    title: "Shop & Office Employees Act No. 19 of 1954",
    category: "labor",
    authority: "Department of Labour Sri Lanka",
    summary: "Regulates terms of employment, working hours, statutory leave entitlements, and overtime calculation for non-manual commercial employees.",
    keyClauses: [
      "Normal Working Hours: Maximum 8 hours per day, 45 hours per week (excluding lunch breaks).",
      "Overtime Calculation: Paid at 1.5 times the hourly normal rate for work beyond 8 hours/day.",
      "Annual Leave: 14 days full pay after 1 year of continuous service.",
      "Casual Leave: 7 days full pay per year.",
      "Maternity Leave: 84 working days for 1st & 2nd child; 42 days for 3rd child onwards."
    ],
    dailyTip: "Ensure overtime rate is strictly calculated at (Basic Salary / 240) * 1.5 per hour for Shop & Office employees."
  },
  {
    id: "act-02",
    title: "Employees Provident Fund (EPF) Act No. 15 of 1958 & ETF Act",
    category: "labor",
    authority: "Central Bank of Sri Lanka & Department of Labour",
    summary: "Statutory retirement fund obligations binding all private sector employers in Sri Lanka.",
    keyClauses: [
      "Employer EPF Contribution: Minimum 12% of employee total earnings.",
      "Employee EPF Deduction: Minimum 8% deducted from total earnings.",
      "Employer ETF Contribution: Minimum 3% of total earnings (fully borne by employer, no employee deduction).",
      "Surrender / Remittance Deadline: Must be remitted to CBSL before the last day of the following month to avoid 5%-50% surcharge penalties."
    ],
    dailyTip: "Remit EPF/ETF contributions before the 30th of every month to prevent hefty statutory surcharges by the Labor Dept."
  },
  {
    id: "act-03",
    title: "Inland Revenue Act (VAT & SSCL Regulations 2024/2025)",
    category: "tax",
    authority: "Inland Revenue Department (IRD) Sri Lanka",
    summary: "Governs Value Added Tax (VAT), Social Security Contribution Levy (SSCL), and Withholding Tax (WHT) compliance for registered businesses.",
    keyClauses: [
      "Value Added Tax (VAT): Standard rate of 18% applied on taxable supply of goods and services.",
      "Social Security Contribution Levy (SSCL): Rate of 2.5% on liable turnover above statutory threshold (LKR 60M per annum or LKR 15M per quarter).",
      "Tax Invoice Requirements: Must show VAT Reg No, Tax Invoice Title, Sequential Invoice No, Buyer Details, and Breakdown of Tax.",
      "WHT on Subcontractors: Mandatory withholding tax deduction on payments exceeding statutory thresholds."
    ],
    dailyTip: "For VAT registered clients, clearly separate VAT 18% and SSCL 2.5% on formal tax invoices to ensure input tax credit eligibility."
  },
  {
    id: "act-04",
    title: "Construction Industry Development Act (CIDA / ICTAD Standards)",
    category: "construction",
    authority: "Construction Industry Development Authority (CIDA)",
    summary: "Framework governing construction contracts, contractor grading, retention money, and defects liability in Sri Lanka.",
    keyClauses: [
      "Retention Money: Maximum 5% of certified work value, retained for 12 months post-practical completion.",
      "Defects Liability Period (DLP): Standard period of 12 months for contractor to rectify structural or cosmetic defects at own cost.",
      "Advance Payment Guarantee: Mobilization advance up to 20% against an unconditional Bank Guarantee.",
      "Adjudication & Dispute Resolution: CIDA standard procedure requires 28-day adjudication before arbitration."
    ],
    dailyTip: "Always include a 12-month Defects Liability Period (DLP) clause in subcontractor SLAs to mandate rectification of defective work."
  },
  {
    id: "act-05",
    title: "Commercial Contract Law & Law of Obligations in Sri Lanka",
    category: "contract",
    authority: "Supreme Court & Commercial High Court of Sri Lanka",
    summary: "Roman-Dutch Law & English Law principles governing valid commercial contracts, MOUs, breaches, and liquidating damages.",
    keyClauses: [
      "Offer & Acceptance: Valid consideration required; verbal commitments over LKR 500,000 must be backed by signed written agreements.",
      "Liquidated Damages: Penalties for project completion delays must be a genuine pre-estimate of loss, typically capped at 10% of contract value.",
      "Force Majeure: Must be explicitly defined in agreements to cover national emergencies, floods, or statutory embargos.",
      "Arbitration Clause: Pre-select Arbitration in Colombo under Arbitration Act No. 11 of 1995 for faster resolution than civil courts."
    ],
    dailyTip: "Insert an Arbitration Clause designating Colombo as the venue in all B2B client contracts to avoid multi-year civil court delays."
  },
  {
    id: "act-06",
    title: "Recovery of Commercial Debt & Letter of Demand (LOD) Protocol",
    category: "debt_recovery",
    authority: "District Court / Commercial High Court Sri Lanka",
    summary: "Legal procedures for recovering overdue client payments and enforcing dishonored cheques or outstanding invoices.",
    keyClauses: [
      "Prescription Period: Actions for breach of contract or unpaid debt must be filed within 3 years from the due date (Prescription Ordinance).",
      "Letter of Demand (LOD): Formal notice issued through an Attorney-at-Law granting 14 days for settlement before court litigation.",
      "Cheque Return (Dishonour): Criminal & Civil liability under Payment and Settlement Systems Act for dishonored corporate cheques.",
      "Statutory Interest: Post-judgment interest payable at Central Bank commercial rate for defaulted amounts."
    ],
    dailyTip: "Send formal written payment reminders at 30, 60, and 90 days. Unclaimed debts older than 3 years become legally non-enforceable under Sri Lankan law."
  }
];

export const DAILY_LEGAL_TIPS = [
  "💡 SL Labor Law: Overtime for office staff must be calculated at 1.5x normal rate for work beyond 8 hours/day.",
  "💡 Statutory Tax: Ensure VAT 18% is explicitly itemized on invoices for VAT-registered commercial clients.",
  "💡 CIDA Standard: Limit retention money to 5% with a 50% release upon Practical Completion Certificate.",
  "💡 Debt Recovery: Written commercial debts in Sri Lanka prescribe after 3 years — issue LOD before 36 months expire!",
  "💡 EPF/ETF Remittance: Remit monthly contributions before the last day of the following month to avoid a 50% surcharge penalty."
];
