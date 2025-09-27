/**
 * Service Supabase pour Home21 - Production Ready
 * 
 * Remplace complètement les données mock par les vraies données Supabase
 */

import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { User, Resident, House, Task } from './apiService';

// Types Supabase
type SupabaseUser = Database['public']['Tables']['users']['Row'];
type SupabaseResident = Database['public']['Tables']['residents']['Row'];
type SupabaseHouse = Database['public']['Tables']['houses']['Row'];
type SupabaseTask = Database['public']['Tables']['tasks']['Row'];

// Utilitaires de conversion
const convertSupabaseUserToUser = (supaUser: SupabaseUser): User => ({
  id: supaUser.id,
  email: supaUser.email,
  name: supaUser.name,
  role: supaUser.role,
  avatar: supaUser.avatar,
  createdAt: supaUser.created_at,
  updatedAt: supaUser.updated_at,
});

const convertSupabaseResidentToResident = (supaResident: SupabaseResident): Resident => ({
  id: supaResident.id,
  firstName: supaResident.first_name,
  lastName: supaResident.last_name,
  email: supaResident.email || '',
  phone: supaResident.phone || '',
  houseId: supaResident.house_id,
  status: supaResident.status === 'ACTIVE' ? 'active' : 'inactive',
  createdAt: supaResident.created_at,
  updatedAt: supaResident.updated_at,
});

const convertSupabaseHouseToHouse = (supaHouse: SupabaseHouse): House => ({
  id: supaHouse.id,
  name: supaHouse.name || `Logement ${supaHouse.number}`,
  address: `${supaHouse.number} - ${supaHouse.type}`,
  capacity: supaHouse.max_occupants,
  currentOccupancy: 0, // TODO: Calculer depuis les résidents
  status: supaHouse.status === 'AVAILABLE' ? 'available' : 
          supaHouse.status === 'OCCUPIED' ? 'occupied' : 'maintenance',
  createdAt: supaHouse.created_at,
  updatedAt: supaHouse.updated_at,
});

const convertSupabaseTaskToTask = (supaTask: SupabaseTask): Task => ({
  id: supaTask.id,
  title: supaTask.title,
  description: supaTask.description || '',
  status: supaTask.status === 'PENDING' ? 'pending' :
          supaTask.status === 'IN_PROGRESS' ? 'in_progress' :
          supaTask.status === 'COMPLETED' ? 'completed' : 'cancelled',
  priority: supaTask.priority === 'LOW' ? 'low' :
            supaTask.priority === 'MEDIUM' ? 'medium' :
            supaTask.priority === 'HIGH' ? 'high' : 'urgent',
  assignedTo: supaTask.assigned_to,
  dueDate: supaTask.scheduled_end,
  createdAt: supaTask.created_at,
  updatedAt: supaTask.updated_at,
});

/**
 * Service d'authentification Supabase
 */
export const SupabaseAuthService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Authentification Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Erreur de connexion');
    }

    // Récupérer les infos utilisateur depuis la table users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      throw new Error('Utilisateur non trouvé dans la base');
    }

    const user = convertSupabaseUserToUser(userData);
    const token = authData.session?.access_token || '';

    return { user, token };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Supabase logout error:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return null;
    }

    // Récupérer les infos utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData) {
      return null;
    }

    return convertSupabaseUserToUser(userData);
  },
};

/**
 * Service utilisateurs Supabase
 */
export const SupabaseUserService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }

    return (data || []).map(convertSupabaseUserToUser);
  },

  async getById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error(`Utilisateur non trouvé: ${error?.message}`);
    }

    return convertSupabaseUserToUser(data);
  },

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        name: userData.name,
        role: userData.role,
        avatar: userData.avatar,
      }])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erreur lors de la création de l'utilisateur: ${error?.message}`);
    }

    return convertSupabaseUserToUser(data);
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...(userData.name && { name: userData.name }),
        ...(userData.email && { email: userData.email }),
        ...(userData.role && { role: userData.role }),
        ...(userData.avatar && { avatar: userData.avatar }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error?.message}`);
    }

    return convertSupabaseUserToUser(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
    }
  },
};

/**
 * Service résidents Supabase
 */
export const SupabaseResidentService = {
  async getAll(): Promise<Resident[]> {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des résidents: ${error.message}`);
    }

    return (data || []).map(convertSupabaseResidentToResident);
  },

  async getById(id: string): Promise<Resident> {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error(`Résident non trouvé: ${error?.message}`);
    }

    return convertSupabaseResidentToResident(data);
  },

  async create(residentData: Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resident> {
    const { data, error } = await supabase
      .from('residents')
      .insert([{
        first_name: residentData.firstName,
        last_name: residentData.lastName,
        email: residentData.email,
        phone: residentData.phone,
        house_id: residentData.houseId,
        status: residentData.status === 'active' ? 'ACTIVE' : 'WAITING_LIST',
        date_of_birth: '1990-01-01', // TODO: Ajouter ce champ
        gender: 'OTHER', // TODO: Ajouter ce champ
        emergency_contact: {}, // TODO: Ajouter ce champ
      }])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erreur lors de la création du résident: ${error?.message}`);
    }

    return convertSupabaseResidentToResident(data);
  },

  async update(id: string, residentData: Partial<Resident>): Promise<Resident> {
    const { data, error } = await supabase
      .from('residents')
      .update({
        ...(residentData.firstName && { first_name: residentData.firstName }),
        ...(residentData.lastName && { last_name: residentData.lastName }),
        ...(residentData.email && { email: residentData.email }),
        ...(residentData.phone && { phone: residentData.phone }),
        ...(residentData.houseId && { house_id: residentData.houseId }),
        ...(residentData.status && { status: residentData.status === 'active' ? 'ACTIVE' : 'WAITING_LIST' }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erreur lors de la mise à jour du résident: ${error?.message}`);
    }

    return convertSupabaseResidentToResident(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('residents')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erreur lors de la suppression du résident: ${error.message}`);
    }
  },
};

/**
 * Service logements Supabase
 */
export const SupabaseHouseService = {
  async getAll(): Promise<House[]> {
    const { data, error } = await supabase
      .from('houses')
      .select('*')
      .order('number', { ascending: true });

    if (error) {
      throw new Error(`Erreur lors de la récupération des logements: ${error.message}`);
    }

    return (data || []).map(convertSupabaseHouseToHouse);
  },

  async getById(id: string): Promise<House> {
    const { data, error } = await supabase
      .from('houses')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error(`Logement non trouvé: ${error?.message}`);
    }

    return convertSupabaseHouseToHouse(data);
  },

  async create(houseData: Omit<House, 'id' | 'createdAt' | 'updatedAt'>): Promise<House> {
    const { data, error } = await supabase
      .from('houses')
      .insert([{
        number: `H${Date.now()}`, // TODO: Générer un numéro approprié
        name: houseData.name,
        type: 'T1', // TODO: Déterminer le type
        size: 25, // TODO: Ajouter ce champ
        rooms: 1, // TODO: Ajouter ce champ
        bathrooms: 1, // TODO: Ajouter ce champ
        has_balcony: false,
        has_garden: false,
        is_accessible: false,
        max_occupants: houseData.capacity,
        status: houseData.status === 'available' ? 'AVAILABLE' :
                houseData.status === 'occupied' ? 'OCCUPIED' : 'MAINTENANCE',
      }])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erreur lors de la création du logement: ${error?.message}`);
    }

    return convertSupabaseHouseToHouse(data);
  },

  async update(id: string, houseData: Partial<House>): Promise<House> {
    const { data, error } = await supabase
      .from('houses')
      .update({
        ...(houseData.name && { name: houseData.name }),
        ...(houseData.capacity && { max_occupants: houseData.capacity }),
        ...(houseData.status && { 
          status: houseData.status === 'available' ? 'AVAILABLE' :
                  houseData.status === 'occupied' ? 'OCCUPIED' : 'MAINTENANCE'
        }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erreur lors de la mise à jour du logement: ${error?.message}`);
    }

    return convertSupabaseHouseToHouse(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('houses')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erreur lors de la suppression du logement: ${error.message}`);
    }
  },
};

/**
 * Service tâches Supabase
 */
export const SupabaseTaskService = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des tâches: ${error.message}`);
    }

    return (data || []).map(convertSupabaseTaskToTask);
  },

  async getById(id: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error(`Tâche non trouvée: ${error?.message}`);
    }

    return convertSupabaseTaskToTask(data);
  },

  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: taskData.title,
        description: taskData.description,
        category: 'GENERAL', // TODO: Ajouter ce champ à l'interface
        priority: taskData.priority?.toUpperCase() as any || 'MEDIUM',
        status: taskData.status?.toUpperCase() as any || 'PENDING',
        type: 'REQUEST', // TODO: Ajouter ce champ à l'interface
        assigned_to: taskData.assignedTo,
        scheduled_end: taskData.dueDate,
        is_recurring: false,
        created_by: user?.id || '',
      }])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erreur lors de la création de la tâche: ${error?.message}`);
    }

    return convertSupabaseTaskToTask(data);
  },

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...(taskData.title && { title: taskData.title }),
        ...(taskData.description && { description: taskData.description }),
        ...(taskData.priority && { priority: taskData.priority.toUpperCase() as any }),
        ...(taskData.status && { status: taskData.status.toUpperCase() as any }),
        ...(taskData.assignedTo && { assigned_to: taskData.assignedTo }),
        ...(taskData.dueDate && { scheduled_end: taskData.dueDate }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erreur lors de la mise à jour de la tâche: ${error?.message}`);
    }

    return convertSupabaseTaskToTask(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erreur lors de la suppression de la tâche: ${error.message}`);
    }
  },
};

// Export pour remplacer les services mock
export const ProductionServices = {
  Auth: SupabaseAuthService,
  User: SupabaseUserService,
  Resident: SupabaseResidentService,
  House: SupabaseHouseService,
  Task: SupabaseTaskService,
};