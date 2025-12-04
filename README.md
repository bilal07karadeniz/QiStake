# QiStake - Decentralized Staking Platform for QIE Network

A full-stack decentralized staking platform built for the QIE Blockchain ecosystem. Create and manage staking pools with Synthetix-style reward distribution.

## Overview

QiStake enables anyone to create staking pools for their ERC-20 tokens on QIE Network. Pool creators can set up 12-month staking campaigns, while users earn rewards proportionally based on their stake.

### Features

- **Pool Creation**: Deploy staking pools for any ERC-20 token
- **Synthetix Rewards**: Gas-efficient O(1) reward distribution algorithm
- **Fee-on-Transfer Support**: Compatible with deflationary tokens
- **Flexible Staking**: Stake, unstake, and claim rewards anytime
- **Auto-Claim**: Rewards automatically claimed on unstake
- **Pool Metadata**: Custom branding with logo, website, and social links

## Tech Stack

### Smart Contracts
- Solidity ^0.8.30
- OpenZeppelin v5 (Ownable, ReentrancyGuard, IERC20)

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- RainbowKit + Wagmi + Viem (Web3 integration)
- Framer Motion (Animations)

## Project Structure

```
QiStake/
├── qistake/                 # Frontend application
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities, ABIs, config
│   └── public/             # Static assets
│
└── qistake-contracts/       # Smart contracts
    ├── QiStakeFactory.sol  # Factory for deploying pools
    ├── QiStakePool.sol     # Individual staking pool
    └── interfaces/         # Contract interfaces
```

## Smart Contracts

| Contract | Description |
|----------|-------------|
| QiStakeFactory | Deploys and registers staking pools, collects creation fees |
| QiStakePool | Individual pool with staking logic and reward distribution |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/bilal07karadeniz/QiStake.git
cd QiStake

# Install frontend dependencies
cd qistake
npm install

# Run development server
npm run dev
```

### Build

```bash
npm run build
```

## Deployment

### Smart Contracts
Deploy to QIE Network using Remix or Hardhat:
1. Deploy `QiStakeFactory` with initial creation fee
2. Factory handles all pool deployments

### Frontend
Deployed on Netlify with Next.js plugin.

## Security

- ReentrancyGuard on all state-changing functions
- Input validation and error handling
- Immutable critical variables
- Fee-on-transfer token support via balance checking

## License

MIT

## Author

**Bilal Karadeniz**

Developed for QIE Blockchain Hackathon - December 2025

---

Built with love for the QIE ecosystem
