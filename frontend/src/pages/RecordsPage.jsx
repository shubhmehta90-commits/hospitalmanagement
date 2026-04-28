import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabaseClient';

export default function RecordsPage() {
  const { currentUser } = useAuth();
  const isDoctor = currentUser?.role === 'doctor';
  const isAdmin = currentUser?.role === 'admin';
  const isPatient = currentUser?.role === 'patient';

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // For doctor view: selecting a patient
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'diagnosis', 'prescription', 'report'
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isDoctor || isAdmin) {
      fetchPatients();
    } else {
      fetchRecords(); // Fetch for logged in patient
    }
  }, [isDoctor, isAdmin]);

  useEffect(() => {
    if ((isDoctor || isAdmin) && selectedPatient) {
      fetchRecords(selectedPatient);
    } else if ((isDoctor || isAdmin) && !selectedPatient) {
      setRecords([]);
      setLoading(false);
    }
  }, [selectedPatient, isDoctor, isAdmin]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*, profile:profiles(full_name)');
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    }
  };

  const fetchRecords = async (patientId = null) => {
    setLoading(true);
    try {
      let query = supabase
        .from('medical_records')
        .select(`
          *,
          doctor:doctors(profile:profiles(full_name))
        `);
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      } else {
        query = query.eq('patient_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Failed to fetch records', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patient_id: selectedPatient,
        doctor_id: isDoctor ? user.id : (isAdmin ? user.id : null), 
        type: modalType,
        title: formData.title,
        content: formData.content,
        metadata: formData.metadata || {}
      };

      const { error } = await supabase.from('medical_records').insert([payload]);
      if (error) throw error;

      setShowModal(false);
      fetchRecords(selectedPatient);
    } catch (error) {
      console.error(`Failed to create ${modalType}`, error);
      alert(`Error creating ${modalType}: ` + error.message);
    }
  };

  const diagnoses = records.filter(r => r.type === 'diagnosis');
  const prescriptions = records.filter(r => r.type === 'prescription');
  const reports = records.filter(r => r.type === 'report');

  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Medical Records</h1>
            <p style={styles.subtitle}>
              {(isDoctor || isAdmin) ? 'Manage and view patient histories.' : 'View your complete medical history.'}
            </p>
          </div>
          {(isDoctor || isAdmin) && selectedPatient && (
            <div style={styles.headerActions}>
              <button className="btn btn-primary" onClick={() => openModal('diagnosis')}>+ Diagnosis</button>
              <button className="btn btn-primary" onClick={() => openModal('prescription')}>+ Prescription</button>
              <button className="btn btn-primary" onClick={() => openModal('report')}>+ Report</button>
            </div>
          )}
        </header>

        {(isDoctor || isAdmin) && (
          <div className="glass-card" style={styles.patientSelector}>
            <label style={styles.label}>Select Patient to View/Edit Records:</label>
            <select
              style={styles.select}
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">-- Choose a Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.profile?.full_name}</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div style={styles.loading}>Loading records...</div>
        ) : ((isDoctor || isAdmin) && !selectedPatient) ? (
          <div style={styles.emptyState}>Please select a patient to view their records.</div>
        ) : (
          <div style={styles.contentGrid}>
            <div className="glass-card" style={styles.card}>
              <h2 style={styles.cardTitle}>Diagnoses</h2>
              {diagnoses.length === 0 ? <p style={styles.emptyText}>No diagnoses found.</p> : (
                <ul style={styles.list}>
                  {diagnoses.map(d => (
                    <li key={d.id} style={styles.listItem}>
                      <div style={styles.itemHeader}>
                        <strong>{d.title}</strong>
                        <span style={styles.badge}>{d.metadata?.status || 'Active'}</span>
                      </div>
                      <p style={styles.itemDesc}>{d.content}</p>
                      <small style={styles.itemMeta}>Diagnosed: {new Date(d.created_at).toLocaleDateString()} by Dr. {d.doctor?.profile?.full_name || 'N/A'}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="glass-card" style={styles.card}>
              <h2 style={styles.cardTitle}>Prescriptions</h2>
              {prescriptions.length === 0 ? <p style={styles.emptyText}>No prescriptions found.</p> : (
                <ul style={styles.list}>
                  {prescriptions.map(p => (
                    <li key={p.id} style={styles.listItem}>
                      <div style={styles.itemHeader}>
                        <strong>{p.title}</strong>
                      </div>
                      <p style={styles.itemDesc}>{p.content}</p>
                      <small style={styles.itemMeta}>Prescribed: {new Date(p.created_at).toLocaleDateString()} by Dr. {p.doctor?.profile?.full_name || 'N/A'}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="glass-card" style={styles.card}>
              <h2 style={styles.cardTitle}>Medical Reports</h2>
              {reports.length === 0 ? <p style={styles.emptyText}>No reports found.</p> : (
                <ul style={styles.list}>
                  {reports.map(r => (
                    <li key={r.id} style={styles.listItem}>
                      <div style={styles.itemHeader}>
                        <strong>{r.title}</strong>
                      </div>
                      <p style={styles.itemDesc}>{r.content}</p>
                      <small style={styles.itemMeta}>Generated: {new Date(r.created_at).toLocaleDateString()} by Dr. {r.doctor?.profile?.full_name || 'N/A'}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Inline Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-card fade-in" style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Add New {modalType}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input style={styles.input} type="text" name="title" placeholder={`${modalType} Title`} required onChange={handleInputChange} />
              <textarea style={styles.textarea} name="content" placeholder="Details/Notes" onChange={handleInputChange} />
              <div style={styles.modalActions}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' },
  main: { flex: 1, marginLeft: 'var(--sidebar-width)', padding: '32px 40px', overflow: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  title: { fontSize: '1.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' },
  subtitle: { fontSize: '0.9rem', color: 'var(--text-muted)' },
  headerActions: { display: 'flex', gap: 12 },
  patientSelector: { padding: 20, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 },
  label: { fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 },
  select: { padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' },
  input: { padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', width: '100%' },
  textarea: { padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', width: '100%', minHeight: 80, resize: 'vertical' },
  loading: { color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 },
  emptyState: { color: 'var(--text-muted)', textAlign: 'center', marginTop: 40, padding: 40, border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)' },
  contentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 },
  card: { padding: 24 },
  cardTitle: { fontSize: '1.125rem', fontWeight: 600, marginBottom: 16, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 },
  listItem: { padding: '12px 0' },
  itemHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: 'var(--text-primary)' },
  badge: { fontSize: '0.7rem', background: 'var(--primary-600)', color: 'white', padding: '2px 8px', borderRadius: 12, textTransform: 'uppercase' },
  itemDesc: { fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.4 },
  itemMeta: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  emptyText: { fontSize: '0.875rem', color: 'var(--text-muted)' },
  link: { fontSize: '0.875rem', color: 'var(--primary-400)', textDecoration: 'none', display: 'block', marginBottom: 8 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { width: 500, maxWidth: '90%', padding: 32 },
  modalTitle: { fontSize: '1.25rem', fontWeight: 600, marginBottom: 24, textTransform: 'capitalize' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }
};
