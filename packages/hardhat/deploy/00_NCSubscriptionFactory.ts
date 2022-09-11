// deploy/00_NC_Subscription_Factory.ts

// import { ethers, upgrades } from 'hardhat'

const localChainId = '31337'

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, save } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    await deploy('NCSubscriptionFactory', {
        // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
        from: deployer,
        // args: [ "Hello", ethers.utils.parseEther("1.5") ],
        log: true,
        waitConfirmations: 5,
        // TODO: uncomment when everything is upgrade safe
        // proxy: {
        //     proxyContract: 'OpenZeppelinTransparentProxy',
        //     execute: {
        //         init: {
        //             methodName: 'initialize',
        //             args: [],
        //         },
        //     },
        // },
    })

    // Getting a previously deployed contract
    // const NCSubscriptionFactory = await ethers.getContractFactory('NCSubscriptionFactory')
    // const instance = await upgrades.deployProxy(NCSubscriptionFactory)
    // await instance.deployed()
    // console.log('Deploy NCSubscriptionFactory Proxy Done ', instance.address)

    // await NCSubscriptionFactory.setPurpose('Hello')

    // To take ownership of NCSubscriptionFactory using the ownable library uncomment next line and add the
    // address you want to be the owner.

    // await NCSubscriptionFactory.transferOwnership(deployer.address)
    // const NCSubscriptionFactory = await ethers.getContractAt('NCSubscriptionFactory', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!

    /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

    /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const NCSubscriptionFactory = await deploy("NCSubscriptionFactory", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

    /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const NCSubscriptionFactory = await deploy("NCSubscriptionFactory", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

    // Verify from the command line by running `yarn verify`

    // You can also Verify your contracts with Etherscan here...
    // You don't want to verify on localhost
    // try {
    //   if (chainId !== localChainId) {
    //     await run("verify:verify", {
    //       address: NCSubscriptionFactory.address,
    //       contract: "contracts/NCSubscriptionFactory.sol:NCSubscriptionFactory",
    //       constructorArguments: [],
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
}
module.exports.tags = ['NCSubscriptionFactory']
