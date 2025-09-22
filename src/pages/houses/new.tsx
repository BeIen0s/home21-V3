import React, { useState } from 'react';
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
  Home
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

const initialFormData: HouseFormData = {
  name: '',
  type: '',
  floor: 1,
  surface: 0,
  maxOccupancy: 1,
  address: '',
  monthlyRent: 0,
  amenities: [],
  accessibility: [],
  status: 'AVAILABLE'
};

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

const NewHousePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<HouseFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [newAccessibility, setNewAccessibility] = useState('');

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addAccessibility = () => {
    if (newAccessibility.trim() && !formData.accessibility.includes(newAccessibility.trim())) {
      setFormData(prev => ({
        ...prev,
        accessibility: [...prev.accessibility, newAccessibility.trim()]
      }));
      setNewAccessibility('');
    }
  };

  const removeAccessibility = (accessibility: string) => {
    setFormData(prev => ({
      ...prev,
      accessibility: prev.accessibility.filter(a => a !== accessibility)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('House created:', formData);
      router.push('/houses');
    } catch (error) {
      console.error('Error creating house:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Pass21 - Nouveau Logement"
      description="Ajouter un nouveau logement à la résidence Pass21"
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
                  Nouveau Logement
                </h1>
                <p className="text-gray-600 mt-1">
                  Ajouter un nouveau logement à la résidence Pass21
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
                  label="Statut initial"
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
                    Enregistrer
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

export default NewHousePage;