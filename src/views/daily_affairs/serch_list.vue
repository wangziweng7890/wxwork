<!--
 * @Author: Autumn.again
 * @Date: 2023-09-20 13:44:22
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-25 15:40:47
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\serch_list.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script lang="ts" setup name="serch_detail">
import PendingList from "./C/pending_list.vue";
import { getTransactionTaskList } from '@/api/daily_affairs'

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

const listData = ref([])

// 点击搜索按钮
const onClickButton = async () => {
    const res = await getTransactionTaskList(filterData) as any
    if (res.code === 200) {
        listData.value = res.data
    }
}
</script>
<template>
    <div class="detail flex-direction-column">
        <van-search
            v-model="filterData.customer_name"
            show-action
            label=""
            :left-icon="''"
            placeholder="输入客户姓名"
            @search="onClickButton"
            shape="round"
        >
            <template #action>
                <div @click="onClickButton" class="search_button">搜索</div>
            </template>
        </van-search>
        <PendingList :listData="listData" v-if="listData.length"/>
        <div class="not_data flex-center-center" v-else>
            暂无搜索数据
        </div>
    </div>
</template>
<style lang="scss" scoped>
.detail {
    background: #F8F8F8;
    .search_button {
        font-size: 28px;
        color: #198CFF;
    }
}
:deep(.van-search) {
    padding: 24px 32px;
    .van-search__action {
        padding: 0;
        margin-left: 24px;
    }
}
.not_data {
    font-size: 28px;
    padding-top: 50px;
    color: #999;
}
</style>
