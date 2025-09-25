import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

// Generate unique IDs for form fields
let idCounter = 0;
const generateId = () => `input-${++idCounter}`;

const inputVariants = cva(
  'flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:border-primary-500',
        error: 'border-red-300 text-red-900 placeholder:text-red-400 focus:border-red-500 focus-visible:ring-red-500',
        success: 'border-green-300 text-green-900 focus:border-green-500 focus-visible:ring-green-500',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, helper, id, name, ...props }, ref) => {
    // Generate unique ID if not provided
    const inputId = React.useMemo(() => id || generateId(), [id]);
    // Use name from props or fallback to ID
    const inputName = name || inputId;
    
    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          name={inputName}
          className={cn(inputVariants({ variant: error ? 'error' : variant, size, className }))}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 flex items-center" role="alert">
            <span className="mr-1">⚠</span>
            {error}
          </p>
        )}
        {helper && !error && (
          <p className="text-xs text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };