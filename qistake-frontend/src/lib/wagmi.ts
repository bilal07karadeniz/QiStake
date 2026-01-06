import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { qieMainnet } from './chains';

export const config = getDefaultConfig({
  appName: 'QiStake',
  projectId: '1ca80836d685e94c9cd2ab173c9f8ad2',
  chains: [qieMainnet],
  ssr: true,
});
