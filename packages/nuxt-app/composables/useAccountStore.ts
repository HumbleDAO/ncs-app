import { Ref } from 'nuxt/dist/app/compat/vue-demi'

export const useAccountStore = defineStore('account', () => {
    const address: Ref<string> = ref('')
    const ensName: Ref<string> = ref('')
    const balance: Ref<any> = ref({} as any)

    return {
        address: computed(() => address.value),
        ensName: computed(() => ensName.value),
        balance: computed(() => balance.value),
    }
})
