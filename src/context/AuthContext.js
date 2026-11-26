import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

/**
 * Manages the student's authentication session across the app.
 * Currently uses local prototype auth so we can test the full UI flow;
 * in Phase 3/4 we will swap these handlers with Firebase Auth + Google Sign-In.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signInWithEmail = async ({ email }) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 450));
      const cleanName = email.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName =
        cleanName.charAt(0).toUpperCase() + cleanName.slice(1) || 'Student';

      setUser({
        id: 'local-student-01',
        name: formattedName,
        email: email.trim().toLowerCase(),
        universityId: 'STU-2026-042',
        provider: 'email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async ({ name, email, universityId }) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 450));
      setUser({
        id: 'local-student-01',
        name: name.trim(),
        email: email.trim().toLowerCase(),
        universityId: universityId.trim() || 'STU-2026-042',
        provider: 'email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 450));
      setUser({
        id: 'google-student-01',
        name: 'Gaurav Raj',
        email: 'student@mindcare.edu',
        universityId: 'STU-2026-001',
        provider: 'google',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
