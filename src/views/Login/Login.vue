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

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// 登录
const login = async () => {
    try {
        const { data } = await workWechatOauth({ code: route.query.code, appid: route.query.appid })
        userStore.setToken(data.token)
        userStore.setUserInfo(data.corp_user_info)
        // 跳转订单列表
        router.push('/order_list')
    } catch (error) {
        
    }
}

login()

</script>

<template>
	<!-- <div>登陆中ddd...</div> -->
</template>