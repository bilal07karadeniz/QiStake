// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title QiStake Factory
 * @author bilal07karadeniz
 * @notice Factory contract for deploying QiStakePool contracts on QIE Network
 * @dev Manages pool creation with native coin fees and maintains a registry of all pools
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./QiStakePool.sol";

contract QiStakeFactory is Ownable, ReentrancyGuard {
    /// @notice Fee required to create a new staking pool (in wei)
    uint256 public creationFee;

    /// @notice Grace period for pools (time after pool ends for users to claim rewards)
    uint256 public gracePeriod = 90 days;

    /// @notice Array of all deployed pool addresses
    address[] public deployedPools;

    /// @notice Mapping to check if an address is a valid pool
    mapping(address => bool) public isPool;

    /// @notice Emitted when a new pool is created
    event PoolCreated(
        address indexed poolAddress,
        address indexed creator,
        address indexed stakingToken,
        uint256 rewardAmount,
        uint256 timestamp
    );
    
    /// @notice Emitted when creation fee is updated
    event CreationFeeUpdated(uint256 oldFee, uint256 newFee);
    
    /// @notice Emitted when fees are withdrawn
    event FeesWithdrawn(address indexed to, uint256 amount);

    /// @notice Emitted when grace period is updated
    event GracePeriodUpdated(uint256 oldPeriod, uint256 newPeriod);

    /**
     * @notice Initializes the factory with an initial creation fee
     * @param _initialFee Initial fee in wei required to create a pool
     */
    constructor(uint256 _initialFee) Ownable(msg.sender) {
        creationFee = _initialFee;
    }

    /**
     * @notice Creates a new staking pool
     * @dev Caller must send exactly the creation fee in native coin (QIE) and approve reward tokens
     * @param _stakingToken Address of the token to be staked
     * @param _rewardAmount Total amount of rewards to be distributed (before any transfer fees)
     * @param _website Project website URL
     * @param _telegram Telegram link
     * @param _twitter Twitter handle or link
     * @param _description Project description (max 150 characters)
     * @param _logoUrl URL to project logo
     * @return poolAddress Address of the newly created pool
     */
    function createPool(
        address _stakingToken,
        uint256 _rewardAmount,
        string memory _website,
        string memory _telegram,
        string memory _twitter,
        string memory _description,
        string memory _logoUrl
    ) external payable nonReentrant returns (address poolAddress) {
        require(msg.value == creationFee, "Incorrect creation fee");
        require(_stakingToken != address(0), "Invalid token address");
        require(_rewardAmount > 0, "Reward amount must be positive");
        require(bytes(_description).length <= 150, "Description too long");

        IERC20 token = IERC20(_stakingToken);

        // Step 1: Transfer tokens from creator to factory (supports fee-on-transfer)
        uint256 balanceBefore = token.balanceOf(address(this));
        require(token.transferFrom(msg.sender, address(this), _rewardAmount), "Token transfer failed");
        uint256 receivedByFactory = token.balanceOf(address(this)) - balanceBefore;
        require(receivedByFactory > 0, "No tokens received");

        // Step 2: Deploy new pool
        QiStakePool newPool = new QiStakePool(
            address(this),
            msg.sender,
            _stakingToken,
            gracePeriod,
            _website,
            _telegram,
            _twitter,
            _description,
            _logoUrl
        );

        poolAddress = address(newPool);

        // Step 3: Transfer tokens from factory to pool (supports fee-on-transfer)
        require(token.transfer(poolAddress, receivedByFactory), "Transfer to pool failed");

        // Step 4: Initialize rewards on pool (pool will measure actual received amount)
        newPool.initializeRewards();

        // Register pool
        deployedPools.push(poolAddress);
        isPool[poolAddress] = true;

        emit PoolCreated(poolAddress, msg.sender, _stakingToken, _rewardAmount, block.timestamp);
    }

    /**
     * @notice Updates the creation fee
     * @dev Only callable by owner
     * @param _newFee New fee in wei
     */
    function setCreationFee(uint256 _newFee) external onlyOwner {
        uint256 oldFee = creationFee;
        creationFee = _newFee;
        emit CreationFeeUpdated(oldFee, _newFee);
    }

    /**
     * @notice Updates the grace period for new pools
     * @dev Only callable by owner. Minimum 30 days to protect users.
     * @param _newPeriod New grace period in seconds
     */
    function setGracePeriod(uint256 _newPeriod) external onlyOwner {
        require(_newPeriod >= 30 days, "Grace period too short");
        uint256 oldPeriod = gracePeriod;
        gracePeriod = _newPeriod;
        emit GracePeriodUpdated(oldPeriod, _newPeriod);
    }

    /**
     * @notice Withdraws accumulated fees to owner
     * @dev Only callable by owner
     */
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
        
        emit FeesWithdrawn(owner(), balance);
    }

    /**
     * @notice Returns the total number of pools created
     * @return Total count of deployed pools
     */
    function totalPools() external view returns (uint256) {
        return deployedPools.length;
    }

    /**
     * @notice Returns a batch of pool addresses
     * @dev Use this to paginate through pools to avoid gas issues
     * @param _offset Starting index
     * @param _limit Maximum number of addresses to return
     * @return Pool addresses in the specified range
     */
    function getPools(uint256 _offset, uint256 _limit) external view returns (address[] memory) {
        require(_offset < deployedPools.length, "Offset out of bounds");
        
        uint256 end = _offset + _limit;
        if (end > deployedPools.length) {
            end = deployedPools.length;
        }
        
        uint256 size = end - _offset;
        address[] memory pools = new address[](size);
        
        for (uint256 i = 0; i < size; i++) {
            pools[i] = deployedPools[_offset + i];
        }
        
        return pools;
    }

    /**
     * @notice Returns all pool addresses
     * @dev Use getPools() for large datasets to avoid gas issues
     * @return Array of all deployed pool addresses
     */
    function getAllPools() external view returns (address[] memory) {
        return deployedPools;
    }

    /**
     * @notice Enables contract to receive native coins
     */
    receive() external payable {}
}
