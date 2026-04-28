import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabaseClient';

export default function LabsPage() {
  const { currentUser } = useAuth();
  const isPatient = currentUser?.role === 'patient';
  const isAdmin = currentUser?.role === 'admin';

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('medical_records')
        .select(`
          *,
          doctor:doctors(profile:profiles(full_name)),
          patient:patients(profile:profiles(full_name))
        `)
        .eq('type', 'report');
      
      if (isPatient) {
        query = query.eq('patient_id', currentUser.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Laboratory Reports</h1>
            <p style={styles.subtitle}>Access diagnostic test results and medical reports.</p>
          </div>
          <div style={styles.headerActions}>
            <button className="btn btn-primary">Schedule Test</button>
          </div>
        </header>

        {loading ? (
          <div style={styles.loading}>Loading laboratory data...</div>
        ) : (
          <div style={styles.grid}>
            {reports.length === 0 ? (
              <div className="glass-card" style={styles.emptyCard}>
                <div style={styles.emptyIcon}>🧪</div>
                <h3 style={styles.emptyTitle}>No Reports Found</h3>
                <p style={styles.emptyText}>Your laboratory results and diagnostic reports will be displayed here.</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="glass-card fade-in" style={styles.rCard}>
                  <div style={styles.rIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div style={styles.rInfo}>
                    <h3 style={styles.rTitle}>{report.title}</h3>
                    <p style={styles.rMeta}>Generated on {new Date(report.created_at).toLocaleDateString()} by Dr. {report.doctor?.profile?.full_name}</p>
                    {isAdmin && <p style={styles.rPatient}>Patient: {report.patient?.profile?.full_name}</p>}
                  </div>
                  <div style={styles.rActions}>
                    <button className="btn btn-ghost" style={{ padding: '8px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>View Details</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' },
  main: { flex: 1, marginLeft: 'var(--sidebar-width)', padding: '32px 40px', overflow: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  title: { fontSize: '1.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' },
  subtitle: { fontSize: '0.9rem', color: 'var(--text-muted)' },
  headerActions: { display: 'flex', gap: 12 },
  grid: { display: 'flex', flexDirection: 'column', gap: 16 },
  rCard: { padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 },
  rIcon: { width: 48, height: 48, borderRadius: 10, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rInfo: { flex: 1 },
  rTitle: { fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 },
  rMeta: { fontSize: '0.8125rem', color: 'var(--text-muted)' },
  rPatient: { fontSize: '0.75rem', color: 'var(--primary-400)', marginTop: 4, fontWeight: 500 },
  rActions: { display: 'flex', alignItems: 'center', gap: 12 },
  emptyCard: { padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  emptyIcon: { fontSize: '3rem' },
  emptyTitle: { fontSize: '1.25rem', fontWeight: 600 },
  emptyText: { color: 'var(--text-muted)', maxWidth: 400 },
  loading: { color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 },
};
