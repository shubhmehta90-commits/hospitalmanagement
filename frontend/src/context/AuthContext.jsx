import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const ROLES = {
  ADMIN:   'admin',
  DOCTOR:  'doctor',
  PATIENT: 'patient',
};

export const ROLE_PERMISSIONS = {
  admin:   ['dashboard', 'patients', 'doctors', 'appointments'],
  doctor:  ['dashboard', 'patients', 'appointments'],
  patient: ['dashboard', 'appointments'],
};

export const ROLE_META = {
  admin:   { label: 'Administrator', colour: 'bg-violet-900 text-violet-100' },
  doctor:  { label: 'Doctor',        colour: 'bg-blue-900 text-blue-100'    },
  patient: { label: 'Patient',       colour: 'bg-emerald-900 text-emerald-100' },
};

export function hasPermission(role, tabId) {
  return ROLE_PERMISSIONS[role]?.includes(tabId) ?? false;
}

export function getDefaultTab(role) {
  return ROLE_PERMISSIONS[role]?.[0] ?? 'dashboard';
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch full profile info once a user is authenticated
  const fetchProfile = async (userId) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return profile;
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setCurrentUser({ ...session.user, ...profile });
      }
      setLoading(false);
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(session.user.id);
        setCurrentUser({ ...session.user, ...profile });
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError(error.message);
      return false;
    }
    const profile = await fetchProfile(data.user.id);
    setCurrentUser({ ...data.user, ...profile });
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setAuthError(null);
  }, []);

  const signup = useCallback(async (formData) => {
    setAuthError(null);
    
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    
    if (authError) {
      setAuthError(authError.message);
      return { success: false };
    }

    const userId = authData.user.id;

    // 2. Insert into profiles
    const { error: profileError } = await supabase.from('profiles').insert([
      { 
        id: userId, 
        role: formData.role, 
        full_name: formData.fullName, 
        email: formData.email 
      }
    ]);

    if (profileError) {
      console.error("Profile Error:", profileError);
      setAuthError(profileError.message);
      return { success: false };
    }

    // 3. Insert into role-specific table
    if (formData.role === ROLES.PATIENT) {
      const { error: patientError } = await supabase.from('patients').insert([
        { id: userId, age: formData.age, gender: formData.gender }
      ]);
      if (patientError) console.error("Patient Error:", patientError);
    } else if (formData.role === ROLES.DOCTOR) {
      const { error: doctorError } = await supabase.from('doctors').insert([
        { id: userId, specialization: formData.specialization, experience: formData.experience }
      ]);
      if (doctorError) console.error("Doctor Error:", doctorError);
    }

    return { success: true, user: { id: userId, email: formData.email } };
  }, []);

  const value = {
    currentUser,
    loading,
    authError,
    setAuthError,
    login,
    logout,
    signup,
    hasPermission: (tabId) => hasPermission(currentUser?.role, tabId),
    isRole: (...roles) => roles.includes(currentUser?.role),
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
