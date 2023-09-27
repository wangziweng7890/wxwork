<script lang="ts" setup>
import WorkerPopup from './worker_popup.vue'
import { useUserStore } from '@/stores/modules/user'
const { workmateList } = useUserStore() as any
const {t}=useI18n()
const props = defineProps({
    filterData: Object,
    role_key: String,
    // loaclDate: String
});
const emit = defineEmits(['update:filterData', 'getTransactionList'])
const formData = computed({
    get: () => props.filterData,
    set: value => {
        emit('update:filterData', value)
    },
})
const showPicker = ref(false);
// 展示同事弹窗
const showWorker = ref(false);
const columns = ref([])

const showCalendar = ref(false)
const customFieldName = ref({
      text: 'label',
      value: 'value',
    })
// 打开弹出层的类型
const picker_type =  ref('')
// 打开弹出层
const openPicker = (type?: string) => {
    // type = ''/时间选择，user_id/同事选择，address/地点选择，task_status/状态选择
    picker_type.value = type
    if (type === 'create_at') {
        showCalendar.value = true
        return 
    } else if (type === 'user_id') {
        showWorker.value = true
    } else {
        showPicker.value = true
    }
}
// 过滤展示标题
const picker_title = () => {
    switch (picker_type.value) {
        case 'user_id':
            return t('message.choose_worker');
        case 'address':
        columns.value = [
                {
                    label: '入境无要求',
                    value: 1
                },
                {
                    label: '港岛办事处(湾仔)',
                    value: 2
                },
                {
                    label: '火炭办事处(火炭)',
                    value: 3
                },
                {
                    label: '屯门办事处(屯门)',
                    value: 4
                },
                {
                    label: '元朗办事处(元朗)',
                    value: 5
                },
                {
                    label: '九龙办事处(长沙湾)',
                    value: 6
                },
                {
                    label: '观塘办事处(观塘)',
                    value: 7
                },
            ]
            return t('message.address');
        case 'task_status':
        columns.value = [
                {
                    label: t('message.waitDistributed'),
                    value: 0
                },
                {
                    label: t('message.waitProcessed'),
                    value: 1
                },
                {
                    label: t('message.processed'),
                    value: 2
                },
                {
                    label: t('message.licensed'),
                    value: 3
                },
            ]
            return t('message.choose_status');
        default:
            break;
    }
}
const create_at = ref('')

// 过滤时间
const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const fliterValue = () => {
    const user = workmateList.find((item: any) => item.id === formData.value.user_id) as any
    const status = columns.value.find((item: any) => item.value === formData.value.task_status) as any
    return {
        user_name: user ? user.wework_name : '',
        status_name: status ? status.label : ''
    }
}
// popup弹出层确认
const onConfirm = (values) => {
    if (picker_type.value === 'create_at') {
        const [start, end] = values;
        formData.value.start_time = formatDate(start)
        formData.value.end_time = start === end ? '' : formatDate(end)
        create_at.value = formatDate(start) + ' - ' + formatDate(end)
        showCalendar.value = false
    } else {
        const { selectedOptions } = values
        formData.value[picker_type.value] = picker_type.value === 'address' ? selectedOptions[0]?.label : selectedOptions[0]?.value
        showPicker.value = false
        if (!!formData.value.user_id || !!formData.value.task_status) {
            fliterValue()
        }
    }
}
const new_date = () => {
  const newDate = new Date()
  return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
}
// 确定搜索或重置
const search = (type?: string) => {
    if (type) {
        // 重置表单
        Object.keys(formData.value).map((item: string) => {
            formData.value[item] = ''
        })
        formData.value.start_time = new_date()
        create_at.value = ''
    } else {
        formData.value.is_convert = !!create_at.value ? 1 : 0
        emit('getTransactionList', true)
    }
}

</script>
<template>
    <div class="search">
        <div class="search_title">
            {{ t('message.flter_text') }}
        </div>
        <!-- <van-form @submit="onSubmit"> -->
        <van-cell-group inset>
            <van-field
                v-model="formData.customer_name"
                name="customer_name"
                :label="t('message.custer_name')"
                :placeholder="t('message.not_input')"
            />
            <van-field
                v-model="fliterValue().user_name"
                is-link
                readonly
                name="user_id"
                :label="t('message.worker_name')"
                :placeholder="t('message.not_checked')"
                @click="openPicker('user_id')"
                v-if="!!props.role_key"
            />
            <van-field
                v-model="create_at"
                is-link
                readonly
                name="create_at"
                :label="t('message.timer')"
                :placeholder="t('message.not_checked')"
                @click="openPicker('create_at')"
            />
            <van-field
                v-model="formData.address"
                is-link
                readonly
                name="address"
                :label="t('message.address')"
                :placeholder="t('message.not_checked')"
                @click="openPicker('address')"
            />
            <van-field
                v-model="fliterValue().status_name"
                is-link
                readonly
                name="task_status"
                :label="t('message.status_text')"
                :placeholder="t('message.not_checked')"
                @click="openPicker('task_status')"
            />
        </van-cell-group>
        <div style="margin: 16px;" class="action_bottom flex-jusify-between d-flex">
            <div class="reset flex-center-center" @click="search('reset')">
                重置
            </div>
            <div class="confirm flex-center-center" @click="search()">
                确定
            </div>
        </div>
        <!-- </van-form> -->
        <van-popup
            v-model:show="showPicker"
            position="bottom"
            round
            :confirmButtonext="t('message.confirm_text')"
        >
            <van-picker
                :columns="columns"
                @confirm="onConfirm"
                @cancel="showPicker = false"
                :columns-field-names="customFieldName"
                :class="{address: picker_type == 'address'}"
            >
            <template #title>
                <div class="popup_title">
                    {{ picker_title() }}
                </div>
            </template>
            </van-picker>
        </van-popup>
        <van-calendar v-model:show="showCalendar" type="range" @confirm="onConfirm" :allow-same-day="true">
        </van-calendar>
        <WorkerPopup v-model:showWorker="showWorker" v-model:formData="formData"/>
    </div>
</template>
<style lang="scss" scoped>
.search {
    font-weight: 500;
    &_title {
        font-size: 34px;
        padding: 0 42px;
        height: 110px;
        position: relative;
        display: flex;
        align-items: center;

        &::after {
            content: '';
            position: absolute;
            height: 1px;
            width: calc(100% - 84px);
            bottom: 0;
            left: 42px;
            background: #F0F0F0;
        }
    }
    .van-cell-group--inset {
        margin: 0;
        .van-field {
            padding: 25px 42px;
        }
    }
}
.popup_title {
    font-size: 34px;

}
:deep(.van-picker__toolbar) {
    position: relative;
    &::after {
        position: absolute;
        content: '';
        width: calc(100% - 64px);
        height: 1px;
        background: #f0f0f0;
        bottom: 0;
        left: 32px;
    }
}
:deep(.van-picker__frame) {
    border-radius: 16px;
    background: rgba(68, 135, 249, 0.06);   
    &::after {
        border: none;
    }
}
.action_bottom {
    div {
        border-radius: 16px;
        height: 88px;
    }
    .reset {
        background: #F8F9FB;
        width: 172px;
        margin-right: 20px;
    }
    .confirm {
        color: #fff;
        background: #198CFF;
        flex: 1;
    }
}
.address {
    :deep(.van-ellipsis) {
        width: 100%;
        padding-left: 64px;
    }
}
</style>
