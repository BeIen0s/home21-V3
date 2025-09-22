import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { FormSelect } from '@/components/forms/FormSelect';
import { 
  ArrowLeft, 
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Package,
  ShoppingCart,
  Car,
  UtensilsCrossed,
  Calendar,
  MapPin,
  Phone,
  FileText,
  Download,
  Star
} from 'lucide-react';

enum ServiceType {
  GROCERY = 'GROCERY',
  DRIVER = 'DRIVER',
  MEALS = 'MEALS',
  RENTAL = 'RENTAL'
}

enum RequestStatus {
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
  status: RequestStatus;
  createdAt: string;
  scheduledDate?: string;
  completedDate?: string;
  amount: number;
  details: {
    items?: number;
    destination?: string;
    duration?: string;
    urgentRequest?: boolean;
  };
  contactInfo?: string;
  rating?: number;
  feedback?: string;
  canCancel: boolean;
  canReschedule: boolean;
}

const serviceTypes = [
  { value: '', label: 'Tous les services' },
  { value: ServiceType.GROCERY, label: '🛒 Courses', icon: ShoppingCart },
  { value: ServiceType.DRIVER, label: '🚗 Chauffeur', icon: Car },
  { value: ServiceType.MEALS, label: '🍽️ Repas', icon: UtensilsCrossed },
  { value: ServiceType.RENTAL, label: '📦 Location', icon: Package }
];

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: RequestStatus.PENDING, label: 'En attente', color: 'yellow' },
  { value: RequestStatus.CONFIRMED, label: 'Confirmé', color: 'blue' },
  { value: RequestStatus.IN_PROGRESS, label: 'En cours', color: 'purple' },
  { value: RequestStatus.COMPLETED, label: 'Terminé', color: 'green' },
  { value: RequestStatus.CANCELLED, label: 'Annulé', color: 'red' }
];

// Mock service requests data
const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'REQ-2024-001',
    type: ServiceType.GROCERY,
    title: 'Courses hebdomadaires',
    description: 'Liste de courses avec 12 articles, livraison prévue demain matin',
    status: RequestStatus.CONFIRMED,
    createdAt: '2024-01-15T10:30:00Z',
    scheduledDate: '2024-01-16T09:00:00Z',
    amount: 67.50,
    details: {
      items: 12,
      urgentRequest: false
    },
    contactInfo: '06 12 34 56 78',
    canCancel: true,
    canReschedule: true
  },
  {
    id: 'REQ-2024-002',
    type: ServiceType.DRIVER,
    title: 'Transport médical',
    description: 'Rendez-vous chez le cardiologue, aller-retour avec accompagnement',
    status: RequestStatus.COMPLETED,
    createdAt: '2024-01-12T14:20:00Z',
    scheduledDate: '2024-01-14T14:30:00Z',
    completedDate: '2024-01-14T17:00:00Z',
    amount: 45.00,
    details: {
      destination: 'Hôpital Saint-Louis, Paris',
      duration: '2h30',
      urgentRequest: false
    },
    contactInfo: 'Chauffeur: Marie L. - 07 23 45 67 89',
    rating: 5,
    feedback: 'Très professionnel, ponctuel et attentionné. Excellent service !',
    canCancel: false,
    canReschedule: false
  },
  {
    id: 'REQ-2024-003',
    type: ServiceType.MEALS,
    title: 'Commande repas du soir',
    description: 'Menu équilibré avec saumon grillé et légumes vapeur',
    status: RequestStatus.IN_PROGRESS,
    createdAt: '2024-01-15T16:45:00Z',
    scheduledDate: '2024-01-15T19:00:00Z',
    amount: 18.90,
    details: {
      items: 3,
      urgentRequest: true
    },
    contactInfo: 'Cuisine Pass21 - 01 42 56 78 90',
    canCancel: false,
    canReschedule: false
  },
  {
    id: 'REQ-2024-004',
    type: ServiceType.RENTAL,
    title: 'Location fauteuil roulant',
    description: 'Fauteuil roulant électrique pour 2 semaines avec livraison',
    status: RequestStatus.PENDING,
    createdAt: '2024-01-15T11:15:00Z',
    scheduledDate: '2024-01-17T10:00:00Z',
    amount: 350.00,
    details: {
      duration: '2 semaines',
      urgentRequest: false
    },
    contactInfo: 'Service location - 01 45 67 89 12',
    canCancel: true,
    canReschedule: true
  },
  {
    id: 'REQ-2024-005',
    type: ServiceType.GROCERY,
    title: 'Courses express',
    description: 'Livraison urgente de médicaments et produits de première nécessité',
    status: RequestStatus.COMPLETED,
    createdAt: '2024-01-13T08:30:00Z',
    scheduledDate: '2024-01-13T10:00:00Z',
    completedDate: '2024-01-13T10:45:00Z',
    amount: 23.80,
    details: {
      items: 5,
      urgentRequest: true
    },
    rating: 4,
    feedback: 'Livraison rapide et efficace. Un article manquait mais remboursé aussitôt.',
    canCancel: false,
    canReschedule: false
  },
  {
    id: 'REQ-2024-006',
    type: ServiceType.DRIVER,
    title: 'Transport annulé',
    description: 'Visite familiale annulée en raison du mauvais temps',
    status: RequestStatus.CANCELLED,
    createdAt: '2024-01-11T15:00:00Z',
    scheduledDate: '2024-01-13T15:30:00Z',
    amount: 0.00,
    details: {
      destination: 'Maison de famille, Banlieue',
      urgentRequest: false
    },
    canCancel: false,
    canReschedule: false
  }
];

const ServiceTrackingPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | ''>('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getFilteredRequests = () => {
    return mockServiceRequests.filter(request => {
      if (selectedServiceType && request.type !== selectedServiceType) return false;
      if (selectedStatus && request.status !== selectedStatus) return false;
      if (searchQuery && !request.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !request.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !request.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case RequestStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4" />;
      case RequestStatus.IN_PROGRESS:
        return <AlertCircle className="h-4 w-4" />;
      case RequestStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case RequestStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return statusConfig?.color || 'gray';
  };

  const getServiceIcon = (type: ServiceType) => {
    const serviceConfig = serviceTypes.find(s => s.value === type);
    const IconComponent = serviceConfig?.icon || Package;
    return <IconComponent className="h-5 w-5" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCancelRequest = (requestId: string) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette demande ?')) {
      // Simulate API call
      alert('Demande annulée avec succès');
      // In real app, update the request status
    }
  };

  const handleRescheduleRequest = (requestId: string) => {
    alert('Fonction de report en cours de développement');
    // In real app, open reschedule modal
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Layout
      title="Pass21 - Suivi des Demandes"
      description="Suivez l'état de toutes vos demandes de services"
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
                  <FileText className="h-6 w-6 mr-3 text-indigo-600" />
                  Suivi des Demandes
                </h1>
                <p className="text-gray-600 mt-1">
                  Historique et statut de vos demandes de services
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par titre, description ou numéro..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <FormSelect
                  id="serviceType"
                  label=""
                  value={selectedServiceType}
                  onChange={(value) => setSelectedServiceType(value as ServiceType)}
                  options={serviceTypes}
                  className="min-w-[180px]"
                />
                
                <FormSelect
                  id="status"
                  label=""
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value as RequestStatus)}
                  options={statusOptions}
                  className="min-w-[150px]"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total demandes</p>
                  <p className="text-2xl font-semibold text-gray-900">{mockServiceRequests.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Terminées</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockServiceRequests.filter(r => r.status === RequestStatus.COMPLETED).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">En cours</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockServiceRequests.filter(r => 
                      r.status === RequestStatus.PENDING || 
                      r.status === RequestStatus.CONFIRMED || 
                      r.status === RequestStatus.IN_PROGRESS
                    ).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {(mockServiceRequests.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) /
                      mockServiceRequests.filter(r => r.rating).length || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {getFilteredRequests().length} demande{getFilteredRequests().length > 1 ? 's' : ''} trouvée{getFilteredRequests().length > 1 ? 's' : ''}
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {getFilteredRequests().map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-lg ${
                          request.type === ServiceType.GROCERY ? 'bg-green-100' :
                          request.type === ServiceType.DRIVER ? 'bg-blue-100' :
                          request.type === ServiceType.MEALS ? 'bg-orange-100' :
                          'bg-purple-100'
                        }`}>
                          {getServiceIcon(request.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusColor(request.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            getStatusColor(request.status) === 'blue' ? 'bg-blue-100 text-blue-800' :
                            getStatusColor(request.status) === 'purple' ? 'bg-purple-100 text-purple-800' :
                            getStatusColor(request.status) === 'green' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1">{statusOptions.find(s => s.value === request.status)?.label}</span>
                          </span>
                          {request.details.urgentRequest && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{request.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Créé le {formatDate(request.createdAt)}
                          </div>
                          
                          {request.scheduledDate && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Prévu le {formatDate(request.scheduledDate)}
                            </div>
                          )}
                          
                          {request.completedDate && (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Terminé le {formatDate(request.completedDate)}
                            </div>
                          )}
                        </div>

                        {request.rating && (
                          <div className="flex items-center mt-2">
                            <div className="flex items-center mr-2">
                              {renderStars(request.rating)}
                            </div>
                            <span className="text-sm text-gray-600">({request.rating}/5)</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {request.amount > 0 ? `${request.amount.toFixed(2)}€` : 'Gratuit'}
                        </div>
                        <div className="text-sm text-gray-500">N° {request.id}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        
                        {request.canCancel && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelRequest(request.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Annuler
                          </Button>
                        )}
                        
                        {request.canReschedule && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRescheduleRequest(request.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Reporter
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredRequests().length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-2">Aucune demande trouvée</p>
                <p className="text-sm text-gray-400">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        </main>

        {/* Modal for Request Details */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Détails de la demande {selectedRequest.id}
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    selectedRequest.type === ServiceType.GROCERY ? 'bg-green-100' :
                    selectedRequest.type === ServiceType.DRIVER ? 'bg-blue-100' :
                    selectedRequest.type === ServiceType.MEALS ? 'bg-orange-100' :
                    'bg-purple-100'
                  }`}>
                    {getServiceIcon(selectedRequest.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedRequest.title}
                    </h4>
                    <p className="text-gray-600 mb-4">{selectedRequest.description}</p>
                    
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusColor(selectedRequest.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      getStatusColor(selectedRequest.status) === 'blue' ? 'bg-blue-100 text-blue-800' :
                      getStatusColor(selectedRequest.status) === 'purple' ? 'bg-purple-100 text-purple-800' :
                      getStatusColor(selectedRequest.status) === 'green' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getStatusIcon(selectedRequest.status)}
                      <span className="ml-1">{statusOptions.find(s => s.value === selectedRequest.status)?.label}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Informations générales</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Créé le:</span>
                        <span>{formatDate(selectedRequest.createdAt)}</span>
                      </div>
                      
                      {selectedRequest.scheduledDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Prévu le:</span>
                          <span>{formatDate(selectedRequest.scheduledDate)}</span>
                        </div>
                      )}
                      
                      {selectedRequest.completedDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Terminé le:</span>
                          <span>{formatDate(selectedRequest.completedDate)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-500">Montant:</span>
                        <span className="font-medium">
                          {selectedRequest.amount > 0 ? `${selectedRequest.amount.toFixed(2)}€` : 'Gratuit'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Détails du service</h5>
                    <div className="space-y-2 text-sm">
                      {selectedRequest.details.items && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Articles/Plats:</span>
                          <span>{selectedRequest.details.items}</span>
                        </div>
                      )}
                      
                      {selectedRequest.details.destination && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Destination:</span>
                          <span className="text-right max-w-[150px]">{selectedRequest.details.destination}</span>
                        </div>
                      )}
                      
                      {selectedRequest.details.duration && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Durée:</span>
                          <span>{selectedRequest.details.duration}</span>
                        </div>
                      )}
                      
                      {selectedRequest.details.urgentRequest && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Urgent:</span>
                          <span className="text-red-600 font-medium">Oui</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedRequest.contactInfo && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Contact</h5>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {selectedRequest.contactInfo}
                    </div>
                  </div>
                )}

                {selectedRequest.rating && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Évaluation</h5>
                    <div className="flex items-center mb-2">
                      {renderStars(selectedRequest.rating)}
                      <span className="ml-2 text-sm text-gray-600">({selectedRequest.rating}/5)</span>
                    </div>
                    {selectedRequest.feedback && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        "{selectedRequest.feedback}"
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-between space-x-4 pt-6 border-t">
                  <div className="flex space-x-3">
                    {selectedRequest.canCancel && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleCancelRequest(selectedRequest.id);
                          setShowModal(false);
                        }}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Annuler la demande
                      </Button>
                    )}
                    
                    {selectedRequest.canReschedule && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleRescheduleRequest(selectedRequest.id);
                          setShowModal(false);
                        }}
                      >
                        Reporter
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => alert('Export PDF en cours de développement')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ServiceTrackingPage;