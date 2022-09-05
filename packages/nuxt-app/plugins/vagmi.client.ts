import { configureChains, createClient, defaultChains, chain, VagmiPlugin } from 'vagmi'
import { publicProvider } from 'vagmi/providers/public'
import { infuraProvider } from 'vagmi/providers/infura'
import { MetaMaskConnector } from 'vagmi/connectors/metaMask'
import { WalletConnectConnector } from 'vagmi/connectors/walletConnect'
import { InjectedConnector } from 'vagmi/connectors/injected'

export default defineNuxtPlugin((nuxtApp) => {
    const { chains, provider, webSocketProvider } = configureChains([chain.mainnet, chain.polygon], [publicProvider()])

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
