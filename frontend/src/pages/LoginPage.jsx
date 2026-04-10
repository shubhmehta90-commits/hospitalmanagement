import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = 'Username is required';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 4) errs.password = 'Password is too short';
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
      await login(formData.username, formData.password);
      showToast('Login successful!', 'success');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      const msg =
        err.response?.data?.errors?.non_field_errors?.[0] ||
        err.response?.data?.message ||
        'Login failed. Please try again.';
      showToast(msg);
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
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
              />
              {errors.username && (
                <span className="form-error">⚠ {errors.username}</span>
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

          {/* Footer */}
          <div style={styles.footer}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Don't have an account?{' '}
              <a href="#" style={{ color: 'var(--primary-400)', fontWeight: 500 }}>
                Contact Admin
              </a>
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
};
