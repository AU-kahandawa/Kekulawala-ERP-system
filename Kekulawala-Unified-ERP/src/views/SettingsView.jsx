import React, { useState, useEffect } from 'react';
import { Settings, Upload, Image, ShieldCheck, Save, Building2, Database, Cloud, RefreshCw, Download, CheckCircle2 } from 'lucide-react';
import { FormField } from '../components/CommonUI';
import { getDatabaseStats, seedDatabaseClientSide, exportDatabaseBackupJSON } from '../services/firebaseService';

export const SettingsView = ({ settings, setSettings, showToast }) => {
  const [form, setForm] = useState(settings || {});
  const [dbStats, setDbStats] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const loadStats = async () => {
    try {
      const stats = await getDatabaseStats();
      setDbStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSave = () => {
    setSettings(form);
    showToast("Company Letterhead & System Settings Saved to Firebase!");
  };

  const handleReseed = async () => {
    if (!window.confirm("Synchronize / Seed initial master data into Firebase Firestore?")) return;
    setIsSyncing(true);
    try {
      await seedDatabaseClientSide();
      await loadStats();
      showToast("Firebase Master Database successfully seeded & synchronized!");
    } catch (e) {
      showToast("Seeding failed: " + e.message, "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const dump = await exportDatabaseBackupJSON();
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kekulawala-erp-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Firebase Database backup downloaded successfully!");
    } catch (e) {
      showToast("Export failed: " + e.message, "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            System Settings & Letterhead Configuration Engine
          </h2>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            Configure Company Information, Upload Custom Print Letterheads, Stamps, Signatures & Watermarks
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)"
          }}
        >
          <Save size={18} />
          Save Configuration
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Left: Corporate Details */}
        <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", borderBottom: "1px solid #e2e8f0", pb: 8, mb: 4 }}>
            Corporate Details
          </h3>

          <FormField label="Company Registered Name">
            <input value={form.companyName || ""} onChange={(e) => setForm({ ...form, companyName: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }} />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormField label="Company Reg Number">
              <input value={form.regNumber || ""} onChange={(e) => setForm({ ...form, regNumber: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }} />
            </FormField>
            <FormField label="VAT Reg Number">
              <input value={form.vatNumber || ""} onChange={(e) => setForm({ ...form, vatNumber: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }} />
            </FormField>
          </div>

          <FormField label="Corporate Head Office Address">
            <input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }} />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormField label="Telephone Contact">
              <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }} />
            </FormField>
            <FormField label="Official Email">
              <input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }} />
            </FormField>
          </div>
        </div>

        {/* Right: Letterhead Assets Uploaders */}
        <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", borderBottom: "1px solid #e2e8f0", pb: 8, mb: 4 }}>
            Custom Letterhead & Digital Assets
          </h3>

          <FormField label="Watermark Opacity Slider">
            <input
              type="range"
              min="0.05"
              max="0.4"
              step="0.01"
              value={form.watermarkOpacity || 0.12}
              onChange={(e) => setForm({ ...form, watermarkOpacity: parseFloat(e.target.value) })}
              style={{ width: "100%" }}
            />
            <div style={{ fontSize: 11, color: "#64748b", textAlign: "right" }}>
              Opacity: {((form.watermarkOpacity || 0.12) * 100).toFixed(0)}%
            </div>
          </FormField>

          <FormField label="Top Header Banner Image URL">
            <input
              placeholder="https://example.com/company-header.png"
              value={form.headerImageUrl || ""}
              onChange={(e) => setForm({ ...form, headerImageUrl: e.target.value })}
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }}
            />
          </FormField>

          <FormField label="Background Watermark Image URL">
            <input
              placeholder="https://example.com/company-logo-watermark.png"
              value={form.watermarkImageUrl || ""}
              onChange={(e) => setForm({ ...form, watermarkImageUrl: e.target.value })}
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }}
            />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormField label="Company Rubber Stamp Image URL">
              <input
                placeholder="stamp.png"
                value={form.stampImageUrl || ""}
                onChange={(e) => setForm({ ...form, stampImageUrl: e.target.value })}
                style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }}
              />
            </FormField>
            <FormField label="Digital Signature Image URL">
              <input
                placeholder="signature.png"
                value={form.signatureImageUrl || ""}
                onChange={(e) => setForm({ ...form, signatureImageUrl: e.target.value })}
                style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }}
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Firebase Cloud Backend & Database Console */}
      <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Database size={22} color="#2563eb" />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Firebase Cloud Firestore & Backend Hub
              </h3>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Active Cloud Project: <strong style={{ color: "#2563eb" }}>kekulawala-erp</strong>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#dcfce7", color: "#166534", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              <CheckCircle2 size={14} color="#166534" />
              Connected & Live
            </span>

            <button
              onClick={handleReseed}
              disabled={isSyncing}
              style={{
                background: "#f1f5f9",
                color: "#1e293b",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing..." : "Reseed Master Catalog"}
            </button>

            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              style={{
                background: "#f8fafc",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <Download size={14} />
              {isExporting ? "Exporting..." : "Download JSON Backup"}
            </button>
          </div>
        </div>

        {/* Collection Metrics */}
        {dbStats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginTop: 4 }}>
            {Object.entries(dbStats).map(([key, count]) => (
              <div key={key} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "#64748b", textTransform: "capitalize" }}>{key}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{count} docs</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

