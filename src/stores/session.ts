import { defineStore } from 'pinia';
import { watch } from 'vue';

interface SessionState {
    authenticated: boolean,
    user: UserAccount | null
}

interface UserAccount {

    id: number,
    name: string,
    email: string
}

const state = ():SessionState => ({
    authenticated: false,
    user: null
});

const getters = {
    userIsAuthenticated:(state: SessionState) => state.authenticated,
    authUserId: (state: SessionState) => state.user ? state.user.id : null,
}

const actions = {

    setUser(user: UserAccount) {

        this.user = user;
    }
}

export const useSessionStore = defineStore('sessionStore', {
    state: state,
    persist: true, // package https://github.com/prazdevs/pinia-plugin-persistedstate
    getters: getters,
    actions: actions
});

watch(() => state, (state) => {

    localStorage.setItem('session', JSON.stringify(state))

}, { deep: true })


