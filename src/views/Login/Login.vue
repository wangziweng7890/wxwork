<script setup>
// import wx from 'weixin-js-sdk'

import { getCurrentInstance, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route,'理由')
const appid = 'ww12f0c60e7eb68bc3'
const redirect_uri = 'http://test.workh5.galaxy-immi.com/order_list'
const agentid = '1000180#wechat_redirect'
const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=STATE&agentid=${agentid}`
// console.log(route.query.code, '--------------')
if (!route.query.code) {
    window.location.href = url
}
console.log(route.query, '参数11')
</script>

<template>
	<div>我是登录页11</div>
</template>