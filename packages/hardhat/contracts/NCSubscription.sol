// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

import './IAaveLendingPool.sol';
import './IAaveLendingPoolAddressesProvider.sol';
import 'hardhat/console.sol';
import './NCSNFT.sol';

contract NCSubscription is Ownable {
    using SafeMath for uint256;
    using SafeERC20Upgradeable for IERC20;

    IAaveLendingPoolAddressesProvider public aaveLendingPoolAddressesProvider;
    NCSNFT nft;
    address public nftAddress;
    IERC20 public token;
    string public eventName;
    uint256 public poolSize;
    uint256 public totalSubscriptions;
    mapping(address => uint256) public subscriptionsMap;
    address[] subscribers;
    IERC20 public aaveAToken;
    IERC20 public underlyingToken;
    uint256 public principalBalance;

    event NCSNFTMinted(address eventAddress, address owner, uint256 tokenId);

    constructor(
        string memory _eventName,
        uint256 _poolSize,
        address _tokenAddress,
        address _aTokenAddress,
        address _owner,
        IAaveLendingPoolAddressesProvider _aaveLendingPoolAddressesProvider
    ) {
        eventName = _eventName;
        poolSize = _poolSize;
        token = IERC20(_tokenAddress);
        underlyingToken = IERC20(_tokenAddress);
        transferOwnership(_owner);
        nft = new NCSNFT(_eventName, 'NCS');
        nftAddress = address(nft);
        aaveAToken = IERC20(_aTokenAddress);
        aaveLendingPoolAddressesProvider = _aaveLendingPoolAddressesProvider;
    }

    function subscribe() external {
        require(token.allowance(msg.sender, address(this)) >= poolSize, 'Not enough tokens');
        token.transferFrom(msg.sender, address(this), poolSize);
        uint256 id = nft.mint(msg.sender);
        _deposit(poolSize);
        totalSubscriptions = totalSubscriptions.add(1);
        subscriptionsMap[msg.sender] = id;
        subscribers.push(msg.sender);
    }

    function unsubscribe() external {
        // todo: require allowance of transfer
        require(nft.isApprovedForAll(msg.sender, address(this)), 'Subscriptions are not approved for closing');
        require(nft.balanceOf(msg.sender) >= 0, 'No Subscription');
        nft.transferFrom(msg.sender, address(this), subscriptionsMap[msg.sender]);
        principalBalance = principalBalance - poolSize;
        IAaveLendingPool lendingPool = aaveLendingPoolAddressesProvider.getLendingPool();
        lendingPool.withdraw(address(underlyingToken), poolSize, msg.sender);
        token.transfer(msg.sender, poolSize);
        totalSubscriptions = totalSubscriptions.sub(1);
    }

    function deposit(uint256 amount) external {
        require( //TODO: add safe transfer
            underlyingToken.transferFrom(_msgSender(), address(this), amount),
            'Unable to pull funds from the sender'
        );

        _deposit(amount);
    }

    function _deposit(uint256 amount) internal returns (uint256) {
        principalBalance = principalBalance.add(amount);

        IAaveLendingPool lendingPool = aaveLendingPoolAddressesProvider.getLendingPool();
        require(underlyingToken.approve(address(lendingPool), amount), 'underlyingToken approve failed');
        lendingPool.deposit(address(underlyingToken), amount, address(this), 0);
    }

    function harvestYield() public returns (uint256) {
        uint256 currentBalance = aaveAToken.balanceOf(address(this));
        require(currentBalance > principalBalance, 'Current pool balance is less than principal');

        // Withdraw yearned yield
        IAaveLendingPool lendingPool = aaveLendingPoolAddressesProvider.getLendingPool();
        uint256 yield = currentBalance.sub(principalBalance);
        uint256 withdrawn = lendingPool.withdraw(address(underlyingToken), yield, address(this));
        return yield;
    }
}
