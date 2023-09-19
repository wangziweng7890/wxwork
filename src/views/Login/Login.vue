<!--
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-14 09:48:45
 * @FilePath: \workwexin-h5-sidebar\src\views\Login\Login.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script setup>
import { workWechatOauth } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { getAgentid } from '@/config/app'
import * as wx from '@wecom/jssdk'
import { agentConfig } from '@/config/wxconfig'

// 登录流程分为三步
// 1. 进入当前页面通过重定向的方式获取code
// 2. 重定向回当前页面在用code调后端接口获取token
// 3. 处理完后会重定向回原页面

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// 企业微信静默授权重定向获取code
const getWorkCode = () => {
    const appid = import.meta.env.VITE_APPID
    const agentid = getAgentid()
    const redirect_uri = route.query.redirect_uri
    const redirectUri = encodeURIComponent(`${import.meta.env.VITE_REDIRECT_URI}/login?redirect_uri=${route.query.redirect_uri}&hasCode=1`)
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=STATE&agentid=${agentid}#wechat_redirect`
    window.location.href = url
}

// 登录
const login = async () => {
    try {
        // const { data } = await workWechatOauth({ code: route.query.code, agentid: getAgentid() })
        // 目前开发环境加不了企微，所以先用建镕的token
        let data = { token: "eyJpdiI6IjlNdVNzSjdNSkdhcFNEb1pQbVI0Q2c9PSIsInZhbHVlIjoiS25nN0VuR21FQzg0alJOWXliTFErQm8zRUVZOGpxZmlHSnVOTE0zS01qYnlWZ2U5cldvZXlNQks5WkNINlpIMzI0N3F4U3VEeTBBcXhva2VyUDlvQ3Ntc2xQU3NIcWJ2UjhFbUhhUWg0eGtYY0RoTzBndlBYN0RlY0h5a1wvNVd2QUJTaGRxM1hWRWlRdzFEUGhpWmwyekpuUzlBWURWcjFJME52Y0V2cmdXTWdBbE54WHJGcWFcL25zaWZMdk5ZaHlRWlJEMDRiR3kzdmhCNGZnOHNRXC9Vdz09IiwibWFjIjoiZDc0ZGRiZmI1NTRmMjdlMmM0NzMyNTZmZGNmYjU4MmQyMTEyNTlmMWZiZTI3NTYwYjMyYWI2YTE4ZjdiZDEyNiJ9"}
        userStore.setToken(data.token)
        userStore.setUserInfo(data.corp_user_info || {})
        router.replace(decodeURIComponent(route.query.redirect_uri))
    } catch (error) {
        console.error('login-error：', error)
    }
}
// 如果需要登录
if (!userStore.getToken) {
    !route.query.hasCode ? getWorkCode() : login()
} else {
    router.replace(decodeURIComponent(route.query.redirect_uri))
}

</script>

<template>
</template>