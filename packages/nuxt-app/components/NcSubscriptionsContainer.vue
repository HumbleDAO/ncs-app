<template>
    <div></div>
</template>

<script setup lang="ts">
import { useConnect, useAccount, useNetwork, erc20ABI } from 'vagmi'
import { InjectedConnector } from 'vagmi/connectors/injected'
import { BigNumber, ethers, utils } from 'ethers'

const emit = defineEmits(['toggleDrawer'])
const { address } = useAccount()
const runtimeConfig = useRuntimeConfig()

const { connect, isConnected, activeConnector } = useConnect({
    connector: new InjectedConnector(),
    onError: (error) => {
        console.log('ERROR CONNECTING: ', error)
    },
    onConnect: async (data) => {
        console.log('CONNECTED: ', data)
        const { loadContracts, contracts } = useContractsStore()

        await loadContracts()
        console.log('LOADED_CONTRACTS: ', contracts)
        useAccountStore().$patch({ address: data.account })
        useNetworkDetailsStore().$patch({
            selectedChainId: data.chain.id,
            network: data.network,
        })
    },
})

const allowance = ref<BigNumber>(BigNumber.from(0))
const allowanceInEthers = ref()

let usdcContract = ref<ethers.Contract>()
let contracts = ref({} as any)
let subscriptions = ref([] as any)
let subscriptionsByUsers = ref([] as any)

watch(
    () => allowance.value,
    (newAllowance) => {
        allowanceInEthers.value = utils.formatEther(newAllowance)
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

    const signer = await activeConnector.value.getSigner()

    usdcContract.value = new ethers.Contract(
        runtimeConfig.public.supportedChainsMetadata[chain.value?.id]?.usdcTokenAddress,
        erc20ABI,
        signer
    )

    const { NCSubscriptionFactory } = contracts.value

    allowance.value = await usdcContract.value.allowance(address.value, NCSubscriptionFactory.address)
}

const getSubscriptions = async () => {
    const { NCSubscriptionFactory } = contracts.value
    subscriptions.value = await NCSubscriptionFactory.subscriptions()
}

const getSubscriptionsByUser = async (address) => {
    const { NCSubscriptionFactory } = contracts.value
    subscriptionsByUsers.value = await NCSubscriptionFactory.getSubscriptionsCreatedByOwner(address)
}

function toggleDrawer() {
    emit('toggleDrawer')
}

function connectWallet() {
    if (!isConnected.value) {
        connect.value()
    }
}
</script>

<style lang="scss" scoped></style>
