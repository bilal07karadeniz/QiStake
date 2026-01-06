'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Header, Footer, Container } from '@/components/layout';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'What is QiStake?',
    answer: 'QiStake is a decentralized staking platform built on QIE Chain that allows token creators to launch permissionless staking pools and users to stake tokens to earn rewards. It uses a gas-efficient Synthetix-style reward distribution mechanism.',
  },
  {
    question: 'How do I stake tokens?',
    answer: 'To stake tokens: 1) Connect your wallet, 2) Browse available pools on the Pools page, 3) Click "Stake" on the pool you want to join, 4) Approve the token spending if required, 5) Enter the amount and confirm the transaction. Your tokens will immediately start earning rewards.',
  },
  {
    question: 'Can I unstake at any time?',
    answer: 'Yes! QiStake pools have no lock-up period. You can unstake your tokens at any time. When you unstake, your pending rewards are automatically claimed and sent to your wallet along with your staked tokens.',
  },
  {
    question: 'How are rewards calculated?',
    answer: 'Rewards are distributed linearly over the 12-month pool duration. Your share of rewards is proportional to your stake relative to the total pool stake. The platform uses a Synthetix-style O(1) gas-efficient distribution mechanism.',
  },
  {
    question: 'How do I claim rewards?',
    answer: 'You have two options: 1) Click "Claim" on your stake position to claim rewards while keeping your tokens staked, or 2) Use "Unstake" which will automatically claim your rewards along with returning your staked tokens.',
  },
  {
    question: 'What tokens can I stake?',
    answer: 'You can stake any ERC-20 token that has a pool created for it. Each pool uses the same token for both staking and rewards. Browse the Pools page to see all available staking pools.',
  },
  {
    question: 'How do I create a staking pool?',
    answer: 'To create a pool: 1) Go to the "Create Pool" page, 2) Enter your token\'s contract address, 3) Specify the total reward amount, 4) Add pool metadata (description, links, logo), 5) Pay the creation fee and confirm, 6) Approve and deposit the reward tokens to activate the pool.',
  },
  {
    question: 'What is the pool creation fee?',
    answer: 'Creating a pool requires a small fee paid in QIE (the native token of QIE Chain). This fee helps prevent spam and supports the platform. The current fee is displayed on the Create Pool page.',
  },
  {
    question: 'How long do pools last?',
    answer: 'All pools have a fixed duration of 12 months (365 days). Rewards are distributed linearly throughout this period. After the pool ends, users can still unstake their tokens and claim any remaining rewards.',
  },
  {
    question: 'Is QiStake safe to use?',
    answer: 'QiStake smart contracts are designed with security in mind. However, all DeFi protocols carry inherent risks. We recommend only staking amounts you can afford to lose and always doing your own research (DYOR) before using any staking pool.',
  },
  {
    question: 'What wallets are supported?',
    answer: 'QiStake supports any wallet compatible with WalletConnect, including MetaMask, Trust Wallet, Rainbow, Coinbase Wallet, and many others. Simply click "Connect Wallet" to see all available options.',
  },
  {
    question: 'Does QiStake verify tokens?',
    answer: 'No. QiStake is a permissionless platform that allows anyone to create pools for any ERC-20 token. We do not verify, endorse, or audit any tokens or pools. Always conduct your own research before interacting with any token.',
  },
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="font-medium text-white pr-4">{item.question}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-text-secondary transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-text-secondary">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-text-secondary">
                Find answers to common questions about QiStake
              </p>
            </div>

            {/* FAQ Accordion */}
            <Card className="p-6 md:p-8">
              {faqItems.map((item, index) => (
                <FAQAccordion
                  key={index}
                  item={item}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </Card>

            {/* Contact Section */}
            <div className="text-center mt-8">
              <p className="text-text-secondary mb-4">
                Still have questions? We&apos;re here to help!
              </p>
              <a
                href="https://t.me/QiStake"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors"
              >
                Contact Us on Telegram
              </a>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
