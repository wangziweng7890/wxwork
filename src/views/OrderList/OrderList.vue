<script setup>
import { useRoute } from 'vue-router'
import { getUserInfo } from '@/api/user'
const route = useRoute()
console.log("理由参数：", route.query)
const getInfo = async () => {
    const data = await getUserInfo({code: route.query.code})
    console.log(data, '获取用户信息')
}
getInfo()
</script>

<template>
    <div class="order-list">
        <div class="mt-10">咨询用户：<span class="c-3c86f8">张朝阳</span></div>
        <div class="order-info mt-10" v-for="(item,index) in 2" :key="index">
            <van-row>
                <van-col class="label-w120">订单ID：<span class="c-3c86f8">12880</span></van-col>
                <van-col class="flex-1">合同编号：<span class="c-3c86f8">22YKHY0300013</span></van-col>
            </van-row>
            <van-row>
                <van-col class="label-w120">签约人：<span class="c-3c86f8">12880</span></van-col>
                <van-col class="flex-1">主申：<span class="c-3c86f8">12880</span></van-col>
            </van-row>
            <van-row>
                <van-col>服务产品：</van-col>
                <van-col class="flex-1">香港优才3万</van-col>
            </van-row>
            <van-row>
                <van-col>当前任务：</van-col>
                <van-col class="flex-1">文书制作、文书及表格审核【审案】、证件审核、文书上传</van-col>
            </van-row>
        </div>
    </div>
</template>

<style scoped lang="less">
.order-list {
    height: 100vh;
    overflow: hidden;
    background: #f1f1f1;
    padding: 0 15px;
    .order-info {
        font-size: 13px;
        background: #fff;
        padding: 10px 15px;
        border-radius: 10px;
        .label-w120 {
            min-width: 120px;
        }
        .van-row {
            line-height: 25px;
        }
    }
}

</style>
