<template>
    <div class="flex h-screen" :data-theme="colorMode.preference">
        <nc-hero class="flex flex-col items-center justify-center">
            <div v-if="contractsAddresses">
                <div
                    v-for="contract in contractsAddresses"
                    :key="contract.name + contract.address"
                    class="flex flex-col"
                >
                    <div for="name" class="heading">
                        {{ contract.name }}
                    </div>
                    <div for="contract-address">{{ contract.address }}</div>
                </div>
            </div>

            <div class="my-5 flex flex-col items-center">
                <nc-subscription-factory-card />
            </div>
        </nc-hero>
    </div>
</template>

<script setup lang="ts">
import { BigNumber, ethers } from 'ethers'
import { erc20ABI, useAccount, useConnect, useNetwork } from 'vagmi'

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
let subscriptions = ref([] as any)
let subscriptionsByUsers = ref([] as any)

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
        console.log('NEW SUBSCRIPTIONS: ', newSubscriptions)
    }
)

watch(
    () => isConnected.value,
    (isConnected) => {
        console.log('ISCONNECTED: ', isConnected)
        init()
    }
)

onMounted(async () => {
    console.log('ISCONNECTED: ', isConnected.value)
    if (isConnected.value) {
        await init()
    }
})

const init = async () => {
    contracts.value = await useContractsStore().loadContracts()
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
    console.log('NCSubscriptionFactory: ', NCSubscriptionFactory)
    subscriptions.value = await NCSubscriptionFactory.subscriptions()
    console.log('SUBSCRIPTIONS: ', subscriptions.value)
}

const getSubscriptionsByUser = async (address) => {
    const { NCSubscriptionFactory } = contracts.value

    subscriptionsByUsers.value = await NCSubscriptionFactory.getSubscriptionsCreatedByOwner(address)
}
</script>
