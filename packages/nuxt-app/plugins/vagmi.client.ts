import { configureChains, createClient, defaultChains, chain, VagmiPlugin } from 'vagmi'
import { publicProvider } from 'vagmi/providers/public'
import { infuraProvider } from 'vagmi/providers/infura'
import { alchemyProvider } from 'vagmi/providers/alchemy'
import { MetaMaskConnector } from 'vagmi/connectors/metaMask'
import { WalletConnectConnector } from 'vagmi/connectors/walletConnect'
import { InjectedConnector } from 'vagmi/connectors/injected'

export default defineNuxtPlugin((nuxtApp) => {
    const { chains, provider, webSocketProvider } = configureChains(
        [
            // chain.polygon,

            chain.polygonMumbai,
            chain.hardhat,
            chain.localhost,
        ],
        [
            alchemyProvider({
                alchemyId: useRuntimeConfig().alchemy.apiKey,
                priority: 0,
                stallTimeout: 1000,
                weight: 1,
            }),
            infuraProvider({ priority: 2, stallTimeout: 1000, weight: 2 }),
            publicProvider({ priority: 1, stallTimeout: 1000, weight: 3 }),
        ]
    )

    const client = createClient({
        autoConnect: true,
        connectors: [
            new MetaMaskConnector({ chains }),
            new WalletConnectConnector({
                chains,
                options: {
                    qrcode: true,
                },
            }),
            new InjectedConnector({
                chains,
                options: {
                    name: 'Injected',
                    shimDisconnect: true,
                },
            }),
        ],
        provider,
        webSocketProvider,
    })

    const vagmi = VagmiPlugin(client)

    nuxtApp.vueApp.use(vagmi)

    return {
        provide: {
            vagmi,
        },
    }
})
