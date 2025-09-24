-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'RESIDENT', 'ENCADRANT');
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE resident_status AS ENUM ('ACTIVE', 'WAITING_LIST', 'TEMPORARY_LEAVE', 'MOVED_OUT', 'DECEASED');
CREATE TYPE house_type AS ENUM ('STUDIO', 'T1', 'T2', 'T3', 'T4', 'T5');
CREATE TYPE house_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL');
CREATE TYPE task_status AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'AWAITING_VALIDATION', 'COMPLETED', 'CANCELLED', 'ON_HOLD');
CREATE TYPE task_type AS ENUM ('ROUTINE', 'MAINTENANCE', 'REQUEST', 'EMERGENCY', 'INSPECTION', 'EVENT');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'RESIDENT',
    avatar TEXT,
    phone VARCHAR(20),
    address TEXT,
    birth_date DATE,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Houses table
CREATE TABLE IF NOT EXISTS houses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    type house_type NOT NULL,
    floor INTEGER,
    section VARCHAR(50),
    size DECIMAL(8,2) NOT NULL, -- in square meters
    rooms INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    has_balcony BOOLEAN DEFAULT FALSE,
    has_garden BOOLEAN DEFAULT FALSE,
    is_accessible BOOLEAN DEFAULT FALSE, -- wheelchair accessible
    max_occupants INTEGER NOT NULL DEFAULT 1,
    monthly_rate DECIMAL(10,2),
    status house_status DEFAULT 'AVAILABLE',
    description TEXT,
    amenities TEXT[], -- array of amenities
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Residents table
CREATE TABLE IF NOT EXISTS residents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender_type NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    emergency_contact JSONB NOT NULL, -- {name, phone, relationship}
    medical_info JSONB, -- medical conditions, allergies, medications
    preferences JSONB, -- dietary, accessibility, etc.
    status resident_status DEFAULT 'ACTIVE',
    house_id UUID REFERENCES houses(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- e.g., 'cleaning', 'maintenance', 'medical'
    priority task_priority DEFAULT 'MEDIUM',
    status task_status DEFAULT 'PENDING',
    type task_type NOT NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
    house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
    scheduled_start TIMESTAMP WITH TIME ZONE,
    scheduled_end TIMESTAMP WITH TIME ZONE,
    actual_start TIMESTAMP WITH TIME ZONE,
    actual_end TIMESTAMP WITH TIME ZONE,
    estimated_duration INTEGER, -- in minutes
    instructions TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern JSONB, -- for recurring tasks
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task comments/notes table
CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_houses_status ON houses(status);
CREATE INDEX IF NOT EXISTS idx_houses_type ON houses(type);
CREATE INDEX IF NOT EXISTS idx_residents_status ON residents(status);
CREATE INDEX IF NOT EXISTS idx_residents_house_id ON residents(house_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_resident_id ON tasks(resident_id);
CREATE INDEX IF NOT EXISTS idx_tasks_house_id ON tasks(house_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON houses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Admins can manage everything
CREATE POLICY "Admins can manage users" ON users FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('SUPER_ADMIN', 'ADMIN')
    )
);

CREATE POLICY "Admins can manage houses" ON houses FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('SUPER_ADMIN', 'ADMIN')
    )
);

CREATE POLICY "Admins can manage residents" ON residents FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('SUPER_ADMIN', 'ADMIN', 'ENCADRANT')
    )
);

CREATE POLICY "Admins can manage tasks" ON tasks FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('SUPER_ADMIN', 'ADMIN', 'ENCADRANT')
    )
);

-- Users can view tasks assigned to them
CREATE POLICY "Users can view assigned tasks" ON tasks FOR SELECT USING (assigned_to = auth.uid());

-- Users can update tasks assigned to them (status, comments, etc.)
CREATE POLICY "Users can update assigned tasks" ON tasks FOR UPDATE USING (assigned_to = auth.uid());

-- Task comments policies
CREATE POLICY "Users can view task comments" ON task_comments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM tasks 
        WHERE id = task_id 
        AND (assigned_to = auth.uid() OR created_by = auth.uid())
    )
    OR EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('SUPER_ADMIN', 'ADMIN', 'ENCADRANT')
    )
);

CREATE POLICY "Users can add task comments" ON task_comments FOR INSERT WITH CHECK (
    user_id = auth.uid() AND (
        EXISTS (
            SELECT 1 FROM tasks 
            WHERE id = task_id 
            AND (assigned_to = auth.uid() OR created_by = auth.uid())
        )
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('SUPER_ADMIN', 'ADMIN', 'ENCADRANT')
        )
    )
);

-- Insert sample data for development
INSERT INTO users (id, name, email, role, phone, bio) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Admin Principal', 'admin@home21.com', 'SUPER_ADMIN', '0123456789', 'Administrateur principal du système'),
    ('550e8400-e29b-41d4-a716-446655440001', 'Marie Dubois', 'marie.dubois@home21.com', 'ADMIN', '0123456790', 'Gestionnaire des résidents'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Pierre Martin', 'pierre.martin@home21.com', 'ENCADRANT', '0123456791', 'Encadrant équipe jour'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Sophie Bernard', 'sophie.bernard@home21.com', 'ENCADRANT', '0123456792', 'Encadrant équipe nuit')
ON CONFLICT (email) DO NOTHING;

INSERT INTO houses (id, number, name, type, floor, size, rooms, bathrooms, max_occupants, status, description) VALUES
    ('650e8400-e29b-41d4-a716-446655440000', 'A101', 'Appartement Soleil', 'T2', 1, 45.50, 2, 1, 1, 'AVAILABLE', 'Appartement lumineux avec balcon'),
    ('650e8400-e29b-41d4-a716-446655440001', 'A102', 'Appartement Lune', 'T1', 1, 35.00, 1, 1, 1, 'OCCUPIED', 'Studio confortable'),
    ('650e8400-e29b-41d4-a716-446655440002', 'B201', 'Appartement Étoile', 'T3', 2, 65.00, 3, 2, 2, 'AVAILABLE', 'Grande surface avec jardin'),
    ('650e8400-e29b-41d4-a716-446655440003', 'B202', 'Appartement Nuage', 'T2', 2, 50.00, 2, 1, 1, 'MAINTENANCE', 'En cours de rénovation')
ON CONFLICT (number) DO NOTHING;

INSERT INTO residents (id, first_name, last_name, date_of_birth, gender, phone, email, emergency_contact, status, house_id) VALUES
    ('750e8400-e29b-41d4-a716-446655440000', 'Jean', 'Dupont', '1945-03-15', 'MALE', '0123456793', 'jean.dupont@email.com', '{"name": "Marie Dupont", "phone": "0123456794", "relationship": "Épouse"}', 'ACTIVE', '650e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440001', 'Micheline', 'Durand', '1938-07-22', 'FEMALE', '0123456795', 'micheline.durand@email.com', '{"name": "Paul Durand", "phone": "0123456796", "relationship": "Fils"}', 'ACTIVE', '650e8400-e29b-41d4-a716-446655440000'),
    ('750e8400-e29b-41d4-a716-446655440002', 'Robert', 'Moreau', '1942-11-08', 'MALE', '0123456797', 'robert.moreau@email.com', '{"name": "Sylvie Moreau", "phone": "0123456798", "relationship": "Fille"}', 'WAITING_LIST', null)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, title, description, category, priority, type, assigned_to, resident_id, scheduled_start, created_by) VALUES
    ('850e8400-e29b-41d4-a716-446655440000', 'Prise de médicaments matin', 'Administrer les médicaments du matin selon prescription', 'medical', 'HIGH', 'ROUTINE', '550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440000', NOW() + INTERVAL '1 day', '550e8400-e29b-41d4-a716-446655440001'),
    ('850e8400-e29b-41d4-a716-446655440001', 'Nettoyage appartement A101', 'Nettoyage hebdomadaire complet de l''appartement', 'cleaning', 'MEDIUM', 'ROUTINE', '550e8400-e29b-41d4-a716-446655440003', null, NOW() + INTERVAL '2 days', '550e8400-e29b-41d4-a716-446655440001'),
    ('850e8400-e29b-41d4-a716-446655440002', 'Réparation robinet B202', 'Fuite détectée dans la salle de bain', 'maintenance', 'URGENT', 'MAINTENANCE', null, null, NOW() + INTERVAL '1 hour', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;