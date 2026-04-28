import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabaseClient';

export default function PharmacyPage() {
  const { currentUser } = useAuth();
  const isPatient = currentUser?.role === 'patient';
  const isDoctor = currentUser?.role === 'doctor';
  const isAdmin = currentUser?.role === 'admin';

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('medical_records')
        .select(`
          *,
          doctor:doctors(profile:profiles(full_name)),
          patient:patients(profile:profiles(full_name))
        `)
        .eq('type', 'prescription');
      
      if (isPatient) {
        query = query.eq('patient_id', currentUser.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      setPrescriptions(data || []);
    } catch (error) {
      console.error('Failed to fetch prescriptions', error);
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
            <h1 style={styles.title}>Pharmacy & Medications</h1>
            <p style={styles.subtitle}>Manage prescriptions and medication history.</p>
          </div>
          <div style={styles.headerActions}>
            <button className="btn btn-primary">Order Medication</button>
          </div>
        </header>

        {loading ? (
          <div style={styles.loading}>Loading prescriptions...</div>
        ) : (
          <div style={styles.grid}>
            {prescriptions.length === 0 ? (
              <div className="glass-card" style={styles.emptyCard}>
                <div style={styles.emptyIcon}>💊</div>
                <h3 style={styles.emptyTitle}>No Active Prescriptions</h3>
                <p style={styles.emptyText}>Your medication history will appear here once a doctor issues a prescription.</p>
              </div>
            ) : (
              prescriptions.map((item) => (
                <div key={item.id} className="glass-card fade-in" style={styles.pCard}>
                  <div style={styles.pHeader}>
                    <div style={styles.pTag}>Prescription</div>
                    <span style={styles.pDate}>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 style={styles.pTitle}>{item.title}</h3>
                  <p style={styles.pContent}>{item.content}</p>
                  <div style={styles.pMeta}>
                    <div style={styles.pAuthor}>
                      <span style={{ color: 'var(--text-muted)' }}>By: </span>
                      Dr. {item.doctor?.profile?.full_name || 'N/A'}
                    </div>
                    {isAdmin && (
                      <div style={styles.pAuthor}>
                        <span style={{ color: 'var(--text-muted)' }}>For: </span>
                        {item.patient?.profile?.full_name}
                      </div>
                    )}
                  </div>
                  <div style={styles.pFooter}>
                    <button className="btn btn-ghost" style={{ fontSize: '0.75rem' }}>View Dosage</button>
                    <button className="btn btn-ghost" style={{ fontSize: '0.75rem', color: 'var(--primary-400)' }}>Refill</button>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 },
  pCard: { padding: 24, display: 'flex', flexDirection: 'column', gap: 16 },
  pHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  pTag: { fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-400)', padding: '4px 8px', borderRadius: 4 },
  pDate: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  pTitle: { fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' },
  pContent: { fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, minHeight: 60 },
  pMeta: { display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' },
  pAuthor: { fontSize: '0.75rem', color: 'var(--text-primary)' },
  pFooter: { display: 'flex', gap: 12, marginTop: 8 },
  emptyCard: { gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  emptyIcon: { fontSize: '3rem' },
  emptyTitle: { fontSize: '1.25rem', fontWeight: 600 },
  emptyText: { color: 'var(--text-muted)', maxWidth: 400 },
  loading: { color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 },
};
