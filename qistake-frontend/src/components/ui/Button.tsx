'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 font-semibold
      transition-all duration-300 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-primary to-primary-hover text-white
        shadow-glow-purple
        hover:shadow-glow-purple-lg hover:-translate-y-0.5
        active:translate-y-0
      `,
      secondary: `
        bg-transparent text-white
        border border-border-accent
        hover:bg-primary-light hover:border-primary
        hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]
      `,
      ghost: `
        bg-transparent text-text-secondary
        hover:bg-primary-light hover:text-white
      `,
      danger: `
        bg-error text-white
        hover:bg-red-600
        shadow-[0_0_20px_rgba(239,68,68,0.3)]
        hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-8 py-3 text-base rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
