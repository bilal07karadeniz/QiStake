'use client';

import { Pool } from '@/types';
import { PoolCard } from './PoolCard';
import { SkeletonCard } from '@/components/ui';

interface PoolGridProps {
  pools: Pool[];
  isLoading: boolean;
  onRefetch?: () => void;
}

export function PoolGrid({ pools, isLoading, onRefetch }: PoolGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (pools.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-tertiary flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No pools found</h3>
        <p className="text-text-secondary">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pools.map((pool) => (
        <PoolCard key={pool.address} pool={pool} onRefetch={onRefetch} />
      ))}
    </div>
  );
}
