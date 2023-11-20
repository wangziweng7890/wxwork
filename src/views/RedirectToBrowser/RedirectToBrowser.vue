<script setup>
import * as wx from '@wecom/jssdk'
import { useRoute, useRouter } from 'vue-router'
import { getSdkSignature } from '@/api/common'

const route = useRoute()

wx.register({
  corpId: import.meta.env.VITE_APPID, // 必填，企业微信的corpid，必须与当前w登录的企业一致
  jsApiList: ['openDefaultBrowser', 'closeWindow'], //必填
  async getConfigSignature() {
    const { data: { config } } = await getSdkSignature({ url: location.href })
    return {
      timestamp: config.timestamp, // 必填，生成签名的时间戳
      nonceStr: config.nonceStr, // 必填，生成签名的随机串
      signature: config.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
    }
  },
  onConfigSuccess(...args) {
    console.log('wx onConfigSuccess', args)
  },
  onConfigFail(...args) {
    console.log('wx onConfigFail', args)
  },
})

// 系统默认浏览器打开redirect_url
const redirectToDefaultBrowser = async () => {
  const url = window.location.href
  // 找到redirect_url参数的起始位置
  const redirectUrlIndex = url.indexOf('redirect_url=');
  // 截取从redirect_url参数开始到整个URL末尾的部分
  var redirectUrl = url.substring(redirectUrlIndex + 'redirect_url='.length);
  wx.openDefaultBrowser({
    url: redirectUrl,
    success(...args) {
      console.log('openDefaultBrowser success', args)
      wx.closeWindow()
    },
    fail(...args) {
      console.log('openDefaultBrowser fail', args)
    }
  })
}

redirectToDefaultBrowser()

</script>

<template>
  <div></div>
</template>
