import React, { useState } from 'react';
import { Sparkles, Upload, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '../components/CommonUI';

export const AIEstimatorView = ({ materials = [], nav, showToast }) => {
  const [fileSelected, setFileSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [boqResult, setBoqResult] = useState(null);

  const handleAnalyzeDrawing = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setBoqResult({
        title: "Extracted Blueprint: 24ft x 8ft Exterior Illuminated Pylon Sign",
        items: [
          { description: "Aluminum Composite Panel 4mm PVDF (4x8ft)", qty: 6, uom: "sheets", rate: 8500, total: 51000 },
          { description: "MS Square Structural Tube 25x25mm Frame", qty: 240, uom: "feet", rate: 320, total: 76800 },
          { description: "LED Module 12V White IP67 Waterproof", qty: 350, uom: "pcs", rate: 180, total: 63000 },
          { description: "LED Power Supply Driver 12V 30A", qty: 4, uom: "pcs", rate: 4500, total: 18000 },
          { description: "Fabrication & Site Erection Labor", qty: 4, uom: "days", rate: 15000, total: 60000 }
        ],
        subtotal: 268800,
        marginPct: 25,
        estimatedPrice: 336000
      });
      showToast("Gemini Vision AI Drawing Analysis Complete!");
    }, 1800);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #8b5cf6, #0f172a)",
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
            <Sparkles size={26} color="#f59e0b" />
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
              Gemini AI Blueprint & Drawing BOQ Estimator
            </h2>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 6, maxWidth: 640 }}>
            Upload architectural drawings, elevation sketches, or PDF specs. Gemini Computer Vision scans material dimensions and generates an instant Bill of Quantities (BOQ) with inventory price matching.
          </div>
        </div>

        <span style={{ background: "#f59e0b", color: "#0f172a", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
          GEMINI 2.5 VISION API
        </span>
      </div>

      {/* Uploader & Result Split */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 18 }}>
        {/* Upload Box */}
        <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Upload Blueprint Image / Drawing</h3>

          <div
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: 12,
              padding: 30,
              textAlign: "center",
              background: "#f8fafc",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
            onClick={() => setFileSelected("drawing_sample_pylon.png")}
          >
            <Upload size={32} color="#8b5cf6" style={{ margin: "0 auto 10px" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
              {fileSelected ? fileSelected : "Click to Upload Blueprint (PNG, JPG, PDF)"}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
              Supports elevation drawings, structural frame sketches & CAD exports
            </div>
          </div>

          <button
            onClick={handleAnalyzeDrawing}
            disabled={analyzing}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #8b5cf6, #2563eb)",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              padding: "12px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
          >
            <Sparkles size={16} />
            {analyzing ? "Gemini Scanning Drawing..." : "Run AI Computer Vision Extraction"}
          </button>
        </div>

        {/* AI BOQ Extraction Result */}
        <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0" }}>
          {boqResult ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                  {boqResult.title}
                </h3>
                <button
                  onClick={() => nav("quotations")}
                  style={{
                    background: "#10b981",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  Export to Quotation Builder <ArrowRight size={14} />
                </button>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 20 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #cbd5e1" }}>
                    <th style={{ textAlign: "left", padding: 8 }}>Material / Labor Item</th>
                    <th style={{ textAlign: "center", padding: 8 }}>Qty</th>
                    <th style={{ textAlign: "right", padding: 8 }}>Unit Rate (LKR)</th>
                    <th style={{ textAlign: "right", padding: 8 }}>Total (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {boqResult.items.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: 8, fontWeight: 600 }}>{it.description}</td>
                      <td style={{ textAlign: "center", padding: 8 }}>{it.qty} {it.uom}</td>
                      <td style={{ textAlign: "right", padding: 8 }}>LKR {it.rate.toLocaleString('en-LK')}</td>
                      <td style={{ textAlign: "right", padding: 8, fontWeight: 700 }}>LKR {it.total.toLocaleString('en-LK')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ background: "#f0fdf4", padding: 16, borderRadius: 10, border: "1px solid #bbf7d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#166534", fontWeight: 700 }}>COST ESTIMATE SUMMARY</div>
                  <div style={{ fontSize: 12, color: "#15803d" }}>Material Cost + Labor: LKR {boqResult.subtotal.toLocaleString('en-LK')}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#166534" }}>Recommended Quote Price (+25% Margin):</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#15803d" }}>
                    LKR {boqResult.estimatedPrice.toLocaleString('en-LK')}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
              Upload a drawing on the left and click "Run AI Extraction" to see auto-generated BOQ item breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
