export const useSupportedChainsStore = defineStore('supportedChainsMetadata', () => {
    const runtimeConfig = useRuntimeConfig()

    function isChainSupported(chain: number) {
        return !!runtimeConfig.public.supportedChainsMetadata[chain]
    }

    return {
        supportedChainIds: computed(() =>
            Object.keys(runtimeConfig.public.supportedChainsMetadata).map((key) => parseInt(key))
        ),
        isChainSupported,
    }
})
