/**
 * Service API pour Pass21 - Version Production
 * 
 * Ce service centralise tous les appels API et gère automatiquement
 * le passage des données mock aux données réelles selon l'environnement.
 * Intégration avec Supabase pour les données en production.
 */

import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { ProductionServices } from './supabaseService';

// Types principaux
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'ENCADRANT' | 'RESIDENT';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  houseId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface House {
  id: string;
  name: string;
  address: string;
  capacity: number;
  currentOccupancy: number;
  status: 'available' | 'occupied' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Configuration de l'environnement
const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const showMockData = process.env.NEXT_PUBLIC_SHOW_MOCK_DATA !== 'false';

// Utilitaires HTTP
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instance du client API
const apiClient = new ApiClient(apiUrl);

// Services spécifiques

/**
 * Service d'authentification
 */
export const AuthService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    if (!isProduction && showMockData) {
      // Mode développement - utiliser les données mock
      return mockLogin(email, password);
    }
    
    // Mode production - utiliser Supabase
    return ProductionServices.Auth.login(email, password);
  },

  async logout(): Promise<void> {
    if (!isProduction && showMockData) {
      localStorage.removeItem('auth_token');
      return;
    }
    
    return ProductionServices.Auth.logout();
  },

  async getCurrentUser(): Promise<User | null> {
    if (!isProduction && showMockData) {
      return mockGetCurrentUser();
    }
    
    return ProductionServices.Auth.getCurrentUser();
  },
};

/**
 * Service utilisateurs
 */
export const UserService = {
  async getAll(): Promise<User[]> {
    if (!isProduction && showMockData) {
      return mockGetUsers();
    }
    
    return apiClient.get<User[]>('/users');
  },

  async getById(id: string): Promise<User> {
    if (!isProduction && showMockData) {
      return mockGetUserById(id);
    }
    
    return apiClient.get<User>(`/users/${id}`);
  },

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    if (!isProduction && showMockData) {
      return mockCreateUser(userData);
    }
    
    return apiClient.post<User>('/users', userData);
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    if (!isProduction && showMockData) {
      return mockUpdateUser(id, userData);
    }
    
    return apiClient.put<User>(`/users/${id}`, userData);
  },

  async delete(id: string): Promise<void> {
    if (!isProduction && showMockData) {
      return mockDeleteUser(id);
    }
    
    return apiClient.delete<void>(`/users/${id}`);
  },
};

/**
 * Service résidents
 */
export const ResidentService = {
  async getAll(): Promise<Resident[]> {
    if (!isProduction && showMockData) {
      return mockGetResidents();
    }
    
    return apiClient.get<Resident[]>('/residents');
  },

  async getById(id: string): Promise<Resident> {
    if (!isProduction && showMockData) {
      return mockGetResidentById(id);
    }
    
    return apiClient.get<Resident>(`/residents/${id}`);
  },

  async create(residentData: Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resident> {
    if (!isProduction && showMockData) {
      return mockCreateResident(residentData);
    }
    
    return apiClient.post<Resident>('/residents', residentData);
  },

  async update(id: string, residentData: Partial<Resident>): Promise<Resident> {
    if (!isProduction && showMockData) {
      return mockUpdateResident(id, residentData);
    }
    
    return apiClient.put<Resident>(`/residents/${id}`, residentData);
  },

  async delete(id: string): Promise<void> {
    if (!isProduction && showMockData) {
      return mockDeleteResident(id);
    }
    
    return apiClient.delete<void>(`/residents/${id}`);
  },
};

/**
 * Service logements
 */
export const HouseService = {
  async getAll(): Promise<House[]> {
    if (!isProduction && showMockData) {
      return mockGetHouses();
    }
    
    return apiClient.get<House[]>('/houses');
  },

  async getById(id: string): Promise<House> {
    if (!isProduction && showMockData) {
      return mockGetHouseById(id);
    }
    
    return apiClient.get<House>(`/houses/${id}`);
  },

  async create(houseData: Omit<House, 'id' | 'createdAt' | 'updatedAt'>): Promise<House> {
    if (!isProduction && showMockData) {
      return mockCreateHouse(houseData);
    }
    
    return apiClient.post<House>('/houses', houseData);
  },

  async update(id: string, houseData: Partial<House>): Promise<House> {
    if (!isProduction && showMockData) {
      return mockUpdateHouse(id, houseData);
    }
    
    return apiClient.put<House>(`/houses/${id}`, houseData);
  },

  async delete(id: string): Promise<void> {
    if (!isProduction && showMockData) {
      return mockDeleteHouse(id);
    }
    
    return apiClient.delete<void>(`/houses/${id}`);
  },
};

/**
 * Service tâches
 */
export const TaskService = {
  async getAll(): Promise<Task[]> {
    if (!isProduction && showMockData) {
      return mockGetTasks();
    }
    
    return apiClient.get<Task[]>('/tasks');
  },

  async getById(id: string): Promise<Task> {
    if (!isProduction && showMockData) {
      return mockGetTaskById(id);
    }
    
    return apiClient.get<Task>(`/tasks/${id}`);
  },

  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    if (!isProduction && showMockData) {
      return mockCreateTask(taskData);
    }
    
    return apiClient.post<Task>('/tasks', taskData);
  },

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    if (!isProduction && showMockData) {
      return mockUpdateTask(id, taskData);
    }
    
    return apiClient.put<Task>(`/tasks/${id}`, taskData);
  },

  async delete(id: string): Promise<void> {
    if (!isProduction && showMockData) {
      return mockDeleteTask(id);
    }
    
    return apiClient.delete<void>(`/tasks/${id}`);
  },
};

// Fonctions mock pour le développement (importées des fichiers existants)
// Ces fonctions seront automatiquement désactivées en production

async function mockLogin(email: string, password: string) {
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Utilisateurs de test
  const mockUsers: User[] = [
    { id: '1', email: 'sylvain@pass21.fr', name: 'Sylvain Pater', role: 'SUPER_ADMIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', email: 'admin@pass21.fr', name: 'Admin Pass21', role: 'ADMIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '3', email: 'encadrant@pass21.fr', name: 'Marie Encadrant', role: 'ENCADRANT', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '4', email: 'marie@pass21.fr', name: 'Marie Dupont', role: 'RESIDENT', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ];

  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const token = `mock_token_${user.id}`;
  return { user, token };
}

async function mockGetCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  // Extraire l'ID du token mock
  const userId = token.replace('mock_token_', '');
  const mockUsers: User[] = [
    { id: '1', email: 'sylvain@pass21.fr', name: 'Sylvain Pater', role: 'SUPER_ADMIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', email: 'admin@pass21.fr', name: 'Admin Pass21', role: 'ADMIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '3', email: 'encadrant@pass21.fr', name: 'Marie Encadrant', role: 'ENCADRANT', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '4', email: 'marie@pass21.fr', name: 'Marie Dupont', role: 'RESIDENT', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ];

  return mockUsers.find(u => u.id === userId) || null;
}

// Mock functions simplifiées (vous pouvez les enrichir selon vos besoins)
async function mockGetUsers(): Promise<User[]> { return []; }
async function mockGetUserById(id: string): Promise<User> { throw new Error('Mock: User not found'); }
async function mockCreateUser(data: any): Promise<User> { return { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; }
async function mockUpdateUser(id: string, data: any): Promise<User> { return { ...data, id, updatedAt: new Date().toISOString() }; }
async function mockDeleteUser(id: string): Promise<void> { }

async function mockGetResidents(): Promise<Resident[]> { return []; }
async function mockGetResidentById(id: string): Promise<Resident> { throw new Error('Mock: Resident not found'); }
async function mockCreateResident(data: any): Promise<Resident> { return { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; }
async function mockUpdateResident(id: string, data: any): Promise<Resident> { return { ...data, id, updatedAt: new Date().toISOString() }; }
async function mockDeleteResident(id: string): Promise<void> { }

async function mockGetHouses(): Promise<House[]> { return []; }
async function mockGetHouseById(id: string): Promise<House> { throw new Error('Mock: House not found'); }
async function mockCreateHouse(data: any): Promise<House> { return { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; }
async function mockUpdateHouse(id: string, data: any): Promise<House> { return { ...data, id, updatedAt: new Date().toISOString() }; }
async function mockDeleteHouse(id: string): Promise<void> { }

async function mockGetTasks(): Promise<Task[]> { return []; }
async function mockGetTaskById(id: string): Promise<Task> { throw new Error('Mock: Task not found'); }
async function mockCreateTask(data: any): Promise<Task> { return { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; }
async function mockUpdateTask(id: string, data: any): Promise<Task> { return { ...data, id, updatedAt: new Date().toISOString() }; }
async function mockDeleteTask(id: string): Promise<void> { }

export default {
  Auth: AuthService,
  User: UserService,
  Resident: ResidentService,
  House: HouseService,
  Task: TaskService,
};