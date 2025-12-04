// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title QiStake Pool Interface
 * @author bilal07karadeniz
 * @notice Interface for QiStakePool contract
 */

interface IQiStakePool {
    struct PoolMetadata {
        string website;
        string telegram;
        string twitter;
        string description;
        string logoUrl;
    }

    function creator() external view returns (address);
    function stakingToken() external view returns (address);
    function totalRewards() external view returns (uint256);
    function startTime() external view returns (uint256);
    function endTime() external view returns (uint256);
    function totalStaked() external view returns (uint256);
    function rewardsDeposited() external view returns (bool);
    
    function depositRewards() external;
    function stake(uint256 _amount) external;
    function unstake(uint256 _amount) external;
    function claimRewards() external;
    
    function earned(address _user) external view returns (uint256);
    function rewardPerToken() external view returns (uint256);
    
    function getMetadata() external view returns (
        string memory website,
        string memory telegram,
        string memory twitter,
        string memory description,
        string memory logoUrl
    );
    
    function getUserInfo(address _user) external view returns (
        uint256 stakedBalance,
        uint256 pendingRewards
    );
    
    function getPoolStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalRewards,
        uint256 _startTime,
        uint256 _endTime,
        bool _hasEnded
    );
}
