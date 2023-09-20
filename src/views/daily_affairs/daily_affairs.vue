<script setup name="daily_affairs" lang="tsx">
import PendingList from './C/pending_list.vue'
import weekCalender from './C/week_calender.vue'
import SearchForm from './C/searchForm.vue'
import { useI18n } from 'vue-i18n'
import * as wx from '@wecom/jssdk'

const router = useRouter()

// 定义搜索参数
const search_params: search_params = reactive({
  customer_name: ''
})
const showBottom = ref(false)
const showAction = ref(false)

// 点击搜索
const searchClick = (value?: string) => {
  if (value) {
    showBottom.value = !showBottom.value
  } else {
    router.push('/daily_affairs/detail')
  }
}
const active = ref('0')

// 简体中英文繁体字切换
const { locale } = useI18n()
const changeLang = () => {
  console.log('changeLang------------------------>');
  locale.value = locale.value === 'HK' ? 'ZH' : 'HK'
}

const listData = ref([])
const date = ref('')
// 监听数值变化就调用接口
watch(() => date.value, (newVal, oldVal) => {
  listData.value = [
  {
        time: '2022-01-01',
        user_name: '张三',
        processor: '',
        visa_type: 1,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 1
    },
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '香港同事A',
        visa_type: 3,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 2
    },
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '',
        visa_type: 1,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 3
    },
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '香港同事BBB',
        visa_type: 1,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 4
    },
  ]
})
const click_action = () => {
  showAction.value = true
}
const action_content = ref(['批量分配', '简转繁', '导出Excel', '取消'])
const handler_action = (index?: number) => {
  switch (index) {
    case 0:
    wx.selectEnterpriseContact({
      fromDepartmentId: -1,
      mode: 'single',
      type: ['department', 'user'],
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
</script>

<template>
  <div class="daily">
    <div class="title_action">
      <van-icon name="search" @click="searchClick()"/>
      <van-icon @click="searchClick('search')" name="filter-o" />
    </div>
    <van-tabs v-model:active="active" class="tables">
      <van-tab :title="`标签${item}`" v-for="(item, index) in 8" :key="index" class="table_items">
        <weekCalender v-model:date="date" @click_action="click_action"/>
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
      <SearchForm />
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
  // height: 100%;
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
  background: linear-gradient(to right, transparent 0%, #fff 25%);
  // background: linear-gradient(270deg, #FFF 0%, #FFF 81.31%, rgba(255, 255, 255, 0.00) 100%);
}
// .table_items {
//   display: flex;
//   flex-wrap: wrap;
//   height: auto;
// }
.tables {
  :deep(.van-tabs__content) {
    flex: 1;
  }
}
// :deep(.van-tabs__content) {
//   height: 100%;
//   .table_items {
//     height: 100%;
//   }
// }
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

</style>