'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-background-primary">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        {/* Minimal accent line */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent opacity-40" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 rounded-full border border-border-accent bg-background-tertiary/50"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-sm text-text-secondary">
              Built on QIE Network
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading mb-8 tracking-tight"
          >
            <span className="text-white">Stake Tokens.</span>
            <br />
            <span className="gradient-text">Earn Rewards.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Permissionless staking pools with no lock periods.
            Create pools for your token or stake in existing ones.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/pools">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse Pools
              </Button>
            </Link>
            <Link href="/create-pool">
              <Button variant="secondary" size="lg">
                Create Pool
              </Button>
            </Link>
          </motion.div>

          {/* Key points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { label: 'No Lock', value: 'Flexible' },
              { label: 'Rewards', value: 'Real-time' },
              { label: 'Access', value: 'Open' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xs text-text-tertiary uppercase tracking-wider mb-1">
                  {item.label}
                </div>
                <div className="text-sm font-medium text-text-primary">
                  {item.value}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
