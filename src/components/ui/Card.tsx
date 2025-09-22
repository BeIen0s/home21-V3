import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const cardVariants = cva(
  'rounded-lg border bg-white text-gray-900 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-gray-200 shadow-sm',
        elevated: 'border-gray-200 shadow-md hover:shadow-lg',
        outlined: 'border-2 border-gray-300 shadow-none',
        ghost: 'border-transparent shadow-none bg-transparent',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components for structured content
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { divider?: boolean }
>(({ className, divider, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'space-y-1.5 p-4',
      divider && 'border-b border-gray-200',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight text-lg text-gray-900', className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600 leading-relaxed', className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 pt-0', className)} {...props}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { divider?: boolean }
>(({ className, divider, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center p-4 pt-0',
      divider && 'border-t border-gray-200 pt-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Stats Card variant for metrics display
export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'gray';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <Card variant="elevated" className="relative overflow-hidden">
      <div className="flex items-center">
        {icon && (
          <div className={cn('p-3 rounded-lg mr-4', colorClasses[color])}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <span
                className={cn(
                  'ml-2 text-sm font-medium',
                  trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.direction === 'up' ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };