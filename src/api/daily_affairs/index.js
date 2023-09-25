/*
 * @Author: Autumn.again
 * @Date: 2023-09-25 13:42:11
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-25 13:45:54
 * @FilePath: \workwexin-h5-sidebar\src\api\taskList\index.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
import api from '@/utils/request'

// 获取香港同事列表
export const getTransactionUserList = params => api.get(`/api/customer-service/transaction/user-list`, { params })

// 获取任务列表接口
export const getTransactionTaskList = params => api.get(`/api/customer-service/transaction/task-list`, { params })

// 筛选赴港人数
export const getTransactionMonthInfo = params => api.get(`/api/customer-service/transaction/month-info`, { params })