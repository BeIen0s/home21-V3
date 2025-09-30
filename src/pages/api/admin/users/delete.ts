import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, canUseAdminFunctions } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
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

    // 3. Récupérer l'ID utilisateur à supprimer
    const { userId } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    // 4. Vérifier qu'on ne supprime pas son propre compte
    if (userId === currentUser.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    // 5. Supprimer le profil utilisateur
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (profileError) {
      return res.status(400).json({ 
        error: `Erreur lors de la suppression du profil: ${profileError.message}` 
      });
    }

    // 6. Supprimer l'utilisateur d'authentification
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authDeleteError) {
      console.warn('Avertissement lors de la suppression de l\'auth:', authDeleteError.message);
      // Ne pas lever d'erreur car le profil est déjà supprimé
    }

    res.status(200).json({ 
      message: 'Utilisateur supprimé avec succès',
      userId 
    });

  } catch (error) {
    console.error('API /admin/users/delete error:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}