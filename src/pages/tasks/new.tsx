import React, { useState } from 'react';
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
  User,
  Home
} from 'lucide-react';
import { TaskStatus, TaskPriority, TaskCategory } from './index';

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

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  category: '',
  priority: TaskPriority.MEDIUM,
  status: TaskStatus.TODO,
  assignedToId: '',
  residentId: '',
  houseId: '',
  dueDate: '',
  estimatedDuration: 60,
  tags: []
};

// Mock data
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

const NewTaskPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const validateForm = () => {
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
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Task created:', formData);
      router.push('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Pass21 - Nouvelle Tâche"
      description="Créer une nouvelle tâche dans la résidence Pass21"
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
                  Nouvelle Tâche
                </h1>
                <p className="text-gray-600 mt-1">
                  Créer une nouvelle tâche pour la résidence Pass21
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
                  onChange={(value) => updateFormData('title', value)}
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
                    label="Statut initial"
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
                  onChange={(value) => updateFormData('estimatedDuration', parseInt(value) || 60)}
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
                  onChange={setNewTag}
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
              
              {formData.tags.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Les tags aident à catégoriser et rechercher les tâches plus facilement.
                </p>
              )}
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
                    Création...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer la tâche
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
};

export default NewTaskPage;