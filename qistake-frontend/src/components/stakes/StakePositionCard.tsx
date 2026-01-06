'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Gift, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Badge, Button } from '@/components/ui';
import { StakePosition, getPoolStatus } from '@/types';
import { useClaimRewards } from '@/hooks/usePool';
import { formatTokenAmount, formatTimeRemaining, calculateAPR, getExplorerAddressUrl, getExplorerTxUrl } from '@/lib/utils';
import { UnstakeModal } from './UnstakeModal';

interface StakePositionCardProps {
  position: StakePosition;
  onRefetch?: () => void;
}

export function StakePositionCard({ position, onRefetch }: StakePositionCardProps) {
  const [isUnstakeModalOpen, setIsUnstakeModalOpen] = useState(false);
  const { pool, userInfo } = position;

  const status = getPoolStatus(pool.stats.hasStarted, pool.stats.hasEnded, pool.stats.isPaused);
  const hasStakers = pool.stats.totalStaked > 0n;
  const apr = hasStakers ? calculateAPR(pool.stats.totalRewards, pool.stats.totalStaked, 365) : null;

  // Claim rewards hook
  const {
    claimRewards,
    isPending: isClaiming,
    isConfirming: isClaimConfirming,
    isSuccess: claimSuccess,
    error: claimError,
    hash: claimHash,
    reset: resetClaim,
  } = useClaimRewards(pool.address);

  // Handle claim success
  useEffect(() => {
    if (claimSuccess && claimHash) {
      toast.success('Rewards claimed!', {
        description: `Successfully claimed ${formatTokenAmount(userInfo.pendingRewards, pool.tokenInfo.decimals)} ${pool.tokenInfo.symbol}`,
        action: {
          label: 'View',
          onClick: () => window.open(getExplorerTxUrl(claimHash), '_blank'),
        },
      });
      onRefetch?.();
    }
  }, [claimSuccess, claimHash, userInfo.pendingRewards, pool.tokenInfo, onRefetch]);

  // Handle claim error
  useEffect(() => {
    if (claimError) {
      const message = claimError.message.includes('User rejected')
        ? 'Transaction rejected'
        : 'Claim failed. Please try again.';
      toast.error(message);
      resetClaim();
    }
  }, [claimError, resetClaim]);

  const handleClaim = () => {
    if (userInfo.pendingRewards === 0n) {
      toast.info('No rewards to claim');
      return;
    }
    claimRewards();
  };

  const isClaimLoading = isClaiming || isClaimConfirming;
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active' },
    ended: { variant: 'error' as const, label: 'Ended' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    paused: { variant: 'warning' as const, label: 'Paused' },
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card hoverable className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                {pool.metadata.logoUrl ? (
                  <img
                    src={pool.metadata.logoUrl}
                    alt={pool.tokenInfo.symbol}
                    className="w-10 h-10 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {pool.tokenInfo.symbol.slice(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {pool.tokenInfo.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  {pool.tokenInfo.symbol}
                </p>
              </div>
            </div>
            <Badge variant={statusConfig[status].variant}>
              {statusConfig[status].label}
            </Badge>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Your Stake */}
            <div className="bg-background-tertiary rounded-lg p-3">
              <div className="flex items-center gap-1 text-text-secondary mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Your Stake</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {formatTokenAmount(userInfo.stakedBalance, pool.tokenInfo.decimals)}
              </p>
              <p className="text-xs text-text-secondary">{pool.tokenInfo.symbol}</p>
            </div>

            {/* Pending Rewards */}
            <div className="bg-gradient-success rounded-lg p-3 border border-success-border">
              <div className="flex items-center gap-1 text-success-text mb-1">
                <Gift className="w-4 h-4" />
                <span className="text-xs font-medium">Rewards</span>
              </div>
              <p className="text-lg font-semibold text-success-text">
                {formatTokenAmount(userInfo.pendingRewards, pool.tokenInfo.decimals)}
              </p>
              <p className="text-xs text-success-text/70">{pool.tokenInfo.symbol}</p>
            </div>
          </div>

          {/* Pool Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between py-2 border-t border-border">
              <span className="text-sm text-text-secondary">APR</span>
              <span className="font-semibold text-text-accent">
                {apr !== null ? `${apr.toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-border">
              <span className="text-sm text-text-secondary flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Time Left
              </span>
              <span className="font-medium text-white">
                {formatTimeRemaining(pool.stats.endTime, pool.stats.startTime, pool.stats.hasEnded)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-auto pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleClaim}
              isLoading={isClaimLoading}
              disabled={userInfo.pendingRewards === 0n}
            >
              {isClaiming ? 'Confirming...' : isClaimConfirming ? 'Claiming...' : 'Claim'}
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setIsUnstakeModalOpen(true)}
            >
              Unstake
            </Button>
            <a
              href={getExplorerAddressUrl(pool.address)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </Card>
      </motion.div>

      {/* Unstake Modal */}
      <UnstakeModal
        isOpen={isUnstakeModalOpen}
        onClose={() => setIsUnstakeModalOpen(false)}
        position={position}
        onSuccess={() => {
          setIsUnstakeModalOpen(false);
          onRefetch?.();
        }}
      />
    </>
  );
}
