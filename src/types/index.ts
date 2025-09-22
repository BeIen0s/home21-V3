// =============================================================================
// PASS21 RESIDENCE MANAGEMENT SYSTEM - TYPE DEFINITIONS
// =============================================================================

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  NURSE = 'NURSE',
  CAREGIVER = 'CAREGIVER',
  RESIDENT = 'RESIDENT',
  FAMILY = 'FAMILY',
  VISITOR = 'VISITOR',
  CONTRACTOR = 'CONTRACTOR',
  VOLUNTEER = 'VOLUNTEER',
}

// Resident Types
export interface Resident {
  id: string;
  userId: string; // Link to User account
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  emergencyContact: EmergencyContact;
  medicalInfo?: MedicalInfo;
  preferences?: ResidentPreferences;
  houseId?: string; // Current house assignment
  moveInDate?: Date;
  moveOutDate?: Date;
  status: ResidentStatus;
  documents: Document[];
  avatar?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum ResidentStatus {
  ACTIVE = 'ACTIVE',
  WAITING_LIST = 'WAITING_LIST',
  TEMPORARY_LEAVE = 'TEMPORARY_LEAVE',
  MOVED_OUT = 'MOVED_OUT',
  DECEASED = 'DECEASED',
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface MedicalInfo {
  allergies?: string[];
  medications?: Medication[];
  medicalConditions?: string[];
  doctor?: string;
  doctorPhone?: string;
  specialNeeds?: string;
  dietaryRestrictions?: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
}

export interface ResidentPreferences {
  mealPreferences?: string[];
  activityInterests?: string[];
  communicationPreference: 'EMAIL' | 'PHONE' | 'SMS' | 'IN_PERSON';
  languagePreference?: string;
  roomTemperaturePreference?: number;
}

// House & Accommodation Types
export interface House {
  id: string;
  number: string;
  name?: string;
  type: HouseType;
  floor?: number;
  section?: string; // A, B, C sections of building
  size: number; // Square meters
  rooms: number;
  bathrooms: number;
  hasBalcony: boolean;
  hasGarden: boolean;
  isAccessible: boolean; // PMR accessible
  maxOccupants: number;
  currentOccupants: number;
  status: HouseStatus;
  amenities: string[];
  monthlyRate?: number;
  description?: string;
  images?: string[];
  equipment: Equipment[];
  maintenanceHistory: MaintenanceRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export enum HouseType {
  STUDIO = 'STUDIO',
  ONE_BEDROOM = 'ONE_BEDROOM',
  TWO_BEDROOM = 'TWO_BEDROOM',
  HOUSE_WITH_GARDEN = 'HOUSE_WITH_GARDEN',
  ACCESSIBLE_UNIT = 'ACCESSIBLE_UNIT',
}

export enum HouseStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  status: EquipmentStatus;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
}

export enum EquipmentCategory {
  FURNITURE = 'FURNITURE',
  APPLIANCE = 'APPLIANCE',
  ELECTRONICS = 'ELECTRONICS',
  MEDICAL = 'MEDICAL',
  SAFETY = 'SAFETY',
  OTHER = 'OTHER',
}

export enum EquipmentStatus {
  WORKING = 'WORKING',
  NEEDS_REPAIR = 'NEEDS_REPAIR',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
  REPLACED = 'REPLACED',
}

// Service & Task Types
export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  type: ServiceType;
  provider?: string; // Internal staff or external company
  isActive: boolean;
  isAvailableToResidents: boolean; // Can residents request this service?
  estimatedDuration?: number; // in minutes
  cost?: number;
  instructions?: string;
  requirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ServiceCategory {
  HOUSEKEEPING = 'HOUSEKEEPING',
  MAINTENANCE = 'MAINTENANCE',
  HEALTHCARE = 'HEALTHCARE',
  FOOD_SERVICE = 'FOOD_SERVICE',
  TRANSPORT = 'TRANSPORT',
  ACTIVITIES = 'ACTIVITIES',
  SECURITY = 'SECURITY',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  OTHER = 'OTHER',
}

export enum ServiceType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  AUTOMATED = 'AUTOMATED',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  serviceId?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  assignedTo?: string; // User ID
  assignedBy: string; // User ID
  residentId?: string; // If task is for specific resident
  houseId?: string; // If task is for specific house
  scheduledStart?: Date;
  scheduledEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  instructions?: string;
  notes?: string;
  completionNotes?: string;
  photos?: string[];
  tags?: string[];
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskCategory {
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE',
  HEALTHCARE = 'HEALTHCARE',
  FOOD_SERVICE = 'FOOD_SERVICE',
  ADMINISTRATION = 'ADMINISTRATION',
  SECURITY = 'SECURITY',
  ACTIVITIES = 'ACTIVITIES',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  AWAITING_VALIDATION = 'AWAITING_VALIDATION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

export enum TaskType {
  ROUTINE = 'ROUTINE',
  MAINTENANCE = 'MAINTENANCE',
  REQUEST = 'REQUEST',
  EMERGENCY = 'EMERGENCY',
  INSPECTION = 'INSPECTION',
  EVENT = 'EVENT',
}

export interface RecurrencePattern {
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number; // Every X days/weeks/months
  daysOfWeek?: number[]; // For weekly: [0=Sunday, 1=Monday, ...]
  dayOfMonth?: number; // For monthly
  endDate?: Date;
  maxOccurrences?: number;
}

// Maintenance Types
export interface MaintenanceRecord {
  id: string;
  houseId: string;
  taskId?: string;
  type: MaintenanceType;
  description: string;
  performedBy: string; // User ID or external company
  cost?: number;
  warranty?: number; // months
  parts?: MaintenancePart[];
  photos?: string[];
  nextMaintenanceDate?: Date;
  performedAt: Date;
  createdAt: Date;
}

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  EMERGENCY = 'EMERGENCY',
  INSPECTION = 'INSPECTION',
  UPGRADE = 'UPGRADE',
}

export interface MaintenancePart {
  name: string;
  quantity: number;
  cost?: number;
  supplier?: string;
  partNumber?: string;
}

// Communication & Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  isRead: boolean;
  actionUrl?: string;
  data?: Record<string, any>; // Additional structured data
  expiresAt?: Date;
  createdAt: Date;
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  REMINDER = 'REMINDER',
}

export enum NotificationCategory {
  TASK = 'TASK',
  MAINTENANCE = 'MAINTENANCE',
  RESIDENT = 'RESIDENT',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

export interface Message {
  id: string;
  senderId: string;
  recipientId?: string; // Individual message
  groupId?: string; // Group message
  subject?: string;
  content: string;
  type: MessageType;
  isRead: boolean;
  attachments?: Attachment[];
  replyToId?: string; // For threaded conversations
  createdAt: Date;
}

export enum MessageType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  SYSTEM = 'SYSTEM',
}

// Document & Media Types
export interface Document {
  id: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  category: DocumentCategory;
  ownerId: string; // User or Resident ID
  ownerType: 'USER' | 'RESIDENT';
  isPrivate: boolean;
  description?: string;
  tags?: string[];
  expiresAt?: Date;
  uploadedBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export enum DocumentCategory {
  IDENTITY = 'IDENTITY',
  MEDICAL = 'MEDICAL',
  CONTRACT = 'CONTRACT',
  INSURANCE = 'INSURANCE',
  PHOTO = 'PHOTO',
  REPORT = 'REPORT',
  INVOICE = 'INVOICE',
  OTHER = 'OTHER',
}

export interface Attachment {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

// Activity & History Types
export interface Activity {
  id: string;
  userId: string;
  entityType: EntityType;
  entityId: string;
  action: ActivityAction;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export enum EntityType {
  USER = 'USER',
  RESIDENT = 'RESIDENT',
  HOUSE = 'HOUSE',
  TASK = 'TASK',
  SERVICE = 'SERVICE',
  DOCUMENT = 'DOCUMENT',
  NOTIFICATION = 'NOTIFICATION',
}

export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  ASSIGN = 'ASSIGN',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard & Analytics Types
export interface DashboardStats {
  residents: {
    total: number;
    active: number;
    newThisMonth: number;
    waitingList: number;
  };
  houses: {
    total: number;
    occupied: number;
    available: number;
    maintenance: number;
    occupancyRate: number;
  };
  tasks: {
    pending: number;
    inProgress: number;
    completedToday: number;
    overdue: number;
    completionRate: number;
  };
  services: {
    activeRequests: number;
    completedToday: number;
    averageResponseTime: number; // in minutes
  };
}

// Form & Component Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface ResidentForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone?: string;
  emergencyContact: EmergencyContact;
  medicalInfo?: Partial<MedicalInfo>;
  preferences?: Partial<ResidentPreferences>;
}

export interface HouseForm {
  number: string;
  name?: string;
  type: HouseType;
  floor?: number;
  section?: string;
  size: number;
  rooms: number;
  bathrooms: number;
  hasBalcony: boolean;
  hasGarden: boolean;
  isAccessible: boolean;
  maxOccupants: number;
  monthlyRate?: number;
  description?: string;
  amenities: string[];
}

export interface TaskForm {
  title: string;
  description?: string;
  serviceId?: string;
  category: TaskCategory;
  priority: TaskPriority;
  assignedTo?: string;
  residentId?: string;
  houseId?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  estimatedDuration?: number;
  instructions?: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
}

// Navigation & UI Types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  external?: boolean;
  roles?: UserRole[]; // Which roles can see this item
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Error & Utility Types
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
}

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface SearchFilters {
  query?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
  [key: string]: any;
}

// =============================================================================
// PERMISSION & ROLE MANAGEMENT SYSTEM
// =============================================================================

// Permission System
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: ResourceType;
  action: ActionType;
  scope?: PermissionScope;
  conditions?: Record<string, any>;
}

export enum ResourceType {
  // Core Resources
  USER = 'USER',
  RESIDENT = 'RESIDENT',
  HOUSE = 'HOUSE',
  TASK = 'TASK',
  SERVICE = 'SERVICE',
  MESSAGE = 'MESSAGE',
  DOCUMENT = 'DOCUMENT',
  NOTIFICATION = 'NOTIFICATION',
  
  // Administrative
  DASHBOARD = 'DASHBOARD',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  AUDIT = 'AUDIT',
  
  // Medical & Care
  MEDICAL_INFO = 'MEDICAL_INFO',
  CARE_PLAN = 'CARE_PLAN',
  
  // Financial
  BILLING = 'BILLING',
  PAYMENT = 'PAYMENT',
  
  // System
  SYSTEM = 'SYSTEM',
  BACKUP = 'BACKUP',
}

export enum ActionType {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ASSIGN = 'ASSIGN',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  ARCHIVE = 'ARCHIVE',
  RESTORE = 'RESTORE',
  MANAGE = 'MANAGE',
}

export enum PermissionScope {
  ALL = 'ALL',           // All records
  OWN = 'OWN',          // Only own records
  ASSIGNED = 'ASSIGNED', // Only assigned records
  DEPARTMENT = 'DEPARTMENT', // Same department
  FLOOR = 'FLOOR',      // Same floor residents
}

// Role System
export interface Role {
  id: string;
  name: string;
  description: string;
  level: number; // Hierarchy level (higher = more permissions)
  permissions: Permission[];
  isSystemRole: boolean; // Cannot be deleted
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Extended User with Permissions
export interface ExtendedUser extends User {
  roles: Role[];
  permissions: Permission[]; // Direct permissions (in addition to role permissions)
  department?: string;
  position?: string;
  supervisor?: string; // User ID of supervisor
  managedUsers?: string[]; // User IDs of managed users
  accessLevel: AccessLevel;
  canAccessAfterHours: boolean;
  maxSessionDuration?: number; // in minutes
  mustChangePassword?: boolean;
  twoFactorEnabled: boolean;
  lastPasswordChange?: Date;
  failedLoginAttempts: number;
  accountLockedUntil?: Date;
}

export enum AccessLevel {
  BASIC = 'BASIC',
  ELEVATED = 'ELEVATED',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// User Management Forms
export interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  roles?: string[]; // Role IDs
  department?: string;
  position?: string;
  supervisor?: string;
  accessLevel: AccessLevel;
  canAccessAfterHours: boolean;
  maxSessionDuration?: number;
  twoFactorEnabled: boolean;
  permissions?: string[]; // Direct permission IDs
}

export interface RoleForm {
  name: string;
  description: string;
  level: number;
  permissions: string[]; // Permission IDs
  isActive: boolean;
}

// Permission Groups for UI organization
export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  icon?: string;
  color?: string;
}

// Audit & Activity Tracking for User Management
export interface UserAuditLog {
  id: string;
  userId: string;
  actionBy: string; // Admin who performed the action
  action: UserAuditAction;
  resource: string;
  resourceId: string;
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export enum UserAuditAction {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_ACTIVATED = 'USER_ACTIVATED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',
  ROLE_ASSIGNED = 'ROLE_ASSIGNED',
  ROLE_REMOVED = 'ROLE_REMOVED',
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
}

// System Configuration for User Management
export interface UserManagementConfig {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    preventReuse: number; // Number of previous passwords to prevent reuse
    maxAge: number; // Days before password expires
  };
  sessionPolicy: {
    maxDuration: number; // Default max session duration in minutes
    idleTimeout: number; // Minutes of inactivity before logout
    maxConcurrentSessions: number;
  };
  accountPolicy: {
    maxFailedAttempts: number;
    lockoutDuration: number; // Minutes
    requireEmailVerification: boolean;
    require2FA: UserRole[]; // Roles that require 2FA
  };
}
