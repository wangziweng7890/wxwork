<script setup name="daily_affairs" lang="tsx">
import PendingList from './C/pending_list.vue'
import weekCalender from './C/week_calender.vue'
import SearchForm from './C/searchForm.vue'
import { useI18n } from 'vue-i18n'
import * as wx from '@wecom/jssdk'
import { useUserStore } from '@/stores/modules/user'
import { getTransactionTaskList, getTransactionUserList } from '@/api/daily_affairs'


const router = useRouter()
const { userInfo } = useUserStore() as any
// 定义搜索参数
const filterData: filter_params = reactive({
    customer_name: '',
    user_id: '', // 香港同事
    address: '',// 地点
    task_status: '',// 状态:0待分配,1待办理,2已办理,3已领证
    start_time: '', // 开始
    end_time: '', // 结束
    is_conver: 0 // 是否转换数据格式为按天统计：1转换,0不转换
})
// 展开
const showBottom = ref(false)
const showAction = ref(false)

const workmateList = ref([])
onMounted(async () => {
  router.push({ path:'/daily_affairs/detail', query:{ tableId:345 } })
    const res = await getTransactionUserList() as any
    workmateList.value = [
      {
        id: '',
        wework_name: '全部'
      },
      ...res.data
    ]
})
// 点击搜索
const searchClick = (value?: string | number) => {
  if (value) {
    showBottom.value = !showBottom.value
  } else {
    router.push('/daily_affairs/serch_list')
  }
}
const active = ref('0')

// 简体中英文繁体字切换
const { locale } = useI18n()
const changeLang = () => {
  locale.value = locale.value === 'HK' ? 'ZH' : 'HK'
}

const listData = ref([])
const date = ref('')
// 监听数值变化就调用接口
const getTransactionList = async () => {
  if (showBottom.value) {
    showBottom.value = false
  }
  const res = await getTransactionTaskList(filterData)
  listData.value = res.data
}
watch(() => date.value, (newVal, oldVal) => {
  filterData.start_time = newVal
  getTransactionList()
})
const click_action = (type?: number) => {
  switch (type) {
    case 0:
    case 1:
      searchClick(type)
      break;
    default:
      showAction.value = true
      break;
  }
}
const action_content = ref(['批量分配', '简转繁', '导出Excel', '取消'])
const handler_action = (index?: number) => {
  switch (index) {
    case 0:
    wx.selectEnterpriseContact({
      fromDepartmentId: -1,
      mode: 'multi',
      type: ['department', 'user'],
      selectedDepartmentIds: ['2', '3'],
      selectedUserIds: ['lisi', 'lisi2']
    })
      break;
    case 1:
      changeLang()
      break;
    case 2:
      break;
    default:
      break;
  }
  showAction.value = false
}
const new_date = () => {
  const newDate = new Date()
  return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
}
// 切换table栏
const onClickTab = (res: any) => {
  const { name } = res
  filterData.user_id = workmateList.value[name].id
  date.value = new_date()
}
</script>

<template>
  <div class="daily">
    <div class="title_action" v-if="!!userInfo.role_key">
      <i class="iconfont icon-icon_sousuo" @click="searchClick()"></i>
      <i class="iconfont icon-icon_luodou" @click="searchClick('search')"></i>
    </div>
    <van-tabs
      v-model:active="active"
      class="tables"
      :class="{hiddenTab: !userInfo.role_key}"
      @click-tab="onClickTab"
    >
      <van-tab :title="item.wework_name || '-'" v-for="(item, index) in workmateList" :key="index" class="table_items">
        <weekCalender v-model:date="date" :role_key="userInfo.role_key" @click_action="click_action"/>
        <PendingList :listData="listData"/>
      </van-tab>
    </van-tabs>
    <van-popup
      v-model:show="showBottom"
      round
      position="bottom"
      :style="{ maxHeight: '80%', minHeight: '30%' }"
      close-icon="close"
      closeable
    >
      <SearchForm v-model:filterData="filterData" :role_key="userInfo.role_key" @getTransactionList="getTransactionList" :workmateList="workmateList"/>
    </van-popup>
    <van-popup
      v-model:show="showAction"
      round
      position="bottom"
      :style="{ maxHeight: '80%', minHeight: '30%' }"
      close-icon="close"
      closeable
    >
    <div class="actiones">
      <div class="actiones_title">
        更多操作
      </div>
      <div v-for="(item, index) in action_content" :key="index" class="actiones_button" @click="handler_action(index)">
        {{ item }}
      </div>
    </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.daily {
  position: relative;
  font-size: 28px;
  height: 100%;
  background: #F8F8F8;
}
.title_action {
  position: absolute;
  top: 25px;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 195px;
  height: 42px;
  z-index: 99;
  background: #fff;
  padding: 0 32px 0 47px;
  .iconfont {
    font-size: 42px;
  }
  background: linear-gradient(to right, transparent 0%, #fff 25%);
  // background: linear-gradient(270deg, #FFF 0%, #FFF 81.31%, rgba(255, 255, 255, 0.00) 100%);
}
.tables {
  :deep(.van-tabs__content) {
    flex: 1;
  }
}
:deep(.van-tabs__nav--complete) {
  padding-right: 160px;
  padding-left: 0;
}
.actiones {
  padding: 32px 42px 0;
  &_title {
    font-size: 34px;
    padding-bottom: 32px;
  }
  &_button {
    color: #222222;
    height: 104px;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #f0f0f0;
    &:last-of-type {
      color: #909090;
    }
  }
}
.hiddenTab { // 通过class样式隐藏tab栏
  :deep(.van-tabs__wrap) {
    display: none;
  }
}
</style>