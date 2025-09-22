import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const toastVariants = cva(
  'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white',
        success: 'border-green-200 bg-green-50',
        error: 'border-red-200 bg-red-50',
        warning: 'border-yellow-200 bg-yellow-50',
        info: 'border-blue-200 bg-blue-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const getIcon = (variant: string) => {
  switch (variant) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  onClose?: () => void;
  action?: React.ReactNode;
}

export const Toast: React.FC<ToastProps> = ({
  variant = 'default',
  title,
  description,
  onClose,
  action,
}) => {
  return (
    <div className={cn(toastVariants({ variant }))}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon(variant || 'default')}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && (
              <p className="text-sm font-medium text-gray-900">{title}</p>
            )}
            {description && (
              <p className={cn(
                "text-sm text-gray-500",
                title ? "mt-1" : ""
              )}>
                {description}
              </p>
            )}
            {action && (
              <div className="mt-3 flex space-x-7">
                {action}
              </div>
            )}
          </div>
          {onClose && (
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span className="sr-only">Fermer</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Toast Provider Context for global toast management
export interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'onClose'>) => void;
  hideToast: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Simple toast hooks for common use cases
export const useToastActions = () => {
  const { showToast } = useToast();

  const showSuccess = (title: string, description?: string) => {
    showToast({ variant: 'success', title, description });
  };

  const showError = (title: string, description?: string) => {
    showToast({ variant: 'error', title, description });
  };

  const showWarning = (title: string, description?: string) => {
    showToast({ variant: 'warning', title, description });
  };

  const showInfo = (title: string, description?: string) => {
    showToast({ variant: 'info', title, description });
  };

  return { showSuccess, showError, showWarning, showInfo };
};