import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuConfig = {
  admin: [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📅', label: 'Appointments', path: '/appointments' },
    { icon: '👥', label: 'Patients', path: '/patients' },
    { icon: '🩺', label: 'Doctors', path: '/doctors' },
    { icon: '📄', label: 'Medical Records', path: '/records' },
    { icon: '💊', label: 'Pharmacy', path: '/pharmacy' },
    { icon: '🧪', label: 'Labs & Reports', path: '/labs' },
    { icon: '💰', label: 'Billing', path: '/billing' },
  ],
  doctor: [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📅', label: 'My Appointments', path: '/appointments' },
    { icon: '👥', label: 'Patients', path: '/patients' },
    { icon: '📄', label: 'Medical Records', path: '/records' },
    { icon: '💊', label: 'Pharmacy', path: '/pharmacy' },
    { icon: '🧪', label: 'Labs', path: '/labs' },
  ],
  patient: [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📅', label: 'My Appointments', path: '/appointments' },
    { icon: '📄', label: 'My Records', path: '/records' },
    { icon: '🧪', label: 'Test Results', path: '/labs' },
    { icon: '💰', label: 'My Bills', path: '/billing' },
  ],
};

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const role = currentUser?.role || 'patient';
  const items = menuConfig[role] || menuConfig.patient;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <div style={styles.logoIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <div style={styles.brandName}>MedPortal</div>
          <div style={styles.brandTag}>HMS</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navLabel}>MENU</div>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navText}>{item.label}</span>
              {isActive && <div style={styles.activeIndicator} />}
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div style={styles.userSection}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {(currentUser?.full_name?.[0] || '?').toUpperCase()}
          </div>
          <div style={styles.userDetails}>
            <div style={styles.userName}>
              {currentUser?.full_name || 'User'}
            </div>
            <div style={styles.userRole}>{role}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn} title="Sign out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: 'var(--sidebar-width)',
    background: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    backdropFilter: 'blur(20px)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '24px 24px 20px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    flexShrink: 0,
  },
  brandName: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  brandTag: {
    fontSize: '0.625rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  nav: {
    flex: 1,
    padding: '16px 12px',
    overflowY: 'auto',
  },
  navLabel: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    padding: '8px 12px 12px',
  },
  navItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    marginBottom: 2,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    position: 'relative',
    textAlign: 'left',
  },
  navItemActive: {
    background: 'rgba(99, 102, 241, 0.1)',
    color: 'var(--primary-400)',
  },
  navIcon: {
    fontSize: '1.125rem',
    width: 24,
    textAlign: 'center',
    flexShrink: 0,
  },
  navText: {
    flex: 1,
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 3,
    height: 20,
    borderRadius: 3,
    background: 'var(--primary-500)',
  },
  userSection: {
    padding: '16px 16px 20px',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: 600,
    flexShrink: 0,
  },
  userDetails: {
    minWidth: 0,
  },
  userName: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '0.6875rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
    background: 'transparent',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  },
};
