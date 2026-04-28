import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabaseClient';

export default function BillingPage() {
  const { currentUser } = useAuth();
  const isPatient = currentUser?.role === 'patient';
  const isAdmin = currentUser?.role === 'admin';

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('billing')
        .select(`
          *,
          patient:patients(profile:profiles(full_name))
        `);
      
      if (isPatient) {
        query = query.eq('patient_id', currentUser.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      setBills(data || []);
    } catch (error) {
      console.error('Failed to fetch bills', error);
    } finally {
      setLoading(false);
    }
  };

  const totalUnpaid = bills
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + parseFloat(b.amount), 0);

  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Billing & Invoices</h1>
            <p style={styles.subtitle}>Track your medical expenses and payment status.</p>
          </div>
          {isAdmin && (
            <div style={styles.headerActions}>
              <button className="btn btn-primary">+ Generate Invoice</button>
            </div>
          )}
        </header>

        {isPatient && !loading && totalUnpaid > 0 && (
          <div className="glass-card fade-in" style={styles.alertCard}>
            <div style={styles.alertIcon}>💰</div>
            <div style={styles.alertContent}>
              <h3 style={styles.alertTitle}>Outstanding Balance</h3>
              <p style={styles.alertText}>You have an unpaid balance of <strong>₹{totalUnpaid.toFixed(2)}</strong>. Please settle your invoices to avoid service interruption.</p>
            </div>
            <button className="btn btn-primary" style={{ background: 'white', color: 'var(--primary-600)' }}>Pay Now</button>
          </div>
        )}

        {loading ? (
          <div style={styles.loading}>Loading billing data...</div>
        ) : (
          <div className="glass-card" style={styles.card}>
            {bills.length === 0 ? (
              <div style={styles.emptyContainer}>
                <p style={styles.emptyText}>No billing records found.</p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Invoice ID</th>
                    {isAdmin && <th style={styles.th}>Patient</th>}
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Due Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <tr key={bill.id} style={styles.tr}>
                      <td style={styles.td}>#{bill.id.substring(0, 8).toUpperCase()}</td>
                      {isAdmin && <td style={styles.td}>{bill.patient?.profile?.full_name}</td>}
                      <td style={styles.td}>{bill.description || 'Medical Services'}</td>
                      <td style={styles.td}>₹{parseFloat(bill.amount).toFixed(2)}</td>
                      <td style={styles.td}>{bill.due_date ? new Date(bill.due_date).toLocaleDateString() : 'N/A'}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.statusBadge(bill.status) }}>{bill.status}</span>
                      </td>
                      <td style={styles.td}>
                        <button className="btn btn-ghost" style={{ fontSize: '0.75rem' }}>Download PDF</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
  alertCard: { background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))', padding: '24px 32px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 24, color: 'white' },
  alertIcon: { fontSize: '2.5rem' },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 },
  alertText: { fontSize: '0.9375rem', opacity: 0.9 },
  card: { padding: 24, overflowX: 'auto' },
  loading: { color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 },
  emptyContainer: { textAlign: 'center', padding: '40px 20px' },
  emptyText: { color: 'var(--text-muted)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' },
  tr: { borderBottom: '1px solid var(--border-subtle)' },
  td: { padding: '16px', color: 'var(--text-primary)', fontSize: '0.875rem' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize' },
  statusBadge: (status) => ({
    background: status === 'paid' ? 'rgba(34, 197, 94, 0.1)' : status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: status === 'paid' ? '#4ade80' : status === 'pending' ? '#fbbf24' : '#f87171'
  })
};
