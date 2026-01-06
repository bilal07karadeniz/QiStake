import QiStakeFactoryABI from './abis/QiStakeFactoryABI.json';
import QiStakePoolABI from './abis/QiStakePoolABI.json';
import { erc20Abi } from 'viem';

export const FACTORY_ADDRESS = '0x7F2780a7b422f05387a4950dB77d6A3bdB2Ee22d' as const;

export const contracts = {
  factory: {
    address: FACTORY_ADDRESS,
    abi: QiStakeFactoryABI,
  },
  pool: {
    abi: QiStakePoolABI,
  },
  erc20: {
    abi: erc20Abi,
  },
} as const;

// Re-export ABIs for direct use
export { QiStakeFactoryABI, QiStakePoolABI };
