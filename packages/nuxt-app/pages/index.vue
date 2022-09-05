<template>
    <div class="flex h-screen" :data-theme="colorMode.preference">
        <hero>
            <h1 class="text-5xl font-bold">My App</h1>
            <p class="py-6"></p>
            <label for="main-drawer" class="btn btn-primary drawer-button rounded-none">Open drawer</label>

            <button class="btn btn-primary rounded-none" @click="connect">Connect</button>
            <div v-if="account">Connected to {{ ensName ?? account.address }}</div>
            <button @click="disconnect">Disconnect</button>
        </hero>
    </div>
</template>

<script setup>
import { computed } from 'vue'

import { useAccount, useConnect, useEnsName, useDisconnect } from 'vagmi'
import { InjectedConnector } from 'vagmi/connectors/injected'
const { data: account } = useAccount()
const { data: ensName } = useEnsName({
    address: computed(() => account?.value?.address),
})
const { connect } = useConnect({
    connector: new InjectedConnector(),
})

const { disconnect } = useDisconnect({
    connector: new InjectedConnector(),
})
const colorMode = useColorMode()
</script>
