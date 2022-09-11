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
            <div v-if="contractsAddresses">
                <div
                    v-for="contract in contractsAddresses"
                    :key="contract.name + contract.address"
                    class="flex flex-col"
                >
                    <div for="contract-address">{{ contract.address }}</div>
                    <div for="name" class="heading">
                        {{ contract.name }}
                    </div>
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
const nuxtApp = useNuxtApp()
console.log('NUXT_APP: ', nuxtApp)

const { loadContracts } = useContractsStore()

const { data: contracts } = useAsyncData('contracts', async () => await loadContracts())

const { connect } = useConnect({
    connector: new InjectedConnector(),
    onError: (error) => {
        console.log('ERROR CONNECTING: ', error)
    },
    onConnect: async (data) => {
        console.log('CONNECTED: ', data)
        await loadContracts()
        useAccountStore().$patch({ address: data.account })
        useNetworkDetailsStore().$patch({
            selectedChainId: data.chain.id,
            network: data.network,
        })
    },
})

const { disconnect } = useDisconnect()

const { address } = useAccount()

const { data: ensName } = useEnsName({
    address: address,
})

const { data } = useBalance({
    addressOrName: computed(() => address),
})

const { chain, chains } = useNetwork()
const { error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork({
    chainId: 80001,
    onSuccess: async (data: { id: number; network: string }) => {
        await loadContracts()
        useNetworkDetailsStore().$patch((state: INetworkDetails) => {
            state.selectedChainId = data.id
            state.network = data.network
        })
    },
})

const contractsAddresses = computed(() => {
    if (!contracts.value) return []

    return Object.keys(contracts.value).map((key: string) => ({
        name: key,
        address: contracts.value[key].address,
    }))
})
</script>
