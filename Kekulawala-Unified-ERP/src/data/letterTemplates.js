// 8 Specialized Enterprise Letter & Agreement Templates

export const LETTER_CATEGORIES = [
  { id: "advance_request", label: "Payment Advance Request" },
  { id: "payment_reminder", label: "Payment Overdue / Reminder" },
  { id: "appreciation", label: "Thanking & Appreciation" },
  { id: "rfq_po", label: "PO Transmittal & Supplier RFQ" },
  { id: "material_request", label: "Material Release Requisition" },
  { id: "final_bill", label: "Final Invoice Transmittal" },
  { id: "mou", label: "Memorandum of Understanding (MOU)" },
  { id: "subcontractor_agreement", label: "Subcontractor & SLA Agreement" },
];

export const TEMPLATE_GENERATORS = {
  advance_request: (data) => ({
    subject: `Request for Mobilization Advance Payment - ${data.projectName || 'Project'}`,
    body: `Dear ${data.contactName || 'Client'},

RE: REQUEST FOR MOBILIZATION ADVANCE PAYMENT (QUOTATION REF: ${data.quoteRef || 'QT-2025-XXXX'})

We refer to the formal confirmation of Quotation Ref: ${data.quoteRef || 'QT-2025-XXXX'} for the execution of "${data.projectName || 'the designated project'}".

In accordance with our agreed commercial terms, we respectfully request the release of the ${data.advancePct || '50'}% Mobilization Advance Payment amounting to LKR ${(data.advanceAmount || 0).toLocaleString('en-LK')}.00.

Bank Transfer Details:
• Account Name: ${data.companyName || 'Kekulawala Enterprises (Pvt) Ltd'}
• Bank: ${data.bankName || 'Commercial Bank of Ceylon PLC'}
• Account Number: ${data.accountNo || '8001049281'}
• Branch: ${data.branch || 'Kurunegala Main Branch'}

Upon receipt of the advance payment, site mobilization and raw material fabrication will commence immediately.

Thanking you for your valued business.

Yours faithfully,
${data.companyName || 'Kekulawala Enterprises (Pvt) Ltd'}`
  }),

  payment_reminder: (data) => ({
    subject: `PAYMENT OVERDUE REMINDER - Invoice ${data.invoiceNo || 'INV-2025-XXXX'} (${data.overdueDays || '14'} Days Overdue)`,
    body: `Dear ${data.contactName || 'Valued Client'},

RE: OVERDUE PAYMENT REMINDER FOR INVOICE ${data.invoiceNo || 'INV-2025-XXXX'}

We hope this letter finds you well.

We wish to bring to your attention that Invoice Ref: ${data.invoiceNo || 'INV-2025-XXXX'} dated ${data.invoiceDate || '2025-02-01'} for the amount of LKR ${(data.dueAmount || 0).toLocaleString('en-LK')}.00 has passed its statutory payment due date by ${data.overdueDays || '14'} days.

Details of Outstanding Amount:
• Invoice Number: ${data.invoiceNo || 'INV-2025-XXXX'}
• Project: ${data.projectName || 'Signage Installation'}
• Total Amount Due: LKR ${(data.dueAmount || 0).toLocaleString('en-LK')}.00
• Original Due Date: ${data.dueDate || '2025-02-28'}

We kindly request you to process this remittance at your earliest convenience to avoid any disruption to ongoing project milestones or services.

If payment has already been remitted, please accept our thanks and disregard this notification.

Yours faithfully,
Finance & Accounts Department
${data.companyName || 'Kekulawala Enterprises (Pvt) Ltd'}`
  }),

  appreciation: (data) => ({
    subject: `Letter of Appreciation & Project Handover - ${data.projectName || 'Completed Project'}`,
    body: `Dear ${data.contactName || 'Valued Client'},

RE: EXPRESSION OF APPRECIATION & SUCCESSFUL PROJECT COMPLETION

On behalf of the board and operational team at ${data.companyName || 'Kekulawala Enterprises (Pvt) Ltd'}, we write to express our sincere gratitude for awarding us the contract for "${data.projectName || 'the project'}".

We are pleased to confirm that all works under Quotation/Contract ${data.quoteRef || 'QT-2025-001'} have been completed in full compliance with quality specifications and handed over on ${data.completionDate || '2025-03-07'}.

It has been a true privilege partnering with ${data.clientCompany || 'your esteemed organization'}. We look forward to serving your future engineering, signage, and construction requirements.

Yours sincerely,
Management
${data.companyName || 'Kekulawala Enterprises (Pvt) Ltd'}`
  }),

  rfq_po: (data) => ({
    subject: `OFFICIAL PURCHASE ORDER (PO REF: ${data.poRef || 'PO-2025-XXXX'}) - ${data.supplierName || 'Supplier'}`,
    body: `Dear ${data.supplierContact || 'Sales Manager'},

RE: ISSUANCE OF PURCHASE ORDER ${data.poRef || 'PO-2025-XXXX'}

We are pleased to place our official Purchase Order Ref: ${data.poRef || 'PO-2025-XXXX'} for the supply of raw materials as detailed below:

Delivery Terms & Instructions:
• Target Delivery Date: ${data.deliveryDate || '2025-03-15'}
• Delivery Destination: ${data.destination || 'Kurunegala Central Factory Yard'}
• Total PO Value: LKR ${(data.poTotal || 0).toLocaleString('en-LK')}.00 (Inclusive of Transport & Taxes)

Please acknowledge receipt of this PO and confirm delivery scheduling via return email or WhatsApp.

Yours faithfully,
Procurement Department
${data.companyName || 'Kekulawala Enterprises (Pvt) Ltd'}`
  }),

  material_request: (data) => ({
    subject: `Material Requisition & Dispatch Request - ${data.projectName || 'Project'}`,
    body: `MEMORANDUM

TO: Stores & Inventory Manager
FROM: Project Manager
DATE: ${data.date || '2025-03-07'}
SUBJECT: SITE MATERIAL REQUISITION - ${data.projectName || 'PRJ-2025-001'}

Please approve and dispatch the following materials from Central Inventory to the site location (${data.siteAddress || 'Kurunegala Site'}):

Requested Items:
1. ${data.itemSummary || 'Aluminum Composite Panels - 20 Sheets'}
2. Steel Frame Tubes - 100 Feet

Authorized By: Project Operations Division`
  }),

  final_bill: (data) => ({
    subject: `Transmittal of Final Invoice & Completion Certificate - ${data.projectName || 'Project'}`,
    body: `Dear ${data.contactName || 'Client'},

RE: TRANSMITTAL OF FINAL INVOICE & COMPLETION CERTIFICATE

We enclose herewith our Final Tax Invoice Ref: ${data.invoiceNo || 'INV-2025-FINAL'} for the completed contract "${data.projectName || 'Project'}".

Summary of Account:
• Original Contract Value: LKR ${(data.quotedAmount || 0).toLocaleString('en-LK')}.00
• Less Advance Paid: LKR ${(data.advancePaid || 0).toLocaleString('en-LK')}.00
• Final Balance Payable: LKR ${(data.finalBalance || 0).toLocaleString('en-LK')}.00

Kindly certify the enclosed Completion Certificate and process final settlement.

Yours faithfully,
${data.companyName || 'Kekulawala Enterprises (Pvt) Ltd'}`
  }),

  mou: (data) => ({
    subject: `MEMORANDUM OF UNDERSTANDING (MOU) - ${data.partnerName || 'Partner'} & Kekulawala Enterprises`,
    body: `MEMORANDUM OF UNDERSTANDING (MOU)

THIS MEMORANDUM OF UNDERSTANDING is entered into on ${data.date || '2025-03-07'} in Colombo, Sri Lanka.

BY AND BETWEEN:
1. ${data.companyName || 'Kekulawala Enterprises (Pvt) Ltd'}, a company incorporated in Sri Lanka (PV-00289143).
AND
2. ${data.partnerName || 'Partner Organization'}, having its principal address at ${data.partnerAddress || 'Colombo'}.

1. PURPOSE & SCOPE
The parties agree to collaborate on the execution of ${data.scope || 'Commercial Engineering Projects'} in Sri Lanka.

2. COMMERCIAL ROLES
• Party A shall provide technical engineering, fabrication, and project management.
• Party B shall manage client relations, site access, and financial mobilization.

3. GOVERNING LAW
This MOU shall be governed by and construed in accordance with the Laws of the Democratic Socialist Republic of Sri Lanka.

IN WITNESS WHEREOF, the parties hereto have executed this MOU as of the date first above written.`
  }),

  subcontractor_agreement: (data) => ({
    subject: `SUBCONTRACTOR AGREEMENT & SLA - ${data.subcontractorName || 'Subcontractor'}`,
    body: `SUBCONTRACTOR WORK AGREEMENT & SERVICE LEVEL AGREEMENT

CONTRACT REF: SLA-2025-${data.code || '001'}

PARTIES:
1. KEKULAWALA ENTERPRISES (PVT) LTD (Main Contractor)
2. ${data.subcontractorName || 'Subcontractor Name'} (Subcontractor)

1. SCOPE OF WORK:
The Subcontractor agrees to execute ${data.workScope || 'Structural Steel Fabrication & Welding'} for Project ${data.projectRef || 'PRJ-2025-001'}.

2. CONTRACT PRICE & PAYMENT MILESTONES:
Total Subcontract Value: LKR ${(data.contractValue || 0).toLocaleString('en-LK')}.00
• 30% Mobilization
• 50% Milestone Certified Work
• 20% Upon Final Handover

3. DEFECTS LIABILITY PERIOD (DLP):
The Subcontractor shall guarantee all workmanship for a Defects Liability Period of 12 Months from completion date under CIDA Sri Lanka guidelines.

4. SAFETY & COMPLIANCE:
The Subcontractor shall strictly comply with the Factories Ordinance and Sri Lanka Labor Laws regarding worker safety gear and EPF/ETF obligations.

SIGNED BY AUTHORIZED REPRESENTATIVES:`
  })
};
