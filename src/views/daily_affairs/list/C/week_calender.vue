<!--
 * @Author: Autumn.again
 * @Date: 2023-09-19 13:53:38
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-10-08 17:28:58
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\list\C\week_calender.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script setup lang="ts">
import { getMonthInfo } from '@/api/daily_affairs'
import dayjs from 'dayjs'
const props = defineProps({
  role_key: Boolean, // 是否是主管
  highLight: Boolean,
  language: String //语言, 默认繁体
})
const emit = defineEmits(['updateDate', 'updateTimeRange', 'click_action'])
const chooseDate = ref('')
const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const selectDate = ref(dayjs()) // 通过小图标展开的日历选中的时间
const loadingMap = {}
const { t } = useI18n()

function filterWeekDay(scope) {
  const info = scope.info
  let day_text = ''
  if (scope.date === 1) {
    day_text = scope.month + '月'
  } else {
    day_text = scope.date
  }
  if (info?.holiday) {
    day_text = props.language === 'ZH' ? info.holiday : info.traditional_holiday
  }
  const people = info?.people ?? 0
  return {
    text: scope.isToday ? '今' : day_text,
    bottomInfo: `${people}人`
  }
}

function monthShow({ date }) {
  return getMonthDetail(dayjs(date).format('YYYY-MM-DD'))
}

// 过滤每天展示在日历当中的参数
const filterDay = (scope) => {
  const day = dayjs(scope.date)
  const monthInfo = dateInfo.value[day.format('YYYY-MM')] ?? {}
  const info = monthInfo[day.get('date') - 1] ?? {}
  const people = info.people ?? 0
  scope.topInfo =
    (props.language === 'ZH' ? info.holiday : info.traditional_holiday) || ''
  scope.bottomInfo = `${people}人`
  return scope
}

// 过滤展示天数
const filter_text = ref('日一二三四五六')

// 过滤底部日期展示
const arrow_date = () => {
  const week_day =
    '星期' + filter_text.value[new Date(chooseDate.value).getDay()]
  const date = chooseDate.value.split('-')
  const date_content = date[0] + '年' + date[1] + '月' + date[2] + '日'
  const params = {
    date_content,
    week_day
  }
  return params
}

let startDate = ''
let endDate = ''
// 回到今天
const backToday = (flag) => {
  chooseDate.value = dayjs().format('YYYY-MM-DD')
  if (
    !(dayjs().isBefore(endDate) && dayjs().isAfter(startDate)) ||
    flag === 1
  ) {
    selectDate.value = dayjs().format('YYYY-MM-DD')
    updateWeek()
  }
  emit('updateDate', chooseDate.value)
  scrollToActive()
}

// 是否今天
const show_back_today = computed(() => {
  return !dayjs().isSame(chooseDate.value, 'day')
})

// 操作栏
const click_action = (type?: number) => {
  emit('click_action', type)
}
// 监听年月份改变，则重新获取过滤信息
// watch(() => props.date, (newVal, oldVal) => {
//     const new_date = new Date(newVal)
//     const old_date = new Date(oldVal)
//     if (new_date.getFullYear() !== old_date.getFullYear() || new_date.getMonth() !== old_date.getMonth()){
//         getMonthDetail(newVal)
//     }
// })

const dateList = ref([])
const dateInfo = ref({}) //缓存月份信息

// 当星期日历的selectDate改变时,需要清除外层的缓存
function updateWeek() {
  calWeekList()
  calWeekInfo()
  updateTimeRange()
}
updateWeek()

// 计算日期列表

async function calWeekList() {
  const nowDay = selectDate.value
  let i = -10
  let arr = []
  while (i <= 10) {
    const day = dayjs(nowDay).add(i, 'day')
    const year = dayjs(day).get('year')
    const dateTime = dayjs(day).format('YYYY-MM-DD')
    const date = dayjs(day).get('date')
    const week = weekList[dayjs(day).get('day')]
    const isToday = dayjs(day).isSame(dayjs(), 'day')
    i === -10 && (startDate = dateTime)
    i === 10 && (endDate = dateTime)
    arr.push({
      year,
      month: dayjs(day).get('month') + 1,
      date, // 日
      week,
      dateTime, // 2023-10-12
      isToday
    })
    i++
  }
  dateList.value = arr
  scrollToActive()
}

async function scrollToActive() {
  await nextTick().then()
  document.querySelector('.box.actived').scrollIntoView({
    inline: 'center',
    block: 'nearest',
    behavior: 'smooth'
  })
}

// 给每个日期加上相关信息
async function calWeekInfo() {
  const obj = new Set()
  dateList.value.map((item) => {
    obj.add(item.year + '-' + item.month + '-01')
  })
  await Promise.all(
    Array.from(obj).map(async (key) => {
      return getMonthDetail(key)
    })
  )
  dateList.value = dateList.value.map((item) => {
    const day = item.year + '-' + item.month
    return {
      ...item,
      info: dateInfo.value?.[day]?.[item.date - 1]
    }
  })
}

// 获取月份信息
async function getMonthDetail(values) {
  const format = values.slice(0, 7)
  if (dateInfo.value[format]) return
  return getMonthInfo({
    date_month: values
  })
    .then((res) => {
      dateInfo.value[format] = res.data
    })
    .finally(() => {
      loadingMap[format] = false
    })
}
const selectPanel = ref(false)
function selectDateFn(value) {
  const day = dayjs(value.getTime()).format('YYYY-MM-DD')
  selectDate.value = day
  updateWeek()
  chooseDate.value = day
  emit('updateDate', chooseDate.value)
  selectPanel.value = false
}

// 页面初始化完成后
selectDateFn(new Date())

const minDate = dayjs().subtract(7, 'year').toDate()
const maxDate = dayjs().add(7, 'year').toDate()

function clickWeek(item) {
  chooseDate.value = item.dateTime
  emit('updateDate', chooseDate.value)
  scrollToActive()
}

function updateTimeRange() {
  emit('updateTimeRange', {
    start_time: startDate,
    end_time: endDate
  })
}

defineExpose({
  backToday
})
</script>
<template>
  <div class="calender">
    <div class="d-flex align-center">
      <div class="calender-container flex-1">
        <div class="wrap">
          <div
            v-for="item in dateList"
            :key="item.dateTime"
            class="box"
            :class="{ actived: item.dateTime === chooseDate }"
            @click="clickWeek(item)"
          >
            <div class="week">{{ item.week }}</div>
            <div
              class="day"
              :class="{ 'small-week': filterWeekDay(item).text.length > 3 }"
            >
              {{ filterWeekDay(item).text }}
            </div>
            <div class="people normal_text_color">
              {{ filterWeekDay(item).bottomInfo }}
            </div>
          </div>
        </div>
      </div>
      <div class="calender-icon">
        <i
          class="iconfont icon-rilixialai f-42px"
          @click="selectPanel = true"
        ></i>
      </div>
    </div>
    <van-calendar
      :title="t('message.dateSelect')"
      v-model:show="selectPanel"
      @confirm="selectDateFn"
      :show-confirm="false"
      @month-show="monthShow"
      :min-date="minDate"
      :max-date="maxDate"
    >
      <template #top-info="date">
        <div
          class="top_info"
          :class="{ small: filterDay(date).topInfo.length > 3 }"
        >
          {{ filterDay(date).topInfo }}
        </div>
      </template>
      <template #bottom-info="date">
        {{ filterDay(date).bottomInfo }}
      </template>
    </van-calendar>
    <div class="bottom_arrow_date d-flex flex-jusify-between">
      <div class="bottom_arrow_date_timer d-flex">
        <span>
          {{ arrow_date().date_content }}
        </span>
        <span>
          {{ arrow_date().week_day }}
        </span>
        <span @click="backToday" v-if="show_back_today" class="back_today">
          回今天
        </span>
      </div>
      <div class="actiones d-flex">
        <div v-if="!props.role_key">
          <i class="iconfont icon-icon_sousuo" @click="click_action(0)"></i>
          <i
            class="iconfont icon-icon_luodou"
            @click="click_action(1)"
            :class="{ highLight: highLight }"
          ></i>
        </div>
        <i
          class="iconfont icon-a-icon_Otherinformation"
          @click="click_action(2)"
        ></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.align-center {
  align-items: center;
}
.calender-container {
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }

  :deep(.box) {
    width: 96px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 153px;
    .people {
      font-size: 20px;
      text-align: center;
      height: 28px;
      color: rgba(34, 34, 34, 0.4);
    }
    .day {
      font-weight: 500;
      font-size: 30px;
      text-align: center;
      color: #222;
    }
    .week {
      font-weight: 500;
      font-size: 22px;
      color: rgba(34, 34, 34, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.actived {
      border-radius: 24px;
      background: #198cff;
      .day,
      .people,
      .week {
        color: #fff;
      }
    }
  }

  .wrap {
    display: inline-flex;
  }
}

.calender {
  padding-top: 12px;
  background-color: #fff;
}

.normal_text_color {
  color: rgba(34, 34, 34, 0.4);
  font-size: 24px;
}

.small {
  font-size: 14px !important;
  line-height: 20px !important;
}
.small-week {
  font-size: 14px !important;
  line-height: 48px !important;
}
.w-14 {
  width: 14.285vw;
}
.f-42px {
  font-size: 42px;
}
.calender-icon {
  width: 90px;
  padding-right: 32px;
  padding-left: 22px;
}
.bottom_arrow {
  &_date {
    padding: 0 32px 6px 32px;
    &_timer {
      font-size: 24px;
      align-items: center;
      span {
        color: #888f98;
        padding: 0 16px;
        position: relative;
        height: 45px;
        line-height: 45px;
        font-size: 26px;
        font-weight: 500;
        &::before {
          content: '';
          width: 1px;
          height: 20px;
          background-color: #e1e1e1;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        &:first-of-type {
          font-size: 32px;
          color: #222222;
          padding: 0 16px 0 0;
          &::before {
            display: none;
          }
        }
      }
      .back_today {
        color: #198cff;
      }
    }
    .iconfont {
      font-size: 42px;
      margin-left: 32px;
    }
    .highLight {
      color: #198cff;
    }
  }
}
.bottom_arrow_show {
  .iconfont {
    color: #9b9b9b;
    font-size: 22px;
    position: relative;
    &::after {
      content: '';
      border-radius: 8px;
      background: #f8f8f8;
      width: 32px;
      height: 32px;
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: -1;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
