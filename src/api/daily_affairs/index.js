/*
 * @Author: Autumn.again
 * @Date: 2023-09-25 13:42:11
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-27 19:36:01
 * @FilePath: \workwexin-h5-sidebar\src\api\daily_affairs\index.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
import api from '@/utils/request'

// 获取香港同事列表
export const getTransactionUserList = params => api.get(`/api/customer-service/transaction/user-list`, { params })

// 获取任务列表接口
export const getTransactionTaskList = params => api.get(`/api/customer-service/transaction/task-list`, { params })

// 筛选赴港人数
export const getTransactionMonthInfo = params => api.get(`/api/customer-service/transaction/month-info`, { params })

// 获取证件详情
export const getTransactionInfo = params => api.get(`/api/customer-service/transaction/certificate`, { params })

// 保存证件详情
export const updateCertificate = params => api.post(`/api/customer-service/transaction/save-certificate`, { ...params })

// 保存是否代领
export const updateSaveAgent = params => api.post(`/api/customer-service/transaction/save-agent`, { ...params })

// 保存是否代领
export const getMonthInfo = params => api.get(`/api/customer-service/transaction/month-info`, { params })

// 转让任务
export const PostalloTtask = params => api.post(`/api/customer-service/transaction/allot-task`, { ...params })

// 保存意向需求
export const updateDemandInfo = params => api.post(`/api/customer-service/transaction/save-demand`, { ...params })

// 导出接口
export const exportData = params => api.post(`/api/customer-service/transaction/export-url`, { ...params })

// 获取详情
export const getOssConfig = (params) =>api.get(`/api/customer-service/transaction/customer-info`, { params});

// 保存期望标签
export const saveTag = (params) =>api.post(`/api/customer-service/transaction/save-tag`, { ...params });

// 保存意向需求
export const saveDemand = (params) => api.post(`/api/customer-service/transaction/save-demand`,{ ...params });

// 获取过关证件
export const getArchivist = (params) =>api.get(`/api/customer-service/transaction/archivist`, {params});

// 获取角色
export const getRole = () => api.get('/api/customer-service/transaction/get-role')