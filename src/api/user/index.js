import api from '@/utils/request'

// 获取客户信息
export const getClientInfo = params => api.get(`/frontend/work-wechat/user_info`, { params })

// 获取订单列表
export const getOrderInfo = params => api.get(`/frontend/im/order-info`, { params })
