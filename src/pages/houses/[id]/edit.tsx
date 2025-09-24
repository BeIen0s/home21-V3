import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2,
  Home,
  Loader,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface HouseFormData {
  name: string;
  type: string;
  floor: number;
  surface: number;
  maxOccupancy: number;
  address: string;
  monthlyRent: number;
  amenities: string[];
  accessibility: string[];
  status: string;
}

interface House {
  id: string;
  name: string;
  type: string;
  floor: number;
  surface: number;
  maxOccupancy: number;
  address: string;
  status: string;
  amenities: string[];
  accessibility: string[];
  monthlyRent: number;
  currentResident?: {
    id: string;
    name: string;
    moveInDate: Date;
  };
  lastMaintenance?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const houseTypes = [
  { value: '', label: 'Sélectionnez le type' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'T1', label: 'T1' },
  { value: 'T2', label: 'T2' },
  { value: 'T3', label: 'T3' }
];

const statusOptions = [
  { value: 'AVAILABLE', label: 'Disponible' },
  { value: 'OCCUPIED', label: 'Occupé' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'RESERVED', label: 'Réservé' },
  { value: 'OUT_OF_SERVICE', label: 'Hors service' }
];

const EditHousePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [house, setHouse] = useState<House | null>(null);
  const [formData, setFormData] = useState<HouseFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newAmenity, setNewAmenity] = useState('');
  const [newAccessibility, setNewAccessibility] = useState('');

  // Mock data - en production, ceci viendrait d'une API
  const mockHouses: House[] = [
    {
      id: '1A',
      name: 'Maison 1A',
      type: 'STUDIO',
      floor: 1,
      surface: 35,
      maxOccupancy: 1,
      address: '1A Rue de la Résidence, 75001 Paris',
      status: 'OCCUPIED',
      amenities: ['Kitchenette', 'Salle de bain privée', 'Balcon'],
      accessibility: ['Accès PMR', 'Barres d\'appui'],
      monthlyRent: 1200,
      currentResident: {
        id: '1',
        name: 'Marie Dupont',
        moveInDate: new Date('2023-01-15')
      },
      lastMaintenance: new Date('2023-10-15'),
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2023-10-15')
    },
    {
      id: '2B',
      name: 'Maison 2B',
      type: 'T2',
      floor: 2,
      surface: 55,
      maxOccupancy: 2,
      address: '2B Rue de la Résidence, 75001 Paris',
      status: 'AVAILABLE',
      amenities: ['Cuisine équipée', 'Salon séparé', 'Salle de bain'],
      accessibility: [],
      monthlyRent: 1500,
      lastMaintenance: new Date('2023-11-01'),
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2023-11-01')
    },
    {
      id: '3C',
      name: 'Maison 3C',
      type: 'STUDIO',
      floor: 3,
      surface: 32,
      maxOccupancy: 1,
      address: '3C Rue de la Résidence, 75001 Paris',
      status: 'MAINTENANCE',
      amenities: ['Kitchenette', 'Salle de bain'],
      accessibility: [],
      monthlyRent: 1100,
      lastMaintenance: new Date('2023-11-20'),
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2023-11-20')
    }
  ];

  useEffect(() => {
    if (id) {
      loadHouse(id as string);
    }
  }, [id]);

  const loadHouse = (houseId: string) => {
    setIsLoading(true);
    
    // Simuler un délai d'API
    setTimeout(() => {
      const foundHouse = mockHouses.find(h => h.id === houseId);
      
      if (foundHouse) {
        setHouse(foundHouse);
        setFormData({
          name: foundHouse.name,
          type: foundHouse.type,
          floor: foundHouse.floor,
          surface: foundHouse.surface,
          maxOccupancy: foundHouse.maxOccupancy,
          address: foundHouse.address,
          monthlyRent: foundHouse.monthlyRent,
          amenities: [...foundHouse.amenities],
          accessibility: [...foundHouse.accessibility],
          status: foundHouse.status
        });
      } else {
        router.push('/houses');
      }
      
      setIsLoading(false);
    }, 500);
  };

  const updateFormData = (field: string, value: any) => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : prev);
  };

  const addAmenity = () => {
    if (!formData) return;
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => prev ? ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }) : prev);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }) : prev);
  };

  const addAccessibility = () => {
    if (!formData) return;
    if (newAccessibility.trim() && !formData.accessibility.includes(newAccessibility.trim())) {
      setFormData(prev => prev ? ({
        ...prev,
        accessibility: [...prev.accessibility, newAccessibility.trim()]
      }) : prev);
      setNewAccessibility('');
    }
  };

  const removeAccessibility = (accessibility: string) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      accessibility: prev.accessibility.filter(a => a !== accessibility)
    }) : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData || !house) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Logement modifié:', { ...house, ...formData });
      setSubmitStatus('success');
      
      // Redirect after success
      setTimeout(() => {
        router.push('/houses');
      }, 1500);
      
    } catch (error) {
      console.error('Error updating house:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout
        title="Pass21 - Chargement..."
        description="Chargement des données du logement"
        showNavbar={true}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center">
            <Loader className="animate-spin h-8 w-8 text-primary-600 mr-3" />
            <span className="text-lg text-gray-700">Chargement des données du logement...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!formData || !house) {
    return (
      <Layout
        title="Pass21 - Logement non trouvé"
        description="Le logement demandé n'existe pas"
        showNavbar={true}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Logement non trouvé</h1>
            <p className="text-gray-600 mb-4">Le logement demandé n'existe pas ou a été supprimé.</p>
            <Button onClick={() => router.push('/houses')}>
              Retour à la liste
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Pass21 - Modifier ${house.name}`}
      description="Modifier les informations du logement"
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
                onClick={() => router.push('/houses')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Home className="h-6 w-6 mr-3 text-primary-600" />
                  Modifier {house.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  Mettre à jour les informations du logement
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="name"
                  label="Nom du logement"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="ex: Maison 1A"
                  required
                />

                <FormSelect
                  id="type"
                  label="Type"
                  value={formData.type}
                  onChange={(value) => updateFormData('type', value)}
                  options={houseTypes}
                  required
                />

                <FormInput
                  id="floor"
                  label="Étage"
                  type="number"
                  value={formData.floor.toString()}
                  onChange={(e) => updateFormData('floor', parseInt(e.target.value) || 1)}
                  min={0}
                  required
                />

                <FormInput
                  id="surface"
                  label="Surface (m²)"
                  type="number"
                  value={formData.surface.toString()}
                  onChange={(e) => updateFormData('surface', parseInt(e.target.value) || 0)}
                  min={1}
                  required
                />

                <FormInput
                  id="maxOccupancy"
                  label="Capacité maximale"
                  type="number"
                  value={formData.maxOccupancy.toString()}
                  onChange={(e) => updateFormData('maxOccupancy', parseInt(e.target.value) || 1)}
                  min={1}
                  max={10}
                  required
                />

                <FormInput
                  id="monthlyRent"
                  label="Loyer mensuel (€)"
                  type="number"
                  value={formData.monthlyRent.toString()}
                  onChange={(e) => updateFormData('monthlyRent', parseInt(e.target.value) || 0)}
                  min={0}
                  required
                />
              </div>

              <div className="mt-6">
                <FormTextarea
                  id="address"
                  label="Adresse complète"
                  value={formData.address}
                  onChange={(value) => updateFormData('address', value)}
                  placeholder="Adresse complète du logement..."
                  rows={2}
                  required
                />
              </div>

              <div className="mt-6">
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

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Équipements</h2>
              
              <div className="flex gap-2 mb-3">
                <FormInput
                  id="newAmenity"
                  label=""
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Ajouter un équipement..."
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={addAmenity}
                  disabled={!newAmenity.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Accessibilité</h2>
              
              <div className="flex gap-2 mb-3">
                <FormInput
                  id="newAccessibility"
                  label=""
                  type="text"
                  value={newAccessibility}
                  onChange={(e) => setNewAccessibility(e.target.value)}
                  placeholder="Ajouter une caractéristique d'accessibilité..."
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={addAccessibility}
                  disabled={!newAccessibility.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.accessibility.map((accessibility, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800"
                  >
                    {accessibility}
                    <button
                      type="button"
                      onClick={() => removeAccessibility(accessibility)}
                      className="ml-2 text-success-600 hover:text-success-800"
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
                onClick={() => router.push('/houses')}
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
                  <h3 className="text-sm font-medium text-green-800">Logement modifié avec succès!</h3>
                  <p className="text-sm text-green-700 mt-1">Redirection vers la liste des logements...</p>
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

export default EditHousePage;