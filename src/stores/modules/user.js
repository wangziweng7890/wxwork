import { defineStore } from 'pinia'
import { store } from '../index'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            token: '',
            userInfo: {}
        }
    },
    getters: {
        getToken() {
            return this.token
        },
        getDwpToken() {
            return this.dwpToken
        },
        getUserInfo() {
            return this.userInfo
        }
    },
    actions: {
        // set登录态
        setToken(token) {
            this.token = token
        },
        setDwpToken(token) {
            this.dwpToken = token
        },
        // set用户信息
        setUserInfo(data) {
            this.userInfo = data
        },
        clear() {
            this.token = ''
            this.dwpToken = ''
            this.userInfo = {}
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage
            }
        ]
    }
})

export const useUserStoreInfo = () => {
    return useUserStore(store)
}