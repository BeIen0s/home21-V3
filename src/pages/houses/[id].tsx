import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Edit, 
  Home, 
  User, 
  MapPin, 
  Calendar,
  Settings,
  Euro,
  Accessibility,
  Check,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Wrench
} from 'lucide-react';
import type { HouseStatus } from '@/types';

// Types étendus pour la page
interface HouseDetail {
  id: string;
  name: string;
  type: string;
  floor: number;
  surface: number;
  maxOccupancy: number;
  address: string;
  status: HouseStatus;
  amenities: string[];
  accessibility: string[];
  monthlyRent: number;
  createdAt: Date;
  updatedAt: Date;
  currentResident?: {
    id: string;
    name: string;
    moveInDate: Date;
    phone: string;
    emergencyContact: string;
  };
  residentHistory: {
    id: string;
    name: string;
    moveInDate: Date;
    moveOutDate?: Date;
    duration?: string;
  }[];
  maintenanceHistory: {
    id: string;
    date: Date;
    type: string;
    description: string;
    cost?: number;
    technician: string;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  }[];
  documents: {
    id: string;
    name: string;
    type: string;
    uploadedAt: Date;
  }[];
}

// Mock data pour la maison
const mockHouseDetails: Record<string, HouseDetail> = {
  '1A': {
    id: '1A',
    name: 'Maison 1A',
    type: 'STUDIO',
    floor: 1,
    surface: 35,
    maxOccupancy: 1,
    address: '1A Rue de la Résidence, 75001 Paris',
    status: 'OCCUPIED',
    amenities: ['Kitchenette', 'Salle de bain privée', 'Balcon', 'Chauffage individuel'],
    accessibility: ['Accès PMR', 'Barres d\'appui', 'Douche italienne'],
    monthlyRent: 1200,
    currentResident: {
      id: '1',
      name: 'Marie Dupont',
      moveInDate: new Date('2023-01-15'),
      phone: '0123456789',
      emergencyContact: 'Jean Dupont (Époux)'
    },
    residentHistory: [
      {
        id: '1',
        name: 'Marie Dupont',
        moveInDate: new Date('2023-01-15'),
        duration: 'En cours (10 mois)'
      },
      {
        id: '0',
        name: 'Pierre Leblanc',
        moveInDate: new Date('2021-03-01'),
        moveOutDate: new Date('2022-12-31'),
        duration: '1 an 10 mois'
      }
    ],
    maintenanceHistory: [
      {
        id: '1',
        date: new Date('2023-10-15'),
        type: 'Plomberie',
        description: 'Réparation du robinet de la cuisine',
        cost: 120,
        technician: 'Jean Plombier',
        status: 'COMPLETED'
      },
      {
        id: '2',
        date: new Date('2023-08-20'),
        type: 'Peinture',
        description: 'Rafraîchissement des murs de la chambre',
        cost: 350,
        technician: 'Marie Peintre',
        status: 'COMPLETED'
      },
      {
        id: '3',
        date: new Date('2023-12-15'),
        type: 'Électricité',
        description: 'Vérification installation électrique (programmée)',
        technician: 'Paul Électricien',
        status: 'SCHEDULED'
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Plan de la maison',
        type: 'PLAN',
        uploadedAt: new Date('2022-01-01')
      },
      {
        id: '2',
        name: 'Certificat de conformité',
        type: 'CERTIFICATE',
        uploadedAt: new Date('2022-01-15')
      }
    ],
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2023-10-15')
  },
  '2B': {
    id: '2B',
    name: 'Maison 2B',
    type: 'T2',
    floor: 2,
    surface: 55,
    maxOccupancy: 2,
    address: '2B Rue de la Résidence, 75001 Paris',
    status: 'AVAILABLE',
    amenities: ['Cuisine équipée', 'Salon séparé', 'Salle de bain', 'Chauffage central'],
    accessibility: [],
    monthlyRent: 1500,
    residentHistory: [
      {
        id: '0',
        name: 'Anne Martin',
        moveInDate: new Date('2022-01-01'),
        moveOutDate: new Date('2023-10-30'),
        duration: '1 an 10 mois'
      }
    ],
    maintenanceHistory: [
      {
        id: '1',
        date: new Date('2023-11-01'),
        type: 'Nettoyage',
        description: 'Nettoyage complet après départ du résident',
        cost: 200,
        technician: 'Service de nettoyage',
        status: 'COMPLETED'
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Plan de la maison',
        type: 'PLAN',
        uploadedAt: new Date('2022-01-01')
      }
    ],
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2023-11-01')
  }
};

const getStatusBadge = (status: HouseStatus) => {
  const statusConfig = {
    'AVAILABLE': { bg: 'bg-success-100', text: 'text-success-800', icon: CheckCircle },
    'OCCUPIED': { bg: 'bg-primary-100', text: 'text-primary-800', icon: User },
    'MAINTENANCE': { bg: 'bg-warning-100', text: 'text-warning-800', icon: Settings },
    'RESERVED': { bg: 'bg-accent-100', text: 'text-accent-800', icon: Clock },
    'OUT_OF_SERVICE': { bg: 'bg-error-100', text: 'text-error-800', icon: AlertTriangle }
  };

  const statusLabels = {
    'AVAILABLE': 'Disponible',
    'OCCUPIED': 'Occupé',
    'MAINTENANCE': 'Maintenance',
    'RESERVED': 'Réservé',
    'OUT_OF_SERVICE': 'Hors service'
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <Icon className="h-4 w-4 mr-1" />
      {statusLabels[status]}
    </span>
  );
};

const getMaintenanceStatusBadge = (status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED') => {
  const config = {
    'COMPLETED': { bg: 'bg-success-100', text: 'text-success-800', label: 'Terminé' },
    'IN_PROGRESS': { bg: 'bg-warning-100', text: 'text-warning-800', label: 'En cours' },
    'SCHEDULED': { bg: 'bg-accent-100', text: 'text-accent-800', label: 'Programmé' }
  };

  const { bg, text, label } = config[status];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
};

const HouseDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<'general' | 'residents' | 'maintenance' | 'documents'>('general');

  // Trouver la maison par ID
  const house = mockHouseDetails[id as string];

  if (!house) {
    return (
      <Layout title="Logement non trouvé" description="Le logement demandé n'a pas été trouvé">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Logement non trouvé</h1>
            <Button onClick={() => router.push('/houses')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const calculateDuration = (startDate: Date, endDate?: Date) => {
    const end = endDate || new Date();
    const diffTime = Math.abs(end.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mois`;
    }
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years} an${years > 1 ? 's' : ''}${months > 0 ? ` ${months} mois` : ''}`;
  };

  return (
    <Layout
      title={`Pass21 - ${house.name}`}
      description={`Détails du logement ${house.name}`}
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
                  onClick={() => router.push('/houses')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Home className="h-6 w-6 mr-3 text-primary-600" />
                    {house.name}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {house.type} • Étage {house.floor} • {house.surface}m²
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(house.status)}
                <Button onClick={() => router.push(`/houses/${house.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('general')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'general'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Home className="h-4 w-4 inline mr-2" />
                      Informations générales
                    </button>
                    <button
                      onClick={() => setActiveTab('residents')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'residents'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <User className="h-4 w-4 inline mr-2" />
                      Résidents ({house.residentHistory.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('maintenance')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'maintenance'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Settings className="h-4 w-4 inline mr-2" />
                      Maintenance ({house.maintenanceHistory.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'documents'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Documents ({house.documents.length})
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      {/* Address */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
                        <div className="flex items-start text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                          <div className="text-gray-900">{house.address}</div>
                        </div>
                      </div>

                      {/* Details */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Caractéristiques</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-sm">
                            <span className="text-gray-500">Type:</span>
                            <span className="ml-2 text-gray-900">{house.type}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Surface:</span>
                            <span className="ml-2 text-gray-900">{house.surface}m²</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Capacité:</span>
                            <span className="ml-2 text-gray-900">{house.maxOccupancy} personne{house.maxOccupancy > 1 ? 's' : ''}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Étage:</span>
                            <span className="ml-2 text-gray-900">{house.floor}</span>
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Équipements</h3>
                        <div className="flex flex-wrap gap-2">
                          {house.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Accessibility */}
                      {house.accessibility.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Accessibilité</h3>
                          <div className="flex flex-wrap gap-2">
                            {house.accessibility.map((feature, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800"
                              >
                                <Accessibility className="h-3 w-3 mr-1" />
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'residents' && (
                    <div className="space-y-4">
                      {house.residentHistory.length > 0 ? (
                        house.residentHistory.map((resident, index) => (
                          <div key={resident.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <User className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                  <div className="font-medium text-gray-900">{resident.name}</div>
                                  <div className="text-sm text-gray-500">
                                    Du {new Intl.DateTimeFormat('fr-FR').format(resident.moveInDate)}
                                    {resident.moveOutDate 
                                      ? ` au ${new Intl.DateTimeFormat('fr-FR').format(resident.moveOutDate)}`
                                      : ' - En cours'
                                    }
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Durée: {resident.duration || calculateDuration(resident.moveInDate, resident.moveOutDate)}
                                  </div>
                                </div>
                              </div>
                              {!resident.moveOutDate && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                                  Actuel
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <User className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Aucun historique de résident</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'maintenance' && (
                    <div className="space-y-4">
                      {house.maintenanceHistory.length > 0 ? (
                        house.maintenanceHistory.map((maintenance) => (
                          <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start">
                                <Wrench className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{maintenance.type}</div>
                                  <div className="text-sm text-gray-600 mt-1">{maintenance.description}</div>
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <span>📅 {new Intl.DateTimeFormat('fr-FR').format(maintenance.date)}</span>
                                    <span>👨‍🔧 {maintenance.technician}</span>
                                    {maintenance.cost && (
                                      <span className="font-medium text-gray-900">
                                        💰 {new Intl.NumberFormat('fr-FR', {
                                          style: 'currency',
                                          currency: 'EUR'
                                        }).format(maintenance.cost)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {getMaintenanceStatusBadge(maintenance.status)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Settings className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Aucun historique de maintenance</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'documents' && (
                    <div className="space-y-4">
                      {house.documents.length > 0 ? (
                        house.documents.map((document) => (
                          <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                  <div className="font-medium text-gray-900">{document.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {document.type} • Ajouté le {new Intl.DateTimeFormat('fr-FR').format(document.uploadedAt)}
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                Télécharger
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Aucun document disponible</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Resident */}
              {house.currentResident && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Résident actuel</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium text-gray-900">{house.currentResident.name}</div>
                      <div className="text-sm text-gray-500">
                        Depuis le {new Intl.DateTimeFormat('fr-FR').format(house.currentResident.moveInDate)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Téléphone:</span>
                        <span className="ml-2 text-gray-900">{house.currentResident.phone}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Contact d'urgence:</span>
                        <span className="ml-2 text-gray-900">{house.currentResident.emergencyContact}</span>
                      </div>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push(`/residents/${house.currentResident?.id}`)}
                    >
                      Voir le profil complet
                    </Button>
                  </div>
                </div>
              )}

              {/* Rent Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations financières</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Euro className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Loyer mensuel</div>
                      <div className="font-medium text-gray-900">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0
                        }).format(house.monthlyRent)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier le logement
                  </Button>
                  {house.status === 'AVAILABLE' && (
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assigner un résident
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Programmer une maintenance
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ajouter un document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default HouseDetailPage;