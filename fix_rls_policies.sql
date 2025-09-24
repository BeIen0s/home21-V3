-- Fix RLS policies to avoid infinite recursion
-- This script should be run in your Supabase SQL Editor

-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policies without recursion
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON users 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users 
FOR UPDATE 
USING (auth.uid() = id);

-- Allow super admin and admin to manage all users
-- Use auth.jwt() to get role from JWT token instead of querying users table
CREATE POLICY "Admins can manage users" ON users 
FOR ALL 
USING (
  (auth.jwt() ->> 'role')::text IN ('SUPER_ADMIN', 'ADMIN')
  OR auth.uid() = id
);

-- Also fix other policies that might have similar issues
DROP POLICY IF EXISTS "Admins can manage houses" ON houses;
CREATE POLICY "Admins can manage houses" ON houses 
FOR ALL 
USING (
  (auth.jwt() ->> 'role')::text IN ('SUPER_ADMIN', 'ADMIN')
);

DROP POLICY IF EXISTS "Admins can manage residents" ON residents;
CREATE POLICY "Admins can manage residents" ON residents 
FOR ALL 
USING (
  (auth.jwt() ->> 'role')::text IN ('SUPER_ADMIN', 'ADMIN', 'ENCADRANT')
);

DROP POLICY IF EXISTS "Admins can manage tasks" ON tasks;
CREATE POLICY "Admins can manage tasks" ON tasks 
FOR ALL 
USING (
  (auth.jwt() ->> 'role')::text IN ('SUPER_ADMIN', 'ADMIN', 'ENCADRANT')
);

-- Update task comments policies
DROP POLICY IF EXISTS "Users can view task comments" ON task_comments;
CREATE POLICY "Users can view task comments" ON task_comments 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM tasks 
        WHERE id = task_id 
        AND (assigned_to = auth.uid() OR created_by = auth.uid())
    )
    OR (auth.jwt() ->> 'role')::text IN ('SUPER_ADMIN', 'ADMIN', 'ENCADRANT')
);

DROP POLICY IF EXISTS "Users can add task comments" ON task_comments;
CREATE POLICY "Users can add task comments" ON task_comments 
FOR INSERT 
WITH CHECK (
    user_id = auth.uid() AND (
        EXISTS (
            SELECT 1 FROM tasks 
            WHERE id = task_id 
            AND (assigned_to = auth.uid() OR created_by = auth.uid())
        )
        OR (auth.jwt() ->> 'role')::text IN ('SUPER_ADMIN', 'ADMIN', 'ENCADRANT')
    )
);