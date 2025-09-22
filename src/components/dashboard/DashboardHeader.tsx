import React from 'react';
import { Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Welcome */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">Pass21</span>
                <span className="ml-2 text-sm text-gray-500">Résidence</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un résident, une tâche, une maison..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Right Side - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-error-500 ring-2 ring-white"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Marie Dubois</div>
                  <div className="text-xs text-gray-500">Administratrice</div>
                </div>
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
              </div>
            </div>

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-3">
            <a href="#" className="text-primary-600 border-b-2 border-primary-600 pb-3 px-1 text-sm font-medium">
              Tableau de bord
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 pb-3 px-1 text-sm font-medium">
              Résidents
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 pb-3 px-1 text-sm font-medium">
              Maisons
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 pb-3 px-1 text-sm font-medium">
              Tâches
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 pb-3 px-1 text-sm font-medium">
              Services
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 pb-3 px-1 text-sm font-medium">
              Rapports
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};