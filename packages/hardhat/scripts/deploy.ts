/*


    DEPRECATED in favor of hardhat-deploy. See https://github.com/wighawag/hardhat-deploy

*/

import { ethers } from 'hardhat'

async function main() {
    const NCSubscriptionsFactory = await ethers.getContractFactory('NCSubscriptionFactory')
    const ncSubscriptionsFactory = await NCSubscriptionsFactory.deploy()

    console.log('NCSubscriptionFactory deployed to:', ncSubscriptionsFactory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
