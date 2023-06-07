<script setup>
import { getClientInfo, getOrderInfo, getWorkWechatConfig } from '@/api/user'
import { agentConfig } from '@/utils/wxconfig'
import { reactive, ref } from 'vue'

const parm = reactive({
    phone: '',
    page: 1,
    page_size: 20
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

// 获取的企业微信授权初始化jsdk
const getWxConfig = async () => {
    try {
        const { code, data } = await getWorkWechatConfig({url: location.href})
        if (code === 200) {
            agentConfig(data.config, () => {
                wx.invoke('getCurExternalContact', {}, function (res) {
                    if (res.err_msg == "getCurExternalContact:ok") {
                        getInfo(res.userId)
                    } else {
                        //错误处理
                    }
                })
            })
        }
    } catch (error) {
        
    }
}

// 跳转到CRM
const toCrm = (item) => {
    // window.open('https://www.baidu.com#target=out')
    const query = `client_id=${item.client_id}&order_id=${item.order_id}&customer_id=${item.customer_id}&order_task_id=${item.order_task_id}&task_key=${item.task_key}`
    wx.invoke('openDefaultBrowser', {
        url: `${import.meta.env.VITE_CRM_SERVERURL}/work_wechat?${query}`
    }, function (res) {
        if (res.err_msg == "openDefaultBrowser:ok") {
            console.log('跳转成功！')
        } else {
            //错误处理
        }
    })
}

getWxConfig()


</script>

<template>
    <div class="order-list" v-if="orderData.length > 0">
        <div class="mt-10">咨询用户：<span class="c-3c86f8">{{ clientName }}</span></div>
        <div class="order-info mt-10" v-for="(item, index) in orderData" :key="index"  @click="toCrm(item)">
            <van-row>
                <van-col class="label-w120">订单ID：<span class="c-3c86f8">{{ item.order_id }}</span></van-col>
                <van-col class="flex-1">合同编号：<span class="c-3c86f8">{{ item.order_sn }}</span></van-col>
            </van-row>
            <van-row>
                <van-col class="label-w120">签约人：<span class="c-3c86f8">{{ item.sign_name }}</span></van-col>
                <van-col class="flex-1">主申：<span class="c-3c86f8">{{ item.sign_name }}</span></van-col>
            </van-row>
            <van-row>
                <van-col>服务产品：</van-col>
                <van-col class="flex-1">{{ item.product_name }}</van-col>
            </van-row>
            <van-row>
                <van-col>当前任务：</van-col>
                <van-col class="flex-1">{{ item.task_name }}</van-col>
            </van-row>
        </div>
    </div>
    <van-empty v-if="isEmpty" description="暂无订单" />
</template>

<style scoped lang="less">
.order-list {
    height: 100vh;
    overflow-y: auto !important;
    overflow: hidden;
    background: #f1f1f1;
    padding: 0 15px 15px;
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
