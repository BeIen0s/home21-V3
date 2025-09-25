import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'RESIDENT' | 'ENCADRANT';
}

// Simple auth functions
export const auth = {
  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Get user profile from database
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

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

      return createdProfile || null;
    }

    return profile;
  },

  // Get session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Listen to auth changes
  onAuthChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
