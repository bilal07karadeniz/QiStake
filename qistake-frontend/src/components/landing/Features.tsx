'use client';

import { motion } from 'framer-motion';
import { LockOpen, Layers, Clock, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout';
import { Card } from '@/components/ui';

const features = [
  {
    icon: LockOpen,
    title: 'No Lock Period',
    description:
      'Unstake anytime. Your tokens remain liquid with full control over your assets.',
  },
  {
    icon: Layers,
    title: 'Permissionless',
    description:
      'Anyone can create a staking pool. No gatekeepers, no approvals required.',
  },
  {
    icon: Clock,
    title: 'Real-time Rewards',
    description:
      'Rewards accrue every block. Claim your earnings whenever you want.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Contracts',
    description:
      'Built with battle-tested OpenZeppelin libraries. Audited and secure.',
  },
];

export function Features() {
  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Why QiStake
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Designed for simplicity, built for security
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hoverable className="h-full">
                <div className="flex items-start gap-5">
                  <div className="p-3 rounded-lg bg-primary/10 border border-border-accent shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
