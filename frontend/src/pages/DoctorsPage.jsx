import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabaseClient';

export default function DoctorsPage() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*, profile:profiles(full_name, email)');
      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Medical Specialists</h1>
            <p style={styles.subtitle}>Our team of experienced healthcare professionals.</p>
          </div>
          <div style={styles.headerActions}>
            <input 
              style={styles.search}
              type="text" 
              placeholder="Search specialization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div style={styles.loading}>Loading specialist data...</div>
        ) : (
          <div style={styles.grid}>
            {filteredDoctors.length === 0 ? (
              <div style={styles.emptyContainer}>
                <p style={styles.emptyText}>No specialists found matching your search.</p>
              </div>
            ) : (
              filteredDoctors.map((doc, i) => (
                <div key={doc.id} className="glass-card fade-in" style={{ ...styles.docCard, animationDelay: `${i * 0.1}s` }}>
                  <div style={styles.cardHeader}>
                    <div style={styles.avatar}>{(doc.profile?.full_name?.[0] || 'D').toUpperCase()}</div>
                    <div>
                      <h3 style={styles.docName}>Dr. {doc.profile?.full_name}</h3>
                      <span style={styles.specialization}>{doc.specialization}</span>
                    </div>
                  </div>
                  <div style={styles.cardBody}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Experience:</span>
                      <span style={styles.infoValue}>{doc.experience} Years</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Email:</span>
                      <span style={styles.infoValue}>{doc.profile?.email}</span>
                    </div>
                  </div>
                  <div style={styles.cardFooter}>
                    <button className="btn btn-ghost" style={{ width: '100%' }}>View Profile</button>
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
  search: { padding: '10px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', width: 250 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 },
  docCard: { padding: 24, display: 'flex', flexDirection: 'column', gap: 20 },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 16 },
  avatar: { width: 50, height: 50, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700 },
  docName: { fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 },
  specialization: { fontSize: '0.75rem', color: 'var(--primary-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  cardBody: { display: 'flex', flexDirection: 'column', gap: 10 },
  infoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' },
  infoLabel: { color: 'var(--text-muted)' },
  infoValue: { color: 'var(--text-secondary)', fontWeight: 500 },
  cardFooter: { marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' },
  loading: { color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 },
  emptyContainer: { gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' },
  emptyText: { color: 'var(--text-muted)' }
};
