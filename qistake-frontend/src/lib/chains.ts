import { defineChain } from 'viem';

export const qieMainnet = defineChain({
  id: 1990,
  name: 'QIE Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'QIEV3',
    symbol: 'QIEV3',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc1mainnet.qie.digital/'],
    },
    public: {
      http: [
        'https://rpc1mainnet.qie.digital/',
        'https://rpc2mainnet.qie.digital/',
        'https://rpc5mainnet.qie.digital/',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'QIE Mainnet Explorer',
      url: 'https://mainnet.qie.digital',
    },
  },
});
