import React from 'react';
import { Menu } from 'lucide-react';

interface TopBarProps {
  onMobileMenuToggle: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  onMobileMenuToggle,
  title 
}) => {
  return (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-3"
          >
            <Menu className="h-5 w-5" />
          </button>
          {title && (
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          )}
        </div>
      </div>
    </div>
  );
};