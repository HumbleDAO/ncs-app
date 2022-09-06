import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers, upgrades } from 'hardhat'

// test NCSubscriptionsFactory as a proxy and upgradeable contract that uses openzeppelin

describe('NCSubscriptionsFactory', function () {
    let ncSubscriptionsFactory: any
    let ncSubscription: any
    let owner: any
    let otherAccount: any

    this.beforeEach(async () => {
        ;[owner, otherAccount] = await ethers.getSigners()
        ncSubscriptionsFactory = await (await ethers.getContractFactory('NCSubscriptionFactory')).deploy()
        ncSubscription = await ethers.getContractFactory('NCSubscription')

        // fix 'Ownable: caller is not the owner' error
        await ncSubscription.transferOwnership(owner.address)
    })

    describe('NCSubscriptionFactory', function () {
        it('should be deployed', async function () {
            const [deployer] = await ethers.getSigners()
            const NCSubscriptionFactory = await ethers.getContractFactory('NCSubscriptionFactory')
            const instance = await upgrades.deployProxy(NCSubscriptionFactory)
            await instance.deployed()
            console.log('Deploy NCSubscriptionFactory Proxy Done ', instance.address)
            expect(instance.address).to.be.properAddress
        })
    })

    describe('createNCSubscription', function () {
        it('Should create a new subscription', async function () {
            let beforeValue = await ncSubscriptionsFactory.totalSubscriptions()
            console.log('Before', beforeValue)
            let res = await ncSubscriptionsFactory.createNCSubscription(
                'New Event',
                '1000000',
                '0xDE29485dF7e941866442ceb25DCe1b9c64D02A26'
            )
            // let subscription = await NCSubscription.at(res.logs[0].args.subscription)
            // console.log('Subscription', subscription)
            console.log('res', res)
            let afterValue = await ncSubscriptionsFactory.totalSubscriptions()
            console.log('After', afterValue)
            expect(beforeValue).to.not.equal(afterValue)
        })

        it('Should allow to get list of subscriptions created', async function () {
            let subscriptionsCreatedBefore = await ncSubscriptionsFactory.getSubscriptionsCreatedByOwner(owner.address)
            console.log('subs created', subscriptionsCreatedBefore)

            let res = await ncSubscriptionsFactory.createNCSubscription(
                'New Event',
                '1000000',
                '0xDE29485dF7e941866442ceb25DCe1b9c64D02A26'
            )
            console.log('res', res)
            let subscriptionsCreatedAfter = await ncSubscriptionsFactory.getSubscriptionsCreatedByOwner(owner.address)
            console.log('subs created', subscriptionsCreatedAfter)
            expect(subscriptionsCreatedBefore).to.not.equal(subscriptionsCreatedAfter)

            // let subscription = await NCSubscription.at(res.logs[0].args.subscription)
            // console.log('Subscription', subscription)
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
