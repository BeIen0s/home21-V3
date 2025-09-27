import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  ClipboardList, 
  User, 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  Pause,
  Filter,
  SortAsc,
  Eye,
  Edit,
  Play
} from 'lucide-react';
import type { TableColumn } from '@/types';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { Resource } from '@/utils/permissions';

// Task types
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS', 
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskCategory {
  MAINTENANCE = 'MAINTENANCE',
  CLEANING = 'CLEANING',
  MEDICAL = 'MEDICAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  RESIDENT_CARE = 'RESIDENT_CARE',
  SECURITY = 'SECURITY',
  CATERING = 'CATERING',
  OTHER = 'OTHER'
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  residentId?: string;
  residentName?: string;
  houseId?: string;
  houseName?: string;
  dueDate?: Date;
  estimatedDuration?: number; // minutes
  actualDuration?: number; // minutes
  tags: string[];
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Mock data pour les tâches
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Réparation robinet cuisine',
    description: 'Le robinet de la cuisine de Mme Dupont fuit depuis hier. Nécessite intervention plomberie.',
    category: TaskCategory.MAINTENANCE,
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    assignedTo: {
      id: 'staff-1',
      name: 'Jean Plombier'
    },
    residentId: '1',
    residentName: 'Marie Dupont',
    houseId: '1A',
    houseName: 'Maison 1A',
    dueDate: new Date('2023-12-25'),
    estimatedDuration: 60,
    tags: ['plomberie', 'urgent'],
    createdBy: {
      id: 'admin-1',
      name: 'Admin Pass21'
    },
    createdAt: new Date('2023-12-23'),
    updatedAt: new Date('2023-12-24')
  },
  {
    id: '2',
    title: 'Nettoyage complet Maison 2B',
    description: 'Nettoyage approfondi suite au départ d\'un résident. Préparation pour nouveau locataire.',
    category: TaskCategory.CLEANING,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    assignedTo: {
      id: 'staff-2',
      name: 'Marie Nettoyage'
    },
    houseId: '2B',
    houseName: 'Maison 2B',
    dueDate: new Date('2023-12-27'),
    estimatedDuration: 180,
    tags: ['nettoyage', 'préparation'],
    createdBy: {
      id: 'manager-1',
      name: 'Responsable Pass21'
    },
    createdAt: new Date('2023-12-24'),
    updatedAt: new Date('2023-12-24')
  },
  {
    id: '3',
    title: 'Suivi médical M. Martin',
    description: 'Accompagnement rendez-vous cardiologue. Prévoir transport et assistance.',
    category: TaskCategory.MEDICAL,
    priority: TaskPriority.HIGH,
    status: TaskStatus.TODO,
    assignedTo: {
      id: 'staff-3',
      name: 'Infirmière Sophie'
    },
    residentId: '2',
    residentName: 'Bernard Martin',
    dueDate: new Date('2023-12-26'),
    estimatedDuration: 120,
    tags: ['médical', 'transport'],
    createdBy: {
      id: 'medical-1',
      name: 'Dr. Rousseau'
    },
    createdAt: new Date('2023-12-22'),
    updatedAt: new Date('2023-12-23')
  },
  {
    id: '4',
    title: 'Mise à jour dossiers résidents',
    description: 'Vérification et mise à jour des informations de contact d\'urgence pour tous les résidents.',
    category: TaskCategory.ADMINISTRATIVE,
    priority: TaskPriority.LOW,
    status: TaskStatus.ON_HOLD,
    assignedTo: {
      id: 'admin-2',
      name: 'Assistant Admin'
    },
    dueDate: new Date('2023-12-30'),
    estimatedDuration: 240,
    tags: ['administratif', 'dossiers'],
    createdBy: {
      id: 'admin-1',
      name: 'Admin Pass21'
    },
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-22')
  },
  {
    id: '5',
    title: 'Vérification système sécurité',
    description: 'Test mensuel des alarmes incendie et systèmes de sécurité dans tout l\'établissement.',
    category: TaskCategory.SECURITY,
    priority: TaskPriority.URGENT,
    status: TaskStatus.TODO,
    assignedTo: {
      id: 'security-1',
      name: 'Agent Sécurité'
    },
    dueDate: new Date('2023-12-25'),
    estimatedDuration: 90,
    tags: ['sécurité', 'alarme', 'mensuel'],
    createdBy: {
      id: 'manager-1',
      name: 'Responsable Pass21'
    },
    createdAt: new Date('2023-12-24'),
    updatedAt: new Date('2023-12-24')
  },
  {
    id: '6',
    title: 'Organisation repas de Noël',
    description: 'Planification et coordination du repas de Noël pour tous les résidents. Menu spéciaux et animations.',
    category: TaskCategory.CATERING,
    priority: TaskPriority.HIGH,
    status: TaskStatus.COMPLETED,
    assignedTo: {
      id: 'chef-1',
      name: 'Chef Cuisinier'
    },
    dueDate: new Date('2023-12-25'),
    estimatedDuration: 300,
    actualDuration: 280,
    tags: ['cuisine', 'événement', 'noël'],
    createdBy: {
      id: 'events-1',
      name: 'Coordinateur Événements'
    },
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-25'),
    completedAt: new Date('2023-12-25')
  }
];

const getStatusBadge = (status: TaskStatus) => {
  const statusConfig = {
    [TaskStatus.TODO]: { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      icon: Circle,
      label: 'À faire'
    },
    [TaskStatus.IN_PROGRESS]: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800', 
      icon: Play,
      label: 'En cours'
    },
    [TaskStatus.ON_HOLD]: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      icon: Pause,
      label: 'En attente'
    },
    [TaskStatus.COMPLETED]: { 
      bg: 'bg-success-100', 
      text: 'text-success-800', 
      icon: CheckCircle,
      label: 'Terminé'
    },
    [TaskStatus.CANCELLED]: { 
      bg: 'bg-error-100', 
      text: 'text-error-800', 
      icon: Circle,
      label: 'Annulé'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </span>
  );
};

const getPriorityBadge = (priority: TaskPriority) => {
  const priorityConfig = {
    [TaskPriority.LOW]: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Faible' },
    [TaskPriority.MEDIUM]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Moyen' },
    [TaskPriority.HIGH]: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Élevé' },
    [TaskPriority.URGENT]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' }
  };

  const config = priorityConfig[priority];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {priority === TaskPriority.URGENT && <AlertTriangle className="h-3 w-3 mr-1" />}
      {config.label}
    </span>
  );
};

const getCategoryLabel = (category: TaskCategory) => {
  const categoryLabels = {
    [TaskCategory.MAINTENANCE]: 'Maintenance',
    [TaskCategory.CLEANING]: 'Nettoyage',
    [TaskCategory.MEDICAL]: 'Médical',
    [TaskCategory.ADMINISTRATIVE]: 'Administratif',
    [TaskCategory.RESIDENT_CARE]: 'Soins résidents',
    [TaskCategory.SECURITY]: 'Sécurité',
    [TaskCategory.CATERING]: 'Restauration',
    [TaskCategory.OTHER]: 'Autre'
  };
  return categoryLabels[category];
};

const TasksPage: React.FC = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'ALL'>('ALL');
  const [assignedFilter, setAssignedFilter] = useState<string>('ALL');

  const filteredTasks = mockTasks.filter(task => {
    if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
    if (categoryFilter !== 'ALL' && task.category !== categoryFilter) return false;
    if (assignedFilter !== 'ALL') {
      if (assignedFilter === 'UNASSIGNED' && task.assignedTo) return false;
      if (assignedFilter === 'ASSIGNED' && !task.assignedTo) return false;
    }
    return true;
  });

  const columns: TableColumn<Task>[] = [
    {
      key: 'title',
      title: 'Tâche',
      render: (_, task) => (
        <div>
          <div className="font-medium text-gray-900">{task.title}</div>
          <div className="text-sm text-gray-500 mt-1">{getCategoryLabel(task.category)}</div>
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  {tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="text-xs text-gray-400">+{task.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'priority',
      title: 'Priorité',
      render: (priority) => getPriorityBadge(priority as TaskPriority)
    },
    {
      key: 'status',
      title: 'Statut',
      render: (status) => getStatusBadge(status as TaskStatus)
    },
    {
      key: 'assignedTo',
      title: 'Assigné à',
      render: (assignedTo) => {
        if (!assignedTo) {
          return <span className="text-gray-400 italic">Non assigné</span>;
        }
        return (
          <div className="flex items-center">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-primary-600">
                {assignedTo.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-gray-900">{assignedTo.name}</span>
          </div>
        );
      }
    },
    {
      key: 'location',
      title: 'Lieu',
      render: (_, task) => {
        if (task.houseName && task.residentName) {
          return (
            <div>
              <div className="text-sm text-gray-900">{task.houseName}</div>
              <div className="text-xs text-gray-500">{task.residentName}</div>
            </div>
          );
        }
        if (task.houseName) {
          return <div className="text-sm text-gray-900">{task.houseName}</div>;
        }
        if (task.residentName) {
          return <div className="text-sm text-gray-900">{task.residentName}</div>;
        }
        return <span className="text-gray-400">-</span>;
      }
    },
    {
      key: 'dueDate',
      title: 'Échéance',
      render: (dueDate, task) => {
        if (!dueDate) return <span className="text-gray-400">-</span>;
        
        const due = new Date(dueDate);
        const now = new Date();
        const isOverdue = due < now && task.status !== TaskStatus.COMPLETED;
        const isToday = due.toDateString() === now.toDateString();
        
        return (
          <div className={`text-sm ${
            isOverdue ? 'text-red-600' : isToday ? 'text-orange-600' : 'text-gray-900'
          }`}>
            <div>{new Intl.DateTimeFormat('fr-FR').format(due)}</div>
            {task.estimatedDuration && (
              <div className="text-xs text-gray-500">
                ~{Math.floor(task.estimatedDuration / 60)}h{task.estimatedDuration % 60 > 0 ? Math.round(task.estimatedDuration % 60) + 'min' : ''}
              </div>
            )}
          </div>
        );
      }
    }
  ];

  const handleViewTask = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  const handleEditTask = (task: Task) => {
    router.push(`/tasks/${task.id}/edit`);
  };

  const handleStartTask = (task: Task) => {
    console.log('Démarrer tâche:', task.id);
    // In a real application, this would make an API call to update the task status
    // For now, we'll simulate the update locally
    const updatedTasks = mockTasks.map(t => 
      t.id === task.id 
        ? { ...t, status: TaskStatus.IN_PROGRESS, updatedAt: new Date() }
        : t
    );
    
    // This would normally trigger a re-render through state management
    // For demo purposes, we'll show a success message
    alert(`La tâche "${task.title}" a été démarrée avec succès!`);
  };

  const actions = [
    {
      label: 'Voir',
      onClick: handleViewTask,
      variant: 'ghost' as const
    },
    {
      label: 'Modifier',
      onClick: handleEditTask,
      variant: 'ghost' as const
    },
    {
      label: 'Démarrer',
      onClick: handleStartTask,
      variant: 'ghost' as const,
      condition: (task: Task) => task.status === TaskStatus.TODO
    }
  ];

  // Statistiques
  const stats = {
    total: mockTasks.length,
    todo: mockTasks.filter(t => t.status === TaskStatus.TODO).length,
    inProgress: mockTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    completed: mockTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    overdue: mockTasks.filter(t => {
      if (!t.dueDate || t.status === TaskStatus.COMPLETED) return false;
      return new Date(t.dueDate) < new Date();
    }).length,
    urgent: mockTasks.filter(t => t.priority === TaskPriority.URGENT && t.status !== TaskStatus.COMPLETED).length
  };

  return (
    <ProtectedPage requiredPage="/tasks">
      <Layout
        title="Pass21 - Gestion des Tâches"
        description="Gestion et suivi des tâches de la résidence Pass21"
        showNavbar={true}
        showFooter={false}
      >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Tâches</h1>
                <p className="text-gray-600 mt-1">
                  Suivi et organisation des tâches de la résidence Pass21
                </p>
              </div>
              <Button onClick={() => router.push('/tasks/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Tâche
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <ClipboardList className="w-5 h-5 text-primary-600 mr-2" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <Circle className="w-5 h-5 text-gray-600 mr-2" />
                <div>
                  <p className="text-xs font-medium text-gray-600">À faire</p>
                  <p className="text-xl font-bold text-gray-900">{stats.todo}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <Play className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-xs font-medium text-gray-600">En cours</p>
                  <p className="text-xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Terminées</p>
                  <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <p className="text-xs font-medium text-gray-600">En retard</p>
                  <p className="text-xl font-bold text-red-900">{stats.overdue}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Urgentes</p>
                  <p className="text-xl font-bold text-orange-900">{stats.urgent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'ALL')}
                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value={TaskStatus.TODO}>À faire</option>
                  <option value={TaskStatus.IN_PROGRESS}>En cours</option>
                  <option value={TaskStatus.ON_HOLD}>En attente</option>
                  <option value={TaskStatus.COMPLETED}>Terminé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'ALL')}
                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="ALL">Toutes les priorités</option>
                  <option value={TaskPriority.URGENT}>Urgent</option>
                  <option value={TaskPriority.HIGH}>Élevé</option>
                  <option value={TaskPriority.MEDIUM}>Moyen</option>
                  <option value={TaskPriority.LOW}>Faible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as TaskCategory | 'ALL')}
                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="ALL">Toutes les catégories</option>
                  <option value={TaskCategory.MAINTENANCE}>Maintenance</option>
                  <option value={TaskCategory.CLEANING}>Nettoyage</option>
                  <option value={TaskCategory.MEDICAL}>Médical</option>
                  <option value={TaskCategory.ADMINISTRATIVE}>Administratif</option>
                  <option value={TaskCategory.SECURITY}>Sécurité</option>
                  <option value={TaskCategory.CATERING}>Restauration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignation</label>
                <select
                  value={assignedFilter}
                  onChange={(e) => setAssignedFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="ALL">Toutes</option>
                  <option value="ASSIGNED">Assignées</option>
                  <option value="UNASSIGNED">Non assignées</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''} 
                {filteredTasks.length !== mockTasks.length && ` sur ${mockTasks.length}`}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL'); 
                  setCategoryFilter('ALL');
                  setAssignedFilter('ALL');
                }}
              >
                Réinitialiser filtres
              </Button>
            </div>
          </div>

          {/* Tasks Table */}
          <DataTable
            data={filteredTasks}
            columns={columns}
            actions={actions}
            searchable={true}
            sortable={true}
            pagination={true}
            pageSize={10}
            emptyMessage="Aucune tâche trouvée"
            onRowClick={handleViewTask}
          />
        </main>
        </div>
      </Layout>
    </ProtectedPage>
  );
};

export default TasksPage;
