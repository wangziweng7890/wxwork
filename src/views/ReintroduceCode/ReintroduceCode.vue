<script setup>
import { getReintroduceInfo } from '@/api/reintroduce_code'
import { ref } from 'vue'
import * as wx from '@wecom/jssdk'
import { showToast } from 'vant'

const orderData = ref([])
const clientName = ref('')
const imgUrl = ref('')
const imgData = ref({})
const btnShow = ref(false)
const btnLoading = ref(false)

// 获取客户信息
const getCodeInfo = async (userId) => {
  getImageUrl()
  // try {
  //   const { code, data } = await getReintroduceInfo({
  //     wecom_external_user_id: userId || ''
  //   })
  //   console.log(code, data, 'res============')
  //   if (code === 200) {
  //   }
  // } catch (error) {}
}

// 获取的企业微信授权初始化jsdk
const getWxConfig = async () => {
  try {
    const res = await wx.getCurExternalContact()
    getCodeInfo(res.userId)
  } catch (error) {
    setTimeout(async () => {
      const res = await wx.getCurExternalContact()
      getCodeInfo(res.userId)
    }, 1000)
  }
}

// 生成图片
const getImageUrl = async () => {
  const data = {
    avatar_url:
      'https://upload.cdn.galaxy-immi.com/crm/test/files/_1681956828984.jpg',
    nickname: '',
    evaluation_wx_url:
      'https://upload.cdn.galaxy-immi.com/wechat/questionnaire/customer/551118-1239.png',
    counselor_name: 'baiyu2'
  }
  const {
    avatar_url = '',
    nickname = '',
    evaluation_wx_url: url,
    counselor_name = '',
    big_code = ''
  } = data
  const defaultSrc =
    import.meta.env.VITE_APP_ENV === 'production'
      ? 'https://picture-create.galaxy-immi.com'
      : 'https://test-picture-create.galaxy-immi.com'
  const src = `${defaultSrc}/ps/recommend-api?avatar_url=${avatar_url}&counselor_name=${counselor_name}&evaluation_wx_url=${url}&nickname=${nickname}&big_code=${big_code}`
  imgUrl.value = src
}

const down = async () => {
  btnLoading.value = true
  // try {
  const fileName = `二维码${Date.now() * 1}`
  // const blobInfo = await fetch(imgUrl.value)
  // const blob = await blobInfo.blob()
  // // 创建一个临时链接
  // const url = window.URL.createObjectURL(blob)
  // // 创建一个隐藏的 <a> 标签并设置其属性
  // const link = document.createElement('a')
  // link.href = url
  // link.download = fileName
  // // 模拟点击下载链接
  // link.click()
  // // 释放临时链接的资源
  // window.URL.revokeObjectURL(url)
  wx.openDefaultBrowser({
    url: imgUrl.value + '&action=download'
  })

  btnLoading.value = false
  // } catch (error) {
  //   showToast('下载失败!')
  //   btnLoading.value = false
  // }
}

// 图片复制
const copyImage = () => {
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

getWxConfig()
</script>

<template>
  <div class="img-wrap">
    <van-image
      class="img"
      :src="imgUrl"
      @dblclick="copyImage"
      id="my-image"
      @load="btnShow = true"
      @error="btnShow = false"
    >
      <template #loading>
        <van-loading type="spinner" size="20" />
      </template>
      <template v-slot:error>加载失败</template>
    </van-image>
    <van-button
      v-if="btnShow"
      type="primary"
      :loading="btnLoading"
      loading-text="下载中..."
      @click="down('down')"
      >二维码下载</van-button
    >
  </div>
</template>

<style scoped lang="less">
.img-wrap {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .img {
    width: 600px;
    height: 990px;
    margin-bottom: 16px;
  }
  .van-button {
    width: 300px;
  }
}
</style>
