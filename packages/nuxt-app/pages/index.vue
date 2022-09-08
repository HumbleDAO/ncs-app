<template>
    <div class="flex h-screen" :data-theme="colorMode.preference">
        <hero>
            <h1 class="text-5xl font-bold">No-Cost Subscription</h1>
            <p class="py-6"></p>
            <br />

            <label for="main-drawer" class="btn btn-primary drawer-button rounded-none">Open drawer</label>
            <button class="btn btn-primary rounded-none" @click="connect">Connect</button>
            <button class="btn btn-primary rounded-none" @click="disconnect">Disconnect</button>

            <br />
            <br />

            <div v-if="ensName">Connected as {{ ensName }}</div>
            <div v-if="address">{{ address }}</div>

            <br />
            <label>Balance</label>
            <div>{{ data?.symbol }} {{ data?.formatted }}</div>
            <br />
            <div v-if="chain">Connected to {{ chain.name }}</div>
            <br />
            <button v-for="x in chains" :key="x.id" class="btn mx-1 rounded-none" @click="switchNetwork(x.id)">
                {{ x.name }}
                {{ isLoading && pendingChainId === x.id ? ' (switching)' : '' }}
            </button>
            <div v-if="error">
                {{ error.message }}
            </div>
        </hero>
    </div>
</template>

<script setup lang="ts">
import { useAccount, useBalance, useConnect, useEnsName, useDisconnect, useNetwork, useSwitchNetwork } from 'vagmi'
import { InjectedConnector } from 'vagmi/connectors/injected'

import { INetworkDetails } from '@/composables/useNetworkDetailsStore'

const { address } = useAccount()

const { data: ensName } = useEnsName({
    address: computed(() => address ?? address),
})

const { data } = useBalance({
    addressOrName: computed(() => address),
})

const { connect } = useConnect({
    connector: new InjectedConnector(),
})
const { disconnect } = useDisconnect()

const { chain } = useNetwork()
const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()

useNetworkDetailsStore().$patch((state: INetworkDetails) => {
    state.network = chain.value?.name
    state.selectedChainId = chain.value?.id
    state.availableChains = chains.value
})

const { loadContracts, contracts } = useContractsStore()
await loadContracts()
console.log('ALL_CONTRACTS: ', contracts)

const colorMode = useColorMode()
</script>
