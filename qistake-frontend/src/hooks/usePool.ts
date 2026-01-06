'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contracts } from '@/lib/contracts';
import { qieMainnet } from '@/lib/chains';
import { Address } from 'viem';

// Read: Get pool stats
export function usePoolStats(poolAddress: Address | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: contracts.pool.abi,
    functionName: 'getPoolStats',
    chainId: qieMainnet.id,
    query: {
      enabled: !!poolAddress,
    },
  });
}

// Read: Get pool metadata
export function usePoolMetadata(poolAddress: Address | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: contracts.pool.abi,
    functionName: 'getMetadata',
    chainId: qieMainnet.id,
    query: {
      enabled: !!poolAddress,
    },
  });
}

// Read: Get user info
export function useUserInfo(poolAddress: Address | undefined, userAddress: Address | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: contracts.pool.abi,
    functionName: 'getUserInfo',
    args: userAddress ? [userAddress] : undefined,
    chainId: qieMainnet.id,
    query: {
      enabled: !!poolAddress && !!userAddress,
    },
  });
}

// Read: Get earned rewards
export function useEarned(poolAddress: Address | undefined, userAddress: Address | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: contracts.pool.abi,
    functionName: 'earned',
    args: userAddress ? [userAddress] : undefined,
    chainId: qieMainnet.id,
    query: {
      enabled: !!poolAddress && !!userAddress,
    },
  });
}

// Read: Get staking token address
export function useStakingToken(poolAddress: Address | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: contracts.pool.abi,
    functionName: 'stakingToken',
    chainId: qieMainnet.id,
    query: {
      enabled: !!poolAddress,
    },
  });
}

// Read: Check if rewards are deposited
export function useRewardsDeposited(poolAddress: Address | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: contracts.pool.abi,
    functionName: 'rewardsDeposited',
    chainId: qieMainnet.id,
    query: {
      enabled: !!poolAddress,
    },
  });
}

// Read: Get pool creator
export function usePoolCreator(poolAddress: Address | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: contracts.pool.abi,
    functionName: 'creator',
    chainId: qieMainnet.id,
    query: {
      enabled: !!poolAddress,
    },
  });
}

// Read: Get total staked
export function useTotalStaked(poolAddress: Address | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: contracts.pool.abi,
    functionName: 'totalStaked',
    chainId: qieMainnet.id,
    query: {
      enabled: !!poolAddress,
    },
  });
}

// Read: Get total rewards
export function useTotalRewards(poolAddress: Address | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: contracts.pool.abi,
    functionName: 'totalRewards',
    chainId: qieMainnet.id,
    query: {
      enabled: !!poolAddress,
    },
  });
}

// Write: Stake tokens
export function useStake(poolAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const stake = (amount: bigint) => {
    if (!poolAddress) return;
    writeContract({
      address: poolAddress,
      abi: contracts.pool.abi,
      functionName: 'stake',
      args: [amount],
      chainId: qieMainnet.id,
    });
  };

  return {
    stake,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}

// Write: Unstake tokens
export function useUnstake(poolAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const unstake = (amount: bigint) => {
    if (!poolAddress) return;
    writeContract({
      address: poolAddress,
      abi: contracts.pool.abi,
      functionName: 'unstake',
      args: [amount],
      chainId: qieMainnet.id,
    });
  };

  return {
    unstake,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}

// Write: Claim rewards
export function useClaimRewards(poolAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claimRewards = () => {
    if (!poolAddress) return;
    writeContract({
      address: poolAddress,
      abi: contracts.pool.abi,
      functionName: 'claimRewards',
      chainId: qieMainnet.id,
    });
  };

  return {
    claimRewards,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}

// Write: Deposit rewards (for pool creator)
export function useDepositRewards(poolAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const depositRewards = () => {
    if (!poolAddress) return;
    writeContract({
      address: poolAddress,
      abi: contracts.pool.abi,
      functionName: 'depositRewards',
      chainId: qieMainnet.id,
    });
  };

  return {
    depositRewards,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}
