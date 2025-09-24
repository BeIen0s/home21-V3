import { useState, useEffect } from 'react';
import { ResidentsService, type ResidentWithHouse, type CreateResidentData, type UpdateResidentData } from '@/services/residents.service';

export const useResidents = () => {
  const [residents, setResidents] = useState<ResidentWithHouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all residents
  const loadResidents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ResidentsService.getResidents();
      setResidents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load residents');
    } finally {
      setIsLoading(false);
    }
  };

  // Load residents on mount
  useEffect(() => {
    loadResidents();
  }, []);

  // Create resident
  const createResident = async (residentData: CreateResidentData) => {
    try {
      setError(null);
      const newResident = await ResidentsService.createResident(residentData);
      // Reload residents to get updated data with house information
      await loadResidents();
      return newResident;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create resident';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update resident
  const updateResident = async (id: string, updates: UpdateResidentData) => {
    try {
      setError(null);
      const updatedResident = await ResidentsService.updateResident(id, updates);
      // Update local state
      setResidents(prev => 
        prev.map(resident => 
          resident.id === id 
            ? { ...resident, ...updatedResident } 
            : resident
        )
      );
      return updatedResident;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update resident';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete resident
  const deleteResident = async (id: string) => {
    try {
      setError(null);
      await ResidentsService.deleteResident(id);
      // Remove from local state
      setResidents(prev => prev.filter(resident => resident.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete resident';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Search residents
  const searchResidents = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ResidentsService.searchResidents(query);
      setResidents(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search residents');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get residents by status
  const getResidentsByStatus = async (status: 'ACTIVE' | 'WAITING_LIST' | 'TEMPORARY_LEAVE' | 'MOVED_OUT' | 'DECEASED') => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ResidentsService.getResidentsByStatus(status);
      setResidents(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter residents');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Assign resident to house
  const assignToHouse = async (residentId: string, houseId: string) => {
    try {
      setError(null);
      const updatedResident = await ResidentsService.assignResidentToHouse(residentId, houseId);
      // Reload residents to get updated house information
      await loadResidents();
      return updatedResident;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign resident to house';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Remove resident from house
  const removeFromHouse = async (residentId: string) => {
    try {
      setError(null);
      const updatedResident = await ResidentsService.removeResidentFromHouse(residentId);
      // Reload residents to get updated house information
      await loadResidents();
      return updatedResident;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove resident from house';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    residents,
    isLoading,
    error,
    loadResidents,
    createResident,
    updateResident,
    deleteResident,
    searchResidents,
    getResidentsByStatus,
    assignToHouse,
    removeFromHouse,
  };
};

// Hook for single resident
export const useResident = (id: string | null) => {
  const [resident, setResident] = useState<ResidentWithHouse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setResident(null);
      return;
    }

    const loadResident = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await ResidentsService.getResidentById(id);
        setResident(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resident');
      } finally {
        setIsLoading(false);
      }
    };

    loadResident();
  }, [id]);

  return {
    resident,
    isLoading,
    error,
  };
};

// Hook for resident statistics
export const useResidentStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    waitingList: 0,
    temporaryLeave: 0,
    movedOut: 0,
    deceased: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ResidentsService.getResidentStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resident statistics');
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