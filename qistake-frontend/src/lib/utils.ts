import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format token amount with proper decimals (with K/M/B suffixes for display)
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 18,
  maxDecimals: number = 4
): string {
  if (amount === 0n) return '0';

  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;

  // Format large numbers with suffixes
  if (whole >= 1_000_000_000n) {
    return `${(Number(whole) / 1_000_000_000).toFixed(2)}B`;
  }
  if (whole >= 1_000_000n) {
    return `${(Number(whole) / 1_000_000).toFixed(2)}M`;
  }
  if (whole >= 1_000n) {
    return `${(Number(whole) / 1_000).toFixed(2)}K`;
  }

  // Format with decimals
  const fractionStr = fraction.toString().padStart(decimals, '0');
  const trimmedFraction = fractionStr.slice(0, maxDecimals).replace(/0+$/, '');

  if (trimmedFraction) {
    return `${whole}.${trimmedFraction}`;
  }
  return whole.toString();
}

// Format token amount for input fields (full precision, no suffixes)
export function formatTokenAmountInput(
  amount: bigint,
  decimals: number = 18
): string {
  if (amount === 0n) return '0';

  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;

  // Format with full decimals, trim trailing zeros
  const fractionStr = fraction.toString().padStart(decimals, '0');
  const trimmedFraction = fractionStr.replace(/0+$/, '');

  if (trimmedFraction) {
    return `${whole}.${trimmedFraction}`;
  }
  return whole.toString();
}

// Format address for display
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Calculate APR from reward rate and total staked (linear, no compounding)
export function calculateAPR(
  totalRewards: bigint,
  totalStaked: bigint,
  durationDays: number = 365
): number {
  if (totalStaked === 0n) return 0;

  // APR = (totalRewards / totalStaked) * (365 / durationDays) * 100
  const roi = Number(totalRewards * 10000n / totalStaked) / 100;
  return (roi * 365) / durationDays;
}

// Format time remaining
export function formatTimeRemaining(endTimeSeconds: number, startTimeSeconds: number = 0, hasEnded: boolean = false): string {
  // If contract says pool has ended, show Ended
  if (hasEnded) return 'Ended';

  // If pool hasn't started yet (no stakers), show default duration
  if (startTimeSeconds === 0 || endTimeSeconds === 0) {
    return '12 months'; // Default DURATION from contract
  }

  const now = Math.floor(Date.now() / 1000);
  const remaining = endTimeSeconds - now;

  if (remaining <= 0) return 'Ended';

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (days > 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Format date
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Validate Ethereum address
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Parse token amount from string input
export function parseTokenAmount(value: string, decimals: number = 18): bigint {
  if (!value || value === '') return 0n;

  // Remove any commas
  value = value.replace(/,/g, '');

  // Split into whole and decimal parts
  const parts = value.split('.');
  const whole = parts[0] || '0';
  let decimal = parts[1] || '';

  // Pad or truncate decimal to match decimals
  decimal = decimal.padEnd(decimals, '0').slice(0, decimals);

  return BigInt(whole + decimal);
}

// Get explorer URL for address
export function getExplorerAddressUrl(address: string): string {
  return `https://mainnet.qie.digital/address/${address}`;
}

// Get explorer URL for transaction
export function getExplorerTxUrl(txHash: string): string {
  return `https://mainnet.qie.digital/tx/${txHash}`;
}

// Format ether (native token) amount
export function formatEther(wei: bigint): string {
  return formatTokenAmount(wei, 18, 4);
}
