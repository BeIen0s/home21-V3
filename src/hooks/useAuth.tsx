import { useState, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/router';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'RESIDENT' | 'ENCADRANT';
  avatar?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // This is a mock login function
      // In a real app, this would make an API call
      const mockUsers: Record<string, { password: string; user: User }> = {
        'superadmin@pass21.fr': {
          password: 'super123',
          user: {
            id: '1',
            name: 'Super Administrateur',
            email: 'superadmin@pass21.fr',
            role: 'SUPER_ADMIN',
            permissions: ['all']
          }
        },
        'admin@pass21.fr': {
          password: 'admin123',
          user: {
            id: '2',
            name: 'Administrateur',
            email: 'admin@pass21.fr',
            role: 'ADMIN',
            permissions: ['users', 'residents', 'houses', 'services', 'tasks', 'settings']
          }
        },
        'encadrant@pass21.fr': {
          password: 'encadrant123',
          user: {
            id: '4',
            name: 'Encadrant',
            email: 'encadrant@pass21.fr',
            role: 'ENCADRANT',
            permissions: ['residents', 'tasks', 'services']
          }
        },
        'resident@pass21.fr': {
          password: 'resident123',
          user: {
            id: '5',
            name: 'Marie Dupont',
            email: 'resident@pass21.fr',
            role: 'RESIDENT',
            permissions: ['profile', 'services']
          }
        }
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      const userAccount = mockUsers[email];
      if (userAccount && userAccount.password === password) {
        setUser(userAccount.user);
        localStorage.setItem('user', JSON.stringify(userAccount.user));
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};