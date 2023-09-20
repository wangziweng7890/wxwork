<script lang="ts" setup>
const showPicker = ref(false);
const columns = [
    { text: '杭州', value: 'Hangzhou' },
    { text: '宁波', value: 'Ningbo' },
    { text: '温州', value: 'Wenzhou' },
    { text: '绍兴', value: 'Shaoxing' },
    { text: '湖州', value: 'Huzhou' },
]
const onConfirm = ({ selectedOptions }) => {
    showPicker.value = false
}

const filterData: filter_params = reactive({
    customer_name: '',
    fellow_name: '', // 香港同事
    adress: '',// 地点
    status: '',// 状态
    create_at: ''
})
// 打开弹出层的类型
const picker_type =  ref('')
// 打开弹出层
const openPicker = (type?: string) => {
    // type = ''/时间选择，fellow_name/同事选择，adress/地点选择，status/状态选择
    picker_type.value = type
    showPicker.value = true
}
// 过滤展示标题
const picker_title = () => {
    switch (picker_type.value) {
        case 'fellow_name':
            return '请选择香港同事';
        case 'adress':
            return '入境处地点';
        case 'status':
            return '请选择状态';
        default:
            break;
    }
}
const showCalendar = ref(false)
</script>
<template>
    <div class="search">
        <div class="search_title">
            筛选
        </div>
        <!-- <van-form @submit="onSubmit"> -->
        <van-cell-group>
            <van-field
                v-model="filterData.customer_name"
                name="客户姓名"
                label="客户姓名"
                placeholder="请输入"
            />
            <!-- <van-cell title="香港同事" :value="filterData.fellow_name" @click="openPicker('fellow_name')" is-link/> -->
            <van-field
                v-model="filterData.fellow_name"
                is-link
                readonly
                name="picker"
                label="香港同事"
                placeholder="请选择"
                @click="openPicker('fellow_name')"
            />
            <van-cell title="时间" :value="filterData.create_at" @click="showCalendar = true" is-link/>
            <van-field
                v-model="filterData.adress"
                is-link
                readonly
                name="picker"
                label="地点"
                placeholder="请选择"
                @click="openPicker('adress')"
            />
            <van-field
                v-model="filterData.status"
                is-link
                readonly
                name="picker"
                label="状态"
                placeholder="请选择"
                @click="openPicker('status')"
            />
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
            提交
            </van-button>
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
// :deep(.van-picker-column__item--selected) {
//     border-radius: 16px;
//     background: rgba(68, 135, 249, 0.06);   
// }
:deep(.van-picker__frame) {
    border-radius: 16px;
    background: rgba(68, 135, 249, 0.06);   
    &::after {
        border: none;
    }
}
</style>
