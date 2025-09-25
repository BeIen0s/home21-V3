import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { auth, User } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Commencer sans loading

  useEffect(() => {
    // Check initial session rapidement
    const checkUser = async () => {
      try {
        const currentUser = await auth.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      }
    };

    // Exécution immédiate sans loading
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const currentUser = await auth.getUser();
        setUser(currentUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await auth.signIn(email, password);
    // User will be updated via auth state change
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  const logout = signOut; // Alias for compatibility

  return (
    <AuthContext.Provider value={{ user, loading, isLoading: loading, signIn, signOut, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route wrapper - Version simplifiée
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Montrer le contenu immédiatement, même pendant le loading
  // Cela évite l'écran de "vérification de l'authentification"
  if (!user && !loading) {
    return null; // Will redirect to login
  }

  // Toujours montrer le contenu, même pendant le loading
  return <>{children}</>;
}
