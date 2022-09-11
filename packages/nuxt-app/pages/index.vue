<template>
    <div class="flex h-screen" :data-theme="colorMode.preference">
        <hero>
            <h1 class="text-5xl font-bold">My App Name</h1>
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
            <div v-if="contractsAddresses && contractsAddresses.length">
                <div v-for="contract in contractsAddresses" :key="contract.name" class="flex flex-col">
                    <label for="contract-name">
                        {{ contract.name }}
                    </label>
                    <label for="contract-address">{{ contract.address }}</label>
                </div>
            </div>
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

const colorMode = useColorMode()

const { loadContracts } = useContractsStore()

const { connect } = useConnect({
    connector: new InjectedConnector(),
})

const { disconnect } = useDisconnect()

const { address } = useAccount()

const { data: ensName } = useEnsName({
    address: computed(() => address ?? address),
})

const { data } = useBalance({
    addressOrName: computed(() => address),
})

const { chain } = useNetwork()
const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork({
    chainId: 80001,
    onSuccess: async (data) => {
        // const loadedContracts = await loadContracts()
        // console.log('LOADED_CONTRACTS_ON_CURRENT_CHAIN: \n', loadedContracts.value.NCSubscriptionFactory.address)
        await loadContracts()
        useNetworkDetailsStore().$patch((state: INetworkDetails) => {
            state.selectedChainId = data.id
            state.network = data.network
        })
    },
})

useNetworkDetailsStore().$patch((state: INetworkDetails) => {
    state.network = chain.value?.name
    state.selectedChainId = chain.value?.id
    state.availableChains = chains.value
})

// console.log('INIT_LOADED CONTRACTS', loadedContracts)
// const { NCSubscriptionFactory } = loadedContracts.value
// console.log('NCSubscriptionFactory', NCSubscriptionFactory.address)

const contractsAddresses = computed(async () => {
    const loadedContracts = await loadContracts()

    if (!loadedContracts) return []

    return Object.keys(loadedContracts.value).map((key) => ({
        name: key,
        address: loadedContracts.value[key].address,
    }))
})
</script>
