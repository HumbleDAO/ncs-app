// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import 'hardhat/console.sol';
import './NCSubscription.sol';

contract NCSubscriptionFactory is Ownable {
    using SafeMath for uint8;
    using SafeMath for uint256;
    using SafeERC20Upgradeable for IERC20;

    event NCSubscriptionCreated(
        address eventAddress,
        string eventName,
        uint256 poolSizeInUSDC,
        address tokenAddress,
        address owner
    );

    NCSubscription[] public subscriptions;
    mapping(address => uint256) public ownerNCSubscriptionCount;
    mapping(address => address[]) public ownerNCSubscriptions;
    uint256 public totalSubscriptions;

    function createNCSubscription(
        string memory _eventName,
        uint256 _poolSizeInUSDC,
        address tokenAddress
    ) external returns (address) {
        NCSubscription _newNCSubscription = new NCSubscription(_eventName, _poolSizeInUSDC, tokenAddress, msg.sender);
        subscriptions.push(_newNCSubscription);
        totalSubscriptions = totalSubscriptions.add(1);
        ownerNCSubscriptions[msg.sender].push(address(_newNCSubscription));

        emit NCSubscriptionCreated(address(_newNCSubscription), _eventName, _poolSizeInUSDC, tokenAddress, msg.sender);
        return address(_newNCSubscription);
    }

    function getSubscriptionsCreatedByOwner(address _owner) external view returns (address[] memory) {
        return ownerNCSubscriptions[_owner];
    }
}
