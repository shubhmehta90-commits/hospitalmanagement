import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === 'DOCTOR';
  const isPatient = user?.role === 'PATIENT';
  const isReceptionist = user?.role === 'RECEPTIONIST';

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Users lookup for Receptionist/Doctor mapping
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    notes: '',
    doctor: '', // doc profile ID
    patient: '' // user ID (for receptionist)
  });

  useEffect(() => {
    fetchAppointments();
    if (isPatient || isReceptionist) {
      fetchDoctors();
    }
    if (isReceptionist) {
      fetchPatients();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/api/appointments/');
      setAppointments(res.data.results || res.data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/api/appointments/doctors/');
      setDoctors(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get('/api/users/?role=PATIENT');
      setPatients(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    }
  };

  const openModal = () => {
    setFormData({ date: '', time: '', reason: '', notes: '', doctor: '', patient: '' });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (isPatient) {
        delete payload.patient; // backend sets it automatically
      }
      await api.post('/api/appointments/', payload);
      setShowModal(false);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to create appointment', error);
      alert('Error creating appointment. Are you sure double-booking is not overlapping?');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/appointments/${id}/`, { status });
      fetchAppointments();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Appointments</h1>
            <p style={styles.subtitle}>Manage your schedule and bookings.</p>
          </div>
          {(isPatient || isReceptionist) && (
            <div style={styles.headerActions}>
              <button className="btn btn-primary" onClick={openModal}>+ Book Appointment</button>
            </div>
          )}
        </header>

        {loading ? (
          <div style={styles.loading}>Loading appointments...</div>
        ) : (
          <div className="glass-card" style={styles.card}>
            {appointments.length === 0 ? (
              <p style={styles.emptyText}>No appointments found.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date & Time</th>
                    {!isPatient && <th style={styles.th}>Patient</th>}
                    {!isDoctor && <th style={styles.th}>Doctor</th>}
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id} style={styles.tr}>
                      <td style={styles.td}>{a.date} at {a.time.substring(0,5)}</td>
                      {!isPatient && <td style={styles.td}>{a.patient_name}</td>}
                      {!isDoctor && <td style={styles.td}>Dr. {a.doctor_name}</td>}
                      <td style={styles.td}>{a.reason || 'N/A'}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badgeBase, ...styles.badge(a.status) }}>{a.status}</span>
                      </td>
                      <td style={styles.td}>
                        {a.status === 'SCHEDULED' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {(isDoctor || isReceptionist) && (
                              <button onClick={() => updateStatus(a.id, 'COMPLETED')} style={styles.actionBtn}>Complete</button>
                            )}
                            <button onClick={() => updateStatus(a.id, 'CANCELLED')} style={styles.cancelBtn}>Cancel</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      {/* Book Appointment Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-card fade-in" style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Book Appointment</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              {isReceptionist && (
                <select style={styles.select} name="patient" required onChange={handleInputChange} value={formData.patient}>
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.full_name || p.username}</option>
                  ))}
                </select>
              )}
              <select style={styles.select} name="doctor" required onChange={handleInputChange} value={formData.doctor}>
                <option value="">-- Select Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>Dr. {d.doctor_name} ({d.department_name})</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: 12 }}>
                <input style={styles.input} type="date" name="date" required onChange={handleInputChange} value={formData.date} />
                <input style={styles.input} type="time" name="time" required onChange={handleInputChange} value={formData.time} />
              </div>
              <input style={styles.input} type="text" name="reason" placeholder="Reason for visit" required onChange={handleInputChange} value={formData.reason} />
              <textarea style={styles.textarea} name="notes" placeholder="Additional Notes" onChange={handleInputChange} value={formData.notes} />
              
              <div style={styles.modalActions}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Book</button>
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
  card: { padding: 24, overflowX: 'auto' },
  loading: { color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 },
  emptyText: { color: 'var(--text-muted)', textAlign: 'center', padding: 20 },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' },
  tr: { borderBottom: '1px solid var(--border-subtle)' },
  td: { padding: '16px', color: 'var(--text-primary)', fontSize: '0.875rem' },
  badgeBase: { padding: '4px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 },
  badge: (status) => ({
    background: status === 'SCHEDULED' ? 'rgba(99, 102, 241, 0.1)' : status === 'COMPLETED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: status === 'SCHEDULED' ? 'var(--primary-400)' : status === 'COMPLETED' ? '#4ade80' : '#f87171'
  }),
  actionBtn: { padding: '6px 12px', background: 'var(--primary-600)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' },
  cancelBtn: { padding: '6px 12px', background: 'transparent', color: '#f87171', border: '1px solid #f87171', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { width: 500, maxWidth: '90%', padding: 32 },
  modalTitle: { fontSize: '1.25rem', fontWeight: 600, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  input: { padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', width: '100%', boxSizing: 'border-box' },
  select: { padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', width: '100%', boxSizing: 'border-box' },
  textarea: { padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', width: '100%', minHeight: 80, resize: 'vertical', boxSizing: 'border-box' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }
};
