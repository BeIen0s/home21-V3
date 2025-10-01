/**
 * Service pour les opérations administrateur via les API routes sécurisées
 */

import { supabase } from '@/lib/supabase';
import { ExtendedUser, UserRole, AccessLevel } from '@/types';

// Helper pour obtenir le token d'authentification
const getAuthToken = async (): Promise<string> => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.access_token) {
    throw new Error('Token d\'authentification non disponible');
  }
  
  return session.access_token;
};

// Helper pour les requêtes API avec authentification
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (parseError) {
      console.warn('Failed to parse error response:', parseError);
      errorMessage = `HTTP Error: ${response.status} - ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const AdminUserService = {
  /**
   * Créer un utilisateur complet (auth + profil) via l'API admin
   */
  async create(userData: {
    email: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    password?: string;
    phone?: string;
    avatar?: string;
  }): Promise<{ user: ExtendedUser; tempPassword?: string }> {
    try {
      const response = await apiRequest('/api/admin/users/create', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      return response;
    } catch (error) {
      console.error('AdminUserService.create error:', error);
      throw error;
    }
  },

  /**
   * Supprimer un utilisateur complet (auth + profil) via l'API admin
   */
  async delete(userId: string): Promise<{ message: string }> {
    try {
      const response = await apiRequest(`/api/admin/users/delete?userId=${userId}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      console.error('AdminUserService.delete error:', error);
      throw error;
    }
  },

  /**
   * Synchroniser les utilisateurs orphelins via l'API admin
   */
  async syncOrphanUsers(): Promise<{
    synced: number;
    errors: string[];
    totalAuthUsers: number;
    totalPublicUsers: number;
  }> {
    try {
      const response = await apiRequest('/api/admin/users/sync', {
        method: 'POST',
      });

      return response;
    } catch (error) {
      console.error('AdminUserService.syncOrphanUsers error:', error);
      throw error;
    }
  },

  /**
   * Vérifier si l'utilisateur actuel a des permissions admin
   */
  async hasAdminPermissions(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return false;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return false;
      }

      return profile.role === 'SUPER_ADMIN' || profile.role === 'ADMIN';
    } catch (error) {
      console.error('AdminUserService.hasAdminPermissions error:', error);
      return false;
    }
  }
};

export default AdminUserService;