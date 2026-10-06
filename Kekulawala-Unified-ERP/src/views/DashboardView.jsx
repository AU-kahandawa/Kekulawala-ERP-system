import React from 'react';
import {
  FolderKanban,
  DollarSign,
  Users,
  Package,
  Sparkles,
  Scale,
  TrendingUp,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { StatCard, Badge } from '../components/CommonUI';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const REVENUE_DATA = [
  { month: "Apr", revenue: 2800000, expenses: 2100000 },
  { month: "May", revenue: 3200000, expenses: 2400000 },
  { month: "Jun", revenue: 2900000, expenses: 2200000 },
  { month: "Jul", revenue: 3600000, expenses: 2800000 },
  { month: "Aug", revenue: 3100000, expenses: 2350000 },
  { month: "Sep", revenue: 3800000, expenses: 2900000 },
  { month: "Oct", revenue: 4200000, expenses: 3100000 },
  { month: "Nov", revenue: 3700000, expenses: 2800000 },
  { month: "Dec", revenue: 4500000, expenses: 3400000 },
  { month: "Jan", revenue: 3900000, expenses: 2950000 },
  { month: "Feb", revenue: 4100000, expenses: 3050000 },
  { month: "Mar", revenue: 4400000, expenses: 3200000 }
];

export const DashboardView = ({
  projects = [],
  clients = [],
  materials = [],
  quotations = [],
  employees = [],
  transactions = [],
  dailyTip = "",
  nav
}) => {
  const ongoingProjects = projects.filter((p) => p.status === "ongoing");
  const lowStock = materials.filter((m) => m.qty <= m.reorder);
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amt, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amt, 0);

  const LKR = (n) => "LKR " + Number(n).toLocaleString("en-LK", { minimumFractionDigits: 0 });

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Stat Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <StatCard
          icon={FolderKanban}
          title="Active Projects"
          value={ongoingProjects.length}
          sub={`${projects.length} Total Projects`}
          color="#2563eb"
          onClick={() => nav("projects")}
        />
        <StatCard
          icon={TrendingUp}
          title="Total Revenue (YTD)"
          value={LKR(totalIncome || 6750000)}
          sub="Net Income Stream"
          color="#10b981"
          onClick={() => nav("finance")}
        />
        <StatCard
          icon={DollarSign}
          title="Total Expenses (YTD)"
          value={LKR(totalExpense || 3020000)}
          sub="Operations & Procurement"
          color="#ef4444"
          onClick={() => nav("finance")}
        />
        <StatCard
          icon={FileText}
          title="Quotations Issued"
          value={quotations.length}
          sub="Quotation Studio"
          color="#8b5cf6"
          onClick={() => nav("quotations")}
        />
        <StatCard
          icon={Users}
          title="Client Base"
          value={clients.length}
          sub="CRM Database"
          color="#06b6d4"
          onClick={() => nav("clients")}
        />
        <StatCard
          icon={Package}
          title="Low Stock Items"
          value={lowStock.length}
          sub={lowStock.length > 0 ? "Reorder Needed" : "Stock Healthy"}
          color={lowStock.length > 0 ? "#f59e0b" : "#10b981"}
          onClick={() => nav("inventory")}
        />
      </div>

      {/* Sri Lanka Legal Tip Widget */}
      <div
        style={{
          background: "linear-gradient(135deg, #0369a1, #0f172a)",
          borderRadius: 14,
          padding: "16px 20px",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 20px rgba(3, 105, 161, 0.15)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Scale size={22} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, color: "#7dd3fc", fontWeight: 700 }}>
              Sri Lanka Commercial & Labor Law Daily Compliance Insight
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>
              {dailyTip || "Ensure overtime for non-manual employees is calculated at 1.5x hourly rate under Shop & Office Act."}
            </div>
          </div>
        </div>
        <button
          onClick={() => nav("legal_advisor")}
          style={{
            background: "#ffffff",
            color: "#0369a1",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          View Legal Hub →
        </button>
      </div>

      {/* Recharts Financial Graphs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
        {/* Revenue vs Expenses */}
        <div style={{ background: "#ffffff", borderRadius: 14, padding: 20, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>
            Financial Trend (Revenue vs Expenses)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v / 1e6).toFixed(1) + "M"} />
              <Tooltip formatter={(v) => LKR(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#rGrad)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="none" strokeWidth={2} name="Expenses" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Project Budget vs Actual */}
        <div style={{ background: "#ffffff", borderRadius: 14, padding: 20, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>
            Project Budget vs Actual Expenditure
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={projects.map((p) => ({
                name: p.name.length > 12 ? p.name.substring(0, 12) + "..." : p.name,
                budget: p.budget,
                actual: p.actual
              }))}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => (v / 1e6).toFixed(1) + "M"} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => LKR(v)} />
              <Bar dataKey="budget" fill="#2563eb" name="Budget" barSize={10} />
              <Bar dataKey="actual" fill="#f59e0b" name="Actual" barSize={10} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gemini AI Operational Insights Banner */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 14, padding: 22, color: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Sparkles size={22} color="#f59e0b" />
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Gemini AI Enterprise Operational Insights</h3>
          <span style={{ fontSize: 10, background: "#f59e0b", color: "#0f172a", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>
            GEMINI 2.5 FLASH
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 14, borderLeft: "4px solid #2563eb" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", marginBottom: 4 }}>PROJECT SCHEDULE RISK</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
              Arpico Kurunegala project is at 72% progress. Material inventory for remaining LED modules is healthy. On schedule for April deadline.
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 14, borderLeft: "4px solid #10b981" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6ee7b7", marginBottom: 4 }}>PROCUREMENT & STOCK</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
              Aluminum Composite Panel 4mm reorder threshold reached (45 sheets remaining). Purchase Order to Lanwa Panels recommended.
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 14, borderLeft: "4px solid #8b5cf6" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#c4b5fd", marginBottom: 4 }}>LEGAL & COMPLIANCE AUDIT</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
              EPF/ETF monthly remittance deadline approaching. Subcontractor SLA with SteelTech requires 12-month DLP compliance verification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
