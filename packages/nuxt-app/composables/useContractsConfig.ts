import { ethers } from 'ethers'
import { groupBy } from 'lodash'
import { loadAppContracts } from '@/helpers/loadAppContracts'

export const userContractsConfig = defineStore('contractsConfig', () => {
    async function loadContracts() {
        const { deployedContracts } = await loadAppContracts()
        console.log('CONTRACTS_DEPLOYED: ', deployedContracts)
        let contracts = []
        Object.keys(deployedContracts).forEach((CHAIN_ID) => {
            console.log('CHAIN_ID: ', CHAIN_ID)
            Object.keys(deployedContracts[CHAIN_ID]).forEach((DEPLOYED_NETWORK) => {
                // console.log('DEPLOYED_NETWORK: ', DEPLOYED_NETWORK)
                // console.log('CONTRACT_ADDRESS: ', deployedContracts[CHAIN_ID][DEPLOYED_NETWORK])
                // console.log('CONTRACTS: ', deployedContracts[CHAIN_ID][DEPLOYED_NETWORK].contracts)
                Object.keys(deployedContracts[CHAIN_ID][DEPLOYED_NETWORK].contracts).forEach((contract) => {
                    // console.log('CONTRACT?: ', deployedContracts[CHAIN_ID][DEPLOYED_NETWORK].contracts[contract])
                    const contractAddressAndAbi = deployedContracts[CHAIN_ID][DEPLOYED_NETWORK].contracts[contract]
                    contracts.push({
                        ...contractAddressAndAbi,
                        network: DEPLOYED_NETWORK,
                        chainId: CHAIN_ID,
                        name: contract,
                        instance: new ethers.Contract(contract, contractAddressAndAbi.abi, ethers.getDefaultProvider()),
                    })
                })
            })
        })

        contracts = groupBy(contracts, 'network')

        console.log('PREPARED_CONTRACTS: ', contracts)
        return contracts
    }

    return { loadContracts }
})
