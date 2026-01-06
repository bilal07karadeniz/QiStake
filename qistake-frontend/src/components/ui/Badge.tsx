'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1 font-semibold rounded-full';

    const variants = {
      default: 'bg-primary-light text-text-accent border border-border-accent',
      success: 'bg-success-light text-success-text border border-success-border',
      error: 'bg-error-light text-error-text border border-error-border',
      warning: 'bg-warning-light text-warning-text border border-warning-border',
      info: 'bg-info-light text-info-text border border-info-border',
    };

    const sizes = {
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
