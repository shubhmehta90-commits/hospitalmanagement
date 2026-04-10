import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for saved tokens and fetch profile
  useEffect(() => {
    const initAuth = async () => {
      const tokens = localStorage.getItem('hms_tokens');
      if (tokens) {
        try {
          const res = await API.get('users/profile/');
          setUser(res.data.data);
        } catch {
          localStorage.removeItem('hms_tokens');
          localStorage.removeItem('hms_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await API.post('users/login/', { username, password });
    const { user: userData, tokens } = res.data.data;
    localStorage.setItem('hms_tokens', JSON.stringify(tokens));
    localStorage.setItem('hms_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const res = await API.post('users/register/', data);
    const { user: userData, tokens } = res.data.data;
    localStorage.setItem('hms_tokens', JSON.stringify(tokens));
    localStorage.setItem('hms_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hms_tokens');
    localStorage.removeItem('hms_user');
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
