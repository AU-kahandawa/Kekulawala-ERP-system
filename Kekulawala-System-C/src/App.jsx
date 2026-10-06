import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// KEKULAWALA ERP v4.1 — SYSTEM C: QUOTATION CREATION & AI ESTIMATION
// AI-Powered Quotation Builder · Drawing Analysis · Material Intelligence
// Letterhead/Watermark · Price Import from Sys B · Market AI Pricing
// Syncs with System A (Business) & System B (Procurement & Inventory)
// ═══════════════════════════════════════════════════════════════════════════

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";

// 🔴 අර පරණ Firebase Config එකමයි
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

const LKR = (n) => "LKR " + Number(n).toLocaleString("en-LK", { minimumFractionDigits: 2 });
const LKR0 = (n) => "LKR " + Number(n).toLocaleString("en-LK", { minimumFractionDigits: 0 });
const TODAY = "2026-03-08";
const pct = (a, b) => b > 0 ? Math.round((a / b) * 100) : 0;

// ═══════════════════════════════════════════════════════════
// SYNCED DATA FROM SYSTEM B (Procurement & Inventory)
// ═══════════════════════════════════════════════════════════
const SYS_B_MATERIALS = [
  { id: 1, code: "MAT-001", name: "Aluminum Composite Panel 4mm", grade: "Sheets", rate: 8500, avgRate: 8350, lastRate: 8200, uom: "sheets", qty: 45, supplier: "Lanwa Panels", altSuppliers: ["Lanka Aluminum", "Alupanel LK"] },
  { id: 2, code: "MAT-002", name: "Acrylic Sheet 3mm Clear", grade: "Sheets", rate: 4200, avgRate: 4100, lastRate: 4000, uom: "sheets", qty: 30, supplier: "Sathosa Acrylic", altSuppliers: ["Acrylic World"] },
  { id: 3, code: "MAT-003", name: "LED Strip Warm White 12V", grade: "Lights", rate: 850, avgRate: 835, lastRate: 820, uom: "meters", qty: 120, supplier: "LED World", altSuppliers: ["Bright Solutions"] },
  { id: 4, code: "MAT-004", name: "Vinyl Sticker White Gloss", grade: "Sheets", rate: 12000, avgRate: 11750, lastRate: 11500, uom: "rolls", qty: 8, supplier: "3M Distributor", altSuppliers: ["Oracal LK"] },
  { id: 5, code: "MAT-005", name: "MS Square Tube 25x25mm", grade: "Steel", rate: 320, avgRate: 315, lastRate: 310, uom: "feet", qty: 200, supplier: "Steel Corp", altSuppliers: ["Lanka Steel"] },
  { id: 6, code: "MAT-006", name: "Enamel Paint White", grade: "Paint", rate: 2800, avgRate: 2750, lastRate: 2700, uom: "liters", qty: 15, supplier: "Multilac Dealer", altSuppliers: ["Nippon Paint"] },
  { id: 7, code: "MAT-007", name: "3M Reflective Film", grade: "Sheets", rate: 28000, avgRate: 27500, lastRate: 27000, uom: "rolls", qty: 5, supplier: "3M Distributor", altSuppliers: ["Avery Dennison"] },
  { id: 8, code: "MAT-008", name: "LED Module 12V White", grade: "Lights", rate: 180, avgRate: 177, lastRate: 175, uom: "pcs", qty: 350, supplier: "LED World", altSuppliers: ["Bright Solutions"] },
  { id: 9, code: "MAT-009", name: "Silicone Sealant Clear", grade: "General", rate: 950, avgRate: 925, lastRate: 900, uom: "tubes", qty: 25, supplier: "Hardware Plus", altSuppliers: [] },
  { id: 10, code: "MAT-010", name: "GI Sheet 0.5mm", grade: "Steel", rate: 5200, avgRate: 5100, lastRate: 5000, uom: "sheets", qty: 18, supplier: "Steel Corp", altSuppliers: [] },
  { id: 11, code: "MAT-011", name: "LED Driver 12V 5A", grade: "Electrical", rate: 1200, avgRate: 1175, lastRate: 1150, uom: "pcs", qty: 40, supplier: "LED World", altSuppliers: [] },
  { id: 12, code: "MAT-012", name: "Plywood 8mm Marine", grade: "Timber", rate: 3800, avgRate: 3700, lastRate: 3600, uom: "sheets", qty: 12, supplier: "Timber Mart", altSuppliers: [] },
  { id: 13, code: "MAT-013", name: "Rivets 4mm Aluminum", grade: "General", rate: 5, avgRate: 4.75, lastRate: 4.5, uom: "pcs", qty: 2000, supplier: "Hardware Plus", altSuppliers: [] },
  { id: 14, code: "MAT-014", name: "Flex Banner 13oz", grade: "Sheets", rate: 18000, avgRate: 17750, lastRate: 17500, uom: "rolls", qty: 3, supplier: "Printers Hub", altSuppliers: [] },
  { id: 15, code: "MAT-015", name: "Welding Rod 6013 2.5mm", grade: "General", rate: 680, avgRate: 665, lastRate: 650, uom: "kg", qty: 50, supplier: "Welding Supplies LK", altSuppliers: [] },
  { id: 16, code: "MAT-016", name: "MS Flat Bar 25x3mm", grade: "Steel", rate: 180, avgRate: 175, lastRate: 170, uom: "feet", qty: 300, supplier: "Steel Corp", altSuppliers: [] },
  { id: 17, code: "MAT-017", name: "Polycarbonate Sheet 6mm", grade: "Sheets", rate: 6800, avgRate: 6600, lastRate: 6400, uom: "sheets", qty: 10, supplier: "Sathosa Acrylic", altSuppliers: [] },
  { id: 18, code: "MAT-018", name: "Neon Flex LED RGB", grade: "Lights", rate: 1800, avgRate: 1750, lastRate: 1700, uom: "meters", qty: 50, supplier: "LED World", altSuppliers: [] },
  { id: 19, code: "MAT-019", name: "Anchor Bolt 10mm", grade: "Steel", rate: 45, avgRate: 42, lastRate: 40, uom: "pcs", qty: 500, supplier: "Hardware Plus", altSuppliers: [] },
  { id: 20, code: "MAT-020", name: "Cable Tie 300mm", grade: "Electrical", rate: 8, avgRate: 7.5, lastRate: 7, uom: "pcs", qty: 1000, supplier: "Hardware Plus", altSuppliers: [] },
];

// AI Market Prices (simulated market intelligence)
const AI_MARKET_PRICES = {
  "MAT-001": { market: 8800, lowest: 8200, lowestSupplier: "Lanka Aluminum", trend: "up" },
  "MAT-002": { market: 4500, lowest: 3900, lowestSupplier: "Acrylic World", trend: "stable" },
  "MAT-003": { market: 900, lowest: 780, lowestSupplier: "AliExpress LED", trend: "down" },
  "MAT-004": { market: 12500, lowest: 11000, lowestSupplier: "Oracal LK", trend: "up" },
  "MAT-005": { market: 340, lowest: 300, lowestSupplier: "Melwa Steel", trend: "up" },
  "MAT-008": { market: 200, lowest: 150, lowestSupplier: "AliExpress LED", trend: "down" },
};

// AI Alternative Materials Database
const AI_ALTERNATIVES = {
  "Aluminum Composite Panel 4mm": [
    { name: "ACP Panel 3mm (Budget)", specs: "3mm, PE core, PVDF coat", price: 6200, supplier: "Lanka Aluminum", pros: "30% cheaper, lighter", cons: "Less rigid, not for large panels" },
    { name: "Dibond Panel 4mm", specs: "4mm, aluminum skin, PE core, German", price: 12500, supplier: "3M Distributor", pros: "Superior quality, 15yr warranty", cons: "47% more expensive" },
    { name: "HPL Sheet 6mm", specs: "High Pressure Laminate, exterior grade", price: 5800, supplier: "Merino Laminates", pros: "Cheaper, wood-grain options", cons: "Heavier, requires frame" },
  ],
  "LED Strip Warm White 12V": [
    { name: "LED Strip COB 12V", specs: "Dot-free, 480LED/m, 12W/m", price: 1200, supplier: "LED World", pros: "No dots, premium look", cons: "40% more expensive" },
    { name: "LED Strip 24V", specs: "24V version, longer runs", price: 950, supplier: "Bright Solutions", pros: "Longer runs without voltage drop", cons: "Needs 24V driver" },
    { name: "Neon Flex LED", specs: "Silicone neon, bendable", price: 1800, supplier: "LED World", pros: "Neon effect, waterproof", cons: "2x price, less bright" },
  ],
  "MS Square Tube 25x25mm": [
    { name: "Aluminum Square Tube 25x25mm", specs: "6063-T5, 1.2mm wall", price: 580, supplier: "Lanka Aluminum", pros: "Lightweight, no rust", cons: "81% more expensive, needs TIG welding" },
    { name: "MS Square Tube 20x20mm", specs: "Mild steel, 1.2mm", price: 260, supplier: "Steel Corp", pros: "19% cheaper, lighter", cons: "Less structural strength" },
    { name: "GI Square Tube 25x25mm", specs: "Galvanized, 1.2mm", price: 420, supplier: "Steel Corp", pros: "Rust resistant", cons: "31% more, harder to weld" },
  ],
};

// ═══════════════════════════════════════════════════════════
// SYNCED DATA FROM SYSTEM A (Clients)
// ═══════════════════════════════════════════════════════════

const QUOTATION_TEMPLATES = [
  { id: 1, name: "Standard Signage", category: "Signage", items: [
    { category: "material", description: "ACP Sheet 4mm", qty: 0, uom: "sheets", unitRate: 8500, margin: 15 },
    { category: "material", description: "MS Frame Structure", qty: 0, uom: "feet", unitRate: 320, margin: 20 },
    { category: "material", description: "LED Strip Lighting", qty: 0, uom: "meters", unitRate: 850, margin: 25 },
    { category: "labor", description: "Fabrication", qty: 0, uom: "days", unitRate: 12000, margin: 30 },
    { category: "labor", description: "Installation", qty: 0, uom: "days", unitRate: 15000, margin: 30 },
    { category: "transport", description: "Delivery", qty: 0, uom: "trips", unitRate: 8000, margin: 20 },
  ]},
  { id: 2, name: "LED Display", category: "LED", items: [
    { category: "material", description: "LED Display Panel", qty: 0, uom: "panels", unitRate: 85000, margin: 20 },
    { category: "material", description: "Steel Frame", qty: 0, uom: "lot", unitRate: 0, margin: 25 },
    { category: "labor", description: "Installation & Commissioning", qty: 0, uom: "days", unitRate: 25000, margin: 30 },
    { category: "indirect", description: "Transport & Accommodation", qty: 0, uom: "lot", unitRate: 0, margin: 0 },
  ]},
  { id: 3, name: "Vehicle Wrap", category: "Vinyl", items: [
    { category: "material", description: "Vehicle Wrap Vinyl", qty: 0, uom: "sq.m", unitRate: 3500, margin: 20 },
    { category: "material", description: "Lamination Film", qty: 0, uom: "sq.m", unitRate: 1200, margin: 15 },
    { category: "labor", description: "Application", qty: 0, uom: "days", unitRate: 8000, margin: 30 },
    { category: "material", description: "Design & Print", qty: 0, uom: "lot", unitRate: 0, margin: 25 },
  ]},
];

// ═══════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════
const Ic = ({ name, size = 18, color = "currentColor" }) => {
  const P = { dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z", quotation: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z", ai: "M21 11.5a8.4 8.4 0 01-.9 3.8l.9 3.2-3.2-.9a8.4 8.4 0 01-3.8.9c-4.6 0-8.5-3.8-8.5-8.5S10.4 1.5 14 1.5c4.7 0 8.5 3.8 8.5 8.5h-1.5z", settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z", close: "M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z", add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z", check: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z", menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z", search: "M15.5 14h-.8l-.3-.3c1-1.1 1.6-2.6 1.6-4.2C16 5.9 13.1 3 9.5 3S3 5.9 3 9.5 5.9 16 9.5 16c1.6 0 3.1-.6 4.2-1.6l.3.3v.8l5 5L20.5 19l-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z", bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z", download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z", edit: "M3 17.2V21h3.8L17.8 10l-3.8-3.8L3 17.2zM20.7 7c.4-.4.4-1 0-1.4l-2.3-2.3c-.4-.4-1-.4-1.4 0l-1.8 1.8 3.8 3.8L20.7 7z", sync: "M12 4V1L8 5l4 4V6c3.3 0 6 2.7 6 6 0 1-.3 2-.7 2.8l1.5 1.5c.7-1.2 1.2-2.7 1.2-4.3 0-4.4-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6 0-1 .3-2 .7-2.8L5.2 7.7C4.5 8.9 4 10.4 4 12c0 4.4 3.6 8 8 8v3l4-4-4-4v3z", whatsapp: "M17.5 14.4c-.3-.2-1.8-.9-2-.1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4S6.9 8.9 6.9 10.4c0 1.5 1.1 2.9 1.2 3.1.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4z", upload: "M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z", image: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z", copy: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z", print: "M19 8H5c-1.7 0-3 1.3-3 3v6h4v4h12v-4h4v-6c0-1.7-1.3-3-3-3zm-3 11H8v-5h8v5zm3-7c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm-1-9H6v4h12V3z", delete: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z", template: "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z", finance: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z", reports: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z", clients: "M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z", alert: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z", scan: "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}><path d={P[name] || P.dashboard} /></svg>;
};
const Badge = ({ status, size = "sm" }) => { const m = { draft: ["#f3f4f6", "#374151", "Draft"], sent: ["#dbeafe", "#1e40af", "Sent"], approved: ["#dcfce7", "#166534", "Approved"], rejected: ["#fee2e2", "#991b1b", "Rejected"], expired: ["#fef3c7", "#92400e", "Expired"], revised: ["#ede9fe", "#5b21b6", "Revised"], material: ["#dbeafe", "#1e40af", "Material"], labor: ["#fef3c7", "#92400e", "Labor"], transport: ["#cffafe", "#155e75", "Transport"], indirect: ["#fce7f3", "#9d174d", "Indirect"], up: ["#fee2e2", "#991b1b", "↑ Rising"], down: ["#dcfce7", "#166534", "↓ Falling"], stable: ["#f3f4f6", "#374151", "→ Stable"], income: ["#dcfce7", "#166534", "Income"], expense: ["#fee2e2", "#991b1b", "Expense"] }; const s = m[status] || ["#f3f4f6", "#374151", status]; return <span style={{ background: s[0], color: s[1], padding: size === "sm" ? "2px 9px" : "3px 12px", borderRadius: 99, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", display: "inline-block" }}>{s[2]}</span>; };
const Stat = ({ icon, title, value, sub, color = C.blue, onClick }) => (<div onClick={onClick} style={{ background: C.white, borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,.06)", border: "1px solid #e2e8f0", display: "flex", gap: 11, alignItems: "flex-start", cursor: onClick ? "pointer" : "default" }}><div style={{ width: 38, height: 38, borderRadius: 9, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic name={icon} size={18} color={color} /></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 10, color: C.g500, fontWeight: 500, textTransform: "uppercase", letterSpacing: .4 }}>{title}</div><div style={{ fontSize: 18, fontWeight: 700, color: C.g900 }}>{value}</div>{sub && <div style={{ fontSize: 10, color: C.g500 }}>{sub}</div>}</div></div>);
const Toast = ({ msg, type = "success", onClose }) => { useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]); return <div style={{ position: "fixed", top: 14, right: 14, zIndex: 10000, background: type === "success" ? C.green : type === "error" ? C.red : C.amber, color: C.white, padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.2)", display: "flex", alignItems: "center", gap: 6, maxWidth: 360 }}><Ic name="check" size={14} color={C.white} />{msg}</div>; };
const Modal = ({ title, onClose, children, w = 700 }) => (<div style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.45)" }} onClick={onClose}><div style={{ background: C.white, borderRadius: 14, width: "96%", maxWidth: w, maxHeight: "92vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }} onClick={(e) => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, background: C.white, zIndex: 2, borderRadius: "14px 14px 0 0" }}><h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{title}</h3><button onClick={onClose} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Ic name="close" size={14} color={C.g500} /></button></div><div style={{ padding: 20 }}>{children}</div></div></div>);
const Fl = ({ label, req, children }) => <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 10, fontWeight: 600, color: C.g700, marginBottom: 4 }}>{label}{req && <span style={{ color: C.red }}> *</span>}</label>{children}</div>;
const iS = { width: "100%", padding: "7px 10px", borderRadius: 7, border: "1px solid #e2e8f0", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const sS = { ...iS, background: C.white };
const bP = { padding: "8px 16px", borderRadius: 8, border: "none", background: C.blue, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer" };
const bS = { ...bP, background: C.white, color: C.g700, border: "1px solid #e2e8f0", fontWeight: 500 };

// ═══════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ═══════════════════════════════════════════════════════════
const DashboardView = ({ qt, nav }) => {
  const total = qt.length;
  const draft = qt.filter((q) => q.status === "draft").length;
  const sent = qt.filter((q) => q.status === "sent").length;
  const approved = qt.filter((q) => q.status === "approved").length;
  const totalValue = qt.reduce((s, q) => s + (q.roundedTotal || 0), 0);
  const approvedValue = qt.filter((q) => q.status === "approved").reduce((s, q) => s + q.roundedTotal, 0);
  const convRate = total > 0 ? pct(approved, total) : 0;
  const statusData = [{ name: "Draft", value: draft }, { name: "Sent", value: sent }, { name: "Approved", value: approved }].filter(d => d.value > 0);
  const cols = [C.g300, C.blue, C.green];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 10 }}>
        <Stat icon="quotation" title="Total Quotations" value={total} sub={`${draft} drafts`} color={C.blue} onClick={() => nav("quotations")} />
        <Stat icon="finance" title="Total Quoted" value={LKR0(totalValue)} color={C.purple} />
        <Stat icon="check" title="Approved Value" value={LKR0(approvedValue)} color={C.green} />
        <Stat icon="reports" title="Conversion" value={convRate + "%"} sub={`${approved}/${total}`} color={C.amber} />
        <Stat icon="ai" title="AI Estimates" value={qt.filter((q) => q.aiGenerated).length} sub="AI-generated" color={C.cyan} />
        <Stat icon="template" title="Templates" value={QUOTATION_TEMPLATES.length} sub="Ready to use" color={C.indigo} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Quotation Status</h3>
          <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{statusData.map((_, i) => <Cell key={i} fill={cols[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Quotation Values</h3>
          <ResponsiveContainer width="100%" height={180}><BarChart data={qt.filter((q) => q.roundedTotal > 0).map((q) => ({ name: q.code.replace("QT-2025-", ""), value: q.roundedTotal }))}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 8 }} tickFormatter={(v) => (v / 1e6).toFixed(1) + "M"} /><Tooltip formatter={(v) => LKR0(v)} /><Bar dataKey="value" fill={C.blue} radius={[3, 3, 0, 0]} barSize={24} /></BarChart></ResponsiveContainer>
        </div>
      </div>
      {/* AI Panel */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #312e81)", borderRadius: 12, padding: 18, color: C.white }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><Ic name="ai" size={20} color={C.amber} /><h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>AI Quotation Intelligence</h3><span style={{ fontSize: 9, background: C.amber, color: C.navy, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>GEMINI</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {[
            { title: "PRICE ALERT", msg: "ACP prices up 8.3% in 6 months. Consider quoting with 18% margin instead of 15% for new signage projects.", color: C.red },
            { title: "SIMILAR QUOTES", msg: "QT-0045 (Cargills) is similar to QT-0042 (Arpico). Arpico was approved at LKR 856K. Consider pricing Cargills competitively.", color: C.amber },
            { title: "DRAWING ANALYSIS", msg: "Upload project drawings for AI material list generation. Supports JPG, PNG, PDF. Accuracy improves with learning.", color: C.cyan },
            { title: "MARKET INTEL", msg: "LED module prices dropping 8% in import market. Local suppliers haven't adjusted yet. Good time for LED quotations.", color: C.green },
          ].map((a, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.08)", borderRadius: 8, padding: 12, borderLeft: `3px solid ${a.color}` }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: a.color, marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.8)", lineHeight: 1.4 }}>{a.msg}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Sync Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: C.white, borderRadius: 10, padding: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} /><div><div style={{ fontSize: 11, fontWeight: 600 }}>System A: Business Module</div><div style={{ fontSize: 9, color: C.g500 }}>Synced · Clients, Projects, Quotation Refs</div></div></div>
        <div style={{ background: C.white, borderRadius: 10, padding: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} /><div><div style={{ fontSize: 11, fontWeight: 600 }}>System B: Procurement & Inventory</div><div style={{ fontSize: 9, color: C.g500 }}>Synced · Material Prices, Stock, Suppliers</div></div></div>
      </div>
      {/* Recent Quotations */}
      <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><h3 style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>Recent Quotations</h3><button onClick={() => nav("quotations")} style={{ fontSize: 10, color: C.blue, border: "none", background: "none", cursor: "pointer" }}>View All →</button></div>
        {qt.slice(0, 4).map((q) => (
          <div key={q.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div><div style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ fontFamily: "monospace", fontSize: 10, color: C.g500 }}>{q.code}</span><Badge status={q.status} />{q.aiGenerated && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: "#fef3c7", color: "#92400e" }}>AI</span>}</div><div style={{ fontSize: 12, fontWeight: 600, marginTop: 1 }}>{q.title}</div><div style={{ fontSize: 10, color: C.g500 }}>{q.clientName} · {q.date}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 15, fontWeight: 800 }}>{LKR0(q.roundedTotal)}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// QUOTATION LIST VIEW
// ═══════════════════════════════════════════════════════════
const QuotationsListView = ({ qt, setSelected, onNew }) => {
  const [f, setF] = useState("all");
  const [q, setQ] = useState("");
  const filtered = qt.filter((x) => (f === "all" || x.status === f) && (!q || x.title.toLowerCase().includes(q.toLowerCase()) || x.code.toLowerCase().includes(q.toLowerCase()) || x.clientName.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}><span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}><Ic name="search" size={13} color={C.g500} /></span><input placeholder="Search quotations..." value={q} onChange={e => setQ(e.target.value)} style={{ ...iS, width: 200, paddingLeft: 28 }} /></div>
          <div style={{ display: "flex", gap: 3 }}>{["all", "draft", "sent", "approved", "rejected"].map(x => <button key={x} onClick={() => setF(x)} style={{ padding: "4px 10px", borderRadius: 7, border: "1px solid", borderColor: f === x ? C.blue : "#e2e8f0", background: f === x ? C.blue : C.white, color: f === x ? C.white : C.g700, fontSize: 10, cursor: "pointer" }}>{x === "all" ? `All (${qt.length})` : x.charAt(0).toUpperCase() + x.slice(1)}</button>)}</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => onNew("ai")} style={{ ...bP, background: "linear-gradient(135deg, #8b5cf6, #6366f1)", display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}><Ic name="ai" size={14} color={C.white} />AI Generate</button>
          <button onClick={() => onNew("manual")} style={{ ...bP, display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}><Ic name="add" size={14} color={C.white} />New Quotation</button>
        </div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>{filtered.map((q) => (
        <div key={q.id} onClick={() => setSelected(q)} style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}><span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600 }}>{q.code}</span><Badge status={q.status} />{q.aiGenerated && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: "#ede9fe", color: "#5b21b6" }}>AI Generated</span>}{q.projectRef && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: "#dcfce7", color: "#166534" }}>→ {q.projectRef}</span>}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 1 }}>{q.title}</div>
            <div style={{ fontSize: 10, color: C.g500 }}>{q.clientName} · {q.date} · Valid: {q.validUntil} · {q.items.length} items</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{LKR0(q.roundedTotal)}</div>
            <div style={{ display: "flex", gap: 3, marginTop: 4, justifyContent: "flex-end" }}>
              <button style={{ padding: "3px 7px", borderRadius: 4, border: "1px solid #e2e8f0", background: C.white, fontSize: 9, cursor: "pointer" }}>PDF</button>
              <button style={{ padding: "3px 7px", borderRadius: 4, border: "none", background: "#25d366", color: C.white, fontSize: 9, cursor: "pointer" }}>WhatsApp</button>
              <button style={{ padding: "3px 7px", borderRadius: 4, border: "1px solid #e2e8f0", background: C.white, fontSize: 9, cursor: "pointer" }}>Print</button>
            </div>
          </div>
        </div>
      ))}</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// QUOTATION DETAIL / EDITOR VIEW
// ═══════════════════════════════════════════════════════════
const QuotationDetailView = ({ q, setQt, onBack, toast }) => {
  const [showAddItem, setShowAddItem] = useState(false);
  const [itemForm, setItemForm] = useState({ category: "material", description: "", qty: "", uom: "pcs", unitRate: "", margin: "15", sysBCode: "", notes: "" });

  const importSysBPrice = (code) => {
    const mat = SYS_B_MATERIALS.find(m => m.code === code);
    if (mat) { setItemForm((f) => ({ ...f, description: mat.name, unitRate: String(mat.rate), uom: mat.uom, sysBCode: mat.code })); toast(`Imported ${mat.name} @ ${LKR(mat.rate)}`); }
  };

  const addItem = () => {
    if (!itemForm.description || !itemForm.qty || !itemForm.unitRate) return toast("Fill required fields", "error");
    const ur = Number(itemForm.unitRate); const mg = Number(itemForm.margin) || 0; const sr = ur * (1 + mg / 100); const tot = Number(itemForm.qty) * sr;
    const newItem = { id: Date.now(), ...itemForm, qty: Number(itemForm.qty), unitRate: ur, margin: mg, sellingRate: sr, total: tot };
    
    const newItems = [...(q.items || []), newItem];
    const newSub = q.subtotal + tot;
    const newRounded = Math.round(newSub / 1000) * 1000;

    setQt((prev) => prev.map((x) => x.id === q.id ? { ...x, items: newItems, subtotal: newSub, grandTotal: newSub, roundedTotal: newRounded } : x));
    setShowAddItem(false);
    setItemForm({ category: "material", description: "", qty: "", uom: "pcs", unitRate: "", margin: "15", sysBCode: "", notes: "" });
    toast("⏳ Saving item...");
    
    if (typeof db !== "undefined" && !String(q.id).startsWith("temp_")) {
      updateDoc(doc(db, "quotations", String(q.id)), { items: newItems, subtotal: newSub, grandTotal: newSub, roundedTotal: newRounded })
        .then(() => toast("✅ Item added to Firebase"))
        .catch(err => { console.error(err); toast("Error saving item", "error"); });
    }
  };

  const removeItem = (itemId) => {
    const item = q.items.find((i) => i.id === itemId);
    if (!item) return;
    
    const newItems = q.items.filter((i) => i.id !== itemId);
    const newSub = q.subtotal - item.total;
    const newRounded = Math.round(newSub / 1000) * 1000;

    setQt((prev) => prev.map((x) => x.id === q.id ? { ...x, items: newItems, subtotal: newSub, grandTotal: newSub, roundedTotal: newRounded } : x));
    toast("⏳ Removing item...");
    
    if (typeof db !== "undefined" && !String(q.id).startsWith("temp_")) {
      updateDoc(doc(db, "quotations", String(q.id)), { items: newItems, subtotal: newSub, grandTotal: newSub, roundedTotal: newRounded })
        .then(() => toast("✅ Item removed"))
        .catch(err => toast("Error removing item", "error"));
    }
  };

  // 🔴 අලුතින් එකතු කරපු WhatsApp යවන Function එක
  const sendWhatsApp = () => {
    const text = `Hello ${q.clientName},\n\nHere is your quotation from Kekulawala Advertising:\n\n*Ref:* ${q.code}\n*Project:* ${q.title}\n*Total:* ${LKR0(q.roundedTotal || q.subtotal)}\n\nPlease review and let us know if you need any adjustments.\n\nThank you!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    toast("Opening WhatsApp...");
  };

  // 🔴 Status වෙනස් කරන Function එක
  const updateStatus = (newStatus) => {
    setQt(prev => prev.map(x => x.id === q.id ? { ...x, status: newStatus } : x));
    toast(`⏳ Updating status...`);

    if (typeof db !== "undefined" && !String(q.id).startsWith("temp_")) {
      updateDoc(doc(db, "quotations", String(q.id)), { status: newStatus })
        .then(() => toast(`✅ Status updated to ${newStatus}`))
        .catch(err => { console.error(err); toast("Error updating status", "error"); });
    }
  };

  return (
    <div id="print-area" style={{ background: C.white, padding: 20, borderRadius: 12, minHeight: "100vh" }}>
      <button onClick={onBack} className="no-print" style={{ border: "none", background: "none", color: C.blue, fontSize: 12, cursor: "pointer", marginBottom: 10 }}>← Back</button>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 2px" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{q.title}</h2>
            {/* 🔴 Quotation එකේ Title එක ගාවමත් Status එක පේන්න දැම්මා */}
            <Badge status={q.status} /> 
          </div>
          <div style={{ fontSize: 11, color: C.g500 }}>{q.clientName} · {q.code}</div>
        </div>
        <div className="no-print" style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          
          {/* 🔴 Status Update Dropdown එක */}
          <select value={q.status} onChange={(e) => updateStatus(e.target.value)} style={{ ...sS, fontSize: 10, padding: "4px 8px", width: "auto", fontWeight: 600, cursor: "pointer", marginRight: 8 }}>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button onClick={() => window.print()} style={{ ...bS, fontSize: 10, padding: "5px 10px" }}>PDF</button>
          <button onClick={sendWhatsApp} style={{ ...bS, fontSize: 10, padding: "5px 10px", background: "#25d366", color: C.white, border: "none" }}>WhatsApp</button>
          <button onClick={() => window.print()} style={{ ...bP, fontSize: 10, padding: "5px 10px" }}>Print</button>
        </div>
      </div>
      
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, marginTop: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Line Items ({(q.items || []).length})</h3>
        <button onClick={() => setShowAddItem(true)} style={{ ...bP, fontSize: 10, display: "flex", alignItems: "center", gap: 3 }}><Ic name="add" size={12} color={C.white} />Add Item</button>
      </div>
      
      <div style={{ background: C.white, borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f0", marginTop: 15 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, minWidth: 800 }}>
          <thead><tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>{["#", "Cat", "Description", "Qty", "Cost", "Margin", "Total", ""].map((h, i) => <th key={h} className={i === 7 ? "no-print" : ""} style={{ textAlign: "left", padding: "6px 8px", fontSize: 9, color: C.g500 }}>{h}</th>)}</tr></thead>
          <tbody>{(q.items || []).map((item, idx) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "8px" }}>{idx + 1}</td>
              <td style={{ padding: "8px" }}><Badge status={item.category} /></td>
              <td style={{ padding: "8px", fontWeight: 500 }}>{item.description}</td>
              <td style={{ padding: "8px" }}>{item.qty} {item.uom}</td>
              <td style={{ padding: "8px" }}>{LKR(item.unitRate)}</td>
              <td style={{ padding: "8px" }}>{item.margin}%</td>
              <td style={{ padding: "8px", fontWeight: 700 }}>{LKR(item.total)}</td>
              <td className="no-print" style={{ padding: "8px" }}><button onClick={() => removeItem(item.id)} style={{ border: "none", background: "none", color: C.red, cursor: "pointer" }}>✕</button></td>
            </tr>
          ))}</tbody>
          <tfoot><tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}><td colSpan={6} style={{ padding: "8px", textAlign: "right", fontWeight: 700 }}>Grand Total</td><td colSpan={2} style={{ padding: "8px", fontWeight: 800, fontSize: 14, color: C.blue }}>{LKR0(q.roundedTotal)}</td></tr></tfoot>
        </table>
      </div>

      {showAddItem && <Modal title="Add Line Item" onClose={() => setShowAddItem(false)} w={600}>
        <div style={{ background: "#eff6ff", borderRadius: 8, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.blue, marginBottom: 6 }}>Import from System B (Inventory)</div>
          <select onChange={(e) => { if (e.target.value) importSysBPrice(e.target.value); }} style={{ ...sS, fontSize: 10 }}>
            <option value="">Select material...</option>
            {SYS_B_MATERIALS.map(m => <option key={m.id} value={m.code}>{m.name} — {LKR(m.rate)}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
          <Fl label="Category"><select value={itemForm.category} onChange={(e) => setItemForm((f) => ({ ...f, category: e.target.value }))} style={sS}><option value="material">Material</option><option value="labor">Labor</option><option value="transport">Transport</option></select></Fl>
          <Fl label="Description"><input value={itemForm.description} onChange={(e) => setItemForm((f) => ({ ...f, description: e.target.value }))} style={iS} /></Fl>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          <Fl label="Qty"><input type="number" value={itemForm.qty} onChange={(e) => setItemForm((f) => ({ ...f, qty: e.target.value }))} style={iS} /></Fl>
          <Fl label="UOM"><input value={itemForm.uom} onChange={(e) => setItemForm((f) => ({ ...f, uom: e.target.value }))} style={iS} /></Fl>
          <Fl label="Cost Rate"><input type="number" value={itemForm.unitRate} onChange={(e) => setItemForm((f) => ({ ...f, unitRate: e.target.value }))} style={iS} /></Fl>
          <Fl label="Margin %"><input type="number" value={itemForm.margin} onChange={(e) => setItemForm((f) => ({ ...f, margin: e.target.value }))} style={iS} /></Fl>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}><button onClick={() => setShowAddItem(false)} style={bS}>Cancel</button><button onClick={addItem} style={bP}>Add Item</button></div>
      </Modal>}
    </div>
  );
};

const AIEstimateView = ({ qt, setQt, toast, onBack, clients }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ clientId: "", title: "", description: "", projectType: "signage", drawingFile: null, drawingPreview: "", dimensions: "", notes: "" });
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [editedItems, setEditedItems] = useState([]);
  const fileRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, drawingFile: file, drawingPreview: URL.createObjectURL(file) }));
      toast("Drawing uploaded — ready for AI analysis", "success");
    }
  };

  const analyzeDrawing = async () => {
    if (!form.drawingFile) return toast("Please upload a drawing first", "error");
    
    setAnalyzing(true);
    toast("⏳ Gemini AI is analyzing the drawing...");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(form.drawingFile);
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        
        // Gemini API Key from environment or placeholder
        const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || ""; 

        const promptText = `Analyze this signage/project drawing. Identify the necessary materials and labor. 
        Return ONLY a JSON object with this exact structure, do not include any other text or markdown:
        {
          "estimatedSize": "String (e.g. 6m x 2m)",
          "detectedElements": ["Array", "of", "strings"],
          "materialList": [
            { "description": "Material name", "qty": number, "uom": "unit", "costRate": number (estimate in LKR), "margin": 20, "category": "material" }
          ]
        }`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }, { inline_data: { mime_type: form.drawingFile.type, data: base64Data } }] }]
          })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const aiText = data.candidates[0].content.parts[0].text;
        const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleanJson);

        result.totalEstimate = result.materialList.reduce((s, i) => s + (i.qty * i.costRate * (1 + i.margin / 100)), 0);

        setAiResult(result);
        setEditedItems(result.materialList.map((item, idx) => ({
          ...item, 
          id: idx + 1, 
          sellingRate: item.costRate * (1 + item.margin / 100), 
          total: item.qty * item.costRate * (1 + item.margin / 100)
        })));
        
        setAnalyzing(false);
        setStep(3);
        toast("✅ AI Analysis Complete!");
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      toast("AI Analysis failed. Check console.", "error");
      setAnalyzing(false);
    }
  };

  const updateItem = (idx, key, value) => {
    setEditedItems(prev => {
      const items = [...prev];
      items[idx] = { ...items[idx], [key]: key === "qty" || key === "costRate" || key === "margin" ? Number(value) : value };
      if (["qty", "costRate", "margin"].includes(key)) {
        const i = items[idx];
        i.sellingRate = i.costRate * (1 + i.margin / 100);
        i.total = i.qty * i.sellingRate;
      }
      return items;
    });
  };

  const createQuotation = () => {
    const client = (clients || []).find(c => String(c.id) === String(form.clientId));
    const items = editedItems.map(i => ({ ...i, unitRate: i.costRate }));
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const tempId = "temp_" + Date.now();

    const newQt = {
      id: tempId, code: "QT-2025-" + String(50 + qt.length).padStart(4, "0"),
      date: TODAY, validUntil: "2025-04-07", clientId: form.clientId || 0,
      clientName: client?.name || form.title, title: form.title, status: "draft",
      projectRef: "", description: form.description, items, subtotal, tax: 0, discount: 0,
      grandTotal: subtotal, roundedTotal: Math.round(subtotal / 1000) * 1000,
      terms: ["50% advance payment upon confirmation", "30% upon material delivery", "20% upon completion", "Validity: 30 days"],
      letterhead: null, watermark: null, aiGenerated: true,
      drawingAnalysis: aiResult,
      history: [{ date: TODAY, action: "AI-Generated Quotation Created", user: "AI + Admin" }],
      similarQuotations: [],
    };

    setQt((prev) => [newQt, ...prev]);
    onBack();
    toast("⏳ Saving AI Quotation...");

    if (typeof db !== "undefined") {
      const cleanData = JSON.parse(JSON.stringify(newQt));
      delete cleanData.id; 
      
      addDoc(collection(db, "quotations"), cleanData)
        .then((docRef) => {
          setQt(p => p.map(x => x.id === tempId ? { ...x, id: docRef.id } : x));
          toast("✅ AI Quotation saved to Firebase!");
        })
        .catch((err) => {
          console.error("Firebase Error:", err);
          toast("Background Save Failed!", "error");
        });
    }
  };

  const grandTotal = editedItems.reduce((s, i) => s + i.total, 0);

  return (
    <div>
      <button onClick={onBack} style={{ border: "none", background: "none", color: C.blue, fontSize: 12, cursor: "pointer", marginBottom: 10 }}>← Back</button>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #8b5cf6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic name="ai" size={18} color={C.white} /></div>
        <div><h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>AI Estimate Creator</h2><div style={{ fontSize: 10, color: C.g500 }}>Upload drawings, AI generates material list with prices from Sys B</div></div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>{[1, 2, 3, 4].map(s => <div key={s} style={{ flex: 1, padding: 8, borderRadius: 6, background: step >= s ? C.blue : "#f1f5f9", color: step >= s ? C.white : C.g500, fontSize: 10, fontWeight: 600, textAlign: "center" }}>{s === 1 ? "Project Info" : s === 2 ? "Upload & Analyze" : s === 3 ? "Review & Edit" : "Create"}</div>)}</div>

      {step === 1 && <div style={{ background: C.white, borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
        <Fl label="Client (from Sys A)" req><select value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))} style={sS}><option value="">Select client...</option>{(clients || []).map(c => <option key={c.id} value={c.id}>{c.name} ({c.company || "No Company"})</option>)}<option value="0">New Client</option></select></Fl>
        <Fl label="Quotation Title" req><input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={iS} placeholder="e.g. Showroom Exterior Signage" /></Fl>
        <Fl label="Description"><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ ...iS, height: 60 }} /></Fl>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Fl label="Project Type"><select value={form.projectType} onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))} style={sS}><option value="signage">Signage</option><option value="led_display">LED Display</option><option value="branding">Branding</option><option value="vehicle_wrap">Vehicle Wrap</option><option value="wayfinding">Wayfinding</option><option value="other">Other</option></select></Fl>
          <Fl label="Approx. Dimensions"><input value={form.dimensions} onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))} style={iS} placeholder="e.g. 6m × 2.5m" /></Fl>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}><button onClick={() => { if (!form.title) { toast("Enter title", "error"); return; } setStep(2); }} style={bP}>Next: Upload Drawing →</button></div>
      </div>}

      {step === 2 && <div style={{ background: C.white, borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
        <div style={{ border: "2px dashed #d1d5db", borderRadius: 12, padding: 40, textAlign: "center", marginBottom: 14, cursor: "pointer", background: form.drawingPreview ? `url(${form.drawingPreview}) center/contain no-repeat` : "none", minHeight: form.drawingPreview ? 300 : "auto" }} onClick={() => fileRef.current?.click()}>
          {!form.drawingPreview && <><Ic name="upload" size={40} color={C.g300} /><div style={{ fontSize: 14, fontWeight: 600, color: C.g500, marginTop: 8 }}>Upload Project Drawing</div><div style={{ fontSize: 11, color: C.g300, marginTop: 4 }}>JPG, PNG, PDF · AI will analyze and generate material list</div><div style={{ marginTop: 8, padding: "6px 16px", borderRadius: 6, background: C.blue, color: C.white, display: "inline-block", fontSize: 11 }}>Choose File</div></>}
          {form.drawingPreview && <div style={{ position: "relative" }}><div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,.7)", color: C.white, padding: "4px 10px", borderRadius: 4, fontSize: 10 }}>✓ Drawing uploaded</div></div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={handleFileUpload} />
        <div style={{ background: "#fef3c7", borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 11, color: "#92400e" }}>
          <strong>AI Drawing Analysis:</strong> The system will identify signage components, estimate dimensions, and generate a detailed material list. Accuracy improves with each project.
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => setStep(1)} style={bS}>← Back</button>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setStep(3); analyzeDrawing(); }} style={{ ...bP, background: form.drawingFile ? "linear-gradient(135deg, #8b5cf6, #6366f1)" : C.g300 }} disabled={!form.drawingFile && !form.title}>
              {analyzing ? "🔄 Analyzing..." : "🤖 AI Analyze & Generate"}
            </button>
            <button onClick={() => setStep(3)} style={bS}>Skip (Manual) →</button>
          </div>
        </div>
      </div>}

      {step === 3 && <div>
        {analyzing ? <div style={{ background: C.white, borderRadius: 12, padding: 40, border: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🤖</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>AI Analyzing Drawing...</div>
          <div style={{ fontSize: 11, color: C.g500, marginTop: 4 }}>Identifying components, calculating quantities, fetching prices from Sys B</div>
          <div style={{ marginTop: 16, height: 4, borderRadius: 2, background: "#f1f5f9", overflow: "hidden" }}><div style={{ height: "100%", width: "60%", background: "linear-gradient(90deg, #8b5cf6, #6366f1)", borderRadius: 2, animation: "pulse 1.5s infinite" }} /></div>
        </div> : <>
          {aiResult && <div style={{ background: "#ede9fe", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><Ic name="ai" size={14} color={C.purple} /><span style={{ fontSize: 11, fontWeight: 700, color: C.purple }}>AI Analysis Results</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 6 }}>
              <div style={{ fontSize: 10 }}><span style={{ color: C.g500 }}>Est. Size:</span> <strong>{aiResult.estimatedSize}</strong></div>
              <div style={{ fontSize: 10 }}><span style={{ color: C.g500 }}>Items:</span> <strong>{aiResult.materialList.length}</strong></div>
              <div style={{ fontSize: 10 }}><span style={{ color: C.g500 }}>Est. Total:</span> <strong>{LKR0(grandTotal)}</strong></div>
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: C.g500 }}>Detected: {aiResult.detectedElements?.join(", ")}</div>
          </div>}
          <div style={{ background: C.white, borderRadius: 10, overflow: "auto", border: "1px solid #e2e8f0", marginBottom: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, minWidth: 800 }}>
              <thead><tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>{["#", "Cat", "Description", "Qty", "UOM", "Cost Rate", "Margin%", "Sell Rate", "Total", "Sys B", "Conf%"].map(h => <th key={h} style={{ textAlign: "left", padding: "6px 4px", fontSize: 8, color: C.g500, fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>{editedItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "4px", color: C.g500 }}>{idx + 1}</td>
                  <td style={{ padding: "4px" }}><Badge status={item.category} /></td>
                  <td style={{ padding: "4px" }}><input value={item.description} onChange={e => updateItem(idx, "description", e.target.value)} style={{ ...iS, padding: "3px 6px", fontSize: 10, border: "1px solid transparent" }} /></td>
                  <td style={{ padding: "4px" }}><input type="number" value={item.qty} onChange={e => updateItem(idx, "qty", e.target.value)} style={{ ...iS, width: 50, padding: "3px 4px", fontSize: 10 }} /></td>
                  <td style={{ padding: "4px", color: C.g500, fontSize: 9 }}>{item.uom}</td>
                  <td style={{ padding: "4px" }}><input type="number" value={item.costRate} onChange={e => updateItem(idx, "costRate", e.target.value)} style={{ ...iS, width: 70, padding: "3px 4px", fontSize: 10 }} /></td>
                  <td style={{ padding: "4px" }}><input type="number" value={item.margin} onChange={e => updateItem(idx, "margin", e.target.value)} style={{ ...iS, width: 40, padding: "3px 4px", fontSize: 10 }} /></td>
                  <td style={{ padding: "4px", fontWeight: 600, fontSize: 9 }}>{LKR(item.sellingRate)}</td>
                  <td style={{ padding: "4px", fontWeight: 700 }}>{LKR(item.total)}</td>
                  <td style={{ padding: "4px" }}>{item.sysBCode ? <span style={{ fontSize: 7, padding: "1px 3px", borderRadius: 2, background: "#eff6ff", color: C.blue }}>{item.sysBCode}</span> : "-"}</td>
                  <td style={{ padding: "4px" }}>{item.confidence && <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 3, background: item.confidence >= 90 ? "#dcfce7" : item.confidence >= 75 ? "#fef3c7" : "#fee2e2", color: item.confidence >= 90 ? "#166534" : item.confidence >= 75 ? "#92400e" : "#991b1b" }}>{item.confidence}%</span>}</td>
                </tr>
              ))}</tbody>
              <tfoot><tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}><td colSpan={8} style={{ padding: "8px 4px", textAlign: "right", fontWeight: 700, fontSize: 12 }}>Grand Total</td><td colSpan={3} style={{ padding: "8px 4px", fontWeight: 800, fontSize: 14, color: C.blue }}>{LKR0(grandTotal)}</td></tr></tfoot>
            </table>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(2)} style={bS}>← Back</button>
            <button onClick={() => setStep(4)} style={bP}>Review & Create →</button>
          </div>
        </>}
      </div>}

      {step === 4 && <div style={{ background: C.white, borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📋 Quotation Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[["Title", form.title], ["Client", (clients || []).find(c => String(c.id) === String(form.clientId))?.name || "TBD"], ["Items", editedItems.length], ["Grand Total", LKR0(Math.round(grandTotal / 1000) * 1000)]].map(([l, v]) => <div key={l} style={{ padding: 10, borderRadius: 6, background: "#f8fafc", fontSize: 11 }}><span style={{ color: C.g500 }}>{l}:</span> <strong>{v}</strong></div>)}
        </div>
        <div style={{ background: "#eff6ff", borderRadius: 8, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.blue, marginBottom: 4 }}>Cost Summary</div>
          {["material", "labor", "transport", "indirect"].map(cat => {
            const catTotal = editedItems.filter(i => i.category === cat).reduce((s, i) => s + i.total, 0);
            return catTotal > 0 ? <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 10 }}><span style={{ textTransform: "capitalize" }}>{cat}</span><span style={{ fontWeight: 600 }}>{LKR0(catTotal)} ({pct(catTotal, grandTotal)}%)</span></div> : null;
          })}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #bfdbfe", marginTop: 4, fontSize: 12, fontWeight: 700 }}><span>Grand Total</span><span>{LKR0(Math.round(grandTotal / 1000) * 1000)}</span></div>
        </div>
        {aiResult && <div style={{ background: "#ede9fe", borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 10, color: C.purple }}>🤖 <strong>AI Generated</strong> · Confidence: {Math.round(editedItems.reduce((s, i) => s + (i.confidence || 80), 0) / (editedItems.length || 1))}% avg · Learning from this project</div>}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => setStep(3)} style={bS}>← Edit</button>
          <button onClick={createQuotation} style={{ ...bP, background: C.green, padding: "10px 24px", fontSize: 13 }}>✓ Create Quotation</button>
        </div>
      </div>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TEMPLATES VIEW
// ═══════════════════════════════════════════════════════════
const TemplatesView = () => (
  <div>
    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Quotation Templates</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
      {QUOTATION_TEMPLATES.map(t => (
        <div key={t.id} style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</span><span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#eff6ff", color: C.blue }}>{t.category}</span></div>
          <div style={{ fontSize: 10, color: C.g500, marginBottom: 8 }}>{t.items.length} pre-configured items</div>
          {t.items.map((item, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f8fafc", fontSize: 10 }}><span><Badge status={item.category} /> {item.description}</span><span style={{ color: C.g500 }}>{item.margin}% margin</span></div>)}
          <button style={{ ...bP, width: "100%", marginTop: 8, fontSize: 10 }}>Use Template</button>
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// PRICE INTELLIGENCE
// ═══════════════════════════════════════════════════════════
const PriceIntelView = () => {
  const data = SYS_B_MATERIALS.filter(m => AI_MARKET_PRICES[m.code]).map(m => {
    const mkt = AI_MARKET_PRICES[m.code];
    return { name: m.name.substring(0, 18), sysB: m.rate, market: mkt.market, lowest: mkt.lowest, code: m.code, trend: mkt.trend, lowestBy: mkt.lowestSupplier };
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 8 }}>
        <Stat icon="finance" title="Materials Tracked" value={data.length} color={C.blue} />
        <Stat icon="reports" title="Rising Prices" value={data.filter(d => d.trend === "up").length} color={C.red} />
        <Stat icon="reports" title="Falling Prices" value={data.filter(d => d.trend === "down").length} color={C.green} />
        <Stat icon="finance" title="Stable" value={data.filter(d => d.trend === "stable").length} color={C.g500} />
      </div>
      <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>System B vs Market Prices</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 7 }} angle={-15} textAnchor="end" height={50} /><YAxis tick={{ fontSize: 8 }} tickFormatter={(v) => (v / 1000) + "K"} />
            <Tooltip formatter={(v) => LKR(v)} /><Legend wrapperStyle={{ fontSize: 9 }} />
            <Bar dataKey="sysB" fill={C.blue} name="Sys B Rate" barSize={10} />
            <Bar dataKey="market" fill={C.amber} name="Market Rate" barSize={10} />
            <Bar dataKey="lowest" fill={C.green} name="Lowest Available" barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background: C.white, borderRadius: 10, overflow: "auto", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, minWidth: 600 }}>
          <thead><tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>{["Material", "Sys B Rate", "Market", "Lowest", "Lowest Supplier", "Trend", "Action"].map(h => <th key={h} style={{ textAlign: "left", padding: "7px 5px", fontSize: 9, color: C.g500, fontWeight: 600 }}>{h}</th>)}</tr></thead>
          <tbody>{data.map(d => <tr key={d.code} style={{ borderBottom: "1px solid #f1f5f9" }}>
            <td style={{ padding: "6px 5px", fontWeight: 500 }}>{d.name}</td>
            <td style={{ padding: "6px 5px" }}>{LKR(d.sysB)}</td>
            <td style={{ padding: "6px 5px" }}>{LKR(d.market)}</td>
            <td style={{ padding: "6px 5px", fontWeight: 600, color: C.green }}>{LKR(d.lowest)}</td>
            <td style={{ padding: "6px 5px", fontSize: 9 }}>{d.lowestBy}</td>
            <td style={{ padding: "6px 5px" }}><Badge status={d.trend} /></td>
            <td style={{ padding: "6px 5px" }}><button style={{ padding: "2px 6px", borderRadius: 3, border: "none", background: "#25d366", color: C.white, fontSize: 8, cursor: "pointer" }}>WA Quote</button></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════
const SettingsView = () => (<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>{[{ t: "System C: Quotation Module", f: [["Module", "Quotation & Estimation"], ["Version", "4.1.0-C"], ["Syncs", "← Sys A (Clients, Projects) · ← Sys B (Prices, Stock)"]] }, { t: "AI Configuration", f: [["Provider", "Google Gemini"], ["Model", "gemini-2.0-flash"], ["Drawing Analysis", "Enabled"], ["Material Recognition", "Learning (42 projects)"], ["Price Intelligence", "Active"]] }, { t: "Quotation Defaults", f: [["Default Margin", "15%"], ["Validity Period", "30 days"], ["Currency", "LKR"], ["Tax", "None (simplified)"], ["Rounding", "Nearest 1,000"]] }, { t: "Branding", f: [["Letterhead", "Not uploaded"], ["Watermark", "Not uploaded"], ["Footer", "Kekulawala Advertising"]] }].map(s => <div key={s.t} style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}><h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{s.t}</h3>{s.f.map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f8fafc", fontSize: 11 }}><span style={{ color: C.g500 }}>{l}</span><span style={{ fontWeight: 500 }}>{v}</span></div>)}</div>)}</div>);

// ═══════════════════════════════════════════════════════════
// MENU & MAIN APP
// ═══════════════════════════════════════════════════════════
const MENU = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "d1", type: "d", label: "QUOTATIONS" },
  { id: "quotations", label: "All Quotations", icon: "quotation" },
  { id: "ai_estimate", label: "AI Estimate Creator", icon: "ai" },
  { id: "templates", label: "Templates", icon: "template" },
  { id: "d2", type: "d", label: "INTELLIGENCE" },
  { id: "prices", label: "Price Intelligence", icon: "finance" },
  { id: "d3", type: "d", label: "SYSTEM" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function App() {
  const [pg, setPg] = useState("dashboard");
  const [sb, setSb] = useState(true);
  const [mob, setMob] = useState(false);
  const [toast, setToast] = useState(null);
  
  // 🔴 Firebase එකෙන් එන දත්ත තියාගන්න හදපු State ටික (හිස් වරහන් දැම්මේ මුලින් හිස්ව තියෙන්න ඕන නිසා)
  const [qt, setQt] = useState([]); 
  const [clients, setClients] = useState([]); // System A එකෙන් එන Clients ලා
  const [materials, setMaterials] = useState([]); // System B එකෙන් එන Materials
  
  const [selected, setSelected] = useState(null);

  const showT = useCallback((m, t = "success") => setToast({ m, t }), []);
  const nav = (p) => { setPg(p); setSelected(null); setMob(false); };

  const title = MENU.find(m => m.id === pg)?.label || "Dashboard";

  const page = () => {
    // 🔴 Fix: අලුත් වෙන Data ටික UI එකට හරියටම අරගැනීම
    const activeQ = selected ? qt.find(x => x.id === selected.id) || selected : null;
    if (activeQ) return <QuotationDetailView q={activeQ} setQt={setQt} onBack={() => setSelected(null)} toast={showT} />;
    
    switch (pg) {
      case "dashboard": return <DashboardView qt={qt} nav={nav} />;
      case "quotations": return <QuotationsListView qt={qt} setSelected={setSelected} onNew={(type) => { 
        if (type === "ai") nav("ai_estimate"); 
        else { 
          const tempId = "temp_" + Date.now();
          const newQt = { id: tempId, code: "QT-2025-" + String(50 + qt.length).padStart(4, "0"), date: TODAY, validUntil: "2025-04-07", clientId: 0, clientName: "New", title: "New Quotation", status: "draft", projectRef: "", description: "", items: [], subtotal: 0, tax: 0, discount: 0, grandTotal: 0, roundedTotal: 0, terms: ["50% advance", "50% on completion"], letterhead: null, watermark: null, aiGenerated: false, drawingAnalysis: null, history: [{ date: TODAY, action: "Created", user: "Admin" }], similarQuotations: [] }; 
          
          setQt(prev => [newQt, ...prev]); 
          setSelected(newQt); 
          showT("⏳ Creating quotation..."); 
          
          if (typeof db !== "undefined") {
            const cleanData = JSON.parse(JSON.stringify(newQt));
            delete cleanData.id; // Temp ID එක මකලා Firebase එකට යවනවා
            
            // 🔴 System A එකේ විදිහටම .then() පාවිච්චි කරලා යවනවා (හිරවෙන්නේ නෑ)
            addDoc(collection(db, "quotations"), cleanData)
              .then((docRef) => {
                setQt(p => p.map(x => x.id === tempId ? { ...x, id: docRef.id } : x));
                setSelected(p => p?.id === tempId ? { ...p, id: docRef.id } : p);
                showT("✅ Quotation saved to Firebase!");
              })
              .catch((err) => {
                console.error("Firebase Error:", err);
                showT("Error saving to Firebase", "error");
              });
          }
        } 
      }} />;
      case "ai_estimate": return <AIEstimateView qt={qt} setQt={setQt} toast={showT} onBack={() => nav("quotations")} clients={clients} />;
      case "templates": return <TemplatesView />;
      case "prices": return <PriceIntelView materials={materials} />;
      case "settings": return <SettingsView />;
      default: return <div style={{ background: C.white, borderRadius: 10, padding: 30, border: "1px solid #e2e8f0", textAlign: "center", color: C.g500 }}>{title}</div>;
    }
  };

  // 🔴 Firebase එකෙන් Clients සහ Materials අදින කෑල්ල
  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const clientSnap = await getDocs(collection(db, "clients"));
        if (!clientSnap.empty) {
          setClients(clientSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }

        const matSnap = await getDocs(collection(db, "materials"));
        if (!matSnap.empty) {
          setMaterials(matSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }

        const quoteSnap = await getDocs(collection(db, "quotations"));
        if (!quoteSnap.empty) {
          setQt(quoteSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))); // 🔴 setQuotes වෙනුවට setQt දැම්මා
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      }
    };
    fetchSystemData();
  }, []);

  const Nav = () => (<>
    <div style={{ padding: sb ? "14px 14px 10px" : "14px 6px 10px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 8, minHeight: 50 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#8b5cf6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0, color: C.white }}>K</div>
      {sb && <div><div style={{ fontSize: 11, fontWeight: 700, color: C.white }}>KEKULAWALA</div><div style={{ fontSize: 7, color: "rgba(255,255,255,.35)", letterSpacing: 1 }}>QUOTATION SYSTEM v4.1</div></div>}
    </div>
    {sb && <div style={{ margin: "8px 8px 0", display: "flex", gap: 4 }}>
      <div style={{ flex: 1, padding: "4px 6px", borderRadius: 4, background: "rgba(245,158,11,.15)", display: "flex", alignItems: "center", gap: 3 }}><Ic name="sync" size={10} color={C.amber} /><span style={{ fontSize: 7, color: C.amber }}>Sys A</span></div>
      <div style={{ flex: 1, padding: "4px 6px", borderRadius: 4, background: "rgba(16,185,129,.15)", display: "flex", alignItems: "center", gap: 3 }}><Ic name="sync" size={10} color={C.green} /><span style={{ fontSize: 7, color: C.green }}>Sys B</span></div>
    </div>}
    <nav style={{ flex: 1, padding: "8px 4px", overflowY: "auto" }}>{MENU.map(item => {
      if (item.type === "d") return <div key={item.id} style={{ padding: sb ? "10px 8px 3px" : "10px 2px 3px", fontSize: 8, color: "rgba(255,255,255,.2)", fontWeight: 700, letterSpacing: 1.5 }}>{sb ? item.label : "—"}</div>;
      const a = pg === item.id; return <button key={item.id} onClick={() => nav(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: sb ? "6px 8px" : "6px 10px", borderRadius: 6, border: "none", background: a ? "rgba(139,92,246,.2)" : "transparent", color: a ? "#c4b5fd" : "rgba(255,255,255,.5)", fontSize: 11, fontWeight: a ? 600 : 400, cursor: "pointer", textAlign: "left", marginBottom: 1, whiteSpace: "nowrap" }}><Ic name={item.icon} size={15} color={a ? "#c4b5fd" : "rgba(255,255,255,.4)"} />{sb && item.label}</button>;
    })}</nav>
    <div style={{ padding: 6, borderTop: "1px solid rgba(255,255,255,.08)" }}><button onClick={() => setSb(!sb)} style={{ width: "100%", padding: 5, borderRadius: 6, border: "none", background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.35)", fontSize: 10, cursor: "pointer" }}>{sb ? "« Collapse" : "»"}</button></div>
  </>);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI',-apple-system,sans-serif", background: C.slatePale, overflow: "hidden" }}>
      {toast && <Toast msg={toast.m} type={toast.t} onClose={() => setToast(null)} />}
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 7000, background: "rgba(0,0,0,.4)" }} onClick={() => setMob(false)} />}
      <div style={{ width: sb ? 200 : 48, background: C.navy, display: "flex", flexDirection: "column", transition: "width .2s", overflow: "hidden", flexShrink: 0 }}><Nav /></div>
      {mob && <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 210, background: C.navy, zIndex: 8000, display: "flex", flexDirection: "column", boxShadow: "4px 0 20px rgba(0,0,0,.3)" }}><Nav /></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <header style={{ background: C.white, borderBottom: "1px solid #e2e8f0", padding: "0 16px", height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><button onClick={() => setMob(true)} style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}><Ic name="menu" size={18} color={C.g700} /></button><div style={{ fontSize: 15, fontWeight: 700, margin: 0, color: C.g900, letterSpacing: "0.5px" }}>{selected ? selected.title : title}</div><span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#ede9fe", color: "#5b21b6", fontWeight: 600 }}>SYSTEM C</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, color: C.g500 }}>{new Date().toLocaleDateString("en-LK", { weekday: "short", month: "short", day: "numeric" })}</span>
            <div style={{ display: "flex", gap: 3 }}><div style={{ padding: "2px 5px", borderRadius: 3, background: "#fef3c7", display: "flex", alignItems: "center", gap: 2 }}><div style={{ width: 5, height: 5, borderRadius: 3, background: C.amber }} /><span style={{ fontSize: 7, color: "#92400e" }}>A</span></div><div style={{ padding: "2px 5px", borderRadius: 3, background: "#dcfce7", display: "flex", alignItems: "center", gap: 2 }}><div style={{ width: 5, height: 5, borderRadius: 3, background: C.green }} /><span style={{ fontSize: 7, color: "#166534" }}>B</span></div></div>
            <div style={{ position: "relative" }}><Ic name="bell" size={16} color={C.g500} /><span style={{ position: "absolute", top: -2, right: -2, width: 6, height: 6, borderRadius: 3, background: C.purple, border: "1.5px solid white" }} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", borderRadius: 6, background: "#f8fafc" }}><div style={{ width: 22, height: 22, borderRadius: 5, background: C.purple, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 8, fontWeight: 700 }}>QM</div><span style={{ fontSize: 10, fontWeight: 500 }}>Quotes Mgr</span></div>
          </div>
        </header>
        <main style={{ flex: 1, padding: 16, overflowY: "auto" }}>{page()}</main>
      </div>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}} @media print { body * { visibility: hidden; } #print-area, #print-area * { visibility: visible; } #print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; background: #fff; } .no-print { display: none !important; } }`}</style>
    </div>
  );
}