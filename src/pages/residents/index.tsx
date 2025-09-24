import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/Button';
import { StatsCard, Badge } from '@/components/ui';
import { Plus, Edit, Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import type { Resident, ResidentStatus, Gender, TableColumn } from '@/types';
import { StorageService } from '@/services/storageService';

// Mock data pour les résidents
const mockResidents: (Resident & { houseName?: string })[] = [
  {
    id: '1',
    userId: 'user-1',
    firstName: 'Marie',
    lastName: 'Dupont',
    dateOfBirth: new Date('1940-05-15'),
    gender: 'FEMALE' as Gender,
    emergencyContact: {
      name: 'Jean Dupont',
      relationship: 'Époux',
      phone: '0123456789',
      email: 'jean.dupont@email.com'
    },
    houseId: '12A',
    houseName: 'Maison 12A',
    moveInDate: new Date('2023-01-15'),
    status: 'ACTIVE' as ResidentStatus,
    documents: [],
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    userId: 'user-2',
    firstName: 'Bernard',
    lastName: 'Martin',
    dateOfBirth: new Date('1935-08-22'),
    gender: 'MALE' as Gender,
    emergencyContact: {
      name: 'Sophie Martin',
      relationship: 'Fille',
      phone: '0987654321',
      email: 'sophie.martin@email.com'
    },
    houseId: '8B',
    houseName: 'Maison 8B',
    moveInDate: new Date('2022-09-01'),
    status: 'ACTIVE' as ResidentStatus,
    documents: [],
    medicalInfo: {
      allergies: ['Pénicilline'],
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: '1x/jour',
          startDate: new Date('2022-09-01'),
          prescribedBy: 'Dr. Rousseau'
        }
      ]
    },
    createdAt: new Date('2022-08-25'),
    updatedAt: new Date('2022-09-01')
  },
  {
    id: '3',
    userId: 'user-3',
    firstName: 'Françoise',
    lastName: 'Petit',
    dateOfBirth: new Date('1942-12-03'),
    gender: 'FEMALE' as Gender,
    emergencyContact: {
      name: 'Michel Petit',
      relationship: 'Fils',
      phone: '0156789012'
    },
    houseId: '5C',
    houseName: 'Maison 5C',
    moveInDate: new Date('2023-03-20'),
    status: 'ACTIVE' as ResidentStatus,
    documents: [],
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-20')
  },
  {
    id: '4',
    userId: 'user-4',
    firstName: 'André',
    lastName: 'Rousseau',
    dateOfBirth: new Date('1938-07-10'),
    gender: 'MALE' as Gender,
    emergencyContact: {
      name: 'Marie Rousseau',
      relationship: 'Épouse',
      phone: '0145678901'
    },
    status: 'WAITING_LIST' as ResidentStatus,
    documents: [],
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-11-01')
  }
];

const getStatusBadge = (status: ResidentStatus) => {
  const statusConfig = {
    'ACTIVE': { variant: 'success' as const, label: 'Actif' },
    'WAITING_LIST': { variant: 'warning' as const, label: 'Liste d\'attente' },
    'TEMPORARY_LEAVE': { variant: 'accent' as const, label: 'Congé temporaire' },
    'MOVED_OUT': { variant: 'default' as const, label: 'Déménagé' },
    'DECEASED': { variant: 'error' as const, label: 'Décédé' }
  };

  const config = statusConfig[status];
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

const calculateAge = (dateOfBirth: Date) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const ResidentsPage: React.FC = () => {
  const router = useRouter();
  const [residents, setResidents] = useState<(Resident & { houseName?: string })[]>(mockResidents);
  
  // Charger les résidents depuis le stockage local
  useEffect(() => {
    const storedResidents = StorageService.getResidents();
    if (storedResidents.length > 0) {
      // Convertir les dates string en objets Date et ajouter les noms de maison
      const formattedResidents = storedResidents.map(resident => ({
        ...resident,
        dateOfBirth: new Date(resident.dateOfBirth),
        moveInDate: resident.moveInDate ? new Date(resident.moveInDate) : undefined,
        createdAt: new Date(resident.createdAt),
        updatedAt: new Date(resident.updatedAt),
        houseName: resident.houseId ? `Maison ${resident.houseId}` : undefined
      }));
      setResidents([...mockResidents, ...formattedResidents]);
    }
  }, []);
  const columns: TableColumn<typeof mockResidents[0]>[] = [
    {
      key: 'fullName',
      title: 'Nom complet',
      render: (_, resident) => (
        <div>
          <div className="font-medium text-gray-900">
            {resident.firstName} {resident.lastName}
          </div>
          <div className="text-sm text-gray-500">
            {calculateAge(resident.dateOfBirth)} ans
          </div>
        </div>
      )
    },
    {
      key: 'houseName',
      title: 'Logement',
      render: (value) => value || (
        <span className="text-gray-400 italic">Non assigné</span>
      )
    },
    {
      key: 'status',
      title: 'Statut',
      render: (status) => getStatusBadge(status as ResidentStatus)
    },
    {
      key: 'emergencyContact',
      title: 'Contact d\'urgence',
      render: (contact) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
          <div className="text-xs text-gray-500">{contact.relationship}</div>
          <div className="text-xs text-gray-500">{contact.phone}</div>
        </div>
      )
    },
    {
      key: 'moveInDate',
      title: 'Date d\'entrée',
      render: (date) => date ? new Intl.DateTimeFormat('fr-FR').format(new Date(date)) : '-'
    }
  ];

  const handleEditResident = (resident: typeof mockResidents[0]) => {
    router.push(`/residents/edit/${resident.id}`);
  };

  const actions = [
    {
      label: 'Modifier',
      onClick: handleEditResident,
      variant: 'ghost' as const
    }
  ];

  return (
    <Layout
      title="Pass21 - Gestion des Résidents"
      description="Gestion des résidents de la résidence Pass21"
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Résidents</h1>
                <p className="text-gray-600 mt-1">
                  Gérer les résidents de la résidence Pass21
                </p>
              </div>
              <Button onClick={() => router.push('/residents/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Résident
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Résidents"
              value={residents.length}
              icon={<Users className="w-6 h-6" />}
              color="blue"
            />
            
            <StatsCard
              title="Actifs"
              value={residents.filter(r => r.status === 'ACTIVE').length}
              icon={<UserCheck className="w-6 h-6" />}
              color="green"
            />
            
            <StatsCard
              title="Liste d'attente"
              value={residents.filter(r => r.status === 'WAITING_LIST').length}
              icon={<Clock className="w-6 h-6" />}
              color="yellow"
            />
            
            <StatsCard
              title="Âge moyen"
              value={residents.length > 0 ? `${Math.round(residents.reduce((acc, r) => acc + calculateAge(r.dateOfBirth), 0) / residents.length)} ans` : '0 ans'}
              icon={<TrendingUp className="w-6 h-6" />}
              color="purple"
            />
          </div>

          {/* Residents Table */}
          <DataTable
            data={residents}
            columns={columns}
            actions={actions}
            searchable={true}
            sortable={true}
            pagination={true}
            pageSize={10}
            emptyMessage="Aucun résident trouvé"
          />
        </main>
      </div>
    </Layout>
  );
};

export default ResidentsPage;