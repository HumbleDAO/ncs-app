<template>
    <div class="flex h-screen" :data-theme="colorMode.preference">
        <nc-hero class="flex flex-col items-center justify-center">
            <div v-if="contractsAddresses">
                <div
                    v-for="contract in contractsAddresses"
                    :key="contract.name + contract.address"
                    class="flex flex-col"
                >
                    <div for="name" class="heading">
                        {{ contract.name }}
                    </div>
                    <div for="contract-address">{{ contract.address }}</div>
                </div>
            </div>

            <div class="my-5 flex flex-col items-center">
                <nc-subscription-factory-card />
            </div>
        </nc-hero>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    colorMode: 'luxury',
})

const colorMode = useColorMode()

const { loadContracts } = useContractsStore()
const { data: contracts } = useAsyncData('contracts', async () => await loadContracts())

const contractsAddresses = computed(() => {
    if (!contracts.value) return []

    return Object.keys(contracts.value).map((key: string) => ({
        name: key,
        address: contracts.value[key].address,
    }))
})
</script>
