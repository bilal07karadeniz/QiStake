// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title QiStake Factory Interface
 * @author bilal07karadeniz
 * @notice Interface for QiStakeFactory contract
 */

interface IQiStakeFactory {
    function creationFee() external view returns (uint256);
    function isPool(address pool) external view returns (bool);
    function deployedPools(uint256 index) external view returns (address);
    
    function createPool(
        address _stakingToken,
        uint256 _rewardAmount,
        string memory _website,
        string memory _telegram,
        string memory _twitter,
        string memory _description,
        string memory _logoUrl
    ) external payable returns (address poolAddress);
    
    function setCreationFee(uint256 _newFee) external;
    function withdrawFees() external;
    
    function totalPools() external view returns (uint256);
    function getPools(uint256 _offset, uint256 _limit) external view returns (address[] memory);
    function getAllPools() external view returns (address[] memory);
}
