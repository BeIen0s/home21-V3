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

export const AppNavigation: React.FC = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const {
    canAccessUsersPage,
    canAccessSettingsPage,
    canAccessResidentsPage,
    canAccessHousesPage,
    canAccessTasksPage,
    canAccessServicesPage,
    currentUserRole,
    getRoleDisplayName,
    getRoleBadgeColor
  } = usePermissions();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={user ? '/dashboard' : '/'} className="flex items-center">
              <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-100">
                Home21
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.children 
                ? item.children.some(child => router.pathname === child.href || router.pathname.startsWith(child.href + '/'))
                : router.pathname === item.href || router.pathname.startsWith(item.href + '/');
              
              // Si l'item a des enfants, rendre un dropdown
              if (item.children && item.children.length > 0) {
                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive 
                          ? 'bg-primary-900 text-primary-200 border border-primary-700' 
                          : 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 mr-2', isActive ? 'text-primary-300' : 'text-gray-400')} />
                      {item.name}
                      <ChevronDown className={cn(
                        'h-4 w-4 ml-1 transition-transform',
                        isAdminMenuOpen ? 'rotate-180' : ''
                      )} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isAdminMenuOpen && (
                      <div className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-1 z-50">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const childIsActive = router.pathname === child.href || router.pathname.startsWith(child.href + '/');
                          
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                'flex items-center px-4 py-2 text-sm transition-colors',
                                childIsActive
                                  ? 'bg-primary-900 text-primary-200'
                                  : 'text-gray-200 hover:bg-gray-700 hover:text-gray-100'
                              )}
                              onClick={() => setIsAdminMenuOpen(false)}
                            >
                              <ChildIcon className={cn('h-4 w-4 mr-3', childIsActive ? 'text-primary-300' : 'text-gray-400')} />
                              <div>
                                <div>{child.name}</div>
                                <div className="text-xs text-gray-400">{child.description}</div>
                              </div>
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
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative group',
                    isActive 
                      ? 'bg-primary-900 text-primary-200 border border-primary-700' 
                      : 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                  )}
                >
                  <Icon className={cn('h-4 w-4 mr-2', isActive ? 'text-primary-300' : 'text-gray-400')} />
                  {item.name}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
                    {item.description}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-32 bg-gray-600 animate-pulse rounded"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-gray-200 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <div className="h-8 w-8 bg-primary-800 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-200" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-100">{user.name}</div>
                    <div className={cn('text-xs px-2 py-0.5 rounded-full', getRoleBadgeColor())}>
                      {getRoleDisplayName()}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-1 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Link>
                    <div className="border-t border-gray-600"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-gray-100 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden',
            isMobileMenuOpen ? 'block' : 'hidden'
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
            {user && (
              <div className="px-3 py-2 mb-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className={cn('text-xs px-2 py-0.5 rounded-full inline-block', getRoleBadgeColor())}>
                      {getRoleDisplayName()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.children 
                ? item.children.some(child => router.pathname === child.href || router.pathname.startsWith(child.href + '/'))
                : router.pathname === item.href;
              
              // Si l'item a des enfants, rendre les sous-items
              if (item.children && item.children.length > 0) {
                return (
                  <div key={item.name} className="space-y-1">
                    {/* Header du groupe */}
                    <div className={cn(
                      'flex items-center px-3 py-2 rounded-md text-base font-medium',
                      isActive 
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' 
                        : 'text-gray-700 bg-gray-100'
                    )}>
                      <Icon className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    
                    {/* Sous-items */}
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childIsActive = router.pathname === child.href || router.pathname.startsWith(child.href + '/');
                        
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'flex items-center px-3 py-2 rounded-md text-sm font-medium',
                              childIsActive 
                                ? 'bg-primary-100 text-primary-800 border-l-2 border-primary-600' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <ChildIcon className="h-4 w-4 mr-2" />
                            <div>
                              <div>{child.name}</div>
                              <div className="text-xs text-gray-500">{child.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              
              // Item normal sans enfants
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-base font-medium',
                    isActive 
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
            
            {user && (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/profile"
                  className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-3" />
                  Mon Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Déconnexion
                </button>
              </div>
            )}
            
            {!user && (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
      {isAdminMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsAdminMenuOpen(false)}
        />
      )}
    </nav>
  );
};