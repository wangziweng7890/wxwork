<!--
 * @Author: Autumn.again
 * @Date: 2023-09-13 10:41:06
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-14 16:16:53
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\daily_affairs.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script setup name="daily_affairs" lang="tsx">
import * as ww from '@wecom/jssdk'
import { getWorkWechatConfig } from '@/api/user'
import { agentConfig } from '@/utils/wxconfig'

const date = ref('')

// 获取的企业微信授权初始化jsdk
const getWxConfig = async () => {
    try {
        const { code, data } = await getWorkWechatConfig({url: location.href}) as any
        if (code === 200) {
            agentConfig(data.config, () => {
            })
        }
    } 
    catch (error) {
        // error
    }
}
getWxConfig()

const showCalender = () => {
  // ww.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     defaultCameraMode: 'batch',
  //     isSaveToAlbum: false,
  //     success: (value) => {
  //         console.log(value, 'chooseImage----------------->');
  //     }
  // })
  ww.shareAppMessage({
      title: '分享链接',
      desc: '点击下载Xlsx表格',
      link: 'https://cache.galaxy-immi.com/%E5%AE%A2%E6%88%B7%E8%BF%9B%E5%BA%A6%E6%A8%A1%E6%9D%BF.xlsx',
      imgUrl: 'https://res.mail.qq.com/node/ww/wwmng/style/images/index_share_logo$13c64306.png',
  })
  // show.value = true
}

const chooseDate = ref('')
// 选择日期变更
const dateClickhandler = (val: any) => {
  chooseDate.value = val
  console.log(chooseDate.value, 'dateClickhandler----------->');
}
// 过滤天数
const filterDay = (val: any) => {
  return val?.date.day == 1 ? `${val?.date.month + 1}月` : val?.date.day
}
// 定义搜索参数
const search_params: search_params = reactive({
  customer_name: ''
})
// 点击搜索
const searchClick = () => {
  console.log(search_params, chooseDate.value, '点击搜索---------------------------------->')
}
</script>

<template>
  <div class="daily">
    <van-search
      v-model="search_params.customer_name"
      show-action
      placeholder="客户姓名"
      @search="searchClick"
    >
      <template #action>
        <van-icon name="search" />
        <van-icon @click="searchClick" name="filter-o" />
      </template>
    </van-search>
    <vue-hash-calendar
      select-type="single"
      :show-arrow="true"
      picker-type="date"
      format="YY-MM-DD"
      @change="dateClickhandler"
    >
      <!-- <template #action>
        <div class="">我是自定义的操作栏</div>
      </template> -->
      <template v-slot:week="scope">
        <div>{{ `周${scope?.week}` }}</div>
      </template>
      <template v-slot:day="scope">
        <div class="lunar-content">
          <!-- <div class="lunar-content_day">{{ scope?.date.day }} </div> -->
          <div class="lunar-content_day">{{ filterDay(scope) }} </div>
          <div class="lunar-content_people"> 7人</div>
        </div>
      </template>
    </vue-hash-calendar>
    <van-cell title="请您选择日期" :value="date" @click="showCalender">
      {{ date }}
    </van-cell>
  </div>
</template>

<style lang="scss" scoped>
.daily {
  font-size: 50px;
}
:deep(.calendar_day) {
  border-radius: 20px;
  cursor: pointer;
}
:deep(.lunar-content_people) {
  font-size: 20px;
  text-align: center;
}
</style>