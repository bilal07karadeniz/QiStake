'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, RefreshCw } from 'lucide-react';
import { Header, Footer, Container } from '@/components/layout';
import { PortfolioSummary, StakePositionCard } from '@/components/stakes';
import { SkeletonCard, Button, Card } from '@/components/ui';
import { useUserStakes } from '@/hooks/useUserStakes';

export default function MyStakesPage() {
  const { isConnected } = useAccount();
  const { stakePositions, totals, isLoading, refetch } = useUserStakes();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">
                My Stakes
              </h1>
              <p className="text-text-secondary">
                Manage your staking positions and claim rewards
              </p>
            </div>
            {isConnected && (
              <Button
                variant="secondary"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>

          {/* Not Connected State */}
          {!isConnected && (
            <Card className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-background-tertiary flex items-center justify-center">
                <Wallet className="w-10 h-10 text-text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Connect your wallet to view and manage your staking positions across all pools.
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </Card>
          )}

          {/* Connected - Loading State */}
          {isConnected && isLoading && (
            <>
              {/* Summary Skeleton */}
              <div className="mb-8">
                <div className="h-32 bg-background-secondary rounded-2xl animate-pulse" />
              </div>
              {/* Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </>
          )}

          {/* Connected - Has Positions */}
          {isConnected && !isLoading && stakePositions.length > 0 && (
            <>
              {/* Portfolio Summary */}
              <PortfolioSummary
                totalPositions={totals.totalPositions}
                rewardsByToken={totals.rewardsByToken}
              />

              {/* Positions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stakePositions.map((position) => (
                  <StakePositionCard
                    key={position.pool.address}
                    position={position}
                    onRefetch={refetch}
                  />
                ))}
              </div>
            </>
          )}

          {/* Connected - No Positions */}
          {isConnected && !isLoading && stakePositions.length === 0 && (
            <Card className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-tertiary flex items-center justify-center">
                <Wallet className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Staking Positions
              </h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                You don&apos;t have any active staking positions yet. Browse available pools to start earning rewards.
              </p>
              <Link href="/pools">
                <Button>Browse Pools</Button>
              </Link>
            </Card>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
