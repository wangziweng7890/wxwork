<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()
const router = useRouter()

// 企业微信静默授权重定向获取code
const getWorkCode = () => {
    const appid = 'ww12f0c60e7eb68bc3'
    const redirect_uri = encodeURIComponent('http://test.workh5.galaxy-immi.com/login')
    const agentid = '1000180'
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=STATE&agentid=${agentid}#wechat_redirect`
    return url
}

if (userStore.getToken) {
    router.push('/order_list')
} else {
    window.location.href = getWorkCode()
}

</script>