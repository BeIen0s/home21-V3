import { useState, useEffect } from 'react';
import { TasksService, type TaskWithDetails, type CreateTaskData, type UpdateTaskData } from '@/services/tasks.service';

export const useTasks = (filters?: {
  status?: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'AWAITING_VALIDATION' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  assigned_to?: string;
  category?: string;
  type?: 'ROUTINE' | 'MAINTENANCE' | 'REQUEST' | 'EMERGENCY' | 'INSPECTION' | 'EVENT';
}) => {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all tasks
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await TasksService.getTasks(filters);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Load tasks on mount and when filters change
  useEffect(() => {
    loadTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  // Create task
  const createTask = async (taskData: CreateTaskData) => {
    try {
      setError(null);
      const newTask = await TasksService.createTask(taskData);
      // Reload tasks to get updated data with related information
      await loadTasks();
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update task
  const updateTask = async (id: string, updates: UpdateTaskData) => {
    try {
      setError(null);
      const updatedTask = await TasksService.updateTask(id, updates);
      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? { ...task, ...updatedTask } 
            : task
        )
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      setError(null);
      await TasksService.deleteTask(id);
      // Remove from local state
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Assign task to user
  const assignTask = async (taskId: string, userId: string) => {
    try {
      setError(null);
      const updatedTask = await TasksService.assignTask(taskId, userId);
      // Reload tasks to get updated assignment information
      await loadTasks();
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Start task
  const startTask = async (taskId: string) => {
    try {
      setError(null);
      const updatedTask = await TasksService.startTask(taskId);
      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, ...updatedTask } 
            : task
        )
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Complete task
  const completeTask = async (taskId: string) => {
    try {
      setError(null);
      const updatedTask = await TasksService.completeTask(taskId);
      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, ...updatedTask } 
            : task
        )
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Search tasks
  const searchTasks = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await TasksService.searchTasks(query);
      setTasks(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search tasks');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tasks,
    isLoading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    startTask,
    completeTask,
    searchTasks,
  };
};

// Hook for single task
export const useTask = (id: string | null) => {
  const [task, setTask] = useState<TaskWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setTask(null);
      return;
    }

    const loadTask = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await TasksService.getTaskById(id);
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [id]);

  return {
    task,
    isLoading,
    error,
  };
};

// Hook for user's assigned tasks
export const useUserTasks = (userId: string | null) => {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }

    const loadUserTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await TasksService.getTasksByAssignee(userId);
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user tasks');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserTasks();
  }, [userId]);

  return {
    tasks,
    isLoading,
    error,
  };
};

// Hook for upcoming tasks
export const useUpcomingTasks = () => {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUpcomingTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await TasksService.getUpcomingTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load upcoming tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUpcomingTasks();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadUpcomingTasks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    tasks,
    isLoading,
    error,
    refreshTasks: loadUpcomingTasks,
  };
};

// Hook for overdue tasks
export const useOverdueTasks = () => {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOverdueTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await TasksService.getOverdueTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load overdue tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOverdueTasks();
    
    // Refresh every 10 minutes
    const interval = setInterval(loadOverdueTasks, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    tasks,
    isLoading,
    error,
    refreshTasks: loadOverdueTasks,
  };
};

// Hook for task statistics
export const useTaskStats = () => {
  const [stats, setStats] = useState({
    total: 0,
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await TasksService.getTaskStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task statistics');
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