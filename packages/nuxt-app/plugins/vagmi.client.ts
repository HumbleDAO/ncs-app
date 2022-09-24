import { configureChains, createClient, chain, VagmiPlugin } from 'vagmi'
import { publicProvider } from 'vagmi/providers/public'
import { infuraProvider } from 'vagmi/providers/infura'
import { alchemyProvider } from 'vagmi/providers/alchemy'
import { jsonRpcProvider } from 'vagmi/providers/jsonRpc'
import { MetaMaskConnector } from 'vagmi/connectors/metaMask'
import { WalletConnectConnector } from 'vagmi/connectors/walletConnect'
import { InjectedConnector } from 'vagmi/connectors/injected'

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig()
    const configuredChains =
        process.env.NODE_ENV === 'production'
            ? [chain.polygonMumbai]
            : [
                  // chain.polygon,
                  chain.polygonMumbai,
                  chain.hardhat,
              ]

    const { chains, provider, webSocketProvider } = configureChains(configuredChains, [
        jsonRpcProvider({
            rpc: (chain) => {
                if (!Object.keys(runtimeConfig.public.supportedChainsMetadata).includes(chain.id.toString())) {
                    return null
                }
                return {
                    http: runtimeConfig.public.quicknode.https,
                    webSocket: runtimeConfig.public.quicknode.websocket,
                }
            },
            priority: 1,
            stallTimeout: 1000,
            weight: 1,
        }),
        alchemyProvider({
            alchemyId: runtimeConfig.alchemy.apiKey,
            priority: 2,
            stallTimeout: 1000,
            weight: 2,
        }),
        infuraProvider({ priority: 3, stallTimeout: 1000, weight: 3 }),
        publicProvider({ priority: 4, stallTimeout: 1000, weight: 4 }),
    ])

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
