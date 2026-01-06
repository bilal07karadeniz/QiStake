'use client';

import { useState, useMemo } from 'react';
import { Header, Footer, Container } from '@/components/layout';
import { PoolGrid, PoolFilters } from '@/components/pools';
import { usePools } from '@/hooks/usePools';
import { PoolFilter } from '@/types';

export default function PoolsPage() {
  const [filter, setFilter] = useState<PoolFilter>('active');
  const [search, setSearch] = useState('');

  const { pools, isLoading, refetch } = usePools(filter);

  // Filter pools by search
  const filteredPools = useMemo(() => {
    if (!search.trim()) return pools;

    const searchLower = search.toLowerCase();
    return pools.filter(
      (pool) =>
        pool.tokenInfo.name.toLowerCase().includes(searchLower) ||
        pool.tokenInfo.symbol.toLowerCase().includes(searchLower) ||
        pool.address.toLowerCase().includes(searchLower) ||
        pool.stakingToken.toLowerCase().includes(searchLower)
    );
  }, [pools, search]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">
              Staking Pools
            </h1>
            <p className="text-text-secondary">
              Browse and stake in available pools to earn rewards
            </p>
          </div>

          {/* Filters */}
          <PoolFilters
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
          />

          {/* Pool Grid */}
          <PoolGrid
            pools={filteredPools}
            isLoading={isLoading}
            onRefetch={refetch}
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
