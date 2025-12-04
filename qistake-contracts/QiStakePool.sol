// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title QiStake Pool
 * @author bilal07karadeniz
 * @notice Individual staking pool with Synthetix-style reward distribution
 * @dev Supports fee-on-transfer tokens and provides O(1) gas efficiency for reward calculations
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract QiStakePool is ReentrancyGuard {
    /// @notice The token being staked
    IERC20 public immutable stakingToken;

    /// @notice Factory that deployed this pool
    address public immutable factory;

    /// @notice Creator and owner of the pool
    address public immutable creator;

    /// @notice Timestamp when pool was created
    uint256 public immutable createdAt;

    /// @notice Duration of the pool in seconds (365 days)
    uint256 public constant DURATION = 365 days;

    /// @notice Pool start timestamp (set when first stake happens)
    uint256 public startTime;

    /// @notice Pool end timestamp (startTime + DURATION)
    uint256 public endTime;

    /// @notice Total tokens staked in the pool
    uint256 public totalStaked;

    /// @notice Reward per token stored
    uint256 public rewardPerTokenStored;

    /// @notice Last time rewards were updated
    uint256 public lastUpdateTime;

    /// @notice Actual reward amount received (after fee-on-transfer)
    uint256 public actualRewardAmount;

    /// @notice Whether rewards have been initialized by factory
    bool public rewardsDeposited;

    /// @notice Whether the pool has started (first stake occurred)
    bool public poolStarted;

    /// @notice Timestamp when pool became empty (for pause tracking)
    uint256 public pauseStartTime;

    /// @notice Total time the pool was paused (no stakers)
    uint256 public totalPausedTime;

    /// @notice Grace period after pool ends for users to claim (set by factory)
    uint256 public immutable gracePeriod;

    /// @notice Whether remaining rewards have been withdrawn by creator
    bool public remainingRewardsWithdrawn;

    /// @notice Project metadata
    struct PoolMetadata {
        string website;
        string telegram;
        string twitter;
        string description;
        string logoUrl;
    }
    
    PoolMetadata public metadata;

    /// @notice User staking information
    struct UserInfo {
        uint256 stakedBalance;
        uint256 rewardPerTokenPaid;
        uint256 rewards;
    }
    
    /// @notice Mapping of user address to their staking info
    mapping(address => UserInfo) public userInfo;

    /// @notice Emitted when rewards are deposited
    event RewardsDeposited(uint256 amount, uint256 actualAmount);
    
    /// @notice Emitted when a user stakes tokens
    event Staked(address indexed user, uint256 amount, uint256 actualAmount);
    
    /// @notice Emitted when a user unstakes tokens
    event Unstaked(address indexed user, uint256 amount);
    
    /// @notice Emitted when rewards are claimed
    event RewardsClaimed(address indexed user, uint256 amount);

    /// @notice Emitted when pool starts (first stake)
    event PoolStarted(uint256 startTime, uint256 endTime);

    /// @notice Emitted when pool resumes from pause
    event PoolResumed(uint256 pausedDuration, uint256 newEndTime);

    /// @notice Emitted when pool becomes empty (paused)
    event PoolPaused(uint256 pauseTime);

    /// @notice Emitted when creator withdraws remaining rewards
    event RemainingRewardsWithdrawn(address indexed creator, uint256 amount);

    /**
     * @notice Initializes the staking pool
     * @param _factory Address of the factory that deployed this pool
     * @param _creator Address of the pool creator
     * @param _stakingToken Address of the token to be staked
     * @param _gracePeriod Grace period in seconds (set by factory)
     * @param _website Project website
     * @param _telegram Telegram link
     * @param _twitter Twitter handle
     * @param _description Project description
     * @param _logoUrl Logo URL
     */
    constructor(
        address _factory,
        address _creator,
        address _stakingToken,
        uint256 _gracePeriod,
        string memory _website,
        string memory _telegram,
        string memory _twitter,
        string memory _description,
        string memory _logoUrl
    ) {
        require(_factory != address(0), "Invalid factory");
        require(_creator != address(0), "Invalid creator");
        require(_stakingToken != address(0), "Invalid token");

        factory = _factory;
        creator = _creator;
        stakingToken = IERC20(_stakingToken);
        gracePeriod = _gracePeriod;
        createdAt = block.timestamp;

        // Note: startTime, endTime, lastUpdateTime are set when first stake occurs

        metadata = PoolMetadata({
            website: _website,
            telegram: _telegram,
            twitter: _twitter,
            description: _description,
            logoUrl: _logoUrl
        });
    }

    /**
     * @notice Initializes rewards after factory transfers tokens
     * @dev Only callable by factory. Measures actual token balance to support fee-on-transfer tokens.
     */
    function initializeRewards() external {
        require(msg.sender == factory, "Only factory can initialize");
        require(!rewardsDeposited, "Already initialized");

        actualRewardAmount = stakingToken.balanceOf(address(this));
        require(actualRewardAmount > 0, "No rewards received");

        rewardsDeposited = true;

        emit RewardsDeposited(actualRewardAmount, actualRewardAmount);
    }

    /**
     * @notice Stakes tokens in the pool
     * @dev Supports fee-on-transfer tokens by measuring actual received amount
     * @dev Pool starts on first stake, pauses when empty, resumes on new stake
     * @param _amount Amount of tokens to stake
     */
    function stake(uint256 _amount) external nonReentrant {
        require(rewardsDeposited, "Rewards not deposited yet");
        require(_amount > 0, "Cannot stake 0");

        // Handle pool start and pause resumption BEFORE updating rewards
        if (!poolStarted) {
            // First stake ever - start the pool
            poolStarted = true;
            startTime = block.timestamp;
            endTime = block.timestamp + DURATION;
            lastUpdateTime = block.timestamp;
            emit PoolStarted(startTime, endTime);
        } else if (totalStaked == 0 && pauseStartTime > 0) {
            // Resuming from pause - extend endTime by paused duration
            uint256 pausedDuration = block.timestamp - pauseStartTime;
            totalPausedTime += pausedDuration;
            endTime += pausedDuration;
            lastUpdateTime = block.timestamp; // Skip the paused period for rewards
            pauseStartTime = 0;
            emit PoolResumed(pausedDuration, endTime);
        }

        require(block.timestamp < endTime, "Pool has ended");

        _updateReward(msg.sender);

        uint256 balanceBefore = stakingToken.balanceOf(address(this));
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        uint256 balanceAfter = stakingToken.balanceOf(address(this));

        uint256 actualAmount = balanceAfter - balanceBefore;
        require(actualAmount > 0, "No tokens received");

        userInfo[msg.sender].stakedBalance += actualAmount;
        totalStaked += actualAmount;

        emit Staked(msg.sender, _amount, actualAmount);
    }

    /**
     * @notice Unstakes tokens and automatically claims rewards
     * @param _amount Amount of tokens to unstake
     */
    function unstake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot unstake 0");
        require(userInfo[msg.sender].stakedBalance >= _amount, "Insufficient staked balance");

        _updateReward(msg.sender);

        // Claim all pending rewards
        uint256 reward = userInfo[msg.sender].rewards;
        if (reward > 0) {
            userInfo[msg.sender].rewards = 0;
            stakingToken.transfer(msg.sender, reward);
            emit RewardsClaimed(msg.sender, reward);
        }

        userInfo[msg.sender].stakedBalance -= _amount;
        totalStaked -= _amount;

        // If pool becomes empty and hasn't ended, start tracking pause time
        if (totalStaked == 0 && poolStarted && block.timestamp < endTime) {
            pauseStartTime = block.timestamp;
            emit PoolPaused(pauseStartTime);
        }

        stakingToken.transfer(msg.sender, _amount);

        emit Unstaked(msg.sender, _amount);
    }

    /**
     * @notice Claims accumulated rewards
     */
    function claimRewards() external nonReentrant {
        _updateReward(msg.sender);

        uint256 reward = userInfo[msg.sender].rewards;
        require(reward > 0, "No rewards to claim");

        userInfo[msg.sender].rewards = 0;
        stakingToken.transfer(msg.sender, reward);

        emit RewardsClaimed(msg.sender, reward);
    }

    /**
     * @notice Allows creator to withdraw remaining rewards after grace period
     * @dev Can only be called after pool ends + grace period. Does NOT touch staked tokens.
     */
    function withdrawRemainingRewards() external nonReentrant {
        require(msg.sender == creator, "Only creator");
        require(!remainingRewardsWithdrawn, "Already withdrawn");

        uint256 withdrawableAfter;
        if (!poolStarted) {
            // Pool never started - creator can withdraw after grace period from creation
            withdrawableAfter = createdAt + gracePeriod;
        } else {
            // Pool started - creator can withdraw after pool ends + grace period
            withdrawableAfter = endTime + gracePeriod;
        }

        require(block.timestamp > withdrawableAfter, "Grace period not ended");

        // Calculate remaining rewards (total balance minus any staked tokens)
        uint256 totalBalance = stakingToken.balanceOf(address(this));
        uint256 remainingRewards = totalBalance - totalStaked;
        require(remainingRewards > 0, "No remaining rewards");

        remainingRewardsWithdrawn = true;
        stakingToken.transfer(creator, remainingRewards);

        emit RemainingRewardsWithdrawn(creator, remainingRewards);
    }

    /**
     * @notice Calculates reward per token
     * @return Current reward per token value
     */
    function rewardPerToken() public view returns (uint256) {
        if (!poolStarted || totalStaked == 0) {
            return rewardPerTokenStored;
        }

        uint256 timeElapsed = _getTimeElapsed();
        uint256 rewardRate = actualRewardAmount / DURATION;

        return rewardPerTokenStored + (timeElapsed * rewardRate * 1e18 / totalStaked);
    }

    /**
     * @notice Calculates pending rewards for a user
     * @param _user Address of the user
     * @return Amount of pending rewards
     */
    function earned(address _user) public view returns (uint256) {
        UserInfo memory user = userInfo[_user];
        return (user.stakedBalance * (rewardPerToken() - user.rewardPerTokenPaid) / 1e18) + user.rewards;
    }

    /**
     * @notice Returns pool metadata
     * @return website Project website
     * @return telegram Telegram link
     * @return twitter Twitter handle
     * @return description Project description
     * @return logoUrl Logo URL
     */
    function getMetadata() external view returns (
        string memory website,
        string memory telegram,
        string memory twitter,
        string memory description,
        string memory logoUrl
    ) {
        return (
            metadata.website,
            metadata.telegram,
            metadata.twitter,
            metadata.description,
            metadata.logoUrl
        );
    }

    /**
     * @notice Returns user staking information
     * @param _user Address of the user
     * @return stakedBalance Amount of tokens staked
     * @return pendingRewards Amount of pending rewards
     */
    function getUserInfo(address _user) external view returns (
        uint256 stakedBalance,
        uint256 pendingRewards
    ) {
        return (
            userInfo[_user].stakedBalance,
            earned(_user)
        );
    }

    /**
     * @notice Returns pool statistics
     * @return _totalStaked Total tokens staked in pool
     * @return _totalRewards Total rewards to distribute
     * @return _startTime Pool start timestamp (0 if not started)
     * @return _endTime Pool end timestamp (0 if not started)
     * @return _hasStarted Whether pool has started
     * @return _hasEnded Whether pool has ended
     * @return _isPaused Whether pool is currently paused (no stakers)
     * @return _gracePeriod Grace period in seconds
     */
    function getPoolStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalRewards,
        uint256 _startTime,
        uint256 _endTime,
        bool _hasStarted,
        bool _hasEnded,
        bool _isPaused,
        uint256 _gracePeriod
    ) {
        return (
            totalStaked,
            actualRewardAmount,
            startTime,
            endTime,
            poolStarted,
            poolStarted && block.timestamp >= endTime,
            poolStarted && totalStaked == 0 && block.timestamp < endTime,
            gracePeriod
        );
    }

    /**
     * @notice Updates reward calculations for a user
     * @param _user Address of the user
     */
    function _updateReward(address _user) private {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp > endTime ? endTime : block.timestamp;

        if (_user != address(0)) {
            userInfo[_user].rewards = earned(_user);
            userInfo[_user].rewardPerTokenPaid = rewardPerTokenStored;
        }
    }

    /**
     * @notice Calculates time elapsed for reward distribution
     * @return Time in seconds
     */
    function _getTimeElapsed() private view returns (uint256) {
        if (!poolStarted) {
            return 0;
        }
        uint256 currentTime = block.timestamp > endTime ? endTime : block.timestamp;
        return currentTime - lastUpdateTime;
    }

    /**
     * @notice Calculates total rewards distributed so far
     * @return Amount of rewards distributed
     */
    function _distributedRewards() private view returns (uint256) {
        if (!rewardsDeposited || !poolStarted || totalStaked == 0) {
            return 0;
        }

        uint256 elapsed = (block.timestamp > endTime ? endTime : block.timestamp) - startTime;
        return (actualRewardAmount * elapsed) / DURATION;
    }
}
