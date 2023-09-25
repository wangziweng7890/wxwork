/*
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-25 13:41:54
 * @FilePath: \workwexin-h5-sidebar\src\api\user\index.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
import api from '@/utils/request'

// 获取客户信息
export const getClientInfo = params => api.get(`/frontend/work-wechat/user_info`, { params })

// 获取订单列表
export const getOrderInfo = params => api.get(`/frontend/im/order-info`, { params })
