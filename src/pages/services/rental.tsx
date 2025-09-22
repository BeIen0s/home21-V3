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
  Package, 
  Save,
  Calendar,
  Clock,
  Euro,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Heart,
  Wheelchair,
  Bath,
  Bed
} from 'lucide-react';

enum RentalCategory {
  MEDICAL = 'MEDICAL',
  MOBILITY = 'MOBILITY',
  BATHROOM = 'BATHROOM',
  BEDROOM = 'BEDROOM',
  KITCHEN = 'KITCHEN',
  ELECTRONICS = 'ELECTRONICS',
  COMFORT = 'COMFORT'
}

enum RentalDuration {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

interface RentalItem {
  id: string;
  name: string;
  description: string;
  category: RentalCategory;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  deposit: number;
  availability: number;
  features: string[];
  image: string;
  minRentalDays: number;
  maxRentalDays: number;
  maintenanceRequired: boolean;
  deliveryIncluded: boolean;
}

interface RentalRequest {
  residentId: string;
  items: { itemId: string; quantity: number; duration: RentalDuration }[];
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  specialInstructions?: string;
  urgentRequest: boolean;
  setupAssistance: boolean;
}

const rentalCategories = [
  { id: RentalCategory.MEDICAL, label: 'Matériel médical', icon: '🏥' },
  { id: RentalCategory.MOBILITY, label: 'Aide à la mobilité', icon: '♿' },
  { id: RentalCategory.BATHROOM, label: 'Salle de bain', icon: '🛁' },
  { id: RentalCategory.BEDROOM, label: 'Chambre', icon: '🛏️' },
  { id: RentalCategory.KITCHEN, label: 'Cuisine', icon: '🍽️' },
  { id: RentalCategory.ELECTRONICS, label: 'Électronique', icon: '📱' },
  { id: RentalCategory.COMFORT, label: 'Confort', icon: '🛋️' }
];

const durationOptions = [
  { value: RentalDuration.DAILY, label: 'Journalier' },
  { value: RentalDuration.WEEKLY, label: 'Hebdomadaire' },
  { value: RentalDuration.MONTHLY, label: 'Mensuel' }
];

// Mock rental items data
const mockRentalItems: RentalItem[] = [
  {
    id: '1',
    name: 'Fauteuil roulant électrique',
    description: 'Fauteuil roulant électrique avec joystick, autonomie 15km',
    category: RentalCategory.MOBILITY,
    dailyPrice: 25.00,
    weeklyPrice: 150.00,
    monthlyPrice: 500.00,
    deposit: 200.00,
    availability: 3,
    features: ['Électrique', 'Joystick', 'Pliable', 'Autonomie 15km'],
    image: '/images/wheelchair-electric.jpg',
    minRentalDays: 1,
    maxRentalDays: 90,
    maintenanceRequired: true,
    deliveryIncluded: true
  },
  {
    id: '2',
    name: 'Lit médicalisé électrique',
    description: 'Lit médicalisé avec relevage électrique tête et pieds',
    category: RentalCategory.BEDROOM,
    dailyPrice: 18.00,
    weeklyPrice: 110.00,
    monthlyPrice: 380.00,
    deposit: 300.00,
    availability: 2,
    features: ['Relevage électrique', 'Barrières de sécurité', 'Matelas inclus', 'Télécommande'],
    image: '/images/medical-bed.jpg',
    minRentalDays: 7,
    maxRentalDays: 180,
    maintenanceRequired: true,
    deliveryIncluded: true
  },
  {
    id: '3',
    name: 'Siège de douche pivotant',
    description: 'Siège de douche avec rotation 360°, accoudoirs et dossier',
    category: RentalCategory.BATHROOM,
    dailyPrice: 8.00,
    weeklyPrice: 45.00,
    monthlyPrice: 150.00,
    deposit: 80.00,
    availability: 5,
    features: ['Rotation 360°', 'Accoudoirs', 'Antidérapant', 'Résistant à l\'eau'],
    image: '/images/shower-seat.jpg',
    minRentalDays: 3,
    maxRentalDays: 120,
    maintenanceRequired: false,
    deliveryIncluded: false
  },
  {
    id: '4',
    name: 'Déambulateur avec siège',
    description: 'Déambulateur 4 roues avec siège de repos et panier',
    category: RentalCategory.MOBILITY,
    dailyPrice: 12.00,
    weeklyPrice: 70.00,
    monthlyPrice: 220.00,
    deposit: 120.00,
    availability: 8,
    features: ['4 roues', 'Siège de repos', 'Panier de rangement', 'Freins à main'],
    image: '/images/walker-seat.jpg',
    minRentalDays: 1,
    maxRentalDays: 90,
    maintenanceRequired: false,
    deliveryIncluded: false
  },
  {
    id: '5',
    name: 'Concentrateur d\'oxygène',
    description: 'Concentrateur d\'oxygène portable 5L/min avec batterie',
    category: RentalCategory.MEDICAL,
    dailyPrice: 35.00,
    weeklyPrice: 220.00,
    monthlyPrice: 750.00,
    deposit: 500.00,
    availability: 1,
    features: ['5L/min', 'Batterie 4h', 'Portable', 'Écran LCD', 'Alarmes de sécurité'],
    image: '/images/oxygen-concentrator.jpg',
    minRentalDays: 7,
    maxRentalDays: 365,
    maintenanceRequired: true,
    deliveryIncluded: true
  },
  {
    id: '6',
    name: 'Matelas anti-escarres',
    description: 'Matelas pneumatique anti-escarres avec compresseur',
    category: RentalCategory.BEDROOM,
    dailyPrice: 15.00,
    weeklyPrice: 90.00,
    monthlyPrice: 300.00,
    deposit: 150.00,
    availability: 4,
    features: ['Pneumatique', 'Compresseur inclus', 'Réglage pression', 'Anti-escarres'],
    image: '/images/anti-bedsore-mattress.jpg',
    minRentalDays: 7,
    maxRentalDays: 180,
    maintenanceRequired: true,
    deliveryIncluded: true
  }
];

const RentalServicePage: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<RentalCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: { quantity: number; duration: RentalDuration } }>({});
  const [formData, setFormData] = useState<Partial<RentalRequest>>({
    startDate: '',
    endDate: '',
    deliveryAddress: 'Résidence Pass21, Rue de la Résidence, Paris',
    urgentRequest: false,
    setupAssistance: false,
    specialInstructions: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateItemSelection = (itemId: string, quantity: number, duration: RentalDuration) => {
    if (quantity === 0) {
      setSelectedItems(prev => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [itemId]: { quantity, duration }
      }));
    }

    // Update formData items
    const items = Object.entries({ ...selectedItems, [itemId]: { quantity, duration } })
      .filter(([_, config]) => config.quantity > 0)
      .map(([itemId, config]) => ({ 
        itemId, 
        quantity: config.quantity, 
        duration: config.duration 
      }));
    
    updateFormData('items', items);
  };

  const getFilteredItems = () => {
    return mockRentalItems.filter(item => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  const calculateItemPrice = (item: RentalItem, quantity: number, duration: RentalDuration) => {
    const pricePerUnit = duration === RentalDuration.DAILY ? item.dailyPrice :
                        duration === RentalDuration.WEEKLY ? item.weeklyPrice :
                        item.monthlyPrice;
    return pricePerUnit * quantity;
  };

  const calculateTotalCost = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, config]) => {
      const item = mockRentalItems.find(i => i.id === itemId);
      return total + (item ? calculateItemPrice(item, config.quantity, config.duration) : 0);
    }, 0);
  };

  const calculateTotalDeposit = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, config]) => {
      const item = mockRentalItems.find(i => i.id === itemId);
      return total + (item ? item.deposit * config.quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, config) => sum + config.quantity, 0);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Date de début requise';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'Date de fin requise';
    }
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
    }
    if (!formData.items || formData.items.length === 0) {
      newErrors.items = 'Au moins un équipement doit être sélectionné';
    }
    if (!formData.deliveryAddress?.trim()) {
      newErrors.deliveryAddress = 'Adresse de livraison requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const request: RentalRequest = {
        residentId: '1', // Mock resident ID
        items: formData.items!,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        deliveryAddress: formData.deliveryAddress!,
        specialInstructions: formData.specialInstructions,
        urgentRequest: formData.urgentRequest!,
        setupAssistance: formData.setupAssistance!
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Rental request submitted:', request);
      alert(`Demande de location envoyée ! Total: ${calculateTotalCost().toFixed(2)}€ + ${calculateTotalDeposit().toFixed(2)}€ de caution`);
      router.push('/services');
    } catch (error) {
      console.error('Error submitting rental request:', error);
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Pass21 - Location d'Équipements"
      description="Louez du matériel médical et d'assistance"
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  <Package className="h-6 w-6 mr-3 text-purple-600" />
                  Location d'Équipements
                </h1>
                <p className="text-gray-600 mt-1">
                  Matériel médical et d'assistance à domicile
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters and Items */}
            <div className="lg:col-span-3 space-y-6">
              {/* Rental Period */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Période de location</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormDatePicker
                    id="startDate"
                    label="Date de début"
                    value={formData.startDate || ''}
                    onChange={(value) => updateFormData('startDate', value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    error={errors.startDate}
                  />

                  <FormDatePicker
                    id="endDate"
                    label="Date de fin"
                    value={formData.endDate || ''}
                    onChange={(value) => updateFormData('endDate', value)}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                    error={errors.endDate}
                  />

                  <FormInput
                    id="deliveryAddress"
                    label="Adresse de livraison"
                    type="text"
                    value={formData.deliveryAddress || ''}
                    onChange={(value) => updateFormData('deliveryAddress', value)}
                    required
                    error={errors.deliveryAddress}
                  />
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher un équipement..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as RentalCategory | 'ALL')}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="ALL">Toutes catégories</option>
                      {rentalCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-3 py-2 text-sm rounded-full transition-colors ${
                      selectedCategory === 'ALL'
                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tout voir
                  </button>
                  {rentalCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-2 text-sm rounded-full transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-purple-100 text-purple-700 border border-purple-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.icon} {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getFilteredItems().map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {item.availability > 0 ? (
                          <div className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {item.availability} dispo
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600 text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Indisponible
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{item.dailyPrice.toFixed(2)}€</div>
                          <div className="text-gray-500">/ jour</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{item.weeklyPrice.toFixed(2)}€</div>
                          <div className="text-gray-500">/ semaine</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{item.monthlyPrice.toFixed(2)}€</div>
                          <div className="text-gray-500">/ mois</div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        Caution: {item.deposit.toFixed(2)}€ • 
                        {item.deliveryIncluded ? ' Livraison incluse' : ' Livraison en sus'} •
                        {item.maintenanceRequired ? ' Maintenance incluse' : ' Pas de maintenance'}
                      </div>

                      {item.availability > 0 && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <FormSelect
                              id={`quantity-${item.id}`}
                              label="Quantité"
                              value={selectedItems[item.id]?.quantity.toString() || '0'}
                              onChange={(value) => {
                                const quantity = parseInt(value);
                                const duration = selectedItems[item.id]?.duration || RentalDuration.DAILY;
                                updateItemSelection(item.id, quantity, duration);
                              }}
                              options={[
                                { value: '0', label: 'Non sélectionné' },
                                ...Array.from({ length: Math.min(item.availability, 5) }, (_, i) => ({
                                  value: (i + 1).toString(),
                                  label: (i + 1).toString()
                                }))
                              ]}
                            />

                            <FormSelect
                              id={`duration-${item.id}`}
                              label="Durée"
                              value={selectedItems[item.id]?.duration || RentalDuration.DAILY}
                              onChange={(value) => {
                                const quantity = selectedItems[item.id]?.quantity || 1;
                                updateItemSelection(item.id, quantity, value as RentalDuration);
                              }}
                              options={durationOptions}
                              disabled={!selectedItems[item.id]?.quantity}
                            />
                          </div>

                          {selectedItems[item.id]?.quantity > 0 && (
                            <div className="bg-purple-50 p-3 rounded-lg text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-purple-700">
                                  Sous-total ({selectedItems[item.id].quantity}x):
                                </span>
                                <span className="font-semibold text-purple-900">
                                  {calculateItemPrice(
                                    item, 
                                    selectedItems[item.id].quantity, 
                                    selectedItems[item.id].duration
                                  ).toFixed(2)}€
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs text-purple-600 mt-1">
                                <span>Caution:</span>
                                <span>{(item.deposit * selectedItems[item.id].quantity).toFixed(2)}€</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {getFilteredItems().length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Aucun équipement trouvé</p>
                  <p className="text-sm text-gray-400">Essayez de modifier vos critères de recherche</p>
                </div>
              )}

              {/* Additional Options */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Options supplémentaires</h2>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="setupAssistance"
                        checked={formData.setupAssistance || false}
                        onChange={(e) => updateFormData('setupAssistance', e.target.checked)}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="setupAssistance" className="ml-2 text-sm text-gray-700">
                        Assistance à l'installation (recommandée) - <span className="font-medium text-purple-600">+30€</span>
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
                      <label htmlFor="urgentRequest" className="ml-2 text-sm text-gray-700 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                        Livraison urgente (sous 4h) - <span className="font-medium text-red-600">+50€</span>
                      </label>
                    </div>
                  </div>

                  <FormTextarea
                    id="specialInstructions"
                    label="Instructions spéciales"
                    value={formData.specialInstructions || ''}
                    onChange={(value) => updateFormData('specialInstructions', value)}
                    placeholder="Étage, code d'accès, créneaux de livraison préférés, besoins spécifiques..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Rental Summary */}
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Récapitulatif</h3>
                
                {getTotalItems() === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Aucun équipement sélectionné</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(selectedItems)
                      .filter(([_, config]) => config.quantity > 0)
                      .map(([itemId, config]) => {
                        const item = mockRentalItems.find(i => i.id === itemId);
                        if (!item) return null;
                        
                        return (
                          <div key={itemId} className="border-b border-gray-100 pb-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-gray-500">
                                  {config.quantity}x • {durationOptions.find(d => d.value === config.duration)?.label}
                                </div>
                              </div>
                              <div className="text-purple-600 font-medium text-sm">
                                {calculateItemPrice(item, config.quantity, config.duration).toFixed(2)}€
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    
                    <div className="space-y-2 pt-3">
                      <div className="flex justify-between text-sm">
                        <span>Sous-total location:</span>
                        <span className="font-medium">{calculateTotalCost().toFixed(2)}€</span>
                      </div>
                      
                      {formData.setupAssistance && (
                        <div className="flex justify-between text-sm text-purple-600">
                          <span>Assistance installation:</span>
                          <span>30,00€</span>
                        </div>
                      )}
                      
                      {formData.urgentRequest && (
                        <div className="flex justify-between text-sm text-red-600">
                          <span>Livraison urgente:</span>
                          <span>50,00€</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm border-t pt-2">
                        <span>Caution (remboursable):</span>
                        <span className="font-medium text-orange-600">{calculateTotalDeposit().toFixed(2)}€</span>
                      </div>
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total à régler:</span>
                          <span className="text-purple-600">
                            {(calculateTotalCost() + 
                              (formData.setupAssistance ? 30 : 0) + 
                              (formData.urgentRequest ? 50 : 0) + 
                              calculateTotalDeposit()
                            ).toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {errors.items && (
                  <p className="text-red-500 text-sm mt-2">{errors.items}</p>
                )}

                <div className="mt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || getTotalItems() === 0}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Réserver ({getTotalItems()} équipements)
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Service Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Service</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Disponibilité</div>
                      <div className="text-gray-600">Livraison 7j/7 de 8h à 18h</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Euro className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Tarification dégressif</div>
                      <div className="text-gray-600">Plus la location est longue, moins c'est cher</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Heart className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Matériel contrôlé</div>
                      <div className="text-gray-600">Désinfection et vérification avant livraison</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-700">
                    <strong>Caution:</strong> Remboursée intégralement au retour si l'équipement n'est pas endommagé
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default RentalServicePage;