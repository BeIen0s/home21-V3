import { supabase, auth } from '@/lib/auth';

export class AuthService {
  /**
   * Update user password
   */
  static async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Reset password - send reset email
   */
  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string) {
    return auth.signIn(email, password);
  }

  /**
   * Sign out
   */
  static async signOut() {
    return auth.signOut();
  }

  /**
   * Get current user
   */
  static async getUser() {
    return auth.getUser();
  }

  /**
   * Get current session
   */
  static async getSession() {
    return auth.getSession();
  }

  /**
   * Sign up with email and password
   */
  static async signUp(email: string, password: string, userData?: { name?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData || {}
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: { name?: string; email?: string }) {
    const { error } = await supabase.auth.updateUser({
      email: updates.email,
      data: { name: updates.name }
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return auth.onAuthChange(callback);
  }
}