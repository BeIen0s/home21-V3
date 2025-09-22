import React from 'react';
import { AlertCircle, Calendar } from 'lucide-react';

interface FormDatePickerProps {
  id: string;
  label: string;
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  min?: string;
  max?: string;
  className?: string;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
  min,
  max,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type="date"
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          className={`
            block w-full rounded-md border px-3 py-2 text-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${error
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 text-gray-900 focus:border-primary-500 focus:ring-primary-500'
            }
          `}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {error ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <Calendar className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};