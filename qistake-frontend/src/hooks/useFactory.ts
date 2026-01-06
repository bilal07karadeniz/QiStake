'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { contracts, FACTORY_ADDRESS } from '@/lib/contracts';
import { qieMainnet } from '@/lib/chains';

// Read: Get creation fee
export function useCreationFee() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: contracts.factory.abi,
    functionName: 'creationFee',
    chainId: qieMainnet.id,
  });
}

// Read: Get total pools count
export function useTotalPools() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: contracts.factory.abi,
    functionName: 'totalPools',
    chainId: qieMainnet.id,
  });
}

// Read: Get paginated pool addresses
export function useGetPools(offset: number, limit: number) {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: contracts.factory.abi,
    functionName: 'getPools',
    args: [BigInt(offset), BigInt(limit)],
    chainId: qieMainnet.id,
  });
}

// Read: Get all pool addresses
export function useGetAllPools() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: contracts.factory.abi,
    functionName: 'getAllPools',
    chainId: qieMainnet.id,
  });
}

// Read: Check if address is a valid pool
export function useIsPool(address: `0x${string}` | undefined) {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: contracts.factory.abi,
    functionName: 'isPool',
    args: address ? [address] : undefined,
    chainId: qieMainnet.id,
    query: {
      enabled: !!address,
    },
  });
}

// Write: Create a new pool
export function useCreatePool() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createPool = async ({
    stakingToken,
    rewardAmount,
    website,
    telegram,
    twitter,
    description,
    logoUrl,
    creationFee,
  }: {
    stakingToken: `0x${string}`;
    rewardAmount: bigint;
    website: string;
    telegram: string;
    twitter: string;
    description: string;
    logoUrl: string;
    creationFee: bigint;
  }) => {
    writeContract({
      address: FACTORY_ADDRESS,
      abi: contracts.factory.abi,
      functionName: 'createPool',
      args: [stakingToken, rewardAmount, website, telegram, twitter, description, logoUrl],
      value: creationFee,
      chainId: qieMainnet.id,
    });
  };

  return {
    createPool,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
