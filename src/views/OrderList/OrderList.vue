<script setup>
import { getClientInfo, getOrderInfo } from '@/api/user'
import { reactive, ref } from 'vue'
import * as wx from '@wecom/jssdk'

const parm = reactive({
    phone: '',
    page: 1,
    page_size: 500
})

const orderData = ref([])
const clientName = ref('')
const isEmpty = ref(false)

// 获取客户信息
const getInfo = async (userId) => {
    try {
        const { code, data } = await getClientInfo({ user_id: userId })
        if (code === 200) {
            parm.phone = data.user_info.mobile
            clientName.value = data.user_info.nickname
            getOrderList()
        }
    } catch (error) {

    }
}

// 订单接口
const getOrderList = async () => {
    try {
        const { code, data } = await getOrderInfo(parm)
        if (code === 200) {
            orderData.value = data.list || []
            if (data.list.length === 0) {
                isEmpty.value = true
            }
        }
    } catch (error) {

    }
}

// 跳转到CRM
const toCrm = async (item) => {
    // window.open('https://www.baidu.com#target=out')
    const query = `client_id=${item.client_id}&order_id=${item.order_id}&customer_id=${item.customer_id}&order_task_id=${item.order_task_id}&task_key=${item.task_key}`
    await wx.openDefaultBrowser({
        url: `${import.meta.env.VITE_CRM_SERVERURL}/work_wechat?${query}`
    })
}

// 获取的企业微信授权初始化jsdk
const getWxConfig = async () => {
  try {
    const res = await wx.getCurExternalContact()
    getInfo(res.userId)
  } catch (error) {
    setTimeout(async () => {
      const res = await wx.getCurExternalContact()
      getInfo(res.userId)
    }, 1000)
  }
}

getWxConfig()
</script>

<template>
    <div class="order-list c-90" v-if="orderData.length > 0">
        <div class="order-title mt-10 c-222 fs-16">咨询用户：<span class="c-357FE2 fw-bold">{{ clientName }}</span></div>
        <div class="order-info fs-12" v-for="(item, index) in orderData" :key="index"  @click="toCrm(item)">
            <van-row>
                <van-col span="11">
                    <span class="label">订单ID</span>
                    <span class="c-357FE2">{{ item.order_id }}</span>
                </van-col>
                <van-col span="13">
                    <span class="label">合同编号</span>
                    <span class="c-357FE2">{{ item.order_sn }}</span>
                </van-col>
            </van-row>
            <van-row>
                <van-col span="11">
                    <span class="label">签约人</span>
                    <span class="c-357FE2">{{ item.sign_name }}</span>
                </van-col>
                <van-col span="13">
                    <span class="label">主申人</span>
                    <span class="c-357FE2">{{ item.information_username }}</span>
                </van-col>
            </van-row>
            <van-row>
                <van-col class="label">服务产品</van-col>
                <van-col class="flex-1 c-222">{{ item.product_name }}</van-col>
            </van-row>
            <van-row>
                <van-col class="label">当前任务</van-col>
                <van-col class="flex-1 c-222 order-task">{{ item.task_name }}</van-col>
            </van-row>
        </div>
        <div class="tc c-90 fs-12">已显示全部订单</div>
    </div>
    <van-empty v-if="isEmpty" description="暂无订单" />
</template>

<style scoped lang="less">
.order-list {
    height: 100vh;
    overflow-y: auto !important;
    overflow: hidden;
    background: #F4F5FA;
    padding: 0 8px;
    .order-title {
        border-left: 4px solid #357FE2;
        height: 16px;
        line-height: 16px;
        padding-left: 8px;
        margin: 16px 0;
        font-weight: bold;
    }
    .order-info {
        background: #fff;
        padding: 10px 15px;
        border-radius: 10px;
        margin-bottom: 8px;
        cursor: pointer;
        span {
            display: inline-block;
        }
        .label {
            min-width: 55px;
        }
        .van-row {
            line-height: 35px;
        }
    }
    .order-footer {
        padding: 0 0 24px;
    }
}

</style>
