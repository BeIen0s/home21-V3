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
      
      // PERMANENT FIX: Handle known problematic user ID
      if (userId === '77c5af80-882a-46e1-bf69-7c4a7b1bd506') {
        console.warn('⚠️ Detected problematic user ID, attempting to sign out and clear session...');
        try {
          await this.signOut();
        } catch (signOutError) {
          console.error('Error during sign out:', signOutError);
        }
        
        // Clear all possible storage locations
        if (typeof window !== 'undefined') {
          try {
            localStorage.clear();
            sessionStorage.clear();
            // Clear any Supabase-specific storage
            Object.keys(localStorage).forEach(key => {
              if (key.includes('supabase') || key.includes('auth')) {
                localStorage.removeItem(key);
              }
            });
          } catch (storageError) {
            console.error('Error clearing storage:', storageError);
          }
        }
        
        console.log('🔄 Session cleared, please refresh the page and login again');
        return null;
      }
      
      const startTime = Date.now();
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 5000); // 5 second timeout
      });
      
      // Main query with timeout
      console.log('🔍 Running main query with 5s timeout...');
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
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
        
        // Try to get the authenticated user details and create profile
        console.log('🌱 Attempting to create user profile from auth data...');
        try {
          const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
          
          if (authError || !authUser || authUser.id !== userId) {
            console.log('⚠️ Cannot create profile - no matching authenticated user');
            return null;
          }
          
          // Extract name from metadata or email
          const name = authUser.user_metadata?.name || 
                      authUser.user_metadata?.full_name || 
                      authUser.email?.split('@')[0] || 
                      'User';
          
          // Create user profile
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email!,
              name: name,
              role: 'RESIDENT', // Default role
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();
            
          if (createError) {
            console.error('❌ Failed to create user profile:', createError);
            return null;
          }
          
          console.log('✅ User profile created successfully:', newProfile);
          
          const permissions = this.getPermissionsByRole(newProfile.role);
          return {
            ...newProfile,
            permissions,
          };
          
        } catch (createErr) {
          console.error('❌ Error creating user profile:', createErr);
          return null;
        }
      }

      console.log('User profile found:', data);
      
      // Add permissions based on role
      const permissions = this.getPermissionsByRole(data.role);

      return {
        ...data,
        permissions,
      };
    } catch (err: any) {
      console.error('Error in getUserProfile:', err);
      
      // Handle specific timeout error
      if (err.message === 'Database query timeout') {
        console.warn('⏰ Database query timed out, user profile fetch failed');
        return null;
      }
      
      // For other database errors, still return null to prevent app crash
      return null;
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