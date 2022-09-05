import { defineNuxtConfig } from 'nuxt'
import eslintPlugin from 'vite-plugin-eslint'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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

    ssr: false,

    target: 'static',

    vite: {
        plugins: [eslintPlugin()],
    },
})
