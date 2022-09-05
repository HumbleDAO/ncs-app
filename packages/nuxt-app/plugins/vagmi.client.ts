import { configureChains, createClient, defaultChains, chain, VagmiPlugin } from 'vagmi'
import { publicProvider } from 'vagmi/providers/public'

export default defineNuxtPlugin((nuxtApp) => {
    const { chains, provider, webSocketProvider } = configureChains([chain.mainnet, chain.polygon], [publicProvider()])
    const client = createClient({
        autoConnect: true,
        provider,
        webSocketProvider,
    })

    const plugin = VagmiPlugin(client)
    nuxtApp.vueApp.use(plugin)
    nuxtApp.vueApp.provide(Symbol('vagmi', plugin))

    // return {
    //     provide: {
    //         vagmi: () => plugin,
    //     },
    // }
})
