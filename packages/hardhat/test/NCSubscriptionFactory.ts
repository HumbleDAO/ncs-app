import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('NCSubscriptionsFactory', function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployNCSFactory() {
        const [owner, otherAccount] = await ethers.getSigners()

        const NCSubscriptionsFactory = await ethers.getContractFactory('NCSubscriptionFactory')
        const NCSubscription = await ethers.getContractFactory('NCSubscription')

        const ncSubscriptionsFactory = await NCSubscriptionsFactory.deploy()

        return { ncSubscriptionsFactory, NCSubscription, owner, otherAccount }
    }

    describe('creatNCSubscription', function () {
        it('Should create a new subscription', async function () {
            const { ncSubscriptionsFactory, NCSubscription, owner, otherAccount } = await deployNCSFactory()
            let beforeValue = await ncSubscriptionsFactory.totalSubscriptions()
            console.log('Before', beforeValue)
            let res = await ncSubscriptionsFactory.creatNCSubscription('New Event', '1000000')
            // let subscription = await NCSubscription.at(res.logs[0].args.subscription)
            // console.log('Subscription', subscription)
            console.log('res', res)
            let afterValue = await ncSubscriptionsFactory.totalSubscriptions()
            console.log('After', afterValue)
            expect(beforeValue).to.not.equal(afterValue)
        })

        // it('Should set the right owner', async function () {
        //     const { lock, owner } = await loadFixture(deployOneYearLockFixture)

        //     expect(await lock.owner()).to.equal(owner.address)
        // })

        // it('Should receive and store the funds to lock', async function () {
        //     const { lock, lockedAmount } = await loadFixture(deployOneYearLockFixture)

        //     expect(await ethers.provider.getBalance(lock.address)).to.equal(lockedAmount)
        // })

        // it('Should fail if the unlockTime is not in the future', async function () {
        //     // We don't use the fixture here because we want a different deployment
        //     const latestTime = await time.latest()
        //     const Lock = await ethers.getContractFactory('Lock')
        //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        //         'Unlock time should be in the future'
        //     )
        // })
    })
})
