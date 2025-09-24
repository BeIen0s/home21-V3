import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase';

export type DbUser = Database['public']['Tables']['users']['Row'];

export interface AuthUser extends DbUser {
  permissions?: string[];
}

export class AuthService {
  // Sign in with email and password
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Sign up new user
  static async signUp(email: string, password: string, userData: {
    name: string;
    role?: 'SUPER_ADMIN' | 'ADMIN' | 'RESIDENT' | 'ENCADRANT';
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role || 'RESIDENT',
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  // Get current session
  static async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message);
    }
    return session;
  }

  // Get current user from auth
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }
    return user;
  }

  // Get user profile from database
  static async getUserProfile(userId: string): Promise<AuthUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // User not found in database, return null
        return null;
      }
      throw new Error(error.message);
    }

    // Add permissions based on role
    const permissions = this.getPermissionsByRole(data.role);

    return {
      ...data,
      permissions,
    };
  }

  // Create user profile in database (called after successful signup)
  static async createUserProfile(user: User, additionalData: {
    name: string;
    role?: 'SUPER_ADMIN' | 'ADMIN' | 'RESIDENT' | 'ENCADRANT';
    phone?: string;
    avatar?: string;
  }): Promise<AuthUser> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email!,
        name: additionalData.name,
        role: additionalData.role || 'RESIDENT',
        phone: additionalData.phone,
        avatar: additionalData.avatar,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const permissions = this.getPermissionsByRole(data.role);

    return {
      ...data,
      permissions,
    };
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<DbUser>): Promise<AuthUser> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const permissions = this.getPermissionsByRole(data.role);

    return {
      ...data,
      permissions,
    };
  }

  // Reset password
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Update password
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Helper function to get permissions based on role
  private static getPermissionsByRole(role: string): string[] {
    switch (role) {
      case 'SUPER_ADMIN':
        return ['all'];
      case 'ADMIN':
        return ['users', 'residents', 'houses', 'services', 'tasks', 'settings'];
      case 'ENCADRANT':
        return ['residents', 'tasks', 'services'];
      case 'RESIDENT':
        return ['profile', 'services'];
      default:
        return ['profile'];
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}