import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are not configured. Auth functionality will be limited.');
}

// Create supabase client with fallback values for development
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-key';

export const supabase = createClient(
  supabaseUrl || fallbackUrl,
  supabaseKey || fallbackKey
);

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'RESIDENT' | 'ENCADRANT';
}

// Helper function to check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseKey && 
    supabaseUrl !== fallbackUrl && 
    supabaseKey !== fallbackKey);
}

// Simple auth functions
export const auth = {
  // Sign in
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, clearing local auth state only');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error.message);
      // Don't throw on sign out errors, just log them
    }
  },

  // Get current user
  async getUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning null user');
      return null;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Get user error:', error.message);
        return null;
      }
      
      if (!user) return null;

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Get profile error:', profileError.message);
        // Return a basic user object if profile doesn't exist
        return {
          id: user.id,
          email: user.email!,
          name: user.email!.split('@')[0],
          role: 'RESIDENT' as const,
        };
      }

      if (!profile) {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          email: user.email!,
          name: user.email!.split('@')[0],
          role: 'RESIDENT' as const,
        };

        const { data: createdProfile } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single();

        return createdProfile || newProfile;
      }

      return profile;
    } catch (error: any) {
      console.error('Unexpected error in getUser:', error.message);
      return null;
    }
  },

  // Get session
  async getSession() {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning null session');
      return null;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Get session error:', error.message);
        return null;
      }
      return session;
    } catch (error: any) {
      console.error('Unexpected error in getSession:', error.message);
      return null;
    }
  },

  // Listen to auth changes
  onAuthChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, auth changes will not be monitored');
      // Return a mock subscription object
      return {
        data: {
          subscription: {
            unsubscribe: () => console.log('Mock unsubscribe called')
          }
        }
      };
    }

    try {
      return supabase.auth.onAuthStateChange(callback);
    } catch (error: any) {
      console.error('Auth state change error:', error.message);
      return {
        data: {
          subscription: {
            unsubscribe: () => console.log('Error state unsubscribe called')
          }
        }
      };
    }
  }
};
