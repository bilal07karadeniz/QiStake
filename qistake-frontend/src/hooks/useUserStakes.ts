'use client';

import { useMemo } from 'react';
import { useReadContracts, useAccount } from 'wagmi';
import { Address } from 'viem';
import { contracts } from '@/lib/contracts';
import { qieMainnet } from '@/lib/chains';
import { usePools } from './usePools';
import { StakePosition, UserPoolInfo } from '@/types';

export function useUserStakes() {
  const { address: userAddress } = useAccount();
  const { pools, isLoading: isLoadingPools, refetch: refetchPools } = usePools('all');

  // Build contracts array for fetching user info from each pool
  const userInfoContracts = useMemo(() => {
    if (!userAddress || pools.length === 0) return [];

    return pools.map((pool) => ({
      address: pool.address,
      abi: contracts.pool.abi as any,
      functionName: 'getUserInfo' as const,
      args: [userAddress] as const,
      chainId: qieMainnet.id,
    }));
  }, [pools, userAddress]);

  // Fetch user info from all pools
  const { data: userInfoData, isLoading: isLoadingUserInfo, refetch: refetchUserInfo } = useReadContracts({
    contracts: userInfoContracts,
    query: {
      enabled: userInfoContracts.length > 0 && !!userAddress,
    },
  });

  // Build stake positions
  const stakePositions = useMemo(() => {
    if (!userInfoData || pools.length === 0) return [];

    const positions: StakePosition[] = [];

    pools.forEach((pool, index) => {
      const result = userInfoData[index];
      if (!result?.result) return;

      const [stakedBalance, pendingRewards] = result.result as [bigint, bigint];

      // Only include if user has stake
      if (stakedBalance > 0n) {
        positions.push({
          pool,
          userInfo: {
            stakedBalance,
            pendingRewards,
          },
        });
      }
    });

    return positions;
  }, [userInfoData, pools]);

  // Calculate totals
  const totals = useMemo(() => {
    let totalPositions = stakePositions.length;

    // Group rewards by token
    const rewardsByToken = new Map<Address, { amount: bigint; symbol: string; decimals: number }>();

    stakePositions.forEach((position) => {
      const token = position.pool.stakingToken;
      const existing = rewardsByToken.get(token);

      if (existing) {
        existing.amount += position.userInfo.pendingRewards;
      } else {
        rewardsByToken.set(token, {
          amount: position.userInfo.pendingRewards,
          symbol: position.pool.tokenInfo.symbol,
          decimals: position.pool.tokenInfo.decimals,
        });
      }
    });

    return {
      totalPositions,
      rewardsByToken: Array.from(rewardsByToken.entries()).map(([address, data]) => ({
        tokenAddress: address,
        ...data,
      })),
    };
  }, [stakePositions]);

  const refetch = async () => {
    await Promise.all([refetchPools(), refetchUserInfo()]);
  };

  return {
    stakePositions,
    totals,
    isLoading: isLoadingPools || isLoadingUserInfo,
    isConnected: !!userAddress,
    refetch,
  };
}
