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
    date: String,
    role_key: Boolean, // 是否是主管
    highLight: Boolean,
    language: String, //语言, 默认繁体
});
const emit = defineEmits(['update:date', 'click_action'])
const chooseDate = computed({
    get: () => props.date,
    set: value => {
        emit('update:date', value)
    },
})
const loading = ref(false)
const calendar = ref(null);
const calendarInfo = ref([])

// 选择日期变更
const dateClickhandler = (val: any) => {
  chooseDate.value = val
}

// 过滤每天展示在日历当中的参数
const filterDay = (scope: any) => {
    const calendar_day = calendarInfo.value[scope?.date.day -1]
    let day_text = ''
    if (scope?.date.day == 1) {
        day_text = `${scope?.date.month + 1}月`
    } else {
        day_text = scope?.date.day
    }
    if (calendar_day && calendar_day.holiday) {
        day_text = props.language === 'ZH' ? calendar_day.holiday : calendar_day.traditional_holiday
    }
    const people = calendar_day ? calendar_day.people : ''
    return {
        day: scope?.extendAttr.isToday ? '今' : day_text,
        // people: people ? `${people}人` : ''
        people: `${people}人`
    }
}

// 判断是否是这个年月份，减少数据过滤
const isFullDate = (scope: any) => {
    const {year, month} = scope?.date
    const date_content = chooseDate.value.split('-')
    return Number(date_content[0]) === year && Number(date_content[1]) === (month + 1)
}

// 过滤展示天数
const filter_text = ref('日一二三四五六')

// 过滤底部日期展示
const arrow_date = () => {
    const week_day = '星期' + filter_text.value[new Date(chooseDate.value).getDay()]
    const date = chooseDate.value.split('-')
    const date_content = date[0] + '年' + date[1] + '月' + date[2] + '日'
    const params = {
        date_content,
        week_day
    }
    return  params
}

// 回到今天
const backToday = () => {
    calendar.value.today()
    chooseDate.value = dayjs().format('YYYY-MM-DD')
}
// 导出方法
defineExpose({
    backToday
})
// 是否今天
const show_back_today = computed(() => {
    return !dayjs().isSame(chooseDate.value, 'day')
})

// 操作栏
const click_action = (type?: number) => {
    emit('click_action', type)
}
// 监听年月份改变，则重新获取过滤信息
watch(() => props.date, (newVal, oldVal) => {
    const new_date = new Date(newVal)
    const old_date = new Date(oldVal)
    if (new_date.getFullYear() !== old_date.getFullYear() || new_date.getMonth() !== old_date.getMonth()){
        getMonthDetail(newVal)
    }
})
// 获取月份信息
const getMonthDetail = (values: any) => {
    getMonthInfo({
            date_month: values
        }).then((res: any) => {
            calendarInfo.value = res.data
        })
}
// 初始化日期
onMounted(() => {
    loading.value = true
    if (!calendarInfo.value.length && chooseDate.value) {
        getMonthDetail(chooseDate.value)
    }
})
</script>
<template>
    <div class="calender" v-if="loading">
        <vue-hash-calendar
            select-type="single"
            :show-arrow="true"
            picker-type="date"
            format="YY-MM-DD"
            @change="dateClickhandler"
            :show-week-view="true"
            :show-action="false"
            ref="calendar"
        >
            <!-- <template #action>
                <div class="">我是自定义的操作栏</div>
            </template> -->
            <template v-slot:week="scope">
                <div class="normal_text_color">{{ `周${scope?.week}` }}</div>
            </template>
            <template v-slot:day="scope">
                <div class="lunar-content" v-if="isFullDate(scope)">
                    <div class="lunar-content_day" :class="{small: filterDay(scope).day.length > 3}">{{ filterDay(scope).day }} </div>
                    <div class="lunar-content_people normal_text_color">{{ filterDay(scope).people }}</div>
                </div>
                <div v-else>
                    {{ scope?.date.day }}
                </div>
            </template>
            <template #arrow="scope">
                <div class="bottom_arrow">
                    <div class="bottom_arrow_show">
                        <i class="iconfont" :class="scope?.isShowWeek ? 'icon-expand' : 'icon-retract'"></i>
                    </div>
                </div>
            </template>
        </vue-hash-calendar>
        <!-- 不可放在插槽#arrow="scope"中，因为整个arrow插槽都是触发展开收起的容器 -->
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
                    <i class="iconfont icon-icon_luodou" @click="click_action(1)" :class="{highLight: highLight}"></i>
                </div>
                <i class="iconfont icon-a-icon_Otherinformation" @click="click_action(2)"></i>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.calender {
    padding-top: 12px;
    background-color: #fff;
}
:deep(.calendar_day) {
  border-radius: 24px;
}
:deep(.calendar_group) {
  .calendar_day  {
    height: 120px;
    width: 100%;
  }
}
.normal_text_color {
    color: rgba(34, 34, 34, 0.40);
    font-size: 24px;
}
.lunar-content {
    font-size: 30px;
    &_people {
        font-size: 20px;
        text-align: center;
        height: 28px;
    }
    &_day {
        font-weight: 500;
        text-align: center;
    }
    .small {
        font-size: 18px;
    }
}
:deep(.calendar_day_checked ){
    background: #198CFF;
    .lunar-content_people {
        color: #fff;
    }
}
.bottom_arrow {
    &_date {
        padding: 0 32px 32px;
        &_timer {
            font-size: 24px;
            align-items: center;
            span {
                color: #888F98;
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
                    background-color: #E1E1E1;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
                &:first-of-type {
                    font-size: 32px;
                    color: #222222;
                    padding:0 16px 0 0;
                    &::before {
                        display: none;
                    }
                }
            }
            .back_today {
                    color: #198CFF;
                }
        }
        .iconfont {
            font-size: 42px;
            margin-left: 32px;
        }
        .highLight {
            color: #198CFF;
        }
    }
}
.bottom_arrow_show {
    .iconfont {
        color: #9B9B9B;
        font-size: 22px;
        position: relative;
        &::after {
            content: '';
            border-radius: 8px;
            background: #F8F8F8;
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