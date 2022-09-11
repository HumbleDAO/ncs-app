import { ethers } from 'hardhat'

async function main() {
    const NCSubscriptionsFactory = await ethers.getContractFactory('NCSubscriptionFactory')
    const ncSubscriptionsFactory = await NCSubscriptionsFactory.deploy()

    console.log('NCSubscriptionFactory deployed to:', ncSubscriptionsFactory.address)
}
