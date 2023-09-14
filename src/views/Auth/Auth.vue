<!--
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-14 16:41:22
 * @FilePath: \workwexin-h5-sidebar\src\views\Auth\Auth.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()
const router = useRouter()

// 企业微信静默授权重定向获取code
const getWorkCode = () => {
    const appid = import.meta.env.VITE_APPID
    const redirect_uri = encodeURIComponent(`${import.meta.env.VITE_REDIRECT_URI}/login`)
    const agentid = import.meta.env.VITE_AGENTID
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=STATE&agentid=${agentid}#wechat_redirect`
    return url
}
if (userStore.getToken) {
    // router.push('/order_list')
    router.push('/daily_affairs')
} else {
    window.location.href = getWorkCode()
}

</script>