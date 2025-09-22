import React from 'react';
import { User, Home, CheckSquare, FileText, Clock } from 'lucide-react';

const mockActivities = [
  {
    id: '1',
    type: 'task_completed',
    description: 'Tâche "Nettoyage cuisine commune" terminée',
    user: 'Marie Nettoyage',
    time: '5 minutes ago',
    icon: CheckSquare,
    color: 'text-success-600'
  },
  {
    id: '2',
    type: 'resident_new',
    description: 'Nouveau résident inscrit : M. Bernard Petit',
    user: 'Admin',
    time: '1 heure ago',
    icon: User,
    color: 'text-primary-600'
  },
  {
    id: '3',
    type: 'maintenance',
    description: 'Demande de maintenance pour la Maison 15B',
    user: 'Mme Dupont',
    time: '2 heures ago',
    icon: Home,
    color: 'text-accent-600'
  },
  {
    id: '4',
    type: 'document',
    description: 'Document médical mis à jour',
    user: 'Dr. Martin',
    time: '3 heures ago',
    icon: FileText,
    color: 'text-secondary-600'
  }
];

export const RecentActivities: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {mockActivities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="px-6 py-4 flex items-start space-x-3">
              <div className={`flex-shrink-0 ${activity.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>{activity.user}</span>
                  <span className="mx-2">•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};