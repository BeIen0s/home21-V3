import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormDatePicker } from '@/components/forms/FormDatePicker';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2,
  ClipboardList,
  Loader,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { TaskStatus, TaskPriority, TaskCategory } from '../index';

interface TaskFormData {
  title: string;
  description: string;
  category: TaskCategory | '';
  priority: TaskPriority | '';
  status: TaskStatus | '';
  assignedToId: string;
  residentId: string;
  houseId: string;
  dueDate: string;
  estimatedDuration: number;
  tags: string[];
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
}

// Mock data - options
const categoryOptions = [
  { value: '', label: 'Sélectionnez une catégorie' },
  { value: TaskCategory.MAINTENANCE, label: 'Maintenance' },
  { value: TaskCategory.CLEANING, label: 'Nettoyage' },
  { value: TaskCategory.MEDICAL, label: 'Médical' },
  { value: TaskCategory.ADMINISTRATIVE, label: 'Administratif' },
  { value: TaskCategory.RESIDENT_CARE, label: 'Soins résidents' },
  { value: TaskCategory.SECURITY, label: 'Sécurité' },
  { value: TaskCategory.CATERING, label: 'Restauration' },
  { value: TaskCategory.OTHER, label: 'Autre' }
];

const priorityOptions = [
  { value: TaskPriority.LOW, label: 'Faible' },
  { value: TaskPriority.MEDIUM, label: 'Moyen' },
  { value: TaskPriority.HIGH, label: 'Élevé' },
  { value: TaskPriority.URGENT, label: 'Urgent' }
];

const statusOptions = [
  { value: TaskStatus.TODO, label: 'À faire' },
  { value: TaskStatus.IN_PROGRESS, label: 'En cours' },
  { value: TaskStatus.ON_HOLD, label: 'En attente' },
  { value: TaskStatus.COMPLETED, label: 'Terminé' },
  { value: TaskStatus.CANCELLED, label: 'Annulé' }
];

const staffOptions = [
  { value: '', label: 'Sélectionnez un membre du personnel' },
  { value: 'staff-1', label: 'Jean Plombier' },
  { value: 'staff-2', label: 'Marie Nettoyage' },
  { value: 'staff-3', label: 'Infirmière Sophie' },
  { value: 'admin-2', label: 'Assistant Admin' },
  { value: 'security-1', label: 'Agent Sécurité' },
  { value: 'chef-1', label: 'Chef Cuisinier' }
];

const residentOptions = [
  { value: '', label: 'Aucun résident spécifique' },
  { value: '1', label: 'Marie Dupont' },
  { value: '2', label: 'Bernard Martin' },
  { value: '3', label: 'Françoise Petit' },
  { value: '4', label: 'André Rousseau' }
];

const houseOptions = [
  { value: '', label: 'Aucun logement spécifique' },
  { value: '1A', label: 'Maison 1A' },
  { value: '2B', label: 'Maison 2B' },
  { value: '3C', label: 'Maison 3C' },
  { value: '4D', label: 'Maison 4D' },
  { value: '5E', label: 'Maison 5E' },
  { value: '6F', label: 'Maison 6F' }
];

// Mock tasks data
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
  }
];

const EditTaskPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [task, setTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadTask = useCallback((taskId: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const foundTask = mockTasks.find(t => t.id === taskId);
      
      if (foundTask) {
        setTask(foundTask);
        setFormData({
          title: foundTask.title,
          description: foundTask.description,
          category: foundTask.category,
          priority: foundTask.priority,
          status: foundTask.status,
          assignedToId: foundTask.assignedTo?.id || '',
          residentId: foundTask.residentId || '',
          houseId: foundTask.houseId || '',
          dueDate: foundTask.dueDate ? new Date(foundTask.dueDate).toISOString().split('T')[0] : '',
          estimatedDuration: foundTask.estimatedDuration || 60,
          tags: [...foundTask.tags]
        });
      } else {
        router.push('/tasks');
      }
      
      setIsLoading(false);
    }, 500);
  }, [router]);

  useEffect(() => {
    if (id) {
      loadTask(id as string);
    }
  }, [id, loadTask]);

  const updateFormData = (field: string, value: any) => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : prev);

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (!formData) return;
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => prev ? ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }) : prev);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }) : prev);
  };

  const validateForm = () => {
    if (!formData) return false;
    
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (formData.estimatedDuration < 1) {
      newErrors.estimatedDuration = 'La durée doit être d\'au moins 1 minute';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData || !task || !validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Tâche modifiée:', { ...task, ...formData });
      setSubmitStatus('success');
      
      // Redirect after success
      setTimeout(() => {
        router.push('/tasks');
      }, 1500);
      
    } catch (error) {
      console.error('Error updating task:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout
        title="Pass21 - Chargement..."
        description="Chargement des données de la tâche"
        showNavbar={true}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center">
            <Loader className="animate-spin h-8 w-8 text-primary-600 mr-3" />
            <span className="text-lg text-gray-700">Chargement des données de la tâche...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!formData || !task) {
    return (
      <Layout
        title="Pass21 - Tâche non trouvée"
        description="La tâche demandée n'existe pas"
        showNavbar={true}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Tâche non trouvée</h1>
            <p className="text-gray-600 mb-4">La tâche demandée n'existe pas ou a été supprimée.</p>
            <Button onClick={() => router.push('/tasks')}>
              Retour à la liste
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Pass21 - Modifier ${task.title}`}
      description="Modifier les informations de la tâche"
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/tasks')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <ClipboardList className="h-6 w-6 mr-3 text-primary-600" />
                  Modifier {task.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  Mettre à jour les informations de la tâche
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Informations de base</h2>
              
              <div className="space-y-6">
                <FormInput
                  id="title"
                  label="Titre de la tâche"
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="ex: Réparation robinet cuisine"
                  required
                  error={errors.title}
                />

                <FormTextarea
                  id="description"
                  label="Description détaillée"
                  value={formData.description}
                  onChange={(value) => updateFormData('description', value)}
                  placeholder="Décrivez la tâche en détail, les étapes à suivre, les matériaux nécessaires..."
                  rows={4}
                  required
                  error={errors.description}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormSelect
                    id="category"
                    label="Catégorie"
                    value={formData.category}
                    onChange={(value) => updateFormData('category', value)}
                    options={categoryOptions}
                    required
                    error={errors.category}
                  />

                  <FormSelect
                    id="priority"
                    label="Priorité"
                    value={formData.priority}
                    onChange={(value) => updateFormData('priority', value)}
                    options={priorityOptions}
                    required
                  />

                  <FormSelect
                    id="status"
                    label="Statut"
                    value={formData.status}
                    onChange={(value) => updateFormData('status', value)}
                    options={statusOptions}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Assignment & Location */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Attribution et localisation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormSelect
                  id="assignedToId"
                  label="Assigner à"
                  value={formData.assignedToId}
                  onChange={(value) => updateFormData('assignedToId', value)}
                  options={staffOptions}
                />

                <FormSelect
                  id="residentId"
                  label="Résident concerné"
                  value={formData.residentId}
                  onChange={(value) => updateFormData('residentId', value)}
                  options={residentOptions}
                />

                <FormSelect
                  id="houseId"
                  label="Logement concerné"
                  value={formData.houseId}
                  onChange={(value) => updateFormData('houseId', value)}
                  options={houseOptions}
                />
              </div>
            </div>

            {/* Schedule & Duration */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Planning</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormDatePicker
                  id="dueDate"
                  label="Date d'échéance"
                  value={formData.dueDate}
                  onChange={(value) => updateFormData('dueDate', value)}
                  min={new Date().toISOString().split('T')[0]}
                />

                <FormInput
                  id="estimatedDuration"
                  label="Durée estimée (minutes)"
                  type="number"
                  value={formData.estimatedDuration.toString()}
                  onChange={(e) => updateFormData('estimatedDuration', parseInt(e.target.value) || 60)}
                  min={1}
                  max={1440}
                  error={errors.estimatedDuration}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Tags (optionnel)</h2>
              
              <div className="flex gap-2 mb-3">
                <FormInput
                  id="newTag"
                  label=""
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag..."
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={addTag}
                  disabled={!newTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 bg-white rounded-lg shadow p-6">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => router.push('/tasks')}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Tâche modifiée avec succès!</h3>
                  <p className="text-sm text-green-700 mt-1">Redirection vers la liste des tâches...</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Erreur lors de l'enregistrement</h3>
                  <p className="text-sm text-red-700 mt-1">Veuillez réessayer ou contacter le support.</p>
                </div>
              </div>
            )}
          </form>
        </main>
      </div>
    </Layout>
  );
};

export default EditTaskPage;