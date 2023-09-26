/*
 * @Author: Autumn.again
 * @Date: 2023-09-25 13:42:11
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-26 19:15:07
 * @FilePath: \workwexin-h5-sidebar\src\api\daily_affairs\index.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
import api from '@/utils/request'
import { useUserStore } from "@/stores/modules/user";
import {http} from "@/utils/request";

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

// 保存意向需求
export const updateDemandInfo = params => api.post(`/customer-service/transaction/save-demand`, { ...params })

const userStore = useUserStore();
// 获取详情
export const getOssConfig = (params) =>http.get(`/customer-service/transaction/customer-info`, { params,headers: { Token: userStore.getToken } });
// 保存期望标签
export const saveTag = (params) =>http.post(`/customer-service/transaction/save-tag`, params, {headers: { Token: userStore.getToken },});

// 保存意向需求
export const saveDemand = (params) => http.post(`/customer-service/transaction/save-demand`, params, {headers: { Token: userStore.getToken },});
// 获取过关证件
export const getArchivist = (params) =>http.get(`/customer-service/transaction/archivist`, {params, headers: { Token: userStore.getToken }});
