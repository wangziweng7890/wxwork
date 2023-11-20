/*
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-25 17:38:23
 * @FilePath: \workwexin-h5-sidebar\src\api\common\index.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
import api from '@/utils/request'
import { http } from '@/utils/request'
import { useUserStore } from "@/stores/modules/user";

// 获取oss /common/sts-credential
export const getOssConfig = params => http.get(`/common/sts-credential`, { params })
// export const getOssConfig = params => {
//     const userStore = useUserStore();
//     return http.get(`/common/sts-credential`, { params,
//         headers: { 'Token': userStore.getToken }
//     })
// }

// 私有化预览
export const previewOss = params => http.get(`/service-acceleration/push/storage/grant`, { params }).then(res => res.data.url)

// 换取dwptoken
export const getDwptoken = token => {
    const userStore = useUserStore();
    return http.get(`/customer-service/transaction/dwp-token`, { params: {},
        headers: { 'Token': token }
     })
}

// 企业微信授权
export const workWechatOauth = params => api.get(`/frontend/work-wechat/oauth`, { params })

// 获取签名
export const getWorkWechatConfig = params => api.get(`/frontend/work-wechat/config`, { params })

// JS-SDK 获取签名
export const getSdkSignature= params => api.get(`/frontend/work-wechat/jsapi-auth`, { params })

// 后端中转上传
export const uploadFile = params => {
  const formData = new FormData();
  formData.append('file', params);
  return api.post(`/api/customer-service/transaction/upload`, formData ,{ headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
