import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const isDoctor = currentUser?.role === 'doctor';
  const isAdmin = currentUser?.role === 'admin';
  const role = currentUser?.role || 'patient';
  const greeting = getGreeting();

  const [stats, setStats] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let dynamicStats = [];
      
      if (role === 'admin') {
        const { count: patientCount } = await supabase.from('patients').select('*', { count: 'exact', head: true });
        const { count: doctorCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true });
        const { count: appointmentCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
        
        dynamicStats = [
          { label: 'Total Patients', value: patientCount || 0, icon: '👥', color: 'purple' },
          { label: 'Active Doctors', value: doctorCount || 0, icon: '🩺', color: 'teal' },
          { label: 'Total Appointments', value: appointmentCount || 0, icon: '📅', color: 'blue' },
        ];
      } else if (role === 'doctor') {
        const { count: myAppointments } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('doctor_id', currentUser.id);
        
        dynamicStats = [
          { label: 'My Appointments', value: myAppointments || 0, icon: '📅', color: 'teal' },
        ];
      } else if (role === 'patient') {
        const { count: upcoming } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('patient_id', currentUser.id);
        
        dynamicStats = [
          { label: 'My Visits', value: upcoming || 0, icon: '📅', color: 'purple' },
        ];
      }
      setStats(dynamicStats);

      // Fetch Recent Activity (last 5 appointments)
      const { data: recentAppts } = await supabase
        .from('appointments')
        .select(`
          id, 
          date, 
          status, 
          profiles:patient_id (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      const mappedActivity = recentAppts?.map(a => ({
        time: new Date(a.date).toLocaleDateString(),
        text: `Appointment ${a.status} for ${a.profiles?.full_name || 'Patient'}`,
        type: a.status === 'confirmed' ? 'success' : 'info'
      })) || [];
      
      setActivity(mappedActivity);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.greeting}>
              {greeting}, <span style={styles.name}>{currentUser?.full_name || 'User'}</span> 👋
            </h1>
            <p style={styles.roleTag}>
              <span style={styles.roleBadge}>{role}</span>
              <span style={styles.date}>{formatDate()}</span>
            </p>
          </div>
          <div style={styles.headerActions}>
            <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>
              🔔 Notifications
            </button>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading dashboard data...
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <section style={styles.statsGrid} className="fade-in">
              {stats.length > 0 ? (
                stats.map((stat, i) => (
                  <div key={i} className={`stat-card ${stat.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))
              ) : (
                <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No statistics available yet.</p>
                </div>
              )}
            </section>

            {/* Content Grid */}
            <div style={styles.contentGrid}>
              {/* Recent Activity */}
              <div className="glass-card" style={styles.activityCard}>
                <h2 style={styles.cardTitle}>Recent Activity</h2>
                <div style={styles.activityList}>
                  {activity.length > 0 ? (
                    activity.map((item, i) => (
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
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent activity found.</p>
                      <p style={{ fontSize: '0.75rem', marginTop: 8 }}>Start by adding your first record.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card" style={styles.actionsCard}>
                <h2 style={styles.cardTitle}>Quick Actions</h2>
                <div style={styles.actionsList}>
                  {getQuickActions(role).map((action, i) => (
                    <button 
                      key={i} 
                      style={styles.actionBtn} 
                      className="btn-ghost btn"
                      onClick={() => action.path && navigate(action.path)}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
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
    admin: [
      { icon: '➕', label: 'Add Doctor', path: '/register' },
      { icon: '📊', label: 'View Reports', path: '/appointments' },
      { icon: '👥', label: 'Manage Users', path: '/patients' },
    ],
    doctor: [
      { icon: '📅', label: 'View Schedule', path: '/appointments' },
      { icon: '📋', label: 'Write Prescription', path: '/records' },
      { icon: '👤', label: 'Patient Records', path: '/patients' },
    ],
    patient: [
      { icon: '📅', label: 'Book Appointment', path: '/appointments' },
      { icon: '👤', label: 'Update Profile', path: '/profile' },
    ],
  };
  return actions[role] || actions.patient;
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
