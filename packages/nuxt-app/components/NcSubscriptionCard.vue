<template>
    <reference types="vite-svg-loader" />
    <nc-card title="Create Subscription" description="">
        <div>
            <nc-input v-model="eventName" class="my-2" type="text" placeholder="service..." />

            <label class="my-2" for="nc-input-stake-amount">Staked Amount Required to Subscribe</label>
            <nc-input v-model="stakeAmount" class="my-2" type="number" placeholder="0..." />

            <div class="flex my-2 justify-between">
                <div class="w-3/4 flex flex-col justify-center">
                    <label for="select-tokens">Select stake token</label>
                    <!-- TODO: Implement token selection -->
                    <button
                        class="btn btn-circle btn-primary m-1 self-center"
                        @click="checkAllowanceAndApproveNCSubscriptionFactory()"
                    >
                        USDC
                    </button>
                </div>
                <div class="text-xl">&vert;</div>
                <div class="w-auto">
                    <label for="apy">{{ apy }} APY %</label>
                    <!-- TODO: allow setting of APY from an action we dispatch (when interfacing with contract) -->
                </div>
            </div>
        </div>
    </nc-card>
</template>

<script setup lang="ts">
import { erc20ABI, useNetwork, useAccount } from 'vagmi'
import { ethers, BigNumber } from 'ethers'

const { data: contracts } = await useAsyncData('contracts', async () => await useContractsStore().loadContracts())

// https://vuejs.org/guide/reusability/composables.html
const runtimeConfig = useRuntimeConfig()
const { address, isConnected } = useAccount()
const { chain } = useNetwork()

// https://vuejs.org/guide/introduction.html#composition-api
const eventName = ref('')
const stakeAmount = ref(null)
const apy = ref(0)
let aUsdcContract = ref<ethers.Contract>()

// https://vuejs.org/guide/essentials/lifecycle.html#registering-lifecycle-hooks
onMounted(async () => {
    if (isConnected) {
        aUsdcContract.value = new ethers.Contract(
            runtimeConfig.public.supportedChainsMetadata[chain.value?.id]?.aUsdcTokenAddress,
            erc20ABI,
            ethers.getDefaultProvider(runtimeConfig.alchemy.https, {
                alchemy: runtimeConfig.alchemy.apiKey,
            })
        )

        const { NCSubscriptionFactory } = contracts.value
        console.log('NCSubscriptionFactory: ', NCSubscriptionFactory)
        const allowance = await aUsdcContract.value.allowance(address.value, NCSubscriptionFactory.address)
        console.log('allowance: ', allowance)
        console.log('USDC_CONTRACT: ', aUsdcContract)
        console.log('TOTAL_SUPPLY: ', BigNumber.from(await aUsdcContract.value.totalSupply()).toString())
    }
})

const checkAllowanceAndApproveNCSubscriptionFactory = async () => {
    const { NCSubscriptionFactory } = contracts.value

    console.log('CHAIN_ID: ', chain.value.id)
    console.log('USDC_CONTRACT: ', runtimeConfig.public.supportedChainsMetadata[chain.value.id].aUsdcTokenAddress)
    console.log('ADDRESS_VALUE: ', address.value)
    console.log('NCSubscriptionFactory: ', NCSubscriptionFactory.address)
    const checkAllowance = await aUsdcContract.value.allowance(NCSubscriptionFactory.address, address.value)

    // TODO: Implement allowance check and approval

    if (BigNumber.isBigNumber(checkAllowance)) {
        console.log('CHECK_ALLOWANCE', BigNumber.from(checkAllowance).toNumber())
    }
}
</script>

<style lang="scss" scoped></style>
