import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { TasksSummary } from '@/components/dashboard/TasksSummary';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { ResidentAlerts } from '@/components/dashboard/ResidentAlerts';
import { QuickActions } from '@/components/dashboard/QuickActions';

const DashboardPage: React.FC = () => {
  return (
    <Layout
      title="Pass21 - Tableau de Bord Administrateur"
      description="Dashboard de gestion de la résidence Pass21"
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <DashboardHeader />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Overview */}
          <div className="mb-8">
            <StatsOverview />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Tasks and Activities */}
            <div className="lg:col-span-2 space-y-6">
              <TasksSummary />
              <RecentActivities />
            </div>

            {/* Right Column - Quick Actions and Alerts */}
            <div className="space-y-6">
              <QuickActions />
              <ResidentAlerts />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DashboardPage;