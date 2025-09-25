-- Script pour créer le profil utilisateur manquant
-- Exécuter dans Supabase Dashboard > SQL Editor

-- 1. Vérifier l'utilisateur dans auth.users
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE id = '77c5af80-882a-46e1-bf69-7c4a7b1bd506';

-- 2. Vérifier si le profil existe déjà dans users
SELECT id, email, name, role 
FROM users 
WHERE id = '77c5af80-882a-46e1-bf69-7c4a7b1bd506';

-- 3. Créer le profil manquant (adapter l'email si nécessaire)
INSERT INTO users (id, email, name, role, created_at, updated_at)
VALUES (
    '77c5af80-882a-46e1-bf69-7c4a7b1bd506',
    'sylvain.pater.lafages@gmail.com',
    'Super Admin',
    'SUPER_ADMIN',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 4. Vérifier la création
SELECT u.id, u.email, u.name, u.role, au.email_confirmed_at
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.id = '77c5af80-882a-46e1-bf69-7c4a7b1bd506';