<!--
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-14 16:41:22
 * @FilePath: \workwexin-h5-sidebar\src\views\Auth\Auth.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 企业微信静默授权重定向获取code
const getWorkCode = () => {
    const appid = import.meta.env.VITE_APPID
    const redirect_uri = encodeURIComponent(`${import.meta.env.VITE_REDIRECT_URI}/login?appid=${route.query.appid}&redirect_uri=${route.query.redirect_uri}`)
    const agentid = import.meta.env.VITE_AGENTID
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=STATE&agentid=${agentid}#wechat_redirect`
    return url
}
    
if (userStore.getToken) {
    // 只有第一次进来会带redirect_uri，此时需要重定向到具体应用页面。
    // 后续刷新页面，也会走入此逻辑，此时不需要重定向
    route.query.redirect_uri && router.replace(route.query.redirect_uri)
} else {
    window.location.href = getWorkCode()
}

</script>