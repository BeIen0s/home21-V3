import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { StatsCard, Select, Badge } from '@/components/ui';
import { 
  Calendar,
  ShoppingCart,
  UtensilsCrossed,
  Car,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Filter,
  Euro
} from 'lucide-react';

// Service types
export enum ServiceType {
  GROCERY_LIST = 'GROCERY_LIST',
  MEAL_ORDER = 'MEAL_ORDER',
  DRIVER = 'DRIVER',
  RENTAL = 'RENTAL'
}

export enum ServiceRequestStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

interface ServiceRequest {
  id: string;
  type: ServiceType;
  title: string;
  description: string;
  residentId: string;
  residentName: string;
  status: ServiceRequestStatus;
  requestedDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  totalCost?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Services configuration
const servicesConfig = [
  {
    type: ServiceType.GROCERY_LIST,
    title: 'Liste de Courses',
    description: 'Commandez vos courses et faites-vous livrer directement à votre logement',
    icon: ShoppingCart,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    lightBg: 'bg-green-50',
    lightText: 'text-green-700',
    href: '/services/grocery',
    features: ['Produits frais', 'Livraison gratuite', 'Liste personnalisée', 'Commande récurrente']
  },
  {
    type: ServiceType.MEAL_ORDER,
    title: 'Commande de Repas',
    description: 'Choisissez vos repas parmi notre sélection équilibrée et adaptée',
    icon: UtensilsCrossed,
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    lightBg: 'bg-orange-50',
    lightText: 'text-orange-700',
    href: '/services/meals',
    features: ['Menus équilibrés', 'Régimes spéciaux', 'Livraison chaude', 'Planning hebdomadaire']
  },
  {
    type: ServiceType.DRIVER,
    title: 'Service Chauffeur',
    description: 'Réservez un transport pour vos rendez-vous médicaux ou sorties',
    icon: Car,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-700',
    href: '/services/driver',
    features: ['Chauffeurs agréés', 'Véhicules adaptés', 'Accompagnement', 'Urgences 24h/24']
  },
  {
    type: ServiceType.RENTAL,
    title: 'Service Location',
    description: 'Louez du matériel médical, de confort ou de loisir temporairement',
    icon: Package,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    lightBg: 'bg-purple-50',
    lightText: 'text-purple-700',
    href: '/services/rental',
    features: ['Matériel médical', 'Équipements confort', 'Livraison incluse', 'Maintenance assurée']
  }
];

// Mock data for recent requests
const mockRequests: ServiceRequest[] = [
  {
    id: '1',
    type: ServiceType.GROCERY_LIST,
    title: 'Courses hebdomadaires',
    description: 'Liste de courses pour la semaine avec produits frais et conserves',
    residentId: '1',
    residentName: 'Marie Dupont',
    status: ServiceRequestStatus.COMPLETED,
    requestedDate: new Date('2023-12-20'),
    scheduledDate: new Date('2023-12-21'),
    completedDate: new Date('2023-12-21'),
    totalCost: 45.80,
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-21')
  },
  {
    id: '2',
    type: ServiceType.DRIVER,
    title: 'Rendez-vous cardiologue',
    description: 'Transport aller-retour pour consultation médicale',
    residentId: '2',
    residentName: 'Bernard Martin',
    status: ServiceRequestStatus.CONFIRMED,
    requestedDate: new Date('2023-12-24'),
    scheduledDate: new Date('2023-12-26'),
    totalCost: 25.00,
    createdAt: new Date('2023-12-24'),
    updatedAt: new Date('2023-12-24')
  },
  {
    id: '3',
    type: ServiceType.MEAL_ORDER,
    title: 'Repas du soir - Régime sans sel',
    description: 'Menu adapté aux restrictions alimentaires',
    residentId: '1',
    residentName: 'Marie Dupont',
    status: ServiceRequestStatus.IN_PROGRESS,
    requestedDate: new Date('2023-12-24'),
    scheduledDate: new Date('2023-12-24'),
    totalCost: 12.50,
    createdAt: new Date('2023-12-24'),
    updatedAt: new Date('2023-12-24')
  },
  {
    id: '4',
    type: ServiceType.RENTAL,
    title: 'Location fauteuil roulant',
    description: 'Fauteuil roulant pour 1 semaine suite à intervention',
    residentId: '3',
    residentName: 'Françoise Petit',
    status: ServiceRequestStatus.PENDING,
    requestedDate: new Date('2023-12-24'),
    scheduledDate: new Date('2023-12-25'),
    totalCost: 35.00,
    createdAt: new Date('2023-12-24'),
    updatedAt: new Date('2023-12-24')
  }
];

const getStatusBadge = (status: ServiceRequestStatus) => {
  const statusConfig = {
    [ServiceRequestStatus.PENDING]: {
      variant: 'yellow' as const,
      icon: Clock,
      label: 'En attente'
    },
    [ServiceRequestStatus.CONFIRMED]: {
      variant: 'blue' as const,
      icon: CheckCircle,
      label: 'Confirmé'
    },
    [ServiceRequestStatus.IN_PROGRESS]: {
      variant: 'purple' as const,
      icon: Clock,
      label: 'En cours'
    },
    [ServiceRequestStatus.COMPLETED]: {
      variant: 'success' as const,
      icon: CheckCircle,
      label: 'Terminé'
    },
    [ServiceRequestStatus.CANCELLED]: {
      variant: 'error' as const,
      icon: AlertCircle,
      label: 'Annulé'
    }
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} icon={config.icon}>
      {config.label}
    </Badge>
  );
};

const getServiceIcon = (type: ServiceType) => {
  const service = servicesConfig.find(s => s.type === type);
  return service?.icon || Package;
};

const getServiceTitle = (type: ServiceType) => {
  const service = servicesConfig.find(s => s.type === type);
  return service?.title || 'Service';
};

const ServicesPage: React.FC = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<ServiceRequestStatus | 'ALL'>('ALL');

  const filteredRequests = mockRequests.filter(request => 
    statusFilter === 'ALL' || request.status === statusFilter
  );

  // Statistics
  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === ServiceRequestStatus.PENDING).length,
    inProgress: mockRequests.filter(r => r.status === ServiceRequestStatus.IN_PROGRESS).length,
    completed: mockRequests.filter(r => r.status === ServiceRequestStatus.COMPLETED).length,
    totalCost: mockRequests
      .filter(r => r.status === ServiceRequestStatus.COMPLETED && r.totalCost)
      .reduce((sum, r) => sum + (r.totalCost || 0), 0)
  };

  return (
    <Layout
      title="Pass21 - Services"
      description="Services disponibles pour les résidents de Pass21"
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Services Pass21</h1>
                <p className="text-gray-600 mt-1">
                  Services et commodités pour le bien-être de nos résidents
                </p>
              </div>
              <Button onClick={() => router.push('/services/requests')}>
                <Eye className="h-4 w-4 mr-2" />
                Voir toutes les demandes
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatsCard
              title="Total Demandes"
              value={stats.total}
              icon={<Calendar className="w-5 h-5" />}
              color="blue"
            />
            
            <StatsCard
              title="En attente"
              value={stats.pending}
              icon={<Clock className="w-5 h-5" />}
              color="yellow"
            />
            
            <StatsCard
              title="En cours"
              value={stats.inProgress}
              icon={<Clock className="w-5 h-5" />}
              color="purple"
            />
            
            <StatsCard
              title="Terminées"
              value={stats.completed}
              icon={<CheckCircle className="w-5 h-5" />}
              color="green"
            />
            
            <StatsCard
              title="Total facturé"
              value={new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0
              }).format(stats.totalCost)}
              icon={<Euro className="w-5 h-5" />}
              color="purple"
            />
          </div>

          {/* Services Grid */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Services Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesConfig.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.type}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(service.href)}
                  >
                    <div className={`${service.lightBg} px-6 py-4 text-center`}>
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${service.color} mb-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                    </div>
                    
                    <div className="px-6 py-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Caractéristiques:</h4>
                        <ul className="space-y-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center text-xs text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button
                        className={`w-full ${service.color} ${service.hoverColor} text-white`}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(service.href);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle demande
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Requests */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Demandes Récentes</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ServiceRequestStatus | 'ALL')}
                    className="min-w-[140px] text-sm"
                  >
                    <option value="ALL">Tous les statuts</option>
                    <option value={ServiceRequestStatus.PENDING}>En attente</option>
                    <option value={ServiceRequestStatus.CONFIRMED}>Confirmé</option>
                    <option value={ServiceRequestStatus.IN_PROGRESS}>En cours</option>
                    <option value={ServiceRequestStatus.COMPLETED}>Terminé</option>
                    <option value={ServiceRequestStatus.CANCELLED}>Annulé</option>
                  </Select>
                </div>
                <span className="text-sm text-gray-500">
                  {filteredRequests.length} demande{filteredRequests.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {filteredRequests.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => {
                    const ServiceIcon = getServiceIcon(request.type);
                    return (
                      <div key={request.id} className="p-6 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <ServiceIcon className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-gray-900">{request.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span>{getServiceTitle(request.type)}</span>
                                  <span>•</span>
                                  <span>{request.residentName}</span>
                                  <span>•</span>
                                  <span>{new Intl.DateTimeFormat('fr-FR').format(request.requestedDate)}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                {request.totalCost && (
                                  <span className="text-sm font-medium text-gray-900">
                                    {new Intl.NumberFormat('fr-FR', {
                                      style: 'currency',
                                      currency: 'EUR'
                                    }).format(request.totalCost)}
                                  </span>
                                )}
                                {getStatusBadge(request.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune demande trouvée</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ServicesPage;