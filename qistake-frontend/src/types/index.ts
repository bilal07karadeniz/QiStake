import { Address } from 'viem';

// Pool metadata
export interface PoolMetadata {
  website: string;
  telegram: string;
  twitter: string;
  description: string;
  logoUrl: string;
}

// Pool stats from contract
export interface PoolStats {
  totalStaked: bigint;
  totalRewards: bigint;
  startTime: number;
  endTime: number;
  hasStarted: boolean;
  hasEnded: boolean;
  isPaused: boolean;
  gracePeriod: number;
}

// Complete pool data
export interface Pool {
  address: Address;
  stakingToken: Address;
  stats: PoolStats;
  metadata: PoolMetadata;
  tokenInfo: TokenInfo;
}

// Token information
export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
}

// User info in a pool
export interface UserPoolInfo {
  stakedBalance: bigint;
  pendingRewards: bigint;
}

// User's stake position
export interface StakePosition {
  pool: Pool;
  userInfo: UserPoolInfo;
}

// Pool status type
export type PoolStatus = 'active' | 'ended' | 'paused';

// Get pool status from data
// Note: Pools are auto-funded by factory, so !hasStarted just means waiting for first staker (still active)
export function getPoolStatus(_hasStarted: boolean, hasEnded: boolean, isPaused: boolean = false): PoolStatus {
  if (hasEnded) return 'ended';
  if (isPaused) return 'paused';
  // Pools without stakers yet are still active and ready to stake
  return 'active';
}

// Transaction status
export type TransactionStatus =
  | 'idle'
  | 'confirming'
  | 'pending'
  | 'success'
  | 'error';

// Filter options for pools
export type PoolFilter = 'all' | 'active' | 'ended';

// Sort options for pools
export type PoolSort = 'newest' | 'oldest' | 'mostStaked' | 'highestApy';
