import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to check if we're in development
export const isDevelopment = process.env.NODE_ENV === 'development';

// Types for our database tables
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'SUPER_ADMIN' | 'ADMIN' | 'RESIDENT' | 'ENCADRANT';
          avatar?: string;
          phone?: string;
          address?: string;
          birth_date?: string;
          bio?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: 'SUPER_ADMIN' | 'ADMIN' | 'RESIDENT' | 'ENCADRANT';
          avatar?: string;
          phone?: string;
          address?: string;
          birth_date?: string;
          bio?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'SUPER_ADMIN' | 'ADMIN' | 'RESIDENT' | 'ENCADRANT';
          avatar?: string;
          phone?: string;
          address?: string;
          birth_date?: string;
          bio?: string;
          updated_at?: string;
        };
      };
      residents: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: 'MALE' | 'FEMALE' | 'OTHER';
          phone?: string;
          email?: string;
          address?: string;
          emergency_contact: any; // JSON
          medical_info?: any; // JSON
          preferences?: any; // JSON
          status: 'ACTIVE' | 'WAITING_LIST' | 'TEMPORARY_LEAVE' | 'MOVED_OUT' | 'DECEASED';
          house_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: 'MALE' | 'FEMALE' | 'OTHER';
          phone?: string;
          email?: string;
          address?: string;
          emergency_contact: any;
          medical_info?: any;
          preferences?: any;
          status?: 'ACTIVE' | 'WAITING_LIST' | 'TEMPORARY_LEAVE' | 'MOVED_OUT' | 'DECEASED';
          house_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          date_of_birth?: string;
          gender?: 'MALE' | 'FEMALE' | 'OTHER';
          phone?: string;
          email?: string;
          address?: string;
          emergency_contact?: any;
          medical_info?: any;
          preferences?: any;
          status?: 'ACTIVE' | 'WAITING_LIST' | 'TEMPORARY_LEAVE' | 'MOVED_OUT' | 'DECEASED';
          house_id?: string;
          updated_at?: string;
        };
      };
      houses: {
        Row: {
          id: string;
          number: string;
          name?: string;
          type: 'STUDIO' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
          floor?: number;
          section?: string;
          size: number;
          rooms: number;
          bathrooms: number;
          has_balcony: boolean;
          has_garden: boolean;
          is_accessible: boolean;
          max_occupants: number;
          monthly_rate?: number;
          status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
          description?: string;
          amenities?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          name?: string;
          type: 'STUDIO' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
          floor?: number;
          section?: string;
          size: number;
          rooms: number;
          bathrooms: number;
          has_balcony: boolean;
          has_garden: boolean;
          is_accessible: boolean;
          max_occupants: number;
          monthly_rate?: number;
          status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
          description?: string;
          amenities?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          number?: string;
          name?: string;
          type?: 'STUDIO' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
          floor?: number;
          section?: string;
          size?: number;
          rooms?: number;
          bathrooms?: number;
          has_balcony?: boolean;
          has_garden?: boolean;
          is_accessible?: boolean;
          max_occupants?: number;
          monthly_rate?: number;
          status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
          description?: string;
          amenities?: string[];
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description?: string;
          category: string;
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
          status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'AWAITING_VALIDATION' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
          type: 'ROUTINE' | 'MAINTENANCE' | 'REQUEST' | 'EMERGENCY' | 'INSPECTION' | 'EVENT';
          assigned_to?: string;
          resident_id?: string;
          house_id?: string;
          scheduled_start?: string;
          scheduled_end?: string;
          actual_start?: string;
          actual_end?: string;
          estimated_duration?: number;
          instructions?: string;
          is_recurring: boolean;
          recurrence_pattern?: any; // JSON
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          category: string;
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
          status?: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'AWAITING_VALIDATION' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
          type: 'ROUTINE' | 'MAINTENANCE' | 'REQUEST' | 'EMERGENCY' | 'INSPECTION' | 'EVENT';
          assigned_to?: string;
          resident_id?: string;
          house_id?: string;
          scheduled_start?: string;
          scheduled_end?: string;
          actual_start?: string;
          actual_end?: string;
          estimated_duration?: number;
          instructions?: string;
          is_recurring?: boolean;
          recurrence_pattern?: any;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
          status?: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'AWAITING_VALIDATION' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
          type?: 'ROUTINE' | 'MAINTENANCE' | 'REQUEST' | 'EMERGENCY' | 'INSPECTION' | 'EVENT';
          assigned_to?: string;
          resident_id?: string;
          house_id?: string;
          scheduled_start?: string;
          scheduled_end?: string;
          actual_start?: string;
          actual_end?: string;
          estimated_duration?: number;
          instructions?: string;
          is_recurring?: boolean;
          recurrence_pattern?: any;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};