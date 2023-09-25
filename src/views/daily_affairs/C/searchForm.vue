<script lang="ts" setup>
const props = defineProps({
    filterData: Object,
    role_key: String,
});
const emit = defineEmits(['update:filterData'])
const formData = computed({
    get: () => props.filterData,
    set: value => {
        emit('update:filterData', value)
    },
})
const showPicker = ref(false);
const columns = ref([])

const showCalendar = ref(false)
const customFieldName = {
      text: 'label',
      value: 'value',
    };
// 打开弹出层的类型
const picker_type =  ref('')
// 打开弹出层
const openPicker = (type?: string) => {
    // type = ''/时间选择，user_id/同事选择，address/地点选择，task_status/状态选择
    picker_type.value = type
    if (type === 'create_at') {
        showCalendar.value = true
        return 
    } else {
        showPicker.value = true
    }
}
// 过滤展示标题
const picker_title = () => {
    switch (picker_type.value) {
        case 'user_id':
        columns.value = [
                {
                    label: '田博恩',
                    value: 1
                },
                {
                    label: '林夕戏',
                    value: 2
                },
                {
                    label: '林大咩',
                    value: 3
                },
            ]
            return '请选择香港同事';
        case 'address':
        columns.value = [
                {
                    label: '东九龙办事处',
                    value: 1
                },
                {
                    label: '西九龙办事处',
                    value: 2
                },
                {
                    label: '沙田办事处',
                    value: 3
                },
                {
                    label: '香港湾仔告士打道7号入境事务大楼',
                    value: 4
                },
                {
                    label: '火炭办事处',
                    value: 5
                },
                {
                    label: '屯门办事处',
                    value: 6
                },
                {
                    label: '元朗办事处',
                    value: 7
                },
            ]
            return '入境处地点';
        case 'task_status':
        columns.value = [
                {
                    label: '待办理',
                    value: 1
                },
                {
                    label: '待分配',
                    value: 2
                },
                {
                    label: '已办理',
                    value: 3
                },
                {
                    label: '已领证',
                    value: 4
                },
            ]
            return '请选择状态';
        default:
            break;
    }
}
// 过滤时间
const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

// popup弹出层确认
const onConfirm = (values) => {
    if (picker_type.value === 'create_at') {
        const [start, end] = values;
        formData.value.create_at = formatDate(start) + ' — ' + formatDate(end)
        showCalendar.value = false
    } else {
        const { selectedOptions } = values
        formData.value[picker_type.value] = selectedOptions[0]?.label
        showPicker.value = false
    }
}
</script>
<template>
    <div class="search">
        <div class="search_title">
            筛选
        </div>
        <!-- <van-form @submit="onSubmit"> -->
        <van-cell-group inset>
            <van-field
                v-model="formData.customer_name"
                name="客户姓名"
                label="客户姓名"
                placeholder="请输入"
            />
            <van-field
                v-model="formData.user_id"
                is-link
                readonly
                name="user_id"
                label="香港同事"
                placeholder="请选择"
                @click="openPicker('user_id')"
                v-if="!!props.role_key"
            />
            <van-field
                v-model="formData.create_at"
                is-link
                readonly
                name="create_at"
                label="时间"
                placeholder="请选择"
                @click="openPicker('create_at')"
            />
            <van-field
                v-model="formData.address"
                is-link
                readonly
                name="address"
                label="地点"
                placeholder="请选择"
                @click="openPicker('address')"
            />
            <van-field
                v-model="formData.task_status"
                is-link
                readonly
                name="task_status"
                label="状态"
                placeholder="请选择"
                @click="openPicker('task_status')"
            />
        </van-cell-group>
        <div style="margin: 16px;" class="action_bottom flex-jusify-between d-flex">
            <div class="reset flex-center-center">
                重置
            </div>
            <div class="confirm flex-center-center">
                确定
            </div>
        </div>
        <!-- </van-form> -->
        <van-popup
            v-model:show="showPicker"
            position="bottom"
            round
        >
            <van-picker
                :columns="columns"
                @confirm="onConfirm"
                @cancel="showPicker = false"
                :columns-field-names="customFieldName"
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
</style>
