import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const roleStats = {
  ADMIN: [
    { label: 'Total Patients', value: '2,845', icon: '👥', color: 'purple' },
    { label: 'Active Doctors', value: '48', icon: '🩺', color: 'teal' },
    { label: 'Today\'s Appointments', value: '124', icon: '📅', color: 'blue' },
    { label: 'Revenue (Monthly)', value: '₹18.4L', icon: '💰', color: 'green' },
  ],
  DOCTOR: [
    { label: 'My Patients', value: '156', icon: '👥', color: 'purple' },
    { label: 'Today\'s Appointments', value: '12', icon: '📅', color: 'teal' },
    { label: 'Pending Reports', value: '5', icon: '📋', color: 'orange' },
    { label: 'Completed Today', value: '7', icon: '✅', color: 'green' },
  ],
  RECEPTIONIST: [
    { label: 'Today\'s Check-ins', value: '34', icon: '📝', color: 'purple' },
    { label: 'Upcoming Appointments', value: '67', icon: '📅', color: 'teal' },
    { label: 'Pending Billing', value: '12', icon: '💳', color: 'orange' },
    { label: 'Walk-in Patients', value: '8', icon: '🚶', color: 'blue' },
  ],
  PATIENT: [
    { label: 'Upcoming Visits', value: '2', icon: '📅', color: 'purple' },
    { label: 'Prescriptions', value: '4', icon: '💊', color: 'teal' },
    { label: 'Lab Reports', value: '3', icon: '🔬', color: 'blue' },
    { label: 'Bills Due', value: '1', icon: '💳', color: 'orange' },
  ],
};

const recentActivity = [
  { time: '10 min ago', text: 'New appointment scheduled — Dr. Sharma', type: 'info' },
  { time: '25 min ago', text: 'Lab report uploaded for Patient #2841', type: 'success' },
  { time: '1 hr ago', text: 'Billing completed — Invoice #HMS-4521', type: 'success' },
  { time: '2 hrs ago', text: 'New patient registered — Rahul Verma', type: 'info' },
  { time: '3 hrs ago', text: 'Prescription updated by Dr. Patel', type: 'warning' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role || 'PATIENT';
  const stats = roleStats[role] || roleStats.PATIENT;
  const greeting = getGreeting();

  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.greeting}>
              {greeting}, <span style={styles.name}>{user?.first_name || user?.username}</span> 👋
            </h1>
            <p style={styles.roleTag}>
              <span style={styles.roleBadge}>{user?.role_display || role}</span>
              <span style={styles.date}>{formatDate()}</span>
            </p>
          </div>
          <div style={styles.headerActions}>
            <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>
              🔔 Notifications
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section style={styles.statsGrid} className="fade-in">
          {stats.map((stat, i) => (
            <div key={i} className={`stat-card ${stat.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Content Grid */}
        <div style={styles.contentGrid}>
          {/* Recent Activity */}
          <div className="glass-card" style={styles.activityCard}>
            <h2 style={styles.cardTitle}>Recent Activity</h2>
            <div style={styles.activityList}>
              {recentActivity.map((item, i) => (
                <div key={i} style={styles.activityItem}>
                  <div style={{
                    ...styles.activityDot,
                    background: item.type === 'success' ? 'var(--success)'
                      : item.type === 'warning' ? 'var(--warning)'
                      : 'var(--info)',
                  }} />
                  <div style={{ flex: 1 }}>
                    <p style={styles.activityText}>{item.text}</p>
                    <span style={styles.activityTime}>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card" style={styles.actionsCard}>
            <h2 style={styles.cardTitle}>Quick Actions</h2>
            <div style={styles.actionsList}>
              {getQuickActions(role).map((action, i) => (
                <button key={i} style={styles.actionBtn} className="btn-ghost btn">
                  <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getQuickActions(role) {
  const actions = {
    ADMIN: [
      { icon: '➕', label: 'Add Doctor' },
      { icon: '📊', label: 'View Reports' },
      { icon: '👥', label: 'Manage Users' },
      { icon: '⚙️', label: 'Settings' },
    ],
    DOCTOR: [
      { icon: '📅', label: 'View Schedule' },
      { icon: '📋', label: 'Write Prescription' },
      { icon: '🔬', label: 'Order Lab Test' },
      { icon: '👤', label: 'Patient Records' },
    ],
    RECEPTIONIST: [
      { icon: '➕', label: 'New Appointment' },
      { icon: '📝', label: 'Check-in Patient' },
      { icon: '💳', label: 'Process Billing' },
      { icon: '📞', label: 'Contact Directory' },
    ],
    PATIENT: [
      { icon: '📅', label: 'Book Appointment' },
      { icon: '💊', label: 'My Prescriptions' },
      { icon: '🔬', label: 'Lab Reports' },
      { icon: '👤', label: 'Update Profile' },
    ],
  };
  return actions[role] || actions.PATIENT;
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
  },
  main: {
    flex: 1,
    marginLeft: 'var(--sidebar-width)',
    padding: '32px 40px',
    maxWidth: '100%',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  greeting: {
    fontSize: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: 8,
  },
  name: {
    background: 'linear-gradient(135deg, var(--primary-400), var(--accent-400))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  roleTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  roleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: '0.75rem',
    fontWeight: 600,
    background: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--primary-400)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
  },
  headerActions: {
    display: 'flex',
    gap: 8,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
    marginBottom: 32,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: 24,
  },
  activityCard: {
    padding: 28,
  },
  cardTitle: {
    fontSize: '1.0625rem',
    fontWeight: 600,
    marginBottom: 20,
    letterSpacing: '-0.01em',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid var(--border-subtle)',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginTop: 6,
    flexShrink: 0,
  },
  activityText: {
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    lineHeight: 1.5,
  },
  activityTime: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: 2,
    display: 'block',
  },
  actionsCard: {
    padding: 28,
  },
  actionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  actionBtn: {
    width: '100%',
    justifyContent: 'flex-start',
    padding: '12px 16px',
    fontSize: '0.875rem',
    borderRadius: 'var(--radius-sm)',
    gap: 12,
  },
};
