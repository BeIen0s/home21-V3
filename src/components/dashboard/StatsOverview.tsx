import React from 'react';
import { Users, Home, CheckSquare, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import type { DashboardStats } from '@/types';

// Mock data - would come from API in real implementation
const mockStats: DashboardStats = {
  residents: {
    total: 84,
    active: 82,
    newThisMonth: 3,
    waitingList: 12
  },
  houses: {
    total: 45,
    occupied: 42,
    available: 2,
    maintenance: 1,
    occupancyRate: 93.3
  },
  tasks: {
    pending: 23,
    inProgress: 8,
    completedToday: 15,
    overdue: 2,
    completionRate: 87.5
  },
  services: {
    activeRequests: 7,
    completedToday: 12,
    averageResponseTime: 45
  }
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color 
}) => {
  const colorClasses = {
    blue: 'bg-primary-50 text-primary-600 border-primary-200',
    green: 'bg-secondary-50 text-secondary-600 border-secondary-200',
    orange: 'bg-accent-50 text-accent-600 border-accent-200',
    red: 'bg-error-50 text-error-600 border-error-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  const iconColorClasses = {
    blue: 'bg-primary-100 text-primary-600',
    green: 'bg-secondary-100 text-secondary-600',
    orange: 'bg-accent-100 text-accent-600',
    red: 'bg-error-100 text-error-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className={`bg-white rounded-lg border-2 ${colorClasses[color]} p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
          {trend.isPositive ? (
            <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-error-600 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}>
            {trend.value}%
          </span>
          <span className="text-sm text-gray-500 ml-2">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export const StatsOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Résidents"
        value={mockStats.residents.active}
        subtitle={`${mockStats.residents.total} au total`}
        icon={Users}
        trend={{
          value: 5.2,
          isPositive: true,
          label: 'ce mois'
        }}
        color="blue"
      />

      <StatCard
        title="Occupation"
        value={`${mockStats.houses.occupancyRate}%`}
        subtitle={`${mockStats.houses.occupied}/${mockStats.houses.total} maisons`}
        icon={Home}
        trend={{
          value: 2.1,
          isPositive: true,
          label: 'vs mois dernier'
        }}
        color="green"
      />

      <StatCard
        title="Tâches en cours"
        value={mockStats.tasks.inProgress}
        subtitle={`${mockStats.tasks.pending} en attente`}
        icon={CheckSquare}
        trend={{
          value: 12,
          isPositive: false,
          label: 'depuis hier'
        }}
        color="orange"
      />

      <StatCard
        title="Alertes"
        value={mockStats.tasks.overdue + 5}
        subtitle="Nécessitent attention"
        icon={AlertTriangle}
        color="red"
      />
    </div>
  );
};