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
  UtensilsCrossed, 
  Save,
  Plus,
  Minus,
  Clock,
  ChefHat,
  Heart,
  AlertCircle
} from 'lucide-react';

enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK'
}

enum DietaryRestriction {
  VEGETARIAN = 'VEGETARIAN',
  VEGAN = 'VEGAN',
  GLUTEN_FREE = 'GLUTEN_FREE',
  DIABETIC = 'DIABETIC',
  LOW_SODIUM = 'LOW_SODIUM',
  HEART_HEALTHY = 'HEART_HEALTHY',
  SOFT_DIET = 'SOFT_DIET',
  HALAL = 'HALAL',
  KOSHER = 'KOSHER'
}

interface MealItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryInfo: DietaryRestriction[];
  calories: number;
  preparationTime: number;
  available: boolean;
}

interface MealOrder {
  residentId: string;
  deliveryDate: string;
  deliveryTime: string;
  mealType: MealType;
  items: { itemId: string; quantity: number }[];
  dietaryRestrictions: DietaryRestriction[];
  specialInstructions?: string;
  recurringWeekly: boolean;
  urgentOrder: boolean;
}

interface MealFormData {
  mealType?: MealType | '';
  deliveryDate?: string;
  deliveryTime?: string;
  dietaryRestrictions?: DietaryRestriction[];
  items?: { itemId: string; quantity: number }[];
  recurringWeekly?: boolean;
  urgentOrder?: boolean;
  specialInstructions?: string;
}

const mealTypes = [
  { value: '', label: 'Sélectionnez le type de repas' },
  { value: MealType.BREAKFAST, label: 'Petit-déjeuner (7h-10h)' },
  { value: MealType.LUNCH, label: 'Déjeuner (12h-14h)' },
  { value: MealType.DINNER, label: 'Dîner (18h-20h)' },
  { value: MealType.SNACK, label: 'Collation (15h-17h)' }
];

const dietaryRestrictions = [
  { id: DietaryRestriction.VEGETARIAN, label: 'Végétarien', icon: '🥗' },
  { id: DietaryRestriction.VEGAN, label: 'Végan', icon: '🌱' },
  { id: DietaryRestriction.GLUTEN_FREE, label: 'Sans gluten', icon: '🚫🌾' },
  { id: DietaryRestriction.DIABETIC, label: 'Diabétique', icon: '💉' },
  { id: DietaryRestriction.LOW_SODIUM, label: 'Faible en sodium', icon: '🧂' },
  { id: DietaryRestriction.HEART_HEALTHY, label: 'Bon pour le cœur', icon: '❤️' },
  { id: DietaryRestriction.SOFT_DIET, label: 'Alimentation molle', icon: '🥄' },
  { id: DietaryRestriction.HALAL, label: 'Halal', icon: '☪️' },
  { id: DietaryRestriction.KOSHER, label: 'Casher', icon: '✡️' }
];

// Mock menu data
const mockMenuItems: MealItem[] = [
  {
    id: '1',
    name: 'Soupe de légumes maison',
    description: 'Soupe onctueuse aux légumes de saison, riche en vitamines',
    price: 6.50,
    category: 'Entrées',
    dietaryInfo: [DietaryRestriction.VEGETARIAN, DietaryRestriction.VEGAN, DietaryRestriction.GLUTEN_FREE],
    calories: 120,
    preparationTime: 5,
    available: true
  },
  {
    id: '2',
    name: 'Saumon grillé aux herbes',
    description: 'Filet de saumon grillé avec herbes fraîches et légumes vapeur',
    price: 14.90,
    category: 'Plats principaux',
    dietaryInfo: [DietaryRestriction.HEART_HEALTHY, DietaryRestriction.GLUTEN_FREE],
    calories: 380,
    preparationTime: 15,
    available: true
  },
  {
    id: '3',
    name: 'Risotto aux champignons',
    description: 'Risotto crémeux aux champignons forestiers',
    price: 12.50,
    category: 'Plats principaux',
    dietaryInfo: [DietaryRestriction.VEGETARIAN],
    calories: 450,
    preparationTime: 20,
    available: true
  },
  {
    id: '4',
    name: 'Compote de fruits sans sucre',
    description: 'Compote maison aux fruits de saison, sans sucre ajouté',
    price: 4.50,
    category: 'Desserts',
    dietaryInfo: [DietaryRestriction.DIABETIC, DietaryRestriction.VEGAN, DietaryRestriction.GLUTEN_FREE],
    calories: 85,
    preparationTime: 2,
    available: true
  },
  {
    id: '5',
    name: 'Blanquette de veau traditionnelle',
    description: 'Blanquette de veau aux légumes anciens, sauce onctueuse',
    price: 16.80,
    category: 'Plats principaux',
    dietaryInfo: [DietaryRestriction.SOFT_DIET],
    calories: 520,
    preparationTime: 25,
    available: true
  },
  {
    id: '6',
    name: 'Salade méditerranéenne',
    description: 'Salade fraîche aux légumes méditerranéens et feta',
    price: 9.90,
    category: 'Entrées',
    dietaryInfo: [DietaryRestriction.VEGETARIAN, DietaryRestriction.HEART_HEALTHY],
    calories: 250,
    preparationTime: 8,
    available: true
  }
];

const deliveryTimes = [
  { value: '', label: 'Sélectionnez l\'heure de livraison' },
  { value: '07:00', label: '7h00' },
  { value: '07:30', label: '7h30' },
  { value: '08:00', label: '8h00' },
  { value: '08:30', label: '8h30' },
  { value: '09:00', label: '9h00' },
  { value: '09:30', label: '9h30' },
  { value: '12:00', label: '12h00' },
  { value: '12:30', label: '12h30' },
  { value: '13:00', label: '13h00' },
  { value: '13:30', label: '13h30' },
  { value: '15:00', label: '15h00' },
  { value: '15:30', label: '15h30' },
  { value: '16:00', label: '16h00' },
  { value: '16:30', label: '16h30' },
  { value: '18:00', label: '18h00' },
  { value: '18:30', label: '18h30' },
  { value: '19:00', label: '19h00' },
  { value: '19:30', label: '19h30' }
];

const MealOrderingPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<MealFormData>({
    mealType: '',
    deliveryDate: '',
    deliveryTime: '',
    dietaryRestrictions: [],
    items: [],
    recurringWeekly: false,
    urgentOrder: false,
    specialInstructions: ''
  });
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [activeCategory, setActiveCategory] = useState<string>('Entrées');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = Array.from(new Set(mockMenuItems.map(item => item.category)));

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleDietaryRestriction = (restriction: DietaryRestriction) => {
    const current = formData.dietaryRestrictions || [];
    const updated = current.includes(restriction)
      ? current.filter(r => r !== restriction)
      : [...current, restriction];
    updateFormData('dietaryRestrictions', updated);
  };

  const updateItemQuantity = (itemId: string, change: number) => {
    const currentQuantity = selectedItems[itemId] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);
    
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));

    // Update formData items
    const items = Object.entries({ ...selectedItems, [itemId]: newQuantity })
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }));
    
    updateFormData('items', items);
  };

  const getFilteredItems = () => {
    return mockMenuItems.filter(item => {
      if (item.category !== activeCategory) return false;
      if (!item.available) return false;
      
      // Filter by dietary restrictions
      if (formData.dietaryRestrictions && formData.dietaryRestrictions.length > 0) {
        return formData.dietaryRestrictions.some(restriction => 
          item.dietaryInfo.includes(restriction)
        );
      }
      
      return true;
    });
  };

  const calculateTotal = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = mockMenuItems.find(i => i.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.mealType) {
      newErrors.mealType = 'Type de repas requis';
    }
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Date de livraison requise';
    }
    if (!formData.deliveryTime) {
      newErrors.deliveryTime = 'Heure de livraison requise';
    }
    if (!formData.items || formData.items.length === 0) {
      newErrors.items = 'Au moins un plat doit être sélectionné';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const order: MealOrder = {
        residentId: '1', // Mock resident ID
        deliveryDate: formData.deliveryDate!,
        deliveryTime: formData.deliveryTime!,
        mealType: formData.mealType as MealType,
        items: formData.items!,
        dietaryRestrictions: formData.dietaryRestrictions || [],
        specialInstructions: formData.specialInstructions,
        recurringWeekly: formData.recurringWeekly!,
        urgentOrder: formData.urgentOrder!
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Meal order submitted:', order);
      alert(`Commande envoyée ! Total: ${calculateTotal().toFixed(2)}€ - Livraison prévue le ${formData.deliveryDate} à ${formData.deliveryTime}`);
      router.push('/services');
    } catch (error) {
      console.error('Error submitting meal order:', error);
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Pass21 - Commande de Repas"
      description="Commandez vos repas préparés"
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  <UtensilsCrossed className="h-6 w-6 mr-3 text-orange-600" />
                  Commande de Repas
                </h1>
                <p className="text-gray-600 mt-1">
                  Des repas équilibrés préparés par nos chefs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Menu Selection */}
            <div className="lg:col-span-3 space-y-6">
              {/* Delivery Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Détails de livraison</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormSelect
                    id="mealType"
                    label="Type de repas"
                    value={formData.mealType || ''}
                    onChange={(value) => updateFormData('mealType', value)}
                    options={mealTypes}
                    required
                    error={errors.mealType}
                  />

                  <FormDatePicker
                    id="deliveryDate"
                    label="Date de livraison"
                    value={formData.deliveryDate || ''}
                    onChange={(value) => updateFormData('deliveryDate', value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    error={errors.deliveryDate}
                  />

                  <FormSelect
                    id="deliveryTime"
                    label="Heure de livraison"
                    value={formData.deliveryTime || ''}
                    onChange={(value) => updateFormData('deliveryTime', value)}
                    options={deliveryTimes}
                    required
                    error={errors.deliveryTime}
                  />
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Restrictions alimentaires</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Sélectionnez vos restrictions pour filtrer le menu
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {dietaryRestrictions.map((restriction) => (
                    <button
                      key={restriction.id}
                      onClick={() => toggleDietaryRestriction(restriction.id)}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        formData.dietaryRestrictions?.includes(restriction.id)
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{restriction.icon}</div>
                      <div className="font-medium">{restriction.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Categories */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Menu du jour</h2>
                
                {/* Category Tabs */}
                <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                        activeCategory === category
                          ? 'bg-white text-orange-600 shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Menu Items */}
                <div className="space-y-4">
                  {getFilteredItems().map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-200 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            <span className="text-lg font-bold text-orange-600">
                              {item.price.toFixed(2)}€
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{item.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {item.preparationTime} min
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {item.calories} cal
                            </div>
                          </div>
                          
                          {item.dietaryInfo.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.dietaryInfo.map((diet) => {
                                const restriction = dietaryRestrictions.find(r => r.id === diet);
                                return restriction && (
                                  <span
                                    key={diet}
                                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                                  >
                                    {restriction.icon} {restriction.label}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateItemQuantity(item.id, -1)}
                            disabled={!selectedItems[item.id]}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="text-lg font-medium min-w-[2rem] text-center">
                            {selectedItems[item.id] || 0}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateItemQuantity(item.id, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {getFilteredItems().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ChefHat className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun plat disponible pour cette catégorie</p>
                    <p className="text-sm">Essayez une autre catégorie ou modifiez vos restrictions alimentaires</p>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Options supplémentaires</h2>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="recurringWeekly"
                        checked={formData.recurringWeekly || false}
                        onChange={(e) => updateFormData('recurringWeekly', e.target.checked)}
                        className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                      />
                      <label htmlFor="recurringWeekly" className="ml-2 text-sm text-gray-700">
                        Commande récurrente (même jour chaque semaine)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="urgentOrder"
                        checked={formData.urgentOrder || false}
                        onChange={(e) => updateFormData('urgentOrder', e.target.checked)}
                        className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="urgentOrder" className="ml-2 text-sm text-gray-700 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                        Commande urgente (livraison dans les 2 heures)
                      </label>
                    </div>
                  </div>

                  <FormTextarea
                    id="specialInstructions"
                    label="Instructions spéciales"
                    value={formData.specialInstructions || ''}
                    onChange={(value) => updateFormData('specialInstructions', value)}
                    placeholder="Allergies, préparation spéciale, instructions de livraison..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Cart Summary */}
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Votre commande</h3>
                
                {getTotalItems() === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <UtensilsCrossed className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Aucun plat sélectionné</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(selectedItems)
                      .filter(([_, quantity]) => quantity > 0)
                      .map(([itemId, quantity]) => {
                        const item = mockMenuItems.find(i => i.id === itemId);
                        if (!item) return null;
                        
                        return (
                          <div key={itemId} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-gray-500">Qty: {quantity}</div>
                            </div>
                            <div className="font-medium text-orange-600">
                              {(item.price * quantity).toFixed(2)}€
                            </div>
                          </div>
                        );
                      })}
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total ({getTotalItems()} plats)</span>
                        <span className="text-orange-600">{calculateTotal().toFixed(2)}€</span>
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
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Commander ({calculateTotal().toFixed(2)}€)
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
                    <Clock className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Délai de commande</div>
                      <div className="text-gray-600">Minimum 4h à l'avance</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <ChefHat className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Préparation fraîche</div>
                      <div className="text-gray-600">Plats préparés le jour même</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Heart className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Nutrition équilibrée</div>
                      <div className="text-gray-600">Approuvé par nutritionniste</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-700">
                    <strong>Livraison gratuite</strong> pour toute commande supérieure à 25€
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

export default MealOrderingPage;