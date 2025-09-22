import React from 'react';
import { Plus, UserPlus, Home, ClipboardList, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const quickActions = [
  {
    id: '1',
    title: 'Nouveau Résident',
    description: 'Inscrire un nouveau résident',
    icon: UserPlus,
    color: 'bg-primary-500 hover:bg-primary-600',
    href: '/residents/new'
  },
  {
    id: '2',
    title: 'Créer une Tâche',
    description: 'Assigner une nouvelle tâche',
    icon: Plus,
    color: 'bg-secondary-500 hover:bg-secondary-600',
    href: '/tasks/new'
  },
  {
    id: '3',
    title: 'Gérer Maisons',
    description: 'Voir état des logements',
    icon: Home,
    color: 'bg-accent-500 hover:bg-accent-600',
    href: '/houses'
  },
  {
    id: '4',
    title: 'Planifier',
    description: 'Calendrier des activités',
    icon: Calendar,
    color: 'bg-purple-500 hover:bg-purple-600',
    href: '/calendar'
  },
  {
    id: '5',
    title: 'Messages',
    description: 'Communication équipe',
    icon: MessageSquare,
    color: 'bg-pink-500 hover:bg-pink-600',
    href: '/messages'
  },
  {
    id: '6',
    title: 'Rapports',
    description: 'Analytics et statistiques',
    icon: ClipboardList,
    color: 'bg-indigo-500 hover:bg-indigo-600',
    href: '/reports'
  }
];

export const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Actions Rapides</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className="group relative bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-lg text-white transition-colors ${action.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button variant="outline" className="w-full">
            Voir toutes les actions
          </Button>
        </div>
      </div>
    </div>
  );
};