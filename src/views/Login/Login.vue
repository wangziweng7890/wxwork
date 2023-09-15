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
    const agentid = route.query.agentid || sessionStorage.getItem('agentid') // 第一次从应用点进来会带，后面重新登录时，当前url不一定有参数，所以从sessionStorage获取
    sessionStorage.setItem('agentid', agentid)
    const redirect_uri = route.query.redirect_uri
    const redirectUri = encodeURIComponent(`${import.meta.env.VITE_REDIRECT_URI}/login?agentid=${route.query.agentid}&redirect_uri=${route.query.redirect_uri}&hasCode=1`)
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=STATE&agentid=${agentid}#wechat_redirect`
    window.location.href = url
}

// 登录
const login = async () => {
    try {
        const { data } = await workWechatOauth({ code: route.query.code, agentid: route.query.agentid })
        userStore.setToken(data.token)
        userStore.setUserInfo(data.corp_user_info)
        router.replace(decodeURIComponent(route.query.redirect_uri))
    } catch (error) {
        
    }
}

// 如果需要登录
if (!route.query.hasCode) {
    getWorkCode()
} else {
    login()
}


</script>

<template>
	<div>登陆中...</div>
</template>