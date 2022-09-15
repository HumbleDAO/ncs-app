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
import { erc20ABI, useNetwork, useAccount, useSigner, useConnect } from 'vagmi'
import { ethers, BigNumber, utils } from 'ethers'

const { data: contracts } = await useAsyncData('contracts', async () => await useContractsStore().loadContracts())

// https://vuejs.org/guide/reusability/composables.html
const runtimeConfig = useRuntimeConfig()
const { address, isConnected } = useAccount()
const { chain } = useNetwork()
const { activeConnector } = useConnect()

// https://vuejs.org/guide/introduction.html#composition-api
const eventName = ref('')
const stakeAmount = ref(0)
const apy = ref(0)
const allowance = ref<BigNumber>(BigNumber.from(0))
const allowanceInEthers = ref()

let usdcContract = ref<ethers.Contract>()

// https://vuejs.org/guide/essentials/lifecycle.html#registering-lifecycle-hooks
onMounted(async () => {
    if (isConnected) {
        const signer = await activeConnector.value.getSigner()
        console.log('SIGNER: ', signer)
        usdcContract.value = new ethers.Contract(
            runtimeConfig.public.supportedChainsMetadata[chain.value?.id]?.usdcTokenAddress,
            erc20ABI,
            signer
        )

        const { NCSubscriptionFactory } = contracts.value
        allowance.value = await usdcContract.value.allowance(address.value, NCSubscriptionFactory.address)
    }
})

const checkAllowanceAndApproveNCSubscriptionFactory = async () => {
    const { NCSubscriptionFactory } = contracts.value

    const checkAllowance = await usdcContract.value.allowance(NCSubscriptionFactory.address, address.value)

    if (BigNumber.isBigNumber(checkAllowance) && stakeAmount.value > 0) {
        if (allowanceInEthers.value < stakeAmount.value) {
            await usdcContract.value.approve(NCSubscriptionFactory.address, utils.parseEther(String(stakeAmount.value)))
        }
    }
}

watch(
    () => allowance.value,
    (newAllowance) => {
        allowanceInEthers.value = utils.formatEther(newAllowance)
    }
)
</script>

<style lang="scss" scoped></style>
