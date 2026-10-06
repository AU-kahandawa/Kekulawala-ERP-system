import React, { useState } from 'react';
import { FileText, Plus, Printer, Trash2, Check, Sparkles } from 'lucide-react';
import { LetterheadCanvas } from '../components/LetterheadCanvas';
import { Badge, FormField, Modal } from '../components/CommonUI';

export const QuotationsView = ({
  quotations = [],
  setQuotations,
  clients = [],
  materials = [],
  companySettings,
  showToast,
  nav
}) => {
  const [selectedQuote, setSelectedQuote] = useState(quotations[0] || null);
  const [showNewModal, setShowNewModal] = useState(false);

  const LKR = (n) => "LKR " + Number(n).toLocaleString("en-LK", { minimumFractionDigits: 2 });

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Quotation & Bill of Quantities (BOQ) Studio
          </h2>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            Create, Edit & Print Official Quotations with Custom Letterhead Engine
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => nav("ai_estimator")}
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <Sparkles size={16} />
            Gemini AI Blueprint Estimator
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <Plus size={18} />
            New Quotation
          </button>
        </div>
      </div>

      {/* Split Workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        {/* Left List */}
        <div style={{ background: "#ffffff", borderRadius: 14, padding: 16, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 10, height: "calc(100vh - 180px)", overflowY: "auto" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Quotations ({quotations.length})</h3>
          {quotations.map((q) => {
            const isSel = selectedQuote?.id === q.id;
            return (
              <div
                key={q.id}
                onClick={() => setSelectedQuote(q)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: `1.5px solid ${isSel ? "#2563eb" : "#e2e8f0"}`,
                  background: isSel ? "#eff6ff" : "#ffffff",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb" }}>{q.code}</span>
                  <Badge status={q.status} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{q.title}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{q.clientName}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginTop: 6, textAlign: "right" }}>
                  {LKR(q.grandTotal)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Printable Canvas Preview */}
        <div>
          {selectedQuote ? (
            <LetterheadCanvas
              settings={companySettings}
              docTitle="OFFICIAL QUOTATION & BOQ"
              docNumber={selectedQuote.code}
              docDate={selectedQuote.date}
              clientName={selectedQuote.clientName}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                Subject: {selectedQuote.title}
              </h3>

              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #0f172a" }}>
                    <th style={{ textAlign: "left", padding: 8 }}>Item Description</th>
                    <th style={{ textAlign: "center", padding: 8 }}>Qty</th>
                    <th style={{ textAlign: "right", padding: 8 }}>Rate</th>
                    <th style={{ textAlign: "right", padding: 8 }}>Total (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedQuote.items.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: 8 }}>{it.description}</td>
                      <td style={{ textAlign: "center", padding: 8 }}>{it.qty} {it.uom}</td>
                      <td style={{ textAlign: "right", padding: 8 }}>LKR {it.unitRate.toLocaleString('en-LK')}</td>
                      <td style={{ textAlign: "right", padding: 8, fontWeight: 700 }}>LKR {it.total.toLocaleString('en-LK')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <div style={{ width: 260, fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal:</span>
                    <span>{LKR(selectedQuote.subtotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                    <span>VAT (18% Applicable):</span>
                    <span>{LKR(selectedQuote.tax)}</span>
                  </div>
                  <div style={{ borderTop: "2px solid #0f172a", pt: 6, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                    <span>Grand Total:</span>
                    <span>{LKR(selectedQuote.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </LetterheadCanvas>
          ) : (
            <div style={{ background: "#ffffff", padding: 40, borderRadius: 14, textAlign: "center", color: "#64748b" }}>
              Select a quotation to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
