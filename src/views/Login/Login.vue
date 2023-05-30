<script setup>
// import wx from 'weixin-js-sdk'

import { getCurrentInstance, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
// const a = '1231'
const route = useRoute()
console.log(route,'理由')
const appid = 'ww12f0c60e7eb68bc3'
const redirect_uri = 'http://test.workh5.galaxy-immi.com/login'
const agentid = '1000180#wechat_redirect'
const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=STATE&agentid=${agentid}`
// console.log(route.query.code, '--------------')
if (!route.query.code) {
    window.location.href = url
}
console.log(route.query, '参数11')
// window.location.href = url
// wx.invoke('getCurExternalContact', {
// 	}, function(res){
// 	if(res.err_msg == "getCurExternalContact:ok"){
// 		// userId  = res.userId //返回当前外部联系人userId
// 		alert(res.userId)
// 	}else {
// 		//错误处理
// 	}

// })
// console.log(route)
// wx.invoke('getContext', {
// }, function(res){
// if(res.err_msg == "getContext:ok"){
// 	entry  = res.entry ; //返回进入H5页面的入口类型，目前有normal、contact_profile、single_chat_tools、group_chat_tools、chat_attachment
// 	shareTicket = res.shareTicket; //可用于调用getShareInfo接口
// }else {
// 	//错误处理
// }
// });
</script>

<template>
	<div>我是登录页11</div>
</template>