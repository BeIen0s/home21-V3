import React from 'react';
import { AlertTriangle, Heart, Clock } from 'lucide-react';

const mockAlerts = [
  {
    id: '1',
    type: 'medical',
    priority: 'high',
    resident: 'Mme Dubois',
    message: 'Rendez-vous cardiologue dans 1h',
    room: '12A',
    time: '10:30',
    icon: Heart,
    color: 'text-error-600 bg-error-50 border-error-200'
  },
  {
    id: '2',
    type: 'maintenance',
    priority: 'medium',
    resident: 'M. Martin',
    message: 'Problème chauffage signalé',
    room: '8B',
    time: '09:15',
    icon: AlertTriangle,
    color: 'text-warning-600 bg-warning-50 border-warning-200'
  },
  {
    id: '3',
    type: 'reminder',
    priority: 'low',
    resident: 'Mme Petit',
    message: 'Médicament à prendre',
    room: '5C',
    time: '14:00',
    icon: Clock,
    color: 'text-primary-600 bg-primary-50 border-primary-200'
  }
];

export const ResidentAlerts: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Alertes Résidents</h2>
          <span className="bg-error-100 text-error-800 text-xs font-medium px-2 py-1 rounded-full">
            {mockAlerts.length}
          </span>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {mockAlerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div key={alert.id} className={`border-2 rounded-lg p-4 ${alert.color}`}>
              <div className="flex items-start space-x-3">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{alert.resident}</p>
                    <span className="text-xs">Maison {alert.room}</span>
                  </div>
                  <p className="text-sm mb-2">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{alert.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};