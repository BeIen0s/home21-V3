import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export type DbHouse = Database['public']['Tables']['houses']['Row'];
export type CreateHouseData = Database['public']['Tables']['houses']['Insert'];
export type UpdateHouseData = Database['public']['Tables']['houses']['Update'];

export interface HouseWithResidents extends DbHouse {
  residents?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    status: string;
  }>;
  resident_count?: number;
}

export class HousesService {
  // Get all houses with resident information
  static async getHouses(): Promise<HouseWithResidents[]> {
    const { data, error } = await supabase
      .from('houses')
      .select(`
        *,
        residents(id, first_name, last_name, status)
      `)
      .order('number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Add resident count to each house
    const housesWithCount = data?.map(house => ({
      ...house,
      resident_count: house.residents?.filter((r: any) => r.status === 'ACTIVE').length || 0,
    })) || [];

    return housesWithCount;
  }

  // Get house by ID
  static async getHouseById(id: string): Promise<HouseWithResidents | null> {
    const { data, error } = await supabase
      .from('houses')
      .select(`
        *,
        residents(id, first_name, last_name, status)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(error.message);
    }

    return {
      ...data,
      resident_count: data.residents?.filter((r: any) => r.status === 'ACTIVE').length || 0,
    };
  }

  // Get houses by status
  static async getHousesByStatus(status: DbHouse['status']): Promise<HouseWithResidents[]> {
    const { data, error } = await supabase
      .from('houses')
      .select(`
        *,
        residents(id, first_name, last_name, status)
      `)
      .eq('status', status)
      .order('number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const housesWithCount = data?.map(house => ({
      ...house,
      resident_count: house.residents?.filter((r: any) => r.status === 'ACTIVE').length || 0,
    })) || [];

    return housesWithCount;
  }

  // Get available houses (not at max capacity)
  static async getAvailableHouses(): Promise<HouseWithResidents[]> {
    const { data, error } = await supabase
      .from('houses')
      .select(`
        *,
        residents(id, first_name, last_name, status)
      `)
      .eq('status', 'AVAILABLE')
      .order('number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Filter houses that are not at max capacity
    const availableHouses = data?.filter(house => {
      const activeResidents = house.residents?.filter((r: any) => r.status === 'ACTIVE').length || 0;
      return activeResidents < house.max_occupants;
    }).map(house => ({
      ...house,
      resident_count: house.residents?.filter((r: any) => r.status === 'ACTIVE').length || 0,
    })) || [];

    return availableHouses;
  }

  // Create new house
  static async createHouse(houseData: CreateHouseData): Promise<DbHouse> {
    const { data, error } = await supabase
      .from('houses')
      .insert(houseData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Update house
  static async updateHouse(id: string, updates: UpdateHouseData): Promise<DbHouse> {
    const { data, error } = await supabase
      .from('houses')
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

  // Delete house
  static async deleteHouse(id: string): Promise<void> {
    // First check if house has any residents
    const { data: residents, error: checkError } = await supabase
      .from('residents')
      .select('id')
      .eq('house_id', id)
      .eq('status', 'ACTIVE');

    if (checkError) {
      throw new Error(checkError.message);
    }

    if (residents && residents.length > 0) {
      throw new Error('Cannot delete house with active residents');
    }

    const { error } = await supabase
      .from('houses')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // Search houses by number or name
  static async searchHouses(query: string): Promise<HouseWithResidents[]> {
    const { data, error } = await supabase
      .from('houses')
      .select(`
        *,
        residents(id, first_name, last_name, status)
      `)
      .or(`number.ilike.%${query}%,name.ilike.%${query}%`)
      .order('number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const housesWithCount = data?.map(house => ({
      ...house,
      resident_count: house.residents?.filter((r: any) => r.status === 'ACTIVE').length || 0,
    })) || [];

    return housesWithCount;
  }

  // Get house statistics
  static async getHouseStats(): Promise<{
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    reserved: number;
    occupancyRate: number;
    totalCapacity: number;
    totalOccupied: number;
  }> {
    const { data, error } = await supabase
      .from('houses')
      .select(`
        status,
        max_occupants,
        residents(status)
      `);

    if (error) {
      throw new Error(error.message);
    }

    const stats = {
      total: data?.length || 0,
      available: 0,
      occupied: 0,
      maintenance: 0,
      reserved: 0,
      occupancyRate: 0,
      totalCapacity: 0,
      totalOccupied: 0,
    };

    data?.forEach(house => {
      stats.totalCapacity += house.max_occupants;
      
      const activeResidents = house.residents?.filter((r: any) => r.status === 'ACTIVE').length || 0;
      stats.totalOccupied += activeResidents;

      switch (house.status) {
        case 'AVAILABLE':
          stats.available++;
          break;
        case 'OCCUPIED':
          stats.occupied++;
          break;
        case 'MAINTENANCE':
          stats.maintenance++;
          break;
        case 'RESERVED':
          stats.reserved++;
          break;
      }
    });

    stats.occupancyRate = stats.totalCapacity > 0 
      ? Math.round((stats.totalOccupied / stats.totalCapacity) * 100)
      : 0;

    return stats;
  }

  // Update house status based on occupancy
  static async updateHouseStatusByOccupancy(houseId: string): Promise<DbHouse> {
    const house = await this.getHouseById(houseId);
    
    if (!house) {
      throw new Error('House not found');
    }

    let newStatus: DbHouse['status'] = house.status;
    const activeResidents = house.resident_count || 0;

    // Auto-update status based on occupancy
    if (activeResidents === 0 && house.status === 'OCCUPIED') {
      newStatus = 'AVAILABLE';
    } else if (activeResidents > 0 && house.status === 'AVAILABLE') {
      newStatus = 'OCCUPIED';
    }

    if (newStatus !== house.status) {
      return this.updateHouse(houseId, { status: newStatus });
    }

    return house;
  }

  // Get houses by type
  static async getHousesByType(type: DbHouse['type']): Promise<HouseWithResidents[]> {
    const { data, error } = await supabase
      .from('houses')
      .select(`
        *,
        residents(id, first_name, last_name, status)
      `)
      .eq('type', type)
      .order('number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const housesWithCount = data?.map(house => ({
      ...house,
      resident_count: house.residents?.filter((r: any) => r.status === 'ACTIVE').length || 0,
    })) || [];

    return housesWithCount;
  }

  // Get houses by floor
  static async getHousesByFloor(floor: number): Promise<HouseWithResidents[]> {
    const { data, error } = await supabase
      .from('houses')
      .select(`
        *,
        residents(id, first_name, last_name, status)
      `)
      .eq('floor', floor)
      .order('number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const housesWithCount = data?.map(house => ({
      ...house,
      resident_count: house.residents?.filter((r: any) => r.status === 'ACTIVE').length || 0,
    })) || [];

    return housesWithCount;
  }
}