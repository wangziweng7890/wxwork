<script lang="ts" setup>
import { getMonthInfo } from '@/api/daily_affairs'

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

const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}-${date.getDate()< 10 ? ('0' + (date.getDate())) : date.getDate() 
}`;
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
        filterData.value.go_time = [`${formatDate(start)} 00:00`, `${formatDate(end)} 23:59:59`]
    } else if (props.type === 'start_end') {
        filterData.value.start_time = formatDate(start)
        filterData.value.end_time = formatDate(end)
    }
    time_text.value = `${formatDate(start)} - ${formatDate(end)}`;
};
const clickPicker = () => {
    showCalendar.value = true;
}
const calendarInfo = ref([])
// 获取月份信息
const getMonthDetail = (values: any) => {
    getMonthInfo({
        date_month: values
    }).then((res: any) => {
        const { data } = res;
        calendarInfo.value.push(...data)
    })
}
// 可选时间区间
const minDate = ref(new Date(2016, 1, 1))
const maxDate = ref(new Date(2030, 1, 1))
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
            v-model:show="showCalendar"
            type="range"
            @confirm="confirmDate"
            :allow-same-day="true"
            :min-date="minDate"
            :max-date="maxDate"
            @month-show="showMonth"
        >
        <template #top-info="date">
       <div>     {{ locale === 'HK' ? filterDay(date).traditional_holiday : filterDay(date).holiday || '' }}</div>
        </template>
        <template #bottom-info="date">
            {{ filterDay(date).people || 0 }} 人
        </template>
        </van-calendar>
    </div>
</template>
<style lang="scss" scoped>
  .van-field {
        padding: 25px 42px;
    }
</style>