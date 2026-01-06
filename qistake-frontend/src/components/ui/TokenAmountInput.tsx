'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { formatTokenAmount } from '@/lib/utils';

export interface TokenAmountInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  balance?: bigint;
  decimals?: number;
  symbol?: string;
  label?: string;
  error?: string;
  onMax?: () => void;
  showBalance?: boolean;
}

const TokenAmountInput = forwardRef<HTMLInputElement, TokenAmountInputProps>(
  (
    {
      value,
      onChange,
      balance,
      decimals = 18,
      symbol,
      label,
      error,
      onMax,
      showBalance = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Allow only numbers and one decimal point
      if (/^[0-9]*\.?[0-9]*$/.test(inputValue) || inputValue === '') {
        onChange(inputValue);
      }
    };

    const handleMax = () => {
      if (balance !== undefined && onMax) {
        onMax();
      }
    };

    return (
      <div className={cn('w-full', className)}>
        {/* Label and Balance Row */}
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-medium text-text-secondary">
              {label}
            </label>
          )}
          {showBalance && balance !== undefined && (
            <span className="text-xs text-text-tertiary">
              Balance: {formatTokenAmount(balance, decimals)} {symbol}
            </span>
          )}
        </div>

        {/* Input Container */}
        <div
          className={cn(
            'flex items-center gap-3 p-4',
            'bg-background-secondary border border-border rounded-xl',
            'transition-all duration-300',
            'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
            error && 'border-error focus-within:border-error focus-within:ring-error/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {/* Input */}
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            value={value}
            onChange={handleChange}
            placeholder="0.0"
            disabled={disabled}
            className={cn(
              'flex-1 bg-transparent border-none outline-none',
              'text-2xl font-semibold text-white',
              'placeholder:text-text-muted',
              disabled && 'cursor-not-allowed'
            )}
            {...props}
          />

          {/* Token Symbol and MAX Button */}
          <div className="flex items-center gap-2">
            {onMax && (
              <button
                type="button"
                onClick={handleMax}
                disabled={disabled || balance === 0n}
                className={cn(
                  'px-2 py-1 text-xs font-semibold rounded-md',
                  'bg-primary-light text-primary',
                  'hover:bg-primary/30 transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                MAX
              </button>
            )}
            {symbol && (
              <span className="text-sm font-medium text-text-secondary">
                {symbol}
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1.5 text-xs text-error-text">{error}</p>
        )}
      </div>
    );
  }
);

TokenAmountInput.displayName = 'TokenAmountInput';

export { TokenAmountInput };
