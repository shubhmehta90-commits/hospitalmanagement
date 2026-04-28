import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
      const success = await login(formData.email, formData.password);
      if (success) {
        showToast('Login successful!', 'success');
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        showToast('Invalid email or password.');
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Animated background */}
      <div className="animated-bg" />

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      {/* Login Card */}
      <div style={styles.container} className="fade-in">
        <div className="glass-card" style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.logoWrap}>
              <div style={styles.logo}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h1 style={styles.title}>MedPortal</h1>
                <p style={styles.subtitle}>Hospital Management System</p>
              </div>
            </div>
            <p style={styles.description}>
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
              />
              {errors.email && (
                <span className="form-error">⚠ {errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="form-error">⚠ {errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: 8, height: 48 }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <div style={styles.emergencyContainer}>
              <div style={styles.emergencyHeading}>Emergency Assistance</div>
              <div style={styles.emergencyItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--error-400)' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 18.92z"/>
                </svg>
                <span style={styles.emergencyText}>+1 (800) MED-HELP</span>
              </div>
              <div style={styles.emergencyItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-400)' }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span style={styles.emergencyText}>emergency@medportal.com</span>
              </div>
            </div>

            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: 16, display: 'block' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary-400)', fontWeight: 500 }}>
                Register as Member
              </Link>
            </span>
          </div>
        </div>

        {/* Bottom branding */}
        <p style={styles.branding}>
          © 2026 MedPortal — Hospital Management System
        </p>
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
    padding: '24px',
  },
  container: {
    width: '100%',
    maxWidth: 420,
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  card: {
    width: '100%',
    padding: '40px 36px 32px',
  },
  header: {
    marginBottom: 32,
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
  title: {
    fontSize: '1.375rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '0.9375rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    paddingTop: 20,
    borderTop: '1px solid var(--border-subtle)',
  },
  branding: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  emergencyContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
    marginBottom: 16,
  },
  emergencyHeading: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'left',
    marginBottom: 4,
  },
  emergencyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  emergencyText: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
};
