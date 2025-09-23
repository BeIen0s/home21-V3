// Service de stockage local pour persister les données
// En production, ceci serait remplacé par des appels API

import { ExtendedUser } from '@/types';

const STORAGE_KEYS = {
  users: 'home21_users',
  residents: 'home21_residents',
} as const;

export class StorageService {
  // Utilisateurs
  static getUsers(): ExtendedUser[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.users);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading users from storage:', error);
      return [];
    }
  }

  static saveUsers(users: ExtendedUser[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  static addUser(user: ExtendedUser): void {
    const users = this.getUsers();
    const updatedUsers = [...users, user];
    this.saveUsers(updatedUsers);
  }

  static updateUser(userId: string, userData: Partial<ExtendedUser>): void {
    const users = this.getUsers();
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, ...userData, updatedAt: new Date() } : u
    );
    this.saveUsers(updatedUsers);
  }

  static deleteUser(userId: string): void {
    const users = this.getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    this.saveUsers(updatedUsers);
  }

  // Résidents
  static getResidents(): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.residents);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading residents from storage:', error);
      return [];
    }
  }

  static saveResidents(residents: any[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.residents, JSON.stringify(residents));
    } catch (error) {
      console.error('Error saving residents to storage:', error);
    }
  }

  static addResident(resident: any): void {
    const residents = this.getResidents();
    const newResident = {
      ...resident,
      id: `resident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedResidents = [...residents, newResident];
    this.saveResidents(updatedResidents);
  }

  static updateResident(residentId: string, residentData: any): void {
    const residents = this.getResidents();
    const updatedResidents = residents.map(r => 
      r.id === residentId ? { ...r, ...residentData, updatedAt: new Date() } : r
    );
    this.saveResidents(updatedResidents);
  }

  static deleteResident(residentId: string): void {
    const residents = this.getResidents();
    const updatedResidents = residents.filter(r => r.id !== residentId);
    this.saveResidents(updatedResidents);
  }

  // Initialiser les données par défaut (si pas encore présentes)
  static initializeDefaultData(): void {
    if (typeof window === 'undefined') return;
    
    // Initialiser les utilisateurs par défaut si aucun utilisateur n'existe
    if (this.getUsers().length === 0) {
      // Charger les données mock par défaut
      import('@/data/mockUserManagement').then(({ mockExtendedUsers }) => {
        this.saveUsers(mockExtendedUsers);
      });
    }
  }
}