/**
 * Service pour la gestion des utilisateurs étendus avec Supabase
 * Compatible avec la page de gestion des utilisateurs
 */

import { supabase } from '@/lib/supabase';
import { ExtendedUser, UserRole, AccessLevel, Role, Permission } from '@/types';
import type { Database } from '@/lib/supabase';

type SupabaseUser = Database['public']['Tables']['users']['Row'];

/**
 * Convertit un utilisateur Supabase en ExtendedUser
 */
const convertToExtendedUser = (supaUser: SupabaseUser): ExtendedUser => ({
  id: supaUser.id,
  email: supaUser.email,
  // Extraire firstName et lastName depuis le nom complet
  firstName: supaUser.name.split(' ')[0] || '',
  lastName: supaUser.name.split(' ').slice(1).join(' ') || '',
  role: supaUser.role as UserRole,
  avatar: supaUser.avatar,
  phone: supaUser.phone,
  createdAt: new Date(supaUser.created_at),
  updatedAt: new Date(supaUser.updated_at),
  bio: supaUser.bio ?? null,
  
  // Propriétés ExtendedUser (avec valeurs par défaut)
  roles: [], // TODO: Implémenter la récupération des rôles
  permissions: [], // TODO: Implémenter la récupération des permissions
  accessLevel: AccessLevel.BASIC,
  canAccessAfterHours: false,
  twoFactorEnabled: false,
  failedLoginAttempts: 0,
  isActive: true, // Par défaut actif
});

/**
 * Convertit un ExtendedUser en format Supabase pour insertion/mise à jour
 */
const convertFromExtendedUser = (user: Partial<ExtendedUser>) => ({
  ...(user.firstName && user.lastName && { name: `${user.firstName} ${user.lastName}` }),
  ...(user.email && { email: user.email }),
  ...(user.role && { role: user.role }),
  ...(user.avatar && { avatar: user.avatar }),
  ...(user.phone && { phone: user.phone }),
  ...(user.bio && { bio: user.bio }),
  updated_at: new Date().toISOString(),
});

export const ExtendedUserService = {
  /**
   * Récupérer tous les utilisateurs
   */
  async getAll(): Promise<ExtendedUser[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
      }

      return (data || []).map(convertToExtendedUser);
    } catch (error) {
      console.error('ExtendedUserService.getAll error:', error);
      throw error;
    }
  },

  /**
   * Récupérer un utilisateur par ID
   */
  async getById(id: string): Promise<ExtendedUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return convertToExtendedUser(data);
    } catch (error) {
      console.error('ExtendedUserService.getById error:', error);
      return null;
    }
  },

  /**
   * Créer un nouvel utilisateur
   */
  async create(userData: Partial<ExtendedUser>): Promise<ExtendedUser> {
    try {
      const supabaseData = convertFromExtendedUser(userData);
      
      const { data, error } = await supabase
        .from('users')
        .insert([supabaseData])
        .select()
        .single();

      if (error || !data) {
        throw new Error(`Erreur lors de la création de l'utilisateur: ${error?.message}`);
      }

      return convertToExtendedUser(data);
    } catch (error) {
      console.error('ExtendedUserService.create error:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un utilisateur
   */
  async update(id: string, userData: Partial<ExtendedUser>): Promise<ExtendedUser> {
    try {
      const supabaseData = convertFromExtendedUser(userData);
      
      const { data, error } = await supabase
        .from('users')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error?.message}`);
      }

      return convertToExtendedUser(data);
    } catch (error) {
      console.error('ExtendedUserService.update error:', error);
      throw error;
    }
  },

  /**
   * Supprimer un utilisateur
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
      }
    } catch (error) {
      console.error('ExtendedUserService.delete error:', error);
      throw error;
    }
  },

  /**
   * Activer/Désactiver un utilisateur (basé sur un champ personnalisé si nécessaire)
   */
  async toggleActive(id: string, isActive: boolean): Promise<ExtendedUser> {
    try {
      // Pour l'instant, nous utilisons la mise à jour standard
      // Plus tard, on peut ajouter un champ 'is_active' dans la table users
      const { data, error } = await supabase
        .from('users')
        .update({ 
          updated_at: new Date().toISOString(),
          // TODO: Ajouter is_active: isActive quand le champ sera créé
        })
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        throw new Error(`Erreur lors du changement de statut: ${error?.message}`);
      }

      const extendedUser = convertToExtendedUser(data);
      extendedUser.isActive = isActive; // Simulation pour l'instant
      
      return extendedUser;
    } catch (error) {
      console.error('ExtendedUserService.toggleActive error:', error);
      throw error;
    }
  },

  /**
   * Tester la connexion à la base de données
   */
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('ExtendedUserService.testConnection error:', error);
      return false;
    }
  }
};

export default ExtendedUserService;