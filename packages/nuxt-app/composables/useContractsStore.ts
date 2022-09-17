// import { Ref } from 'nuxt/dist/app/compat/vue-demi'
import { ethers } from 'ethers'
import { groupBy } from 'lodash'

import { loadAppContracts } from '@/helpers/loadAppContracts'

import { useNetworkDetailsStore, INetworkDetails } from './useNetworkDetailsStore'

export interface IContract {
    [key: string]: ethers.Contract
}

export type TSubscription = {
    address: string
    eventName: string
    poolSize: ethers.BigNumber
    token: string
    underlyingToken: string
    nftAddress: string
    nft: ethers.Contract
    aaveLendingPoolAddressesProvider: string
}

export interface ISubscription {
    address: string
    eventName: string
    poolSize: ethers.BigNumber
    token: string
    underlyingToken: string
    nftAddress: string
    nft: ethers.Contract
    aaveLendingPoolAddressesProvider: string
}
export class Subscription {
    public address: string
    public eventName: string
    public poolSize: ethers.BigNumber
    public token: string
    public underlyingToken: string
    public nftAddress: string
    public nft: ethers.Contract
    public aaveLendingPoolAddressesProvider: string

    constructor(subscription: TSubscription) {
        Object.assign(this, subscription)
    }
}

export const useContractsStore = defineStore('contractsStore', () => {
    const runtimeConfig = useRuntimeConfig()
    const networkDetailsStore = useNetworkDetailsStore()
    const contracts = ref({} as any)

    const provider = ethers.getDefaultProvider(runtimeConfig.alchemy.https, {
        alchemy: runtimeConfig.alchemy.apiKey,
    })

    const quicknodeProvider = ethers.getDefaultProvider(runtimeConfig.quicknode.https)

    console.log('QUICKNODE PROVIDER', quicknodeProvider)

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
                            signer ?? quicknodeProvider
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
