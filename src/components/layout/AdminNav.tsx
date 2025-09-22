import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  Users, 
  ClipboardList, 
  Calendar,
  Settings,
  BarChart3,
  MessageSquare
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Vue d\'ensemble'
  },
  {
    name: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
    description: 'Gestion des utilisateurs'
  },
  {
    name: 'Résidents',
    href: '/residents',
    icon: Users,
    description: 'Gestion des résidents'
  },
  {
    name: 'Logements',
    href: '/houses',
    icon: Home,
    description: 'Gestion des maisons'
  },
  {
    name: 'Tâches',
    href: '/tasks',
    icon: ClipboardList,
    description: 'Suivi des tâches'
  },
  {
    name: 'Services',
    href: '/services',
    icon: Calendar,
    description: 'Services proposés'
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    description: 'Communication'
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Settings,
    description: 'Configuration'
  }
];

export const AdminNav: React.FC = () => {
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return router.pathname === '/dashboard';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${active
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                title={item.description}
              >
                <Icon 
                  className={`h-4 w-4 ${active ? 'text-primary-600' : 'text-gray-400'}`} 
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};