import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, canUseAdminFunctions } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== Starting user creation ===');
    console.log('Request body:', req.body);
    
    // 1. Vérifier l'authentification de l'utilisateur actuel
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing authorization header');
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const token = authHeader.substring(7);
    console.log('Token validation...');
    
    // Vérifier le token avec le client standard (pas admin)
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !currentUser) {
      return res.status(401).json({ error: 'Token d\'authentification invalide' });
    }

    // 2. Vérifier les permissions admin
    const hasAdminPermissions = await canUseAdminFunctions(currentUser.id);
    if (!hasAdminPermissions) {
      return res.status(403).json({ error: 'Permissions insuffisantes' });
    }

    // 3. Récupérer les données utilisateur de la requête
    const { email, firstName, lastName, role, password } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, prénom et nom sont requis' });
    }

    // 4. Créer l'utilisateur d'authentification avec le client admin
    const tempPassword = password || `Temp${Math.random().toString(36).slice(-8)}!`;
    const fullName = `${firstName} ${lastName}`;

    const { data: authUser, error: authError2 } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: fullName,
        firstName,
        lastName
      }
    });

    if (authError2 || !authUser.user) {
      return res.status(400).json({ 
        error: `Erreur lors de la création de l'utilisateur d'authentification: ${authError2?.message}` 
      });
    }

    // 5. Créer le profil utilisateur dans public.users
    const { data: profileUser, error: profileError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: authUser.user.id,
        name: fullName,
        email,
        role: role || 'RESIDENT',
        avatar: null,
        phone: null,
        address: null,
        bio: null,
      }])
      .select()
      .single();

    if (profileError) {
      // Rollback: supprimer l'utilisateur d'auth créé
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return res.status(400).json({ 
        error: `Erreur lors de la création du profil: ${profileError.message}` 
      });
    }

    // 6. Retourner le profil créé
    res.status(201).json({
      user: profileUser,
      message: 'Utilisateur créé avec succès',
      tempPassword: password ? undefined : tempPassword // Retourner le mot de passe temporaire si généré
    });

  } catch (error) {
    console.error('=== API /admin/users/create error ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'Erreur interne du serveur';
    res.status(500).json({ error: errorMessage });
  }
}