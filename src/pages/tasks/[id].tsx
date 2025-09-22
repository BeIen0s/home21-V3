import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Edit, 
  Clock, 
  Calendar,
  User,
  Home,
  MessageSquare,
  CheckCircle,
  Play,
  Pause,
  AlertTriangle,
  Tag,
  FileText,
  Plus
} from 'lucide-react';
import { TaskStatus, TaskPriority, TaskCategory } from './index';

interface TaskDetail {
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
    email: string;
    phone?: string;
  };
  residentId?: string;
  residentName?: string;
  houseId?: string;
  houseName?: string;
  dueDate?: Date;
  estimatedDuration?: number;
  actualDuration?: number;
  tags: string[];
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  startedAt?: Date;
  comments: TaskComment[];
  activities: TaskActivity[];
  attachments: TaskAttachment[];
}

interface TaskComment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  isInternal: boolean; // Visible seulement au staff ou aussi au résident
}

interface TaskActivity {
  id: string;
  type: 'STATUS_CHANGE' | 'ASSIGNMENT_CHANGE' | 'PRIORITY_CHANGE' | 'COMMENT_ADDED' | 'ATTACHMENT_ADDED';
  description: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
  metadata?: any;
}

interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: {
    id: string;
    name: string;
  };
  uploadedAt: Date;
  url: string;
}

// Mock data détaillée pour les tâches
const mockTaskDetails: Record<string, TaskDetail> = {
  '1': {
    id: '1',
    title: 'Réparation robinet cuisine',
    description: 'Le robinet de la cuisine de Mme Dupont fuit depuis hier soir. L\'eau coule en permanence, ce qui peut causer des dégâts et augmenter la consommation. Intervention urgente nécessaire.',
    category: TaskCategory.MAINTENANCE,
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    assignedTo: {
      id: 'staff-1',
      name: 'Jean Plombier',
      email: 'jean.plombier@pass21.fr',
      phone: '06.12.34.56.78'
    },
    residentId: '1',
    residentName: 'Marie Dupont',
    houseId: '1A',
    houseName: 'Maison 1A',
    dueDate: new Date('2023-12-25'),
    estimatedDuration: 60,
    actualDuration: undefined,
    tags: ['plomberie', 'urgent', 'fuite'],
    createdBy: {
      id: 'admin-1',
      name: 'Admin Pass21'
    },
    createdAt: new Date('2023-12-23'),
    updatedAt: new Date('2023-12-24'),
    startedAt: new Date('2023-12-24T09:00:00'),
    comments: [
      {
        id: 'c1',
        author: {
          id: 'staff-1',
          name: 'Jean Plombier'
        },
        content: 'J\'ai inspecté le robinet. Il s\'agit bien d\'un problème de joint. J\'ai commandé les pièces, elles arrivent demain matin.',
        createdAt: new Date('2023-12-24T09:30:00'),
        isInternal: false
      },
      {
        id: 'c2',
        author: {
          id: 'resident-1',
          name: 'Marie Dupont'
        },
        content: 'Merci beaucoup ! En attendant, j\'ai mis un seau sous le robinet.',
        createdAt: new Date('2023-12-24T10:00:00'),
        isInternal: false
      }
    ],
    activities: [
      {
        id: 'a1',
        type: 'STATUS_CHANGE',
        description: 'Statut changé de "À faire" vers "En cours"',
        author: {
          id: 'staff-1',
          name: 'Jean Plombier'
        },
        createdAt: new Date('2023-12-24T09:00:00'),
        metadata: { from: 'TODO', to: 'IN_PROGRESS' }
      },
      {
        id: 'a2',
        type: 'COMMENT_ADDED',
        description: 'Commentaire ajouté',
        author: {
          id: 'staff-1',
          name: 'Jean Plombier'
        },
        createdAt: new Date('2023-12-24T09:30:00')
      }
    ],
    attachments: [
      {
        id: 'att1',
        name: 'photo_robinet_avant.jpg',
        type: 'image/jpeg',
        size: 245600,
        uploadedBy: {
          id: 'staff-1',
          name: 'Jean Plombier'
        },
        uploadedAt: new Date('2023-12-24T09:15:00'),
        url: '/attachments/photo_robinet_avant.jpg'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Nettoyage complet Maison 2B',
    description: 'Nettoyage approfondi suite au départ d\'un résident. Préparation pour nouveau locataire.',
    category: TaskCategory.CLEANING,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    assignedTo: {
      id: 'staff-2',
      name: 'Marie Nettoyage',
      email: 'marie.nettoyage@pass21.fr'
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
    updatedAt: new Date('2023-12-24'),
    comments: [],
    activities: [
      {
        id: 'a3',
        type: 'ASSIGNMENT_CHANGE',
        description: 'Tâche assignée à Marie Nettoyage',
        author: {
          id: 'manager-1',
          name: 'Responsable Pass21'
        },
        createdAt: new Date('2023-12-24T14:00:00')
      }
    ],
    attachments: []
  }
};

const getStatusBadge = (status: TaskStatus) => {
  const statusConfig = {
    [TaskStatus.TODO]: { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      icon: CheckCircle,
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
      icon: CheckCircle,
      label: 'Annulé'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <Icon className="h-4 w-4 mr-1" />
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

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  }
  return `${mins}min`;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const TaskDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity' | 'attachments'>('details');
  const [newComment, setNewComment] = useState('');

  const task = mockTaskDetails[id as string];

  if (!task) {
    return (
      <Layout title="Tâche non trouvée" description="La tâche demandée n'a pas été trouvée">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tâche non trouvée</h1>
            <Button onClick={() => router.push('/tasks')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleStatusChange = (newStatus: TaskStatus) => {
    console.log(`Changement de statut: ${task.status} -> ${newStatus}`);
    // TODO: Update task status
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log('Ajout commentaire:', newComment);
      setNewComment('');
      // TODO: Add comment to task
    }
  };

  return (
    <Layout
      title={`Pass21 - ${task.title}`}
      description={`Détails de la tâche ${task.title}`}
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/tasks')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                  <p className="text-gray-600 mt-1">
                    {getCategoryLabel(task.category)} • Créée le {new Intl.DateTimeFormat('fr-FR').format(task.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(task.status)}
                {getPriorityBadge(task.priority)}
                <Button onClick={() => router.push(`/tasks/${task.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'details'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <FileText className="h-4 w-4 inline mr-2" />
                      Détails
                    </button>
                    <button
                      onClick={() => setActiveTab('comments')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'comments'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4 inline mr-2" />
                      Commentaires ({task.comments.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'activity'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Clock className="h-4 w-4 inline mr-2" />
                      Activité ({task.activities.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('attachments')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'attachments'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <FileText className="h-4 w-4 inline mr-2" />
                      Pièces jointes ({task.attachments.length})
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{task.description}</p>
                      </div>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timing */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Temps</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {task.estimatedDuration && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-sm text-gray-500">Durée estimée:</span>
                                <span className="ml-2 font-medium">{formatDuration(task.estimatedDuration)}</span>
                              </div>
                            </div>
                          )}
                          {task.actualDuration && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-sm text-gray-500">Durée réelle:</span>
                                <span className="ml-2 font-medium">{formatDuration(task.actualDuration)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'comments' && (
                    <div className="space-y-6">
                      {/* Add Comment */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Ajouter un commentaire</h3>
                        <div className="space-y-3">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Écrivez votre commentaire..."
                            rows={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          <div className="flex justify-end">
                            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-4">
                        {task.comments.length > 0 ? (
                          task.comments.map((comment) => (
                            <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary-600">
                                    {comment.author.name.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900">{comment.author.name}</span>
                                    <span className="text-sm text-gray-500">
                                      {new Intl.DateTimeFormat('fr-FR', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      }).format(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700">{comment.content}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Aucun commentaire</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="space-y-4">
                      {task.activities.length > 0 ? (
                        <div className="flow-root">
                          <ul className="-mb-8">
                            {task.activities.map((activity, activityIdx) => (
                              <li key={activity.id}>
                                <div className="relative pb-8">
                                  {activityIdx !== task.activities.length - 1 && (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                                  )}
                                  <div className="relative flex space-x-3">
                                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-gray-600">
                                        {activity.author.name.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                      <div>
                                        <p className="text-sm text-gray-700">{activity.description}</p>
                                        <p className="text-xs text-gray-500">par {activity.author.name}</p>
                                      </div>
                                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                        {new Intl.DateTimeFormat('fr-FR', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        }).format(activity.createdAt)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Aucune activité</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'attachments' && (
                    <div className="space-y-4">
                      {task.attachments.length > 0 ? (
                        task.attachments.map((attachment) => (
                          <div key={attachment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                  <div className="font-medium text-gray-900">{attachment.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {formatFileSize(attachment.size)} • Ajouté le {new Intl.DateTimeFormat('fr-FR').format(attachment.uploadedAt)} par {attachment.uploadedBy.name}
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                Télécharger
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Aucune pièce jointe</p>
                          <Button className="mt-4" variant="ghost">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un fichier
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  {task.status === TaskStatus.TODO && (
                    <Button 
                      className="w-full justify-start" 
                      onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Démarrer la tâche
                    </Button>
                  )}
                  
                  {task.status === TaskStatus.IN_PROGRESS && (
                    <>
                      <Button 
                        className="w-full justify-start"
                        onClick={() => handleStatusChange(TaskStatus.COMPLETED)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme terminé
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => handleStatusChange(TaskStatus.ON_HOLD)}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Mettre en attente
                      </Button>
                    </>
                  )}

                  {task.status === TaskStatus.ON_HOLD && (
                    <Button 
                      className="w-full justify-start"
                      onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Reprendre la tâche
                    </Button>
                  )}
                </div>
              </div>

              {/* Assignment */}
              {task.assignedTo && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Assigné à</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-medium text-primary-600">
                          {task.assignedTo.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{task.assignedTo.name}</div>
                        <div className="text-sm text-gray-500">{task.assignedTo.email}</div>
                      </div>
                    </div>
                    
                    {task.assignedTo.phone && (
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Appeler {task.assignedTo.phone}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Location */}
              {(task.houseName || task.residentName) && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Lieu</h3>
                  <div className="space-y-3">
                    {task.houseName && (
                      <div className="flex items-center">
                        <Home className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-gray-900">{task.houseName}</span>
                      </div>
                    )}
                    {task.residentName && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-gray-900">{task.residentName}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Planning</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Créée le</div>
                      <div className="text-gray-900">
                        {new Intl.DateTimeFormat('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }).format(task.createdAt)}
                      </div>
                    </div>
                  </div>

                  {task.dueDate && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Échéance</div>
                        <div className={`${
                          new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED
                            ? 'text-red-600 font-medium'
                            : 'text-gray-900'
                        }`}>
                          {new Intl.DateTimeFormat('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }).format(task.dueDate)}
                        </div>
                      </div>
                    </div>
                  )}

                  {task.startedAt && (
                    <div className="flex items-center">
                      <Play className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Démarrée le</div>
                        <div className="text-gray-900">
                          {new Intl.DateTimeFormat('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(task.startedAt)}
                        </div>
                      </div>
                    </div>
                  )}

                  {task.completedAt && (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-success-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Terminée le</div>
                        <div className="text-gray-900">
                          {new Intl.DateTimeFormat('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(task.completedAt)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default TaskDetailPage;