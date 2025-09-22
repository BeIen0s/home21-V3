import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Plus, 
  Minus,
  Trash2,
  Save,
  Check,
  Search,
  Filter
} from 'lucide-react';

// Types
enum GroceryCategory {
  FRUITS_VEGETABLES = 'FRUITS_VEGETABLES',
  MEAT_FISH = 'MEAT_FISH',
  DAIRY = 'DAIRY',
  BAKERY = 'BAKERY',
  BEVERAGES = 'BEVERAGES',
  PANTRY = 'PANTRY',
  FROZEN = 'FROZEN',
  HYGIENE = 'HYGIENE',
  HOUSEHOLD = 'HOUSEHOLD',
  OTHER = 'OTHER'
}

interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  quantity: number;
  unit: string;
  price?: number;
  notes?: string;
  urgent?: boolean;
}

interface GroceryListRequest {
  residentId: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  items: GroceryItem[];
  totalBudget?: number;
  specialInstructions?: string;
  recurringWeekly?: boolean;
}

// Predefined common items by category
const commonItemsByCategory: Record<GroceryCategory, Array<{name: string, unit: string, price?: number}>> = {
  [GroceryCategory.FRUITS_VEGETABLES]: [
    { name: 'Pommes', unit: 'kg', price: 2.50 },
    { name: 'Bananes', unit: 'kg', price: 1.80 },
    { name: 'Carottes', unit: 'kg', price: 1.20 },
    { name: 'Tomates', unit: 'kg', price: 3.00 },
    { name: 'Salade', unit: 'pièce', price: 1.50 },
    { name: 'Pommes de terre', unit: 'kg', price: 1.00 },
    { name: 'Courgettes', unit: 'kg', price: 2.20 },
    { name: 'Citrons', unit: 'pièce', price: 0.50 }
  ],
  [GroceryCategory.MEAT_FISH]: [
    { name: 'Escalopes de poulet', unit: 'kg', price: 8.50 },
    { name: 'Filet de saumon', unit: 'kg', price: 18.00 },
    { name: 'Bœuf haché', unit: 'kg', price: 12.00 },
    { name: 'Jambon blanc', unit: 'tranches', price: 4.50 },
    { name: 'Œufs', unit: 'boîte', price: 3.20 }
  ],
  [GroceryCategory.DAIRY]: [
    { name: 'Lait demi-écrémé', unit: 'litre', price: 1.10 },
    { name: 'Yaourts nature', unit: 'pack', price: 2.80 },
    { name: 'Fromage blanc', unit: 'pot', price: 1.90 },
    { name: 'Beurre doux', unit: 'plaquette', price: 2.20 },
    { name: 'Gruyère râpé', unit: 'sachet', price: 3.50 }
  ],
  [GroceryCategory.BAKERY]: [
    { name: 'Pain de mie', unit: 'paquet', price: 1.20 },
    { name: 'Baguette', unit: 'pièce', price: 0.90 },
    { name: 'Croissants', unit: 'sachet', price: 2.50 },
    { name: 'Brioche', unit: 'pièce', price: 2.80 }
  ],
  [GroceryCategory.BEVERAGES]: [
    { name: 'Eau minérale', unit: 'pack', price: 3.50 },
    { name: 'Jus d\'orange', unit: 'litre', price: 2.20 },
    { name: 'Café', unit: 'paquet', price: 4.50 },
    { name: 'Thé', unit: 'boîte', price: 3.80 }
  ],
  [GroceryCategory.PANTRY]: [
    { name: 'Riz', unit: 'paquet', price: 2.10 },
    { name: 'Pâtes', unit: 'paquet', price: 1.50 },
    { name: 'Huile d\'olive', unit: 'bouteille', price: 4.20 },
    { name: 'Sucre', unit: 'paquet', price: 1.80 },
    { name: 'Farine', unit: 'paquet', price: 1.60 }
  ],
  [GroceryCategory.FROZEN]: [
    { name: 'Légumes surgelés', unit: 'sachet', price: 2.80 },
    { name: 'Glaces', unit: 'bac', price: 4.50 },
    { name: 'Poisson pané', unit: 'boîte', price: 3.90 }
  ],
  [GroceryCategory.HYGIENE]: [
    { name: 'Dentifrice', unit: 'tube', price: 2.50 },
    { name: 'Shampoing', unit: 'flacon', price: 3.80 },
    { name: 'Savon', unit: 'pièce', price: 1.20 }
  ],
  [GroceryCategory.HOUSEHOLD]: [
    { name: 'Liquide vaisselle', unit: 'flacon', price: 2.20 },
    { name: 'Papier toilette', unit: 'pack', price: 4.50 },
    { name: 'Éponges', unit: 'paquet', price: 1.80 }
  ],
  [GroceryCategory.OTHER]: []
};

const categoryLabels: Record<GroceryCategory, string> = {
  [GroceryCategory.FRUITS_VEGETABLES]: 'Fruits & Légumes',
  [GroceryCategory.MEAT_FISH]: 'Viande & Poisson',
  [GroceryCategory.DAIRY]: 'Produits Laitiers',
  [GroceryCategory.BAKERY]: 'Boulangerie',
  [GroceryCategory.BEVERAGES]: 'Boissons',
  [GroceryCategory.PANTRY]: 'Épicerie',
  [GroceryCategory.FROZEN]: 'Surgelés',
  [GroceryCategory.HYGIENE]: 'Hygiène',
  [GroceryCategory.HOUSEHOLD]: 'Entretien',
  [GroceryCategory.OTHER]: 'Autres'
};

const deliveryTimeSlots = [
  { value: 'morning', label: '9h00 - 11h00' },
  { value: 'afternoon', label: '14h00 - 16h00' },
  { value: 'evening', label: '17h00 - 19h00' }
];

const GroceryListPage: React.FC = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<GroceryCategory>(GroceryCategory.FRUITS_VEGETABLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [recurringWeekly, setRecurringWeekly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItemToList = (name: string, category: GroceryCategory, unit: string, price?: number) => {
    const existingItem = groceryList.find(item => item.name === name && item.category === category);
    
    if (existingItem) {
      updateItemQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: GroceryItem = {
        id: `${Date.now()}-${Math.random()}`,
        name,
        category,
        quantity: 1,
        unit,
        price,
        urgent: false
      };
      setGroceryList(prev => [...prev, newItem]);
    }
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromList(itemId);
      return;
    }
    
    setGroceryList(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeItemFromList = (itemId: string) => {
    setGroceryList(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleItemUrgent = (itemId: string) => {
    setGroceryList(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, urgent: !item.urgent } : item
      )
    );
  };

  const filteredCommonItems = commonItemsByCategory[activeCategory].filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCost = groceryList.reduce((total, item) => 
    total + (item.price ? item.price * item.quantity : 0), 0
  );

  const totalItems = groceryList.reduce((total, item) => total + item.quantity, 0);

  const handleSubmit = async () => {
    if (groceryList.length === 0 || !deliveryDate || !deliveryTimeSlot) {
      alert('Veuillez ajouter au moins un produit et sélectionner une date/horaire de livraison');
      return;
    }

    setIsSubmitting(true);

    try {
      const request: GroceryListRequest = {
        residentId: '1', // Mock resident ID
        deliveryDate,
        deliveryTimeSlot,
        items: groceryList,
        specialInstructions,
        recurringWeekly
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Grocery list submitted:', request);
      alert('Votre liste de courses a été envoyée ! Vous recevrez une confirmation par email.');
      router.push('/services');
    } catch (error) {
      console.error('Error submitting grocery list:', error);
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Pass21 - Liste de Courses"
      description="Commandez vos courses et faites-vous livrer"
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
                  onClick={() => router.push('/services')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux services
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ShoppingCart className="h-6 w-6 mr-3 text-green-600" />
                    Liste de Courses
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Sélectionnez vos produits et planifiez votre livraison
                  </p>
                </div>
              </div>
              {groceryList.length > 0 && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {totalItems} produit{totalItems > 1 ? 's' : ''}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {totalCost.toFixed(2)}€ estimé
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Sélection des Produits</h2>
                  
                  {/* Search */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormInput
                        id="search"
                        label=""
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher un produit..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex overflow-x-auto space-x-2 pb-2">
                    {Object.entries(categoryLabels).map(([category, label]) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category as GroceryCategory)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                          activeCategory === category
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCommonItems.map((item, index) => {
                      const existingItem = groceryList.find(
                        listItem => listItem.name === item.name && listItem.category === activeCategory
                      );
                      
                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500">par {item.unit}</p>
                              {item.price && (
                                <p className="text-sm font-medium text-green-600">
                                  {item.price.toFixed(2)}€
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {existingItem ? (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => updateItemQuantity(existingItem.id, existingItem.quantity - 1)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium">
                                    {existingItem.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateItemQuantity(existingItem.id, existingItem.quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200"
                                  >
                                    <Plus className="h-4 w-4 text-green-600" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addItemToList(item.name, activeCategory, item.unit, item.price)}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Shopping List & Delivery */}
            <div className="space-y-6">
              {/* Current List */}
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ma Liste ({groceryList.length})
                  </h3>
                </div>
                
                <div className="p-4 max-h-96 overflow-y-auto">
                  {groceryList.length > 0 ? (
                    <div className="space-y-3">
                      {groceryList.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            item.urgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">
                              {item.quantity} {item.unit}
                              {item.price && ` • ${(item.price * item.quantity).toFixed(2)}€`}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => toggleItemUrgent(item.id)}
                              className={`p-1 rounded ${
                                item.urgent
                                  ? 'text-red-600 hover:bg-red-100'
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                              title={item.urgent ? 'Retirer de urgent' : 'Marquer comme urgent'}
                            >
                              <span className="text-xs">⚠️</span>
                            </button>
                            <button
                              onClick={() => removeItemFromList(item.id)}
                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {totalCost > 0 && (
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between font-semibold">
                            <span>Total estimé:</span>
                            <span>{totalCost.toFixed(2)}€</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Votre liste est vide</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Settings */}
              {groceryList.length > 0 && (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Livraison</h3>
                  
                  <div className="space-y-4">
                    <FormInput
                      id="deliveryDate"
                      label="Date de livraison"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />

                    <FormSelect
                      id="deliveryTimeSlot"
                      label="Créneau horaire"
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      options={[
                        { value: '', label: 'Choisir un créneau' },
                        ...deliveryTimeSlots
                      ]}
                      required
                    />

                    <FormTextarea
                      id="specialInstructions"
                      label="Instructions spéciales"
                      value={specialInstructions}
                      onChange={(value) => setSpecialInstructions(value)}
                      placeholder="Préférences, substitutions, informations de livraison..."
                      rows={3}
                    />

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="recurring"
                        checked={recurringWeekly}
                        onChange={(e) => setRecurringWeekly(e.target.checked)}
                        className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <label htmlFor="recurring" className="ml-2 text-sm text-gray-700">
                        Commande récurrente (chaque semaine)
                      </label>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || groceryList.length === 0 || !deliveryDate || !deliveryTimeSlot}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Envoi en cours...
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Envoyer la commande
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default GroceryListPage;