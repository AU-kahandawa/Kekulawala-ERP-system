import React, { useState, useEffect, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart
} from "recharts";

// ═══════════════════════════════════════════════════════════════
// KEKULAWALA ERP v4.1 — SYSTEM B: PROCUREMENT & INVENTORY
// Syncs with System A (Business Module)
// ═══════════════════════════════════════════════════════════════

// 🔴 Firebase Config එක මෙතනට දාන්න.
const firebaseConfig = {
  apiKey: "AIzaSyBJ5CTpx5Xw-JSArb0rPjxGsxNJezIgNLc",
  authDomain: "kekulawala-erp.firebaseapp.com",
  projectId: "kekulawala-erp",
  storageBucket: "kekulawala-erp.firebasestorage.app",
  messagingSenderId: "560015673217",
  appId: "1:560015673217:web:da59e652f0bbfcecd84a80"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const C = {
  navy: "#0f172a", blue: "#2563eb", amber: "#f59e0b", green: "#10b981",
  red: "#ef4444", purple: "#8b5cf6", cyan: "#06b6d4", pink: "#ec4899",
  indigo: "#6366f1", orange: "#f97316", teal: "#14b8a6", lime: "#84cc16",
  slatePale: "#f1f5f9", white: "#fff", g50: "#f9fafb", g100: "#f3f4f6",
  g200: "#e5e7eb", g300: "#d1d5db", g500: "#6b7280", g700: "#374151", g900: "#111827"
};

const LKR = (n) => "LKR " + Number(n).toLocaleString("en-LK", { minimumFractionDigits: 0 });
const TODAY = "2025-03-07";
const pct = (a, b) => b > 0 ? Math.round((a / b) * 100) : 0;

// ─── MATERIAL GRADES (12 categories) ──────────────────────
const GRADES = [
  "Sheets", "Paint", "Steel", "Lights", "Electrical",
  "Electronics & Circuits", "Spare Parts", "Timber",
  "Oil & Lubricants", "General", "BMS", "Miscellaneous"
];

const TOOL_CATEGORIES = [
  "Power Tools", "Hand Tools", "Measuring", "Safety Equipment",
  "Welding Equipment", "Cutting Tools", "Painting Equipment", "Lifting Equipment"
];

const PROCUREMENT_STAGES = [
  { id: "urgent", label: "Urgent", color: C.red, icon: "⚡" },
  { id: "low_qty", label: "Low Quantity", color: C.amber, icon: "📦" },
  { id: "medium_qty", label: "Medium Quantity", color: C.blue, icon: "📋" },
  { id: "bulk_urgent", label: "Bulk - Urgent", color: C.red, icon: "🏭" },
  { id: "bulk_routine", label: "Bulk - Routine", color: C.green, icon: "🔄" },
  { id: "bulk_stock", label: "Bulk - Stock Maintain", color: C.teal, icon: "📊" },
  { id: "online_local", label: "Online (SL)", color: C.cyan, icon: "🌐" },
  { id: "online_foreign", label: "Foreign Import", color: C.purple, icon: "✈️" },
];

// ═══════════════════════════════════════════════════════════
// INITIAL DUMMY DATA (Fallback)
// ═══════════════════════════════════════════════════════════
const I_MAT = [
  { id: 1, code: "MAT-001", name: "Aluminum Composite Panel 4mm", grade: "Sheets", qty: 45, uom: "sheets", reorder: 20, minQty: 5, maxQty: 100, rate: 8500, lastRate: 8200, avgRate: 8350, lastDate: "2025-02-10", supplier: "Lanwa Panels", altSuppliers: ["Lanka Aluminum", "Alupanel LK"], movement: "fast", location: "Rack A-1", batchNo: "BT-2025-012", expiry: null, notes: "4mm PVDF coated", priceHistory: [{ date: "2024-09-15", rate: 7800, supplier: "Lanwa Panels", qty: 30 }, { date: "2024-12-01", rate: 8200, supplier: "Lanka Aluminum", qty: 20 }, { date: "2025-02-10", rate: 8500, supplier: "Lanwa Panels", qty: 25 }], monthlyUsage: [30, 25, 35, 20, 40, 28, 32, 22, 38, 30, 35, 45] },
  { id: 2, code: "MAT-002", name: "Acrylic Sheet 3mm Clear", grade: "Sheets", qty: 30, uom: "sheets", reorder: 15, minQty: 5, maxQty: 80, rate: 4200, lastRate: 4000, avgRate: 4100, lastDate: "2025-01-20", supplier: "Sathosa Acrylic", altSuppliers: ["Acrylic World"], movement: "fast", location: "Rack A-2", batchNo: "BT-2025-008", expiry: null, notes: "", priceHistory: [{ date: "2024-10-10", rate: 3800, supplier: "Sathosa Acrylic", qty: 25 }, { date: "2025-01-20", rate: 4000, supplier: "Sathosa Acrylic", qty: 20 }], monthlyUsage: [18, 22, 15, 20, 25, 18, 22, 16, 20, 25, 28, 30] },
  { id: 3, code: "MAT-003", name: "LED Strip Warm White 12V", grade: "Lights", qty: 120, uom: "meters", reorder: 50, minQty: 20, maxQty: 300, rate: 850, lastRate: 820, avgRate: 835, lastDate: "2025-02-15", supplier: "LED World", altSuppliers: ["Bright Solutions", "Colombo LED"], movement: "fast", location: "Rack B-1", batchNo: "BT-2025-015", expiry: "2027-02-15", notes: "IP65 rated", priceHistory: [{ date: "2024-11-05", rate: 800, supplier: "LED World", qty: 100 }, { date: "2025-02-15", rate: 820, supplier: "LED World", qty: 80 }], monthlyUsage: [60, 80, 45, 70, 90, 55, 65, 50, 75, 85, 100, 120] },
  { id: 4, code: "MAT-004", name: "Vinyl Sticker White Gloss", grade: "Sheets", qty: 8, uom: "rolls", reorder: 10, minQty: 3, maxQty: 30, rate: 12000, lastRate: 11500, avgRate: 11750, lastDate: "2025-01-05", supplier: "3M Distributor", altSuppliers: ["Oracal LK", "Avery Dennison"], movement: "fast", location: "Rack A-3", batchNo: "BT-2024-098", expiry: "2026-01-05", notes: "Premium cast vinyl", priceHistory: [{ date: "2024-08-20", rate: 11000, supplier: "3M Distributor", qty: 15 }, { date: "2025-01-05", rate: 11500, supplier: "3M Distributor", qty: 10 }], monthlyUsage: [5, 8, 4, 6, 10, 5, 7, 4, 8, 6, 9, 8] },
  { id: 5, code: "MAT-005", name: "MS Square Tube 25x25mm", grade: "Steel", qty: 200, uom: "feet", reorder: 100, minQty: 30, maxQty: 500, rate: 320, lastRate: 310, avgRate: 315, lastDate: "2025-02-20", supplier: "Steel Corp", altSuppliers: ["Lanka Steel", "Melwa"], movement: "fast", location: "Yard-1", batchNo: "", expiry: null, notes: "1.2mm thickness", priceHistory: [{ date: "2024-12-15", rate: 310, supplier: "Steel Corp", qty: 200 }, { date: "2025-02-20", rate: 320, supplier: "Steel Corp", qty: 150 }], monthlyUsage: [120, 150, 100, 180, 200, 130, 160, 110, 170, 190, 220, 200] },
];

const I_TOOLS = [
  { id: 1, code: "TL-001", name: 'Angle Grinder 4.5"', category: "Power Tools", qty: 3, available: 2, condition: "good", rate: 45000, purchaseDate: "2023-05-10", depRate: 20, currentValue: 27000, location: "Workshop", assignedTo: null, lastService: "2025-01-15", nextService: "2025-04-15", notes: "Bosch GWS 750-100" },
  { id: 2, code: "TL-002", name: "MIG Welder 200A", category: "Welding Equipment", qty: 2, available: 1, condition: "good", rate: 185000, purchaseDate: "2022-08-20", depRate: 15, currentValue: 118250, location: "Workshop", assignedTo: "PRJ-2025-001", lastService: "2025-02-10", nextService: "2025-05-10", notes: "Esab Buddy" },
];

const I_SUPPLIERS = [
  { id: 1, name: "Lanwa Panels", contact: "Kamal Jayasinghe", phone: "0112456789", email: "sales@lanwa.lk", address: "Sapugaskanda", city: "Colombo", categories: ["Sheets"], rating: 4.2, payTerms: "30 days", lastOrder: "2025-02-10", totalBusiness: 2850000, reliability: "good", deliveryTime: "3-5 days", whatsapp: "+94771234567", notes: "Reliable for ACP" },
];

const I_PO = [
  { id: 1, code: "PO-2025-001", date: "2025-03-05", supplier: "Lanwa Panels", status: "approved", stage: "low_qty", items: [{ matId: 1, name: "ACP 4mm", qty: 20, rate: 8500, total: 170000 }], total: 170000, transport: 4500, notes: "Regular restock", delivery: "2025-03-10", payStatus: "pending", project: "Arpico Showroom" },
];

const I_TXN = [
  { id: 1, date: "2025-03-05", type: "expense", section: "procurement", cat: "Material", desc: "ACP Sheets 20 units - Lanwa", amt: 170000, ref: "PO-2025-001", project: "Arpico" },
];

const I_TRANSPORT = [
  { id: 1, date: "2025-03-05", vehicle: "Lorry", from: "Colombo (Lanwa)", to: "Kurunegala Workshop", km: 98, hours: 3, rate: 45, cost: 4500, driver: "Sunil", fuel: 3200, purpose: "Material delivery", po: "PO-2025-001" },
];

const MONTHLY_PROCUREMENT = [
  { month: "Apr", materials: 320000, transport: 15000, tools: 5000, total: 340000 },
  { month: "May", materials: 450000, transport: 22000, tools: 8000, total: 480000 },
  { month: "Jun", materials: 280000, transport: 12000, tools: 0, total: 292000 },
  { month: "Jul", materials: 520000, transport: 28000, tools: 15000, total: 563000 },
  { month: "Aug", materials: 380000, transport: 18000, tools: 3000, total: 401000 },
  { month: "Sep", materials: 490000, transport: 24000, tools: 45000, total: 559000 },
  { month: "Oct", materials: 610000, transport: 32000, tools: 12000, total: 654000 },
  { month: "Nov", materials: 420000, transport: 20000, tools: 0, total: 440000 },
  { month: "Dec", materials: 550000, transport: 26000, tools: 28000, total: 604000 },
  { month: "Jan", materials: 480000, transport: 22000, tools: 6000, total: 508000 },
  { month: "Feb", materials: 435000, transport: 19500, tools: 14500, total: 469000 },
  { month: "Mar", materials: 485000, transport: 15500, tools: 0, total: 500500 },
];

// ═══════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════
const Ic = ({ name, size = 18, color = "currentColor" }) => {
  const paths = {
    dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    inventory: "M20 2H4c-1 0-2 1-2 2v3c0 .7.4 1.3 1 1.7V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.6-.4 1-1 1-1.7V4c0-1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z",
    procurement: "M18 6h-2c0-2.2-1.8-4-4-4S8 3.8 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .6.4 1 1 1s1-.4 1-1V8h4v2c0 .6.4 1 1 1s1-.4 1-1V8h2v12z",
    finance: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
    suppliers: "M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z",
    tools: "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z",
    transport: "M18 18.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zM19.9 8c-.2-.6-.7-1-1.4-1h-3v2h2.5l1.5 4.5H17V9H7V8l2-5h5V1H9.1L7 6.5V8H4.5c-.8 0-1.5.7-1.5 1.5v5c0 .8.7 1.5 1.5 1.5H5c0 1.7 1.3 3 3 3s3-1.3 3-3h2c0 1.7 1.3 3 3 3s3-1.3 3-3h1.5c.8 0 1.5-.7 1.5-1.5v-3.5l-2.1-3zM8 18.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z",
    reports: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
    settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z",
    close: "M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z",
    add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    check: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z",
    menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    search: "M15.5 14h-.8l-.3-.3c1-1.1 1.6-2.6 1.6-4.2C16 5.9 13.1 3 9.5 3S3 5.9 3 9.5 5.9 16 9.5 16c1.6 0 3.1-.6 4.2-1.6l.3.3v.8l5 5L20.5 19l-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z",
    bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z",
    star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.3 5.8 21l1.2-6.8-5-4.9 6.9-1z",
    ai: "M21 11.5a8.4 8.4 0 01-.9 3.8l.9 3.2-3.2-.9a8.4 8.4 0 01-3.8.9c-4.6 0-8.5-3.8-8.5-8.5S10.4 1.5 14 1.5c4.7 0 8.5 3.8 8.5 8.5h-1.5z",
    download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
    edit: "M3 17.2V21h3.8L17.8 10l-3.8-3.8L3 17.2zM20.7 7c.4-.4.4-1 0-1.4l-2.3-2.3c-.4-.4-1-.4-1.4 0l-1.8 1.8 3.8 3.8L20.7 7z",
    whatsapp: "M17.5 14.4c-.3-.2-1.8-.9-2-.1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4S6.9 8.9 6.9 10.4c0 1.5 1.1 2.9 1.2 3.1.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4z",
    alert: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
    sync: "M12 4V1L8 5l4 4V6c3.3 0 6 2.7 6 6 0 1-.3 2-.7 2.8l1.5 1.5c.7-1.2 1.2-2.7 1.2-4.3 0-4.4-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6 0-1 .3-2 .7-2.8L5.2 7.7C4.5 8.9 4 10.4 4 12c0 4.4 3.6 8 8 8v3l4-4-4-4v3z",
    truck: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.7 1.3 3 3 3s3-1.3 3-3h6c0 1.7 1.3 3 3 3s3-1.3 3-3h2v-5l-3-4zM6 18.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z",
    scan: "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z",
    list: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z",
    chart: "M3.5 18.5l6-6 4 4L22 6.9l-1.4-1.4-6.1 7.5-4-4L2 17.6z",
    filter: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}><path d={paths[name] || paths.dashboard} /></svg>;
};

const Badge = ({ status, size = "sm" }) => {
  const m = {
    active: ["#dcfce7", "#166534", "Active"], approved: ["#dcfce7", "#166534", "Approved"],
    delivered: ["#dcfce7", "#166534", "Delivered"], paid: ["#dcfce7", "#166534", "Paid"],
    fast: ["#dcfce7", "#166534", "Fast Moving"], good: ["#dcfce7", "#166534", "Good"],
    excellent: ["#dcfce7", "#166534", "Excellent"], ok: ["#dcfce7", "#166534", "OK"],
    pending: ["#fef3c7", "#92400e", "Pending"], slow: ["#fef3c7", "#92400e", "Slow Moving"],
    average: ["#fef3c7", "#92400e", "Average"], fair: ["#fef3c7", "#92400e", "Fair"],
    processing: ["#dbeafe", "#1e40af", "Processing"], sent: ["#dbeafe", "#1e40af", "Sent"],
    ordered: ["#dbeafe", "#1e40af", "Ordered"],
    urgent: ["#fee2e2", "#991b1b", "Urgent"], critical: ["#fee2e2", "#991b1b", "Critical"],
    low: ["#fee2e2", "#991b1b", "Low"], non: ["#fee2e2", "#991b1b", "Non-Moving"],
    cancelled: ["#fee2e2", "#991b1b", "Cancelled"],
    draft: ["#f3f4f6", "#374151", "Draft"],
    income: ["#dcfce7", "#166534", "Income"], expense: ["#fee2e2", "#991b1b", "Expense"],
    high: ["#fee2e2", "#991b1b", "High"], medium: ["#fef3c7", "#92400e", "Medium"],
  };
  const s = m[status] || ["#f3f4f6", "#374151", status];
  return <span style={{ background: s[0], color: s[1], padding: size === "sm" ? "2px 9px" : "3px 12px", borderRadius: 99, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", display: "inline-block" }}>{s[2]}</span>;
};

const Stat = ({ icon, title, value, sub, color = C.blue, onClick }) => (
  <div onClick={onClick} style={{ background: C.white, borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,.06)", border: "1px solid #e2e8f0", display: "flex", gap: 11, alignItems: "flex-start", cursor: onClick ? "pointer" : "default", transition: "transform .15s" }}>
    <div style={{ width: 38, height: 38, borderRadius: 9, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic name={icon} size={18} color={color} /></div>
    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 10, color: C.g500, fontWeight: 500, textTransform: "uppercase", letterSpacing: .4 }}>{title}</div><div style={{ fontSize: 18, fontWeight: 700, color: C.g900 }}>{value}</div>{sub && <div style={{ fontSize: 10, color: C.g500 }}>{sub}</div>}</div>
  </div>
);

const Toast = ({ msg, type = "success", onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return <div style={{ position: "fixed", top: 14, right: 14, zIndex: 10000, background: type === "success" ? C.green : type === "error" ? C.red : C.amber, color: C.white, padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.2)", display: "flex", alignItems: "center", gap: 6 }}><Ic name="check" size={14} color={C.white} />{msg}</div>;
};

const Modal = ({ title, onClose, children, w = 560 }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)" }} onClick={onClose}>
    <div style={{ background: C.white, borderRadius: 14, width: "95%", maxWidth: w, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }} onClick={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, background: C.white, zIndex: 1, borderRadius: "14px 14px 0 0" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Ic name="close" size={14} color={C.g500} /></button>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  </div>
);

const Fl = ({ label, req, children }) => <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 10, fontWeight: 600, color: C.g700, marginBottom: 4 }}>{label}{req && <span style={{ color: C.red }}> *</span>}</label>{children}</div>;
const iS = { width: "100%", padding: "7px 10px", borderRadius: 7, border: "1px solid #e2e8f0", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const sS = { ...iS, background: C.white };
const bP = { padding: "8px 16px", borderRadius: 8, border: "none", background: C.blue, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer" };
const bS = { ...bP, background: C.white, color: C.g700, border: "1px solid #e2e8f0", fontWeight: 500 };

const Stars = ({ val = 0, max = 5 }) => <span style={{ fontSize: 12 }}>{Array.from({ length: max }, (_, i) => <span key={i} style={{ color: i < Math.round(val) ? C.amber : C.g300 }}>★</span>)}<span style={{ fontSize: 10, color: C.g500, marginLeft: 4 }}>{val.toFixed(1)}</span></span>;

// ═══════════════════════════════════════════════════════════
// PROCUREMENT DASHBOARD
// ═══════════════════════════════════════════════════════════
const ProcurementDashboard = ({ mat, tools, po, txn, suppliers, transport, nav }) => {
  const totalStockValue = mat.reduce((s, m) => s + m.qty * m.rate, 0);
  const toolsValue = tools.reduce((s, t) => s + t.currentValue * t.qty, 0);
  const lowStock = mat.filter((m) => m.qty <= m.reorder);
  const criticalStock = mat.filter((m) => m.qty <= m.minQty);
  const fastMoving = mat.filter((m) => m.movement === "fast");
  const slowMoving = mat.filter((m) => m.movement === "slow");
  const nonMoving = mat.filter((m) => m.movement === "non");
  const pendingPO = po.filter((p) => p.status === "pending");
  
  const monthExpenses = txn.filter((t) => t.type === "expense" && t.date >= "2025-03-01").reduce((s, t) => s + t.amt, 0);
  const lastMonthExpenses = txn.filter((t) => t.type === "expense" && t.date >= "2025-02-01" && t.date < "2025-03-01").reduce((s, t) => s + t.amt, 0);
  const savings = Math.round(lastMonthExpenses * 0.08);

  const gradeData = useMemo(() => {
    const r = {};
    mat.forEach((m) => { r[m.grade] = (r[m.grade] || 0) + m.qty * m.rate; });
    return Object.entries(r).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [mat]);

  const supplierSpend = useMemo(() => {
    const r = {};
    po.forEach((p) => { r[p.supplier] = (r[p.supplier] || 0) + p.total; });
    return Object.entries(r).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [po]);

  const cols = [C.blue, C.amber, C.red, C.purple, C.green, C.cyan, C.pink, C.orange, C.teal, C.indigo, C.lime];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
        <Stat icon="inventory" title="Total Stock Value" value={LKR(totalStockValue)} sub={`${mat.length} items`} color={C.blue} onClick={() => nav("materials")} />
        <Stat icon="tools" title="Tools & Equipment" value={LKR(toolsValue)} sub={`${tools.length} items`} color={C.purple} onClick={() => nav("tools")} />
        <Stat icon="alert" title="Low Stock Alerts" value={lowStock.length} sub={criticalStock.length > 0 ? `${criticalStock.length} critical!` : "Monitor levels"} color={lowStock.length > 0 ? C.red : C.green} onClick={() => nav("materials")} />
        <Stat icon="procurement" title="Pending Orders" value={pendingPO.length} sub={`${po.length} total POs`} color={C.amber} onClick={() => nav("orders")} />
        <Stat icon="finance" title="This Month Spend" value={LKR(monthExpenses)} sub={`Last: ${LKR(lastMonthExpenses)}`} color={C.red} onClick={() => nav("finance")} />
        <Stat icon="chart" title="Savings (Est.)" value={LKR(savings)} sub="Via procurement optimization" color={C.green} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 12 }}>
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: C.g700, marginBottom: 10 }}>Monthly Procurement Spend (FY)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={MONTHLY_PROCUREMENT}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => (v / 1e6).toFixed(1) + "M"} />
              <Tooltip formatter={(v) => LKR(v)} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Bar dataKey="materials" fill={C.blue} name="Materials" stackId="a" barSize={16} />
              <Bar dataKey="transport" fill={C.amber} name="Transport" stackId="a" barSize={16} />
              <Bar dataKey="tools" fill={C.purple} name="Tools" stackId="a" barSize={16} />
              <Line type="monotone" dataKey="total" stroke={C.red} strokeWidth={2} dot={{ r: 3 }} name="Total" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: C.g700, marginBottom: 10 }}>Stock Value by Grade</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={gradeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, percent }) => name.substring(0, 8) + " " + (percent * 100).toFixed(0) + "%"}>
                {gradeData.map((_, i) => <Cell key={i} fill={cols[i % cols.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => LKR(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movement Summary + Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Stock Movement Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Fast Moving", count: fastMoving.length, color: C.green, value: fastMoving.reduce((s, m) => s + m.qty * m.rate, 0) },
              { label: "Slow Moving", count: slowMoving.length, color: C.amber, value: slowMoving.reduce((s, m) => s + m.qty * m.rate, 0) },
              { label: "Non-Moving", count: nonMoving.length, color: C.red, value: nonMoving.reduce((s, m) => s + m.qty * m.rate, 0) },
            ].map(s => (
              <div key={s.label} style={{ padding: 12, borderRadius: 8, background: s.color + "10", border: `1px solid ${s.color}30`, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: 10, color: C.g500, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 9, color: C.g500 }}>{LKR(s.value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MATERIALS VIEW
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// MATERIALS VIEW
// ═══════════════════════════════════════════════════════════
const MaterialsView = ({ mat, setMat, toast }) => {
  const [grade, setGrade] = useState("all");
  const [movement, setMovement] = useState("all");
  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fm, setFm] = useState({ name: "", code: "", grade: "General", qty: "", uom: "pcs", reorder: "", minQty: "", maxQty: "", rate: "", supplier: "", location: "", notes: "" });

  const filtered = mat.filter((m) => {
    const mg = grade === "all" || m.grade === grade;
    const mm = movement === "all" || m.movement === movement;
    const mq = !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.code?.toLowerCase().includes(q.toLowerCase());
    return mg && mm && mq;
  });

  const totalValue = filtered.reduce((s, m) => s + m.qty * m.rate, 0);

  const openAdd = () => {
    setFm({ name: "", code: "", grade: "General", qty: "", uom: "pcs", reorder: "", minQty: "", maxQty: "", rate: "", supplier: "", location: "", notes: "" });
    setEditId(null);
    setShowAdd(true);
  };

  const openEdit = (m) => {
    setFm({ ...m });
    setEditId(m.id);
    setShowAdd(true);
  };

  // 🔴 Firebase එකට අලුත් දත්ත Save කරන සහ Edit කරන කොටස
  const saveMat = async () => {
    if (!fm.name || !fm.qty || !fm.rate) return toast("Fill required fields", "error");
    
    const mData = {
      code: fm.code || "MAT-" + String(mat.length + 1).padStart(3, "0"),
      name: fm.name, grade: fm.grade, qty: Number(fm.qty), uom: fm.uom,
      reorder: Number(fm.reorder) || 10, minQty: Number(fm.minQty) || 2,
      maxQty: Number(fm.maxQty) || 100, rate: Number(fm.rate),
      lastRate: fm.lastRate || null, avgRate: fm.avgRate || Number(fm.rate), lastDate: fm.lastDate || TODAY,
      supplier: fm.supplier, movement: fm.movement || "slow",
      location: fm.location || "TBD", notes: fm.notes
    };

    if (db) {
      setLoading(true);
      try {
        if (editId && typeof editId === "string" && !editId.startsWith("temp_")) {
          // Edit (Update) කරනවා නම් මේක වැඩ කරන්නේ
          await updateDoc(doc(db, "materials", editId), mData);
          setMat(p => p.map(x => x.id === editId ? { id: editId, ...mData } : x));
          if (selected && selected.id === editId) setSelected({ id: editId, ...mData });
          toast("Material updated successfully!");
        } else {
          // අලුතින් Add කරනවා නම් මේක වැඩ කරන්නේ
          const docRef = await addDoc(collection(db, "materials"), mData);
          setMat(p => [{ id: docRef.id, ...mData }, ...p]);
          toast("Material added successfully!");
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        toast("Database Error", "error");
      }
      setLoading(false);
    } else {
      if (editId) {
        setMat(p => p.map(x => x.id === editId ? { id: editId, ...mData } : x));
        if (selected && selected.id === editId) setSelected({ id: editId, ...mData });
        toast("Material updated (Local)");
      } else {
        setMat(p => [{ id: `temp_${Date.now()}`, ...mData }, ...p]);
        toast("Material added (Local)");
      }
    }
    setShowAdd(false);
  };

  // 🔴 Firebase එකෙන් දත්ත මකා දමන (Delete) කොටස
  const deleteMat = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    if (db && typeof id === "string" && !id.startsWith("temp_")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "materials", id));
        setMat(p => p.filter(m => m.id !== id));
        setSelected(null);
        toast("Material deleted!");
      } catch (e) {
        console.error("Delete Error:", e);
        toast("Error deleting", "error");
      }
      setLoading(false);
    } else {
      setMat(p => p.filter(m => m.id !== id));
      setSelected(null);
      toast("Deleted (Local)");
    }
  };

  return (
    <div>
      {selected ? (
        <MaterialDetail m={selected} onBack={() => setSelected(null)} onEdit={() => openEdit(selected)} onDelete={() => deleteMat(selected.id)} />
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, marginBottom: 12 }}>
            <Stat icon="inventory" title="Showing" value={filtered.length + " items"} color={C.blue} />
            <Stat icon="finance" title="Total Value" value={LKR(totalValue)} color={C.green} />
            <Stat icon="alert" title="Below Reorder" value={mat.filter((m) => m.qty <= m.reorder).length} color={C.red} />
            <Stat icon="chart" title="Avg Item Value" value={LKR(filtered.length > 0 ? Math.round(totalValue / filtered.length) : 0)} color={C.purple} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}><Ic name="search" size={13} color={C.g500} /></span>
                <input placeholder="Search materials..." value={q} onChange={(e) => setQ(e.target.value)} style={{ ...iS, width: 180, paddingLeft: 28 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={openAdd} style={{ ...bP, padding: "5px 12px", fontSize: 10, display: "flex", alignItems: "center", gap: 3 }}><Ic name="add" size={12} color={C.white} /> Add Material</button>
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: 10, overflow: "auto", border: "1px solid #e2e8f0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 900 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["#", "Code", "Name", "Grade", "Location", "Qty", "UOM", "Reorder", "Rate", "Value", "Supplier", "Movement", "Status"].map(h =>
                    <th key={h} style={{ textAlign: "left", padding: "7px 5px", fontSize: 9, color: C.g500, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const ss = m.qty <= m.minQty ? "critical" : m.qty <= m.reorder ? "low" : m.qty >= m.maxQty * 0.9 ? "overstocked" : "ok";
                  return (
                    <tr key={m.id} onClick={() => setSelected(m)} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}>
                      <td style={{ padding: "6px", color: C.g500 }}>{i + 1}</td>
                      <td style={{ padding: "6px", fontFamily: "monospace", fontSize: 10 }}>{m.code}</td>
                      <td style={{ padding: "6px", fontWeight: 500 }}>{m.name}</td>
                      <td style={{ padding: "6px" }}><span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "#eff6ff", color: C.blue }}>{m.grade}</span></td>
                      <td style={{ padding: "6px", fontSize: 10, color: C.g500 }}>{m.location}</td>
                      <td style={{ padding: "6px", fontWeight: 600, color: ss === "critical" ? C.red : ss === "low" ? C.amber : C.g900 }}>{m.qty}</td>
                      <td style={{ padding: "6px", color: C.g500, fontSize: 10 }}>{m.uom}</td>
                      <td style={{ padding: "6px", color: C.g500 }}>{m.reorder}</td>
                      <td style={{ padding: "6px" }}>{LKR(m.rate)}</td>
                      <td style={{ padding: "6px", fontWeight: 500 }}>{LKR(m.qty * m.rate)}</td>
                      <td style={{ padding: "6px", fontSize: 10, color: C.g500 }}>{m.supplier}</td>
                      <td style={{ padding: "6px" }}><Badge status={m.movement || 'slow'} /></td>
                      <td style={{ padding: "6px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 6px", borderRadius: 99, fontSize: 9, fontWeight: 600, background: ss === "critical" ? "#fee2e2" : ss === "low" ? "#fef3c7" : ss === "overstocked" ? "#dbeafe" : "#dcfce7", color: ss === "critical" ? "#991b1b" : ss === "low" ? "#92400e" : ss === "overstocked" ? "#1e40af" : "#166534" }}>
                          {ss === "critical" ? "Critical" : ss === "low" ? "Low" : ss === "overstocked" ? "Overstock" : "OK"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showAdd && (
            <Modal title={editId ? "Edit Material" : "Add Material"} onClose={() => setShowAdd(false)} w={600}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
                <Fl label="Material Name" req><input value={fm.name} onChange={(e) => setFm((f) => ({ ...f, name: e.target.value }))} style={iS} /></Fl>
                <Fl label="Item Code"><input value={fm.code} onChange={(e) => setFm((f) => ({ ...f, code: e.target.value }))} style={iS} placeholder="Auto-gen" disabled={!!editId} /></Fl>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <Fl label="Grade" req><select value={fm.grade} onChange={(e) => setFm((f) => ({ ...f, grade: e.target.value }))} style={sS}>{GRADES.map(g => <option key={g}>{g}</option>)}</select></Fl>
                <Fl label="UOM"><select value={fm.uom} onChange={(e) => setFm((f) => ({ ...f, uom: e.target.value }))} style={sS}>{["pcs", "sheets", "meters", "rolls", "feet", "liters", "tubes", "kg", "sets"].map(u => <option key={u}>{u}</option>)}</select></Fl>
                <Fl label="Location"><input value={fm.location} onChange={(e) => setFm((f) => ({ ...f, location: e.target.value }))} style={iS} placeholder="Rack A-1" /></Fl>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                <Fl label="Qty" req><input type="number" value={fm.qty} onChange={(e) => setFm((f) => ({ ...f, qty: e.target.value }))} style={iS} /></Fl>
                <Fl label="Reorder"><input type="number" value={fm.reorder} onChange={(e) => setFm((f) => ({ ...f, reorder: e.target.value }))} style={iS} /></Fl>
                <Fl label="Min Qty"><input type="number" value={fm.minQty} onChange={(e) => setFm((f) => ({ ...f, minQty: e.target.value }))} style={iS} /></Fl>
                <Fl label="Max Qty"><input type="number" value={fm.maxQty} onChange={(e) => setFm((f) => ({ ...f, maxQty: e.target.value }))} style={iS} /></Fl>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Fl label="Rate (LKR)" req><input type="number" value={fm.rate} onChange={(e) => setFm((f) => ({ ...f, rate: e.target.value }))} style={iS} /></Fl>
                <Fl label="Primary Supplier"><input value={fm.supplier} onChange={(e) => setFm((f) => ({ ...f, supplier: e.target.value }))} style={iS} /></Fl>
              </div>
              <Fl label="Notes"><textarea value={fm.notes} onChange={(e) => setFm((f) => ({ ...f, notes: e.target.value }))} style={{ ...iS, height: 40 }} /></Fl>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                <button onClick={() => setShowAdd(false)} style={bS} disabled={loading}>Cancel</button>
                <button onClick={saveMat} style={bP} disabled={loading}>{loading ? "Saving..." : (editId ? "Update Material" : "Add Material")}</button>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

// ─── MATERIAL DETAIL ───────────────────────────────────────
const MaterialDetail = ({ m, onBack, onEdit, onDelete }) => {
  const ss = m.qty <= m.minQty ? "critical" : m.qty <= m.reorder ? "low" : "ok";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={onBack} style={{ border: "none", background: "none", color: C.blue, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
           ← Back to Materials
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={onEdit} style={{ border: "1px solid #e2e8f0", background: C.white, color: C.g700, padding: "5px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
             Edit
          </button>
          <button onClick={onDelete} style={{ border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", padding: "5px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
             Delete
          </button>
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: C.g500, fontFamily: "monospace" }}>{m.code}</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "2px 0" }}>{m.name}</h2>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "#eff6ff", color: C.blue }}>{m.grade}</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8, marginBottom: 14 }}>
        {[
          { l: "Current Stock", v: `${m.qty} ${m.uom}`, c: ss === "critical" ? C.red : ss === "low" ? C.amber : C.green },
          { l: "Unit Rate", v: LKR(m.rate), c: C.blue },
          { l: "Stock Value", v: LKR(m.qty * m.rate), c: C.purple },
          { l: "Reorder Level", v: `${m.reorder} ${m.uom}`, c: C.amber },
        ].map(x => (
          <div key={x.l} style={{ background: C.white, borderRadius: 9, padding: 12, border: "1px solid #e2e8f0", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.g500, textTransform: "uppercase", marginBottom: 3 }}>{x.l}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: x.c }}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TOOLS VIEW
// ═══════════════════════════════════════════════════════════
const ToolsView = ({ tools, setTools, toast }) => {
  const [cat, setCat] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fm, setFm] = useState({ name: "", category: "Power Tools", qty: "1", rate: "", notes: "" });

  const filtered = cat === "all" ? tools : tools.filter((t) => t.category === cat);
  const totalValue = tools.reduce((s, t) => s + t.currentValue * t.qty, 0);
  const assigned = tools.filter((t) => t.assignedTo);
  const needService = tools.filter((t) => t.nextService && t.nextService <= "2025-04-07");

  const openAdd = () => {
    setFm({ name: "", category: "Power Tools", qty: "1", rate: "", notes: "" });
    setEditId(null);
    setShowAdd(true);
  };

  const openEdit = (t) => {
    setFm({ ...t });
    setEditId(t.id);
    setShowAdd(true);
  };

  // 🔴 Firebase එකට දත්ත Save/Edit කරන කොටස
  const saveTool = async () => {
    if (!fm.name || !fm.rate) return toast("Fill fields", "error");
    const tData = {
      code: fm.code || "TL-" + String(tools.length + 1).padStart(3, "0"),
      name: fm.name, category: fm.category, qty: Number(fm.qty) || 1,
      available: fm.available || Number(fm.qty) || 1, condition: fm.condition || "good", rate: Number(fm.rate),
      purchaseDate: fm.purchaseDate || TODAY, depRate: fm.depRate || 20, currentValue: Number(fm.rate),
      location: fm.location || "Workshop", assignedTo: fm.assignedTo || null, lastService: fm.lastService || null,
      nextService: fm.nextService || null, notes: fm.notes
    };

    if (db) {
      setLoading(true);
      try {
        if (editId && typeof editId === "string" && !editId.startsWith("temp_")) {
          await updateDoc(doc(db, "tools", editId), tData);
          setTools(p => p.map(x => x.id === editId ? { id: editId, ...tData } : x));
          toast("Tool updated successfully!");
        } else {
          const docRef = await addDoc(collection(db, "tools"), tData);
          setTools((p) => [{ id: docRef.id, ...tData }, ...p]);
          toast("Tool saved to Firebase successfully!");
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        toast("Database Error: Could not save", "error");
      }
      setLoading(false);
    } else {
      if (editId) {
        setTools(p => p.map(x => x.id === editId ? { id: editId, ...tData } : x));
        toast("Tool updated (Local)");
      } else {
        setTools((p) => [{ id: `temp_${Date.now()}`, ...tData }, ...p]);
        toast("Tool added (Local)");
      }
    }
    setShowAdd(false);
  };

  // 🔴 Firebase එකෙන් දත්ත මකා දමන (Delete) කොටස
  const deleteTool = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) return;
    if (db && typeof id === "string" && !id.startsWith("temp_")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "tools", id));
        setTools(p => p.filter(t => t.id !== id));
        toast("Tool deleted!");
      } catch (e) {
        console.error("Delete Error:", e);
        toast("Error deleting", "error");
      }
      setLoading(false);
    } else {
      setTools(p => p.filter(t => t.id !== id));
      toast("Deleted (Local)");
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, marginBottom: 12 }}>
        <Stat icon="tools" title="Total Tools" value={tools.length} sub={`${tools.reduce((s, t) => s + t.qty, 0)} units`} color={C.blue} />
        <Stat icon="finance" title="Total Value" value={LKR(totalValue)} sub="Current depreciated" color={C.green} />
        <Stat icon="procurement" title="Assigned" value={assigned.length} sub="Currently in use" color={C.amber} />
        <Stat icon="alert" title="Service Due" value={needService.length} sub={needService.length > 0 ? "Within 30 days" : "All OK"} color={needService.length > 0 ? C.red : C.green} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <button onClick={() => setCat("all")} style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid", borderColor: cat === "all" ? C.blue : "#e2e8f0", background: cat === "all" ? C.blue : C.white, color: cat === "all" ? C.white : C.g700, fontSize: 9, cursor: "pointer" }}>All</button>
          {TOOL_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid", borderColor: cat === c ? C.blue : "#e2e8f0", background: cat === c ? C.blue : C.white, color: cat === c ? C.white : C.g700, fontSize: 9, cursor: "pointer" }}>{c}</button>
          ))}
        </div>
        <button onClick={openAdd} style={{ ...bP, padding: "5px 12px", fontSize: 10 }}>+ Add Tool</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
        {filtered.map((t) => {
          const depPct = Math.round(((t.rate - t.currentValue) / t.rate) * 100) || 0;
          return (
            <div key={t.id} style={{ background: C.white, borderRadius: 12, padding: 14, border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: C.g500 }}>{t.code}</span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <Badge status={t.condition} />
                  {t.assignedTo && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "#fef3c7", color: "#92400e" }}>In Use</span>}
                  
                  {/* Edit සහ Delete Buttons */}
                  <button onClick={() => openEdit(t)} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, padding: "0 2px", marginLeft: 4 }}><Ic name="edit" size={12} /></button>
                  <button onClick={() => deleteTool(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: "0 2px", fontWeight: "bold" }}>✖</button>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 1 }}>{t.name}</div>
              <div style={{ fontSize: 10, color: C.g500, marginBottom: 6 }}>{t.category} · {t.location}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 6 }}>
                <div style={{ fontSize: 10 }}><span style={{ color: C.g500 }}>Qty: </span><span style={{ fontWeight: 600 }}>{t.qty}</span></div>
                <div style={{ fontSize: 10 }}><span style={{ color: C.g500 }}>Avail: </span><span style={{ fontWeight: 600, color: t.available > 0 ? C.green : C.red }}>{t.available}</span></div>
                <div style={{ fontSize: 10 }}><span style={{ color: C.g500 }}>Value: </span><span style={{ fontWeight: 500 }}>{LKR(t.currentValue)}</span></div>
              </div>
              <div style={{ fontSize: 9, color: C.g500, marginBottom: 2 }}>Depreciation: {depPct}% ({t.depRate}%/yr)</div>
              <div style={{ height: 4, borderRadius: 2, background: "#f1f5f9" }}>
                <div style={{ height: "100%", width: depPct + "%", background: depPct > 70 ? C.red : depPct > 40 ? C.amber : C.green, borderRadius: 2 }} />
              </div>
              {t.assignedTo && <div style={{ marginTop: 6, fontSize: 10, color: C.blue }}>Assigned: {t.assignedTo}</div>}
              {t.nextService && <div style={{ marginTop: 2, fontSize: 10, color: t.nextService <= "2025-04-07" ? C.red : C.g500 }}>Next Service: {t.nextService}</div>}
            </div>
          );
        })}
      </div>

      {showAdd && (
        <Modal title={editId ? "Edit Tool" : "Add Tool / Equipment"} onClose={() => setShowAdd(false)} w={480}>
          <Fl label="Name" req><input value={fm.name} onChange={(e) => setFm((f) => ({ ...f, name: e.target.value }))} style={iS} /></Fl>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Fl label="Category"><select value={fm.category} onChange={(e) => setFm((f) => ({ ...f, category: e.target.value }))} style={sS}>{TOOL_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Fl>
            <Fl label="Qty"><input type="number" value={fm.qty} onChange={(e) => setFm((f) => ({ ...f, qty: e.target.value }))} style={iS} /></Fl>
          </div>
          <Fl label="Purchase Price (LKR)" req><input type="number" value={fm.rate} onChange={(e) => setFm((f) => ({ ...f, rate: e.target.value }))} style={iS} /></Fl>
          <Fl label="Notes"><textarea value={fm.notes} onChange={(e) => setFm((f) => ({ ...f, notes: e.target.value }))} style={{ ...iS, height: 40 }} /></Fl>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button onClick={() => setShowAdd(false)} style={bS} disabled={loading}>Cancel</button>
            <button onClick={saveTool} style={bP} disabled={loading}>{loading ? "Saving..." : (editId ? "Update Tool" : "Add Tool")}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SUPPLIERS VIEW
// ═══════════════════════════════════════════════════════════
const SuppliersView = ({ suppliers, setSuppliers, toast }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [fm, setFm] = useState({ name: "", contact: "", phone: "", email: "", address: "", city: "", categories: "", payTerms: "COD", whatsapp: "", notes: "" });

  const filtered = suppliers.filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.city?.toLowerCase().includes(q.toLowerCase()));

  const openAdd = () => {
    setFm({ name: "", contact: "", phone: "", email: "", address: "", city: "", categories: "", payTerms: "COD", whatsapp: "", notes: "" });
    setEditId(null);
    setShowAdd(true);
  };

  const openEdit = (s) => {
    setFm({ ...s, categories: Array.isArray(s.categories) ? s.categories.join(", ") : s.categories });
    setEditId(s.id);
    setShowAdd(true);
  };

  // 🔴 Firebase එකට දත්ත Save/Edit කරන කොටස
  const saveSupplier = async () => {
    if (!fm.name) return toast("Enter supplier name", "error");
    const sData = {
      name: fm.name, contact: fm.contact, phone: fm.phone,
      email: fm.email, address: fm.address, city: fm.city,
      categories: fm.categories ? (typeof fm.categories === 'string' ? fm.categories.split(",").map((c) => c.trim()) : fm.categories) : [],
      rating: fm.rating || 0, payTerms: fm.payTerms, lastOrder: fm.lastOrder || null, totalBusiness: fm.totalBusiness || 0,
      reliability: fm.reliability || "average", deliveryTime: fm.deliveryTime || "TBD", whatsapp: fm.whatsapp, notes: fm.notes
    };

    if (db) {
      setLoading(true);
      try {
        if (editId && typeof editId === "string" && !editId.startsWith("temp_")) {
          await updateDoc(doc(db, "suppliers", editId), sData);
          setSuppliers(p => p.map(x => x.id === editId ? { id: editId, ...sData } : x));
          toast("Supplier updated successfully!");
        } else {
          const docRef = await addDoc(collection(db, "suppliers"), sData);
          setSuppliers((p) => [{ id: docRef.id, ...sData }, ...p]);
          toast("Supplier saved to Firebase successfully!");
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        toast("Database Error: Could not save", "error");
      }
      setLoading(false);
    } else {
      if (editId) {
        setSuppliers(p => p.map(x => x.id === editId ? { id: editId, ...sData } : x));
        toast("Supplier updated (Local)");
      } else {
        setSuppliers((p) => [{ id: `temp_${Date.now()}`, ...sData }, ...p]);
        toast("Supplier added (Local)");
      }
    }
    setShowAdd(false);
  };

  // 🔴 Firebase එකෙන් දත්ත මකා දමන (Delete) කොටස
  const deleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    if (db && typeof id === "string" && !id.startsWith("temp_")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "suppliers", id));
        setSuppliers(p => p.filter(s => s.id !== id));
        toast("Supplier deleted!");
      } catch (e) {
        console.error("Delete Error:", e);
        toast("Error deleting", "error");
      }
      setLoading(false);
    } else {
      setSuppliers(p => p.filter(s => s.id !== id));
      toast("Deleted (Local)");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}><Ic name="search" size={13} color={C.g500} /></span>
          <input placeholder="Search suppliers..." value={q} onChange={(e) => setQ(e.target.value)} style={{ ...iS, width: 200, paddingLeft: 28 }} />
        </div>
        <button onClick={openAdd} style={{ ...bP, fontSize: 10, display: "flex", alignItems: "center", gap: 3 }}><Ic name="add" size={12} color={C.white} /> Add Supplier</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
        {filtered.map((s) => (
          <div key={s.id} style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: C.g500 }}>{s.contact} · {s.city}</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => openEdit(s)} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, padding: "0 2px" }}><Ic name="edit" size={12} /></button>
                <button onClick={() => deleteSupplier(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: "0 2px", fontWeight: "bold" }}>✖</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 8 }}>
              <div style={{ fontSize: 10 }}><span style={{ color: C.g500 }}>Phone: </span>{s.phone}</div>
              <div style={{ fontSize: 10 }}><span style={{ color: C.g500 }}>Terms: </span>{s.payTerms}</div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title={editId ? "Edit Supplier" : "Add Supplier"} onClose={() => setShowAdd(false)} w={520}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Fl label="Supplier Name" req><input value={fm.name} onChange={(e) => setFm((f) => ({ ...f, name: e.target.value }))} style={iS} /></Fl>
            <Fl label="Contact Person"><input value={fm.contact} onChange={(e) => setFm((f) => ({ ...f, contact: e.target.value }))} style={iS} /></Fl>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Fl label="Phone"><input value={fm.phone} onChange={(e) => setFm((f) => ({ ...f, phone: e.target.value }))} style={iS} /></Fl>
            <Fl label="City"><input value={fm.city} onChange={(e) => setFm((f) => ({ ...f, city: e.target.value }))} style={iS} /></Fl>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Fl label="Pay Terms">
              <select value={fm.payTerms} onChange={(e) => setFm((f) => ({ ...f, payTerms: e.target.value }))} style={sS}>
                <option>COD</option>
                <option>7 Days</option>
                <option>14 Days</option>
                <option>30 Days</option>
              </select>
            </Fl>
            <Fl label="Categories (comma separated)"><input value={fm.categories} onChange={(e) => setFm((f) => ({ ...f, categories: e.target.value }))} style={iS} placeholder="Steel, Paint, Sheets" /></Fl>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button onClick={() => setShowAdd(false)} style={bS} disabled={loading}>Cancel</button>
            <button onClick={saveSupplier} style={bP} disabled={loading}>{loading ? "Saving..." : (editId ? "Update Supplier" : "Add Supplier")}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PURCHASE ORDERS VIEW
// ═══════════════════════════════════════════════════════════
const OrdersView = ({ po, setPo, mat, suppliers, toast }) => {
  const [sf, setSf] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fm, setFm] = useState({ supplier: "", stage: "low_qty", items: [{ matId: "", qty: "", rate: "" }], transport: "", notes: "", project: "", delivery: "", status: "pending" });

  const filtered = sf === "all" ? po : po.filter((p) => p.status === sf);
  const totalPending = po.filter((p) => p.payStatus === "pending").reduce((s, p) => s + p.total + (p.transport || 0), 0);

  const openAdd = () => {
    setFm({ supplier: "", stage: "low_qty", items: [{ matId: "", qty: "", rate: "" }], transport: "", notes: "", project: "", delivery: "", status: "pending" });
    setEditId(null);
    setShowAdd(true);
  };

  const openEdit = (p) => {
    setFm({ ...p, items: p.items && p.items.length ? [...p.items] : [{ matId: "", qty: "", rate: "" }] });
    setEditId(p.id);
    setShowAdd(true);
  };

  const addItem = () => setFm((f) => ({ ...f, items: [...f.items, { matId: "", qty: "", rate: "" }] }));

  const updateItem = (idx, key, val) => {
    setFm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: val };
      if (key === "matId" && val) {
        const m = mat.find((x) => x.id === val);
        if (m) items[idx].rate = String(m.rate);
      }
      return { ...f, items };
    });
  };

  const removeItem = (idx) => {
    setFm((f) => {
      const items = f.items.filter((_, i) => i !== idx);
      return { ...f, items: items.length ? items : [{ matId: "", qty: "", rate: "" }] };
    });
  };

  // 🔴 Firebase එකට දත්ත Save/Edit කරන කොටස
  const savePO = async () => {
    if (!fm.supplier || fm.items.every((i) => !i.matId)) return toast("Select supplier and items", "error");
    
    const items = fm.items.filter((i) => i.matId).map((i) => {
      const m = mat.find((x) => x.id === i.matId);
      return { matId: i.matId, name: m?.name || "", qty: Number(i.qty), rate: Number(i.rate), total: Number(i.qty) * Number(i.rate) };
    });
    
    const total = items.reduce((s, i) => s + i.total, 0);
    
    const pData = {
      code: fm.code || "PO-2025-" + String(po.length + 1).padStart(3, "0"),
      date: fm.date || TODAY, supplier: fm.supplier, status: fm.status || "pending", stage: fm.stage,
      items, total, transport: Number(fm.transport) || 0,
      notes: fm.notes, delivery: fm.delivery, payStatus: fm.payStatus || "pending", project: fm.project
    };

    if (db) {
      setLoading(true);
      try {
        if (editId && typeof editId === "string" && !editId.startsWith("temp_")) {
          await updateDoc(doc(db, "po", editId), pData);
          setPo(p => p.map(x => x.id === editId ? { id: editId, ...pData } : x));
          toast("Purchase Order updated successfully!");
        } else {
          const docRef = await addDoc(collection(db, "po"), pData);
          setPo((p) => [{ id: docRef.id, ...pData }, ...p]);
          toast("Purchase Order saved to Firebase!");
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        toast("Database Error: Could not save PO", "error");
      }
      setLoading(false);
    } else {
      if (editId) {
        setPo(p => p.map(x => x.id === editId ? { id: editId, ...pData } : x));
        toast("PO updated (Local)");
      } else {
        setPo((p) => [{ id: `temp_${Date.now()}`, ...pData }, ...p]);
        toast("PO created (Local)");
      }
    }

    setShowAdd(false);
  };

  // 🔴 Firebase එකෙන් දත්ත මකා දමන (Delete) කොටස
  const deletePO = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Purchase Order?")) return;
    if (db && typeof id === "string" && !id.startsWith("temp_")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "po", id));
        setPo(p => p.filter(x => x.id !== id));
        toast("Purchase Order deleted!");
      } catch (e) {
        console.error("Delete Error:", e);
        toast("Error deleting", "error");
      }
      setLoading(false);
    } else {
      setPo(p => p.filter(x => x.id !== id));
      toast("Deleted (Local)");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", gap: 3 }}>
          {["all", "pending", "approved", "delivered", "cancelled"].map(s => (
            <button key={s} onClick={() => setSf(s)} style={{ padding: "3px 9px", borderRadius: 6, border: "1px solid", borderColor: sf === s ? C.blue : "#e2e8f0", background: sf === s ? C.blue : C.white, color: sf === s ? C.white : C.g700, fontSize: 10, cursor: "pointer" }}>
              {s === "all" ? `All (${po.length})` : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={openAdd} style={{ ...bP, fontSize: 10, display: "flex", alignItems: "center", gap: 3 }}><Ic name="add" size={12} color={C.white} /> New PO</button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {filtered.map((p) => (
          <div key={p.id} style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
              <div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600 }}>{p.code}</span>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <Badge status={p.status} />
                    <button onClick={() => openEdit(p)} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, padding: "0 2px", marginLeft: 4 }}><Ic name="edit" size={12} /></button>
                    <button onClick={() => deletePO(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: "0 2px", fontWeight: "bold" }}>✖</button>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>{p.supplier}</div>
                <div style={{ fontSize: 10, color: C.g500 }}>{p.date} · Delivery: {p.delivery || "TBD"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{LKR(p.total)}</div>
              </div>
            </div>
            {p.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f8fafc", fontSize: 10 }}>
                <span>{item.name}</span>
                <span>{item.qty} × {LKR(item.rate)} = <strong>{LKR(item.total)}</strong></span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title={editId ? "Edit Purchase Order" : "Create Purchase Order"} onClose={() => setShowAdd(false)} w={650}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Fl label="Supplier" req>
               {/* Dropdown එකෙන් Supplier තෝරන්නත් පුළුවන් */}
               <select value={fm.supplier} onChange={(e) => setFm((f) => ({ ...f, supplier: e.target.value }))} style={sS}>
                 <option value="">Select Supplier...</option>
                 {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
               </select>
            </Fl>
            {/* Edit කරද්දී විතරක් Status එක වෙනස් කරන්න දෙනවා (Pending -> Approved වගේ) */}
            {editId && (
              <Fl label="Status">
                <select value={fm.status} onChange={(e) => setFm((f) => ({ ...f, status: e.target.value }))} style={sS}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </Fl>
            )}
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600 }}>Order Items</span>
              <button onClick={addItem} style={{ fontSize: 10, color: C.blue, border: "none", background: "none", cursor: "pointer" }}>+ Add Item</button>
            </div>
            {fm.items.map((item, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr auto", gap: 6, marginBottom: 4, alignItems: "center" }}>
                <select value={item.matId} onChange={(e) => updateItem(idx, "matId", e.target.value)} style={{ ...sS, fontSize: 10 }}>
                  <option value="">Select material...</option>
                  {mat.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.qty} {m.uom} in stock)</option>)}
                </select>
                <input type="number" value={item.qty} onChange={(e) => updateItem(idx, "qty", e.target.value)} style={{ ...iS, fontSize: 10 }} placeholder="Qty" />
                <input type="number" value={item.rate} onChange={(e) => updateItem(idx, "rate", e.target.value)} style={{ ...iS, fontSize: 10 }} placeholder="Rate" />
                <button onClick={() => removeItem(idx)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 12, padding: "0 4px" }}>✖</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button onClick={() => setShowAdd(false)} style={bS} disabled={loading}>Cancel</button>
            <button onClick={savePO} style={bP} disabled={loading}>{loading ? "Saving..." : (editId ? "Update PO" : "Create PO")}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TRANSPORT VIEW
// ═══════════════════════════════════════════════════════════
const TransportView = ({ transport, setTransport, toast }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fm, setFm] = useState({ date: TODAY, vehicle: "Lorry", from: "", to: "Kurunegala Workshop", km: "", hours: "", rate: "45", driver: "", fuel: "", purpose: "" });

  const openAdd = () => {
    setFm({ date: TODAY, vehicle: "Lorry", from: "", to: "Kurunegala Workshop", km: "", hours: "", rate: "45", driver: "", fuel: "", purpose: "" });
    setEditId(null);
    setShowAdd(true);
  };

  const openEdit = (t) => {
    setFm({ ...t });
    setEditId(t.id);
    setShowAdd(true);
  };

  // 🔴 Firebase එකට දත්ත Save/Edit කරන කොටස
  const saveTrip = async () => {
    if (!fm.from || !fm.km) return toast("Fill fields", "error");
    const cost = Number(fm.km) * Number(fm.rate);
    const tData = { ...fm, km: Number(fm.km), hours: Number(fm.hours), rate: Number(fm.rate), cost, fuel: Number(fm.fuel), po: "" };

    if (db) {
      setLoading(true);
      try {
        if (editId && typeof editId === "string" && !editId.startsWith("temp_")) {
          await updateDoc(doc(db, "transport", editId), tData);
          setTransport(p => p.map(x => x.id === editId ? { id: editId, ...tData } : x));
          toast("Trip updated successfully!");
        } else {
          const docRef = await addDoc(collection(db, "transport"), tData);
          setTransport((p) => [{ id: docRef.id, ...tData }, ...p]);
          toast("Trip recorded to Firebase!");
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        toast("Database Error: Could not save", "error");
      }
      setLoading(false);
    } else {
      if (editId) {
        setTransport(p => p.map(x => x.id === editId ? { id: editId, ...tData } : x));
        toast("Trip updated (Local)");
      } else {
        setTransport((p) => [{ id: `temp_${Date.now()}`, ...tData }, ...p]);
        toast("Trip recorded (Local)");
      }
    }
    setShowAdd(false);
  };

  // 🔴 Firebase එකෙන් දත්ත මකා දමන (Delete) කොටස
  const deleteTrip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip record?")) return;
    if (db && typeof id === "string" && !id.startsWith("temp_")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "transport", id));
        setTransport(p => p.filter(t => t.id !== id));
        toast("Trip deleted!");
      } catch (e) {
        console.error("Delete Error:", e);
        toast("Error deleting", "error");
      }
      setLoading(false);
    } else {
      setTransport(p => p.filter(t => t.id !== id));
      toast("Deleted (Local)");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button onClick={openAdd} style={{ ...bP, fontSize: 10, display: "flex", alignItems: "center", gap: 3 }}><Ic name="add" size={12} color={C.white} /> Record Trip</button>
      </div>

      <div style={{ background: C.white, borderRadius: 10, overflow: "auto", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 700 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
              {["Date", "Vehicle", "From → To", "KM", "Cost", "Purpose", ""].map((h, i) =>
                <th key={i} style={{ textAlign: h ? "left" : "right", padding: "7px 5px", fontSize: 9, color: C.g500, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {transport.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "6px", fontFamily: "monospace", fontSize: 10 }}>{t.date}</td>
                <td style={{ padding: "6px" }}>{t.vehicle}</td>
                <td style={{ padding: "6px", fontSize: 10 }}>{t.from} → {t.to}</td>
                <td style={{ padding: "6px", fontWeight: 600 }}>{t.km}</td>
                <td style={{ padding: "6px", fontWeight: 700 }}>{LKR(t.cost)}</td>
                <td style={{ padding: "6px", fontSize: 10, color: C.g500 }}>{t.purpose}</td>
                <td style={{ padding: "6px", textAlign: "right" }}>
                  <button onClick={() => openEdit(t)} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, padding: "0 4px" }}><Ic name="edit" size={12} /></button>
                  <button onClick={() => deleteTrip(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: "0 4px", fontWeight: "bold" }}>✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title={editId ? "Edit Transport Record" : "Record Transport"} onClose={() => setShowAdd(false)} w={520}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Fl label="From" req><input value={fm.from} onChange={(e) => setFm((f) => ({ ...f, from: e.target.value }))} style={iS} /></Fl>
            <Fl label="KM" req><input type="number" value={fm.km} onChange={(e) => setFm((f) => ({ ...f, km: e.target.value }))} style={iS} /></Fl>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Fl label="Vehicle">
              <select value={fm.vehicle} onChange={(e) => setFm((f) => ({ ...f, vehicle: e.target.value }))} style={sS}>
                <option>Lorry</option>
                <option>Pickup</option>
                <option>Van</option>
                <option>Bike</option>
              </select>
            </Fl>
            <Fl label="Purpose"><input value={fm.purpose} onChange={(e) => setFm((f) => ({ ...f, purpose: e.target.value }))} style={iS} /></Fl>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button onClick={() => setShowAdd(false)} style={bS} disabled={loading}>Cancel</button>
            <button onClick={saveTrip} style={bP} disabled={loading}>{loading ? "Saving..." : (editId ? "Update Record" : "Record")}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// FINANCE VIEW (Procurement Finance)
// ═══════════════════════════════════════════════════════════
const FinanceView = ({ txn, setTxn, toast }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fm, setFm] = useState({ date: TODAY, type: "expense", section: "procurement", cat: "Material", desc: "", amt: "", ref: "", project: "" });

  const openAdd = () => {
    setFm({ date: TODAY, type: "expense", section: "procurement", cat: "Material", desc: "", amt: "", ref: "", project: "" });
    setEditId(null);
    setShowAdd(true);
  };

  const openEdit = (t) => {
    setFm({ ...t });
    setEditId(t.id);
    setShowAdd(true);
  };

  // 🔴 Firebase එකට දත්ත Save/Edit කරන කොටස
  const saveTxn = async () => {
    if (!fm.desc || !fm.amt) return toast("Fill required fields", "error");
    const newTxn = { ...fm, amt: Number(fm.amt) };

    if (db) {
      setLoading(true);
      try {
        if (editId && typeof editId === "string" && !editId.startsWith("temp_")) {
          await updateDoc(doc(db, "finance", editId), newTxn);
          setTxn(p => p.map(x => x.id === editId ? { id: editId, ...newTxn } : x));
          toast("Transaction updated successfully!");
        } else {
          const docRef = await addDoc(collection(db, "finance"), newTxn);
          setTxn((p) => [{ id: docRef.id, ...newTxn }, ...p]);
          toast("Transaction saved to Firebase!");
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        toast("Database Error: Could not save", "error");
      }
      setLoading(false);
    } else {
      if (editId) {
        setTxn(p => p.map(x => x.id === editId ? { id: editId, ...newTxn } : x));
        toast("Transaction updated (Local)");
      } else {
        setTxn((p) => [{ id: `temp_${Date.now()}`, ...newTxn }, ...p]);
        toast("Transaction recorded (Local)");
      }
    }
    setShowAdd(false);
  };

  // 🔴 Firebase එකෙන් දත්ත මකා දමන (Delete) කොටස
  const deleteTxn = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    if (db && typeof id === "string" && !id.startsWith("temp_")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "finance", id));
        setTxn(p => p.filter(t => t.id !== id));
        toast("Transaction deleted!");
      } catch (e) {
        console.error("Delete Error:", e);
        toast("Error deleting", "error");
      }
      setLoading(false);
    } else {
      setTxn(p => p.filter(t => t.id !== id));
      toast("Deleted (Local)");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button onClick={openAdd} style={{ ...bP, fontSize: 10, display: "flex", alignItems: "center", gap: 3 }}><Ic name="add" size={12} color={C.white} /> Record Transaction</button>
      </div>

      <div style={{ background: C.white, borderRadius: 10, overflow: "auto", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 700 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
              {["Date", "Type", "Category", "Description", "Ref / PO", "Amount", ""].map((h, i) =>
                <th key={i} style={{ textAlign: h ? "left" : "right", padding: "7px 5px", fontSize: 9, color: C.g500, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {txn.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "6px", fontFamily: "monospace", fontSize: 10 }}>{t.date}</td>
                <td style={{ padding: "6px" }}><Badge status={t.type} /></td>
                <td style={{ padding: "6px" }}>{t.cat}</td>
                <td style={{ padding: "6px", fontWeight: 500 }}>{t.desc}</td>
                <td style={{ padding: "6px", fontSize: 10, color: C.g500 }}>{t.ref}</td>
                <td style={{ padding: "6px", fontWeight: 700, color: t.type === "expense" ? C.red : C.green }}>
                  {t.type === "expense" ? "-" : "+"}{LKR(t.amt)}
                </td>
                <td style={{ padding: "6px", textAlign: "right" }}>
                  <button onClick={() => openEdit(t)} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, padding: "0 4px" }}><Ic name="edit" size={12} /></button>
                  <button onClick={() => deleteTxn(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: "0 4px", fontWeight: "bold" }}>✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title={editId ? "Edit Transaction" : "Record Transaction"} onClose={() => setShowAdd(false)} w={520}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Fl label="Type" req>
              <select value={fm.type} onChange={(e) => setFm((f) => ({ ...f, type: e.target.value }))} style={sS}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </Fl>
            <Fl label="Amount (LKR)" req><input type="number" value={fm.amt} onChange={(e) => setFm((f) => ({ ...f, amt: e.target.value }))} style={iS} /></Fl>
          </div>
          <Fl label="Description" req><input value={fm.desc} onChange={(e) => setFm((f) => ({ ...f, desc: e.target.value }))} style={iS} /></Fl>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Fl label="Category"><input value={fm.cat} onChange={(e) => setFm((f) => ({ ...f, cat: e.target.value }))} style={iS} /></Fl>
            <Fl label="Reference (PO/Invoice)"><input value={fm.ref} onChange={(e) => setFm((f) => ({ ...f, ref: e.target.value }))} style={iS} /></Fl>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button onClick={() => setShowAdd(false)} style={bS} disabled={loading}>Cancel</button>
            <button onClick={saveTxn} style={bP} disabled={loading}>{loading ? "Saving..." : (editId ? "Update" : "Record")}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// REPORTS VIEW
// ═══════════════════════════════════════════════════════════
const ReportsView = ({ mat, tools, po, txn, transport }) => {
  // Firebase එකෙන් ආපු ඩේටා වලින් ගණනය කිරීම් කරනවා
  const totalMatValue = mat.reduce((s, m) => s + m.qty * m.rate, 0);
  const totalToolsValue = tools.reduce((s, t) => s + t.currentValue * t.qty, 0);
  const totalPoValue = po.reduce((s, p) => s + p.total, 0);
  const totalTransportCost = transport.reduce((s, t) => s + t.cost, 0);
  
  // වත්කම් බෙදී ගිහින් තියෙන විදිහ (Pie Chart Data)
  const assetData = [
    { name: "Materials", value: totalMatValue },
    { name: "Tools & Equip", value: totalToolsValue }
  ];

  // වියදම් කාණ්ඩ අනුව (Bar Chart Data)
  const expenseData = useMemo(() => {
    const r = {};
    txn.filter(t => t.type === "expense").forEach(t => {
      r[t.cat] = (r[t.cat] || 0) + t.amt;
    });
    return Object.entries(r).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);
  }, [txn]);

  const cols = [C.blue, C.amber, C.red, C.purple, C.green];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* සාරාංශ කාඩ්පත් 4 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <Stat icon="inventory" title="Total Material Value" value={LKR(totalMatValue)} color={C.blue} />
        <Stat icon="tools" title="Total Tools Value" value={LKR(totalToolsValue)} color={C.purple} />
        <Stat icon="procurement" title="Total PO Value" value={LKR(totalPoValue)} color={C.amber} />
        <Stat icon="truck" title="Total Transport Cost" value={LKR(totalTransportCost)} color={C.green} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 12 }}>
        {/* වත්කම් බෙදී යාම (Pie Chart) */}
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: C.g700, marginBottom: 10 }}>Asset Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={assetData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {assetData.map((_, i) => <Cell key={i} fill={cols[i % cols.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => LKR(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* වියදම් විශ්ලේෂණය (Bar Chart) */}
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: C.g700, marginBottom: 10 }}>Top Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={expenseData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => (v / 1000) + "k"} tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip formatter={(v) => LKR(v)} />
              <Bar dataKey="value" fill={C.red} radius={[0, 4, 4, 0]} barSize={20}>
                {expenseData.map((_, i) => <Cell key={i} fill={cols[i % cols.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SETTINGS VIEW
// ═══════════════════════════════════════════════════════════
const SettingsView = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
    {[
      { t: "System B: Procurement & Inventory", f: [["Module", "Procurement & Inventory"], ["Version", "4.1.0-B"], ["Sync", "Firebase Connected"]] },
      { t: "Inventory Config", f: [["Material Grades", "12 categories"], ["Reorder Alerts", "Enabled"]] }
    ].map(s => (
      <div key={s.t} style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{s.t}</h3>
        {s.f.map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f8fafc", fontSize: 11 }}>
            <span style={{ color: C.g500 }}>{l}</span>
            <span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════
// MENU & MAIN APP
// ═══════════════════════════════════════════════════════════
const MENU = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "d1", type: "d", label: "INVENTORY" },
  { id: "materials", label: "Materials", icon: "inventory" },
  { id: "tools", label: "Tools & Equipment", icon: "tools" },
  { id: "d2", type: "d", label: "PROCUREMENT" },
  { id: "orders", label: "Purchase Orders", icon: "procurement" },
  { id: "suppliers", label: "Suppliers", icon: "suppliers" },
  { id: "transport", label: "Transport & Logistics", icon: "truck" },
  { id: "d3", type: "d", label: "FINANCE" },
  { id: "finance", label: "Transactions", icon: "finance" },
  { id: "reports", label: "Reports & Analytics", icon: "reports" },
  { id: "d4", type: "d", label: "SYSTEM" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function App() {
  const [pg, setPg] = useState("dashboard");
  const [sb, setSb] = useState(true);
  const [mob, setMob] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadingDb, setLoadingDb] = useState(true);
  
  const [mat, setMat] = useState([]);
  const [tools, setTools] = useState([]);
  const [po, setPo] = useState([]);
  const [txn, setTxn] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transport, setTransport] = useState([]);

  const showT = useCallback((m, t = "success") => setToast({ m, t }), []);
  const nav = (p) => { setPg(p); setMob(false); };
  
  const title = MENU.find(m => m.id === pg)?.label || "Dashboard";

  // 🔴 බැජී, මෙතනින් තමයි App එක පටන් ගද්දිම Firebase එකෙන් Data අරගන්නේ (Fetch Data)
  useEffect(() => {
    const fetchFirebaseData = async () => {
      if (!db || firebaseConfig.apiKey.includes("YOUR_")) {
        console.log("Firebase Keys missing. Loading Dummy Data for preview.");
        setMat(I_MAT);
        setTools(I_TOOLS);
        setPo(I_PO);
        setTxn(I_TXN);
        setSuppliers(I_SUPPLIERS);
        setTransport(I_TRANSPORT);
        setLoadingDb(false);
        return;
      }

      try {
        setLoadingDb(true);
        
        // Firebase Database එකේ 'materials' කියන Collection එකෙන් සේරම දත්ත අදිනවා.
        const querySnapshot = await getDocs(collection(db, "materials"));
        const materialsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (materialsData.length > 0) {
          setMat(materialsData);
        } else {
          // Collection එක හිස් නම්, Dummy data ටික load කරනවා
          setMat(I_MAT);
        }
        
        // 🔴 Tools ටික අදිනවා (අලුතින් එකතු කරපු කෑල්ල)
        const toolsSnapshot = await getDocs(collection(db, "tools"));
        const toolsData = toolsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (toolsData.length > 0) {
          setTools(toolsData);
        } else {
          setTools(I_TOOLS);
        }
              
        setPo(I_PO);
        setTxn(I_TXN);
        setSuppliers(I_SUPPLIERS);
        setTransport(I_TRANSPORT);

        // 🔴 Suppliers ටික අදිනවා (අලුතින් එකතු කරපු කෑල්ල)
        const suppliersSnapshot = await getDocs(collection(db, "suppliers"));
        const suppliersData = suppliersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (suppliersData.length > 0) {
          setSuppliers(suppliersData);
        } else {
          setSuppliers(I_SUPPLIERS);
        }

        // 🔴 Purchase Orders (PO) ටික අදිනවා
        const poSnapshot = await getDocs(collection(db, "po"));
        const poData = poSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (poData.length > 0) {
          setPo(poData.sort((a, b) => b.code.localeCompare(a.code)));
        } else {
          setPo(I_PO);
        }

        // 🔴 Transport (Trips) ටික අදිනවා
        const transportSnapshot = await getDocs(collection(db, "transport"));
        const transportData = transportSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (transportData.length > 0) {
          setTransport(transportData.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else {
          setTransport(I_TRANSPORT);
        }
        
        // 🔴 Finance (Transactions) ටික අදිනවා
        const txnSnapshot = await getDocs(collection(db, "finance"));
        const txnData = txnSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (txnData.length > 0) {
          // අලුත්ම Transaction එක උඩින් පේන්න දිනය අනුව sort කරමු
          setTxn(txnData.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else {
          setTxn(I_TXN);
        }
        
      } catch (error) {
        console.error("Error fetching from Firebase:", error);
        showT("Database Connection Error. Loading offline data.", "error");
        setMat(I_MAT); setTools(I_TOOLS); setPo(I_PO); setTxn(I_TXN); setSuppliers(I_SUPPLIERS); setTransport(I_TRANSPORT);
      } finally {
        setLoadingDb(false);
      }
    };

    fetchFirebaseData();
  }, [showT]);

  const page = () => {
    if (loadingDb) return <div style={{ padding: 40, textAlign: 'center', color: C.g500 }}>Connecting to Database...</div>;
    
    switch (pg) {
      case "dashboard": return <ProcurementDashboard mat={mat} tools={tools} po={po} txn={txn} suppliers={suppliers} transport={transport} nav={nav} />;
      case "materials": return <MaterialsView mat={mat} setMat={setMat} toast={showT} />;
      case "tools": return <ToolsView tools={tools} setTools={setTools} toast={showT} />;
      case "orders": return <OrdersView po={po} setPo={setPo} mat={mat} suppliers={suppliers} toast={showT} />;
      case "suppliers": return <SuppliersView suppliers={suppliers} setSuppliers={setSuppliers} toast={showT} />;
      case "transport": return <TransportView transport={transport} setTransport={setTransport} toast={showT} />;
      case "finance": return <FinanceView txn={txn} setTxn={setTxn} toast={showT} />;
      case "reports": return <ReportsView mat={mat} tools={tools} po={po} txn={txn} transport={transport} />;
      case "settings": return <SettingsView />;
      default: return <div style={{ background: C.white, borderRadius: 10, padding: 30, border: "1px solid #e2e8f0", textAlign: "center", color: C.g500 }}>{title}</div>;
    }
  };

  const Nav = () => (
    <>
      <div style={{ padding: sb ? "14px 14px 10px" : "14px 6px 10px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 8, minHeight: 50 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0, color: C.white }}>K</div>
        {sb && <div><div style={{ fontSize: 11, fontWeight: 700, color: C.white }}>KEKULAWALA</div><div style={{ fontSize: 7, color: "rgba(255,255,255,.35)", letterSpacing: 1 }}>PROCUREMENT & INVENTORY</div></div>}
      </div>

      <div style={{ margin: "8px 8px 0", padding: "6px 8px", borderRadius: 6, background: db ? "rgba(16,185,129,.15)" : "rgba(245,158,11,.15)", display: "flex", alignItems: "center", gap: 4 }}>
        <Ic name="sync" size={12} color={db ? C.green : C.amber} />
        <span style={{ fontSize: 9, color: db ? C.green : C.amber, fontWeight: 500 }}>{db ? "DB Connected" : "Local Mode (No DB)"}</span>
      </div>

      <nav style={{ flex: 1, padding: "8px 4px", overflowY: "auto" }}>
        {MENU.map(item => {
          if (item.type === "d") return <div key={item.id} style={{ padding: sb ? "10px 8px 3px" : "10px 2px 3px", fontSize: 8, color: "rgba(255,255,255,.2)", fontWeight: 700, letterSpacing: 1.5 }}>{sb ? item.label : "—"}</div>;
          const a = pg === item.id;
          return (
            <button key={item.id} onClick={() => nav(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: sb ? "6px 8px" : "6px 10px", borderRadius: 6, border: "none", background: a ? "rgba(6,182,212,.2)" : "transparent", color: a ? "#67e8f9" : "rgba(255,255,255,.5)", fontSize: 11, fontWeight: a ? 600 : 400, cursor: "pointer", textAlign: "left", marginBottom: 1, whiteSpace: "nowrap" }}>
              <Ic name={item.icon} size={15} color={a ? "#67e8f9" : "rgba(255,255,255,.4)"} />
              {sb && item.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: 6, borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <button onClick={() => setSb(!sb)} style={{ width: "100%", padding: 5, borderRadius: 6, border: "none", background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.35)", fontSize: 10, cursor: "pointer" }}>{sb ? "« Collapse" : "»"}</button>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI',-apple-system,sans-serif", background: C.slatePale, overflow: "hidden" }}>
      {toast && <Toast msg={toast.m} type={toast.t} onClose={() => setToast(null)} />}
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 7000, background: "rgba(0,0,0,.4)" }} onClick={() => setMob(false)} />}
      
      <div style={{ width: sb ? 210 : 48, background: C.navy, display: "flex", flexDirection: "column", transition: "width .2s", overflow: "hidden", flexShrink: 0 }}>
        <Nav />
      </div>

      {mob && (
        <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 220, background: C.navy, zIndex: 8000, display: "flex", flexDirection: "column", boxShadow: "4px 0 20px rgba(0,0,0,.3)" }}>
          <Nav />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <header style={{ background: C.white, borderBottom: "1px solid #e2e8f0", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setMob(true)} style={{ border: "none", background: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <Ic name="menu" size={20} color={C.g700} />
            </button>
            {/* මෙන්න මේ පේළියේ තමයි අකුරු වල මහත අඩු කරලා ලස්සන කරේ 👇 */}
            <h1 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.5px", margin: 0, color: C.g900, whiteSpace: "nowrap" }}>{title}</h1>
            <span style={{ fontSize: 10, padding: "4px 8px", borderRadius: 6, background: "#cffafe", color: "#155e75", fontWeight: 700, whiteSpace: "nowrap", marginLeft: 4 }}>SYSTEM B</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ fontSize: 11, color: C.g500, fontWeight: 600, whiteSpace: "nowrap" }}>
              {new Date().toLocaleDateString("en-LK", { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <Ic name="bell" size={18} color={C.g500} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer" }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg, #06b6d4, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 10, fontWeight: 800 }}>SM</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.g700, whiteSpace: "nowrap" }}>Store Mgr</span>
            </div>
          </div>
        </header>
        <main style={{ flex: 1, padding: 16, overflowY: "auto" }}>
          {page()}
        </main>
      </div>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}`}</style>
    </div>
  );
}