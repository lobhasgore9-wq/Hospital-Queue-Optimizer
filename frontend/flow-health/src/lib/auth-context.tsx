import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export type UserRole = 'patient' | 'receptionist' | 'nurse' | 'doctor' | 'admin' | 'super-admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapFirebaseUser(fbUser: FirebaseUser, role: UserRole = 'admin'): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
    email: fbUser.email || '',
    role,
    avatar: fbUser.photoURL || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const savedRole = (localStorage.getItem('userRole') as UserRole) || 'admin';
        setUser(mapFirebaseUser(fbUser, savedRole));
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole = 'admin') => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem('userRole', role);
    setUser(mapFirebaseUser(cred.user, role));
  }, []);

  const loginWithGoogle = useCallback(async (role: UserRole = 'admin') => {
    const cred = await signInWithPopup(auth, googleProvider);
    localStorage.setItem('userRole', role);
    setUser(mapFirebaseUser(cred.user, role));
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, role: UserRole = 'admin') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    localStorage.setItem('userRole', role);
    setUser(mapFirebaseUser({ ...cred.user, displayName: name }, role));
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    localStorage.removeItem('userRole');
    setUser(null);
    setFirebaseUser(null);
  }, []);

  const setRole = useCallback((role: UserRole) => {
    localStorage.setItem('userRole', role);
    if (firebaseUser) {
      setUser(mapFirebaseUser(firebaseUser, role));
    }
  }, [firebaseUser]);

  return (
    <AuthContext.Provider value={{
      user, firebaseUser, isAuthenticated: !!user, loading,
      login, loginWithGoogle, signup, logout, setRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
