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
    console.log('🔄 Tentative de connexion pour:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erreur de connexion Supabase:', error);
      throw new Error(error.message);
    }

    console.log('✅ Connexion Supabase réussie:', {
      user: data.user?.email,
      userId: data.user?.id
    });
    
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
    try {
      console.log('🔍 Fetching user profile for ID:', userId);
      
      const startTime = Date.now();
      
      // Test simple query first
      console.log('🔍 Testing simple query...');
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      console.log('🔍 Test query result:', { testData, testError });
      
      // Main query
      console.log('🔍 Running main query...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Query completed in ${duration}ms`);
      console.log('📄 Query result - data:', data, 'error:', error);

      if (error) {
        console.error('Supabase error fetching user profile:', error);
        
        // Handle various error codes
        if (error.code === 'PGRST116' || error.code === 'PGRST301') {
          // User not found in database
          console.log('User not found in users table, creating profile...');
          return null;
        }
        
        // For 406 errors or RLS policy violations, return null instead of throwing
        if (error.code === 'PGRST401' || error.message.includes('policy')) {
          console.warn('RLS policy violation, user may need to be added to users table');
          return null;
        }
        
        throw new Error(`Failed to fetch user profile: ${error.message}`);
      }

      if (!data) {
        console.log('No user profile found for ID:', userId);
        return null;
      }

      console.log('User profile found:', data);
      
      // Add permissions based on role
      const permissions = this.getPermissionsByRole(data.role);

      return {
        ...data,
        permissions,
      };
    } catch (err) {
      console.error('Error in getUserProfile:', err);
      return null; // Return null instead of throwing to prevent app crash
    }
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
    // Use production URL or current origin
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      : window.location.origin;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/reset-password`,
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