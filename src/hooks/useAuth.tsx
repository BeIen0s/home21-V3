import { useState, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/router';
import { AuthService, type AuthUser } from '@/services/auth.service';
import type { Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'RESIDENT' | 'ENCADRANT';
  avatar?: string;
  permissions?: string[];
  phone?: string;
  address?: string;
  birth_date?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check auth state and set up listener
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      console.log('🔄 Starting auth initialization...');
      
      // Safety timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn('⏰ Auth initialization timeout, setting loading to false');
          setIsLoading(false);
        }
      }, 30000); // 30 seconds timeout

      try {
        console.log('📡 Getting initial session...');
        // Get initial session
        const initialSession = await AuthService.getCurrentSession();
        console.log('📡 Initial session:', initialSession ? 'Found' : 'Not found');
        if (mounted) {
          setSession(initialSession);
          
          if (initialSession?.user) {
            // Get user profile from database
            const userProfile = await AuthService.getUserProfile(initialSession.user.id);
            
            if (mounted) {
              if (userProfile) {
                setUser({
                  id: userProfile.id,
                  name: userProfile.name,
                  email: userProfile.email,
                  role: userProfile.role,
                  avatar: userProfile.avatar || undefined,
                  permissions: userProfile.permissions,
                  phone: userProfile.phone || undefined,
                  address: userProfile.address || undefined,
                  birth_date: userProfile.birth_date || undefined,
                  bio: userProfile.bio || undefined,
                  created_at: userProfile.created_at,
                  updated_at: userProfile.updated_at,
                });
              } else {
                // User profile not found in database, clear session
                console.warn('User profile not found in database, signing out');
                setSession(null);
                setUser(null);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      setSession(session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const userProfile = await AuthService.getUserProfile(session.user.id);
          
          if (mounted) {
            if (userProfile) {
              setUser({
                id: userProfile.id,
                name: userProfile.name,
                email: userProfile.email,
                role: userProfile.role,
                avatar: userProfile.avatar || undefined,
                permissions: userProfile.permissions,
                phone: userProfile.phone || undefined,
                address: userProfile.address || undefined,
                birth_date: userProfile.birth_date || undefined,
                bio: userProfile.bio || undefined,
                created_at: userProfile.created_at,
                updated_at: userProfile.updated_at,
              });
            } else {
              console.warn('User profile not found after sign in, user may need to be added to users table');
              // Don't sign out immediately, let the user continue to login page
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          if (mounted) {
            setUser(null);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { session } = await AuthService.signIn(email, password);
      
      if (session?.user) {
        // User profile will be loaded by the auth state change listener
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setSession(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setUser(null);
      setSession(null);
      router.push('/login');
    }
  };

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        return false;
      }

      // Convert User interface fields to database fields
      const dbUpdates: any = {};
      if (profileData.name) dbUpdates.name = profileData.name;
      if (profileData.phone) dbUpdates.phone = profileData.phone;
      if (profileData.address) dbUpdates.address = profileData.address;
      if (profileData.birth_date) dbUpdates.birth_date = profileData.birth_date;
      if (profileData.bio) dbUpdates.bio = profileData.bio;
      if (profileData.avatar) dbUpdates.avatar = profileData.avatar;
      
      const updatedProfile = await AuthService.updateUserProfile(user.id, dbUpdates);
      
      const updatedUser: User = {
        id: updatedProfile.id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role,
        avatar: updatedProfile.avatar || undefined,
        permissions: updatedProfile.permissions,
        phone: updatedProfile.phone || undefined,
        address: updatedProfile.address || undefined,
        birth_date: updatedProfile.birth_date || undefined,
        bio: updatedProfile.bio || undefined,
        created_at: updatedProfile.created_at,
        updated_at: updatedProfile.updated_at,
      };
      
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await AuthService.resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!session,
    updateProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a fallback context for when AuthProvider is not available
const createFallbackAuthContext = () => ({
  user: null,
  session: null,
  isLoading: false,
  login: async () => false,
  logout: async () => {},
  isAuthenticated: false,
  updateProfile: async () => false,
  resetPassword: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // If we have a context, use it normally
  if (context !== undefined) {
    return context;
  }
  
  // No context available - this means we're either:
  // 1. On server-side during SSG/SSR
  // 2. On a public route without AuthProvider
  // 3. On a protected route that's misconfigured
  
  const isServerSide = typeof window === 'undefined';
  
  if (isServerSide) {
    // Always return fallback during SSR/SSG
    console.log('🔄 useAuth: Using fallback context for SSR/SSG');
    return createFallbackAuthContext();
  }
  
  // Client-side: check if we're on a known public route
  const currentPath = window.location.pathname;
  const publicRoutes = [
    '/',
    '/login',
    '/login-old', 
    '/direct-login',
    '/logout',
    '/unauthorized',
    '/auth/reset-password'
  ];
  
  // Normalize path by removing trailing slash (except for root)
  const normalizedPath = currentPath === '/' ? '/' : currentPath.replace(/\/$/, '');
  const isPublicRoute = publicRoutes.includes(normalizedPath);
  
  if (isPublicRoute) {
    // Silently return fallback context for public routes
    return createFallbackAuthContext();
  }
  
  // Not a public route and no AuthProvider - return fallback to prevent crash
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ useAuth: No AuthProvider found for route '${normalizedPath}' - using fallback`);
  }
  return createFallbackAuthContext();
  
  // Uncomment this line if you want strict error throwing:
  // throw new Error('useAuth must be used within an AuthProvider');
};
