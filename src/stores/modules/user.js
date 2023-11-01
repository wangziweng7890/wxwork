/*
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-27 14:37:45
 * @FilePath: \workwexin-h5-sidebar\src\stores\modules\user.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
import { defineStore } from 'pinia'
import { store } from '../index'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            token: '',
            userInfo: {},
            dwpToken: '',
            expired: '',
            workmateList: [],
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
        },
        getWorkmateList() {
            return this.workmateList
        },
        getDwpExpired() {
          return this.expired
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
        setDwpExpired(expired) {
            this.expired = expired
        },
        // set用户信息
        setUserInfo(data) {
            this.userInfo = data
        },
        setWorkmateList(data) {
            this.workmateList = data
        },
        clear() {
            this.token = ''
            this.dwpToken = ''
            this.userInfo = {}
            this.workmateList = []
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
