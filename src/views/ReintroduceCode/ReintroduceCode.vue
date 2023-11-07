<script setup>
import { getReintroduceInfo } from '@/api/reintroduce_code'
import { ref } from 'vue'
import * as wx from '@wecom/jssdk'
import { showToast } from 'vant'
import { isMobile } from '@/utils/index'

const orderData = ref([])
const clientName = ref('')
const imgUrl = ref('')
const imgData = ref({})
const btnShow = ref(false)
const btnLoading = ref(false)

const IS_MOBILE = isMobile()

// 获取客户信息
const getUserInfo = async (userId) => {
  try {
    const { data } = await getReintroduceInfo({
      wecom_external_user_id: userId || ''
    })
    imgData.value = data || {}
    getImageUrl()
  } catch (error) {
    // 获取客户信息失败，赋值错误链接
    imgUrl.value = '/'
  }
}

// 获取外部联系人
const getExternalInfo = async () => {
  try {
    const res = await wx.getCurExternalContact()
    getUserInfo(res.userId)
  } catch (error) {
    setTimeout(async () => {
      const res = await wx.getCurExternalContact()
      getUserInfo(res.userId)
    }, 1000)
  }
}

// 生成图片
const getImageUrl = async () => {
  const {
    avatar_url = '',
    nickname = '',
    evaluation_wx_url: url,
    counselor_name = '',
    big_code = ''
  } = imgData.value
  const defaultSrc =
    import.meta.env.VITE_APP_ENV === 'production'
      ? 'https://picture-create.galaxy-immi.com'
      : 'https://test-picture-create.galaxy-immi.com'
  const src = `${defaultSrc}/ps/recommend-api?avatar_url=${avatar_url}&counselor_name=${counselor_name}&evaluation_wx_url=${url}&nickname=${nickname}&big_code=${big_code}`
  imgUrl.value = src
}

const down = async () => {
  if (IS_MOBILE) return
  btnLoading.value = true
  try {
    const fileName = `二维码${Date.now() * 1}`
    const blobInfo = await fetch(imgUrl.value)
    const blob = await blobInfo.blob()
    // 创建一个临时链接
    const url = window.URL.createObjectURL(blob)
    // 创建一个隐藏的 <a> 标签并设置其属性
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    // 模拟点击下载链接
    link.click()
    // 释放临时链接的资源
    window.URL.revokeObjectURL(url)
    btnLoading.value = false
  } catch (error) {
    showToast('下载失败!')
    btnLoading.value = false
  }
}

// 图片复制
const copyImage = () => {
  if (IS_MOBILE) return
  try {
    const img = document.querySelector('#my-image img')
    let range = document.createRange() //创建range
    range.selectNode(img) //range选中图像节点
    let selection = window.getSelection() //获取selection对象
    if (selection.rangeCount > 0) {
      //如果有已经选中的区域，直接全部去除
      selection.removeAllRanges()
    }
    selection.addRange(range) //加入到选区中
    document.execCommand('copy')
    //去除选中区域，取消拖蓝效果
    selection.removeAllRanges()
    showToast('复制成功')
  } catch (error) {
    showToast('复制失败')
  }
}

getExternalInfo()
</script>

<template>
  <div class="img-wrap">
    <van-image
      :src="imgUrl"
      id="my-image"
      @load="btnShow = true"
      @error="btnShow = false"
    >
      <template #loading>
        <van-loading type="spinner" size="20" />
      </template>
      <template v-slot:error>
        <i
          class="van-badge__wrapper van-icon van-icon-photo-fail van-image__error-icon"
        />
        测评码生成失败
      </template>
    </van-image>
    <div v-if="btnShow && !IS_MOBILE">
      <van-button type="primary" @click="copyImage">复 制</van-button>
      <van-button
        type="primary"
        :loading="btnLoading"
        loading-text="下载中..."
        @click="down('down')"
        >下 载</van-button
      >
    </div>

    <span v-if="IS_MOBILE" class="text">长按图片进行操作</span>
  </div>
</template>

<style scoped lang="less">
.img-wrap {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .text {
    color: #666;
    font-size: 30px;
  }
  #my-image {
    width: 650px;
    height: 1072px;
    margin-bottom: 20px;
  }
  .van-button {
    width: 288px;
    + .van-button {
      margin-left: 32px;
    }
  }
  .van-icon-photo-fail {
    font-size: 220px;
  }
}
</style>
