import React from 'react';
import { Button } from './Button';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

const getIcon = (variant: string) => {
  switch (variant) {
    case 'danger':
      return <AlertTriangle className="w-6 h-6 text-red-600" />;
    case 'warning':
      return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    case 'success':
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    default:
      return <Info className="w-6 h-6 text-blue-600" />;
  }
};

const getButtonVariant = (variant: string) => {
  switch (variant) {
    case 'danger':
      return 'error';
    case 'warning':
      return 'warning';
    case 'success':
      return 'success';
    default:
      return 'primary';
  }
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'info'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getIcon(variant)}
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              variant={getButtonVariant(variant) as any}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for easier confirmation dialogs
export const useConfirmDialog = () => {
  const [dialog, setDialog] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const confirm = (options: {
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
  }) => {
    setDialog({
      isOpen: true,
      ...options,
    });
  };

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialog.isOpen}
      onClose={closeDialog}
      onConfirm={dialog.onConfirm}
      title={dialog.title}
      message={dialog.message}
      variant={dialog.variant}
      confirmText={dialog.confirmText}
      cancelText={dialog.cancelText}
    />
  );

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent,
  };
};