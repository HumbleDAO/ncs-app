<template>
    <div :data-theme="colorMode.preference" class="flex flex-col justify-center items-center w-full h-screen">
        <div class="flex flex-col items-center">
            <nc-subscription-factory-card />
            <div v-if="contractsAddresses" class="my-1">
                <div
                    v-for="contract in contractsAddresses"
                    :key="contract.name + contract.address"
                    class="flex flex-col justify-center items-center"
                >
                    <div class="text-sm" for="contract-address">{{ contract.address }}</div>
                </div>
            </div>
        </div>

        <div class="flex flex-wrap justify-center items-center overflow-y-auto">
            <div
                v-for="subscription in subscriptions"
                :key="subscription.nftAddress"
                class="flex flex-col justify-start items-center m-5"
            >
                <nc-subscription-card
                    :subscription="subscription"
                    :description="'placeholder description'"
                    class="my-1"
                >
                    <div></div>
                </nc-subscription-card>

                <div class="text-sm" for="contract-address">{{ subscription.address }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BigNumber, ethers } from 'ethers'
import { erc20ABI, erc721ABI, useAccount, useConnect, useNetwork } from 'vagmi'
import NCSubscriptionABI from '../contracts/ABI/NCSubscription.json'
import { ISubscription, Subscription } from '../composables/useContractsStore'

definePageMeta({
    colorMode: 'luxury',
})

const colorMode = useColorMode()

const runtimeConfig = useRuntimeConfig()
const { address } = useAccount()
const { activeConnector, isConnected } = useConnect()

const allowance = ref<BigNumber>(BigNumber.from(0))
let usdcContract = ref<ethers.Contract>()
let contracts = ref({} as any)
let subscriptions = ref([] as ISubscription[])
let subscriptionsByUsers = ref([] as ISubscription[])

const contractsAddresses = computed(() => {
    if (!contracts.value) return []

    return Object.keys(contracts.value).map((key: string) => ({
        name: key,
        address: contracts.value[key].address,
    }))
})

watch(
    () => subscriptions.value,
    (newSubscriptions) => {
        if (newSubscriptions) {
            console.log('NEW SUBSCRIPTIONS: ', newSubscriptions)
        } else {
            console.log('NO NEW SUBSCRIPTIONS')
        }
    }
)

watch(
    () => isConnected.value,
    async (isConnected) => {
        if (isConnected) {
            await init()
        }
    }
)

onMounted(async () => {
    if (isConnected.value) {
        await init()
    }
})

const init = async () => {
    contracts.value = await useContractsStore().loadContracts(await activeConnector.value?.getSigner())

    const { chain } = useNetwork()

    const signer = await activeConnector.value?.getSigner()

    usdcContract.value = new ethers.Contract(
        runtimeConfig.public.supportedChainsMetadata[chain.value?.id]?.usdcTokenAddress,
        erc20ABI,
        signer
    )

    const { NCSubscriptionFactory } = contracts.value

    allowance.value = await usdcContract.value.allowance(address.value, NCSubscriptionFactory.address)

    await getSubscriptions()
}

const getSubscriptions = async () => {
    const { NCSubscriptionFactory } = contracts.value

    const subscriptionAddresses = await NCSubscriptionFactory.getSubscriptions()

    if (subscriptionAddresses.length) {
        subscriptionAddresses.forEach(async (subscription: any) => {
            const subscriptionContract = new ethers.Contract(
                subscription,
                NCSubscriptionABI,
                await activeConnector.value?.getSigner()
            )

            // TODO: Create a getter in NcSubscription contract

            const eventName = await subscriptionContract.eventName()
            const poolSize = ethers.BigNumber.from(await subscriptionContract.poolSize())
            const token = await subscriptionContract.token()
            const underlyingToken = await subscriptionContract.underlyingToken()
            const nftAddress = await subscriptionContract.nftAddress()
            const nft = new ethers.Contract(nftAddress, erc721ABI, await activeConnector.value?.getSigner())
            const aaveLendingPoolAddressesProvider = await subscriptionContract.aaveLendingPoolAddressesProvider()

            subscriptions.value.push(
                new Subscription({
                    address: subscriptionContract.address,
                    eventName,
                    poolSize,
                    token,
                    underlyingToken,
                    nftAddress,
                    nft,
                    aaveLendingPoolAddressesProvider,
                })
            )
        })
    }
}

const getSubscriptionsByUser = async (address) => {
    const { NCSubscriptionFactory } = contracts.value

    subscriptionsByUsers.value = await NCSubscriptionFactory.getSubscriptionsCreatedByOwner(address)
}
</script>
