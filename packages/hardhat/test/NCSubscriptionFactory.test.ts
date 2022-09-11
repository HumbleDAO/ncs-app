import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers, upgrades } from 'hardhat'

import {
    NCSubscriptionFactory as INCSubscriptionFactory,
    NCSubscription as INCSubscription,
} from '../typechain-types/contracts'

import {
    NCSubscriptionFactory__factory as INCSubscriptionFactory__factory,
    NCSubscription__factory as INCSubscription__factory,
} from '../typechain-types/factories/contracts'

// test NCSubscriptionFactory as a proxy and upgradeable contract that uses openzeppelin

describe('NCSubscriptionFactory', function () {
    async function deployNCSubscriptionFixture() {
        const [owner, otherAccount] = await ethers.getSigners()

        let NCSubscriptionFactory__factory: INCSubscriptionFactory__factory = await ethers.getContractFactory(
            'NCSubscriptionFactory'
        )

        let NCSubscriptionFactory: INCSubscriptionFactory = await NCSubscriptionFactory__factory.deploy()

        await NCSubscriptionFactory.deployed()

        let NCSubscription__factory: INCSubscription__factory = await ethers.getContractFactory('NCSubscription')

        return {
            owner,
            otherAccount,
            NCSubscriptionFactory__factory,
            NCSubscriptionFactory,
            NCSubscription__factory,
        }
    }

    describe('createNCSubscription', function () {
        let NCSubscriptionFactory: INCSubscriptionFactory
        let owner: SignerWithAddress
        let otherAccount: SignerWithAddress

        beforeEach(async () => {
            const {
                NCSubscriptionFactory: _NCSubscriptionFactory,
                owner: _owner,
                otherAccount: _otherAccount,
            } = await loadFixture(deployNCSubscriptionFixture)

            NCSubscriptionFactory = _NCSubscriptionFactory
            owner = _owner
            otherAccount = _otherAccount
        })

        it('should be deployed', async function () {
            expect(NCSubscriptionFactory.address).to.be.properAddress
        })

        it('Should create a new subscription', async function () {
            let beforeValue = await NCSubscriptionFactory.totalSubscriptions()
            // console.log('Before', beforeValue)
            let res = await NCSubscriptionFactory.createNCSubscription(
                'New Event',
                '1000000',
                '0xDE29485dF7e941866442ceb25DCe1b9c64D02A26',
                '0xDE29485dF7e941866442ceb25DCe1b9c64D02A26'
            )

            let afterValue = await NCSubscriptionFactory.totalSubscriptions()
            // console.log('After', afterValue)
            expect(beforeValue).to.not.equal(afterValue)
        })

        it('Should allow to get list of subscriptions created', async function () {
            let subscriptionsCreatedBefore = await NCSubscriptionFactory.getSubscriptionsCreatedByOwner(owner.address)
            console.log('subs created', subscriptionsCreatedBefore)

            let res = await NCSubscriptionFactory.createNCSubscription(
                'New Event',
                '1000000',
                '0xDE29485dF7e941866442ceb25DCe1b9c64D02A26',
                '0xDE29485dF7e941866442ceb25DCe1b9c64D02A26'
            )

            // console.log('res', res)
            let subscriptionsCreatedAfter = await NCSubscriptionFactory.getSubscriptionsCreatedByOwner(owner.address)
            // console.log('subs created', subscriptionsCreatedAfter)
            expect(subscriptionsCreatedBefore).to.not.equal(subscriptionsCreatedAfter)

            // let subscription = await NCSubscription.at(res.logs[0].args.subscription)
            // console.log('Subscription', subscription)
        })

        it('Should allow to subscribe to a subscription', async function () {
            let subscriptionsCreatedBefore = await NCSubscriptionFactory.getSubscriptionsCreatedByOwner(owner.address)
            console.log('subs created', subscriptionsCreatedBefore)

            let res = await NCSubscriptionFactory.createNCSubscription(
                'New Event',
                '1000000',
                '0xDE29485dF7e941866442ceb25DCe1b9c64D02A26',
                '0xDE29485dF7e941866442ceb25DCe1b9c64D02A26'
            )

            console.log('res', res)
            let subscriptionsCreatedAfter = await NCSubscriptionFactory.getSubscriptionsCreatedByOwner(owner.address)
            // console.log('subs created', subscriptionsCreatedAfter)
            expect(subscriptionsCreatedBefore).to.not.equal(subscriptionsCreatedAfter)

            let subscription = await ncSubscription.attach(subscriptionsCreatedAfter[0])
            console.log('Subscription', subscription)
            // let subscribing = await subscription.subscribe({ value: 1000000 })
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
