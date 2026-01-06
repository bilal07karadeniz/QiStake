'use client';

import { motion } from 'framer-motion';
import { Layers, Users, Award } from 'lucide-react';
import { Container } from '@/components/layout';
import { Card } from '@/components/ui';
import { useTotalPools } from '@/hooks/useFactory';
import { usePools } from '@/hooks/usePools';

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-4xl md:text-5xl font-bold font-heading gradient-text"
    >
      {value.toLocaleString()}
    </motion.span>
  );
}

export function Stats() {
  const { data: totalPoolsData } = useTotalPools();
  const { pools } = usePools('all');

  // Calculate active pools (started, not ended, not paused)
  const activePools = pools.filter(p => p.stats.hasStarted && !p.stats.hasEnded && !p.stats.isPaused).length;
  const totalPools = totalPoolsData ? Number(totalPoolsData) : 0;

  const stats = [
    {
      icon: Layers,
      value: totalPools,
      label: 'Total Pools',
      description: 'Staking pools created',
    },
    {
      icon: Award,
      value: activePools,
      label: 'Active Pools',
      description: 'Currently distributing rewards',
    },
    {
      icon: Users,
      value: pools.length,
      label: 'Pool Types',
      description: 'Different tokens available',
    },
  ];

  return (
    <section className="py-20 bg-background-secondary">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Platform Statistics
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Join the growing community of stakers on QIE Network
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="gradient" hoverable className="text-center h-full">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl bg-primary-light">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <AnimatedNumber value={stat.value} />
                <h3 className="text-lg font-semibold text-white mt-2">
                  {stat.label}
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                  {stat.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
