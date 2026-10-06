import React from 'react';
import { Printer, ShieldCheck } from 'lucide-react';

export const LetterheadCanvas = ({
  settings,
  docTitle = "OFFICIAL DOCUMENT",
  docNumber = "",
  docDate = "",
  clientName = "",
  clientAddress = "",
  children,
  signatory = "Authorized Signatory",
  designation = "Managing Director"
}) => {
  const s = settings || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Print Toolbar */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", padding: "12px 18px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={18} color="#10b981" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>
            A4 Letterhead & Stamp Engine Active (Print Ready)
          </span>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <Printer size={16} />
          Print / Save PDF
        </button>
      </div>

      {/* Printable A4 Paper Container */}
      <div
        className="print-area"
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          padding: "24px 32px",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          position: "relative",
          boxSizing: "border-box",
          overflow: "hidden"
        }}
      >
        {/* Background Watermark Image */}
        {s.watermarkImageUrl && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: s.watermarkOpacity || 0.12,
              pointerEvents: "none",
              zIndex: 0,
              maxWidth: "60%",
              maxHeight: "60%"
            }}
          >
            <img src={s.watermarkImageUrl} alt="Watermark" style={{ width: "100%", objectFit: "contain" }} />
          </div>
        )}

        {/* Company Header */}
        <div style={{ position: "relative", zIndex: 1, borderBottom: s.headerImageUrl ? "none" : "2px solid #0f172a", pb: 16, mb: 20 }}>
          {s.headerImageUrl ? (
            <img src={s.headerImageUrl} alt="Company Header" style={{ width: "100%", maxHeight: 110, objectFit: "contain" }} />
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5, textTransform: "uppercase" }}>
                  {s.companyName || "KEKULAWALA ENTERPRISES (PVT) LTD"}
                </h1>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                  Reg No: {s.regNumber || "PV-00289143"} | VAT Reg: {s.vatNumber || "114892014-7000"}
                </div>
                <div style={{ fontSize: 11, color: "#475569" }}>
                  {s.address || "No. 142/A, Kandy Road, Kurunegala, Sri Lanka"}
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "#475569" }}>
                <div><strong>Tel:</strong> {s.phone || "+94 37 223 4567"}</div>
                <div><strong>Email:</strong> {s.email || "info@kekulawala.lk"}</div>
                <div><strong>Web:</strong> {s.website || "www.kekulawala.lk"}</div>
              </div>
            </div>
          )}
        </div>

        {/* Document Header Metadata Bar */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, background: "#f8fafc", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", margin: 0 }}>
              {docTitle}
            </h2>
            {clientName && (
              <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
                <strong>Attention / Client:</strong> {clientName} {clientAddress ? `(${clientAddress})` : ""}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#334155" }}>
            {docNumber && <div><strong>Doc Ref:</strong> {docNumber}</div>}
            {docDate && <div><strong>Date:</strong> {docDate}</div>}
          </div>
        </div>

        {/* Document Main Content Body */}
        <div style={{ position: "relative", zIndex: 1, fontSize: 12, lineHeight: 1.6, color: "#1e293b", minHeight: 380 }}>
          {children}
        </div>

        {/* Stamp & Authorized Signature Footer */}
        <div style={{ position: "relative", zIndex: 1, marginTop: 40, paddingTop: 20, borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            {s.bankDetails && (
              <div style={{ fontSize: 10, color: "#64748b" }}>
                <strong>Bank Settlement Details:</strong><br />
                {s.bankDetails.bankName} | Acc: {s.bankDetails.accountNo} ({s.bankDetails.branch})
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", minWidth: 180, position: "relative" }}>
            {/* Rubber Stamp Image Overlay */}
            {s.stampImageUrl && (
              <img
                src={s.stampImageUrl}
                alt="Stamp"
                style={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  width: 90,
                  height: 90,
                  opacity: 0.85,
                  transform: "rotate(-10deg)",
                  pointerEvents: "none"
                }}
              />
            )}

            {/* Signature Image */}
            {s.signatureImageUrl ? (
              <img src={s.signatureImageUrl} alt="Signature" style={{ height: 45, objectFit: "contain", marginBottom: 4 }} />
            ) : (
              <div style={{ height: 40, borderBottom: "1.5px dashed #94a3b8", marginBottom: 6 }} />
            )}

            <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{signatory}</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>{designation}</div>
            <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>{s.companyName || "Kekulawala Enterprises"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
