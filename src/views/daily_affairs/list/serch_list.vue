<!--
 * @Author: Autumn.again
 * @Date: 2023-09-20 13:44:22
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-10-08 16:16:31
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\list\serch_list.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script lang="ts" setup name="serch_detail">
import PendingList from './C/pending_list.vue'
import { getTransactionTaskList, getRole } from '@/api/daily_affairs'
// 定义搜索参数
const filterData: filter_params = reactive({
  customer_name: '',
  user_id: '', // 香港同事
  address: '', // 地点
  task_status: '', // 状态:0待分配,1待办理,2已办理,3已领证
  start_time: '', // 开始
  end_time: '', // 结束
  is_convert: 1 // 是否转换数据格式为按天统计：1转换,0不转换
})
const { t } = useI18n()

const router = useRouter()
const listData = ref([])
const showSearchResult = ref(false)
// 点击搜索按钮
const onClickButton = async () => {
  if (!filterData.customer_name) {
    return
  }
  const res = (await getTransactionTaskList(filterData)) as any
  if (res.code === 200) {
    listData.value = res.data
    showSearchResult.value = true
  }
}
const isMaster = ref(false)

onMounted(async () => {
  const { data } = await getRole()
  isMaster.value = data === 'hk_transaction_master'
})

onActivated(() => {
  if (!router.options.history.state.forward) {
    // 说明是从列表页进来，此时清空条件
    listData.value = []
    showSearchResult.value = false
    filterData.customer_name = ''
  }
})
</script>
<template>
  <div class="detail flex-direction-column">
    <van-search
      v-model="filterData.customer_name"
      show-action
      label=""
      :left-icon="''"
      :placeholder="t('message.searchPlaceholder')"
      @search="onClickButton"
      shape="round"
    >
      <template #action>
        <div @click="onClickButton" class="search_button">搜索</div>
      </template>
    </van-search>
    <!-- 加上 @search 事件可能导致清除按钮失效 ？ -->
    <!-- <van-search
            v-model="filterData.customer_name"
            shape="round"
            label=""
            :left-icon="''"
            background="#fff"
            placeholder="输入客户姓名"
            show-action
        >
            <template #action>
                <div @click="onClickButton" class="search_button">搜索</div>
            </template>
        </van-search> -->
    <!-- <PendingList :listData="listData" :canBatchAction="false" :role_key="isMaster"/> -->
    <div v-for="(item, index) in Object.keys(listData)" :key="index">
      <div class="listData_title">
        {{ item }}
      </div>
      <PendingList
        :listData="listData[item]"
        :canBatchAction="false"
        :role_key="isMaster"
      />
    </div>
    <div
      class="not_data"
      v-if="!Object.keys(listData).length && showSearchResult"
    >
      暂无搜索数据
    </div>
  </div>
</template>
<style lang="scss" scoped>
.detail {
  background: #f8f8f8;
  .search_button {
    font-size: 28px;
    color: #198cff;
  }
}
:deep(.van-search) {
  padding: 24px 32px;
  margin-bottom: 20px;
  .van-search__action {
    padding: 0;
    margin-left: 24px;
  }
  .van-search__content {
    .van-field {
      background: #f8f9fb;
      flex-wrap: nowrap;
      border-radius: 70px;
    }
  }
}
.not_data {
  font-size: 28px;
  text-align: center;
  color: #999;
}
.listData_title {
  color: #888f98;
  padding-left: 40px;
  background-color: #f8f8f8;
  font-size: 28px;
}
</style>
