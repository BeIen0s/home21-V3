import { createClient } from '@supabase/supabase-js';

// Client admin avec Service Role Key (côté serveur uniquement)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase admin environment variables');
}

// ⚠️ ATTENTION: Ce client ne doit JAMAIS être utilisé côté client
// Il doit uniquement être utilisé dans les API routes Next.js
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper pour vérifier si l'utilisateur actuel peut utiliser les fonctions admin
export async function canUseAdminFunctions(userId: string): Promise<boolean> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return false;
    }

    return user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
  } catch (error) {
    console.error('Error checking admin permissions:', error);
    return false;
  }
}