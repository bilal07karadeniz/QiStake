'use client';

import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { Address, erc20Abi } from 'viem';
import { contracts } from '@/lib/contracts';
import { qieMainnet } from '@/lib/chains';
import { useGetAllPools } from './useFactory';
import { Pool, TokenInfo, PoolFilter, getPoolStatus } from '@/types';

// Fetch all pool data
export function usePools(filter: PoolFilter = 'all') {
  // First, get all pool addresses
  const { data: poolAddresses, isLoading: isLoadingAddresses, error: addressError } = useGetAllPools();

  // Build contracts array for batch fetching (only getPoolStats, getMetadata, stakingToken)
  const poolContracts = useMemo(() => {
    if (!poolAddresses || !Array.isArray(poolAddresses) || poolAddresses.length === 0) return [];

    const contracts_array: any[] = [];

    poolAddresses.forEach((poolAddress: Address) => {
      // Pool stats (includes all status info)
      contracts_array.push({
        address: poolAddress,
        abi: contracts.pool.abi,
        functionName: 'getPoolStats',
        chainId: qieMainnet.id,
      });
      // Pool metadata
      contracts_array.push({
        address: poolAddress,
        abi: contracts.pool.abi,
        functionName: 'getMetadata',
        chainId: qieMainnet.id,
      });
      // Staking token (needed for token info)
      contracts_array.push({
        address: poolAddress,
        abi: contracts.pool.abi,
        functionName: 'stakingToken',
        chainId: qieMainnet.id,
      });
    });

    return contracts_array;
  }, [poolAddresses]);

  // Fetch all pool data
  const { data: poolsData, isLoading: isLoadingPools, error: poolsError, refetch } = useReadContracts({
    contracts: poolContracts,
    query: {
      enabled: poolContracts.length > 0,
    },
  });

  // Get unique token addresses for fetching token info
  const tokenAddresses = useMemo(() => {
    if (!poolsData || !poolAddresses || !Array.isArray(poolAddresses)) return [];
    const tokens = new Set<Address>();

    (poolAddresses as Address[]).forEach((_: Address, index: number) => {
      const tokenResult = poolsData[index * 3 + 2]; // stakingToken is at index 2 per pool
      if (tokenResult?.result) {
        tokens.add(tokenResult.result as Address);
      }
    });

    return Array.from(tokens);
  }, [poolsData, poolAddresses]);

  // Build token contracts for batch fetching
  const tokenContracts = useMemo(() => {
    if (tokenAddresses.length === 0) return [];

    const contracts_array: any[] = [];

    tokenAddresses.forEach((tokenAddress) => {
      contracts_array.push({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'name',
        chainId: qieMainnet.id,
      });
      contracts_array.push({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId: qieMainnet.id,
      });
      contracts_array.push({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
        chainId: qieMainnet.id,
      });
    });

    return contracts_array;
  }, [tokenAddresses]);

  // Fetch all token data
  const { data: tokensData, isLoading: isLoadingTokens } = useReadContracts({
    contracts: tokenContracts,
    query: {
      enabled: tokenContracts.length > 0,
    },
  });

  // Build token info map
  const tokenInfoMap = useMemo(() => {
    if (!tokensData || tokenAddresses.length === 0) return new Map<Address, TokenInfo>();

    const map = new Map<Address, TokenInfo>();

    tokenAddresses.forEach((address, index) => {
      const name = tokensData[index * 3]?.result as string | undefined;
      const symbol = tokensData[index * 3 + 1]?.result as string | undefined;
      const decimals = tokensData[index * 3 + 2]?.result as number | undefined;

      if (name && symbol && decimals !== undefined) {
        map.set(address, { address, name, symbol, decimals });
      }
    });

    return map;
  }, [tokensData, tokenAddresses]);

  // Parse and combine all pool data
  const pools = useMemo(() => {
    if (!poolAddresses || !Array.isArray(poolAddresses) || !poolsData) return [];

    const result: Pool[] = [];

    (poolAddresses as Address[]).forEach((poolAddress: Address, index: number) => {
      const baseIndex = index * 3; // 3 calls per pool now

      const statsResult = poolsData[baseIndex];
      const metadataResult = poolsData[baseIndex + 1];
      const tokenResult = poolsData[baseIndex + 2];

      if (!statsResult?.result || !metadataResult?.result || !tokenResult?.result) {
        return;
      }

      // getPoolStats returns 8 values now
      const [totalStaked, totalRewards, startTime, endTime, hasStarted, hasEnded, isPaused, gracePeriod] =
        statsResult.result as [bigint, bigint, bigint, bigint, boolean, boolean, boolean, bigint];
      const [website, telegram, twitter, description, logoUrl] = metadataResult.result as [string, string, string, string, string];
      const stakingToken = tokenResult.result as Address;

      const tokenInfo = tokenInfoMap.get(stakingToken);

      if (!tokenInfo) return;

      const pool: Pool = {
        address: poolAddress,
        stakingToken,
        stats: {
          totalStaked,
          totalRewards,
          startTime: Number(startTime),
          endTime: Number(endTime),
          hasStarted,
          hasEnded,
          isPaused,
          gracePeriod: Number(gracePeriod),
        },
        metadata: {
          website,
          telegram,
          twitter,
          description,
          logoUrl,
        },
        tokenInfo,
      };

      // Apply filter
      const status = getPoolStatus(hasStarted, hasEnded, isPaused);
      if (filter === 'all' || filter === status) {
        result.push(pool);
      }
    });

    // Sort by newest first (by start time descending, pools that haven't started go last)
    return result.sort((a, b) => {
      if (a.stats.startTime === 0 && b.stats.startTime === 0) return 0;
      if (a.stats.startTime === 0) return 1;
      if (b.stats.startTime === 0) return -1;
      return b.stats.startTime - a.stats.startTime;
    });
  }, [poolAddresses, poolsData, tokenInfoMap, filter]);

  return {
    pools,
    isLoading: isLoadingAddresses || isLoadingPools || isLoadingTokens,
    error: addressError || poolsError,
    refetch,
  };
}
