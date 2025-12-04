# QiStake - Staking DApp Smart Contracts

## 📋 Overview
Complete smart contract ecosystem for QiStake on QIE Network (EVM Compatible).

### Contracts
- **QiStakeFactory.sol** - Factory for deploying staking pools
- **QiStakePool.sol** - Individual staking pools with Synthetix-style rewards

### Interfaces
- **IQiStakeFactory.sol** - Factory interface
- **IQiStakePool.sol** - Pool interface

## 🔑 Key Features

### QiStakeFactory
- ✅ Pool deployment with native coin (QIE) creation fee
- ✅ Updatable creation fee (owner only)
- ✅ Pool registry and stats tracking
- ✅ Pagination for large pool lists
- ✅ Fee withdrawal mechanism

### QiStakePool
- ✅ Synthetix-style reward distribution (O(1) gas efficiency)
- ✅ Fee-on-transfer token support
- ✅ Fixed 12-month duration
- ✅ Flexible staking (stake/unstake/claim anytime)
- ✅ Auto-claim on unstake
- ✅ Metadata storage (website, social links, description, logo)
- ✅ ReentrancyGuard on all state-changing functions

## 🛡️ Security Features
- OpenZeppelin v5 libraries (Ownable, ReentrancyGuard, IERC20)
- NonReentrant modifiers on all critical functions
- Fee-on-transfer token support via balance checking
- Input validation and error handling
- Immutable critical variables

## 📦 Deployment Instructions

### Prerequisites
```bash
npm install @openzeppelin/contracts@^5.0.0
```

### Deploy Factory
1. Deploy `QiStakeFactory.sol` with initial creation fee
2. Example: `new QiStakeFactory(0.1 ether)` for 0.1 QIE fee

### Create Pool
1. Call `createPool()` on factory with creation fee
2. Creator must then call `depositRewards()` to fund the pool
3. Users can now stake tokens

## 🔄 Usage Flow

### For Pool Creators
1. Pay creation fee to factory
2. Provide token address, reward amount, and metadata
3. Approve factory for reward tokens
4. Call `depositRewards()` on created pool
5. Pool is now active for 12 months

### For Stakers
1. Approve pool contract for staking tokens
2. Call `stake(amount)` to deposit tokens
3. Earn rewards proportionally over time
4. Call `claimRewards()` to collect rewards anytime
5. Call `unstake(amount)` to withdraw (auto-claims rewards)

## 📊 View Functions

### Factory
- `totalPools()` - Get total pool count
- `getPools(offset, limit)` - Paginated pool list
- `getAllPools()` - All pools (use carefully)
- `isPool(address)` - Verify pool address

### Pool
- `earned(address)` - Calculate pending rewards
- `getUserInfo(address)` - Get user's staking info
- `getPoolStats()` - Get pool statistics
- `getMetadata()` - Get project metadata
- `rewardPerToken()` - Current reward rate

## ⚙️ Technical Details

### Reward Calculation
Uses Synthetix staking rewards pattern:
```
rewardPerToken = rewardPerTokenStored + (rewardRate * timeElapsed * 1e18 / totalStaked)
userReward = (userStake * (rewardPerToken - userRewardPerTokenPaid) / 1e18) + savedRewards
```

### Fee-on-Transfer Support
All token transfers measure actual received amount:
```solidity
uint256 balanceBefore = token.balanceOf(address(this));
token.transferFrom(sender, address(this), amount);
uint256 balanceAfter = token.balanceOf(address(this));
uint256 actualAmount = balanceAfter - balanceBefore;
```

## ⚠️ Important Notes

1. **Reward Deposit**: Pool creator MUST call `depositRewards()` after pool creation
2. **Duration**: Pools run for exactly 12 months (365 days)
3. **Metadata**: Description limited to 150 characters
4. **Gas Optimization**: Use `getPools()` with pagination for large datasets
5. **Security**: All state-changing functions protected by ReentrancyGuard

## 📝 License
MIT

## 👨‍💻 Author
bilal07karadeniz
