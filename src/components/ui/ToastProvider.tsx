import React, { useState, useCallback } from 'react';
import { Toast, ToastProps, ToastContext, ToastContextType } from './Toast';

interface ToastItem extends ToastProps {
  id: string;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastItem = {
      ...toast,
      id,
      onClose: () => hideToast(id),
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove après 5 secondes
    setTimeout(() => {
      hideToast(id);
    }, 5000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const contextValue: ToastContextType = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            onClose={() => hideToast(toast.id)}
            action={toast.action}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};