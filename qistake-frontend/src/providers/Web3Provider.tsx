'use client';

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Custom RainbowKit theme matching our design system
const customTheme = darkTheme({
  accentColor: '#8B5CF6',
  accentColorForeground: '#FFFFFF',
  borderRadius: 'large',
  fontStack: 'system',
  overlayBlur: 'small',
});

// Extend the theme with additional customizations
const theme = {
  ...customTheme,
  colors: {
    ...customTheme.colors,
    modalBackground: '#12121C',
    modalBorder: '#27272A',
    profileForeground: '#12121C',
    actionButtonBorder: 'rgba(139, 92, 246, 0.4)',
    actionButtonBorderMobile: 'rgba(139, 92, 246, 0.4)',
  },
  shadows: {
    ...customTheme.shadows,
    dialog: '0 24px 48px rgba(0, 0, 0, 0.5)',
  },
};

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
