// import { defineStore, skipHydrate } from 'pinia'

// export const useAuthStore = defineStore('auth', {
//     state: () => ({
//         user: useLocalStorage('pinia/auth/login', 'bob'),
//     }),

//     hydrate(state, initialState) {
//         // in this case we can completely ignore the initial state since we
//         // want to read the value from the browser
//         state.user = useLocalStorage('pinia/auth/login', 'bob')
//     },
// })
