# Guide de Gestion des Utilisateurs - Home21

## 🔄 Workflow Recommandé

### 1. **Création d'un nouvel utilisateur**

#### Option A : Via l'application (Profil uniquement)
1. Allez sur `/admin/users`
2. Cliquez sur "Nouvel Utilisateur" 
3. Remplissez les informations du profil
4. **Important** : Ceci crée seulement le profil, pas l'authentification

#### Option B : Via Supabase (Authentification complète)
1. Allez dans l'interface Supabase Auth
2. Créez l'utilisateur avec email/mot de passe
3. L'utilisateur apparaîtra automatiquement dans l'application au prochain refresh

### 2. **Synchronisation des données**

#### Utilisateurs créés dans Supabase → Application
- ✅ **Automatique** : Les utilisateurs créés dans Supabase apparaissent automatiquement
- 🔄 Si pas visible : Rafraîchir la page ou cliquer "Synchroniser"

#### Utilisateurs créés dans l'application → Supabase
- ⚠️ **Manuel** : Invite l'utilisateur via Supabase Auth séparément
- 📧 L'utilisateur recevra un email d'invitation

## 🛠️ Solutions aux Problèmes Courants

### Problème : "User not allowed" lors de la synchronisation
**Cause** : Permissions insuffisantes pour accéder aux API admin de Supabase
**Solution** : 
- Utiliser l'interface Supabase pour les opérations d'authentification
- Créer les utilisateurs directement dans Supabase Auth

### Problème : Utilisateur n'apparaît pas après création
**Solution** : 
1. Vérifier dans la table `public.users` de Supabase
2. Rafraîchir la page de l'application
3. Vérifier les logs de la console pour les erreurs

## 🔧 Configuration Avancée

### Pour activer la synchronisation automatique complète :
1. Utiliser une Service Role Key dans une API backend
2. Créer des endpoints API sécurisés pour les opérations admin
3. Implémenter des triggers Supabase pour la synchronisation automatique

### Trigger SQL recommandé :
```sql
-- Trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'RESIDENT'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 📋 Checklist de Déploiement

- [ ] Trigger de synchronisation configuré
- [ ] RLS (Row Level Security) activé sur la table `users`
- [ ] Policies de sécurité définies
- [ ] Service Role Key configurée pour le backend
- [ ] Tests de bout en bout effectués
- [ ] Documentation utilisateur mise à jour

## 🔒 Sécurité

- ✅ Les profils sont protégés par RLS
- ✅ Seuls les administrateurs peuvent gérer les utilisateurs
- ✅ Les mots de passe sont gérés exclusivement par Supabase Auth
- ⚠️ Ne jamais exposer la Service Role Key côté client