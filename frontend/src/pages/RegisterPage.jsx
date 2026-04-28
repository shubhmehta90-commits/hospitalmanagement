import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signup, authError } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    password_confirm: '',
    role: ROLES.PATIENT,
    // Patient specific
    age: '',
    gender: '',
    // Doctor specific
    specialization: '',
    experience: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!formData.password) errs.password = 'Password is required';
    if (formData.password !== formData.password_confirm) {
      errs.password_confirm = 'Passwords do not match';
    }
    if (formData.role === ROLES.PATIENT) {
      if (!formData.age) errs.age = 'Age is required';
      if (!formData.gender) errs.gender = 'Gender is required';
    } else if (formData.role === ROLES.DOCTOR) {
      if (!formData.specialization) errs.specialization = 'Specialization is required';
      if (!formData.experience) errs.experience = 'Experience is required';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const { success } = await signup(formData);
      if (success) {
        showToast('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        showToast(authError || 'Registration failed. Please try again.');
      }
    } catch (err) {
      showToast(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div className="animated-bg" />
      
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      <div style={styles.container} className="fade-in">
        <div className="glass-card" style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logoWrap}>
              <div style={styles.logo}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </div>
              <div>
                <h1 style={styles.title}>System Registration</h1>
                <p style={styles.subtitle}>MedPortal HMS</p>
              </div>
            </div>
            <p style={styles.description}>
              Fill in your details to create your profile
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                    name="fullName"
                    type="text"
                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                />
            </div>

            <div style={styles.grid}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">User Role</label>
                <select
                  name="role"
                  className="form-input"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value={ROLES.PATIENT}>Patient</option>
                  <option value={ROLES.DOCTOR}>Doctor</option>
                </select>
              </div>
            </div>

            <div style={styles.grid}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  name="password_confirm"
                  type="password"
                  className={`form-input ${errors.password_confirm ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={formData.password_confirm}
                  onChange={handleChange}
                />
              </div>
            </div>

            {formData.role === ROLES.PATIENT && (
              <div style={styles.grid}>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    name="age"
                    type="number"
                    className={`form-input ${errors.age ? 'error' : ''}`}
                    placeholder="25"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    className={`form-input ${errors.gender ? 'error' : ''}`}
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {formData.role === ROLES.DOCTOR && (
              <div style={styles.grid}>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input
                    name="specialization"
                    type="text"
                    className={`form-input ${errors.specialization ? 'error' : ''}`}
                    placeholder="Cardiology"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    name="experience"
                    type="number"
                    className={`form-input ${errors.experience ? 'error' : ''}`}
                    placeholder="10"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: 8, height: 48 }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Creating Account…
                </>
              ) : (
                'Create Profile'
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary-400)', fontWeight: 500 }}>
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '40px 24px',
    backgroundColor: 'var(--bg-dark)',
  },
  container: {
    width: '100%',
    maxWidth: 580,
    position: 'relative',
    zIndex: 1,
  },
  card: {
    width: '100%',
    padding: '40px',
  },
  header: {
    marginBottom: 32,
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    paddingTop: 20,
    borderTop: '1px solid var(--border-subtle)',
  },
};
