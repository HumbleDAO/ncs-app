<template>
    <nc-card :title="props.subscription.eventName" :description="props.description">
        <template #icon>
            <div class="avatar self-center" name="icon">
                <div class="w-16 rounded">
                    <img src="@/assets/chartsoncomputer.png" />
                </div>
            </div>
        </template>

        <template #default>
            <div class="flex justify-between border-opacity-50 my-5">
                <div class="w-2/4 flex flex-col justify-center">
                    <div class="flex self-center mt-2">
                        <usdcCoinSvg class="w-10 h-10 cursor-pointer" @click.prevent="" />
                    </div>
                </div>

                <div class="divide-y text-6xl h-full">&verbar;</div>

                <div class="w-2/4 flex items-center justify-center">
                    <!-- TODO: Ensure apy is fetched for -->
                    <label for="apy">
                        $ {{ ethers.utils.formatEther(BigNumber.from(props.subscription.poolSize)) }}
                    </label>
                </div>
            </div>

            <div class="flex justify-center">
                <p class="text-xs font-extralight underline">
                    You can unsubcribe and unstake at any time to retrieve your funds
                </p>
            </div>

            <div id="actions">
                <div v-if="isSubscribed" class="flex justify-center">
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        @click="unsubscribe"
                    >
                        Unsubscribe
                    </button>
                </div>
                <div v-if="!isSubscribed" class="flex justify-center">
                    <button
                        class="bg-blue-500 mx-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        @click="subscribe"
                    >
                        Subscribe
                    </button>
                    <button
                        class="bg-blue-500 mx-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        @click="subscribe"
                    >
                        Swap to Monthly
                    </button>
                </div>
            </div>
        </template>
    </nc-card>
</template>

<script setup lang="ts">
import { isProxy, toRaw } from 'vue'

import { erc20ABI, useNetwork, useAccount, useConnect } from 'vagmi'
import NCSubscriptionABI from '../contracts/ABI/NCSubscription.json'
import { ethers, BigNumber, utils } from 'ethers'
import usdcCoinSvg from '@/assets/usdc-icon.svg?component'
import { ISubscription, Subscription } from '~~/composables/useContractsStore'

const runtimeConfig = useRuntimeConfig()
const { address } = useAccount()
const { activeConnector, isConnected } = useConnect()

const props = defineProps({
    description: {
        type: String,
        required: true,
    },
    subscription: {
        type: Object,
        required: true,
        validation: (value: ISubscription) => {
            return value instanceof Subscription
        },
    },
})

const stakeAmount = ref('')
const allowance = ref<BigNumber>(BigNumber.from(0))
const allowanceInEthers = ref()
const isSubscribed = ref(false)

let usdcContract = ref<ethers.Contract>()
let contracts = ref({} as any)

watch(
    () => allowance.value,
    (newAllowance) => {
        allowanceInEthers.value = utils.formatEther(newAllowance)
    }
)

watch(
    () => props.subscription.poolSize,
    (newPoolSize: BigNumber) => {
        console.log('newPoolSize', newPoolSize)
        stakeAmount.value = BigNumber.from(newPoolSize).toString()
    }
)

onMounted(async () => {
    if (isConnected.value) {
        await init()
    }
})

const init = async () => {
    contracts.value = await useContractsStore().loadContracts()
    const { chain } = useNetwork()

    const signer = await activeConnector.value?.getSigner()

    // All this needs a refactor for security

    let account_address = await signer.getAddress()
    const headers = {
        'Content-Type': 'application/json',
        Authorization: '5dbfb5d6-63d0-4e04-a054-29b750c5d592',
    }

    const { data } = await useFetch(`https://api.nftport.xyz/v0/accounts/${account_address}?chain=polygon`, {
        headers: headers,
    })
    let nftsOwned = toRaw(data.value).nfts
    let subscription = toRaw(props.subscription)
    // grab all contract_address properties from data and put them in an array

    nftsOwned.map((nft) => {
        const contract_address = nft.contract_address
        if (contract_address === subscription.nftAddress) {
            isSubscribed.value = true
        }
    })
    console.log('NFT DATA', nftsOwned, subscription.nftAddress, isSubscribed.value)

    usdcContract.value = new ethers.Contract(
        runtimeConfig.public.supportedChainsMetadata[chain.value?.id]?.usdcTokenAddress,
        erc20ABI,
        signer
    )

    const { NCSubscriptionFactory } = contracts.value

    allowance.value = await usdcContract.value.allowance(address.value, NCSubscriptionFactory.address)
}

const checkAllowanceAndApproveSubscription = async (subAddress) => {
    const signer = await activeConnector.value.getSigner()
    const subscription = new ethers.Contract(subAddress, NCSubscriptionABI, signer)
    const checkAllowance = await usdcContract.value.allowance(subAddress, address.value)

    if (BigNumber.isBigNumber(checkAllowance) && allowanceInEthers.value < stakeAmount.value) {
        await usdcContract.value.approve(subAddress, utils.parseEther(String(100000000)))
    }
}

const getSubscriptions = async () => {
    const { NCSubscriptionFactory } = contracts.value
    const subscriptions = await NCSubscriptionFactory.subscriptions()
    return subscriptions
}

const getSubscriptionsByUser = async (address) => {
    const { NCSubscriptionFactory } = contracts.value
    const subscriptions = await NCSubscriptionFactory.getSubscriptionsCreatedByOwner(address)
    return subscriptions
}

const subscribe = async () => {
    let subscription = toRaw(props.subscription)

    const signer = await activeConnector.value.getSigner()
    const subscriptionContract = await new ethers.Contract(subscription.nftAddress, NCSubscriptionABI, signer)
    console.log(subscriptionContract, 'Sub Cntract')
    checkAllowanceAndApproveSubscription(subscription.nftAddress)
    // subscriptionContract.subscribe()
}

const unsubscribe = async () => {
    let subscription = toRaw(props.subscription)

    const signer = await activeConnector.value.getSigner()
    const subscriptionContract = await new ethers.Contract(subscription.nftAddress, NCSubscriptionABI, signer)
    subscriptionContract.unsubscribe()
}
</script>

<style lang="scss" scoped></style>
