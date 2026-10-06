import React, { useState } from 'react';
import { FolderKanban, Plus, CheckCircle2, Clock } from 'lucide-react';
import { Badge, FormField, Modal } from '../components/CommonUI';

export const ProjectsView = ({ projects = [], setProjects, clients = [], showToast }) => {
  const [selectedPrj, setSelectedPrj] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    name: "",
    clientId: clients[0]?.id || 1,
    quoted: 3500000,
    priority: "medium"
  });

  const LKR = (n) => "LKR " + Number(n).toLocaleString("en-LK", { minimumFractionDigits: 0 });

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const handleAdd = () => {
    if (!form.name) return showToast("Project name required", "error");
    const cl = clients.find((c) => c.id === Number(form.clientId));
    const newP = {
      id: `PRJ-${Date.now()}`,
      code: `PRJ-2025-${String(projects.length + 1).padStart(3, '0')}`,
      name: form.name,
      clientId: Number(form.clientId),
      clientName: cl?.name || "Client",
      status: "planning",
      quoted: Number(form.quoted),
      budget: Math.round(Number(form.quoted) * 0.8),
      actual: 0,
      start: new Date().toISOString().split('T')[0],
      deadline: "2025-06-30",
      priority: form.priority,
      progress: 0,
      jobCards: [],
      costs: { labor: 0, materials: 0, tools: 0, transport: 0, indirect: 0 }
    };

    setProjects([newP, ...projects]);
    setShowAddModal(false);
    showToast(`Project "${newP.name}" Created!`);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "planning", "ongoing", "completed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: filter === st ? "#2563eb" : "#cbd5e1",
                background: filter === st ? "#2563eb" : "#ffffff",
                color: filter === st ? "#ffffff" : "#475569",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {st} ({st === "all" ? projects.length : projects.filter(p => p.status === st).length})
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{ background: "#2563eb", color: "#ffffff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedPrj(p)}
            style={{ background: "#ffffff", borderRadius: 14, padding: 20, border: "1px solid #e2e8f0", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Badge status={p.status} />
              <Badge status={p.priority} />
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{p.name}</h3>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>{p.clientName} · {p.code}</div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 6 }}>
              <span>Budget: {LKR(p.budget)}</span>
              <span>Actual: {LKR(p.actual)}</span>
            </div>

            <div style={{ height: 6, borderRadius: 3, background: "#f1f5f9", overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${p.progress}%`, background: p.progress >= 100 ? "#10b981" : "#2563eb" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b" }}>
              <span>{p.progress}% Complete</span>
              <span>Deadline: {p.deadline}</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <Modal title="Create New Project" onClose={() => setShowAddModal(false)} w={520}>
          <FormField label="Project Name" req>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }} />
          </FormField>
          <FormField label="Client">
            <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }}>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label="Quoted Contract Value (LKR)">
            <input type="number" value={form.quoted} onChange={(e) => setForm({ ...form, quoted: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }} />
          </FormField>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <button onClick={() => setShowAddModal(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#ffffff" }}>Cancel</button>
            <button onClick={handleAdd} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#2563eb", color: "#ffffff", fontWeight: 700 }}>Create Project</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
