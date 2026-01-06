'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';

export function CTA() {
  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-border-accent"
        >
          <div className="relative bg-background-tertiary px-8 py-16 md:px-16 text-center">
            {/* Subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
                Ready to Start?
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
                Join the staking ecosystem on QIE Network.
                No minimum stake, no lock period.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/pools">
                  <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore Pools
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button variant="ghost" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
