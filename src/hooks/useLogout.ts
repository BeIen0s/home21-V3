import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/auth';

/**
 * Hook robuste pour la déconnexion en production
 */
export const useLogout = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const logout = useCallback(async () => {
    try {
      console.log('Starting logout process...');
      
      // 1. Tentative de déconnexion Supabase
      await signOut();
      
      // 2. Nettoyage forcé du stockage local
      if (typeof window !== 'undefined') {
        try {
          // Nettoyer tous les tokens Supabase possibles
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
              localStorage.removeItem(key);
            }
          });
          
          // Nettoyer le session storage
          sessionStorage.clear();
          
          console.log('Local storage cleared');
        } catch (storageError) {
          console.warn('Error clearing storage:', storageError);
        }
      }

      // 3. Forcer la redirection
      console.log('Redirecting to login...');
      
      // Utiliser window.location pour forcer un rechargement complet
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        // Fallback pour le côté serveur
        router.push('/login');
      }

    } catch (error) {
      console.error('Logout error:', error);
      
      // En cas d'erreur, forcer quand même la redirection
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }
  }, [signOut, router]);

  return logout;
};