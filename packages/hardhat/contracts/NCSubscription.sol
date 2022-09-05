// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import 'hardhat/console.sol';

contract NCSubscription is Ownable {
    using SafeMath for uint8;
    using SafeMath for uint256;
    using SafeERC20Upgradeable for IERC20;

    constructor(
        string memory _eventName,
        uint256 _poolSizeInUSDC,
        address tokenAddress,
        address _owner
    ) {
        eventName = _eventName;
        poolSizeInUSDC = _poolSizeInUSDC;
        init(tokenAddress);
        transferOwnership(_owner);
    }

    IERC20 public token;
    string public eventName;
    uint256 public poolSizeInUSDC;
    uint256 public totalInvites;

    function init(address tokenAddress) public onlyOwner {
        token = IERC20(tokenAddress);
    }

    function subscribe(address _newSub) external {
        require(token.allowance(msg.sender, address(this)) >= poolSizeInUSDC, 'Not enough tokens');
        token.transferFrom(msg.sender, address(this), poolSizeInUSDC);
        totalInvites = totalInvites.add(1);
    }
}
