import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  Home, 
  User, 
  Settings, 
  Calendar,
  MapPin,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { HouseStatus, TableColumn } from '@/types';

// Types étendus pour la page
interface HouseWithResident {
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
  currentResident?: {
    id: string;
    name: string;
    moveInDate: Date;
  };
  lastMaintenance?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data pour les maisons
const mockHouses: HouseWithResident[] = [
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
  },
  {
    id: '4D',
    name: 'Maison 4D',
    type: 'T1',
    floor: 4,
    surface: 42,
    maxOccupancy: 1,
    address: '4D Rue de la Résidence, 75001 Paris',
    status: 'OCCUPIED',
    amenities: ['Cuisine équipée', 'Salle de bain', 'Rangements'],
    accessibility: ['Accès PMR'],
    monthlyRent: 1350,
    currentResident: {
      id: '2',
      name: 'Bernard Martin',
      moveInDate: new Date('2022-09-01')
    },
    lastMaintenance: new Date('2023-09-15'),
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2023-09-15')
  },
  {
    id: '5E',
    name: 'Maison 5E',
    type: 'T2',
    floor: 5,
    surface: 58,
    maxOccupancy: 2,
    address: '5E Rue de la Résidence, 75001 Paris',
    status: 'RESERVED',
    amenities: ['Cuisine équipée', 'Salon', 'Salle de bain', 'Terrasse'],
    accessibility: [],
    monthlyRent: 1600,
    lastMaintenance: new Date('2023-08-10'),
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2023-08-10')
  },
  {
    id: '6F',
    name: 'Maison 6F',
    type: 'STUDIO',
    floor: 6,
    surface: 28,
    maxOccupancy: 1,
    address: '6F Rue de la Résidence, 75001 Paris',
    status: 'OUT_OF_SERVICE',
    amenities: ['Kitchenette'],
    accessibility: [],
    monthlyRent: 1000,
    lastMaintenance: new Date('2023-05-20'),
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2023-05-20')
  }
];

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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="h-3 w-3 mr-1" />
      {statusLabels[status]}
    </span>
  );
};

const getTypeDisplay = (type: string) => {
  const typeLabels = {
    'STUDIO': 'Studio',
    'T1': 'T1',
    'T2': 'T2',
    'T3': 'T3'
  };
  return typeLabels[type as keyof typeof typeLabels] || type;
};

const HousesPage: React.FC = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<HouseStatus | 'ALL'>('ALL');

  const filteredHouses = mockHouses.filter(house => 
    statusFilter === 'ALL' || house.status === statusFilter
  );

  const columns: TableColumn<HouseWithResident>[] = [
    {
      key: 'name',
      title: 'Logement',
      render: (_, house) => (
        <div>
          <div className="font-medium text-gray-900 flex items-center">
            <Home className="h-4 w-4 text-gray-400 mr-2" />
            {house.name}
          </div>
          <div className="text-sm text-gray-500">
            Étage {house.floor} • {house.surface}m²
          </div>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Type',
      render: (type) => getTypeDisplay(type)
    },
    {
      key: 'status',
      title: 'Statut',
      render: (status) => getStatusBadge(status as HouseStatus)
    },
    {
      key: 'currentResident',
      title: 'Résident actuel',
      render: (_, house) => {
        if (house.currentResident) {
          return (
            <div>
              <div className="font-medium text-gray-900">{house.currentResident.name}</div>
              <div className="text-xs text-gray-500">
                Depuis le {new Intl.DateTimeFormat('fr-FR').format(house.currentResident.moveInDate)}
              </div>
            </div>
          );
        }
        return <span className="text-gray-400 italic">Libre</span>;
      }
    },
    {
      key: 'monthlyRent',
      title: 'Loyer',
      render: (rent) => (
        <span className="font-medium text-gray-900">
          {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
          }).format(rent)}
        </span>
      )
    },
    {
      key: 'lastMaintenance',
      title: 'Dernière maintenance',
      render: (date) => date ? new Intl.DateTimeFormat('fr-FR').format(new Date(date)) : 'Jamais'
    }
  ];

  const handleViewHouse = (house: HouseWithResident) => {
    router.push(`/houses/${house.id}`);
  };

  const handleEditHouse = (house: HouseWithResident) => {
    router.push(`/houses/${house.id}/edit`);
  };

  const handleAssignResident = (house: HouseWithResident) => {
    console.log('Assigner résident à:', house.id);
    // TODO: Open resident assignment modal
  };

  const actions = [
    {
      label: 'Voir',
      onClick: handleViewHouse,
      variant: 'ghost' as const
    },
    {
      label: 'Modifier',
      onClick: handleEditHouse,
      variant: 'ghost' as const
    },
    {
      label: 'Assigner',
      onClick: handleAssignResident,
      variant: 'ghost' as const,
      condition: (house: HouseWithResident) => house.status === 'AVAILABLE'
    }
  ];

  // Statistiques
  const stats = {
    total: mockHouses.length,
    available: mockHouses.filter(h => h.status === 'AVAILABLE').length,
    occupied: mockHouses.filter(h => h.status === 'OCCUPIED').length,
    maintenance: mockHouses.filter(h => h.status === 'MAINTENANCE').length,
    revenue: mockHouses
      .filter(h => h.status === 'OCCUPIED')
      .reduce((sum, h) => sum + h.monthlyRent, 0)
  };

  return (
    <Layout
      title="Pass21 - Gestion des Logements"
      description="Gestion des maisons et logements de la résidence Pass21"
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Logements</h1>
                <p className="text-gray-600 mt-1">
                  Gérer les maisons et logements de la résidence Pass21
                </p>
              </div>
              <Button onClick={() => router.push('/houses/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Logement
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Home className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Logements</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-success-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Occupés</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.occupied}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <Settings className="w-6 h-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent-100 rounded-lg">
                  <div className="w-6 h-6 text-accent-600 text-lg">€</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus/mois</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(stats.revenue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filtrer par statut:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as HouseStatus | 'ALL')}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="OCCUPIED">Occupé</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RESERVED">Réservé</option>
                <option value="OUT_OF_SERVICE">Hors service</option>
              </select>
              <span className="text-sm text-gray-500">
                {filteredHouses.length} logement{filteredHouses.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Houses Table */}
          <DataTable
            data={filteredHouses}
            columns={columns}
            actions={actions}
            searchable={true}
            sortable={true}
            pagination={true}
            pageSize={10}
            emptyMessage="Aucun logement trouvé"
            onRowClick={handleViewHouse}
          />
        </main>
      </div>
    </Layout>
  );
};

export default HousesPage;