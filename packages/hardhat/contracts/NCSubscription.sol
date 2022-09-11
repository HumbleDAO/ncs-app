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
import './NCSNFT.sol';

contract NCSubscription is Ownable {
    using SafeMath for uint256;
    using SafeERC20Upgradeable for IERC20;

    event NCSNFTMinted(address eventAddress, address owner, uint256 tokenId);

    constructor(
        string memory _eventName,
        uint256 _poolSize,
        address tokenAddress,
        address _owner
    ) {
        eventName = _eventName;
        poolSize = _poolSize;
        token = IERC20(tokenAddress);
        transferOwnership(_owner);
        nft = new NCSNFT(_eventName, 'NCS');
        nftAddress = address(nft);
    }

    NCSNFT nft;
    address public nftAddress;
    IERC20 public token;
    string public eventName;
    uint256 public poolSize;
    uint256 public totalSubscriptions;
    mapping(address => uint256) public subscriptionsMap;
    address[] subscribers;

    function subscribe() external {
        require(token.allowance(msg.sender, address(this)) >= poolSize, 'Not enough tokens');
        token.transferFrom(msg.sender, address(this), poolSize);
        uint256 id = nft.mint(msg.sender);
        totalSubscriptions = totalSubscriptions.add(1);
        subscriptionsMap[msg.sender] = id;
        subscribers.push(msg.sender);
    }

    function unsubscribe() external {
        // todo: require allowance of transfer
        require(nft.isApprovedForAll(msg.sender, address(this), 'Subscriptions are not approved for closing');
        require(nft.balanceOf(msg.sender) >= 0, 'No Subscription');
        nft.transferFrom(address(this), msg.sender, subscriptionsMap[msg.sender]);
        token.transferFrom(address(this), msg.sender, poolSize);
        totalSubscriptions = totalSubscriptions.sub(1);
    }
}
