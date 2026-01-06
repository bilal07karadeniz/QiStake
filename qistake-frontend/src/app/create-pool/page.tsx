'use client';

import { Header, Footer, Container } from '@/components/layout';
import { CreatePoolForm } from '@/components/create-pool';

export default function CreatePoolPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">
              Create Staking Pool
            </h1>
            <p className="text-text-secondary max-w-xl mx-auto">
              Launch your own permissionless staking pool. Users can stake your token and earn rewards over 12 months.
            </p>
          </div>

          {/* Create Pool Form */}
          <div className="max-w-2xl mx-auto">
            <CreatePoolForm />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
