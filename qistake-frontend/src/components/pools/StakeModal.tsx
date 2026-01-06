'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { Modal, ModalFooter, Button, TokenAmountInput, Badge } from '@/components/ui';
import { Pool } from '@/types';
import { useTokenBalance } from '@/hooks/useTokenInfo';
import { useTokenApproval } from '@/hooks/useTokenApproval';
import { useStake } from '@/hooks/usePool';
import { formatTokenAmountInput, parseTokenAmount, getExplorerTxUrl } from '@/lib/utils';

interface StakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool;
  onSuccess?: () => void;
}

export function StakeModal({ isOpen, onClose, pool, onSuccess }: StakeModalProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Get user's token balance
  const { data: balance, refetch: refetchBalance } = useTokenBalance(
    pool.stakingToken,
    address
  );

  // Parse amount to bigint
  const parsedAmount = parseTokenAmount(amount, pool.tokenInfo.decimals);

  // Token approval
  const {
    isApproved,
    approve,
    isPending: isApproving,
    isConfirming: isApprovingConfirming,
    isSuccess: approvalSuccess,
    refetchAllowance,
    hash: approvalHash,
  } = useTokenApproval({
    tokenAddress: pool.stakingToken,
    spenderAddress: pool.address,
    ownerAddress: address,
    amount: parsedAmount,
  });

  // Stake hook
  const {
    stake,
    isPending: isStaking,
    isConfirming: isStakingConfirming,
    isSuccess: stakeSuccess,
    error: stakeError,
    hash: stakeHash,
    reset: resetStake,
  } = useStake(pool.address);

  // Handle approval success
  useEffect(() => {
    if (approvalSuccess) {
      toast.success('Approval successful!', {
        description: 'You can now stake your tokens.',
      });
      refetchAllowance();
    }
  }, [approvalSuccess, refetchAllowance]);

  // Handle stake success
  useEffect(() => {
    if (stakeSuccess && stakeHash) {
      toast.success('Stake successful!', {
        description: `Successfully staked ${amount} ${pool.tokenInfo.symbol}`,
        action: {
          label: 'View',
          onClick: () => window.open(getExplorerTxUrl(stakeHash), '_blank'),
        },
      });
      setAmount('');
      refetchBalance();
      onSuccess?.();
    }
  }, [stakeSuccess, stakeHash, amount, pool.tokenInfo.symbol, refetchBalance, onSuccess]);

  // Handle stake error
  useEffect(() => {
    if (stakeError) {
      const message = stakeError.message.includes('User rejected')
        ? 'Transaction rejected'
        : 'Stake failed. Please try again.';
      toast.error(message);
      resetStake();
    }
  }, [stakeError, resetStake]);

  // Validation
  useEffect(() => {
    setError('');
    if (!amount || parsedAmount === 0n) return;

    if (balance !== undefined && parsedAmount > balance) {
      setError('Insufficient balance');
    }
  }, [amount, parsedAmount, balance]);

  const handleMax = () => {
    if (balance) {
      setAmount(formatTokenAmountInput(balance, pool.tokenInfo.decimals));
    }
  };

  const handleApprove = () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }
    approve();
  };

  const handleStake = () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }
    if (parsedAmount === 0n) {
      setError('Enter an amount');
      return;
    }
    if (error) return;

    stake(parsedAmount);
  };

  const isLoading = isApproving || isApprovingConfirming || isStaking || isStakingConfirming;
  const canStake = parsedAmount > 0n && !error && isApproved;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Stake ${pool.tokenInfo.symbol}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Pool Info */}
        <div className="flex items-center justify-between p-4 bg-background-tertiary rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {pool.tokenInfo.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-medium text-white">{pool.tokenInfo.name}</p>
              <p className="text-sm text-text-secondary">{pool.tokenInfo.symbol}</p>
            </div>
          </div>
          <Badge variant="success">Active</Badge>
        </div>

        {/* Amount Input */}
        <TokenAmountInput
          label="Amount to Stake"
          value={amount}
          onChange={setAmount}
          balance={balance}
          decimals={pool.tokenInfo.decimals}
          symbol={pool.tokenInfo.symbol}
          onMax={handleMax}
          error={error}
          disabled={isLoading}
        />

        {/* Info Text */}
        <div className="p-4 bg-primary-light rounded-xl border border-border-accent">
          <p className="text-sm text-text-secondary">
            Staking your tokens will earn you rewards over time. You can unstake
            at any time, which will automatically claim your pending rewards.
          </p>
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        {!isApproved && parsedAmount > 0n ? (
          <Button
            onClick={handleApprove}
            isLoading={isApproving || isApprovingConfirming}
          >
            {isApproving ? 'Confirming...' : isApprovingConfirming ? 'Approving...' : 'Approve'}
          </Button>
        ) : (
          <Button
            onClick={handleStake}
            disabled={!canStake}
            isLoading={isStaking || isStakingConfirming}
          >
            {isStaking ? 'Confirming...' : isStakingConfirming ? 'Staking...' : 'Stake'}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
