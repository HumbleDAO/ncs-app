// import { Ref } from 'nuxt/dist/app/compat/vue-demi'
import { ethers } from 'ethers'
import { groupBy } from 'lodash'

import { loadAppContracts } from '@/helpers/loadAppContracts'

import { useNetworkDetailsStore, INetworkDetails } from './useNetworkDetailsStore'

export const useContractsStore = defineStore('contractsStore', () => {
    const runtimeConfig = useRuntimeConfig()
    const networkDetailsStore = useNetworkDetailsStore()
    const contracts = ref({} as any)

    const provider = ethers.getDefaultProvider(runtimeConfig.alchemy.https, {
        alchemy: runtimeConfig.alchemy.apiKey,
    })

    async function loadContracts(signer?: ethers.Signer) {
        const { deployedContracts } = await loadAppContracts()
        const preparedContracts = []
        const deployedChains = []

        Object.keys(deployedContracts).forEach((CHAIN_ID) => {
            deployedChains.push(parseInt(CHAIN_ID))

            // deployed contracts per chain

            Object.keys(deployedContracts[CHAIN_ID]).forEach((DEPLOYED_NETWORK) => {
                // contracts deployed to network

                Object.keys(deployedContracts[CHAIN_ID][DEPLOYED_NETWORK].contracts).forEach((CONTRACT_NAME) => {
                    // contract

                    const contractAddressAndAbi = deployedContracts[CHAIN_ID][DEPLOYED_NETWORK].contracts[CONTRACT_NAME]
                    // console.log('CONTRACT_ADDRESS_AND_ABI: ', contractAddressAndAbi)
                    preparedContracts.push({
                        // ...contractAddressAndAbi,
                        chainId: CHAIN_ID,
                        name: CONTRACT_NAME,
                        instance: new ethers.Contract(
                            contractAddressAndAbi.address,
                            contractAddressAndAbi.abi,
                            signer ?? provider
                        ),
                    })
                })
            })
        })

        networkDetailsStore.$patch((state: INetworkDetails) => {
            state.deployedChains = deployedChains
        })

        const target = {}
        const allContractsGroupedByChainId = groupBy(preparedContracts, 'chainId')
        const { chainId } = await provider.getNetwork()

        allContractsGroupedByChainId[chainId].forEach(({ name, instance }) => {
            target[name] = instance
        })

        contracts.value = target

        return contracts.value
    }

    return { loadContracts, contracts: computed(() => contracts.value), provider }
})

export interface IContract {
    [key: string]: ethers.Contract
}
