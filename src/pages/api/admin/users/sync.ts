import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, canUseAdminFunctions } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Vérifier l'authentification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const token = authHeader.substring(7);
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !currentUser) {
      return res.status(401).json({ error: 'Token d\'authentification invalide' });
    }

    // 2. Vérifier les permissions admin
    const hasAdminPermissions = await canUseAdminFunctions(currentUser.id);
    if (!hasAdminPermissions) {
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
                      
          await supabaseAdmin
            .from('users')
            .insert([{
              id: authUser.id,
              name: name,
              email: authUser.email,
              role: 'RESIDENT', // Rôle par défaut
              avatar: authUser.user_metadata?.avatar_url || null,
              phone: authUser.user_metadata?.phone || null,
              address: null,
              bio: null,
            }]);
          
          synced++;
          console.log(`✅ Profil créé pour ${authUser.email} (${authUser.id})`);
        } catch (error) {
          const errorMsg = `Erreur création profil pour ${authUser.email}: ${error}`;
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
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}