import api from '@/utils/request'
import { http } from '@/utils/request'
import { useUserStore } from "@/stores/modules/user";

// 获取oss /common/sts-credential
export const getOssConfig = params => http.get(`/common/sts-credential`, { params })

// 私有化预览
export const previewOss = params => http.get(`/service-acceleration/push/storage/grant`, { params }).then(res => res.data.url)

// 换取dwptoken
export const getDwptoken = params => {
    const userStore = useUserStore();
    return http.get(`/customer-service/transaction/dwp-token`, { params, 
        headers: { 'Token': userStore.getToken }
     })
}

// 企业微信授权
export const workWechatOauth = params => api.get(`/frontend/work-wechat/oauth`, { params })

// 获取签名
export const getWorkWechatConfig = params => api.get(`/frontend/work-wechat/config`, { params })