import React, { useState } from 'react';
import {
  Users, Plus, Search, Phone, Mail, MapPin, TrendingUp,
  Star, Edit2, Trash2, ChevronDown, ChevronUp, Building2, X
} from 'lucide-react';
import { Badge, Modal, FormField, StatCard, StarRating } from '../components/CommonUI';

const LKR = (n) => 'LKR ' + Number(n || 0).toLocaleString('en-LK', { minimumFractionDigits: 0 });

const LOYALTY_COLORS = {
  high: { bg: '#dcfce7', text: '#166534', label: 'High Value' },
  medium: { bg: '#fef3c7', text: '#92400e', label: 'Medium' },
  low: { bg: '#fee2e2', text: '#991b1b', label: 'Low' },
};

const EMPTY_FORM = {
  name: '', company: '', contact: '', phone: '', email: '',
  address: '', loyalty: 'medium', totalRevenue: 0, notes: ''
};

export const CRMClientsView = ({ clients = [], setClients, projects = [], showToast }) => {
  const [search, setSearch] = useState('');
  const [loyaltyFilter, setLoyaltyFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.contact || '').toLowerCase().includes(search.toLowerCase());
    const matchLoyalty = loyaltyFilter === 'all' || c.loyalty === loyaltyFilter;
    return matchSearch && matchLoyalty;
  });

  const openAdd = () => { setEditId(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (c) => { setEditId(c.id); setForm({ ...c }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim()) return showToast('Client name is required', 'error');
    if (!form.email.trim()) return showToast('Email is required', 'error');
    if (editId) {
      setClients(clients.map(c => c.id === editId ? { ...c, ...form } : c));
      showToast(`Client "${form.name}" updated successfully!`);
    } else {
      const newC = { ...form, id: Date.now(), totalRevenue: Number(form.totalRevenue) || 0 };
      setClients([newC, ...clients]);
      showToast(`Client "${form.name}" added to CRM!`);
    }
    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    setClients(clients.filter(c => c.id !== id));
    showToast(`Client "${name}" removed from CRM`, 'warning');
  };

  const totalRevenue = clients.reduce((s, c) => s + (c.totalRevenue || 0), 0);
  const highValue = clients.filter(c => c.loyalty === 'high').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>CRM & Clients</h2>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            Client relationship management — contacts, loyalty tiers & revenue history
          </div>
        </div>
        <button onClick={openAdd} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
          <Plus size={18} /> Add Client
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <StatCard icon={Users} title="Total Clients" value={clients.length} sub="In CRM database" color="#2563eb" />
        <StatCard icon={Star} title="High Value" value={highValue} sub="Top-tier clients" color="#f59e0b" />
        <StatCard icon={TrendingUp} title="Total Client Revenue" value={LKR(totalRevenue)} sub="Lifetime revenue" color="#10b981" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            placeholder="Search clients, companies, contacts..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, background: '#fff' }}
          />
        </div>
        {['all', 'high', 'medium', 'low'].map(tier => (
          <button key={tier} onClick={() => setLoyaltyFilter(tier)}
            style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid', borderColor: loyaltyFilter === tier ? '#2563eb' : '#e2e8f0', background: loyaltyFilter === tier ? '#2563eb' : '#fff', color: loyaltyFilter === tier ? '#fff' : '#475569', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {tier === 'all' ? `All (${clients.length})` : `${LOYALTY_COLORS[tier].label} (${clients.filter(c => c.loyalty === tier).length})`}
          </button>
        ))}
      </div>

      {/* Client Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0' }}>
            No clients found. Add your first client!
          </div>
        )}
        {filtered.map(c => {
          const lc = LOYALTY_COLORS[c.loyalty] || LOYALTY_COLORS.low;
          const clientProjects = projects.filter(p => p.clientId === c.id);
          const isExpanded = expanded === c.id;
          return (
            <div key={c.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px' }}>
                {/* Avatar */}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>
                  {c.name.charAt(0)}
                </div>
                {/* Main Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{c.name}</span>
                    <span style={{ background: lc.bg, color: lc.text, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>{lc.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{c.company}</div>
                </div>
                {/* Contact Info */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={13} />{c.phone}</div>
                  <div style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={13} />{c.email}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{LKR(c.totalRevenue)}</div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button onClick={() => openEdit(c)} style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Edit2 size={14} color="#475569" /></button>
                  <button onClick={() => handleDelete(c.id, c.name)} style={{ border: 'none', background: '#fee2e2', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Trash2 size={14} color="#ef4444" /></button>
                  <button onClick={() => setExpanded(isExpanded ? null : c.id)} style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {isExpanded ? <ChevronUp size={14} color="#475569" /> : <ChevronDown size={14} color="#475569" />}
                  </button>
                </div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '14px 18px', background: '#f8fafc', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Contact Details</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 12, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}><Users size={13} color="#8b5cf6" /><strong>Contact:</strong> {c.contact}</div>
                      <div style={{ fontSize: 12, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} color="#ef4444" />{c.address}</div>
                      {c.notes && <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>📝 {c.notes}</div>}
                    </div>
                  </div>
                  <div style={{ flex: 2, minWidth: 280 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Project History ({clientProjects.length})</div>
                    {clientProjects.length === 0 ? (
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>No projects linked yet</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {clientProjects.map(p => (
                          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: '#64748b' }}>{p.code} · {p.start} → {p.deadline}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <Badge status={p.status} />
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', marginTop: 4 }}>{LKR(p.quoted)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editId ? 'Edit Client' : 'Add New Client'} onClose={() => setShowModal(false)} w={600}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FormField label="Client / Company Name" req>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }} placeholder="Arpico Supercentre" />
            </FormField>
            <FormField label="Parent Company">
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }} placeholder="Richard Pieris & Co" />
            </FormField>
            <FormField label="Primary Contact Person">
              <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }} />
            </FormField>
            <FormField label="Phone Number">
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }} placeholder="0771234567" />
            </FormField>
            <FormField label="Email Address" req>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }} />
            </FormField>
            <FormField label="Loyalty Tier">
              <select value={form.loyalty} onChange={e => setForm({ ...form, loyalty: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}>
                <option value="high">High Value</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </FormField>
          </div>
          <FormField label="Address">
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }} placeholder="No. 123, Main Street, Colombo" />
          </FormField>
          <FormField label="Total Revenue (LKR)">
            <input type="number" value={form.totalRevenue} onChange={e => setForm({ ...form, totalRevenue: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }} />
          </FormField>
          <FormField label="Notes">
            <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, resize: 'vertical' }} />
          </FormField>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <button onClick={() => setShowModal(false)} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {editId ? 'Save Changes' : 'Add Client'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
