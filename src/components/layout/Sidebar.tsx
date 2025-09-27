import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
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
  Shield,
  ChevronDown,
  Package
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  requiresAuth: boolean;
  checkAccess: () => boolean;
  children?: NavigationItem[];
}

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const {
    canAccessUsersPage,
    canAccessSettingsPage,
    canAccessResidentsPage,
    canAccessHousesPage,
    canAccessTasksPage,
    canAccessServicesPage,
    getRoleDisplayName,
    getRoleBadgeColor
  } = usePermissions();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // Configuration de la navigation basée sur les permissions
  const navigation: NavigationItem[] = [
    {
      name: 'Tableau de bord',
      href: '/dashboard',
      icon: BarChart3,
      description: 'Vue d\'ensemble de la résidence',
      requiresAuth: true,
      checkAccess: () => true // Accessible à tous les utilisateurs connectés
    },
    {
      name: 'Administration',
      href: '#',
      icon: Shield,
      description: 'Gestion administrative',
      requiresAuth: true,
      checkAccess: () => canAccessUsersPage() || canAccessHousesPage() || canAccessResidentsPage() || canAccessTasksPage(),
      children: [
        {
          name: 'Utilisateurs',
          href: '/admin/users',
          icon: Users,
          description: 'Gestion des utilisateurs',
          requiresAuth: true,
          checkAccess: canAccessUsersPage
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
          name: 'Résidents',
          href: '/residents',
          icon: UserCheck,
          description: 'Gestion des résidents',
          requiresAuth: true,
          checkAccess: canAccessResidentsPage
        },
        {
          name: 'Tâches',
          href: '/tasks',
          icon: ClipboardList,
          description: 'Gestion des tâches',
          requiresAuth: true,
          checkAccess: canAccessTasksPage
        }
      ]
    },
    {
      name: 'Services',
      href: '/services',
      icon: Package,
      description: 'Services Home21',
      requiresAuth: true,
      checkAccess: canAccessServicesPage
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
    
    // Pour les items avec des enfants, vérifier qu'au moins un enfant est accessible
    if (item.children) {
      const visibleChildren = item.children.filter(child => {
        if (!child.requiresAuth) return true;
        return child.checkAccess();
      });
      return visibleChildren.length > 0;
    }
    
    return item.checkAccess();
  }).map(item => {
    // Filtrer les enfants visibles pour chaque item parent
    if (item.children) {
      return {
        ...item,
        children: item.children.filter(child => {
          if (!child.requiresAuth) return true;
          if (!user) return false;
          return child.checkAccess();
        })
      };
    }
    return item;
  });

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  if (loading) return null;

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-gray-700">
            <Link href={user ? '/dashboard' : '/'} className="flex items-center">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                Home21
              </span>
            </Link>
          </div>

          {/* Profil utilisateur */}
          {user && (
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-200" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className={cn('text-xs px-2 py-0.5 rounded-full inline-block mt-1', getRoleBadgeColor())}>
                    {getRoleDisplayName()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation principale */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.children 
                ? item.children.some(child => router.pathname === child.href || router.pathname.startsWith(child.href + '/'))
                : router.pathname === item.href || router.pathname.startsWith(item.href + '/');
              
              // Si l'item a des enfants (Administration)
              if (item.children && item.children.length > 0) {
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                      className={cn(
                        'w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive 
                          ? 'bg-blue-700 text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      )}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                      <ChevronDown className={cn(
                        'h-4 w-4 ml-auto transition-transform',
                        isAdminMenuOpen ? 'rotate-180' : ''
                      )} />
                    </button>
                    
                    {/* Sous-menu Administration */}
                    {isAdminMenuOpen && (
                      <div className="ml-6 space-y-1">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const childIsActive = router.pathname === child.href || router.pathname.startsWith(child.href + '/');
                          
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                'flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
                                childIsActive
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <ChildIcon className="h-4 w-4 mr-3" />
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              // Item normal sans enfants
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions utilisateur */}
          {user && (
            <div className="px-4 py-4 border-t border-gray-700 space-y-1">
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-3" />
                Mon Profil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};