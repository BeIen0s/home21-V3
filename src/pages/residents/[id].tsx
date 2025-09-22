import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  User, 
  AlertTriangle,
  FileText,
  Clock,
  Heart,
  Pill,
  Plus
} from 'lucide-react';
import type { Resident, ResidentStatus, Gender, Document, MedicalInfo } from '@/types';

// Mock data pour les résidents (même que la page liste)
const mockResidents: (Resident & { houseName?: string; houseAddress?: string })[] = [
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
    houseAddress: '12A Rue de la Résidence, 75001 Paris',
    moveInDate: new Date('2023-01-15'),
    status: 'ACTIVE' as ResidentStatus,
    medicalInfo: {
      allergies: ['Fruits de mer', 'Pollen'],
      medications: [
        {
          name: 'Doliprane',
          dosage: '500mg',
          frequency: '3x/jour si besoin',
          startDate: new Date('2023-01-15'),
          prescribedBy: 'Dr. Martin'
        }
      ],
      conditions: ['Hypertension', 'Arthrose'],
      emergencyInstructions: 'Allergique aux fruits de mer - risque de choc anaphylactique'
    },
    documents: [
      {
        id: 'doc1',
        name: 'Carte d\'identité',
        type: 'ID',
        uploadedAt: new Date('2023-01-10'),
        url: '/documents/marie-dupont-id.pdf'
      },
      {
        id: 'doc2',
        name: 'Dossier médical',
        type: 'MEDICAL',
        uploadedAt: new Date('2023-01-12'),
        url: '/documents/marie-dupont-medical.pdf'
      }
    ],
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
    houseAddress: '8B Avenue des Seniors, 75001 Paris',
    moveInDate: new Date('2022-09-01'),
    status: 'ACTIVE' as ResidentStatus,
    medicalInfo: {
      allergies: ['Pénicilline'],
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: '1x/jour',
          startDate: new Date('2022-09-01'),
          prescribedBy: 'Dr. Rousseau'
        },
        {
          name: 'Aspirine',
          dosage: '100mg',
          frequency: '1x/jour',
          startDate: new Date('2022-09-01'),
          prescribedBy: 'Dr. Rousseau'
        }
      ],
      conditions: ['Diabète type 2', 'Hypertension'],
      emergencyInstructions: 'Diabétique - surveiller les signes d\'hypoglycémie'
    },
    documents: [
      {
        id: 'doc3',
        name: 'Carte vitale',
        type: 'MEDICAL',
        uploadedAt: new Date('2022-08-25'),
        url: '/documents/bernard-martin-vitale.pdf'
      }
    ],
    createdAt: new Date('2022-08-25'),
    updatedAt: new Date('2022-09-01')
  }
];

const getStatusBadge = (status: ResidentStatus) => {
  const statusConfig = {
    'ACTIVE': 'bg-success-100 text-success-800',
    'WAITING_LIST': 'bg-warning-100 text-warning-800',
    'TEMPORARY_LEAVE': 'bg-accent-100 text-accent-800',
    'MOVED_OUT': 'bg-gray-100 text-gray-800',
    'DECEASED': 'bg-error-100 text-error-800'
  };

  const statusLabels = {
    'ACTIVE': 'Actif',
    'WAITING_LIST': 'Liste d\'attente',
    'TEMPORARY_LEAVE': 'Congé temporaire',
    'MOVED_OUT': 'Déménagé',
    'DECEASED': 'Décédé'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]}`}>
      {statusLabels[status]}
    </span>
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

const ResidentDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<'general' | 'medical' | 'documents'>('general');

  // Trouver le résident par ID
  const resident = mockResidents.find(r => r.id === id);

  if (!resident) {
    return (
      <Layout title="Résident non trouvé" description="Le résident demandé n'a pas été trouvé">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Résident non trouvé</h1>
            <Button onClick={() => router.push('/residents')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleCallEmergencyContact = () => {
    const phone = resident.emergencyContact.phone;
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleEmailEmergencyContact = () => {
    const email = resident.emergencyContact.email;
    if (email) {
      window.open(`mailto:${email}`, '_self');
    }
  };

  return (
    <Layout
      title={`Pass21 - ${resident.firstName} ${resident.lastName}`}
      description={`Détails du résident ${resident.firstName} ${resident.lastName}`}
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
                  onClick={() => router.push('/residents')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {resident.firstName} {resident.lastName}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {calculateAge(resident.dateOfBirth)} ans • {resident.houseName || 'Aucun logement assigné'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(resident.status)}
                <Button>
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
                      <User className="h-4 w-4 inline mr-2" />
                      Informations générales
                    </button>
                    <button
                      onClick={() => setActiveTab('medical')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'medical'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Heart className="h-4 w-4 inline mr-2" />
                      Informations médicales
                    </button>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'documents'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <FileText className="h-4 w-4 inline mr-2" />
                      Documents ({resident.documents?.length || 0})
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 text-gray-400 mr-3" />
                            <div>
                              <span className="text-gray-500">Genre:</span>
                              <span className="ml-2 text-gray-900">
                                {resident.gender === 'MALE' ? 'Masculin' : 'Féminin'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                            <div>
                              <span className="text-gray-500">Date de naissance:</span>
                              <span className="ml-2 text-gray-900">
                                {new Intl.DateTimeFormat('fr-FR', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                }).format(resident.dateOfBirth)}
                              </span>
                            </div>
                          </div>
                          {resident.moveInDate && (
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 text-gray-400 mr-3" />
                              <div>
                                <span className="text-gray-500">Date d'entrée:</span>
                                <span className="ml-2 text-gray-900">
                                  {new Intl.DateTimeFormat('fr-FR').format(resident.moveInDate)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Housing Information */}
                      {resident.houseId && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Logement</h3>
                          <div className="flex items-start text-sm">
                            <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">{resident.houseName}</div>
                              {resident.houseAddress && (
                                <div className="text-gray-500 mt-1">{resident.houseAddress}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'medical' && (
                    <div className="space-y-6">
                      {resident.medicalInfo ? (
                        <>
                          {/* Emergency Instructions */}
                          {resident.medicalInfo.emergencyInstructions && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <div className="flex items-start">
                                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                                <div>
                                  <h4 className="text-sm font-medium text-red-800 mb-1">
                                    Instructions d'urgence
                                  </h4>
                                  <p className="text-sm text-red-700">
                                    {resident.medicalInfo.emergencyInstructions}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Allergies */}
                          {resident.medicalInfo.allergies && resident.medicalInfo.allergies.length > 0 && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-4">Allergies</h3>
                              <div className="flex flex-wrap gap-2">
                                {resident.medicalInfo.allergies.map((allergy, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                  >
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {allergy}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Medical Conditions */}
                          {resident.medicalInfo.conditions && resident.medicalInfo.conditions.length > 0 && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-4">Conditions médicales</h3>
                              <div className="flex flex-wrap gap-2">
                                {resident.medicalInfo.conditions.map((condition, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    <Heart className="h-3 w-3 mr-1" />
                                    {condition}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Medications */}
                          {resident.medicalInfo.medications && resident.medicalInfo.medications.length > 0 && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-4">Médicaments</h3>
                              <div className="space-y-3">
                                {resident.medicalInfo.medications.map((medication, index) => (
                                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-start">
                                      <Pill className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                          {medication.name} - {medication.dosage}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                          {medication.frequency}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          Prescrit par {medication.prescribedBy} le{' '}
                                          {new Intl.DateTimeFormat('fr-FR').format(medication.startDate)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <Heart className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Aucune information médicale disponible</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'documents' && (
                    <div className="space-y-4">
                      {resident.documents && resident.documents.length > 0 ? (
                        resident.documents.map((document) => (
                          <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                  <div className="font-medium text-gray-900">{document.name}</div>
                                  <div className="text-sm text-gray-500">
                                    Ajouté le {new Intl.DateTimeFormat('fr-FR').format(document.uploadedAt)}
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
                          <FileText className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Aucun document disponible</p>
                          <Button className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un document
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact d'urgence</h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-gray-900">{resident.emergencyContact.name}</div>
                    <div className="text-sm text-gray-500">{resident.emergencyContact.relationship}</div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCallEmergencyContact}
                      className="justify-start"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {resident.emergencyContact.phone}
                    </Button>
                    
                    {resident.emergencyContact.email && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleEmailEmergencyContact}
                        className="justify-start"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {resident.emergencyContact.email}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier les informations
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Ajouter un document
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Mettre à jour le dossier médical
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Changer de logement
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

export default ResidentDetailPage;