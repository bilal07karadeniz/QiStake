'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { erc20Abi, Address, maxUint256 } from 'viem';
import { useTokenAllowance } from './useTokenInfo';
import { qieMainnet } from '@/lib/chains';

interface UseTokenApprovalProps {
  tokenAddress: Address | undefined;
  spenderAddress: Address | undefined;
  ownerAddress: Address | undefined;
  amount: bigint;
}

export function useTokenApproval({
  tokenAddress,
  spenderAddress,
  ownerAddress,
  amount,
}: UseTokenApprovalProps) {
  // Get current allowance
  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance(
    tokenAddress,
    ownerAddress,
    spenderAddress
  );

  // Write contract for approval
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Check if approved
  const isApproved = allowance !== undefined && allowance >= amount;

  // Approve function
  const approve = (approveMax: boolean = true) => {
    if (!tokenAddress || !spenderAddress) return;

    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spenderAddress, approveMax ? maxUint256 : amount],
      chainId: qieMainnet.id,
    });
  };

  return {
    allowance,
    isApproved,
    approve,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
    refetchAllowance,
    hash,
  };
}
