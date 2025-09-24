import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormDatePicker } from '@/components/forms/FormDatePicker';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { 
  X, 
  User, 
  Home, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Search
} from 'lucide-react';

interface ResidentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: {
    id: string;
    name: string;
    type: string;
    surface: number;
    monthlyRent: number;
  };
  onAssign: (data: AssignmentData) => void;
}

interface AssignmentData {
  residentId: string;
  moveInDate: string;
  notes?: string;
}

interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  status: 'ACTIVE' | 'WAITING_LIST' | 'TEMPORARY_LEAVE' | 'MOVED_OUT';
  currentHouse?: string;
}

// Mock data des résidents disponibles
const mockAvailableResidents: Resident[] = [
  {
    id: '3',
    firstName: 'Françoise',
    lastName: 'Petit',
    status: 'WAITING_LIST'
  },
  {
    id: '4',
    firstName: 'André',
    lastName: 'Rousseau',
    status: 'WAITING_LIST'
  },
  {
    id: '5',
    firstName: 'Lucienne',
    lastName: 'Moreau',
    status: 'WAITING_LIST'
  },
  {
    id: '6',
    firstName: 'Pierre',
    lastName: 'Durand',
    status: 'TEMPORARY_LEAVE',
    currentHouse: '7G'
  }
];

export const ResidentAssignmentModal: React.FC<ResidentAssignmentModalProps> = ({
  isOpen,
  onClose,
  house,
  onAssign
}) => {
  const [selectedResident, setSelectedResident] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedResident('');
      setMoveInDate('');
      setNotes('');
      setErrors({});
      setSubmitStatus('idle');
    }
  }, [isOpen]);

  // Filtrer les résidents disponibles (en liste d'attente ou en congé temporaire)
  const availableResidents = mockAvailableResidents.filter(
    resident => resident.status === 'WAITING_LIST' || resident.status === 'TEMPORARY_LEAVE'
  );

  const residentOptions = [
    { value: '', label: 'Sélectionnez un résident...' },
    ...availableResidents.map(resident => ({
      value: resident.id,
      label: `${resident.firstName} ${resident.lastName}${resident.status === 'TEMPORARY_LEAVE' ? ' (Congé temporaire)' : ''}`
    }))
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedResident) {
      newErrors.resident = 'Veuillez sélectionner un résident';
    }

    if (!moveInDate) {
      newErrors.moveInDate = 'La date d\'entrée est requise';
    } else {
      const selectedDate = new Date(moveInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.moveInDate = 'La date d\'entrée ne peut pas être dans le passé';
      }
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
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assignmentData: AssignmentData = {
        residentId: selectedResident,
        moveInDate,
        notes: notes.trim() || undefined
      };

      onAssign(assignmentData);
      setSubmitStatus('success');

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error assigning resident:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedResidentData = availableResidents.find(r => r.id === selectedResident);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Home className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Assigner un résident
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {house.name} • {house.type} • {house.surface}m² • {house.monthlyRent}€/mois
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Resident Selection */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Sélection du résident</h3>
            </div>
            
            <FormSelect
              id="resident"
              label="Résident à assigner"
              value={selectedResident}
              onChange={(value) => {
                setSelectedResident(value);
                if (errors.resident) {
                  setErrors(prev => ({ ...prev, resident: '' }));
                }
              }}
              options={residentOptions}
              error={errors.resident}
              required
            />

            {availableResidents.length === 0 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">Aucun résident disponible</p>
                    <p>Tous les résidents sont déjà assignés ou ne sont pas en liste d'attente.</p>
                  </div>
                </div>
              </div>
            )}

            {selectedResidentData && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">{selectedResidentData.firstName} {selectedResidentData.lastName}</p>
                    <p>
                      Statut: {
                        selectedResidentData.status === 'WAITING_LIST' ? 'En liste d\'attente' :
                        selectedResidentData.status === 'TEMPORARY_LEAVE' ? 'En congé temporaire' : 
                        selectedResidentData.status
                      }
                    </p>
                    {selectedResidentData.currentHouse && (
                      <p>Logement actuel: {selectedResidentData.currentHouse}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Move-in Details */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Détails de l'assignation</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormDatePicker
                id="moveInDate"
                label="Date d'entrée"
                value={moveInDate}
                onChange={(value) => {
                  setMoveInDate(value);
                  if (errors.moveInDate) {
                    setErrors(prev => ({ ...prev, moveInDate: '' }));
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                error={errors.moveInDate}
                required
              />
            </div>

            <FormTextarea
              id="notes"
              label="Notes et observations (optionnel)"
              value={notes}
              onChange={setNotes}
              placeholder="Informations supplémentaires sur l'assignation..."
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Assignation réussie!</h3>
                <p className="text-sm text-green-700 mt-1">Le résident a été assigné au logement avec succès.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erreur lors de l'assignation</h3>
                <p className="text-sm text-red-700 mt-1">Une erreur s'est produite. Veuillez réessayer.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || availableResidents.length === 0}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assignation...
                </div>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Assigner
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};