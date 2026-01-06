'use client';

import { useReadContract, useReadContracts } from 'wagmi';
import { erc20Abi, Address } from 'viem';
import { qieMainnet } from '@/lib/chains';

// Read: Get token name
export function useTokenName(tokenAddress: Address | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'name',
    chainId: qieMainnet.id,
    query: {
      enabled: !!tokenAddress,
    },
  });
}

// Read: Get token symbol
export function useTokenSymbol(tokenAddress: Address | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'symbol',
    chainId: qieMainnet.id,
    query: {
      enabled: !!tokenAddress,
    },
  });
}

// Read: Get token decimals
export function useTokenDecimals(tokenAddress: Address | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
    chainId: qieMainnet.id,
    query: {
      enabled: !!tokenAddress,
    },
  });
}

// Read: Get token balance
export function useTokenBalance(tokenAddress: Address | undefined, accountAddress: Address | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: accountAddress ? [accountAddress] : undefined,
    chainId: qieMainnet.id,
    query: {
      enabled: !!tokenAddress && !!accountAddress,
    },
  });
}

// Read: Get token allowance
export function useTokenAllowance(
  tokenAddress: Address | undefined,
  ownerAddress: Address | undefined,
  spenderAddress: Address | undefined
) {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    chainId: qieMainnet.id,
    query: {
      enabled: !!tokenAddress && !!ownerAddress && !!spenderAddress,
    },
  });
}

// Read: Get all token info at once
export function useTokenInfo(tokenAddress: Address | undefined) {
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'name',
        chainId: qieMainnet.id,
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId: qieMainnet.id,
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
        chainId: qieMainnet.id,
      },
    ],
    query: {
      enabled: !!tokenAddress,
    },
  });

  const name = data?.[0]?.result as string | undefined;
  const symbol = data?.[1]?.result as string | undefined;
  const decimals = data?.[2]?.result as number | undefined;

  return {
    data: tokenAddress && name && symbol && decimals !== undefined
      ? {
          address: tokenAddress,
          name,
          symbol,
          decimals,
        }
      : undefined,
    isLoading,
    error,
  };
}
