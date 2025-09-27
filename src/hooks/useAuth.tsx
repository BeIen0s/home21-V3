import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { auth, User } from '@/lib/auth';

// Le type User est maintenant importé depuis apiService

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Les données utilisateurs sont maintenant gérées par le service API

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'pass21_auth_user';
const TOKEN_STORAGE_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Chargement initial - vérifier si l'utilisateur est connecté
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (typeof window !== 'undefined') {
          // D'abord essayer de récupérer l'utilisateur via Supabase
          const currentUser = await auth.getUser();
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
            console.log('✅ User loaded from Supabase:', currentUser.name);
          } else {
            // Fallback sur localStorage pour la persistance
            const savedUser = localStorage.getItem(STORAGE_KEY);
            if (savedUser) {
              try {
                const userData = JSON.parse(savedUser);
                // Vérifier que l'utilisateur est toujours valide avec Supabase
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                  setUser(userData);
                  console.log('✅ User loaded from localStorage:', userData.name);
                } else {
                  // Session expirée, nettoyer
                  localStorage.removeItem(STORAGE_KEY);
                  localStorage.removeItem(TOKEN_STORAGE_KEY);
                  console.log('🔄 Session expired, cleared storage');
                }
              } catch (parseError) {
                console.warn('⚠️ Invalid saved user data, clearing:', parseError);
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(TOKEN_STORAGE_KEY);
              }
            } else {
              console.log('📝 No user found');
            }
          }
        }
      } catch (error) {
        console.error('❌ Error loading user:', error);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('📋 SignIn attempt for:', email);
    
    try {
      // Utiliser la méthode auth directe de Supabase
      const authResult = await auth.signIn(email, password);
      
      if (authResult.user) {
        // Récupérer le profil utilisateur complet
        const userProfile = await auth.getUser();
        
        if (userProfile) {
          // Sauvegarder les données utilisateur
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
          
          // Sauvegarder le token de session si disponible
          if (authResult.session?.access_token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, authResult.session.access_token);
          }
          
          setUser(userProfile);
          console.log('✅ SignIn successful:', userProfile.name);
        } else {
          throw new Error('Profil utilisateur non trouvé');
        }
      } else {
        throw new Error('Authentification échouée');
      }
    } catch (error) {
      console.error('❌ SignIn failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('📤 SignOut initiated');
    
    try {
      // Appeler Supabase pour la déconnexion
      await auth.signOut();
    } catch (error) {
      console.warn('⚠️ Logout API error:', error);
    } finally {
      // Nettoyer le stockage local dans tous les cas
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
      console.log('✅ SignOut complete');
    }
  };

  const logout = signOut;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isLoading: loading, 
      signIn, 
      signOut, 
      logout,
      isAuthenticated: !!user 
    }}>
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

// Protected route wrapper - Version simple
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log('🔒 ProtectedRoute: Redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);

  // Affichage pendant le loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Pas d'utilisateur connecté
  if (!user) {
    return null; // La redirection est gérée par useEffect
  }

  return <>{children}</>;
}
