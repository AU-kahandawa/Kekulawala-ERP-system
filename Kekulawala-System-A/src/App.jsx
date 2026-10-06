import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart
} from "recharts";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// 🔴 Firebase Config එක මෙතනට දාන්න
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

// ═══════════════════════════════════════════════════════════════════════
// KEKULAWALA ERP v4.1 — SYSTEM A: BUSINESS MODULE
// Projects · Job Cards · HR · Employee Pool · Attendance · Payroll
// Finance & Transactions · Client Database
// Syncs with System B (Procurement & Inventory) & System C (Quotations)
// ═══════════════════════════════════════════════════════════════════════

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
const ini = (n) => n.split(" ").map(w => w[0]).join("").substring(0, 2);
const RD = [{ month: "Apr", revenue: 2800000, expenses: 2100000 }, { month: "May", revenue: 3200000, expenses: 2400000 }, { month: "Jun", revenue: 2900000, expenses: 2200000 }, { month: "Jul", revenue: 3600000, expenses: 2800000 }, { month: "Aug", revenue: 3100000, expenses: 2350000 }, { month: "Sep", revenue: 3800000, expenses: 2900000 }, { month: "Oct", revenue: 4200000, expenses: 3100000 }, { month: "Nov", revenue: 3700000, expenses: 2800000 }, { month: "Dec", revenue: 4500000, expenses: 3400000 }, { month: "Jan", revenue: 3900000, expenses: 2950000 }, { month: "Feb", revenue: 4100000, expenses: 3050000 }, { month: "Mar", revenue: 4400000, expenses: 3200000 }];

// ═══════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════
const Ic = ({ name, size = 18, color = "currentColor" }) => {
  const P = { dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z", projects: "M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z", people: "M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z", finance: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z", clients: "M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z", attendance: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.2-4.5-2.7V7z", payroll: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z", reports: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z", settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z", close: "M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z", add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z", check: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z", menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z", search: "M15.5 14h-.8l-.3-.3c1-1.1 1.6-2.6 1.6-4.2C16 5.9 13.1 3 9.5 3S3 5.9 3 9.5 5.9 16 9.5 16c1.6 0 3.1-.6 4.2-1.6l.3.3v.8l5 5L20.5 19l-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z", bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z", star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.3 5.8 21l1.2-6.8-5-4.9 6.9-1z", ai: "M21 11.5a8.4 8.4 0 01-.9 3.8l.9 3.2-3.2-.9a8.4 8.4 0 01-3.8.9c-4.6 0-8.5-3.8-8.5-8.5S10.4 1.5 14 1.5c4.7 0 8.5 3.8 8.5 8.5h-1.5z", download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z", edit: "M3 17.2V21h3.8L17.8 10l-3.8-3.8L3 17.2zM20.7 7c.4-.4.4-1 0-1.4l-2.3-2.3c-.4-.4-1-.4-1.4 0l-1.8 1.8 3.8 3.8L20.7 7z", sync: "M12 4V1L8 5l4 4V6c3.3 0 6 2.7 6 6 0 1-.3 2-.7 2.8l1.5 1.5c.7-1.2 1.2-2.7 1.2-4.3 0-4.4-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6 0-1 .3-2 .7-2.8L5.2 7.7C4.5 8.9 4 10.4 4 12c0 4.4 3.6 8 8 8v3l4-4-4-4v3z", jobcard: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z", leave: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z", alert: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z", whatsapp: "M17.5 14.4c-.3-.2-1.8-.9-2-.1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4S6.9 8.9 6.9 10.4c0 1.5 1.1 2.9 1.2 3.1.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4z" };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}><path d={P[name] || P.dashboard} /></svg>;
};
const Badge = ({ status, size = "sm" }) => { const m = { active: ["#dcfce7", "#166534", "Active"], ongoing: ["#dbeafe", "#1e40af", "Ongoing"], completed: ["#dcfce7", "#166534", "Completed"], planning: ["#fef3c7", "#92400e", "Planning"], approved: ["#dcfce7", "#166534", "Approved"], pending: ["#fef3c7", "#92400e", "Pending"], rejected: ["#fee2e2", "#991b1b", "Rejected"], permanent: ["#ede9fe", "#5b21b6", "Permanent"], contract: ["#fef3c7", "#92400e", "Contract"], subcontractor: ["#fce7f3", "#9d174d", "Sub-contractor"], service_provider: ["#cffafe", "#155e75", "Service Provider"], income: ["#dcfce7", "#166534", "Income"], expense: ["#fee2e2", "#991b1b", "Expense"], high: ["#fee2e2", "#991b1b", "High"], medium: ["#fef3c7", "#92400e", "Medium"], low: ["#dbeafe", "#1e40af", "Low"], present: ["#dcfce7", "#166534", "Present"], absent: ["#fee2e2", "#991b1b", "Absent"], leave: ["#ede9fe", "#5b21b6", "Leave"], excellent: ["#dcfce7", "#166534", "Excellent"], good: ["#dbeafe", "#1e40af", "Good"], average: ["#fef3c7", "#92400e", "Average"], poor: ["#fee2e2", "#991b1b", "Poor"], employee: ["#dbeafe", "#1e40af", "Employee"], paid: ["#dcfce7", "#166534", "Paid"], due: ["#fee2e2", "#991b1b", "Due"], draft: ["#f3f4f6", "#374151", "Draft"] }; const s = m[status] || ["#f3f4f6", "#374151", status]; return <span style={{ background: s[0], color: s[1], padding: size === "sm" ? "2px 9px" : "3px 12px", borderRadius: 99, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", display: "inline-block" }}>{s[2]}</span>; };
const Stat = ({ icon, title, value, sub, color = C.blue, onClick }) => (<div onClick={onClick} style={{ background: C.white, borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,.06)", border: "1px solid #e2e8f0", display: "flex", gap: 11, alignItems: "flex-start", cursor: onClick ? "pointer" : "default" }}><div style={{ width: 38, height: 38, borderRadius: 9, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic name={icon} size={18} color={color} /></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 10, color: C.g500, fontWeight: 500, textTransform: "uppercase", letterSpacing: .4 }}>{title}</div><div style={{ fontSize: 18, fontWeight: 700, color: C.g900 }}>{value}</div>{sub && <div style={{ fontSize: 10, color: C.g500 }}>{sub}</div>}</div></div>);
const Toast = ({ msg, type = "success", onClose }) => { useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]); return <div style={{ position: "fixed", top: 14, right: 14, zIndex: 10000, background: type === "success" ? C.green : type === "error" ? C.red : C.amber, color: C.white, padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.2)", display: "flex", alignItems: "center", gap: 6 }}><Ic name="check" size={14} color={C.white} />{msg}</div>; };
const Modal = ({ title, onClose, children, w = 600 }) => (<div style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)" }} onClick={onClose}><div style={{ background: C.white, borderRadius: 14, width: "95%", maxWidth: w, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }} onClick={(e) => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, background: C.white, zIndex: 1, borderRadius: "14px 14px 0 0" }}><h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{title}</h3><button onClick={onClose} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Ic name="close" size={14} color={C.g500} /></button></div><div style={{ padding: 20 }}>{children}</div></div></div>);
const Fl = ({ label, req, children }) => <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 10, fontWeight: 600, color: C.g700, marginBottom: 4 }}>{label}{req && <span style={{ color: C.red }}> *</span>}</label>{children}</div>;
const iS = { width: "100%", padding: "7px 10px", borderRadius: 7, border: "1px solid #e2e8f0", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const sS = { ...iS, background: C.white };
const bP = { padding: "8px 16px", borderRadius: 8, border: "none", background: C.blue, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer" };
const bS = { ...bP, background: C.white, color: C.g700, border: "1px solid #e2e8f0", fontWeight: 500 };
const Stars = ({ val = 0 }) => <span style={{ fontSize: 12 }}>{Array.from({ length: 5 }, (_, i) => <span key={i} style={{ color: i < Math.round(val) ? C.amber : C.g300 }}>★</span>)}<span style={{ fontSize: 10, color: C.g500, marginLeft: 4 }}>{val.toFixed(1)}</span></span>;

// ═══════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ═══════════════════════════════════════════════════════════
const DashboardView = ({ prj, emp, txn, clients, nav }) => {
  const income = txn.filter((t) => t.type === "income").reduce((s, t) => s + t.amt, 0);
  const expense = txn.filter((t) => t.type === "expense").reduce((s, t) => s + t.amt, 0);
  const ongoing = prj.filter((p) => p.status === "ongoing");
  const staff = emp.filter((e) => e.pool === "employee");
  const bestEmp = [...staff].sort((a, b) => (b.evalHistory?.[b.evalHistory.length - 1]?.avg || 0) - (a.evalHistory?.[a.evalHistory.length - 1]?.avg || 0));
  const duePayments = emp.filter((e) => e.payDue > 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
        <Stat icon="projects" title="Active Projects" value={ongoing.length} sub={`${prj.length} total`} color={C.blue} onClick={() => nav("projects")} />
        <Stat icon="finance" title="Revenue (YTD)" value={LKR(income)} color={C.green} onClick={() => nav("finance")} />
        <Stat icon="finance" title="Expenses (YTD)" value={LKR(expense)} color={C.red} onClick={() => nav("finance")} />
        <Stat icon="clients" title="Clients" value={clients.length} sub={`${clients.filter((c) => c.loyalty === "high").length} high loyalty`} color={C.purple} onClick={() => nav("clients")} />
        <Stat icon="people" title="Workforce" value={emp.length} sub={`${staff.length} emp, ${emp.length - staff.length} ext`} color={C.cyan} onClick={() => nav("employees")} />
        <Stat icon="payroll" title="Payments Due" value={duePayments.length > 0 ? LKR(duePayments.reduce((s, e) => s + e.payDue, 0)) : "None"} color={duePayments.length > 0 ? C.red : C.green} onClick={() => nav("payroll")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 12 }}>
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Revenue vs Expenses (FY)</h3>
          <ResponsiveContainer width="100%" height={180}><AreaChart data={RD}><defs><linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.blue} stopOpacity={.15} /><stop offset="95%" stopColor={C.blue} stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => (v / 1e6).toFixed(1) + "M"} /><Tooltip formatter={(v) => LKR(v)} /><Area type="monotone" dataKey="revenue" stroke={C.blue} fill="url(#rG)" strokeWidth={2} name="Revenue" /><Area type="monotone" dataKey="expenses" stroke={C.red} fill="none" strokeWidth={2} name="Expenses" /><Legend wrapperStyle={{ fontSize: 9 }} /></AreaChart></ResponsiveContainer>
        </div>
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Project Budget Status</h3>
          <ResponsiveContainer width="100%" height={180}><BarChart data={prj.map((p) => ({ name: p.name.substring(0, 12), budget: p.budget, actual: p.actual }))} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis type="number" tick={{ fontSize: 8 }} tickFormatter={(v) => (v / 1e6).toFixed(1) + "M"} /><YAxis dataKey="name" type="category" width={85} tick={{ fontSize: 8 }} /><Tooltip formatter={(v) => LKR(v)} /><Bar dataKey="budget" fill={C.blue} name="Budget" barSize={8} /><Bar dataKey="actual" fill={C.amber} name="Actual" barSize={8} /><Legend wrapperStyle={{ fontSize: 9 }} /></BarChart></ResponsiveContainer>
        </div>
      </div>
      {/* AI Panel */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", borderRadius: 12, padding: 18, color: C.white }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><Ic name="ai" size={20} color={C.amber} /><h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>AI Business Insights</h3><span style={{ fontSize: 9, background: C.amber, color: C.navy, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>GEMINI</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {[{ icon: "projects", msg: `${ongoing.length} active projects. Arpico deadline in 23 days (72% done). Dialog at 35% — needs acceleration.`, color: C.blue }, { icon: "people", msg: `Best performer: ${bestEmp[0]?.name} (${bestEmp[0]?.evalHistory?.[bestEmp[0].evalHistory.length - 1]?.avg?.toFixed(1)}). Concern: ${bestEmp[bestEmp.length - 1]?.name} attendance declining.`, color: C.purple }, { icon: "finance", msg: `Net cashflow: +${LKR(income - expense)}. Dialog outstanding: ${LKR(3500000 - 1400000)}. Havelock fully settled.`, color: C.green }].map((a, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.08)", borderRadius: 8, padding: 12, borderLeft: `3px solid ${a.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><Ic name={a.icon} size={14} color={a.color} /></div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.8)", lineHeight: 1.4 }}>{a.msg}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Sync Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: C.white, borderRadius: 10, padding: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} /><div><div style={{ fontSize: 11, fontWeight: 600 }}>System B: Procurement & Inventory</div><div style={{ fontSize: 9, color: C.g500 }}>Synced · Materials, POs, Transport</div></div></div>
        <div style={{ background: C.white, borderRadius: 10, padding: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} /><div><div style={{ fontSize: 11, fontWeight: 600 }}>System C: Quotations & Estimates</div><div style={{ fontSize: 9, color: C.g500 }}>Synced · AI Estimator, Quotes</div></div></div>
      </div>
      {/* Recent */}
      <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><h3 style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>Recent Transactions</h3><button onClick={() => nav("finance")} style={{ fontSize: 10, color: C.blue, border: "none", background: "none", cursor: "pointer" }}>View All →</button></div>
        {txn.slice(0, 5).map((t) => <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}><div><div style={{ fontSize: 12, fontWeight: 500 }}>{t.desc}</div><div style={{ fontSize: 10, color: C.g500 }}>{t.date} · {t.section}</div></div><span style={{ fontSize: 13, fontWeight: 700, color: t.type === "income" ? C.green : C.red }}>{t.type === "income" ? "+" : "-"}{LKR(t.amt)}</span></div>)}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PROJECTS VIEW
// ═══════════════════════════════════════════════════════════
const ProjectsView = ({ prj, clients, setSP, onAdd }) => {
  const [f, setF] = useState("all");
  const fl = f === "all" ? prj : prj.filter((p) => p.status === f);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 4 }}>{["all", "planning", "ongoing", "completed"].map(x => <button key={x} onClick={() => setF(x)} style={{ padding: "4px 10px", borderRadius: 7, border: "1px solid", borderColor: f === x ? C.blue : "#e2e8f0", background: f === x ? C.blue : C.white, color: f === x ? C.white : C.g700, fontSize: 10, cursor: "pointer" }}>{x === "all" ? "All " + prj.length : x.charAt(0).toUpperCase() + x.slice(1)}</button>)}</div>
        <button onClick={onAdd} style={{ ...bP, display: "flex", alignItems: "center", gap: 3, fontSize: 10 }}><Ic name="add" size={14} color={C.white} />New Project</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>{fl.map((p) => {
        const cl = clients.find((c) => c.id === p.clientId);
        return <div key={p.id} onClick={() => setSP(p)} style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0", cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><Badge status={p.status} /><Badge status={p.priority} /></div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: C.g500, marginBottom: 4 }}>{cl?.name} · {p.code}</div>
          {p.quotationRef && <div style={{ fontSize: 9, color: C.cyan, marginBottom: 4 }}>Quotation: {p.quotationRef} (→Sys C)</div>}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.g500, marginBottom: 6 }}><span>Budget: {LKR(p.budget)}</span><span>Actual: {LKR(p.actual)}</span></div>
          <div style={{ height: 5, borderRadius: 3, background: "#f1f5f9" }}><div style={{ height: "100%", width: p.progress + "%", background: p.progress >= 100 ? C.green : pct(p.actual, p.budget) > 90 ? C.red : C.blue, borderRadius: 3 }} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.g500, marginTop: 3 }}><span>{p.progress}%</span><span>Deadline: {p.deadline}</span></div>
        </div>;
      })}</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PROJECT DETAIL + JOB CARD
// ═══════════════════════════════════════════════════════════
const ProjectDetail = ({ p, clients, emp, onBack, setPrj, toast }) => {
  const [tab, setTab] = useState("overview");
  const [showJC, setShowJC] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [compData, setCompData] = useState({ link: "", quality: 0, timeliness: 0, communication: 0, value: 0, notes: "" });
  const cl = clients.find((c) => c.id === p.clientId);
  const bu = p.budget > 0 ? pct(p.actual, p.budget) : 0;
  const profit = p.quoted - p.actual;
  const totalReceived = (p.payments || []).reduce((s, pm) => s + pm.amt, 0);
  const outstanding = p.quoted - totalReceived;
  const cumCosts = p.costs || { labor: 0, materials: 0, tools: 0, transport: 0, indirect: 0 };
  const costData = Object.entries(cumCosts).filter(([_, v]) => v > 0).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  const cols = [C.blue, C.amber, C.red, C.purple, C.green, C.cyan];

  const [jcForm, setJcForm] = useState({ workers: [{ empId: "", task: "", hours: "8" }], materials: [{ name: "", qty: "", rate: "" }], transport: { vehicle: "", km: "", cost: "" }, indirect: { food: "", documents: "", legal: "", accommodation: "", other: "" }, notes: "" });

  const addJCWorker = () => setJcForm((f) => ({ ...f, workers: [...f.workers, { empId: "", task: "", hours: "8" }] }));
  const addJCMaterial = () => setJcForm((f) => ({ ...f, materials: [...f.materials, { name: "", qty: "", rate: "" }] }));

  // 🔴 Firebase: Job Card එක සේව් කිරීම (වියදම් අප්ඩේට් වීමත් එක්කම)
  const submitJobCard = async () => {
    const workers = jcForm.workers.filter((w) => w.empId).map((w) => {
      const e = emp.find((x) => x.id === Number(w.empId));
      return { empId: Number(w.empId), name: e?.name || "", task: w.task, hoursWorked: Number(w.hours), rate: e ? Math.round(e.salary / 22) : 0 };
    });
    const materials = jcForm.materials.filter((m) => m.name).map((m) => ({ name: m.name, qty: Number(m.qty), uom: "units", rate: Number(m.rate), total: Number(m.qty) * Number(m.rate) }));
    const tL = workers.reduce((s, w) => s + w.hoursWorked * (w.rate / 8), 0);
    const tM = materials.reduce((s, m) => s + m.total, 0);
    const tT = Number(jcForm.transport.cost) || 0;
    const tI = Object.values(jcForm.indirect).reduce((s, v) => s + (Number(v) || 0), 0);
    
    const jc = { id: Date.now(), date: TODAY, shift: "Day", workers, materials, tools: [], transport: { vehicle: jcForm.transport.vehicle, km: Number(jcForm.transport.km) || 0, cost: tT }, indirect: jcForm.indirect, totalLabor: Math.round(tL), totalMaterial: tM, totalTools: 0, totalTransport: tT, totalIndirect: tI, grandTotal: Math.round(tL) + tM + tT + tI, notes: jcForm.notes };
    
    const updatedPrj = {
      jobCards: [...(p.jobCards || []), jc],
      actual: p.actual + jc.grandTotal,
      costs: { labor: (p.costs?.labor || 0) + jc.totalLabor, materials: (p.costs?.materials || 0) + jc.totalMaterial, tools: (p.costs?.tools || 0) + jc.totalTools, transport: (p.costs?.transport || 0) + jc.totalTransport, indirect: (p.costs?.indirect || 0) + jc.totalIndirect }
    };

    if (typeof db !== "undefined" && typeof p.id === "string" && !p.id.startsWith("temp_")) {
      try {
        await updateDoc(doc(db, "projects", p.id), updatedPrj);
        setPrj((prev) => prev.map((x) => x.id === p.id ? { ...x, ...updatedPrj } : x));
        toast("Job Card saved to Firebase!");
      } catch (error) {
        console.error("Firebase Error:", error);
        toast("Error saving Job Card", "error");
      }
    } else {
      setPrj((prev) => prev.map((x) => x.id === p.id ? { ...x, ...updatedPrj } : x));
      toast("Job Card recorded (Local)");
    }
    
    setShowJC(false);
    setJcForm({ workers: [{ empId: "", task: "", hours: "8" }], materials: [{ name: "", qty: "", rate: "" }], transport: { vehicle: "", km: "", cost: "" }, indirect: { food: "", documents: "", legal: "", accommodation: "", other: "" }, notes: "" });
  };

  // 🔴 Firebase: Project එක Complete කිරීම
  const completeProject = async () => {
    const comp = { date: TODAY, customerSatisfaction: Math.round((compData.quality + compData.timeliness + compData.communication + compData.value)/4), socialReviewLink: compData.link, clientEval: { quality: compData.quality, timeliness: compData.timeliness, communication: compData.communication, value: compData.value }, notes: compData.notes };
    
    if (typeof db !== "undefined" && typeof p.id === "string" && !p.id.startsWith("temp_")) {
      try {
        await updateDoc(doc(db, "projects", p.id), { completion: comp, status: "completed" });
        setPrj((prev) => prev.map((x) => x.id === p.id ? { ...x, completion: comp, status: "completed" } : x));
        toast("Project marked as completed in Firebase!");
      } catch (error) {
         console.error("Error:", error);
         toast("Error completing", "error");
      }
    } else {
      setPrj((prev) => prev.map((x) => x.id === p.id ? { ...x, completion: comp, status: "completed" } : x));
      toast("Completed (Local)");
    }
    setShowCompletion(false);
  };

  // 🔴 Firebase: Project එක Delete කිරීම (Background Delete / Fast UI)
  const deleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project completely?")) return;
    
    const pid = p.id; // මකන Project එකේ ID එක
    
    // 1. බොත්තම එබුව ගමන් වහාම UI එකෙන් අයින් කරලා, ආපහු Projects ලිස්ට් එකට යනවා
    setPrj(prev => prev.filter(x => x.id !== pid));
    onBack();
    
    // 2. සද්ද නැතුව Background එකෙන් Firebase එකේ ඩේටා ටික මකනවා
    if (typeof db !== "undefined" && typeof pid === "string" && !String(pid).startsWith("temp_")) {
      try {
        await deleteDoc(doc(db, "projects", pid));
        toast("Project deleted from Firebase!");
      } catch (error) {
         console.error("Delete Error:", error);
         toast("Error deleting project", "error");
      }
    } else {
      toast("Project deleted (Local)");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={onBack} style={{ border: "none", background: "none", color: C.blue, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>← Back to Projects</button>
        <button onClick={deleteProject} style={{ border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", padding: "4px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>✖ Delete Project</button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div><div style={{ fontSize: 10, color: C.g500, fontFamily: "monospace" }}>{p.code} · Quotation: {p.quotationRef || "N/A"} (→Sys C)</div><h2 style={{ fontSize: 18, fontWeight: 700, margin: "2px 0" }}>{p.name}</h2><div style={{ fontSize: 12, color: C.g500 }}>{cl?.name} · {p.desc}</div></div>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}><Badge status={p.status} size="md" /><Badge status={p.priority} size="md" /></div>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>{["overview", "jobcards", "costs", "payments", "completion"].map(t => <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 14px", borderRadius: "7px 7px 0 0", border: "1px solid #e2e8f0", borderBottom: tab === t ? "2px solid " + C.blue : "1px solid #e2e8f0", background: tab === t ? C.white : "#f8fafc", color: tab === t ? C.blue : C.g500, fontSize: 11, fontWeight: tab === t ? 600 : 500, cursor: "pointer" }}>{t === "jobcards" ? "Job Cards" : t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</div>

      {tab === "overview" && <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 14 }}>
          {[{ l: "Quoted", v: LKR(p.quoted), c: C.blue }, { l: "Budget", v: LKR(p.budget), c: C.amber }, { l: "Actual", v: LKR(p.actual), c: C.red }, { l: "Profit", v: LKR(profit), c: profit > 0 ? C.green : C.red }, { l: "Received", v: LKR(totalReceived), c: C.green }, { l: "Outstanding", v: LKR(outstanding), c: outstanding > 0 ? C.amber : C.green }].map(x => <div key={x.l} style={{ background: C.white, borderRadius: 9, padding: 12, border: "1px solid #e2e8f0", textAlign: "center" }}><div style={{ fontSize: 9, color: C.g500, textTransform: "uppercase", marginBottom: 3 }}>{x.l}</div><div style={{ fontSize: 14, fontWeight: 700, color: x.c }}>{x.v}</div></div>)}
        </div>
        <div style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}><span>Budget: {bu}%</span><span style={{ fontWeight: 600, color: bu > 90 ? C.red : bu > 70 ? C.amber : C.green }}>{LKR(p.actual)} / {LKR(p.budget)}</span></div>
          <div style={{ height: 7, borderRadius: 4, background: "#f1f5f9" }}><div style={{ height: "100%", width: Math.min(bu, 100) + "%", background: bu > 90 ? C.red : bu > 70 ? C.amber : C.green, borderRadius: 4 }} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          <div style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Cumulative Cost Breakdown</h3>
            {costData.length > 0 ? <ResponsiveContainer width="100%" height={170}><PieChart><Pie data={costData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"}>{costData.map((_, i) => <Cell key={i} fill={cols[i % cols.length]} />)}</Pie><Tooltip formatter={(v) => LKR(v)} /></PieChart></ResponsiveContainer> : <div style={{ textAlign: "center", padding: 20, color: C.g500, fontSize: 11 }}>No costs yet</div>}
          </div>
          <div style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Cost Summary</h3>
            {Object.entries(cumCosts).map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f8fafc", fontSize: 11 }}><span style={{ textTransform: "capitalize", color: C.g500 }}>{k}</span><span style={{ fontWeight: 600 }}>{LKR(v)}</span></div>)}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", marginTop: 4, borderTop: "2px solid #e2e8f0", fontSize: 12, fontWeight: 700 }}><span>Total</span><span>{LKR(Object.values(cumCosts).reduce((s, v) => s + v, 0))}</span></div>
          </div>
        </div>
      </>}

      {tab === "jobcards" && <>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Job Cards ({(p.jobCards || []).length})</h3>
          {p.status === "ongoing" && <button onClick={() => setShowJC(true)} style={{ ...bP, fontSize: 10, display: "flex", alignItems: "center", gap: 3 }}><Ic name="add" size={12} color={C.white} /> New Job Card</button>}
        </div>
        {(p.jobCards || []).length === 0 ? <div style={{ background: C.white, borderRadius: 10, padding: 30, border: "1px solid #e2e8f0", textAlign: "center", color: C.g500, fontSize: 12 }}>No job cards yet. Add daily work records here.</div> :
          (p.jobCards || []).map((jc) => (
            <div key={jc.id} style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>📋 {jc.date} — {jc.shift} Shift</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.blue }}>{LKR(jc.grandTotal)}</div>
              </div>
              {/* Workers */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.g500, marginBottom: 4 }}>👷 Workers ({jc.workers.length}) — {LKR(jc.totalLabor)}</div>
                {jc.workers.map((w, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 8px", background: "#f8fafc", borderRadius: 4, marginBottom: 2, fontSize: 10 }}><span style={{ fontWeight: 500 }}>{w.name}</span><span style={{ color: C.g500 }}>{w.task}</span><span>{w.hoursWorked}h</span></div>)}
              </div>
              {/* Materials */}
              {jc.materials.length > 0 && <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.g500, marginBottom: 4 }}>📦 Materials ({jc.materials.length}) — {LKR(jc.totalMaterial)} (→Sys B deducted)</div>
                {jc.materials.map((m, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 8px", background: "#f0fdf4", borderRadius: 4, marginBottom: 2, fontSize: 10 }}><span>{m.name}</span><span>{m.qty} × {LKR(m.rate)} = {LKR(m.total)}</span></div>)}
              </div>}
              {/* Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
                {[["Labor", jc.totalLabor, C.blue], ["Material", jc.totalMaterial, C.green], ["Tools", jc.totalTools, C.purple], ["Transport", jc.totalTransport, C.amber], ["Indirect", jc.totalIndirect, C.red]].map(([l, v, c]) => (
                  <div key={l} style={{ padding: 6, borderRadius: 4, background: c + "08", textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: C.g500 }}>{l}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: c }}>{LKR(v)}</div>
                  </div>
                ))}
              </div>
              {jc.notes && <div style={{ fontSize: 10, color: C.g500, marginTop: 4, fontStyle: "italic" }}>Note: {jc.notes}</div>}
            </div>
          ))
        }
      </>}

      {tab === "costs" && <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 14 }}>
          {Object.entries(cumCosts).map(([k, v]) => <div key={k} style={{ background: C.white, borderRadius: 9, padding: 12, border: "1px solid #e2e8f0", textAlign: "center" }}><div style={{ fontSize: 9, color: C.g500, textTransform: "uppercase" }}>{k}</div><div style={{ fontSize: 16, fontWeight: 700 }}>{LKR(v)}</div><div style={{ fontSize: 9, color: C.g500 }}>{pct(v, p.actual)}% of total</div></div>)}
        </div>
        {costData.length > 0 && <div style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}><ResponsiveContainer width="100%" height={200}><BarChart data={costData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => (v / 1000) + "K"} /><Tooltip formatter={(v) => LKR(v)} /><Bar dataKey="value" fill={C.blue} radius={[3, 3, 0, 0]} barSize={30} /></BarChart></ResponsiveContainer></div>}
      </div>}

      {tab === "payments" && <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8, marginBottom: 12 }}>{(p.payments || []).map((pm, i) => <div key={i} style={{ padding: 12, borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0" }}><div style={{ fontSize: 9, color: C.g500, textTransform: "uppercase" }}>{pm.type}</div><div style={{ fontSize: 16, fontWeight: 700, color: C.green }}>{LKR(pm.amt)}</div><div style={{ fontSize: 10, color: C.g500 }}>{pm.date} · {pm.method} · {pm.ref}</div></div>)}</div>
        <div style={{ padding: 10, background: "#eff6ff", borderRadius: 6, fontSize: 11, color: C.blue }}>Received: {LKR(totalReceived)} · Outstanding: {LKR(outstanding)}</div>
      </div>}

      {tab === "completion" && <div>
        {p.completion ? <div style={{ background: C.white, borderRadius: 10, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>✅ Project Completion Report</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>{[["Completion Date", p.completion.date], ["Customer Satisfaction", null], ["Social Review", p.completion.socialReviewLink ? <a href={p.completion.socialReviewLink} target="_blank" style={{ color: C.blue, fontSize: 10 }}>View Review ↗</a> : "N/A"]].map(([l, v]) => v !== null ? <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f8fafc", fontSize: 11 }}><span style={{ color: C.g500 }}>{l}</span><span style={{ fontWeight: 500 }}>{v}</span></div> : <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f8fafc", fontSize: 11 }}><span style={{ color: C.g500 }}>{l}</span><Stars val={p.completion.customerSatisfaction} /></div>)}</div>
            <div><div style={{ fontSize: 10, fontWeight: 600, marginBottom: 6 }}>Client Evaluation (→synced to Client DB)</div>{p.completion.clientEval && Object.entries(p.completion.clientEval).map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11 }}><span style={{ color: C.g500, textTransform: "capitalize" }}>{k}</span><Stars val={v} /></div>)}</div>
          </div>
          {p.completion.notes && <div style={{ marginTop: 8, padding: 8, background: "#f8fafc", borderRadius: 6, fontSize: 11, color: C.g500 }}>{p.completion.notes}</div>}
        </div> : <div style={{ background: C.white, borderRadius: 10, padding: 20, border: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.g500, marginBottom: 8 }}>Project not yet completed</div>
          {p.status === "ongoing" && <button onClick={() => setShowCompletion(true)} style={{ ...bP, background: C.green }}>Mark Complete</button>}
        </div>}
      </div>}

      {/* New Job Card Modal */}
      {showJC && <Modal title="New Job Card Entry" onClose={() => setShowJC(false)} w={700}>
        <div style={{ background: "#eff6ff", borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 10, color: C.blue }}><strong>Project:</strong> {p.name} · <strong>Date:</strong> {TODAY} · <strong>Syncs:</strong> Attendance, Inventory (→Sys B)</div>
        {/* Workers */}
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 11, fontWeight: 600 }}>👷 Workers (from Employee Pool)</span><button onClick={addJCWorker} style={{ fontSize: 10, color: C.blue, border: "none", background: "none", cursor: "pointer" }}>+ Add</button></div>
          {jcForm.workers.map((w, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: 4, marginBottom: 4 }}>
              <select value={w.empId} onChange={(e) => { const ws = [...jcForm.workers]; ws[idx] = { ...ws[idx], empId: e.target.value }; setJcForm((f) => ({ ...f, workers: ws })); }} style={{ ...sS, fontSize: 10 }}><option value="">Select employee...</option>{emp.filter((e) => e.pool === "employee").map((e) => <option key={e.id} value={e.id}>{e.name} — {e.desg}</option>)}</select>
              <input value={w.task} onChange={(e) => { const ws = [...jcForm.workers]; ws[idx] = { ...ws[idx], task: e.target.value }; setJcForm((f) => ({ ...f, workers: ws })); }} style={{ ...iS, fontSize: 10 }} placeholder="Task (e.g. Welding)" />
              <input type="number" value={w.hours} onChange={(e) => { const ws = [...jcForm.workers]; ws[idx] = { ...ws[idx], hours: e.target.value }; setJcForm((f) => ({ ...f, workers: ws })); }} style={{ ...iS, fontSize: 10 }} placeholder="Hours" />
            </div>
          ))}
        </div>
        {/* Materials */}
        <div style={{ background: "#f0fdf4", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 11, fontWeight: 600 }}>📦 Materials (deducted from Sys B)</span><button onClick={addJCMaterial} style={{ fontSize: 10, color: C.blue, border: "none", background: "none", cursor: "pointer" }}>+ Add</button></div>
          {jcForm.materials.map((m, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr", gap: 4, marginBottom: 4 }}>
              <input value={m.name} onChange={(e) => { const ms = [...jcForm.materials]; ms[idx] = { ...ms[idx], name: e.target.value }; setJcForm((f) => ({ ...f, materials: ms })); }} style={{ ...iS, fontSize: 10 }} placeholder="Material name" />
              <input type="number" value={m.qty} onChange={(e) => { const ms = [...jcForm.materials]; ms[idx] = { ...ms[idx], qty: e.target.value }; setJcForm((f) => ({ ...f, materials: ms })); }} style={{ ...iS, fontSize: 10 }} placeholder="Qty" />
              <input type="number" value={m.rate} onChange={(e) => { const ms = [...jcForm.materials]; ms[idx] = { ...ms[idx], rate: e.target.value }; setJcForm((f) => ({ ...f, materials: ms })); }} style={{ ...iS, fontSize: 10 }} placeholder="Rate" />
            </div>
          ))}
        </div>
        {/* Transport */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          <Fl label="Vehicle"><input value={jcForm.transport.vehicle} onChange={(e) => setJcForm((f) => ({ ...f, transport: { ...f.transport, vehicle: e.target.value } }))} style={iS} /></Fl>
          <Fl label="KM"><input type="number" value={jcForm.transport.km} onChange={(e) => setJcForm((f) => ({ ...f, transport: { ...f.transport, km: e.target.value } }))} style={iS} /></Fl>
          <Fl label="Transport Cost"><input type="number" value={jcForm.transport.cost} onChange={(e) => setJcForm((f) => ({ ...f, transport: { ...f.transport, cost: e.target.value } }))} style={iS} /></Fl>
        </div>
        {/* Indirect */}
        <div style={{ background: "#fef3c7", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Indirect Costs</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 6 }}>
            {["food", "documents", "legal", "accommodation", "other"].map(k => (
              <Fl key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}><input type="number" value={jcForm.indirect[k]} onChange={(e) => setJcForm((f) => ({ ...f, indirect: { ...f.indirect, [k]: e.target.value } }))} style={iS} placeholder="0" /></Fl>
            ))}
          </div>
        </div>
        <Fl label="Notes"><textarea value={jcForm.notes} onChange={(e) => setJcForm((f) => ({ ...f, notes: e.target.value }))} style={{ ...iS, height: 40 }} /></Fl>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}><button onClick={() => setShowJC(false)} style={bS}>Cancel</button><button onClick={submitJobCard} style={bP}>Submit Job Card</button></div>
      </Modal>}

      {/* Completion Modal */}
      {showCompletion && <Modal title="Project Completion" onClose={() => setShowCompletion(false)} w={500}>
        <p style={{ fontSize: 11, color: C.g500, margin: "0 0 12px" }}>Record completion details. Syncs to Client DB.</p>
        <Fl label="Social Media Review Link"><input value={compData.link} onChange={e=>setCompData({...compData, link: e.target.value})} style={iS} placeholder="https://..." /></Fl>
        <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 6 }}>Client Evaluation (1-5)</div>
        {["quality", "timeliness", "communication", "value"].map(d => (
          <div key={d} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 11, textTransform: "capitalize" }}>{d}</span>
            <div style={{ display: "flex", gap: 3 }}>{[1, 2, 3, 4, 5].map(v => <button key={v} onClick={() => setCompData({...compData, [d]: v})} style={{ width: 26, height: 26, borderRadius: 5, border: "1px solid #e2e8f0", background: compData[d] >= v ? C.blue : C.white, color: compData[d] >= v ? C.white : C.g700, fontSize: 10, cursor: "pointer" }}>{v}</button>)}</div>
          </div>
        ))}
        <Fl label="Notes"><textarea value={compData.notes} onChange={e=>setCompData({...compData, notes: e.target.value})} style={{ ...iS, height: 40 }} /></Fl>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 8 }}><button onClick={() => setShowCompletion(false)} style={bS}>Cancel</button><button onClick={completeProject} style={{ ...bP, background: C.green }}>Complete Project</button></div>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// CLIENTS VIEW
// ═══════════════════════════════════════════════════════════
const ClientsView = ({ clients, setClients, prj, toast }) => {
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fm, setFm] = useState({ name: "", company: "", phone: "", email: "", friendliness: "good", financial: "good", loyalty: "medium", flexibility: "medium", remarks: "" });

  const openAdd = () => { setFm({ name: "", company: "", phone: "", email: "", friendliness: "good", financial: "good", loyalty: "medium", flexibility: "medium", remarks: "" }); setEditId(null); setShow(true); };
  const openEdit = (c) => { setFm({ ...c }); setEditId(c.id); setShow(true); };

  // 🔴 Firebase එකට දත්ත Save/Edit කරන කොටස
  const saveClient = async () => {
    if (!fm.name) return toast("Enter name", "error");
    const cData = { ...fm, projectHistory: fm.projectHistory || [], satisfaction: fm.satisfaction || 0, socialLinks: fm.socialLinks || "", totalBusiness: fm.totalBusiness || 0, lastProject: fm.lastProject || "" };

    if (typeof db !== "undefined") {
      setLoading(true);
      try {
        if (editId && typeof editId === "string" && !editId.startsWith("temp_")) {
          await updateDoc(doc(db, "clients", editId), cData);
          setClients(p => p.map(x => x.id === editId ? { id: editId, ...cData } : x));
          toast("Client updated successfully!");
        } else {
          const docRef = await addDoc(collection(db, "clients"), cData);
          setClients((p) => [...p, { id: docRef.id, ...cData }]);
          toast("Client saved to Firebase!");
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        toast("Error saving client", "error");
      }
      setLoading(false);
    } else {
      if (editId) {
        setClients(p => p.map(x => x.id === editId ? { id: editId, ...cData } : x));
        toast("Updated (Local)");
      } else {
        setClients((p) => [...p, { id: `temp_${Date.now()}`, ...cData }]);
        toast("Client added (Local)");
      }
    }
    setShow(false);
  };

  // 🔴 Firebase එකෙන් මකා දමන (Delete) කොටස
  const deleteClient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    if (typeof db !== "undefined" && typeof id === "string" && !id.startsWith("temp_")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "clients", id));
        setClients(p => p.filter(c => c.id !== id));
        toast("Client deleted!");
      } catch (e) {
        console.error("Delete Error:", e);
        toast("Error deleting", "error");
      }
      setLoading(false);
    } else {
      setClients(p => p.filter(c => c.id !== id));
      toast("Deleted (Local)");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 14 }}>Client Database ({clients.length})</h3>
        <button onClick={openAdd} style={{ ...bP, display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}><Ic name="add" size={14} color={C.white} />Add Client</button>
      </div>
      <div style={{ display: "grid", gap: 10 }}>{clients.map((c) => {
        const cPrj = prj.filter((p) => p.clientId === c.id);
        return <div key={c.id} style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: C.g500 }}>{c.company} · {c.phone} · {c.email}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Stars val={c.satisfaction} />
              <div style={{ fontSize: 10, color: C.g500 }}>Total: {LKR(c.totalBusiness)}</div>
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", marginTop: 6 }}>
                <button onClick={() => openEdit(c)} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, padding: "0 2px" }}><Ic name="edit" size={12} /></button>
                <button onClick={() => deleteClient(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: "0 2px", fontWeight: "bold" }}>✖</button>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>{[["Friendliness", c.friendliness], ["Financial", c.financial], ["Loyalty", c.loyalty], ["Flexibility", c.flexibility]].map(([l, v]) => <div key={l} style={{ fontSize: 10 }}><span style={{ color: C.g500 }}>{l}: </span><Badge status={v} /></div>)}</div>
          {cPrj.length > 0 && <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>{cPrj.map((p) => <span key={p.id} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "#eff6ff", color: C.blue }}>{p.code} <Badge status={p.status} /></span>)}</div>}
          {c.remarks && <div style={{ fontSize: 10, color: C.g500, marginTop: 6, fontStyle: "italic" }}>{c.remarks}</div>}
        </div>;
      })}</div>
      
      {show && <Modal title={editId ? "Edit Client" : "Add Client"} onClose={() => setShow(false)} w={500}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Fl label="Name" req><input value={fm.name} onChange={(e) => setFm((f) => ({ ...f, name: e.target.value }))} style={iS} /></Fl><Fl label="Company"><input value={fm.company} onChange={(e) => setFm((f) => ({ ...f, company: e.target.value }))} style={iS} /></Fl></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Fl label="Phone"><input value={fm.phone} onChange={(e) => setFm((f) => ({ ...f, phone: e.target.value }))} style={iS} /></Fl><Fl label="Email"><input value={fm.email} onChange={(e) => setFm((f) => ({ ...f, email: e.target.value }))} style={iS} /></Fl></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>{[["Friendliness", "friendliness"], ["Financial", "financial"], ["Loyalty", "loyalty"], ["Flexibility", "flexibility"]].map(([l, k]) => <Fl key={k} label={l}><select value={fm[k]} onChange={(e) => setFm((f) => ({ ...f, [k]: e.target.value }))} style={sS}>{["excellent", "good", "average", "poor"].map(o => <option key={o}>{o}</option>)}</select></Fl>)}</div>
        <Fl label="Remarks"><textarea value={fm.remarks} onChange={(e) => setFm((f) => ({ ...f, remarks: e.target.value }))} style={{ ...iS, height: 50 }} /></Fl>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}><button onClick={() => setShow(false)} style={bS} disabled={loading}>Cancel</button><button onClick={saveClient} style={bP} disabled={loading}>{loading ? "Saving..." : (editId ? "Update" : "Add")}</button></div>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// HR DASHBOARD (Employee Dashboard)
// ═══════════════════════════════════════════════════════════
const HRDashboard = ({ emp, leave, payHist, prj, nav }) => {
  const staff = emp.filter((e) => e.pool === "employee");
  const bestEmp = [...staff].sort((a, b) => (b.evalHistory?.[b.evalHistory.length - 1]?.avg || 0) - (a.evalHistory?.[a.evalHistory.length - 1]?.avg || 0));
  const topPerformers = bestEmp.slice(0, 3);
  const needsImprovement = bestEmp.slice(-2).reverse();
  const totalPayroll = staff.reduce((s, e) => s + e.salary, 0);
  const paidThisMonth = payHist.reduce((s, p) => s + (p.status === "paid" ? p.net : 0), 0);
  const duePayments = emp.filter((e) => e.payDue > 0);
  const pendingLeave = leave.filter((l) => l.status === "pending");
  const ongoingProjects = prj.filter((p) => p.status === "ongoing");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
        <Stat icon="people" title="Total Staff" value={staff.length} sub={`${emp.filter((e) => e.pool !== "employee").length} external`} color={C.blue} />
        <Stat icon="payroll" title="Monthly Payroll" value={LKR(totalPayroll)} color={C.green} />
        <Stat icon="payroll" title="Paid (Feb)" value={LKR(paidThisMonth)} color={C.teal} />
        <Stat icon="alert" title="Payments Due" value={duePayments.length > 0 ? LKR(duePayments.reduce((s, e) => s + e.payDue, 0)) : "None"} color={duePayments.length > 0 ? C.red : C.green} />
        <Stat icon="leave" title="Pending Leave" value={pendingLeave.length} color={C.amber} />
        <Stat icon="attendance" title="Next Month Est." value={LKR(Math.round(totalPayroll * 1.05))} sub="Based on active jobs" color={C.purple} />
      </div>
      {/* Best & Needs Improvement */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: C.green, marginBottom: 8 }}>🏆 Best Performers (This Week)</h3>
          {topPerformers.map((e, i) => <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? "#fef3c7" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: i === 0 ? "#92400e" : C.g500 }}>{i + 1}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{e.name}</div><div style={{ fontSize: 10, color: C.g500 }}>{e.desg}</div></div>
            <Stars val={e.evalHistory?.[e.evalHistory.length - 1]?.avg || 0} />
          </div>)}
        </div>
        <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 8 }}>⚠️ Needs Improvement</h3>
          {needsImprovement.map((e) => <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>⚠</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{e.name}</div><div style={{ fontSize: 10, color: C.g500 }}>{e.desg} · Attendance: {e.attendance?.present || 0}/{e.attendance?.total || 0}</div></div>
            <Stars val={e.evalHistory?.[e.evalHistory.length - 1]?.avg || 0} />
          </div>)}
        </div>
      </div>
      {/* Payroll Comparison */}
      <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Payroll Comparison & Predictions</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={[{ month: "Dec", actual: 298000, predicted: 300000 }, { month: "Jan", actual: 305000, predicted: 310000 }, { month: "Feb", actual: 313000, predicted: 315000 }, { month: "Mar", actual: 0, predicted: 328000 }, { month: "Apr", actual: 0, predicted: 335000 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => (v / 1000) + "K"} /><Tooltip formatter={(v) => LKR(v)} /><Legend wrapperStyle={{ fontSize: 9 }} />
            <Bar dataKey="actual" fill={C.blue} name="Actual" barSize={14} /><Bar dataKey="predicted" fill={C.amber} name="Predicted" barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Leave Requests */}
      {leave.length > 0 && <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><h3 style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>Leave Requests</h3></div>
        {leave.map((l) => <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}><div><span style={{ fontWeight: 600, fontSize: 12 }}>{l.empName}</span> <Badge status={l.status} /> <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "#eff6ff", color: C.blue }}>{l.type}</span><div style={{ fontSize: 10, color: C.g500 }}>{l.from} → {l.to} ({l.days}d) — {l.reason}</div></div>{l.status === "pending" && <div style={{ display: "flex", gap: 3 }}><button style={{ padding: "3px 8px", borderRadius: 4, border: "none", background: C.green, color: C.white, fontSize: 9, cursor: "pointer" }}>✓</button><button style={{ padding: "3px 8px", borderRadius: 4, border: "1px solid #e2e8f0", background: C.white, color: C.red, fontSize: 9, cursor: "pointer" }}>✗</button></div>}</div>)}
      </div>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// EMPLOYEES VIEW
// ═══════════════════════════════════════════════════════════
const EmployeesView = ({ emp, setSE, onAdd }) => {
  const [q, setQ] = useState(""); const [pool, setPool] = useState("all"); const [sort, setSort] = useState("name");
  const fl = emp.filter((e) => { const ms = e.name.toLowerCase().includes(q.toLowerCase()); const mp = pool === "all" || e.pool === pool; return ms && mp; }).sort((a, b) => sort === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}><span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}><Ic name="search" size={13} color={C.g500} /></span><input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} style={{ ...iS, width: 170, paddingLeft: 28 }} /></div>
          <div style={{ display: "flex", gap: 3 }}>{[["all", "All"], ["employee", "Employees"], ["subcontractor", "Sub-con"], ["service_provider", "Service"]].map(([v, l]) => <button key={v} onClick={() => setPool(v)} style={{ padding: "4px 9px", borderRadius: 7, border: "1px solid", borderColor: pool === v ? C.blue : "#e2e8f0", background: pool === v ? C.blue : C.white, color: pool === v ? C.white : C.g700, fontSize: 10, cursor: "pointer" }}>{l}</button>)}</div>
        </div>
        <button onClick={onAdd} style={{ ...bP, display: "flex", alignItems: "center", gap: 3, fontSize: 10 }}><Ic name="add" size={14} color={C.white} />Add</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>{fl.map((e) => (
        <div key={e.id} onClick={() => setSE(e)} style={{ background: C.white, borderRadius: 12, padding: 14, border: "1px solid #e2e8f0", cursor: "pointer", display: "flex", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: `hsl(${e.id * 37},50%,85%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: `hsl(${e.id * 37},50%,35%)`, flexShrink: 0 }}>{ini(e.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 13, fontWeight: 700 }}>{e.name}</span><Stars val={e.evalHistory?.[e.evalHistory.length - 1]?.avg || e.rating} /></div>
            <div style={{ fontSize: 10, color: C.g500, marginTop: 1 }}>{e.desg} · {e.dept}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}><Badge status={e.pool} /><Badge status={e.type} />{e.payDue > 0 && <span style={{ fontSize: 9, color: C.red, fontWeight: 600 }}>Due: {LKR(e.payDue)}</span>}</div>
          </div>
        </div>
      ))}</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// EMPLOYEE DETAIL (with dual spider charts & history)
// ═══════════════════════════════════════════════════════════
const EmpDetail = ({ e, emp, setEmp, onBack, toast }) => {
  const [showEval, setShowEval] = useState(false);
  const [evalScores, setEvalScores] = useState({ loyalty: 0, skill: 0, dedication: 0, integrity: 0, teamwork: 0, reliability: 0, attendance: 0 });
  const yrs = ((new Date().getTime() - new Date(e.joined).getTime()) / (365.25 * 864e5)).toFixed(1);
  const epfE = Math.round(e.salary * 0.08), epfR = Math.round(e.salary * 0.12), etf = Math.round(e.salary * 0.03);
  const currentEval = e.eval ? Object.entries(e.eval).map(([k, v]) => ({ axis: k.charAt(0).toUpperCase() + k.slice(1), current: v })) : [];
  const avgCurrent = currentEval.length > 0 ? (currentEval.reduce((s, d) => s + d.current, 0) / currentEval.length) : 0;
  
  // Last 3 months avg
  const last3 = (e.evalHistory || []).slice(-3);
  const last3Avg = last3.length > 0 ? last3.reduce((s, h) => s + h.avg, 0) / last3.length : 0;
  const allTimeAvg = (e.evalHistory || []).length > 0 ? (e.evalHistory || []).reduce((s, h) => s + h.avg, 0) / (e.evalHistory || []).length : 0;
  
  // Combine for dual radar
  const dualRadarData = currentEval.map(d => {
    const last3Scores = last3.length > 0 ? last3.reduce((s, h) => s + (h.scores?.[d.axis.toLowerCase()] || 0), 0) / last3.length : 0;
    return { ...d, last3: Number(last3Scores.toFixed(1)) };
  });
  
  // Worm chart data
  const wormData = (e.evalHistory || []).map((h) => ({ date: h.date?.substring(5) || "", avg: h.avg }));

  // 🔴 Firebase එකට Evaluation සේව් කරන කොටස
  const submitEval = async () => {
    const avg = Number((Object.values(evalScores).reduce((s, v) => s + v, 0) / 7).toFixed(2));
    const newHist = { date: TODAY, scores: { ...evalScores }, avg };
    
    if (typeof db !== "undefined" && typeof e.id === "string" && !e.id.startsWith("temp_")) {
      try {
        await updateDoc(doc(db, "employees", e.id), {
          eval: { ...evalScores },
          evalHistory: [...(e.evalHistory || []), newHist],
          rating: avg
        });
        setEmp((prev) => prev.map((x) => x.id === e.id ? { ...x, eval: { ...evalScores }, evalHistory: [...(x.evalHistory || []), newHist], rating: avg } : x));
        toast("Evaluation saved to Firebase!");
      } catch (error) {
        console.error("Firebase Error:", error);
        toast("Error saving evaluation", "error");
      }
    } else {
      setEmp((prev) => prev.map((x) => x.id === e.id ? { ...x, eval: { ...evalScores }, evalHistory: [...(x.evalHistory || []), newHist], rating: avg } : x));
      toast("Evaluation saved (Local)");
    }
    setShowEval(false);
  };

  // 🔴 Firebase එකෙන් සේවකයා මකා දමන (Delete) කොටස
  const deleteEmployee = async () => {
    if (!window.confirm(`Are you sure you want to delete ${e.name}?`)) return;
    if (typeof db !== "undefined" && typeof e.id === "string" && !e.id.startsWith("temp_")) {
      try {
        await deleteDoc(doc(db, "employees", e.id));
        setEmp(p => p.filter(x => x.id !== e.id));
        toast("Employee deleted from Firebase!");
        onBack();
      } catch (error) {
        console.error("Delete Error:", error);
        toast("Error deleting", "error");
      }
    } else {
      setEmp(p => p.filter(x => x.id !== e.id));
      toast("Deleted (Local)");
      onBack();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={onBack} style={{ border: "none", background: "none", color: C.blue, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>← Back to Pool</button>
        <button onClick={deleteEmployee} style={{ border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", padding: "4px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>✖ Delete Employee</button>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Left Side */}
        <div>
          <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: `hsl(${e.id * 37},50%,85%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: `hsl(${e.id * 37},50%,35%)` }}>{e.name.substring(0,2).toUpperCase()}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{e.name}</h2><Badge status={e.pool} /></div>
                <div style={{ fontSize: 11, color: C.g500 }}>{e.desg} · {e.dept} · {e.code}</div>
              </div>
            </div>
          </div>
          
          <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0", marginBottom: 12 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Details</h3>
            {[["Phone", e.phone], ["Address", e.address], ["Blood", e.blood], ["EPF", e.epf || "-"], ["Joined", e.joined], ["Service", yrs + " yrs"], ["Specialty", e.specialty], ["Capabilities", e.capabilities], ["Payment", e.paymentCycle]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f8fafc", fontSize: 11 }}><span style={{ color: C.g500 }}>{l}</span><span style={{ fontWeight: 500, maxWidth: "55%", textAlign: "right" }}>{v}</span></div>)}
          </div>
          
          <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0", marginBottom: 12 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Attendance (This Month)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
              {[["Present", e.attendance?.present || 0, C.green], ["Absent", e.attendance?.absent || 0, C.red], ["Leave", e.attendance?.leave || 0, C.purple], ["Total", e.attendance?.total || 0, C.blue]].map(([l, v, c]) => <div key={l} style={{ padding: 8, borderRadius: 6, background: c + "08", textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 800, color: c }}>{v}</div><div style={{ fontSize: 9, color: C.g500 }}>{l}</div></div>)}
            </div>
          </div>
          
          {e.nok && <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}><h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Next of Kin</h3>{[["Name", e.nok], ["Rel", e.nokRel], ["Phone", e.nokPhone]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11 }}><span style={{ color: C.g500 }}>{l}</span><span style={{ fontWeight: 500 }}>{v}</span></div>)}</div>}
        </div>
        
        {/* Right Side */}
        <div>
          <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0", marginBottom: 12 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Pay Summary</h3>
            {e.salary > 0 ? [["Basic", LKR(e.salary)], ["EPF 8%", LKR(epfE)], ["EPF Emp 12%", LKR(epfR)], ["ETF 3%", LKR(etf)], ["Net", LKR(e.salary - epfE)]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f8fafc", fontSize: 11 }}><span style={{ color: C.g500 }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span></div>) : <div style={{ fontSize: 11, color: C.g500 }}>Rate: {LKR(e.rate)}/day{e.payDue > 0 && <div style={{ marginTop: 6, color: C.red, fontWeight: 600 }}>Due: {LKR(e.payDue)}</div>}</div>}
          </div>
          
          <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}><h3 style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>Performance</h3><button onClick={() => { setEvalScores(e.eval || { loyalty: 0, skill: 0, dedication: 0, integrity: 0, teamwork: 0, reliability: 0, attendance: 0 }); setShowEval(true); }} style={{ ...bP, padding: "4px 10px", fontSize: 10 }}>Evaluate</button></div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 4 }}>
              <div style={{ textAlign: "center" }}><span style={{ fontSize: 22, fontWeight: 800, color: last3Avg >= 4 ? C.green : last3Avg >= 3 ? C.amber : C.red }}>{last3Avg.toFixed(1)}</span><div style={{ fontSize: 8, color: C.g500 }}>Last 3 Mo</div></div>
              <div style={{ textAlign: "center" }}><span style={{ fontSize: 22, fontWeight: 800, color: allTimeAvg >= 4 ? C.green : allTimeAvg >= 3 ? C.amber : C.red }}>{allTimeAvg.toFixed(1)}</span><div style={{ fontSize: 8, color: C.g500 }}>All Time</div></div>
            </div>
            {dualRadarData.length > 0 && <ResponsiveContainer width="100%" height={180}><RadarChart data={dualRadarData}><PolarGrid stroke="#e2e8f0" /><PolarAngleAxis dataKey="axis" tick={{ fontSize: 8 }} /><PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 7 }} /><Radar dataKey="current" stroke={C.blue} fill={C.blue} fillOpacity={.15} strokeWidth={2} name="Current" /><Radar dataKey="last3" stroke={C.amber} fill={C.amber} fillOpacity={.1} strokeWidth={1.5} strokeDasharray="5 5" name="3-Mo Avg" /><Legend wrapperStyle={{ fontSize: 8 }} /></RadarChart></ResponsiveContainer>}
          </div>
          
          {wormData.length > 1 && <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0", marginBottom: 12 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Performance Trend</h3>
            <ResponsiveContainer width="100%" height={100}><LineChart data={wormData}><XAxis dataKey="date" tick={{ fontSize: 8 }} /><YAxis domain={[0, 5]} tick={{ fontSize: 8 }} /><Tooltip /><Line type="monotone" dataKey="avg" stroke={C.blue} strokeWidth={2} dot={{ r: 3, fill: C.blue }} /></LineChart></ResponsiveContainer>
          </div>}
          
          {(e.evalHistory || []).length > 0 && <div style={{ background: C.white, borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Evaluation History</h3>
            {(e.evalHistory || []).slice().reverse().map((h, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f8fafc", fontSize: 10 }}><span style={{ fontFamily: "monospace" }}>{h.date}</span><Stars val={h.avg} /><span style={{ fontWeight: 600, color: h.avg >= 4 ? C.green : h.avg >= 3 ? C.amber : C.red }}>{h.avg.toFixed(2)}</span></div>)}
          </div>}
        </div>
      </div>

      {showEval && <Modal title={`Evaluate: ${e.name}`} onClose={() => setShowEval(false)} w={450}>
        <p style={{ fontSize: 11, color: C.g500, margin: "0 0 12px" }}>Rate 1-5 each dimension</p>
        {["Loyalty", "Skill", "Dedication", "Integrity", "Teamwork", "Reliability", "Attendance"].map(dim => (
          <div key={dim} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 12 }}>{dim}</span>
            <div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4, 5].map(v => <button key={v} onClick={() => setEvalScores((s) => ({ ...s, [dim.toLowerCase()]: v }))} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e2e8f0", background: v <= (evalScores[dim.toLowerCase()] || 0) ? C.blue : C.white, color: v <= (evalScores[dim.toLowerCase()] || 0) ? C.white : C.g500, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{v}</button>)}</div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 12 }}>
          <button onClick={() => setShowEval(false)} style={bS}>Cancel</button>
          <button onClick={submitEval} style={bP}>Save Evaluation</button>
        </div>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ATTENDANCE VIEW
// ═══════════════════════════════════════════════════════════
const AttendanceView = ({ att, setAtt, emp, prj, toast }) => {
  const [show, setShow] = useState(false);
  const [fm, setFm] = useState({ date: TODAY, empId: "", status: "present", inTime: "08:00", outTime: "17:00", project: "", task: "" });

  const staff = emp.filter((e) => e.pool === "employee");
  const present = att.filter((a) => a.date === TODAY && a.status === "present").length;
  const absent = att.filter((a) => a.date === TODAY && a.status === "absent").length;
  const onLeave = att.filter((a) => a.date === TODAY && a.status === "leave").length;

  const markAtt = async () => {
    if (!fm.empId) return toast("Select employee", "error");
    const e = emp.find(x => String(x.id) === String(fm.empId));
    
    let hours = 0, ot = 0;
    if (fm.status === "present" && fm.inTime && fm.outTime) {
        const t1 = new Date(`2000-01-01T${fm.inTime}`);
        const t2 = new Date(`2000-01-01T${fm.outTime}`);
        hours = (t2 - t1) / 3600000;
        if (hours > 9) ot = hours - 9; // assuming 1 hr lunch break
    }

    const rec = { date: fm.date, empId: e.id, empName: e.name, status: fm.status, inTime: fm.status==="present"?fm.inTime:"", outTime: fm.status==="present"?fm.outTime:"", hours: Number(hours.toFixed(2)), otHours: Number(ot.toFixed(2)), project: fm.project, task: fm.task };
    const tempId = "temp_" + Date.now();
    
    // Background UI Update
    setAtt(p => [{ id: tempId, ...rec }, ...p]);
    setShow(false);

    if (typeof db !== "undefined") {
      try {
        const docRef = await addDoc(collection(db, "attendance"), rec);
        setAtt(p => p.map(x => x.id === tempId ? { ...x, id: docRef.id } : x));
        toast("Attendance saved to Firebase");
      } catch (err) {
        console.error(err);
        toast("Error saving", "error");
      }
    }
  };

  const deleteAtt = async (id) => {
    if (!window.confirm("Delete record?")) return;
    setAtt(p => p.filter(x => x.id !== id));
    if (typeof db !== "undefined" && !String(id).startsWith("temp_")) {
      await deleteDoc(doc(db, "attendance", id));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
          <Stat icon="attendance" title="Present (Today)" value={present} color={C.green} /><Stat icon="leave" title="Leave" value={onLeave} color={C.purple} /><Stat icon="alert" title="Absent" value={absent} color={C.red} /><Stat icon="people" title="Total Staff" value={staff.length} color={C.blue} />
        </div>
        <button onClick={() => setShow(true)} style={{ ...bP, height: "fit-content", fontSize: 10 }}>+ Mark Attendance</button>
      </div>
      <div style={{ background: C.white, borderRadius: 10, overflow: "auto", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 600 }}>
          <thead><tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>{["Date", "Employee", "Status", "In", "Out", "Hours", "OT", "Project", ""].map(h => <th key={h} style={{ textAlign: "left", padding: "7px 6px", fontSize: 9, color: C.g500, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{att.map((a) => <tr key={a.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
            <td style={{ padding: "6px", fontFamily: "monospace", fontSize: 10 }}>{a.date}</td>
            <td style={{ padding: "6px", fontWeight: 500 }}>{a.empName}</td>
            <td style={{ padding: "6px" }}><Badge status={a.status} /></td>
            <td style={{ padding: "6px", fontFamily: "monospace", fontSize: 10 }}>{a.inTime || "-"}</td>
            <td style={{ padding: "6px", fontFamily: "monospace", fontSize: 10 }}>{a.outTime || "-"}</td>
            <td style={{ padding: "6px", fontWeight: 500 }}>{a.hours || "-"}</td>
            <td style={{ padding: "6px", color: a.otHours > 0 ? C.amber : "inherit", fontWeight: 500 }}>{a.otHours || "-"}</td>
            <td style={{ padding: "6px", fontSize: 10, color: C.g500 }}>{a.project || "-"}</td>
            <td style={{ padding: "6px", textAlign: "right" }}><button onClick={()=>deleteAtt(a.id)} style={{border:"none", background:"none", color: C.red, cursor:"pointer"}}>✖</button></td>
          </tr>)}</tbody>
        </table>
      </div>
      
      {show && <Modal title="Mark Attendance" onClose={() => setShow(false)} w={450}>
        <Fl label="Date" req><input type="date" value={fm.date} onChange={e=>setFm({...fm, date: e.target.value})} style={iS}/></Fl>
        <Fl label="Employee" req><select value={fm.empId} onChange={e=>setFm({...fm, empId: e.target.value})} style={sS}><option value="">Select...</option>{staff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Fl>
        <Fl label="Status"><select value={fm.status} onChange={e=>setFm({...fm, status: e.target.value})} style={sS}><option value="present">Present</option><option value="absent">Absent</option><option value="leave">Leave</option></select></Fl>
        {fm.status === "present" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
           <Fl label="In Time"><input type="time" value={fm.inTime} onChange={e=>setFm({...fm, inTime: e.target.value})} style={iS}/></Fl>
           <Fl label="Out Time"><input type="time" value={fm.outTime} onChange={e=>setFm({...fm, outTime: e.target.value})} style={iS}/></Fl>
        </div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Fl label="Project"><input value={fm.project} onChange={e=>setFm({...fm, project: e.target.value})} placeholder="PRJ-..." style={iS}/></Fl>
          <Fl label="Task"><input value={fm.task} onChange={e=>setFm({...fm, task: e.target.value})} placeholder="e.g Welding" style={iS}/></Fl>
        </div>
        <div style={{display:"flex", justifyContent:"flex-end", gap:6}}><button onClick={()=>setShow(false)} style={bS}>Cancel</button><button onClick={markAtt} style={bP}>Save Record</button></div>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PAYROLL VIEW (with payment widget)
// ═══════════════════════════════════════════════════════════
const PayrollView = ({ emp, setEmp, payHist, setPayHist, setTxn, toast }) => {
  const [showPay, setShowPay] = useState(false);
  const [payEmp, setPayEmp] = useState(null);
  const [payForm, setPayForm] = useState({ method: "bank", receipt: "", notes: "" });
  const staff = emp.filter((e) => e.pool === "employee" && e.salary > 0);
  
  const pd = useMemo(() => staff.map((e) => {
    const otH = e.otHours || 0; const otR = Math.round(otH * (e.salary / 208) * 1.5);
    const gr = e.salary + otR; const eE = Math.round(gr * .08); const eR = Math.round(gr * .12);
    const etf = Math.round(gr * .03); const net = gr - eE;
    return { ...e, otH, otR, gr, eE, eR, etf, net };
  }), [staff]);
  
  const tot = useMemo(() => pd.reduce((a, e) => ({ sal: a.sal + e.salary, ot: a.ot + e.otR, gr: a.gr + e.gr, eE: a.eE + e.eE, eR: a.eR + e.eR, etf: a.etf + e.etf, net: a.net + e.net }), { sal: 0, ot: 0, gr: 0, eE: 0, eR: 0, etf: 0, net: 0 }), [pd]);

  const processPayment = async () => {
    const amt = payEmp.net || payEmp.payDue || 0;
    const isExternal = payEmp.pool !== "employee";
    
    // Create Payroll Record
    const rec = { empId: payEmp.id, name: payEmp.name, month: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }), basic: payEmp.salary || 0, ot: payEmp.otR || 0, gross: payEmp.gr || amt, epfE: payEmp.eE || 0, epfR: payEmp.eR || 0, etf: payEmp.etf || 0, net: amt, status: "paid", paidDate: TODAY, method: payForm.method, ref: payForm.receipt };
    // Create Finance Transaction Record
    const txRec = { date: TODAY, type: "expense", section: isExternal ? "overhead" : "payroll", cat: isExternal ? "Contractor Payment" : "Salary", desc: `Payment to ${payEmp.name}`, amt: amt, project: "", ref: payForm.receipt };

    const pId = "pay_" + Date.now();
    const tId = "txn_" + Date.now();
    
    // Background UI Update
    setPayHist(p => [{ id: pId, ...rec }, ...p]);
    if (setTxn) setTxn(p => [{ id: tId, ...txRec }, ...p]);
    if (isExternal) setEmp(p => p.map(x => x.id === payEmp.id ? { ...x, payDue: 0 } : x));
    
    setShowPay(false);
    setPayForm({ method: "bank", receipt: "", notes: "" });

    // Firebase Update
    if (typeof db !== "undefined") {
      try {
        const d1 = await addDoc(collection(db, "payroll"), rec);
        setPayHist(p => p.map(x => x.id === pId ? { ...x, id: d1.id } : x));
        
        if (setTxn) {
          const d2 = await addDoc(collection(db, "finance"), txRec);
          setTxn(p => p.map(x => x.id === tId ? { ...x, id: d2.id } : x));
        }
        if (isExternal) await updateDoc(doc(db, "employees", String(payEmp.id)), { payDue: 0 });
        toast(`Paid ${LKR(amt)} to ${payEmp.name} & Saved to Firebase`);
      } catch (e) {
        console.error(e);
        toast("Firebase Error", "error");
      }
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 14 }}>
        <Stat icon="people" title="Staff" value={pd.length} color={C.blue} /><Stat icon="finance" title="Gross" value={LKR(tot.gr)} color={C.amber} /><Stat icon="finance" title="Deductions" value={LKR(tot.eE)} color={C.red} /><Stat icon="payroll" title="Net" value={LKR(tot.net)} color={C.green} />
      </div>
      <div style={{ background: C.white, borderRadius: 10, overflow: "auto", border: "1px solid #e2e8f0", marginBottom: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, minWidth: 700 }}>
          <thead><tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>{["Employee", "Basic", "OT", "Gross", "EPF 8%", "Net", "EPF 12%", "ETF", "Action"].map(h => <th key={h} style={{ textAlign: "right", padding: "6px 5px", fontSize: 9, color: C.g500, fontWeight: 600 }}>{h}</th>)}</tr></thead>
          <tbody>{pd.map((e) => <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
            <td style={{ padding: "5px", textAlign: "left", fontWeight: 500 }}>{e.name}</td>
            <td style={{ padding: "5px", textAlign: "right" }}>{LKR(e.salary)}</td>
            <td style={{ padding: "5px", textAlign: "right", color: e.otR > 0 ? C.amber : "inherit" }}>{LKR(e.otR)}</td>
            <td style={{ padding: "5px", textAlign: "right", fontWeight: 600 }}>{LKR(e.gr)}</td>
            <td style={{ padding: "5px", textAlign: "right", color: C.red }}>{LKR(e.eE)}</td>
            <td style={{ padding: "5px", textAlign: "right", fontWeight: 700, color: C.green }}>{LKR(e.net)}</td>
            <td style={{ padding: "5px", textAlign: "right", color: C.g500 }}>{LKR(e.eR)}</td>
            <td style={{ padding: "5px", textAlign: "right", color: C.g500 }}>{LKR(e.etf)}</td>
            <td style={{ padding: "5px", textAlign: "right" }}><button onClick={() => { setPayEmp(e); setShowPay(true); }} style={{ padding: "2px 8px", borderRadius: 4, border: "none", background: C.green, color: C.white, fontSize: 9, cursor: "pointer" }}>Pay</button></td>
          </tr>)}</tbody>
        </table>
      </div>
      {emp.filter((e) => e.payDue > 0).length > 0 && <div style={{ background: "#fef2f2", borderRadius: 10, padding: 14, border: "1px solid #fecaca", marginBottom: 12 }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 8 }}>Pending External Payments</h3>
        {emp.filter((e) => e.payDue > 0).map((e) => <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #fecaca40" }}><div><span style={{ fontWeight: 600, fontSize: 12 }}>{e.name}</span> <Badge status={e.pool} /><div style={{ fontSize: 10, color: C.g500 }}>{e.desg} · {e.paymentCycle}</div></div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14, fontWeight: 800, color: C.red }}>{LKR(e.payDue)}</span><button onClick={() => { setPayEmp(e); setShowPay(true); }} style={{ padding: "3px 8px", borderRadius: 4, border: "none", background: C.red, color: C.white, fontSize: 9, cursor: "pointer" }}>Pay</button></div></div>)}
      </div>}

      {payHist.length > 0 && <div style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Payment History</h3>
        <div style={{ maxHeight: 200, overflowY: "auto" }}>
          {payHist.map((ph, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f1f5f9", fontSize: 10 }}>
            <div><span style={{ fontWeight: 600 }}>{ph.name || `Emp #${ph.empId}`}</span> <span style={{ color: C.g500 }}>· {ph.month} · {ph.method}</span></div>
            <span style={{ fontWeight: 700, color: C.green }}>{LKR(ph.net)}</span>
          </div>)}
        </div>
      </div>}

      {showPay && payEmp && <Modal title={`Payment: ${payEmp.name}`} onClose={() => setShowPay(false)} w={420}>
        <div style={{ background: "#f0fdf4", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{payEmp.name}</div>
          <div style={{ fontSize: 10, color: C.g500 }}>{payEmp.desg} · {payEmp.code}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.green, marginTop: 4 }}>{LKR(payEmp.net || payEmp.payDue || 0)}</div>
          <div style={{ fontSize: 10, color: C.g500 }}>Amount Due</div>
        </div>
        <Fl label="Payment Method"><select value={payForm.method} onChange={(e) => setPayForm((f) => ({ ...f, method: e.target.value }))} style={sS}><option value="bank">Bank Transfer</option><option value="cash">Cash</option><option value="cheque">Cheque</option></select></Fl>
        <Fl label="Receipt/Reference"><input value={payForm.receipt} onChange={(e) => setPayForm((f) => ({ ...f, receipt: e.target.value }))} style={iS} placeholder="TRF-..." /></Fl>
        <Fl label="Notes"><textarea value={payForm.notes} onChange={(e) => setPayForm((f) => ({ ...f, notes: e.target.value }))} style={{ ...iS, height: 40 }} /></Fl>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}><button onClick={() => setShowPay(false)} style={bS}>Cancel</button><button onClick={processPayment} style={{ ...bP, background: C.green }}>Confirm Payment</button></div>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// FINANCE VIEW
// ═══════════════════════════════════════════════════════════
const FinanceView = ({ txn, setTxn, toast }) => {
  const [show, setShow] = useState(false);
  const [sf, setSf] = useState("all");
  const [fm, setFm] = useState({ date: TODAY, type: "expense", section: "other", cat: "", desc: "", amt: "", project: "", ref: "" });
  const filtered = sf === "all" ? txn : txn.filter((t) => t.section === sf);
  const inc = txn.filter((t) => t.type === "income").reduce((s, t) => s + t.amt, 0);
  const exp = txn.filter((t) => t.type === "expense").reduce((s, t) => s + t.amt, 0);
  const bySec = useMemo(() => { const r = {}; txn.filter((t) => t.type === "expense").forEach((t) => { r[t.section] = (r[t.section] || 0) + t.amt; }); return Object.entries(r).map(([name, value]) => ({ name: name.replace("_", " "), value })); }, [txn]);
  const cols = [C.blue, C.amber, C.red, C.purple, C.green, C.cyan];
  const add = () => { if (!fm.desc || !fm.amt) return toast("Fill fields", "error"); setTxn((p) => [{ id: Date.now(), ...fm, amt: Number(fm.amt) }, ...p]); setShow(false); toast("Recorded"); };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, marginBottom: 14 }}><Stat icon="finance" title="Income" value={LKR(inc)} color={C.green} /><Stat icon="finance" title="Expenses" value={LKR(exp)} color={C.red} /><Stat icon="finance" title="Net" value={LKR(inc - exp)} color={inc - exp > 0 ? C.green : C.red} /><Stat icon="reports" title="Margin" value={pct(inc - exp, inc) + "%"} color={C.purple} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}><h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Expense by Section</h3><ResponsiveContainer width="100%" height={160}><PieChart><Pie data={bySec} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" label={({ name, percent }) => name.substring(0, 8) + " " + (percent * 100).toFixed(0) + "%"}>{bySec.map((_, i) => <Cell key={i} fill={cols[i % cols.length]} />)}</Pie><Tooltip formatter={(v) => LKR(v)} /></PieChart></ResponsiveContainer></div>
        <div style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}><h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Monthly Trend</h3><ResponsiveContainer width="100%" height={160}><AreaChart data={RD.map(d => ({ ...d, profit: d.revenue - d.expenses }))}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 8 }} /><YAxis tick={{ fontSize: 8 }} tickFormatter={(v) => (v / 1e6).toFixed(1) + "M"} /><Tooltip formatter={(v) => LKR(v)} /><Area type="monotone" dataKey="profit" stroke={C.green} fill={C.green} fillOpacity={.1} strokeWidth={2} name="Profit" /></AreaChart></ResponsiveContainer></div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{["all", "project_payment", "payroll", "procurement", "indirect", "overhead"].map(x => <button key={x} onClick={() => setSf(x)} style={{ padding: "3px 9px", borderRadius: 6, border: "1px solid", borderColor: sf === x ? C.blue : "#e2e8f0", background: sf === x ? C.blue : C.white, color: sf === x ? C.white : C.g700, fontSize: 9, cursor: "pointer" }}>{x === "all" ? "All" : x.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</button>)}</div>
        <button onClick={() => setShow(true)} style={{ ...bP, fontSize: 10 }}>+ Daily Entry</button>
      </div>
      <div style={{ background: C.white, borderRadius: 10, overflow: "auto", border: "1px solid #e2e8f0" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 600 }}><thead><tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>{["Date", "Type", "Section", "Description", "Ref", "Amount"].map(h => <th key={h} style={{ textAlign: "left", padding: "7px 6px", fontSize: 9, color: C.g500, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>)}</tr></thead><tbody>{filtered.map((t) => <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}><td style={{ padding: "6px", fontFamily: "monospace", fontSize: 10 }}>{t.date}</td><td style={{ padding: "6px" }}><Badge status={t.type} /></td><td style={{ padding: "6px", fontSize: 10 }}>{t.section}</td><td style={{ padding: "6px", fontWeight: 500 }}>{t.desc}</td><td style={{ padding: "6px", fontFamily: "monospace", fontSize: 9, color: C.g500 }}>{t.ref || "-"}</td><td style={{ padding: "6px", fontWeight: 700, color: t.type === "income" ? C.green : C.red, textAlign: "right" }}>{t.type === "income" ? "+" : "-"}{LKR(t.amt)}</td></tr>)}</tbody></table></div>
      {show && <Modal title="Daily Transaction Entry" onClose={() => setShow(false)}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}><Fl label="Date"><input type="date" value={fm.date} onChange={(e) => setFm((f) => ({ ...f, date: e.target.value }))} style={iS} /></Fl><Fl label="Type"><select value={fm.type} onChange={(e) => setFm((f) => ({ ...f, type: e.target.value }))} style={sS}><option value="income">Income</option><option value="expense">Expense</option></select></Fl><Fl label="Section"><select value={fm.section} onChange={(e) => setFm((f) => ({ ...f, section: e.target.value }))} style={sS}>{["project_payment", "payroll", "procurement", "indirect", "overhead", "other"].map(s => <option key={s} value={s}>{s}</option>)}</select></Fl></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Fl label="Category"><input value={fm.cat} onChange={(e) => setFm((f) => ({ ...f, cat: e.target.value }))} style={iS} /></Fl><Fl label="Reference"><input value={fm.ref} onChange={(e) => setFm((f) => ({ ...f, ref: e.target.value }))} style={iS} /></Fl></div><Fl label="Description" req><input value={fm.desc} onChange={(e) => setFm((f) => ({ ...f, desc: e.target.value }))} style={iS} /></Fl><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Fl label="Amount" req><input type="number" value={fm.amt} onChange={(e) => setFm((f) => ({ ...f, amt: e.target.value }))} style={iS} /></Fl><Fl label="Project"><input value={fm.project} onChange={(e) => setFm((f) => ({ ...f, project: e.target.value }))} style={iS} /></Fl></div><div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}><button onClick={() => setShow(false)} style={bS}>Cancel</button><button onClick={add} style={bP}>Record</button></div></Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════
const SettingsView = () => (<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>{[{ t: "System A: Business Module", f: [["Module", "Business & HR"], ["Version", "4.1.0-A"], ["Syncs", "→ Sys B (Procurement) · → Sys C (Quotations)"]] }, { t: "Company", f: [["Name", "Kekulawala Advertising"], ["Location", "Kurunegala, Sri Lanka"], ["FY Start", "April"]] }, { t: "Payroll (SL)", f: [["EPF Employee", "8%"], ["EPF Employer", "12%"], ["ETF", "3%"], ["OT Rate", "1.5x weekday, 2x holiday"]] }, { t: "AI Config", f: [["Provider", "Google Gemini"], ["Model", "gemini-2.0-flash"], ["Features", "Insights, Predictions, Alerts"]] }].map(s => <div key={s.t} style={{ background: C.white, borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}><h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{s.t}</h3>{s.f.map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f8fafc", fontSize: 11 }}><span style={{ color: C.g500 }}>{l}</span><span style={{ fontWeight: 500 }}>{v}</span></div>)}</div>)}</div>);

// ═══════════════════════════════════════════════════════════
// MENU & MAIN APP
// ═══════════════════════════════════════════════════════════
const MENU = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "d1", type: "d", label: "BUSINESS" },
  { id: "projects", label: "Projects", icon: "projects" },
  { id: "clients", label: "Client Database", icon: "clients" },
  { id: "d2", type: "d", label: "HR" },
  { id: "hr_dashboard", label: "HR Dashboard", icon: "people" },
  { id: "employees", label: "Employee Pool", icon: "people" },
  { id: "attendance", label: "Attendance", icon: "attendance" },
  { id: "payroll", label: "Payroll", icon: "payroll" },
  { id: "d3", type: "d", label: "FINANCE" },
  { id: "finance", label: "Transactions", icon: "finance" },
  { id: "d4", type: "d", label: "SYSTEM" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function App() {
  const [pg, setPg] = useState("dashboard");
  const [sb, setSb] = useState(true);
  const [mob, setMob] = useState(false);
  const [sp, setSP] = useState(null);
  const [se, setSE] = useState(null);
  const [toast, setToast] = useState(null);
  const [showAE, setShowAE] = useState(false);
  const [showAP, setShowAP] = useState(false);
  const [ef, setEf] = useState({});
  const [pf, setPf] = useState({});

  const [clients, setClients] = useState([]);
  const [emp, setEmp] = useState([]);
  const [prj, setPrj] = useState([]);
  const [txn, setTxn] = useState([]);
  const [att, setAtt] = useState([]);
  const [leave, setLeave] = useState([]);
  const [payHist, setPayHist] = useState([]);

  const showT = useCallback((m, t = "success") => setToast({ m, t }), []);
  const nav = (p) => { setPg(p); setSP(null); setSE(null); setMob(false); };

  // 🔴 Firebase එකෙන් Data අදින කෑල්ල (App එක ලෝඩ් වෙද්දී)
  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        const empSnap = await getDocs(collection(db, "employees"));
        if (!empSnap.empty) setEmp(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const prjSnap = await getDocs(collection(db, "projects"));
        if (!prjSnap.empty) setPrj(prjSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // 🔴 අලුතින් Clients ටිකත් අදිනවා
        const clientSnap = await getDocs(collection(db, "clients"));
        if (!clientSnap.empty) setClients(clientSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // 🔴 අලුතින් Attendance සහ Payroll අදිනවා
        const attSnap = await getDocs(collection(db, "attendance"));
        if (!attSnap.empty) setAtt(attSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const paySnap = await getDocs(collection(db, "payroll"));
        if (!paySnap.empty) setPayHist(paySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Firebase fetch error:", error);
      }
    };
    fetchFirebaseData();
  }, []);

  // 🔴 Firebase එකට Employee Save කරන කෑල්ල
  const addEmp = async () => {
    if (!ef.name || !ef.desg) return showT("Name & designation required", "error");
    const newE = {
      code: (ef.pool === "subcontractor" ? "SC-" : ef.pool === "service_provider" ? "SP-" : "EMP-") + String(emp.length + 1).padStart(3, "0"),
      name: ef.name, desg: ef.desg, dept: ef.dept || "Production", status: "active", type: ef.type || "permanent", pool: ef.pool || "employee", joined: TODAY, salary: Number(ef.salary) || 0, rate: ef.pool !== "employee" ? Number(ef.salary) || 0 : 0, phone: ef.phone || "", epf: ef.epf || "", shift: "Day", blood: ef.blood || "", address: ef.address || "", maps: ef.maps || "", nok: ef.nok || "", nokRel: ef.nokR || "", nokPhone: ef.nokP || "", specialty: ef.spec || "", capabilities: ef.cap || "", rating: 0, paymentCycle: ef.payC || "monthly", payDue: 0, bankAcc: ef.bank || "", evalHistory: [], eval: { loyalty: 0, skill: 0, dedication: 0, integrity: 0, teamwork: 0, reliability: 0, attendance: 0 }, attendance: { present: 0, absent: 0, leave: 0, total: 0 }, otHours: 0
    };

    if (db) {
      try {
        const docRef = await addDoc(collection(db, "employees"), newE);
        setEmp(p => [{ id: docRef.id, ...newE }, ...p]);
        showT(newE.name + " added to Firebase!");
      } catch (error) {
        console.error("Firebase save error:", error);
        showT("Failed to save", "error");
      }
    } else {
      setEmp(p => [{ id: Date.now().toString(), ...newE }, ...p]);
    }
    setShowAE(false); setEf({});
  };

  // 🔴 Firebase එකට Project Save කරන අලුත් කෑල්ල (Background Save / Fast UI)
  const addPrj = () => {
    if (!pf.name || !pf.quoted) {
      showT("Name & quoted required", "error");
      return;
    }

    const newP = {
      code: "PRJ-2025-" + String((prj || []).length + 1).padStart(3, "0"),
      name: pf.name, clientId: Number(pf.clientId) || 0, quotationRef: pf.quotationRef || "", status: "planning", quoted: Number(pf.quoted), budget: Number(pf.budget) || Math.round(Number(pf.quoted) * 0.85), actual: 0, start: TODAY, deadline: pf.deadline || "", priority: pf.priority || "medium", progress: 0, desc: pf.desc || "", costs: { labor: 0, materials: 0, tools: 0, transport: 0, indirect: 0 }, payments: [], jobCards: [], completion: null
    };

    const tempId = "temp_" + Date.now();

    // 1. බොත්තම එබුව ගමන් වහාම UI එක අප්ඩේට් කරනවා (හිරවෙන්නේ නෑ, Box එක වැහෙනවා)
    setPrj(p => [{ id: tempId, ...newP }, ...p]);
    setShowAP(false); 
    setPf({});

    // 2. ඊටපස්සේ Background එකේ සද්ද නැතුව Firebase එකට යවනවා
    if (typeof db !== "undefined") {
      addDoc(collection(db, "projects"), newP)
        .then((docRef) => {
          // සේව් වුණාට පස්සේ Temp ID එක අයින් කරලා ඇත්ත Firebase ID එක දානවා
          setPrj(p => p.map(x => x.id === tempId ? { ...x, id: docRef.id } : x));
          showT("Project saved to Firebase!");
        })
        .catch((error) => {
          console.error("Firebase Error:", error);
          showT("Background Save Failed!", "error");
        });
    }
  };

  const title = MENU.find(m => m.id === pg)?.label || "Dashboard";
  const page = () => {
    if (sp) return <ProjectDetail p={sp} clients={clients} emp={emp} onBack={() => setSP(null)} setPrj={setPrj} toast={showT} />;
    if (se) return <EmpDetail e={se} emp={emp} setEmp={setEmp} onBack={() => setSE(null)} toast={showT} />;
    switch (pg) {
      case "dashboard": return <DashboardView prj={prj} emp={emp} txn={txn} clients={clients} nav={nav} />;
      case "projects": return <ProjectsView prj={prj} clients={clients} setSP={setSP} onAdd={() => setShowAP(true)} />;
      case "clients": return <ClientsView clients={clients} setClients={setClients} prj={prj} toast={showT} />;
      case "hr_dashboard": return <HRDashboard emp={emp} leave={leave} payHist={payHist} prj={prj} nav={nav} />;
      case "employees": return <EmployeesView emp={emp} setSE={setSE} onAdd={() => setShowAE(true)} />;
      case "attendance": return <AttendanceView att={att} setAtt={setAtt} emp={emp} prj={prj} toast={showT} />;
      case "payroll": return <PayrollView emp={emp} setEmp={setEmp} payHist={payHist} setPayHist={setPayHist} setTxn={setTxn} toast={showT} />;
      case "finance": return <FinanceView txn={txn} setTxn={setTxn} toast={showT} />;
      case "settings": return <SettingsView />;
      default: return <div style={{ background: C.white, borderRadius: 10, padding: 30, border: "1px solid #e2e8f0", textAlign: "center", color: C.g500 }}>{title}</div>;
    }
  };

  const Nav = () => (<>
    <div style={{ padding: sb ? "14px 14px 10px" : "14px 6px 10px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 8, minHeight: 50 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#f59e0b,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0, color: C.white }}>K</div>
      {sb && <div><div style={{ fontSize: 11, fontWeight: 700, color: C.white }}>KEKULAWALA</div><div style={{ fontSize: 7, color: "rgba(255,255,255,.35)", letterSpacing: 1 }}>BUSINESS MODULE v4.1</div></div>}
    </div>
    {sb && <div style={{ margin: "8px 8px 0", display: "flex", gap: 4 }}>
      <div style={{ flex: 1, padding: "4px 6px", borderRadius: 4, background: "rgba(16,185,129,.15)", display: "flex", alignItems: "center", gap: 3 }}><Ic name="sync" size={10} color={C.green} /><span style={{ fontSize: 7, color: C.green }}>Sys B</span></div>
      <div style={{ flex: 1, padding: "4px 6px", borderRadius: 4, background: "rgba(139,92,246,.15)", display: "flex", alignItems: "center", gap: 3 }}><Ic name="sync" size={10} color={C.purple} /><span style={{ fontSize: 7, color: C.purple }}>Sys C</span></div>
    </div>}
    <nav style={{ flex: 1, padding: "8px 4px", overflowY: "auto" }}>{MENU.map(item => {
      if (item.type === "d") return <div key={item.id} style={{ padding: sb ? "10px 8px 3px" : "10px 2px 3px", fontSize: 8, color: "rgba(255,255,255,.2)", fontWeight: 700, letterSpacing: 1.5 }}>{sb ? item.label : "—"}</div>;
      const a = pg === item.id; return <button key={item.id} onClick={() => nav(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: sb ? "6px 8px" : "6px 10px", borderRadius: 6, border: "none", background: a ? "rgba(37,99,235,.2)" : "transparent", color: a ? "#93c5fd" : "rgba(255,255,255,.5)", fontSize: 11, fontWeight: a ? 600 : 400, cursor: "pointer", textAlign: "left", marginBottom: 1, whiteSpace: "nowrap" }}><Ic name={item.icon} size={15} color={a ? "#93c5fd" : "rgba(255,255,255,.4)"} />{sb && item.label}</button>;
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><button onClick={() => setMob(true)} style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}><Ic name="menu" size={18} color={C.g700} /></button><h1 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: C.g900 }}>{sp ? sp.name : se ? se.name : title}</h1><span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#fef3c7", color: "#92400e", fontWeight: 600 }}>SYSTEM A</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, color: C.g500 }}>{new Date().toLocaleDateString("en-LK", { weekday: "short", month: "short", day: "numeric" })}</span>
            <div style={{ display: "flex", gap: 3 }}><div style={{ padding: "2px 5px", borderRadius: 3, background: "#dcfce7", display: "flex", alignItems: "center", gap: 2 }}><div style={{ width: 5, height: 5, borderRadius: 3, background: C.green }} /><span style={{ fontSize: 7, color: "#166534" }}>B</span></div><div style={{ padding: "2px 5px", borderRadius: 3, background: "#ede9fe", display: "flex", alignItems: "center", gap: 2 }}><div style={{ width: 5, height: 5, borderRadius: 3, background: C.purple }} /><span style={{ fontSize: 7, color: "#5b21b6" }}>C</span></div></div>
            <div style={{ position: "relative" }}><Ic name="bell" size={16} color={C.g500} /><span style={{ position: "absolute", top: -2, right: -2, width: 6, height: 6, borderRadius: 3, background: C.red, border: "1.5px solid white" }} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", borderRadius: 6, background: "#f8fafc" }}><div style={{ width: 22, height: 22, borderRadius: 5, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 8, fontWeight: 700 }}>AD</div><span style={{ fontSize: 10, fontWeight: 500 }}>Admin</span></div>
          </div>
        </header>
        <main style={{ flex: 1, padding: 16, overflowY: "auto" }}>{page()}</main>
      </div>

      {/* Add Employee Modal */}
      {showAE && <Modal title="Add to Employee Pool" onClose={() => setShowAE(false)} w={580}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Fl label="Full Name" req><input value={ef.name || ""} onChange={(e) => setEf((f) => ({ ...f, name: e.target.value }))} style={iS} /></Fl><Fl label="Designation" req><input value={ef.desg || ""} onChange={(e) => setEf((f) => ({ ...f, desg: e.target.value }))} style={iS} /></Fl></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}><Fl label="Pool"><select value={ef.pool || "employee"} onChange={(e) => setEf((f) => ({ ...f, pool: e.target.value }))} style={sS}><option value="employee">Employee</option><option value="subcontractor">Sub-contractor</option><option value="service_provider">Service Provider</option></select></Fl><Fl label="Type"><select value={ef.type || "permanent"} onChange={(e) => setEf((f) => ({ ...f, type: e.target.value }))} style={sS}><option value="permanent">Permanent</option><option value="contract">Contract</option></select></Fl><Fl label="Department"><select value={ef.dept || "Production"} onChange={(e) => setEf((f) => ({ ...f, dept: e.target.value }))} style={sS}>{["Production", "Design", "Logistics", "Finance", "External"].map(d => <option key={d}>{d}</option>)}</select></Fl></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}><Fl label="Salary/Rate" req><input type="number" value={ef.salary || ""} onChange={(e) => setEf((f) => ({ ...f, salary: e.target.value }))} style={iS} /></Fl><Fl label="Payment"><select value={ef.payC || "monthly"} onChange={(e) => setEf((f) => ({ ...f, payC: e.target.value }))} style={sS}><option value="monthly">Monthly</option><option value="weekly">Weekly</option><option value="daily">Daily</option></select></Fl><Fl label="Blood"><select value={ef.blood || ""} onChange={(e) => setEf((f) => ({ ...f, blood: e.target.value }))} style={sS}><option value="">-</option>{["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(b => <option key={b}>{b}</option>)}</select></Fl></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}><Fl label="Phone"><input value={ef.phone || ""} onChange={(e) => setEf((f) => ({ ...f, phone: e.target.value }))} style={iS} /></Fl><Fl label="EPF"><input value={ef.epf || ""} onChange={(e) => setEf((f) => ({ ...f, epf: e.target.value }))} style={iS} /></Fl><Fl label="Bank Acc"><input value={ef.bank || ""} onChange={(e) => setEf((f) => ({ ...f, bank: e.target.value }))} style={iS} /></Fl></div>
        <Fl label="Address"><input value={ef.address || ""} onChange={(e) => setEf((f) => ({ ...f, address: e.target.value }))} style={iS} /></Fl>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Fl label="Specialty"><input value={ef.spec || ""} onChange={(e) => setEf((f) => ({ ...f, spec: e.target.value }))} style={iS} /></Fl><Fl label="Capabilities"><input value={ef.cap || ""} onChange={(e) => setEf((f) => ({ ...f, cap: e.target.value }))} style={iS} /></Fl></div>
        <div style={{ background: "#f0f9ff", borderRadius: 8, padding: 12, marginBottom: 12 }}><h4 style={{ fontSize: 11, fontWeight: 600, margin: "0 0 6px", color: C.blue }}>Next of Kin</h4><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}><Fl label="Name"><input value={ef.nok || ""} onChange={(e) => setEf((f) => ({ ...f, nok: e.target.value }))} style={iS} /></Fl><Fl label="Rel"><input value={ef.nokR || ""} onChange={(e) => setEf((f) => ({ ...f, nokR: e.target.value }))} style={iS} /></Fl><Fl label="Phone"><input value={ef.nokP || ""} onChange={(e) => setEf((f) => ({ ...f, nokP: e.target.value }))} style={iS} /></Fl></div></div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}><button onClick={() => setShowAE(false)} style={bS}>Cancel</button><button onClick={addEmp} style={bP}>Add</button></div>
      </Modal>}

      {/* Add Project Modal */}
      {showAP && <Modal title="New Project" onClose={() => setShowAP(false)} w={540}>
        <Fl label="Client" req><select value={pf.clientId || ""} onChange={(e) => setPf((f) => ({ ...f, clientId: e.target.value }))} style={sS}><option value="">Select...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}</select></Fl>
        <Fl label="Quotation Ref (→Sys C)"><input value={pf.quotationRef || ""} onChange={(e) => setPf((f) => ({ ...f, quotationRef: e.target.value }))} style={iS} placeholder="QT-2025-XXXX" /></Fl>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Fl label="Name" req><input value={pf.name || ""} onChange={(e) => setPf((f) => ({ ...f, name: e.target.value }))} style={iS} /></Fl><Fl label="Priority"><select value={pf.priority || "medium"} onChange={(e) => setPf((f) => ({ ...f, priority: e.target.value }))} style={sS}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></Fl></div>
        <Fl label="Description"><textarea value={pf.desc || ""} onChange={(e) => setPf((f) => ({ ...f, desc: e.target.value }))} style={{ ...iS, height: 50 }} /></Fl>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}><Fl label="Quoted" req><input type="number" value={pf.quoted || ""} onChange={(e) => setPf((f) => ({ ...f, quoted: e.target.value }))} style={iS} /></Fl><Fl label="Budget"><input type="number" value={pf.budget || ""} onChange={(e) => setPf((f) => ({ ...f, budget: e.target.value }))} style={iS} /></Fl><Fl label="Deadline"><input type="date" value={pf.deadline || ""} onChange={(e) => setPf((f) => ({ ...f, deadline: e.target.value }))} style={iS} /></Fl></div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}><button onClick={() => setShowAP(false)} style={bS}>Cancel</button><button onClick={addPrj} style={bP}>Create</button></div>
      </Modal>}

      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}`}</style>
    </div>
  );
}