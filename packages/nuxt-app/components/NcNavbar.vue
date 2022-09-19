<template>
    <div class="navbar bg-base-100 fixed">
        <div class="navbar-start">
            <label class="btn btn-square btn-ghost drawer-button" for="main-drawer" @click.stop="toggleDrawer">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="inline-block w-5 h-5 stroke-current"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                </svg>
            </label>
            <a class="btn btn-ghost normal-case text-xl">No-Cost Subscription</a>
        </div>
        <div class="navbar-center"></div>
        <div class="navbar-end">
            <div v-if="isConnected" class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost text-lg font-normal normal-case">
                    <div>{{ isLoading && pendingChainId === chain.id ? ' (switching)' : chain.name }}</div>
                </label>
                <ul
                    v-if="isConnected"
                    tabindex="0"
                    class="my-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box"
                >
                    <li
                        v-for="_chain in chains"
                        :key="_chain.id"
                        class="btn rounded-none"
                        @click="switchNetwork(_chain.id)"
                    >
                        {{ _chain.name }}
                    </li>
                </ul>
            </div>

            <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost text-lg font-normal normal-case">
                    <div v-if="!isConnected" @click="connectWallet()">Connect</div>
                    <div v-else @click="connectWallet()">{{ ensName ?? address }}</div>
                </label>
                <ul
                    v-if="isConnected"
                    tabindex="0"
                    class="my-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-26"
                >
                    <li class="btn rounded-none" @click="disconnect()">Disconnect</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useConnect, useDisconnect, useAccount, useEnsName, useSwitchNetwork, useNetwork, erc20ABI } from 'vagmi'
import { InjectedConnector } from 'vagmi/connectors/injected'
import { INetworkDetails } from '@/composables/useNetworkDetailsStore'
import { BigNumber, ethers, utils } from 'ethers'

const emit = defineEmits(['toggleDrawer'])

const { address } = useAccount()
const { chain, chains } = useNetwork()
const runtimeConfig = useRuntimeConfig()

const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork({
    chainId: 80001,
    onSuccess: async (data: { id: number; network: string }) => {
        const { loadContracts } = useContractsStore()

        await loadContracts()
        useNetworkDetailsStore().$patch((state: INetworkDetails) => {
            state.selectedChainId = data.id
            state.network = data.network
        })
    },
})

const { disconnect } = useDisconnect({
    onSuccess: () => {
        useRouter().go(0)
    },
})
const { connect, isConnected, activeConnector } = useConnect({
    connector: new InjectedConnector({ chains: chains.value }),
    onError: (error) => {
        console.log('ERROR CONNECTING: ', error)
    },
    onConnect: async (data) => {
        await useContractsStore().loadContracts()
        useAccountStore().$patch({ address: data.account })
        useNetworkDetailsStore().$patch({
            selectedChainId: data.chain.id,
            network: data.network,
        })
    },
})

const { data: ensName } = useEnsName({
    address: address,
})

const allowance = ref<BigNumber>(BigNumber.from(0))
const allowanceInEthers = ref()

let usdcContract = ref<ethers.Contract>()
let contracts = ref({} as any)

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

function toggleDrawer() {
    emit('toggleDrawer')
}

function connectWallet() {
    if (!isConnected.value) {
        connect.value()
    }
}
</script>

<style scoped></style>
