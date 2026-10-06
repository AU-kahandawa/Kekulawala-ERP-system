import React, { useEffect } from 'react';
import { Check, X, Star, AlertCircle } from 'lucide-react';

/* ─── Badge ──────────────────────────────────────────────── */
export const Badge = ({ status, size = 'sm' }) => {
  const map = {
    active:          ['var(--color-success-bg)', 'var(--color-success)', 'Active'],
    ongoing:         ['var(--color-info-bg)',     'var(--color-info)',    'Ongoing'],
    completed:       ['var(--color-success-bg)', 'var(--color-success)', 'Completed'],
    planning:        ['var(--color-warning-bg)', 'var(--color-warning)', 'Planning'],
    approved:        ['var(--color-success-bg)', 'var(--color-success)', 'Approved'],
    sent:            ['var(--color-info-bg)',     'var(--color-info)',    'Sent'],
    draft:           ['rgba(100,116,139,0.15)',   'var(--text-secondary)','Draft'],
    rejected:        ['var(--color-danger-bg)',   'var(--color-danger)',  'Rejected'],
    issued:          ['var(--color-success-bg)', 'var(--color-success)', 'Issued'],
    signed:          ['var(--color-purple-bg)',   'var(--color-purple)',  'Signed'],
    urgent:          ['var(--color-danger-bg)',   'var(--color-danger)',  '⚡ Urgent'],
    employee:        ['var(--color-info-bg)',     'var(--color-info)',    'Employee'],
    subcontractor:   ['var(--color-purple-bg)',   'var(--color-purple)',  'Subcontractor'],
    high:            ['var(--color-danger-bg)',   'var(--color-danger)',  'High'],
    medium:          ['var(--color-warning-bg)', 'var(--color-warning)', 'Medium'],
    low:             ['var(--color-info-bg)',     'var(--color-info)',    'Low'],
    income:          ['var(--color-success-bg)', 'var(--color-success)', 'Income'],
    expense:         ['var(--color-danger-bg)',   'var(--color-danger)',  'Expense'],
  };

  const [bg, color, label] = map[status] || ['rgba(100,116,139,0.15)', 'var(--text-secondary)', status];

  return (
    <span
      className="badge"
      style={{
        background: bg,
        color,
        padding: size === 'sm' ? '3px 10px' : '5px 13px',
        fontSize: size === 'sm' ? 11 : 12,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
};

/* ─── StatCard ───────────────────────────────────────────── */
export const StatCard = ({ icon: Icon, title, value, sub, color = 'var(--text-accent)', onClick, trend }) => (
  <div
    onClick={onClick}
    className={`stat-card ${onClick ? 'card-clickable' : ''}`}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    {Icon && (
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 13,
          background: `${color}18`,
          border: `1px solid ${color}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={color} strokeWidth={1.8} />
      </div>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {title}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginTop: 3, fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
      )}
      {trend !== undefined && (
        <div style={{ fontSize: 11, color: trend >= 0 ? 'var(--color-success)' : 'var(--color-danger)', marginTop: 3, fontWeight: 600 }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  </div>
);

/* ─── Toast ──────────────────────────────────────────────── */
export const Toast = ({ msg, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-danger)' : 'var(--color-warning)';
  const Icon = type === 'error' ? AlertCircle : Check;

  return (
    <div
      className="erp-toast animate-fade-in no-print"
      style={{ background: bg }}
    >
      <Icon size={17} />
      <span>{msg}</span>
      <button onClick={onClose} style={{ border: 'none', background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '2px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 4 }}>
        <X size={13} color="#fff" />
      </button>
    </div>
  );
};

/* ─── Modal ──────────────────────────────────────────────── */
export const Modal = ({ title, onClose, children, w = 720 }) => (
  <div
    className="erp-modal-overlay no-print animate-scale-in"
    onClick={onClose}
  >
    <div
      className="erp-modal"
      style={{ maxWidth: w }}
      onClick={e => e.stopPropagation()}
    >
      <div className="erp-modal-header">
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'var(--btn-secondary-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 9,
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <X size={15} color="var(--text-secondary)" />
        </button>
      </div>
      <div className="erp-modal-body">{children}</div>
    </div>
  </div>
);

/* ─── FormField ──────────────────────────────────────────── */
export const FormField = ({ label, req, children, hint }) => (
  <div style={{ marginBottom: 14 }}>
    {label && (
      <label className="form-label">
        {label} {req && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      </label>
    )}
    {children}
    {hint && <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 4 }}>{hint}</div>}
  </div>
);

/* ─── StarRating ─────────────────────────────────────────── */
export const StarRating = ({ rating = 0, size = 14 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < Math.round(rating) ? '#f59e0b' : 'none'}
        color={i < Math.round(rating) ? '#f59e0b' : 'var(--text-muted)'}
      />
    ))}
    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginLeft: 4 }}>
      {Number(rating).toFixed(1)}
    </span>
  </div>
);

/* ─── SectionHeader ──────────────────────────────────────── */
export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="section-header">
    <div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <div className="section-sub">{subtitle}</div>}
    </div>
    {action}
  </div>
);

/* ─── EmptyState ─────────────────────────────────────────── */
export const EmptyState = ({ icon: Icon, title, desc, action }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
  }}>
    {Icon && (
      <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--sidebar-active-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={28} color="var(--text-accent)" strokeWidth={1.5} />
      </div>
    )}
    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
    {desc && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 300 }}>{desc}</div>}
    {action}
  </div>
);

/* ─── Divider ────────────────────────────────────────────── */
export const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
    <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
    {label && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
  </div>
);
