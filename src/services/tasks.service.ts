import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export type DbTask = Database['public']['Tables']['tasks']['Row'];
export type CreateTaskData = Database['public']['Tables']['tasks']['Insert'];
export type UpdateTaskData = Database['public']['Tables']['tasks']['Update'];

export interface TaskWithDetails extends DbTask {
  assigned_user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  resident?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  house?: {
    id: string;
    number: string;
    name?: string;
  } | null;
  created_by_user?: {
    id: string;
    name: string;
    email: string;
  };
}

export class TasksService {
  // Get all tasks with related information
  static async getTasks(filters?: {
    status?: DbTask['status'];
    priority?: DbTask['priority'];
    assigned_to?: string;
    category?: string;
    type?: DbTask['type'];
  }): Promise<TaskWithDetails[]> {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:users!assigned_to(id, name, email),
        resident:residents(id, first_name, last_name),
        house:houses(id, number, name),
        created_by_user:users!created_by(id, name, email)
      `);

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Get task by ID
  static async getTaskById(id: string): Promise<TaskWithDetails | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:users!assigned_to(id, name, email),
        resident:residents(id, first_name, last_name),
        house:houses(id, number, name),
        created_by_user:users!created_by(id, name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(error.message);
    }

    return data;
  }

  // Get tasks assigned to a user
  static async getTasksByAssignee(userId: string): Promise<TaskWithDetails[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:users!assigned_to(id, name, email),
        resident:residents(id, first_name, last_name),
        house:houses(id, number, name),
        created_by_user:users!created_by(id, name, email)
      `)
      .eq('assigned_to', userId)
      .order('scheduled_start', { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Get tasks for a specific resident
  static async getTasksByResident(residentId: string): Promise<TaskWithDetails[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:users!assigned_to(id, name, email),
        resident:residents(id, first_name, last_name),
        house:houses(id, number, name),
        created_by_user:users!created_by(id, name, email)
      `)
      .eq('resident_id', residentId)
      .order('scheduled_start', { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Get tasks for a specific house
  static async getTasksByHouse(houseId: string): Promise<TaskWithDetails[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:users!assigned_to(id, name, email),
        resident:residents(id, first_name, last_name),
        house:houses(id, number, name),
        created_by_user:users!created_by(id, name, email)
      `)
      .eq('house_id', houseId)
      .order('scheduled_start', { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Get upcoming tasks (scheduled within next 24 hours)
  static async getUpcomingTasks(): Promise<TaskWithDetails[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:users!assigned_to(id, name, email),
        resident:residents(id, first_name, last_name),
        house:houses(id, number, name),
        created_by_user:users!created_by(id, name, email)
      `)
      .lte('scheduled_start', tomorrow.toISOString())
      .in('status', ['PENDING', 'ASSIGNED', 'IN_PROGRESS'])
      .order('scheduled_start', { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Get overdue tasks
  static async getOverdueTasks(): Promise<TaskWithDetails[]> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:users!assigned_to(id, name, email),
        resident:residents(id, first_name, last_name),
        house:houses(id, number, name),
        created_by_user:users!created_by(id, name, email)
      `)
      .lt('scheduled_end', now)
      .in('status', ['PENDING', 'ASSIGNED', 'IN_PROGRESS'])
      .order('scheduled_end', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Create new task
  static async createTask(taskData: CreateTaskData): Promise<DbTask> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Update task
  static async updateTask(id: string, updates: UpdateTaskData): Promise<DbTask> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Delete task
  static async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // Assign task to user
  static async assignTask(taskId: string, userId: string): Promise<DbTask> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        assigned_to: userId,
        status: 'ASSIGNED',
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Start task (mark as in progress)
  static async startTask(taskId: string): Promise<DbTask> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: 'IN_PROGRESS',
        actual_start: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Complete task
  static async completeTask(taskId: string): Promise<DbTask> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: 'COMPLETED',
        actual_end: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Get task statistics
  static async getTaskStats(): Promise<{
    total: number;
    pending: number;
    assigned: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    onHold: number;
    awaitingValidation: number;
    overdue: number;
    byPriority: {
      low: number;
      medium: number;
      high: number;
      urgent: number;
      critical: number;
    };
    byType: {
      routine: number;
      maintenance: number;
      request: number;
      emergency: number;
      inspection: number;
      event: number;
    };
  }> {
    const { data, error } = await supabase
      .from('tasks')
      .select('status, priority, type, scheduled_end');

    if (error) {
      throw new Error(error.message);
    }

    const now = new Date().toISOString();
    
    const stats = {
      total: data?.length || 0,
      pending: 0,
      assigned: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      onHold: 0,
      awaitingValidation: 0,
      overdue: 0,
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0,
        critical: 0,
      },
      byType: {
        routine: 0,
        maintenance: 0,
        request: 0,
        emergency: 0,
        inspection: 0,
        event: 0,
      },
    };

    data?.forEach(task => {
      // Count by status
      switch (task.status) {
        case 'PENDING':
          stats.pending++;
          break;
        case 'ASSIGNED':
          stats.assigned++;
          break;
        case 'IN_PROGRESS':
          stats.inProgress++;
          break;
        case 'COMPLETED':
          stats.completed++;
          break;
        case 'CANCELLED':
          stats.cancelled++;
          break;
        case 'ON_HOLD':
          stats.onHold++;
          break;
        case 'AWAITING_VALIDATION':
          stats.awaitingValidation++;
          break;
      }

      // Count overdue tasks
      if (
        task.scheduled_end && 
        task.scheduled_end < now && 
        ['PENDING', 'ASSIGNED', 'IN_PROGRESS'].includes(task.status)
      ) {
        stats.overdue++;
      }

      // Count by priority
      switch (task.priority) {
        case 'LOW':
          stats.byPriority.low++;
          break;
        case 'MEDIUM':
          stats.byPriority.medium++;
          break;
        case 'HIGH':
          stats.byPriority.high++;
          break;
        case 'URGENT':
          stats.byPriority.urgent++;
          break;
        case 'CRITICAL':
          stats.byPriority.critical++;
          break;
      }

      // Count by type
      switch (task.type) {
        case 'ROUTINE':
          stats.byType.routine++;
          break;
        case 'MAINTENANCE':
          stats.byType.maintenance++;
          break;
        case 'REQUEST':
          stats.byType.request++;
          break;
        case 'EMERGENCY':
          stats.byType.emergency++;
          break;
        case 'INSPECTION':
          stats.byType.inspection++;
          break;
        case 'EVENT':
          stats.byType.event++;
          break;
      }
    });

    return stats;
  }

  // Search tasks
  static async searchTasks(query: string): Promise<TaskWithDetails[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:users!assigned_to(id, name, email),
        resident:residents(id, first_name, last_name),
        house:houses(id, number, name),
        created_by_user:users!created_by(id, name, email)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
}