'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout';

const steps = [
  {
    step: '01',
    title: 'Connect',
    description: 'Link your wallet to QIE Network',
  },
  {
    step: '02',
    title: 'Select',
    description: 'Choose a pool or create your own',
  },
  {
    step: '03',
    title: 'Stake',
    description: 'Deposit tokens to start earning',
  },
  {
    step: '04',
    title: 'Earn',
    description: 'Collect rewards in real-time',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-background-secondary">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Start earning in four simple steps
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-border-accent" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative"
              >
                {/* Step number */}
                <div className="relative inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-background-tertiary border border-border-accent">
                  <span className="text-sm font-semibold text-primary">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
