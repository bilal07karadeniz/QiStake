'use client';

import { motion } from 'framer-motion';
import { Wallet, Gift, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatTokenAmount } from '@/lib/utils';

interface TokenReward {
  tokenAddress: string;
  amount: bigint;
  symbol: string;
  decimals: number;
}

interface PortfolioSummaryProps {
  totalPositions: number;
  rewardsByToken: TokenReward[];
}

export function PortfolioSummary({ totalPositions, rewardsByToken }: PortfolioSummaryProps) {
  const hasRewards = rewardsByToken.some(r => r.amount > 0n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <Card variant="gradient" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Positions */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Active Positions</p>
              <p className="text-2xl font-bold text-white">{totalPositions}</p>
            </div>
          </div>

          {/* Pending Rewards */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-success-text" />
              <p className="text-sm text-text-secondary">Total Pending Rewards</p>
            </div>
            {hasRewards ? (
              <div className="flex flex-wrap gap-3">
                {rewardsByToken.map((reward) => (
                  reward.amount > 0n && (
                    <div
                      key={reward.tokenAddress}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-success rounded-lg border border-success-border"
                    >
                      <span className="text-lg font-bold text-success-text">
                        {formatTokenAmount(reward.amount, reward.decimals)}
                      </span>
                      <span className="text-sm text-success-text/70">{reward.symbol}</span>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <p className="text-text-secondary">No pending rewards</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
