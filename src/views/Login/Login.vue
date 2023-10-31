<!--
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-26 11:45:15
 * @FilePath: \workwexin-h5-sidebar\src\views\Login\Login.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script setup>
import { workWechatOauth, getDwptoken } from '@/api/common'
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
const getWorkCode = async () => {
    sessionStorage.setItem('redirectUri', location.href)
    const appid = import.meta.env.VITE_APPID
    const agentid = getAgentid()
    const redirect_uri = route.query.redirect_uri
    const redirectUri = encodeURIComponent(`${import.meta.env.VITE_REDIRECT_URI}/login?redirect_uri=${route.query.redirect_uri}&hasCode=1`)
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=STATE&agentid=${agentid}#wechat_redirect`
    listenerBack()
    window.location.replace(url)
}

// 登录
const login = async () => {
    try {
        const { data } = await workWechatOauth({ code: route.query.code, agent_id: getAgentid() })
        userStore.setToken(data.token)
        userStore.setUserInfo(data.corp_user_info || {})
        const res = await getDwptoken(data.token)
        userStore.setDwpToken(res.data.token)
        router.replace(decodeURIComponent(route.query.redirect_uri))
    } catch (error) {
        console.error('login-error：', error)
    }
}

// 解决移动端后退问题
function listenerBack() {
    window.addEventListener('pageshow', function() {
        if (sessionStorage.getItem('redirectUri') === location.href) { // 说明是点击授权前的页面，此页面在后退中不需要展示，直接关机即可
            // 关闭当前页面
            wx.closeWindow({
                fail({ errMsg }) {
                    console.log('closeWindow', errMsg)
                }
            });
        }
    })
}
if (!userStore.getDwpToken || !userStore.getToken) {
  !route.query.hasCode ? getWorkCode() : login()
} else {
  router.replace(decodeURIComponent(route.query.redirect_uri))
}
</script>

<template>
</template>
