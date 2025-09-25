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
  const [loading, setLoading] = useState(false); // Démarrage sans loading pour éviter les blocages

  useEffect(() => {
    console.log('🔍 AuthProvider: Démarrage sans blocage');
    
    // Vérification rapide et non-bloquante
    const checkUser = async () => {
      try {
        const currentUser = await auth.getUser();
        setUser(currentUser);
        console.log('📄 User loaded:', currentUser ? 'Connected' : 'Not connected');
      } catch (error) {
        console.log('⚠️ Auth check failed, continuing anyway:', error);
        setUser(null);
      }
    };

    // Exécution rapide
    checkUser();

    // Auth listeners pour les changements d'état
    try {
      const { data: { subscription } } = auth.onAuthChange(async (event, session) => {
        console.log('🔄 Auth event:', event);
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
    } catch (error) {
      console.log('⚠️ Auth listener setup failed, continuing anyway:', error);
    }
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

// Protected route wrapper - COMPLÈTEMENT DÉSACTIVÉ
export function ProtectedRoute({ children }: { children: ReactNode }) {
  // DÉSACTIVATION TOTALE - Aucune vérification d'authentification
  console.log('🔓 ProtectedRoute: AUTH PROTECTION DISABLED - Direct access granted');
  
  // Retourner directement le contenu sans aucune vérification
  return <>{children}</>;
  
  /* Version originale (désactivée) :
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (!user && !loading) {
    return null;
  }

  return <>{children}</>;
  */
}
