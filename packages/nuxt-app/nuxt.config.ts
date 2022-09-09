import { defineNuxtConfig } from 'nuxt'
import eslintPlugin from 'vite-plugin-eslint'

const SUPPORTED_CHAINS = {
    31337: {
        network: 'Hardhat',
        chainId: 31337,
    },
    80001: {
        network: 'Mumbai',
        chainId: 80001,
        apiKey: process.env.MUMBAI_ALCHEMY_API_KEY,
        https: process.env.MUMBAI_ALCHEMY_HTTPS,
        websocket: process.env.MUMBAI_ALCHEMY_WEBSOCKET,
    },
}

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    alias: {
        contracts: '/<rootDir>/contracts',
        helpers: '/<rootDir>/helpers',
    },

    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@vueuse/nuxt',
        [
            '@pinia/nuxt',
            {
                autoImports: [
                    // automatically imports `usePinia()`
                    'defineStore',
                    // automatically imports `usePinia()` as `usePiniaStore()`
                    ['defineStore', 'definePiniaStore'],
                ],
            },
        ],
    ],

    runtimeConfig: {
        public: {
            supportedChains: SUPPORTED_CHAINS,
            alchemy: SUPPORTED_CHAINS[process.env.CHAIN_ID],
        },
    },

    ssr: false,

    target: 'static',

    vite: {
        plugins: [eslintPlugin()],
    },
})

// interface ISupportedChain {
//     network: string
//     apiKey?: string
//     chainId: number
//     https?: string
//     websocket?: string
// }
