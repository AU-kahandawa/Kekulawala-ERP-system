// Combined Master Data Store for Kekulawala Unified ERP v5.0

export const DEFAULT_COMPANY_SETTINGS = {
  companyName: "Kekulawala Enterprises (Pvt) Ltd",
  regNumber: "PV-00289143",
  vatNumber: "114892014-7000",
  address: "No. 142/A, Kandy Road, Kurunegala, Sri Lanka",
  phone: "+94 37 223 4567 / +94 77 123 4567",
  email: "info@kekulawalaerp.lk",
  website: "www.kekulawala.lk",
  bankDetails: {
    bankName: "Commercial Bank of Ceylon PLC",
    branch: "Kurunegala Main Branch",
    accountName: "Kekulawala Enterprises (Pvt) Ltd",
    accountNo: "8001049281",
    swiftCode: "CCEYLKCX"
  },
  headerImageUrl: null,
  footerImageUrl: null,
  watermarkImageUrl: null,
  watermarkOpacity: 0.12,
  stampImageUrl: null,
  signatureImageUrl: null
};

export const INITIAL_CLIENTS = [
  { id: 1, name: "Arpico Supercentre", company: "Richard Pieris & Co", contact: "Nimal Perera", phone: "0771122334", email: "nimal@arpico.lk", address: "Hyde Park Corner, Colombo 02", loyalty: "high", totalRevenue: 14500000 },
  { id: 2, name: "Dialog Axiata PLC", company: "Dialog Axiata", contact: "Sunil Silva", phone: "0777998877", email: "sunil.silva@dialog.lk", address: "Union Place, Colombo 02", loyalty: "high", totalRevenue: 28900000 },
  { id: 3, name: "Havelock City Mall", company: "Mireka Homes", contact: "Kamal De Silva", phone: "0714455667", email: "kamal@havelockcity.lk", address: "Havelock Road, Colombo 06", loyalty: "medium", totalRevenue: 8200000 },
  { id: 4, name: "Kandy City Centre", company: "Property Developers PLC", contact: "Anura Bandara", phone: "0812234567", email: "anura@kcc.lk", address: "Dalada Veediya, Kandy", loyalty: "medium", totalRevenue: 5400000 }
];

export const INITIAL_PROJECTS = [
  {
    id: "PRJ-001",
    code: "PRJ-2025-001",
    name: "Arpico Kurunegala Signage & Branding",
    clientId: 1,
    clientName: "Arpico Supercentre",
    quotationRef: "QT-2025-001",
    status: "ongoing",
    quoted: 4500000,
    budget: 3600000,
    actual: 2850000,
    start: "2025-01-15",
    deadline: "2025-04-15",
    priority: "high",
    progress: 72,
    desc: "Complete exterior 4mm ACP cladding, 3D illuminated channel letters, and LED directional pylons.",
    jobCards: [
      { id: "JC-101", title: "ACP Frame Fabrication", status: "completed", assignedTo: "Kamal (Fabricator)", deadline: "2025-02-15" },
      { id: "JC-102", title: "LED Wiring & Transformer Test", status: "ongoing", assignedTo: "Saman (Electrician)", deadline: "2025-03-20" }
    ],
    costs: { labor: 850000, materials: 1650000, tools: 150000, transport: 200000, indirect: 0 }
  },
  {
    id: "PRJ-002",
    code: "PRJ-2025-002",
    name: "Dialog 5G Experience Center LED Wall",
    clientId: 2,
    clientName: "Dialog Axiata PLC",
    quotationRef: "QT-2025-002",
    status: "ongoing",
    quoted: 8200000,
    budget: 6500000,
    actual: 2400000,
    start: "2025-02-01",
    deadline: "2025-05-30",
    priority: "high",
    progress: 35,
    desc: "Indoor P2.5 High Definition LED display wall with custom aluminum truss system.",
    jobCards: [
      { id: "JC-201", title: "Aluminum Truss Erection", status: "completed", assignedTo: "Subcontractor - SteelTech", deadline: "2025-02-28" }
    ],
    costs: { labor: 400000, materials: 1800000, tools: 100000, transport: 100000, indirect: 0 }
  }
];

export const INITIAL_MATERIALS = [
  { id: 1, code: "MAT-001", name: "Aluminum Composite Panel 4mm", grade: "Sheets", qty: 45, uom: "sheets", reorder: 20, minQty: 5, maxQty: 100, rate: 8500, lastRate: 8200, avgRate: 8350, supplier: "Lanwa Panels", location: "Rack A-1", batchNo: "BT-2025-012" },
  { id: 2, code: "MAT-002", name: "Acrylic Sheet 3mm Clear", grade: "Sheets", qty: 30, uom: "sheets", reorder: 15, minQty: 5, maxQty: 80, rate: 4200, lastRate: 4000, avgRate: 4100, supplier: "Sathosa Acrylic", location: "Rack A-2", batchNo: "BT-2025-008" },
  { id: 3, code: "MAT-003", name: "LED Strip Warm White 12V", grade: "Lights", qty: 120, uom: "meters", reorder: 50, minQty: 20, maxQty: 300, rate: 850, lastRate: 820, avgRate: 835, supplier: "LED World", location: "Rack B-1", batchNo: "BT-2025-015" },
  { id: 4, code: "MAT-004", name: "Vinyl Sticker White Gloss", grade: "Sheets", qty: 8, uom: "rolls", reorder: 10, minQty: 3, maxQty: 30, rate: 12000, lastRate: 11500, avgRate: 11750, supplier: "3M Distributor", location: "Rack A-3", batchNo: "BT-2024-098" },
  { id: 5, code: "MAT-005", name: "MS Square Tube 25x25mm", grade: "Steel", qty: 200, uom: "feet", reorder: 100, minQty: 30, maxQty: 500, rate: 320, lastRate: 310, avgRate: 315, supplier: "Steel Corp", location: "Yard-1", batchNo: "BT-2025-001" },
  { id: 6, code: "MAT-006", name: "Enamel Paint White", grade: "Paint", qty: 15, uom: "liters", reorder: 10, minQty: 5, maxQty: 50, rate: 2800, lastRate: 2700, avgRate: 2750, supplier: "Multilac Dealer", location: "Store-B", batchNo: "BT-2025-003" }
];

export const INITIAL_TOOLS = [
  { id: 1, code: "TL-001", name: 'Angle Grinder 4.5"', category: "Power Tools", qty: 3, available: 2, condition: "good", purchaseRate: 45000, purchaseDate: "2023-05-10", depRate: 20, currentValue: 27000, location: "Workshop", lastService: "2025-01-15" },
  { id: 2, code: "TL-002", name: "MIG Welder 200A", category: "Welding Equipment", qty: 2, available: 1, condition: "good", purchaseRate: 185000, purchaseDate: "2022-08-20", depRate: 15, currentValue: 118250, location: "Workshop", assignedProject: "PRJ-2025-001", lastService: "2025-02-10" }
];

export const INITIAL_SUPPLIERS = [
  { id: 1, name: "Lanwa Panels", contact: "Kamal Jayasinghe", phone: "0112456789", email: "sales@lanwa.lk", address: "Sapugaskanda", city: "Colombo", categories: ["Sheets"], rating: 4.5, payTerms: "30 days", reliability: "good", whatsapp: "+94771234567" },
  { id: 2, name: "LED World LK", contact: "Dhanushka Perera", phone: "0112889900", email: "orders@ledworld.lk", address: "First Cross Street", city: "Colombo 11", categories: ["Lights", "Electrical"], rating: 4.8, payTerms: "Cash / 14 days", reliability: "good", whatsapp: "+94778899001" }
];

export const INITIAL_EMPLOYEES = [
  { id: 1, code: "EMP-001", name: "Saman Kumara", desg: "Lead Welder & Fabricator", dept: "Production", pool: "employee", type: "permanent", salary: 95000, phone: "0771234567", epf: "EPF-88912", rating: 4.6, payDue: 0, bankAcc: "7701928301 - ComBank" },
  { id: 2, code: "EMP-002", name: "Sunil Shantha", desg: "Senior Graphic Designer", dept: "Design", pool: "employee", type: "permanent", salary: 110000, phone: "0719876543", epf: "EPF-88913", rating: 4.8, payDue: 0, bankAcc: "8801928302 - Sampath" },
  { id: 3, code: "SC-001", name: "SteelTech Contractors", desg: "Steel Structural Specialist", dept: "External", pool: "subcontractor", type: "contract", salary: 180000, phone: "0755544332", rating: 4.2, payDue: 45000, bankAcc: "1101928303 - HNB" }
];

export const INITIAL_QUOTATIONS = [
  {
    id: "QT-001",
    code: "QT-2025-001",
    date: "2025-03-01",
    validUntil: "2025-04-01",
    clientId: 1,
    clientName: "Arpico Supercentre",
    title: "Arpico Kurunegala Exterior Signage & Cladding",
    status: "approved",
    projectRef: "PRJ-2025-001",
    subtotal: 4000000,
    tax: 500000,
    discount: 0,
    grandTotal: 4500000,
    terms: ["50% advance on order confirmation", "50% upon practical completion", "Validity 30 days"],
    items: [
      { category: "material", description: "Aluminum Composite Panel 4mm PVDF", qty: 250, uom: "sheets", unitRate: 8500, margin: 20, total: 2550000 },
      { category: "material", description: "MS Structural Tube 25x25mm Frame", qty: 1200, uom: "feet", unitRate: 320, margin: 25, total: 480000 },
      { category: "labor", description: "Site Installation & Welding Labor", qty: 10, uom: "days", unitRate: 15000, margin: 30, total: 195000 },
      { category: "transport", description: "Heavy Lorry Transport Kurunegala Site", qty: 4, uom: "trips", unitRate: 12000, margin: 15, total: 55200 }
    ]
  }
];

export const INITIAL_LETTERS = [
  {
    id: "LTR-001",
    code: "LTR-2025-001",
    category: "advance_request",
    clientId: 1,
    clientName: "Arpico Supercentre",
    date: "2025-03-02",
    subject: "Request for Mobilization Advance Payment - Project PRJ-2025-001",
    status: "issued",
    bodyContent: `Dear Sir/Madam,

RE: REQUEST FOR 50% MOBILIZATION ADVANCE PAYMENT (REF: QT-2025-001)

We refer to the formal approval of Quotation Ref: QT-2025-001 for the "Arpico Kurunegala Exterior Signage & Cladding Project".

As per our agreed payment terms, we respectfully request the release of the 50% Mobilization Advance Payment amounting to LKR 2,250,000.00 (Inclusive of taxes).

Kindly credit the funds to our corporate bank account:
• Bank: Commercial Bank of Ceylon PLC
• Account Name: Kekulawala Enterprises (Pvt) Ltd
• Account No: 8001049281
• Branch: Kurunegala Main Branch

Upon receipt of the advance payment, site mobilization and material procurement will commence immediately.

Thanking you.

Yours faithfully,
KEKULAWALA ENTERPRISES (PVT) LTD`
  }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, date: "2025-03-01", type: "income", section: "projects", cat: "Advance Payment", desc: "Arpico Advance Payment - QT-2025-001", amt: 2250000, ref: "REC-2025-001" },
  { id: 2, date: "2025-03-05", type: "expense", section: "procurement", cat: "Material Purchase", desc: "Lanwa ACP Sheets 20 units", amt: 170000, ref: "PO-2025-001" }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    id: 'PO-001', code: 'PO-2025-001', date: '2025-03-05', supplierId: 1, supplierName: 'Lanwa Panels',
    deliveryDate: '2025-03-12', terms: '30 days credit', status: 'received', notes: 'Urgent order',
    items: [
      { description: 'Aluminum Composite Panel 4mm PVDF', qty: 20, uom: 'sheets', unitRate: 8500, total: 170000 }
    ]
  },
  {
    id: 'PO-002', code: 'PO-2025-002', date: '2025-03-10', supplierId: 2, supplierName: 'LED World LK',
    deliveryDate: '2025-03-15', terms: 'Cash', status: 'sent', notes: '',
    items: [
      { description: 'LED Strip Warm White 12V', qty: 50, uom: 'meters', unitRate: 850, total: 42500 },
      { description: 'LED Driver 100W 12V DC', qty: 10, uom: 'units', unitRate: 2200, total: 22000 }
    ]
  }
];

export const INITIAL_TRANSPORTS = [
  {
    id: 'TR-001', date: '2025-03-05', vehicleType: 'Heavy Lorry (10-ton)', vehicleNo: 'WP KV-4567',
    driver: 'Kasun Perera', origin: 'Kekulawala Workshop, Kurunegala', destination: 'Arpico Supercentre, Kurunegala Site',
    projectRef: 'PRJ-2025-001', cargoType: 'Materials (ACP / Sheets)', cargoDesc: 'ACP Panels + MS Frames',
    status: 'delivered', tripCost: 12000, distanceKm: 15, notes: 'AM delivery 7:00'
  },
  {
    id: 'TR-002', date: '2025-03-14', vehicleType: 'Light Lorry', vehicleNo: 'NW BA-8901',
    driver: 'Nimal Rajapaksa', origin: 'LED World LK, Colombo 11', destination: 'Kekulawala Workshop, Kurunegala',
    projectRef: 'PRJ-2025-002', cargoType: 'LED / Electrical', cargoDesc: 'LED Strip rolls & transformers',
    status: 'delivered', tripCost: 8500, distanceKm: 94, notes: ''
  },
  {
    id: 'TR-003', date: '2025-03-15', vehicleType: 'Heavy Lorry (10-ton)', vehicleNo: 'WP KV-4567',
    driver: 'Kasun Perera', origin: 'Kekulawala Workshop, Kurunegala', destination: 'Dialog 5G Center, Colombo 3',
    projectRef: 'PRJ-2025-002', cargoType: 'Finished Signage Boards', cargoDesc: 'LED Panel sections & truss parts',
    status: 'planned', tripCost: 22000, distanceKm: 120, notes: 'Requires crane assistance at site'
  }
];

