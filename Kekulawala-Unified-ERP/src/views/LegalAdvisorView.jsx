import React, { useState } from 'react';
import {
  Scale,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  Calculator,
  Search,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { SRI_LANKA_LEGAL_ACTS, LEGAL_CATEGORIES } from '../config/legalKnowledge';

export const LegalAdvisorView = () => {
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAct, setActiveAct] = useState(SRI_LANKA_LEGAL_ACTS[0]);

  // Contract Risk Checker State
  const [contractText, setContractText] = useState("");
  const [auditResult, setAuditResult] = useState(null);

  // Statutory Calculator State
  const [salaryInput, setSalaryInput] = useState(100000);
  const [otHoursInput, setOtHoursInput] = useState(10);

  const filteredActs = SRI_LANKA_LEGAL_ACTS.filter((act) => {
    const matchesCat = selectedCat === "all" || act.category === selectedCat;
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAuditContract = () => {
    if (!contractText) return;

    let score = 90;
    let issues = [];

    if (!contractText.toLowerCase().includes("arbitration") && !contractText.toLowerCase().includes("colombo")) {
      score -= 20;
      issues.push("Missing Colombo Arbitration Clause: Disputes may face multi-year civil litigation in courts.");
    }
    if (!contractText.toLowerCase().includes("defects liability") && !contractText.toLowerCase().includes("dlp")) {
      score -= 15;
      issues.push("Missing Defects Liability Period (DLP) Clause (CIDA Sri Lanka standard requires 12 months).");
    }
    if (!contractText.toLowerCase().includes("vat") && !contractText.toLowerCase().includes("tax")) {
      score -= 10;
      issues.push("Ambiguous Tax Terms: VAT (18%) and SSCL (2.5%) handling is not explicitly itemized.");
    }

    setAuditResult({
      score,
      issues,
      status: score >= 80 ? "Low Risk" : score >= 60 ? "Medium Risk" : "High Risk"
    });
  };

  // Calculations
  const epfEmployer = salaryInput * 0.12;
  const epfEmployee = salaryInput * 0.08;
  const etfEmployer = salaryInput * 0.03;
  const hourlyRate = salaryInput / 240;
  const otPayment = hourlyRate * 1.5 * otHoursInput;
  const grossPay = salaryInput + otPayment;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          borderRadius: 16,
          padding: "24px 28px",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Scale size={26} color="#38bdf8" />
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
              Sri Lanka Commercial & Industrial Legal Advisory Suite
            </h2>
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6, maxWidth: 680 }}>
            Statutory Legal Knowledge Base covering Labor Laws, EPF/ETF Regulations, IRD Tax Rules (VAT 18%, SSCL 2.5%), CIDA Construction Standards, and AI Contract Risk Scoring.
          </div>
        </div>

        <div style={{ textAlign: "right", background: "rgba(255,255,255,0.06)", padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>LEGAL COMPLIANCE ENGINE</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>Dem. Soc. Rep. of Sri Lanka</div>
        </div>
      </div>

      {/* Main Grid split */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 }}>
        {/* Left: Acts & Laws Browser */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Category Filter & Search */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
              <Search size={16} color="#64748b" style={{ position: "absolute", left: 12, top: 11 }} />
              <input
                type="text"
                placeholder="Search Sri Lankan Laws, Acts, or Regulations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 36px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  fontSize: 12,
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
              {LEGAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: selectedCat === cat.id ? "#2563eb" : "#cbd5e1",
                    background: selectedCat === cat.id ? "#2563eb" : "#ffffff",
                    color: selectedCat === cat.id ? "#ffffff" : "#475569",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Act Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {filteredActs.map((act) => {
              const isSel = activeAct?.id === act.id;
              return (
                <div
                  key={act.id}
                  onClick={() => setActiveAct(act)}
                  style={{
                    background: "#ffffff",
                    borderRadius: 14,
                    padding: 18,
                    border: `1.5px solid ${isSel ? "#2563eb" : "#e2e8f0"}`,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", marginBottom: 4 }}>
                    {act.authority}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6, lineHeight: 1.4 }}>
                    {act.title}
                  </h3>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {act.summary}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Act Viewer */}
          {activeAct && (
            <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#2563eb", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                <BookOpen size={16} /> {activeAct.authority}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                {activeAct.title}
              </h2>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
                {activeAct.summary}
              </p>

              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
                Key Statutory Clauses & Obligations:
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeAct.keyClauses.map((clause, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#f8fafc", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: "#1e293b", lineHeight: 1.5 }}>{clause}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: AI Contract Auditor & Statutory Calculator */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* AI Contract Risk Checker */}
          <div style={{ background: "#ffffff", borderRadius: 14, padding: 18, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <FileCheck size={18} color="#2563eb" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                Contract Risk Auditor
              </h3>
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>
              Paste draft contract text below to audit against Sri Lankan commercial & labor laws.
            </div>
            <textarea
              rows={4}
              placeholder="Paste contract terms, payment clauses, or subcontractor SLAs..."
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                fontSize: 11,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
            <button
              onClick={handleAuditContract}
              style={{
                width: "100%",
                marginTop: 10,
                background: "#0f172a",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Audit Contract Risk
            </button>

            {auditResult && (
              <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: auditResult.score >= 80 ? "#ecfdf5" : "#fffbebfb", border: `1px solid ${auditResult.score >= 80 ? "#10b981" : "#f59e0b"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Legal Risk Score:</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: auditResult.score >= 80 ? "#10b981" : "#d97706" }}>
                    {auditResult.score} / 100 ({auditResult.status})
                  </span>
                </div>
                {auditResult.issues.map((iss, i) => (
                  <div key={i} style={{ fontSize: 11, color: "#78350f", marginTop: 4, display: "flex", gap: 6 }}>
                    <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0 }} />
                    <span>{iss}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statutory EPF/ETF & Overtime Calculator */}
          <div style={{ background: "#ffffff", borderRadius: 14, padding: 18, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Calculator size={18} color="#10b981" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                Statutory EPF/ETF & OT Calculator
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>Monthly Basic Salary (LKR)</label>
                <input
                  type="number"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(Number(e.target.value))}
                  style={{ width: "100%", padding: 7, borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12, marginTop: 2, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>Overtime Hours Worked</label>
                <input
                  type="number"
                  value={otHoursInput}
                  onChange={(e) => setOtHoursInput(Number(e.target.value))}
                  style={{ width: "100%", padding: 7, borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12, marginTop: 2, boxSizing: "border-box" }}
                />
              </div>

              <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 11, display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Employer EPF (12%):</span>
                  <strong>LKR {epfEmployer.toLocaleString('en-LK')}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Employer ETF (3%):</span>
                  <strong>LKR {etfEmployer.toLocaleString('en-LK')}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Employee EPF (8%):</span>
                  <strong>LKR {epfEmployee.toLocaleString('en-LK')}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#2563eb" }}>
                  <span>OT Rate (1.5x):</span>
                  <strong>LKR {otPayment.toLocaleString('en-LK')} ({otHoursInput} hrs)</strong>
                </div>
                <div style={{ borderTop: "1px solid #cbd5e1", pt: 4, display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
                  <span>Gross Remuneration:</span>
                  <strong>LKR {grossPay.toLocaleString('en-LK')}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
