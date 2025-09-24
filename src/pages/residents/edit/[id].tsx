import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { Gender, ResidentStatus, EmergencyContact, MedicalInfo, Medication, Resident } from '@/types';
import { StorageService } from '@/services/storageService';

// Types for form data
interface ResidentFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender | '';
  status: ResidentStatus | '';
  houseId: string;
  moveInDate: string;
  emergencyContact: EmergencyContact;
  medicalInfo?: {
    allergies: string[];
    medicalConditions: string[];
    medications: Medication[];
    specialNeeds: string;
  };
}

interface FormErrors {
  [key: string]: string;
}

// Mock data for houses
const availableHouses = [
  { value: '', label: 'Sélectionnez un logement' },
  { value: '1A', label: 'Maison 1A' },
  { value: '2B', label: 'Maison 2B' },
  { value: '3C', label: 'Maison 3C' },
  { value: '4D', label: 'Maison 4D' },
  { value: '5E', label: 'Maison 5E' }
];

const genderOptions = [
  { value: '', label: 'Sélectionnez le genre' },
  { value: 'MALE', label: 'Masculin' },
  { value: 'FEMALE', label: 'Féminin' }
];

const statusOptions = [
  { value: 'WAITING_LIST', label: 'Liste d\'attente' },
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'TEMPORARY_LEAVE', label: 'Congé temporaire' },
  { value: 'MOVED_OUT', label: 'Déménagé' },
  { value: 'DECEASED', label: 'Décédé' }
];

const relationshipOptions = [
  { value: '', label: 'Sélectionnez la relation' },
  { value: 'Époux/Épouse', label: 'Époux/Épouse' },
  { value: 'Fils', label: 'Fils' },
  { value: 'Fille', label: 'Fille' },
  { value: 'Frère', label: 'Frère' },
  { value: 'Sœur', label: 'Sœur' },
  { value: 'Ami(e)', label: 'Ami(e)' },
  { value: 'Autre', label: 'Autre' }
];

const EditResidentPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [resident, setResident] = useState<Resident | null>(null);
  const [formData, setFormData] = useState<ResidentFormData | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  // Load resident data
  useEffect(() => {
    if (id) {
      loadResident(id as string);
    }
  }, [id]);

  const loadResident = (residentId: string) => {
    setIsLoading(true);
    
    // Charger depuis le stockage local
    const storedResidents = StorageService.getResidents();
    const foundResident = storedResidents.find((r: any) => r.id === residentId);
    
    // Chercher aussi dans les données mock
    const mockResidents = [
      {
        id: '1',
        userId: 'user-1',
        firstName: 'Marie',
        lastName: 'Dupont',
        dateOfBirth: new Date('1940-05-15'),
        gender: 'FEMALE' as Gender,
        emergencyContact: {
          name: 'Jean Dupont',
          relationship: 'Époux',
          phone: '0123456789',
          email: 'jean.dupont@email.com'
        },
        houseId: '12A',
        moveInDate: new Date('2023-01-15'),
        status: 'ACTIVE' as ResidentStatus,
        documents: [],
        createdAt: new Date('2023-01-10'),
        updatedAt: new Date('2023-01-15')
      },
      {
        id: '2',
        userId: 'user-2',
        firstName: 'Bernard',
        lastName: 'Martin',
        dateOfBirth: new Date('1935-08-22'),
        gender: 'MALE' as Gender,
        emergencyContact: {
          name: 'Sophie Martin',
          relationship: 'Fille',
          phone: '0987654321',
          email: 'sophie.martin@email.com'
        },
        houseId: '8B',
        moveInDate: new Date('2022-09-01'),
        status: 'ACTIVE' as ResidentStatus,
        documents: [],
        medicalInfo: {
          allergies: ['Pénicilline'],
          medications: [
            {
              name: 'Lisinopril',
              dosage: '10mg',
              frequency: '1x/jour',
              startDate: new Date('2022-09-01'),
              prescribedBy: 'Dr. Rousseau'
            }
          ]
        },
        createdAt: new Date('2022-08-25'),
        updatedAt: new Date('2022-09-01')
      }
    ];

    const mockResident = mockResidents.find(r => r.id === residentId);
    const residentData = foundResident || mockResident;
    
    if (residentData) {
      setResident(residentData);
      
      // Convertir en format de formulaire
      const formattedData: ResidentFormData = {
        firstName: residentData.firstName,
        lastName: residentData.lastName,
        dateOfBirth: typeof residentData.dateOfBirth === 'string' 
          ? residentData.dateOfBirth.split('T')[0] 
          : new Date(residentData.dateOfBirth).toISOString().split('T')[0],
        gender: residentData.gender,
        status: residentData.status,
        houseId: residentData.houseId || '',
        moveInDate: residentData.moveInDate 
          ? (typeof residentData.moveInDate === 'string' 
              ? residentData.moveInDate.split('T')[0] 
              : new Date(residentData.moveInDate).toISOString().split('T')[0])
          : '',
        emergencyContact: residentData.emergencyContact,
        medicalInfo: {
          allergies: residentData.medicalInfo?.allergies || [],
          medicalConditions: residentData.medicalInfo?.medicalConditions || [],
          medications: residentData.medicalInfo?.medications || [],
          specialNeeds: residentData.medicalInfo?.specialNeeds || ''
        }
      };
      
      setFormData(formattedData);
    } else {
      // Résident non trouvé
      router.push('/residents');
    }
    
    setIsLoading(false);
  };

  // Validation functions
  const validateForm = (): FormErrors => {
    if (!formData) return {};
    
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La date de naissance est requise';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = 'La date de naissance ne peut pas être dans le futur';
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Le genre est requis';
    }

    if (!formData.emergencyContact.name.trim()) {
      newErrors['emergencyContact.name'] = 'Le nom du contact d\'urgence est requis';
    }

    if (!formData.emergencyContact.relationship.trim()) {
      newErrors['emergencyContact.relationship'] = 'La relation est requise';
    }

    if (!formData.emergencyContact.phone.trim()) {
      newErrors['emergencyContact.phone'] = 'Le téléphone est requis';
    } else if (!/^[0-9\s\-\+\(\)]{10,}$/.test(formData.emergencyContact.phone)) {
      newErrors['emergencyContact.phone'] = 'Format de téléphone invalide';
    }

    if (formData.emergencyContact.email && 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emergencyContact.email)) {
      newErrors['emergencyContact.email'] = 'Format d\'email invalide';
    }

    if (formData.moveInDate) {
      const moveInDate = new Date(formData.moveInDate);
      const birthDate = new Date(formData.dateOfBirth);
      if (moveInDate < birthDate) {
        newErrors.moveInDate = 'La date d\'entrée ne peut pas être antérieure à la naissance';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData || !resident) return;
    
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update resident in localStorage via StorageService
      const updatedResident = {
        ...resident,
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth),
        moveInDate: formData.moveInDate ? new Date(formData.moveInDate) : undefined,
        updatedAt: new Date()
      };
      
      StorageService.updateResident(resident.id, updatedResident);
      
      console.log('Résident modifié avec succès:', updatedResident);
      setSubmitStatus('success');
      
      // Redirect after success
      setTimeout(() => {
        router.push('/residents');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    if (!formData) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        if (!prev) return prev;
        const parentValue = prev[parent as keyof ResidentFormData] as any;
        return {
          ...prev,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => prev ? ({
        ...prev,
        [field]: value
      }) : prev);
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addAllergy = () => {
    if (!formData) return;
    if (newAllergy.trim() && !formData.medicalInfo?.allergies.includes(newAllergy.trim())) {
      updateFormData('medicalInfo', {
        ...formData.medicalInfo,
        allergies: [...(formData.medicalInfo?.allergies || []), newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    if (!formData) return;
    updateFormData('medicalInfo', {
      ...formData.medicalInfo,
      allergies: formData.medicalInfo?.allergies.filter(a => a !== allergy) || []
    });
  };

  const addCondition = () => {
    if (!formData) return;
    if (newCondition.trim() && !formData.medicalInfo?.medicalConditions.includes(newCondition.trim())) {
      updateFormData('medicalInfo', {
        ...formData.medicalInfo,
        medicalConditions: [...(formData.medicalInfo?.medicalConditions || []), newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    if (!formData) return;
    updateFormData('medicalInfo', {
      ...formData.medicalInfo,
      medicalConditions: formData.medicalInfo?.medicalConditions.filter(c => c !== condition) || []
    });
  };

  const addMedication = () => {
    if (!formData) return;
    const newMedication: Medication = {
      name: '',
      dosage: '',
      frequency: '',
      startDate: new Date(),
      prescribedBy: ''
    };
    
    updateFormData('medicalInfo', {
      ...formData.medicalInfo,
      medications: [...(formData.medicalInfo?.medications || []), newMedication]
    });
  };

  const updateMedication = (index: number, field: keyof Medication, value: any) => {
    if (!formData) return;
    const medications = [...(formData.medicalInfo?.medications || [])];
    medications[index] = { ...medications[index], [field]: value };
    
    updateFormData('medicalInfo', {
      ...formData.medicalInfo,
      medications
    });
  };

  const removeMedication = (index: number) => {
    if (!formData) return;
    const medications = formData.medicalInfo?.medications.filter((_, i) => i !== index) || [];
    updateFormData('medicalInfo', {
      ...formData.medicalInfo,
      medications
    });
  };

  if (isLoading) {
    return (
      <Layout
        title="Pass21 - Chargement..."
        description="Chargement des données du résident"
        showNavbar={true}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center">
            <Loader className="animate-spin h-8 w-8 text-primary-600 mr-3" />
            <span className="text-lg text-gray-700">Chargement des données du résident...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!formData || !resident) {
    return (
      <Layout
        title="Pass21 - Résident non trouvé"
        description="Le résident demandé n'existe pas"
        showNavbar={true}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Résident non trouvé</h1>
            <p className="text-gray-600 mb-4">Le résident demandé n'existe pas ou a été supprimé.</p>
            <Button onClick={() => router.push('/residents')}>
              Retour à la liste
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Pass21 - Modifier ${resident.firstName} ${resident.lastName}`}
      description="Modifier les informations du résident"
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/residents')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Modifier {resident.firstName} {resident.lastName}</h1>
                  <p className="text-gray-600 mt-1">
                    Mettre à jour les informations du résident
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Informations personnelles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="firstName"
                  label="Prénom"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  required
                  error={errors.firstName}
                />

                <FormInput
                  id="lastName"
                  label="Nom"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  required
                  error={errors.lastName}
                />

                <FormDatePicker
                  id="dateOfBirth"
                  label="Date de naissance"
                  value={formData.dateOfBirth}
                  onChange={(value) => updateFormData('dateOfBirth', value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  error={errors.dateOfBirth}
                />

                <FormSelect
                  id="gender"
                  label="Genre"
                  value={formData.gender}
                  onChange={(value) => updateFormData('gender', value)}
                  options={genderOptions}
                  required
                  error={errors.gender}
                />
              </div>
            </div>

            {/* Housing Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Logement</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  id="houseId"
                  label="Logement"
                  value={formData.houseId}
                  onChange={(value) => updateFormData('houseId', value)}
                  options={availableHouses}
                  error={errors.houseId}
                />

                <FormDatePicker
                  id="moveInDate"
                  label="Date d'entrée"
                  value={formData.moveInDate}
                  onChange={(value) => updateFormData('moveInDate', value)}
                  error={errors.moveInDate}
                />

                <FormSelect
                  id="status"
                  label="Statut"
                  value={formData.status}
                  onChange={(value) => updateFormData('status', value)}
                  options={statusOptions}
                  required
                  error={errors.status}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Contact d'urgence</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="emergencyContact.name"
                  label="Nom complet"
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => updateFormData('emergencyContact.name', e.target.value)}
                  required
                  error={errors['emergencyContact.name']}
                />

                <FormSelect
                  id="emergencyContact.relationship"
                  label="Relation"
                  value={formData.emergencyContact.relationship}
                  onChange={(value) => updateFormData('emergencyContact.relationship', value)}
                  options={relationshipOptions}
                  required
                  error={errors['emergencyContact.relationship']}
                />

                <FormInput
                  id="emergencyContact.phone"
                  label="Téléphone"
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => updateFormData('emergencyContact.phone', e.target.value)}
                  required
                  error={errors['emergencyContact.phone']}
                />

                <FormInput
                  id="emergencyContact.email"
                  label="Email"
                  type="email"
                  value={formData.emergencyContact.email || ''}
                  onChange={(e) => updateFormData('emergencyContact.email', e.target.value)}
                  error={errors['emergencyContact.email']}
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Informations médicales (optionnel)</h2>
              
              {/* Emergency Instructions */}
              <div className="mb-6">
                <FormTextarea
                  id="specialNeeds"
                  label="Besoins spéciaux / Instructions d'urgence"
                  value={formData.medicalInfo?.specialNeeds || ''}
                  onChange={(value) => updateFormData('medicalInfo', {
                    ...formData.medicalInfo,
                    specialNeeds: value
                  })}
                  placeholder="Informations importantes en cas d'urgence médicale..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              {/* Allergies */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Allergies</label>
                
                <div className="flex gap-2 mb-3">
                  <FormInput
                    id="newAllergy"
                    label=""
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Ajouter une allergie..."
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={addAllergy}
                    disabled={!newAllergy.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.medicalInfo?.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => removeAllergy(allergy)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Medical Conditions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Conditions médicales</label>
                
                <div className="flex gap-2 mb-3">
                  <FormInput
                    id="newCondition"
                    label=""
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Ajouter une condition médicale..."
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={addCondition}
                    disabled={!newCondition.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.medicalInfo?.medicalConditions.map((condition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeCondition(condition)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Médicaments</label>
                  <Button type="button" variant="ghost" onClick={addMedication}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un médicament
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {formData.medicalInfo?.medications.map((medication, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Médicament {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          id={`medication-${index}-name`}
                          label="Nom du médicament"
                          type="text"
                          value={medication.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        />
                        
                        <FormInput
                          id={`medication-${index}-dosage`}
                          label="Dosage"
                          type="text"
                          value={medication.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          placeholder="ex: 500mg"
                        />
                        
                        <FormInput
                          id={`medication-${index}-frequency`}
                          label="Fréquence"
                          type="text"
                          value={medication.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          placeholder="ex: 2x/jour"
                        />
                        
                        <FormInput
                          id={`medication-${index}-prescribedBy`}
                          label="Prescrit par"
                          type="text"
                          value={medication.prescribedBy}
                          onChange={(e) => updateMedication(index, 'prescribedBy', e.target.value)}
                          placeholder="Dr. Nom"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 bg-white rounded-lg shadow p-6">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => router.push('/residents')}
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
                  <h3 className="text-sm font-medium text-green-800">Résident modifié avec succès!</h3>
                  <p className="text-sm text-green-700 mt-1">Redirection vers la liste des résidents...</p>
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

export default EditResidentPage;