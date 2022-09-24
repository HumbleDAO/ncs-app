import { defineNuxtConfig } from 'nuxt/config'
import eslintPlugin from 'vite-plugin-eslint'
import svgLoader from 'vite-svg-loader'

const SUPPORTED_CHAINS_METADATA = {
    31337: {
        network: 'hardhat',
        chainId: 31337,
        alchemy: {
            apiKey: process.env.MUMBAI_ALCHEMY_API_KEY,
            https: process.env.MUMBAI_ALCHEMY_HTTPS,
            websocket: process.env.MUMBAI_ALCHEMY_WEBSOCKET,
        },

        quicknode: {
            apiKey: process.env.MUMBAI_QUICKNODE_API_KEY,
            https: process.env.MUMBAI_QUICKNODE_HTTPS,
            websocket: process.env.MUMBAI_QUICKNODE_WEBSOCKET,
        },

        aaveUsdcPoolAddressesProviderAddress: '0x178113104fEcbcD7fF8669a0150721e231F0FD4B',
        aUsdcTokenAddress: '0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9',
        usdcTokenAddress: '0x2058a9d7613eee744279e3856ef0eada5fcbaa7e',
    },
    80001: {
        network: 'polygonMumbai',
        chainId: 80001,
        alchemy: {
            apiKey: process.env.MUMBAI_ALCHEMY_API_KEY,
            https: process.env.MUMBAI_ALCHEMY_HTTPS,
            websocket: process.env.MUMBAI_ALCHEMY_WEBSOCKET,
        },

        quicknode: {
            apiKey: process.env.MUMBAI_QUICKNODE_API_KEY,
            https: process.env.MUMBAI_QUICKNODE_HTTPS,
            websocket: process.env.MUMBAI_QUICKNODE_WEBSOCKET,
        },
        aaveUsdcPoolAddressesProviderAddress: '0x178113104fEcbcD7fF8669a0150721e231F0FD4B',
        aUsdcTokenAddress: '0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9',
        usdcTokenAddress: '0x2058a9d7613eee744279e3856ef0eada5fcbaa7e',
    },
    137: {
        network: 'polygon',
        chainId: 137,
        alchemy: {
            apiKey: process.env.POLYGON_ALCHEMY_API_KEY,
            https: process.env.POLYGON_ALCHEMY_HTTPS,
            websocket: process.env.POLYGON_ALCHEMY_WEBSOCKET,
        },

        quicknode: {
            apiKey: process.env.POLYGON_QUICKNODE_API_KEY,
            https: process.env.POLYGON_QUICKNODE_HTTPS,
            websocket: process.env.POLYGON_QUICKNODE_WEBSOCKET,
        },
        aaveUsdcPoolAddressesProviderAddress: '0xd05e3E715d945B59290df0ae8eF85c1BdB684744',
        aUsdcTokenAddress: '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F',
        usdcTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
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

    colorMode: {
        preference: 'luxury', // default value of $colorMode.preference
        fallback: 'dark', // fallback value if not system preference found
        hid: 'nuxt-color-mode-script',
        globalName: '__NUXT_COLOR_MODE__',
        componentName: 'ColorScheme',
        classPrefix: '',
        classSuffix: '-mode',
        storageKey: 'nuxt-color-mode',
    },

    runtimeConfig: {
        public: {
            supportedChainsMetadata: SUPPORTED_CHAINS_METADATA,
            alchemy: SUPPORTED_CHAINS_METADATA[process.env.CHAIN_ID ?? 31337].alchemy,
            quicknode: SUPPORTED_CHAINS_METADATA[process.env.CHAIN_ID ?? 31337].quicknode,
        },
    },

    ssr: false,

    target: 'static',

    vite: {
        plugins: [
            svgLoader({
                /* ... */
            }),
            eslintPlugin(),
        ],
    },

    nitro: {
        preset: 'netlify',
    },
})

// interface ISupportedChain {
//     network: string
//     apiKey?: string
//     chainId: number
//     https?: string
//     websocket?: string
// }
