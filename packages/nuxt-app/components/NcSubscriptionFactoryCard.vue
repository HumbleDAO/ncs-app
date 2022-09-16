<template>
    <nc-card title="Create Subscription" description="">
        <template #icon>
            <div class="avatar self-center" name="icon">
                <div class="w-24 rounded">
                    <img src="@/assets/handshake.png" />
                </div>
            </div>
        </template>

        <template #default>
            <nc-input v-model="eventName" type="text" placeholder="service..." />

            <div class="flex flex-col my-2">
                <label for="nc-input-stake-amount" class="text-sm self-start"
                    >Staked Amount Required to Subscribe</label
                >
                <nc-input v-model="stakeAmount" type="number" placeholder="0..." />
            </div>

            <div class="flex justify-between border-opacity-50">
                <div class="w-2/4 flex flex-col justify-center">
                    <label for="select-tokens" class="text-sm">Select stake token</label>

                    <div class="flex self-center mt-2">
                        <usdcCoinSvg class="w-8 h-8 cursor-pointer" @click.prevent="createSubscription()" />
                    </div>
                </div>

                <div class="divide-y-1a text-6xl h-full">&verbar;</div>

                <div class="w-2/4 flex items-center justify-center">
                    <!-- TODO: Ensure apy is fetched for -->
                    <label for="apy">{{ apy }} APY %</label>
                </div>
            </div>
        </template>
    </nc-card>
</template>

<script setup lang="ts">
import { erc20ABI, useNetwork, useAccount, useConnect } from 'vagmi'
import NCSubscriptionABI from '../contracts/ABI/NCSubscription.json'
import { ethers, BigNumber, utils } from 'ethers'
import usdcCoinSvg from '@/assets/usdc-icon.svg?component'

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

    if (BigNumber.isBigNumber(checkAllowance) && allowanceInEthers.value < stakeAmount.value) {
        await usdcContract.value.approve(NCSubscriptionFactory.address, utils.parseEther(String(stakeAmount.value)))
    }
}

const checkAllowanceAndApproveSubscription = async (subAddress) => {
    const signer = await activeConnector.value.getSigner()
    const subscription = new ethers.Contract(subAddress, NCSubscriptionABI, signer)
    const checkAllowance = await usdcContract.value.allowance(subAddress, address.value)

    if (BigNumber.isBigNumber(checkAllowance) && allowanceInEthers.value < stakeAmount.value) {
        await usdcContract.value.approve(subAddress, utils.parseEther(String(100000000)))
    }
}

const createSubscription = async () => {
    checkAllowanceAndApproveNCSubscriptionFactory()
    const { NCSubscriptionFactory } = contracts.value

    const checkAllowance = await usdcContract.value.allowance(NCSubscriptionFactory.address, address.value)

    if (BigNumber.isBigNumber(checkAllowance) && allowanceInEthers.value < stakeAmount.value) {
        await usdcContract.value.approve(NCSubscriptionFactory.address, utils.parseEther(String(stakeAmount.value)))
    }
    NCSubscriptionFactory.createSubscription(
        eventName.value,
        utils.parseEther(String(stakeAmount.value)),
        '0x2058a9d7613eee744279e3856ef0eada5fcbaa7e',
        '0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9',
        '0xd41aE58e803Edf4304334acCE4DC4Ec34a63C644'
    )
}

const getSubscriptions = async () => {
    const { NCSubscriptionFactory } = contracts.value
    const subscriptions = await NCSubscriptionFactory.subscriptions()
    return subscriptions
    console.log('SUBSCRIPTIONS: ', subscriptions)
}

const getSubscriptionsByUser = async (address) => {
    const { NCSubscriptionFactory } = contracts.value
    const subscriptions = await NCSubscriptionFactory.getSubscriptionsCreatedByOwner(address)
    return subscriptions
    console.log('SUBSCRIPTIONS BY USER: ', subscriptions)
}

const subscribe = async (subAddress) => {
    const signer = await activeConnector.value.getSigner()
    const subscription = new ethers.Contract(subAddress, NCSubscriptionABI, signer)
    checkAllowanceAndApproveSubscription(subAddress)
    subscription.subscribe()
}

const unsubscribe = async (subAddress) => {
    const signer = await activeConnector.value.getSigner()
    const subscription = new ethers.Contract(subAddress, NCSubscriptionABI, signer)
    subscription.unsubscribe()
}

watch(
    () => allowance.value,
    (newAllowance) => {
        allowanceInEthers.value = utils.formatEther(newAllowance)
    }
)
</script>

<style lang="scss" scoped></style>
