import React, { useState } from 'react';
import {
  LayoutDashboard, FolderKanban, Users, UserCheck, CalendarCheck,
  CreditCard, Package, Wrench, ShoppingBag, Truck, Building2,
  FileText, Sparkles, Scale, DollarSign, Settings, ChevronLeft,
  ChevronRight, Bell, Menu, Database, X, Sun, Moon, Palette,
  Home, Grid3x3, BarChart2, PlusCircle
} from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';

export const NAV_ITEMS = [
  { id: 'dashboard',       label: 'Dashboard',            icon: LayoutDashboard, category: 'Overview' },

  { id: 'projects',        label: 'Projects & Job Cards',  icon: FolderKanban,    category: 'Operations' },
  { id: 'clients',         label: 'CRM & Clients',         icon: Users,           category: 'Operations' },
  { id: 'hr',              label: 'Workforce & Pools',     icon: UserCheck,       category: 'Operations' },
  { id: 'attendance',      label: 'Attendance',            icon: CalendarCheck,   category: 'Operations' },
  { id: 'payroll',         label: 'Payroll Calculator',    icon: CreditCard,      category: 'Operations' },

  { id: 'inventory',       label: 'Materials Stock',       icon: Package,         category: 'Inventory & Procurement' },
  { id: 'tools',           label: 'Tools',                 icon: Wrench,          category: 'Inventory & Procurement' },
  { id: 'orders',          label: 'Purchase Orders',       icon: ShoppingBag,     category: 'Inventory & Procurement' },
  { id: 'suppliers',       label: 'Supplier Directory',    icon: Building2,       category: 'Inventory & Procurement' },
  { id: 'transport',       label: 'Transport & Logistics', icon: Truck,           category: 'Inventory & Procurement' },

  { id: 'quotations',      label: 'Quotations Builder',    icon: FileText,        category: 'Studio' },
  { id: 'ai_estimator',    label: 'AI BOQ Estimator',      icon: Sparkles,        category: 'Studio' },
  { id: 'document_studio', label: 'Letter & MOU Studio',   icon: FileText,        category: 'Studio' },

  { id: 'finance',         label: 'Financial Ledger',      icon: DollarSign,      category: 'Finance & Legal' },
  { id: 'legal_advisor',   label: 'SL Legal Advisor',      icon: Scale,           category: 'Finance & Legal' },
  { id: 'settings',        label: 'Settings',              icon: Settings,        category: 'Finance & Legal' },
];

// Bottom nav quick items for mobile (max 5)
const MOBILE_NAV = [
  { id: 'dashboard',  label: 'Home',    icon: Home },
  { id: 'projects',   label: 'Projects', icon: FolderKanban },
  { id: 'clients',    label: 'CRM',     icon: Users },
  { id: 'finance',    label: 'Finance', icon: BarChart2 },
  { id: 'settings',   label: 'More',    icon: Grid3x3, isSidebarToggle: true },
];

const CATEGORIES = ['Overview', 'Operations', 'Inventory & Procurement', 'Studio', 'Finance & Legal'];

// ─── Theme Picker Popup ─────────────────────────────────────
const ThemePicker = ({ onClose }) => {
  const { themeId, setThemeId } = useTheme();
  return (
    <div
      style={{
        position: 'absolute', top: 48, right: 0, zIndex: 9999,
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 16, padding: '14px 16px', width: 260,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        🎨 Choose Theme
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => { setThemeId(t.id); onClose(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10, border: '1.5px solid',
              borderColor: themeId === t.id ? 'var(--text-accent)' : 'var(--card-border)',
              background: themeId === t.id ? 'var(--sidebar-active-bg)' : 'var(--card-bg)',
              cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s',
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, background: t.dot, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t.description}</div>
            </div>
            {themeId === t.id && (
              <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: 99, background: 'var(--text-accent)', flexShrink: 0 }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Main HeaderSidebar Component ──────────────────────────
export const HeaderSidebar = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  dailyTip = '',
  children,
}) => {
  const activeItem = NAV_ITEMS.find(n => n.id === activePage) || NAV_ITEMS[0];
  const { currentTheme, themeId } = useTheme();
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  const navigate = (id) => {
    setActivePage(id);
    setMobileOpen(false);
  };

  const renderNavList = () => (
    <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
      {CATEGORIES.map(cat => {
        const items = NAV_ITEMS.filter(n => n.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} style={{ marginBottom: 6 }}>
            {!collapsed && (
              <div style={{
                padding: '8px 10px 4px',
                fontSize: 9.5,
                fontWeight: 800,
                color: 'var(--sidebar-cat-text)',
                textTransform: 'uppercase',
                letterSpacing: 1.2,
              }}>
                {cat}
              </div>
            )}
            {collapsed && <div style={{ height: 1, background: 'var(--sidebar-border)', margin: '6px 4px' }} />}
            {items.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                  style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px' : '9px 12px' }}
                >
                  <Icon
                    size={17}
                    color={isActive ? 'var(--sidebar-icon-active)' : 'var(--sidebar-text)'}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    style={{ flexShrink: 0 }}
                  />
                  {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
                </button>
              );
            })}
          </div>
        );
      })}
    </nav>
  );

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div style={{
        padding: collapsed ? '14px 10px' : '14px 16px',
        borderBottom: '1px solid var(--sidebar-border)',
        display: 'flex', alignItems: 'center', gap: 10, minHeight: 60, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--brand-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ffffff', fontSize: 16, fontWeight: 900, flexShrink: 0,
          boxShadow: '0 4px 12px rgba(37,99,235,0.35)',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          K
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', letterSpacing: 0.3, whiteSpace: 'nowrap', fontFamily: "'Space Grotesk', sans-serif" }}>
              KEKULAWALA
            </div>
            <div style={{ fontSize: 9, color: 'var(--sidebar-cat-text)', fontWeight: 600, letterSpacing: 1.2, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
              Unified ERP v5.0
            </div>
          </div>
        )}
      </div>

      {/* DB Status */}
      {!collapsed && (
        <div style={{
          margin: '8px 10px 0',
          padding: '6px 10px',
          borderRadius: 8,
          background: 'var(--db-pill-bg)',
          display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--db-pill-text)', animation: 'pulseGlow 2s infinite' }} />
          <span style={{ fontSize: 10, color: 'var(--db-pill-text)', fontWeight: 700 }}>Firebase / Supabase Synced</span>
        </div>
      )}

      {renderNavList()}

      {/* Collapse Toggle */}
      <div style={{ padding: '8px 8px', borderTop: '1px solid var(--sidebar-border)', flexShrink: 0 }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="nav-item"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px' : '9px 12px' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight size={16} color="var(--sidebar-text)" />
            : <><ChevronLeft size={16} color="var(--sidebar-text)" /><span style={{ fontSize: 12, color: 'var(--sidebar-text)' }}>Collapse</span></>
          }
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar ──────────────────────────────── */}
      <aside
        className={`erp-sidebar no-print`}
        style={{ width: collapsed ? 56 : 228 }}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile Overlay ───────────────────────────────── */}
      {mobileOpen && (
        <div
          className="erp-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer Sidebar ────────────────────────── */}
      <aside
        className={`erp-sidebar mobile-open no-print show-mobile-only`}
        style={{
          position: 'fixed', top: 0, left: 0,
          height: '100dvh', width: 260,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-110%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 300,
          boxShadow: mobileOpen ? '8px 0 50px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--sidebar-border)', minHeight: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 900 }}>K</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>KEKULAWALA</div>
              <div style={{ fontSize: 9, color: 'var(--sidebar-cat-text)', fontWeight: 600, letterSpacing: 1 }}>Unified ERP v5.0</div>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ border: 'none', background: 'rgba(255,255,255,0.08)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="rgba(255,255,255,0.7)" />
          </button>
        </div>
        <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto' }}>
          {CATEGORIES.map(cat => {
            const items = NAV_ITEMS.filter(n => n.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: 6 }}>
                <div style={{ padding: '8px 10px 4px', fontSize: 9.5, fontWeight: 800, color: 'var(--sidebar-cat-text)', textTransform: 'uppercase', letterSpacing: 1.2 }}>{cat}</div>
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button key={item.id} onClick={() => navigate(item.id)} className={`nav-item ${isActive ? 'active' : ''}`}>
                      <Icon size={17} color={isActive ? 'var(--sidebar-icon-active)' : 'var(--sidebar-text)'} strokeWidth={isActive ? 2.2 : 1.7} style={{ flexShrink: 0 }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content Wrapper ──────────────────────────── */}
      <div className="erp-main-wrapper">
        {/* Top Header Bar */}
        <header className="erp-topbar no-print" onClick={() => themePickerOpen && setThemePickerOpen(false)}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={e => { e.stopPropagation(); setMobileOpen(!mobileOpen); }}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', borderRadius: 8, minHeight: 36 }}
            >
              <Menu size={20} color="var(--header-muted)" />
            </button>
            <div>
              <h1 style={{ fontSize: 15, fontWeight: 700, color: 'var(--header-text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
                {activeItem.label}
              </h1>
            </div>
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Daily tip - hidden on mobile */}
            {dailyTip && (
              <div className="hide-mobile" style={{
                fontSize: 11, color: 'var(--tipbar-text)', background: 'var(--tipbar-bg)',
                padding: '5px 10px', borderRadius: 8, fontWeight: 600,
                maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                💡 {dailyTip}
              </div>
            )}

            {/* Date - hidden on mobile */}
            <div className="hide-mobile" style={{ fontSize: 11, color: 'var(--header-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {new Date().toLocaleDateString('en-LK', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>

            {/* Theme Picker Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={e => { e.stopPropagation(); setThemePickerOpen(!themePickerOpen); }}
                style={{
                  border: '1px solid var(--header-user-border)',
                  background: 'var(--header-user-bg)',
                  borderRadius: 9, padding: '5px 10px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 7, minHeight: 34,
                }}
                title="Switch theme"
              >
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: currentTheme?.dot || 'var(--brand-gradient)', flexShrink: 0 }} />
                <span className="hide-mobile" style={{ fontSize: 11, fontWeight: 700, color: 'var(--header-text)' }}>
                  {currentTheme.name}
                </span>
                <Palette size={13} color="var(--header-muted)" />
              </button>
              {themePickerOpen && <ThemePicker onClose={() => setThemePickerOpen(false)} />}
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative', cursor: 'pointer', padding: 6 }}>
              <Bell size={18} color="var(--header-muted)" />
              <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: 99, background: 'var(--color-danger)', border: '1.5px solid var(--header-bg)' }} />
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 10, background: 'var(--header-user-bg)', border: '1px solid var(--header-user-border)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #2563eb, #10b981)', color: '#ffffff', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>
                AD
              </div>
              <span className="hide-mobile" style={{ fontSize: 12, fontWeight: 600, color: 'var(--header-text)' }}>Admin</span>
            </div>
          </div>
        </header>

        {/* ── Dynamic Content Slot ──────────────────────── */}
        <main className="erp-content">
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ──────────────────────── */}
      <nav className="mobile-bottom-nav no-print" style={{ alignItems: 'stretch' }}>
        {MOBILE_NAV.map(item => {
          const Icon = item.icon;
          const isActive = !item.isSidebarToggle && activePage === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (item.isSidebarToggle) { setMobileOpen(true); }
                else { navigate(item.id); }
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
