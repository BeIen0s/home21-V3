# Configuration Supabase - Instructions finales

## ✅ Migration terminée !

La migration de votre application Home21-V3 vers Supabase est maintenant **terminée**. L'application compile sans erreur et tous les services sont prêts.

## 🔧 Étapes finales pour activer Supabase

### 1. **Configurer Supabase Database**

Dans votre projet Supabase "pass21", exécutez le script SQL suivant dans l'éditeur SQL :

```sql
-- Le contenu complet se trouve dans le fichier : supabase/schema.sql
```

**Emplacement** : Copiez le contenu de `./supabase/schema.sql` dans l'éditeur SQL de votre projet Supabase.

### 2. **Configurer les variables d'environnement**

1. **Copiez le fichier d'exemple** :
   ```bash
   copy .env.local.example .env.local
   ```

2. **Récupérez vos clés Supabase** :
   - Allez dans votre projet Supabase → Settings → API
   - Copiez `Project URL` et `anon public`

3. **Modifiez le fichier `.env.local`** :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre-project-url-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key-supabase
   ```

### 3. **Tester l'application**

```bash
npm run dev
```

L'application devrait maintenant se connecter à Supabase et utiliser les vraies données de la base !

## 🏗️ Ce qui a été migré

### ✅ Authentification
- Hook `useAuth` utilise maintenant Supabase Auth
- Gestion des sessions sécurisée
- Reset de mot de passe inclus

### ✅ Services API complets
- `AuthService` - Authentification et gestion utilisateurs
- `ResidentsService` - CRUD complet pour les résidents
- `HousesService` - CRUD complet pour les logements  
- `TasksService` - CRUD complet pour les tâches

### ✅ Hooks React optimisés
- `useResidents`, `useResident`, `useResidentStats`
- `useHouses`, `useHouse`, `useHouseStats`  
- `useTasks`, `useTask`, `useUserTasks`, `useUpcomingTasks`, `useOverdueTasks`, `useTaskStats`

### ✅ Types TypeScript
- Types complets pour la base de données
- Interfaces pour tous les services
- Types pour les hooks et composants

### ✅ Sécurité
- Row Level Security (RLS) activé
- Policies de sécurité par rôle utilisateur
- Gestion des permissions

## 🎯 Utilisateurs de test créés

Le script SQL crée automatiquement ces utilisateurs de test :

```
Admin Principal: admin@home21.com
Marie Dubois (Admin): marie.dubois@home21.com  
Pierre Martin (Encadrant): pierre.martin@home21.com
Sophie Bernard (Encadrant): sophie.bernard@home21.com
```

**Note** : Les mots de passe doivent être configurés via Supabase Auth Dashboard.

## 🚀 Déploiement

Une fois que tout fonctionne localement, l'application est prête pour le déploiement sur :

- **Vercel** (recommandé pour Next.js)
- **Netlify** 
- **Railway**
- **Render**

Les variables d'environnement devront être configurées dans votre plateforme de déploiement.

## 🆘 Support

En cas de problème :

1. Vérifiez que les variables d'environnement sont bien configurées
2. Assurez-vous que le script SQL s'est exécuté sans erreur
3. Consultez les logs Supabase pour diagnostiquer les erreurs API

---

**🎉 Félicitations ! Votre application Home21-V3 est maintenant prête avec Supabase !**