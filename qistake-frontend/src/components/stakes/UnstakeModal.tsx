'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { Modal, ModalFooter, Button, TokenAmountInput } from '@/components/ui';
import { StakePosition } from '@/types';
import { useUnstake } from '@/hooks/usePool';
import { formatTokenAmount, formatTokenAmountInput, parseTokenAmount, getExplorerTxUrl } from '@/lib/utils';

interface UnstakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: StakePosition;
  onSuccess?: () => void;
}

export function UnstakeModal({ isOpen, onClose, position, onSuccess }: UnstakeModalProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const { pool, userInfo } = position;

  // Parse amount to bigint
  const parsedAmount = parseTokenAmount(amount, pool.tokenInfo.decimals);

  // Unstake hook
  const {
    unstake,
    isPending: isUnstaking,
    isConfirming: isUnstakeConfirming,
    isSuccess: unstakeSuccess,
    error: unstakeError,
    hash: unstakeHash,
    reset: resetUnstake,
  } = useUnstake(pool.address);

  // Handle unstake success
  useEffect(() => {
    if (unstakeSuccess && unstakeHash) {
      toast.success('Unstake successful!', {
        description: `Successfully unstaked ${amount} ${pool.tokenInfo.symbol}. Rewards have been claimed.`,
        action: {
          label: 'View',
          onClick: () => window.open(getExplorerTxUrl(unstakeHash), '_blank'),
        },
      });
      setAmount('');
      onSuccess?.();
    }
  }, [unstakeSuccess, unstakeHash, amount, pool.tokenInfo.symbol, onSuccess]);

  // Handle unstake error
  useEffect(() => {
    if (unstakeError) {
      const message = unstakeError.message.includes('User rejected')
        ? 'Transaction rejected'
        : 'Unstake failed. Please try again.';
      toast.error(message);
      resetUnstake();
    }
  }, [unstakeError, resetUnstake]);

  // Validation
  useEffect(() => {
    setError('');
    if (!amount || parsedAmount === 0n) return;

    if (parsedAmount > userInfo.stakedBalance) {
      setError('Amount exceeds staked balance');
    }
  }, [amount, parsedAmount, userInfo.stakedBalance]);

  const handleMax = () => {
    setAmount(formatTokenAmountInput(userInfo.stakedBalance, pool.tokenInfo.decimals));
  };

  const handleUnstake = () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }
    if (parsedAmount === 0n) {
      setError('Enter an amount');
      return;
    }
    if (error) return;

    unstake(parsedAmount);
  };

  const isLoading = isUnstaking || isUnstakeConfirming;
  const canUnstake = parsedAmount > 0n && !error;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Unstake ${pool.tokenInfo.symbol}`}
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
          <div className="text-right">
            <p className="text-sm text-text-secondary">Your Stake</p>
            <p className="font-semibold text-white">
              {formatTokenAmount(userInfo.stakedBalance, pool.tokenInfo.decimals)} {pool.tokenInfo.symbol}
            </p>
          </div>
        </div>

        {/* Amount Input */}
        <TokenAmountInput
          label="Amount to Unstake"
          value={amount}
          onChange={setAmount}
          balance={userInfo.stakedBalance}
          decimals={pool.tokenInfo.decimals}
          symbol={pool.tokenInfo.symbol}
          onMax={handleMax}
          error={error}
          disabled={isLoading}
        />

        {/* Auto-claim Notice */}
        <div className="flex items-start gap-3 p-4 bg-warning-light rounded-xl border border-warning-border">
          <AlertTriangle className="w-5 h-5 text-warning-text flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning-text mb-1">
              Auto-claim on Unstake
            </p>
            <p className="text-sm text-text-secondary">
              Unstaking will automatically claim your pending rewards of{' '}
              <span className="text-white font-medium">
                {formatTokenAmount(userInfo.pendingRewards, pool.tokenInfo.decimals)} {pool.tokenInfo.symbol}
              </span>
            </p>
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleUnstake}
          disabled={!canUnstake}
          isLoading={isLoading}
        >
          {isUnstaking ? 'Confirming...' : isUnstakeConfirming ? 'Unstaking...' : 'Unstake'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
