<!--
 * @Author: Autumn.again
 * @Date: 2023-09-13 10:41:06
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-19 11:40:37
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\daily_affairs.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script setup name="daily_affairs" lang="tsx">
import * as ww from '@wecom/jssdk'
import { getWorkWechatConfig } from '@/api/user'
import { agentConfig } from '@/utils/wxconfig'
import { useI18n } from 'vue-i18n'
import PendingList from './C/pending_list.vue'
// 获取的企业微信授权初始化jsdk
// const getWxConfig = async () => {
//     try {
//         const { code, data } = await getWorkWechatConfig({url: location.href}) as any
//         if (code === 200) {
//             agentConfig(data.config, () => {
//             })
//         }
//     } 
//     catch (error) {
//         // error
//     }
// }
// getWxConfig()

const showCalender = () => {
  ww.shareAppMessage({
      title: '分享链接',
      desc: '点击下载Xlsx表格',
      link: 'https://cache.galaxy-immi.com/%E5%AE%A2%E6%88%B7%E8%BF%9B%E5%BA%A6%E6%A8%A1%E6%9D%BF.xlsx',
      imgUrl: 'https://res.mail.qq.com/node/ww/wwmng/style/images/index_share_logo$13c64306.png',
  })
}

const chooseDate = ref('')
// 选择日期变更
const dateClickhandler = (val: any) => {
  chooseDate.value = val
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
const active = ref('0')

// 简体中英文繁体字切换
const { locale } = useI18n()
const changeLang = () => {
  locale.value = locale.value === 'HK' ? 'ZH' : 'HK'
}


</script>

<template>
  <div class="daily">
    <!-- <div @click="changeLang" class="change_lang">
      切换语言
    </div> -->
    <div class="title_action">
          <van-icon name="search" @click="searchClick"/>
          <van-icon @click="searchClick" name="filter-o" />
        </div>
    <van-tabs v-model:active="active" class="tables" animated>
        <van-tab :title="`标签${item}`" v-for="(item, index) in 8" :key="index" class="table_items">
          <vue-hash-calendar
            select-type="single"
            :show-arrow="true"
            picker-type="date"
            format="YY-MM-DD"
            @change="dateClickhandler"
            :show-week-view="true"
            :show-action="false"
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
          <PendingList />
        </van-tab>
      </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.daily {
  position: relative;
  font-size: 28px;
  // height: 100%;
}
:deep(.calendar_day) {
  border-radius: 12px;
}
:deep(.lunar-content_people) {
  font-size: 12px;
  text-align: center;
}
:deep(.calendar_group) {
  .calendar_day  {
    height: 120px;
  }
}
.title_action {
  position: absolute;
  top: 25px;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 195px;
  z-index: 99;
  background: #fff;
  padding: 0 32px 0 47px;
  .van-icon {
    font-size: 42px;
  }
}
// .table_items {
//   display: flex;
//   flex-wrap: wrap;
//   height: auto;
// }
// .tables {
//   height: calc(100% - 98px);
//   :deep(.van-tabs__content) {
//     height: 100%;
//   }
// }
</style>