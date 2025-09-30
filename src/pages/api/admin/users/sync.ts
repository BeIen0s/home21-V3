import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, canUseAdminFunctions } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required environment variables:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    return res.status(500).json({ error: 'Configuration du serveur manquante' });
  }

  try {
    // 1. Vérifier l'authentification
    console.log('Starting sync operation...');
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing authorization header');
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const token = authHeader.substring(7);
    console.log('Validating user token...');
    
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !currentUser) {
      console.error('Auth validation failed:', authError?.message);
      return res.status(401).json({ error: 'Token d\'authentification invalide' });
    }
    
    console.log(`User authenticated: ${currentUser.email} (${currentUser.id})`);

    // 2. Vérifier les permissions admin
    console.log('Checking admin permissions...');
    const hasAdminPermissions = await canUseAdminFunctions(currentUser.id);
    console.log(`Admin permissions check result: ${hasAdminPermissions}`);
    
    if (!hasAdminPermissions) {
      console.error(`User ${currentUser.email} lacks admin permissions`);
      return res.status(403).json({ error: 'Permissions insuffisantes' });
    }

    // 3. Récupérer tous les utilisateurs d'authentification
    const { data: authUsersData, error: authError2 } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError2) {
      return res.status(400).json({ 
        error: `Erreur lors de la récupération des utilisateurs auth: ${authError2.message}` 
      });
    }

    // 4. Récupérer tous les profils publics
    const { data: publicUsers, error: publicError } = await supabaseAdmin
      .from('users')
      .select('id');

    if (publicError) {
      return res.status(400).json({ 
        error: `Erreur lors de la récupération des profils: ${publicError.message}` 
      });
    }

    const publicUserIds = new Set(publicUsers?.map(u => u.id) || []);
    const errors: string[] = [];
    let synced = 0;

    // 5. Créer les profils manquants pour les utilisateurs auth orphelins
    for (const authUser of authUsersData.users) {
      if (!publicUserIds.has(authUser.id)) {
        try {
          const name = authUser.user_metadata?.name || 
                      authUser.user_metadata?.full_name || 
                      authUser.email?.split('@')[0] || 'Utilisateur';
          
          // Split name into firstName and lastName for better schema compatibility
          const nameParts = name.split(' ');
          const firstName = nameParts[0] || 'Prénom';
          const lastName = nameParts.slice(1).join(' ') || 'Nom';
                      
          const { data: insertedUser, error: insertError } = await supabaseAdmin
            .from('users')
            .insert([{
              id: authUser.id,
              firstName: firstName,
              lastName: lastName,
              email: authUser.email,
              role: 'RESIDENT', // Rôle par défaut
              accessLevel: 'BASIC', // Niveau d'accès par défaut
              avatar: authUser.user_metadata?.avatar_url || null,
              phone: authUser.user_metadata?.phone || null,
              isActive: true,
              canAccessAfterHours: false,
              twoFactorEnabled: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }])
            .select();
          
          if (insertError) {
            throw new Error(`Insert error: ${insertError.message}`);
          }
          
          synced++;
          console.log(`✅ Profil créé pour ${authUser.email} (${authUser.id})`);
        } catch (error) {
          const errorMsg = `Erreur création profil pour ${authUser.email}: ${error instanceof Error ? error.message : error}`;
          console.error(`❌ ${errorMsg}`);
          errors.push(errorMsg);
        }
      }
    }

    res.status(200).json({
      message: 'Synchronisation terminée',
      synced,
      errors,
      totalAuthUsers: authUsersData.users.length,
      totalPublicUsers: publicUsers?.length || 0
    });

  } catch (error) {
    console.error('API /admin/users/sync error:', error);
    
    // Provide more detailed error information in production
    const errorMessage = error instanceof Error ? error.message : 'Erreur interne du serveur';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    
    res.status(500).json({ 
      error: 'Erreur interne du serveur',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}