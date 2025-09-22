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
  Car, 
  Save,
  MapPin,
  Clock,
  User,
  Phone
} from 'lucide-react';

enum AppointmentType {
  MEDICAL = 'MEDICAL',
  SHOPPING = 'SHOPPING',
  SOCIAL = 'SOCIAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  FAMILY_VISIT = 'FAMILY_VISIT',
  OTHER = 'OTHER'
}

enum VehicleType {
  STANDARD = 'STANDARD',
  WHEELCHAIR_ACCESSIBLE = 'WHEELCHAIR_ACCESSIBLE',
  MEDICAL_TRANSPORT = 'MEDICAL_TRANSPORT'
}

interface DriverRequest {
  residentId: string;
  appointmentType: AppointmentType;
  vehicleType: VehicleType;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  destinationAddress: string;
  returnTrip: boolean;
  returnTime?: string;
  accompaniment: boolean;
  estimatedDuration: number;
  specialRequirements?: string;
  contactNumber: string;
  urgentRequest: boolean;
}

const appointmentTypes = [
  { value: '', label: 'Sélectionnez le type de rendez-vous' },
  { value: AppointmentType.MEDICAL, label: 'Rendez-vous médical' },
  { value: AppointmentType.SHOPPING, label: 'Courses / Shopping' },
  { value: AppointmentType.SOCIAL, label: 'Visite sociale' },
  { value: AppointmentType.ADMINISTRATIVE, label: 'Démarches administratives' },
  { value: AppointmentType.FAMILY_VISIT, label: 'Visite familiale' },
  { value: AppointmentType.OTHER, label: 'Autre' }
];

const vehicleTypes = [
  { value: '', label: 'Sélectionnez le type de véhicule' },
  { value: VehicleType.STANDARD, label: 'Véhicule standard' },
  { value: VehicleType.WHEELCHAIR_ACCESSIBLE, label: 'Véhicule PMR (fauteuil roulant)' },
  { value: VehicleType.MEDICAL_TRANSPORT, label: 'Transport médical spécialisé' }
];

const timeSlots = Array.from({ length: 19 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minute = i % 2 === 0 ? '00' : '30';
  const time = `${hour.toString().padStart(2, '0')}:${minute}`;
  return { value: time, label: time };
});

const DriverServicePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<DriverRequest>>({
    appointmentType: '',
    vehicleType: VehicleType.STANDARD,
    pickupAddress: 'Résidence Pass21, Rue de la Résidence, Paris',
    returnTrip: true,
    accompaniment: false,
    estimatedDuration: 60,
    urgentRequest: false,
    contactNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.appointmentType) {
      newErrors.appointmentType = 'Type de rendez-vous requis';
    }
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Type de véhicule requis';
    }
    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Date de départ requise';
    }
    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Heure de départ requise';
    }
    if (!formData.destinationAddress?.trim()) {
      newErrors.destinationAddress = 'Adresse de destination requise';
    }
    if (!formData.contactNumber?.trim()) {
      newErrors.contactNumber = 'Numéro de contact requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCost = () => {
    const baseCost = 15; // Base cost
    const durationCost = (formData.estimatedDuration || 60) * 0.25; // €0.25 per minute
    const vehicleMultiplier = formData.vehicleType === VehicleType.STANDARD ? 1 : 1.5;
    const accompanimentCost = formData.accompaniment ? 10 : 0;
    
    return (baseCost + durationCost + accompanimentCost) * vehicleMultiplier;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const request: DriverRequest = {
        residentId: '1', // Mock resident ID
        appointmentType: formData.appointmentType as AppointmentType,
        vehicleType: formData.vehicleType as VehicleType,
        pickupDate: formData.pickupDate!,
        pickupTime: formData.pickupTime!,
        pickupAddress: formData.pickupAddress!,
        destinationAddress: formData.destinationAddress!,
        returnTrip: formData.returnTrip!,
        returnTime: formData.returnTime,
        accompaniment: formData.accompaniment!,
        estimatedDuration: formData.estimatedDuration!,
        specialRequirements: formData.specialRequirements,
        contactNumber: formData.contactNumber!,
        urgentRequest: formData.urgentRequest!
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Driver request submitted:', request);
      alert('Votre demande de transport a été envoyée ! Un chauffeur vous contactera pour confirmer.');
      router.push('/services');
    } catch (error) {
      console.error('Error submitting driver request:', error);
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Pass21 - Service Chauffeur"
      description="Réservez un transport avec chauffeur"
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
                onClick={() => router.push('/services')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux services
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Car className="h-6 w-6 mr-3 text-blue-600" />
                  Service Chauffeur
                </h1>
                <p className="text-gray-600 mt-1">
                  Réservez un transport pour vos déplacements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Appointment Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Détails du rendez-vous</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    id="appointmentType"
                    label="Type de rendez-vous"
                    value={formData.appointmentType || ''}
                    onChange={(value) => updateFormData('appointmentType', value)}
                    options={appointmentTypes}
                    required
                    error={errors.appointmentType}
                  />

                  <FormSelect
                    id="vehicleType"
                    label="Type de véhicule"
                    value={formData.vehicleType || ''}
                    onChange={(value) => updateFormData('vehicleType', value)}
                    options={vehicleTypes}
                    required
                    error={errors.vehicleType}
                  />

                  <FormDatePicker
                    id="pickupDate"
                    label="Date de départ"
                    value={formData.pickupDate || ''}
                    onChange={(value) => updateFormData('pickupDate', value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    error={errors.pickupDate}
                  />

                  <FormSelect
                    id="pickupTime"
                    label="Heure de départ"
                    value={formData.pickupTime || ''}
                    onChange={(value) => updateFormData('pickupTime', value)}
                    options={[
                      { value: '', label: 'Sélectionnez l\'heure' },
                      ...timeSlots
                    ]}
                    required
                    error={errors.pickupTime}
                  />
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Itinéraire</h2>
                
                <div className="space-y-6">
                  <FormInput
                    id="pickupAddress"
                    label="Adresse de départ"
                    type="text"
                    value={formData.pickupAddress || ''}
                    onChange={(value) => updateFormData('pickupAddress', value)}
                    required
                  />

                  <FormInput
                    id="destinationAddress"
                    label="Adresse de destination"
                    type="text"
                    value={formData.destinationAddress || ''}
                    onChange={(value) => updateFormData('destinationAddress', value)}
                    placeholder="ex: Hôpital Saint-Louis, 1 Avenue Claude Vellefaux, Paris"
                    required
                    error={errors.destinationAddress}
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="returnTrip"
                      checked={formData.returnTrip || false}
                      onChange={(e) => updateFormData('returnTrip', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="returnTrip" className="ml-2 text-sm text-gray-700">
                      Trajet aller-retour (le chauffeur vous attendra)
                    </label>
                  </div>

                  {formData.returnTrip && (
                    <FormSelect
                      id="returnTime"
                      label="Heure de retour prévue"
                      value={formData.returnTime || ''}
                      onChange={(value) => updateFormData('returnTime', value)}
                      options={[
                        { value: '', label: 'Non définie (le chauffeur attendra)' },
                        ...timeSlots
                      ]}
                    />
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Options et informations</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      id="estimatedDuration"
                      label="Durée estimée (minutes)"
                      type="number"
                      value={formData.estimatedDuration?.toString() || '60'}
                      onChange={(value) => updateFormData('estimatedDuration', parseInt(value) || 60)}
                      min={15}
                      max={480}
                    />

                    <FormInput
                      id="contactNumber"
                      label="Numéro de contact"
                      type="tel"
                      value={formData.contactNumber || ''}
                      onChange={(value) => updateFormData('contactNumber', value)}
                      placeholder="06 12 34 56 78"
                      required
                      error={errors.contactNumber}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="accompaniment"
                        checked={formData.accompaniment || false}
                        onChange={(e) => updateFormData('accompaniment', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="accompaniment" className="ml-2 text-sm text-gray-700">
                        Demander un accompagnement (assistant pour vous aider) - <span className="font-medium">+10€</span>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="urgentRequest"
                        checked={formData.urgentRequest || false}
                        onChange={(e) => updateFormData('urgentRequest', e.target.checked)}
                        className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="urgentRequest" className="ml-2 text-sm text-gray-700">
                        Demande urgente (départ dans les 2 heures)
                      </label>
                    </div>
                  </div>

                  <FormTextarea
                    id="specialRequirements"
                    label="Exigences particulières"
                    value={formData.specialRequirements || ''}
                    onChange={(value) => updateFormData('specialRequirements', value)}
                    placeholder="Mobilité réduite, matériel médical à transporter, arrêts supplémentaires..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              {/* Cost Estimate */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Récapitulatif</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tarif de base</span>
                    <span className="font-medium">15,00€</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée ({formData.estimatedDuration || 60} min)</span>
                    <span className="font-medium">
                      {((formData.estimatedDuration || 60) * 0.25).toFixed(2)}€
                    </span>
                  </div>
                  
                  {formData.vehicleType && formData.vehicleType !== VehicleType.STANDARD && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Véhicule spécialisé (+50%)</span>
                      <span className="font-medium">
                        +{(((15 + (formData.estimatedDuration || 60) * 0.25) * 0.5)).toFixed(2)}€
                      </span>
                    </div>
                  )}
                  
                  {formData.accompaniment && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accompagnement</span>
                      <span className="font-medium">10,00€</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total estimé</span>
                      <span className="text-blue-600">{calculateCost().toFixed(2)}€</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> Le prix final peut varier selon la distance réelle et les conditions de circulation.
                  </p>
                </div>
              </div>

              {/* Service Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Service</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Délai de réservation</div>
                      <div className="text-gray-600">Minimum 2h à l'avance (sauf urgence)</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Chauffeurs qualifiés</div>
                      <div className="text-gray-600">Formés à l'assistance aux seniors</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Contact d'urgence</div>
                      <div className="text-gray-600">07 24 84 56 78 (24h/24)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Réserver le transport
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DriverServicePage;