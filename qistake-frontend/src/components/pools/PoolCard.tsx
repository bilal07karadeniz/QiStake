'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, ExternalLink, Globe, Send } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { Pool, getPoolStatus } from '@/types';
import { formatTokenAmount, formatTimeRemaining, calculateAPR, getExplorerAddressUrl } from '@/lib/utils';
import { StakeModal } from './StakeModal';

interface PoolCardProps {
  pool: Pool;
  onRefetch?: () => void;
}

export function PoolCard({ pool, onRefetch }: PoolCardProps) {
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  const status = getPoolStatus(pool.stats.hasStarted, pool.stats.hasEnded, pool.stats.isPaused);
  const hasStakers = pool.stats.totalStaked > 0n;
  const apr = hasStakers ? calculateAPR(pool.stats.totalRewards, pool.stats.totalStaked, 365) : null;

  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active' },
    ended: { variant: 'error' as const, label: 'Ended' },
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
              {/* Token Logo */}
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

          {/* Description */}
          {pool.metadata.description && (
            <p className="text-sm text-text-secondary mb-4 line-clamp-2">
              {pool.metadata.description}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* APR */}
            <div className="bg-gradient-success rounded-lg p-3 border border-success-border">
              <div className="flex items-center gap-1 text-success-text mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">APR</span>
              </div>
              <p className="text-xl font-bold text-success-text">
                {apr !== null ? `${apr.toFixed(2)}%` : 'N/A'}
              </p>
            </div>

            {/* Time Remaining */}
            <div className="bg-background-tertiary rounded-lg p-3">
              <div className="flex items-center gap-1 text-text-secondary mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Time Left</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {formatTimeRemaining(pool.stats.endTime, pool.stats.startTime, pool.stats.hasEnded)}
              </p>
            </div>
          </div>

          {/* Social Links */}
          {(pool.metadata.website || pool.metadata.telegram || pool.metadata.twitter) && (
            <div className="flex items-center gap-2 mb-4">
              {pool.metadata.website && (
                <a
                  href={pool.metadata.website.startsWith('http') ? pool.metadata.website : `https://${pool.metadata.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-background-tertiary hover:bg-background-secondary transition-colors"
                  title="Website"
                >
                  <Globe className="w-4 h-4 text-text-secondary hover:text-primary" />
                </a>
              )}
              {pool.metadata.telegram && (
                <a
                  href={pool.metadata.telegram.startsWith('http') ? pool.metadata.telegram : `https://t.me/${pool.metadata.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-background-tertiary hover:bg-background-secondary transition-colors"
                  title="Telegram"
                >
                  <Send className="w-4 h-4 text-text-secondary hover:text-primary" />
                </a>
              )}
              {pool.metadata.twitter && (
                <a
                  href={pool.metadata.twitter.startsWith('http') ? pool.metadata.twitter : `https://twitter.com/${pool.metadata.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-background-tertiary hover:bg-background-secondary transition-colors"
                  title="Twitter"
                >
                  <svg className="w-4 h-4 text-text-secondary hover:text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Total Staked */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <span className="text-sm text-text-secondary">Total Staked</span>
            <span className="font-semibold text-white">
              {formatTokenAmount(pool.stats.totalStaked, pool.tokenInfo.decimals)}{' '}
              {pool.tokenInfo.symbol}
            </span>
          </div>

          {/* Total Rewards */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <span className="text-sm text-text-secondary">Total Rewards</span>
            <span className="font-semibold text-text-accent">
              {formatTokenAmount(pool.stats.totalRewards, pool.tokenInfo.decimals)}{' '}
              {pool.tokenInfo.symbol}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-auto pt-4">
            {status === 'active' && (
              <Button
                className="flex-1"
                onClick={() => setIsStakeModalOpen(true)}
              >
                Stake
              </Button>
            )}
            {status === 'paused' && (
              <Button
                className="flex-1"
                onClick={() => setIsStakeModalOpen(true)}
              >
                Stake
              </Button>
            )}
            {status === 'ended' && (
              <Button variant="secondary" className="flex-1" disabled>
                Pool Ended
              </Button>
            )}
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

      {/* Stake Modal */}
      <StakeModal
        isOpen={isStakeModalOpen}
        onClose={() => setIsStakeModalOpen(false)}
        pool={pool}
        onSuccess={() => {
          setIsStakeModalOpen(false);
          onRefetch?.();
        }}
      />
    </>
  );
}
