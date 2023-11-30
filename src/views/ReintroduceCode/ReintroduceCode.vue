<script setup>
import { getReintroduceInfo } from '@/api/reintroduce_code'
import { ref } from 'vue'
import * as wx from '@wecom/jssdk'
import { showToast } from 'vant'
import { isMobile } from '@/utils/index'

// 尊享版url
const imgUrl = ref('')
// 纯净版url
const imgPureUrl = ref('')

const btnArrShow = reactive([false, false])
const imgData = ref({})
const btnLoading = ref(false)
// 错误提示
const showTips = ref(false)
const IS_MOBILE = isMobile()

const images = computed(() => {
  return [
    {
      text: '纯净版(可点击箭头切换)',
      imgUrl: imgPureUrl.value,
      id: 'imgUrl'
    },
    {
      text: '尊享版(可点击箭头切换)',
      imgUrl: imgUrl.value,
      id: 'imgPureUrl'
    }
  ]
})

const swipeIndex = ref(0)
const swipeTransform = computed(() => {
  return `translateX(-${swipeIndex.value * 100}vw)`
})

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
    imgPureUrl.value = '/'
  }
}

// 文案
function getTipsInfo() {
  // showTips.value = true;
  console.log('预留调是否展示文案接口')
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
      getTipsInfo()
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
  const pureSrc = `${defaultSrc}/ps/recommend-api?avatar_url=${avatar_url}&counselor_name=&evaluation_wx_url=${url}&nickname=${nickname}&big_code=${big_code}&isPure=1`
  imgUrl.value = src
  imgPureUrl.value = pureSrc
}

const down = async (image) => {
  if (IS_MOBILE) return
  btnLoading.value = true
  try {
    const fileName = `二维码${Date.now() * 1}`
    const blobInfo = await fetch(image.imgUrl)
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
const copyImage = (id) => {
  if (IS_MOBILE) return
  try {
    const img = document.querySelector(`#${id} img`)
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

function next() {
  if (swipeIndex.value >= images.value.length - 1) swipeIndex.value = 0
  else swipeIndex.value = swipeIndex.value + 1
}

function prev() {
  if (swipeIndex.value <= 0) swipeIndex.value = images.value.length - 1
  else swipeIndex.value = swipeIndex.value - 1
}

// 初始化
function init() {
  getExternalInfo()
}

init()
</script>

<template>
  <div class="img-wrap">
    <p class="tips" v-if="showTips">
      您的企微关联CRM账号并非顾问、客户经理相关角色，线索可能无法由您主动分配！
    </p>
    <div class="swipe">
      <div class="swipe-wrap" :style="{ transform: swipeTransform }">
        <div class="swipe-item" v-for="(image, index) in images" :key="image">
          <p class="swipe-item-title">{{ image.text }}</p>
          <van-image
            :src="image.imgUrl"
            :id="image.id"
            class="my-image"
            @load="btnArrShow[index] = true"
            @error="btnArrShow[index] = false"
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
          <!-- 底部按钮 -->
          <div v-if="btnArrShow[index] && !IS_MOBILE">
            <van-button type="primary" @click="copyImage(image.id)"
              >复 制</van-button
            >
            <van-button
              type="primary"
              :loading="btnLoading"
              loading-text="下载中..."
              @click="down(image)"
              >下 载</van-button
            >
          </div>
          <span v-if="IS_MOBILE && btnArrShow[index]" class="text"
            >长按图片进行操作</span
          >
        </div>
      </div>
      <van-icon name="arrow-left" size="18" @click="prev" class="swipe-arrow" />
      <van-icon name="arrow" size="18" @click="next" class="swipe-arrow" />
    </div>
  </div>
</template>

<style scoped lang="less">
.img-wrap {
  min-height: 100vh;
  overflow-x: hidden;
  .tips {
    color: red;
    line-height: 34px;
    width: 300px;
    font-size: 30px;
    width: 85vw;
    margin-bottom: 20px;
  }
  .text {
    color: #666;
    font-size: 30px;
  }
  .swipe {
    position: relative;
    overflow: hidden;
    width: 100vw;
    .swipe-wrap {
      width: 100vw;
      display: flex;
      transition: all 0.5s;
    }
    .swipe-item {
      width: 100vw;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .swipe-item-title {
        font-size: 30px;
        margin-bottom: 12px;
      }
    }
    .swipe-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: white;
      background-color: rgba(31, 45, 61, 0.11);
      border-radius: 50%;
      padding: 6px;
      cursor: pointer;
      z-index: 2;
    }
    .van-icon-arrow-left {
      left: 8px;
    }
    .van-icon-arrow {
      right: 8px;
    }
  }
  .my-image {
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
}
</style>
