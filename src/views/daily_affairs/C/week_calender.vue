<!--
 * @Author: Autumn.again
 * @Date: 2023-09-19 13:53:38
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-20 16:39:45
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\C\week_calender.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script setup lang="ts">
// const chooseDate = ref('')

const props = defineProps({
    date: String
});
const emit = defineEmits(['update:date', 'click_action'])
// const emit = defineEmits<{
//     (e: 'update:date', value: String): void
//     (e: 'update:date', value: String): void
//  }>()

const chooseDate = computed({
    get: () => props.date,
    set: value => {
        emit('update:date', value)
    },
})

const calendar = ref(null);
const today_content = ref('')
// 选择日期变更
const dateClickhandler = (val: any) => {
  chooseDate.value = val
}

// 过滤每天展示在日历当中的参数
const filterDay = (scope: any) => {
    let day_text = ''
    day_text = scope?.date.day == 1 ? `${scope?.date.month + 1}月` : scope?.date.day
    return scope?.extendAttr.isToday ? '今' : day_text
}

// 过滤展示天数
const filter_text = ref('日一二三四五六')
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
}
// 是否今天
const show_back_today = () => {
    return today_content.value !== chooseDate.value
}
onMounted(() => {
    today_content.value = chooseDate.value
})
const click_action = () => {
    emit('click_action')
}
</script>
<template>
    <div class="calender">
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
                <div class="lunar-content">
                <div class="lunar-content_day">{{ filterDay(scope) }} </div>
                <div class="lunar-content_people normal_text_color"> 7人</div>
                </div>
            </template>
            <template #arrow="scope">
                <div class="bottom_arrow">
                    <div class="bottom_arrow_show">
                        {{ scope?.isShowWeek ? '展开' : '收起' }}
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
                <span @click="backToday" v-if="show_back_today()" class="back_today">
                    回今天
                </span>
            </div>
            <!-- <div @click="click_action">
                icon
            </div> -->
            <van-icon name="more-o" @click="click_action" class="action_iocn"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.calender {
    padding-top: 12px;
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
    }
}
.calendar_day_checked {
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
                }
            }
            .back_today {
                    color: #198CFF;
                }
        }
    }
}
.action_iocn {
    font-size: 38px;
}
</style>