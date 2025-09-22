import React from 'react';
import { Check } from 'lucide-react';

interface FormCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  error?: string;
  className?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  description,
  error,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start">
        <div className="relative flex items-center">
          <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className={`
              h-4 w-4 rounded border-gray-300 text-primary-600 
              focus:ring-primary-500 focus:ring-offset-0 focus:ring-2
              ${error ? 'border-red-300' : ''}
            `}
          />
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="ml-3">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 ml-7">
          {error}
        </p>
      )}
    </div>
  );
};