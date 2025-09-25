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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      try {
        const currentUser = await auth.getUser();
        setUser(currentUser);
      } catch (error: any) {
        console.error('Error checking user:', error?.message || error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes with error handling
    try {
      const { data: { subscription } } = auth.onAuthChange(async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session) {
            const currentUser = await auth.getUser();
            setUser(currentUser);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          } else if (event === 'TOKEN_REFRESHED') {
            // Handle token refresh
            console.log('Token refreshed');
          }
        } catch (error: any) {
          console.error('Auth state change error:', error?.message || error);
          // On auth errors, clear the user state
          setUser(null);
        }
      });

      return () => {
        if (subscription && typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe();
        }
      };
    } catch (error: any) {
      console.error('Failed to set up auth listener:', error?.message || error);
      return () => {}; // Return empty cleanup function
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await auth.signIn(email, password);
      // User will be updated via auth state change
    } catch (error: any) {
      console.error('Sign in failed:', error?.message || error);
      throw error; // Re-throw so the UI can handle the error
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error: any) {
      console.error('Sign out error:', error?.message || error);
      // Even if sign out fails, clear the local state
    } finally {
      setUser(null);
    }
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

// Protected route wrapper
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}