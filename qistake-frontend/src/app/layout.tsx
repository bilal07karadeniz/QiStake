import type { Metadata } from 'next';
import { Web3Provider } from '@/providers/Web3Provider';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'QiStake - Permissionless Staking on QIE Network',
  description: 'Stake tokens, earn rewards, and create permissionless staking pools on QIE Network.',
  keywords: ['staking', 'DeFi', 'QIE', 'blockchain', 'crypto', 'yield', 'rewards'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body bg-background-primary text-text-primary min-h-screen">
        <Web3Provider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#12121C',
                border: '1px solid #27272A',
                color: '#FFFFFF',
                fontFamily: 'var(--font-body)',
              },
              className: 'toast-custom',
            }}
            richColors
            closeButton
          />
        </Web3Provider>
      </body>
    </html>
  );
}
