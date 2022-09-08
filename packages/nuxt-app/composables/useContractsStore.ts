// import { Ref } from 'nuxt/dist/app/compat/vue-demi'
import { ethers } from 'ethers'
import { groupBy } from 'lodash'
import { useNetwork } from 'vagmi'
import { loadAppContracts } from '@/helpers/loadAppContracts'
import { useNetworkDetailsStore, INetworkDetails } from './useNetworkDetailsStore'

export const useContractsStore = defineStore('contracts', () => {
    const networkDetailsStore = useNetworkDetailsStore()
    const contracts = ref([] as IContract[])

    async function loadContracts() {
        const { deployedContracts } = await loadAppContracts()
        const deployedChains = []
        let _contracts = []

        Object.keys(deployedContracts).forEach((CHAIN_ID) => {
            deployedChains.push(parseInt(CHAIN_ID))

            // deployed contracts per chain

            Object.keys(deployedContracts[CHAIN_ID]).forEach((DEPLOYED_NETWORK) => {
                // contracts deployed to network

                Object.keys(deployedContracts[CHAIN_ID][DEPLOYED_NETWORK].contracts).forEach((CONTRACT_NAME) => {
                    // contract

                    const contractAddressAndAbi = deployedContracts[CHAIN_ID][DEPLOYED_NETWORK].contracts[CONTRACT_NAME]
                    console.log('CONTRACT_ADDRESS_AND_ABI: ', contractAddressAndAbi)
                    _contracts.push({
                        // ...contractAddressAndAbi,
                        abi: contractAddressAndAbi.abi,
                        chainId: CHAIN_ID,
                        name: CONTRACT_NAME,
                        network: DEPLOYED_NETWORK,
                        instance: new ethers.Contract(
                            CONTRACT_NAME,
                            contractAddressAndAbi.abi,
                            ethers.getDefaultProvider()
                        ),
                    })
                })
            })
        })

        _contracts = groupBy(_contracts, 'chainId')

        networkDetailsStore.$patch((state: INetworkDetails) => {
            state.deployedChains = deployedChains
        })

        contracts.value = _contracts[useNetwork().chain.value?.id]
        console.log('CONTRACTS: ', contracts.value)
        return contracts.value

        // should we return all available contracts or just the ones for the current chain?
        // return _contracts
    }

    return { loadContracts, contracts: computed(() => contracts.value) }
})

export interface IContract {
    abi?: object
    chainId?: string
    name?: string
    network?: string
    instance: ethers.Contract
}
