import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { 
  Menu, 
  X, 
  User, 
  LogOut,
  Home,
  Users,
  Settings,
  UserCheck,
  Building,
  ClipboardList,
  BarChart3,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  requiresAuth: boolean;
  checkAccess: () => boolean;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileToggle
}) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    canAccessUsersPage,
    canAccessSettingsPage,
    canAccessResidentsPage,
    canAccessHousesPage,
    canAccessTasksPage,
    canAccessServicesPage,
    currentUserRole
  } = usePermissions();

  // Configuration de la navigation basée sur les permissions
  const navigation: NavigationItem[] = [
    {
      name: 'Tableau de bord',
      href: '/dashboard',
      icon: BarChart3,
      description: 'Vue d\'ensemble de la résidence',
      requiresAuth: true,
      checkAccess: () => true
    },
    {
      name: 'Résidents',
      href: '/residents',
      icon: UserCheck,
      description: 'Gestion des résidents',
      requiresAuth: true,
      checkAccess: canAccessResidentsPage
    },
    {
      name: 'Logements',
      href: '/houses',
      icon: Building,
      description: 'Gestion des logements',
      requiresAuth: true,
      checkAccess: canAccessHousesPage
    },
    {
      name: 'Tâches',
      href: '/tasks',
      icon: ClipboardList,
      description: 'Gestion des tâches',
      requiresAuth: true,
      checkAccess: canAccessTasksPage
    },
    {
      name: 'Services',
      href: '/services',
      icon: Briefcase,
      description: 'Services aux résidents',
      requiresAuth: true,
      checkAccess: canAccessServicesPage
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      description: 'Messagerie',
      requiresAuth: true,
      checkAccess: () => true
    },
    {
      name: 'Utilisateurs',
      href: '/admin/users',
      icon: Users,
      description: 'Gestion des utilisateurs',
      requiresAuth: true,
      checkAccess: canAccessUsersPage
    },
    {
      name: 'Paramètres',
      href: '/settings',
      icon: Settings,
      description: 'Configuration système',
      requiresAuth: true,
      checkAccess: canAccessSettingsPage
    }
  ];

  // Filtrer les éléments de navigation selon les permissions
  const visibleNavigation = navigation.filter(item => {
    if (!item.requiresAuth) return true;
    if (!user) return false;
    return item.checkAccess();
  });

  const handleLogout = () => {
    logout();
    onMobileToggle();
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'SUPER_ADMIN': 'Super Admin',
      'ADMIN': 'Admin',
      'ENCADRANT': 'Encadrant',
      'RESIDENT': 'Résident'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      'SUPER_ADMIN': 'bg-red-100 text-red-800',
      'ADMIN': 'bg-purple-100 text-purple-800',
      'ENCADRANT': 'bg-green-100 text-green-800',
      'RESIDENT': 'bg-blue-100 text-blue-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn("flex items-center p-4 border-b border-gray-200", isCollapsed ? "justify-center" : "justify-between")}>
        <Link href={user ? '/dashboard' : '/'} className="flex items-center">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg">
            <Home className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="ml-3 text-lg font-bold text-gray-900">
              Pass21
            </span>
          )}
        </Link>
        
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* User Info */}
      {user && (
        <div className={cn("p-4 border-b border-gray-200", isCollapsed ? "text-center" : "")}>
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "space-x-3")}>
            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                <div className={cn('text-xs px-2 py-0.5 rounded-full inline-block mt-1', getRoleBadgeColor(currentUserRole))}>
                  {getRoleDisplayName(currentUserRole)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {visibleNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg text-sm font-medium transition-all duration-200 relative group',
                isCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2',
                isActive 
                  ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
onClick={() => {
                if (window.innerWidth < 1024) {
                  onMobileToggle();
                }
              }}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-primary-600' : 'text-gray-400', !isCollapsed && 'mr-3')} />
              {!isCollapsed && <span>{item.name}</span>}
              
              {/* Tooltip pour mode collapsé */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        {!isCollapsed && (
          <Link
            href="/profile"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
onClick={() => {
              if (window.innerWidth < 1024) {
                onMobileToggle();
              }
            }}
          >
            <User className="h-4 w-4 mr-3" />
            Mon Profil
          </Link>
        )}
        
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors w-full',
            isCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2'
          )}
        >
          <LogOut className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>

        {/* Toggle button pour mode collapsé */}
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={onMobileToggle}
          />
        )}
        
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link href={user ? '/dashboard' : '/'} className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-lg font-bold text-gray-900">Pass21</span>
            </Link>
            <button
              onClick={onMobileToggle}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {sidebarContent}
        </div>
      </div>
    </>
  );
};