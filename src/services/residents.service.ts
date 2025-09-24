import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export type DbResident = Database['public']['Tables']['residents']['Row'];
export type CreateResidentData = Database['public']['Tables']['residents']['Insert'];
export type UpdateResidentData = Database['public']['Tables']['residents']['Update'];

export interface ResidentWithHouse extends DbResident {
  house?: {
    id: string;
    number: string;
    name?: string;
    type: string;
  } | null;
}

export class ResidentsService {
  // Get all residents with house information
  static async getResidents(): Promise<ResidentWithHouse[]> {
    const { data, error } = await supabase
      .from('residents')
      .select(`
        *,
        house:houses(id, number, name, type)
      `)
      .order('last_name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Get resident by ID
  static async getResidentById(id: string): Promise<ResidentWithHouse | null> {
    const { data, error } = await supabase
      .from('residents')
      .select(`
        *,
        house:houses(id, number, name, type)
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

  // Get residents by house ID
  static async getResidentsByHouse(houseId: string): Promise<DbResident[]> {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .eq('house_id', houseId)
      .order('last_name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Get residents by status
  static async getResidentsByStatus(status: DbResident['status']): Promise<ResidentWithHouse[]> {
    const { data, error } = await supabase
      .from('residents')
      .select(`
        *,
        house:houses(id, number, name, type)
      `)
      .eq('status', status)
      .order('last_name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Create new resident
  static async createResident(residentData: CreateResidentData): Promise<DbResident> {
    const { data, error } = await supabase
      .from('residents')
      .insert(residentData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Update resident
  static async updateResident(id: string, updates: UpdateResidentData): Promise<DbResident> {
    const { data, error } = await supabase
      .from('residents')
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

  // Delete resident
  static async deleteResident(id: string): Promise<void> {
    const { error } = await supabase
      .from('residents')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // Search residents by name or email
  static async searchResidents(query: string): Promise<ResidentWithHouse[]> {
    const { data, error } = await supabase
      .from('residents')
      .select(`
        *,
        house:houses(id, number, name, type)
      `)
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('last_name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Get resident statistics
  static async getResidentStats(): Promise<{
    total: number;
    active: number;
    waitingList: number;
    temporaryLeave: number;
    movedOut: number;
    deceased: number;
  }> {
    const { data, error } = await supabase
      .from('residents')
      .select('status');

    if (error) {
      throw new Error(error.message);
    }

    const stats = {
      total: data?.length || 0,
      active: 0,
      waitingList: 0,
      temporaryLeave: 0,
      movedOut: 0,
      deceased: 0,
    };

    data?.forEach(resident => {
      switch (resident.status) {
        case 'ACTIVE':
          stats.active++;
          break;
        case 'WAITING_LIST':
          stats.waitingList++;
          break;
        case 'TEMPORARY_LEAVE':
          stats.temporaryLeave++;
          break;
        case 'MOVED_OUT':
          stats.movedOut++;
          break;
        case 'DECEASED':
          stats.deceased++;
          break;
      }
    });

    return stats;
  }

  // Assign resident to house
  static async assignResidentToHouse(residentId: string, houseId: string): Promise<DbResident> {
    const { data, error } = await supabase
      .from('residents')
      .update({
        house_id: houseId,
        status: 'ACTIVE',
        updated_at: new Date().toISOString(),
      })
      .eq('id', residentId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Remove resident from house
  static async removeResidentFromHouse(residentId: string): Promise<DbResident> {
    const { data, error } = await supabase
      .from('residents')
      .update({
        house_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', residentId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}