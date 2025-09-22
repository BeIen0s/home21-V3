import React from 'react';
import { Clock, User, MapPin, AlertCircle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Task, TaskStatus, TaskPriority } from '@/types';

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Réparation robinet - Maison 12A',
    description: 'Fuite au niveau du robinet de la cuisine',
    category: 'MAINTENANCE' as any,
    priority: 'HIGH' as TaskPriority,
    status: 'IN_PROGRESS' as TaskStatus,
    type: 'MAINTENANCE' as any,
    assignedTo: 'jean-martin',
    assignedBy: 'admin',
    houseId: '12A',
    scheduledStart: new Date('2024-01-15T09:00:00'),
    estimatedDuration: 60,
    isRecurring: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Nettoyage hebdomadaire - Section A',
    description: 'Nettoyage des parties communes du bâtiment A',
    category: 'CLEANING' as any,
    priority: 'MEDIUM' as TaskPriority,
    status: 'ASSIGNED' as TaskStatus,
    type: 'ROUTINE' as any,
    assignedTo: 'marie-service',
    assignedBy: 'admin',
    scheduledStart: new Date('2024-01-15T14:00:00'),
    estimatedDuration: 180,
    isRecurring: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Visite médicale - Mme Dupont',
    description: 'Accompagnement rendez-vous cardiologue',
    category: 'HEALTHCARE' as any,
    priority: 'HIGH' as TaskPriority,
    status: 'PENDING' as TaskStatus,
    type: 'REQUEST' as any,
    assignedBy: 'admin',
    residentId: 'resident-1',
    scheduledStart: new Date('2024-01-15T10:30:00'),
    estimatedDuration: 120,
    isRecurring: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: 'Contrôle système sécurité',
    description: 'Vérification mensuelle des alarmes et caméras',
    category: 'SECURITY' as any,
    priority: 'MEDIUM' as TaskPriority,
    status: 'COMPLETED' as TaskStatus,
    type: 'INSPECTION' as any,
    assignedTo: 'security-team',
    assignedBy: 'admin',
    scheduledStart: new Date('2024-01-14T16:00:00'),
    actualStart: new Date('2024-01-14T16:15:00'),
    actualEnd: new Date('2024-01-14T17:30:00'),
    estimatedDuration: 90,
    actualDuration: 75,
    isRecurring: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'CRITICAL':
    case 'URGENT':
      return 'bg-error-100 text-error-800 border-error-200';
    case 'HIGH':
      return 'bg-warning-100 text-warning-800 border-warning-200';
    case 'MEDIUM':
      return 'bg-accent-100 text-accent-800 border-accent-200';
    case 'LOW':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle2 className="h-4 w-4 text-success-600" />;
    case 'IN_PROGRESS':
      return <Clock className="h-4 w-4 text-accent-600" />;
    case 'PENDING':
    case 'ASSIGNED':
      return <AlertCircle className="h-4 w-4 text-warning-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusText = (status: TaskStatus) => {
  const statusMap = {
    'PENDING': 'En attente',
    'ASSIGNED': 'Assignée',
    'IN_PROGRESS': 'En cours',
    'AWAITING_VALIDATION': 'À valider',
    'COMPLETED': 'Terminée',
    'CANCELLED': 'Annulée',
    'ON_HOLD': 'En pause'
  };
  return statusMap[status] || status;
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(task.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {task.title}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              
              {task.description && (
                <p className="text-sm text-gray-500 mb-2">{task.description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                {task.scheduledStart && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(task.scheduledStart)}
                  </div>
                )}
                
                {task.assignedTo && (
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {task.assignedTo}
                  </div>
                )}
                
                {(task.houseId || task.residentId) && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {task.houseId ? `Maison ${task.houseId}` : 'Résident'}
                  </div>
                )}
                
                <span className="text-gray-400">•</span>
                <span>{getStatusText(task.status)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-2">
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const TasksSummary: React.FC = () => {
  const todayTasks = mockTasks.filter(task => {
    if (!task.scheduledStart) return false;
    const today = new Date();
    const taskDate = new Date(task.scheduledStart);
    return taskDate.toDateString() === today.toDateString();
  });

  const urgentTasks = mockTasks.filter(task => 
    ['URGENT', 'CRITICAL'].includes(task.priority) && 
    task.status !== 'COMPLETED'
  );

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tâches du jour</h2>
            <p className="text-sm text-gray-500">
              {todayTasks.length} tâches programmées • {urgentTasks.length} urgentes
            </p>
          </div>
          <Button variant="outline" size="sm">
            Voir toutes
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        {todayTasks.length > 0 ? (
          <div className="space-y-4">
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="font-medium">Aucune tâche programmée aujourd'hui</p>
            <p className="text-sm">Parfait ! L'équipe peut se concentrer sur d'autres priorités.</p>
          </div>
        )}
      </div>
    </div>
  );
};