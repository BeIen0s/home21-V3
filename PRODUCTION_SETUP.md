# 🚀 Pass21 - Déploiement Production (Netlify + Supabase)

## Mise en Production - Version Stable

Votre application Pass21 est maintenant prête pour la production avec Netlify et Supabase !

---

## 📋 Pré-requis

✅ **Déjà configuré** : Netlify et Supabase  
✅ **Version stable** : Navigation avec menu Administration  
✅ **Authentification** : Système basé sur les rôles  
✅ **Design** : Interface moderne et responsive  

---

## 🎯 Étape 1: Configuration Supabase

### A. Variables d'Environnement Netlify

Dans votre dashboard Netlify ➜ Site settings ➜ Environment variables :

```bash
NODE_ENV=production
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SHOW_MOCK_DATA=false
```

### B. Données de Test (Option 1 - Recommandée)

Pour commencer immédiatement avec des données de test, gardez :
```bash
NEXT_PUBLIC_SHOW_MOCK_DATA=true
```

### C. Vraies Données (Option 2 - Production)

Pour utiliser vos vraies données Supabase :
```bash
NEXT_PUBLIC_SHOW_MOCK_DATA=false
```

---

## 🗄️ Étape 2: Structure Base de Données Supabase

Si vous voulez utiliser les vraies données, créez ces tables dans Supabase :

### Table `users`
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'ENCADRANT', 'RESIDENT')),
  avatar VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table `residents`
```sql
CREATE TABLE residents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
  phone VARCHAR,
  email VARCHAR,
  emergency_contact JSONB,
  status VARCHAR DEFAULT 'ACTIVE',
  house_id UUID REFERENCES houses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table `houses`
```sql
CREATE TABLE houses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number VARCHAR NOT NULL,
  name VARCHAR,
  type VARCHAR CHECK (type IN ('STUDIO', 'T1', 'T2', 'T3', 'T4', 'T5')),
  size INTEGER,
  max_occupants INTEGER DEFAULT 1,
  status VARCHAR DEFAULT 'AVAILABLE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table `tasks`
```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR DEFAULT 'GENERAL',
  priority VARCHAR DEFAULT 'MEDIUM',
  status VARCHAR DEFAULT 'PENDING',
  type VARCHAR DEFAULT 'REQUEST',
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🚀 Étape 3: Déploiement

### Option A: Auto-Deploy (Recommandé)
Votre Netlify est probablement déjà configuré pour déployer automatiquement depuis Git.

1. **Push sur votre branche principale**
2. **Netlify build automatiquement**
3. **Vérifier sur votre URL Netlify**

### Option B: Deploy Manuel
```bash
# Build local pour tester
npm run build

# Deploy avec Netlify CLI
netlify deploy --prod
```

---

## ✅ Étape 4: Vérifications Post-Déploiement

### Tests Essentiels
- [ ] **Page login** accessible
- [ ] **Connexion** avec compte test fonctionne
- [ ] **Navbar** affiche menu Administration
- [ ] **Navigation** entre pages OK
- [ ] **Permissions** respectées par rôle
- [ ] **Responsive** mobile/tablet

### Comptes de Test Disponibles
- **Super Admin**: `sylvain@pass21.fr` / `admin123`
- **Admin**: `admin@pass21.fr` / `admin123`
- **Encadrant**: `encadrant@pass21.fr` / `encadrant123`
- **Résident**: `marie@pass21.fr` / `marie123`

---

## 🔄 Migration Progressive vers Vraies Données

### Phase 1: Test avec Mock Data
```bash
NEXT_PUBLIC_SHOW_MOCK_DATA=true
```
➜ Utilise les données de test, idéal pour valider l'interface

### Phase 2: Transition vers Supabase
```bash
NEXT_PUBLIC_SHOW_MOCK_DATA=false
```
➜ Bascule vers Supabase (nécessite les tables créées)

### Phase 3: Authentification Supabase
Pour utiliser l'authentification Supabase complète, ajoutez dans Supabase Auth :
- Activer Email/Password
- Configurer les redirections
- Créer vos utilisateurs

---

## 🎨 Fonctionnalités Actuellement Actives

✅ **Authentification** avec 4 types de rôles  
✅ **Dashboard** avec statistiques  
✅ **Menu Administration** avec sous-onglets :
- Utilisateurs
- Logements  
- Résidents
- Tâches

✅ **Pages Services** complètes  
✅ **Paramètres** système  
✅ **Design moderne** et responsive  
✅ **Gestion permissions** par rôle  

---

## 🆘 Dépannage Rapide

### Build Failed
```bash
# Nettoyer et rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Supabase Connection Issues
1. Vérifier `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Tester la connexion Supabase dans le dashboard
3. Vérifier que les tables existent (si `SHOW_MOCK_DATA=false`)

### Authentication Issues
- Avec `SHOW_MOCK_DATA=true` : utilise les comptes test
- Avec `SHOW_MOCK_DATA=false` : nécessite configuration Supabase Auth

---

## 📊 Monitoring Production

### Netlify Dashboard
- **Build logs** : Vérifier les déploiements
- **Analytics** : Trafic et performances
- **Error tracking** : Surveiller les erreurs

### Supabase Dashboard  
- **Database** : Vérifier les données
- **Auth** : Gérer les utilisateurs
- **API logs** : Surveiller les requêtes

---

## 🎯 Résultat Final

🚀 **Application Pass21 en Production** :
- URL stable Netlify
- Interface professionnelle
- Navigation complète et intuitive
- Système de permissions robuste
- Prêt pour utilisateurs réels
- Evolutif vers vraies données

**Status**: ✅ **PRODUCTION READY** 

---

*Version: Stable | Stack: Next.js + Netlify + Supabase | Date: 2024-12-25*