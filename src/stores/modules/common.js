import { defineStore } from 'pinia'
import { store } from '../index'

export const useCommonStore = defineStore('common', {
    state: () => {
        return {
            isLoading: false, //loading全局开关
        }
    },
    getters: {
        getLoading() {
            return this.isLoading
        }
    },
    actions: {
        setLoading(isLoading) {
            this.isLoading = isLoading
        }
    }
})

export const useCommonStoreInfo = () => {
    return useCommonStore(store)
}