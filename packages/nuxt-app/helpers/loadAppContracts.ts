const contractListPromise = import('@/contracts/hardhat_contracts.json')
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const externalContractsPromise = import('@/contracts/external_contracts')

export const loadAppContracts = async () => {
    const config = {
        deployedContracts: {},
        externalContracts: {},
    }
    config.deployedContracts = (await contractListPromise).default ?? {}
    config.externalContracts = (await externalContractsPromise).default ?? {}
    console.log('CONFIG_LOAD_CONTRACTS', config)
    return config
}
