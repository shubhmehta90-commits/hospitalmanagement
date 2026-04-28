import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabaseClient';

export default function PatientsPage() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const isDoctor = currentUser?.role === 'doctor';

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*, profile:profiles(full_name, email)');
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Patient Directory</h1>
            <p style={styles.subtitle}>View and manage patient profiles.</p>
          </div>
          <div style={styles.headerActions}>
            <input 
              style={styles.search}
              type="text" 
              placeholder="Search patients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div style={styles.loading}>Loading patient data...</div>
        ) : (
          <div className="glass-card" style={styles.card}>
            {filteredPatients.length === 0 ? (
              <div style={styles.emptyContainer}>
                <p style={styles.emptyText}>No patients found matching your search.</p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Age</th>
                    <th style={styles.th}>Gender</th>
                    <th style={styles.th}>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(p => (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.patientName}>
                          <div style={styles.avatar}>{(p.profile?.full_name?.[0] || 'P').toUpperCase()}</div>
                          {p.profile?.full_name}
                        </div>
                      </td>
                      <td style={styles.td}>{p.profile?.email}</td>
                      <td style={styles.td}>{p.age}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.genderBadge(p.gender) }}>{p.gender}</span>
                      </td>
                      <td style={styles.td}>{new Date(p.created_at).toLocaleDateString()}</td>
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
  search: { padding: '10px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', width: 250 },
  card: { padding: 24, overflowX: 'auto' },
  loading: { color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 },
  emptyContainer: { textAlign: 'center', padding: '40px 20px' },
  emptyText: { color: 'var(--text-muted)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' },
  tr: { borderBottom: '1px solid var(--border-subtle)' },
  td: { padding: '16px', color: 'var(--text-primary)', fontSize: '0.875rem' },
  patientName: { display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 },
  avatar: { width: 32, height: 32, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize' },
  genderBadge: (gender) => ({
    background: gender === 'male' ? 'rgba(59, 130, 246, 0.1)' : gender === 'female' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(156, 163, 175, 0.1)',
    color: gender === 'male' ? '#60a5fa' : gender === 'female' ? '#f472b6' : '#9ca3af'
  })
};
