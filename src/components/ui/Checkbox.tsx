import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const checkboxVariants = cva(
  'rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0 transition-colors',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    className, 
    size, 
    label, 
    description, 
    error, 
    containerClassName,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    const content = (
      <>
        <input
          type="checkbox"
          ref={ref}
          id={inputId}
          className={cn(checkboxVariants({ size }), className)}
          {...props}
        />
        {(label || description) && (
          <div className="ml-2">
            {label && (
              <label 
                htmlFor={inputId}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        )}
      </>
    );

    if (label || description) {
      return (
        <div className={cn('flex items-start', containerClassName)}>
          {content}
          {error && <p className="text-sm text-error-600 mt-1">{error}</p>}
        </div>
      );
    }

    return (
      <input
        type="checkbox"
        ref={ref}
        id={inputId}
        className={cn(checkboxVariants({ size }), className)}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { checkboxVariants };