<script lang="ts" setup name="serch_detail">
import PendingList from "./C/pending_list.vue";
import { showToast } from 'vant';
const value = ref('');
const onSearch = (val) => showToast(val);
const onClickButton = () => {
    console.log('搜索-------------->')
}
const listData = ref([
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '',
        visa_type: 1,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 1,
        message: ''
    },
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '香港同事A',
        visa_type: 3,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 2,
        message: ''
    },
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '',
        visa_type: 1,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 3,
        message: ''
    },
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '香港同事BBB',
        visa_type: 1,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 4,
        message: ''
    },
])
</script>
<template>
    <div class="detail flex-direction-column">
        <van-search
            v-model="value"
            show-action
            label=""
            :left-icon="''"
            placeholder="输入客户姓名"
            @search="onSearch"
            shape="round"
        >
            <template #action>
                <div @click="onClickButton" class="search_button">搜索</div>
            </template>
        </van-search>
        <PendingList :listData="listData"/>
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
</style>
