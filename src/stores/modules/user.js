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
        getUserInfo() {
            return this.userInfo
        }
    },
    actions: {
        // set登录态
        setToken(token) {
            this.token = token
        },
        // set用户信息
        setUserInfo(data) {
            this.userInfo = data
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