import api from '@/utils/request'

// 企业微信授权
export const workWechatOauth = params => api.get(`/frontend/work-wechat/oauth`, { params })
// 获取客户信息
export const getClientInfo = params => api.get(`/frontend/work-wechat/user_info`, { params })

// 获取签名
export const getWorkWechatConfig = params => api.get(`/frontend/work-wechat/config`, { params })

// 获取订单列表
export const getOrderInfo = params => api.get(`/frontend/im/order-info`, { params })
