import { useState, useEffect } from 'react';
import { HousesService, type HouseWithResidents, type CreateHouseData, type UpdateHouseData } from '@/services/houses.service';

export const useHouses = () => {
  const [houses, setHouses] = useState<HouseWithResidents[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all houses
  const loadHouses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await HousesService.getHouses();
      setHouses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load houses');
    } finally {
      setIsLoading(false);
    }
  };

  // Load houses on mount
  useEffect(() => {
    loadHouses();
  }, []);

  // Create house
  const createHouse = async (houseData: CreateHouseData) => {
    try {
      setError(null);
      const newHouse = await HousesService.createHouse(houseData);
      // Reload houses to get updated data with resident information
      await loadHouses();
      return newHouse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create house';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update house
  const updateHouse = async (id: string, updates: UpdateHouseData) => {
    try {
      setError(null);
      const updatedHouse = await HousesService.updateHouse(id, updates);
      // Update local state
      setHouses(prev => 
        prev.map(house => 
          house.id === id 
            ? { ...house, ...updatedHouse } 
            : house
        )
      );
      return updatedHouse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update house';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete house
  const deleteHouse = async (id: string) => {
    try {
      setError(null);
      await HousesService.deleteHouse(id);
      // Remove from local state
      setHouses(prev => prev.filter(house => house.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete house';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Search houses
  const searchHouses = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await HousesService.searchHouses(query);
      setHouses(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search houses');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get houses by status
  const getHousesByStatus = async (status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED') => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await HousesService.getHousesByStatus(status);
      setHouses(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter houses');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get available houses
  const getAvailableHouses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await HousesService.getAvailableHouses();
      setHouses(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load available houses');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get houses by type
  const getHousesByType = async (type: 'STUDIO' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5') => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await HousesService.getHousesByType(type);
      setHouses(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter houses by type');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get houses by floor
  const getHousesByFloor = async (floor: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await HousesService.getHousesByFloor(floor);
      setHouses(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter houses by floor');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    houses,
    isLoading,
    error,
    loadHouses,
    createHouse,
    updateHouse,
    deleteHouse,
    searchHouses,
    getHousesByStatus,
    getAvailableHouses,
    getHousesByType,
    getHousesByFloor,
  };
};

// Hook for single house
export const useHouse = (id: string | null) => {
  const [house, setHouse] = useState<HouseWithResidents | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setHouse(null);
      return;
    }

    const loadHouse = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await HousesService.getHouseById(id);
        setHouse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load house');
      } finally {
        setIsLoading(false);
      }
    };

    loadHouse();
  }, [id]);

  return {
    house,
    isLoading,
    error,
  };
};

// Hook for house statistics
export const useHouseStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
    reserved: 0,
    occupancyRate: 0,
    totalCapacity: 0,
    totalOccupied: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await HousesService.getHouseStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load house statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refreshStats: loadStats,
  };
};