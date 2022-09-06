<template>
    <div class="flex h-screen" :data-theme="colorMode.preference">
        <hero>
            <h1 class="text-5xl font-bold">No-Cost Subscription</h1>
            <p class="py-6"></p>
            <label for="main-drawer" class="btn btn-primary drawer-button rounded-none">Open drawer</label>

            <button class="btn btn-primary rounded-none" @click="connect">Connect</button>
            <button class="btn btn-primary rounded-none" @click="disconnect">Disconnect</button>

            <br />

            <div v-if="ensName">Connected as {{ ensName }}</div>
            <div v-if="address">{{ address }}</div>

            <br />
            <label>Balance</label>
            <div>{{ data?.symbol }} {{ data?.formatted }}</div>
        </hero>
    </div>
</template>

<script setup lang="ts">
import { useAccount, useBalance, useConnect, useEnsName, useDisconnect, useNetwork } from 'vagmi'
import { InjectedConnector } from 'vagmi/connectors/injected'

const { address } = useAccount()

const { data: ensName } = useEnsName({
    address: computed(() => address ?? address),
})

const { data } = useBalance({
    addressOrName: computed(() => ensName ?? address),
})

const { connect } = useConnect({
    connector: new InjectedConnector(),
})

const { disconnect } = useDisconnect()

const { loadContracts } = userContractsConfig()
console.log('ALL_CONTRACTS: ', await loadContracts())

// const { chain, chains } = useNetwork()

// console.log('CHAIN: ', chain)

// console.log('CHAINS: ', chains)

const colorMode = useColorMode()
</script>
