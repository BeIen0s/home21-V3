/**
 * Utilitaires de débogage pour la gestion des utilisateurs Supabase
 */

import { supabase } from '@/lib/supabase';

export const DebugUsers = {
  /**
   * Affiche tous les utilisateurs d'authentification
   */
  async listAuthUsers() {
    try {
      // Note: Cette méthode nécessite des permissions admin
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('❌ Erreur lors de la récupération des utilisateurs auth:', error);
        return [];
      }

      console.log('👥 Utilisateurs d\'authentification:', data.users.length);
      data.users.forEach(user => {
        console.log(`  - ${user.email} (${user.id}) - Créé: ${user.created_at}`);
      });
      
      return data.users;
    } catch (error) {
      console.error('❌ Impossible de lister les utilisateurs auth:', error);
      return [];
    }
  },

  /**
   * Affiche tous les utilisateurs de la table public.users
   */
  async listPublicUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors de la récupération des utilisateurs publics:', error);
        return [];
      }

      console.log('👤 Utilisateurs publics:', data.length);
      data.forEach(user => {
        console.log(`  - ${user.email} (${user.id}) - ${user.name} - Créé: ${user.created_at}`);
      });
      
      return data;
    } catch (error) {
      console.error('❌ Impossible de lister les utilisateurs publics:', error);
      return [];
    }
  },

  /**
   * Compare les utilisateurs auth et public pour identifier les orphelins
   */
  async findOrphanUsers() {
    const authUsers = await this.listAuthUsers();
    const publicUsers = await this.listPublicUsers();

    const authUserIds = new Set(authUsers.map(u => u.id));
    const publicUserIds = new Set(publicUsers.map(u => u.id));

    const orphanAuth = authUsers.filter(u => !publicUserIds.has(u.id));
    const orphanPublic = publicUsers.filter(u => !authUserIds.has(u.id));

    console.log('🔍 Analyse des utilisateurs orphelins:');
    console.log(`  - Utilisateurs auth sans profil public: ${orphanAuth.length}`);
    orphanAuth.forEach(u => console.log(`    * ${u.email} (${u.id})`));
    
    console.log(`  - Utilisateurs publics sans auth: ${orphanPublic.length}`);
    orphanPublic.forEach(u => console.log(`    * ${u.email} (${u.id})`));

    return { orphanAuth, orphanPublic };
  },

  /**
   * Teste la connexion aux tables
   */
  async testConnection() {
    console.log('🔧 Test de connexion...');
    
    try {
      // Test table public.users
      const { error: publicError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (publicError) {
        console.error('❌ Erreur connexion table public.users:', publicError.message);
        return false;
      } else {
        console.log('✅ Table public.users accessible');
      }

      return true;
    } catch (error) {
      console.error('❌ Erreur générale de connexion:', error);
      return false;
    }
  }
};

export default DebugUsers;