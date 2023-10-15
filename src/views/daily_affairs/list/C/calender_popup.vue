<!--
 * @Author: Autumn.again
 * @Date: 2023-09-28 14:37:34
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-10-08 16:36:42
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\list\C\calender_popup.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script lang="ts" setup>
import { getMonthInfo } from '@/api/daily_affairs'
import dayjs from 'dayjs'
const {t, locale} = useI18n()
// 展开日历
const showCalendar = ref(false)
const props = defineProps({
    formData: Object,
    type: String,
});
const emit = defineEmits(['update:formData'])
const filterData = computed({
    get: () => props.formData,
    set: value => {
        emit('update:formData', value)
    },
})

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD')
// 时间文本
const time_text = ref('')
// 抛出数值
defineExpose({
    time_text,
});

const confirmDate = (values) => {
    const [start, end] = values;
    showCalendar.value = false;
    if (props.type === 'go_time') {
        filterData.value.go_time = [`${formatDate(start)} 00:00:00`, `${formatDate(end)} 23:59:59`]
    } else if (props.type === 'start_end') {
        filterData.value.start_time = formatDate(start)
        filterData.value.end_time = formatDate(end)
        filterData.value.hideWeekCandeler = 1
    }
    time_text.value = `${formatDate(start)} - ${formatDate(end)}`;
};
const clickPicker = () => {
    showCalendar.value = true;
}
const calendarInfo = ref([])
// 获取月份信息
const getMonthDetail = (values: any) => {
    return getMonthInfo({
        date_month: values
    }).then((res: any) => {
        const { data } = res;
        calendarInfo.value.push(...data)
    })
}

// 可选时间区间
const minDate = ref()
const maxDate = ref()

onMounted(() => {
    const new_date = new Date()
    const new_date_year = new_date.getFullYear()
    minDate.value = new Date(new_date_year - 6, 1, 1)
    maxDate.value = new Date(new_date_year + 6, 1, 1)
})
// 月份曝光只会执行一次
const showMonth = async (e: any) => {
    const date = formatDate(e.date)
    await getMonthDetail(date)
}
const filterDay = (values: any) => {
    const new_date = new Date(values.date)
    const date = formatDate(new_date)
    const finded = calendarInfo.value.find((item: any) => item.datetime === date)
    return finded || {}
}
</script>
<template>
    <div class="calender">
        <van-field
            v-model="time_text"
            is-link
            readonly
            :label="t('message.timer')"
            :placeholder="t('message.not_checked')"
            @click="clickPicker"
            />
        <van-calendar
          v-if="showCalendar"
            v-model:show="showCalendar"
            type="range"
            @confirm="confirmDate"
            :allow-same-day="true"
            :min-date="minDate"
            :max-date="maxDate"
            @month-show="showMonth"
        >
        <template #top-info="date">
            <div class="top_info">{{ locale === 'HK' ? filterDay(date).traditional_holiday : filterDay(date).holiday || '' }}</div>
        </template>
        <template #bottom-info="date">
            {{ filterDay(date).people || 0 }} 人
        </template>
        </van-calendar>
    </div>
</template>
<style lang="scss" scoped>
.calender {
    padding: 25px 42px 0;
}
  .van-field {
        // padding: 25px 42px;
        border-bottom: 1px solid var(--van-cell-border-color);
        padding:0 0 25px;
    }
    .top_info {
        font-size: 16px;
        line-height: 20px;
    }
</style>