'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { Container } from './Container';
import { TELEGRAM_URL } from '@/lib/constants';

const footerLinks = {
  platform: [
    { href: '/pools', label: 'Pools' },
    { href: '/my-stakes', label: 'My Stakes' },
    { href: '/create-pool', label: 'Create Pool' },
    { href: '/faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/disclaimer', label: 'Disclaimer' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-secondary border-t border-border mt-auto">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/images/logo-full.png"
                  alt="QiStake"
                  width={180}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
              <p className="text-text-secondary text-sm max-w-md mb-6">
                Permissionless staking pools on QIE Network. Stake tokens, earn rewards,
                and create your own staking pools with no lock period.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-background-tertiary rounded-lg text-text-secondary hover:text-white hover:bg-primary-light transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                  <span className="text-sm font-medium">Telegram</span>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                {footerLinks.platform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-tertiary text-sm">
              &copy; {currentYear} QiStake. All rights reserved.
            </p>
            <p className="text-text-tertiary text-sm">
              Built on{' '}
              <a
                href="https://mainnet.qie.digital/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover transition-colors"
              >
                QIE Network
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
