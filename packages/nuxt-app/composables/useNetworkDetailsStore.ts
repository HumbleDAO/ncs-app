import { Ref } from 'nuxt/dist/app/compat/vue-demi'
import { Chain } from 'vagmi'

export const useNetworkDetailsStore = defineStore('networkDetails', () => {
    const networkDetails: Ref<INetworkDetails> = ref({} as INetworkDetails)

    return {
        networkDetails: computed(() => networkDetails.value),
    }
})

export interface INetworkDetails {
    network: string
    selectedChainId: number
    availableChains: Chain[]
    deployedChains: number[]
}
