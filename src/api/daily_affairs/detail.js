import api from '@/utils/request'
import { http } from '@/utils/request'
import { useUserStore } from "@/stores/modules/user";
 const userStore = useUserStore();
// 获取详情
export const getOssConfig = (params) =>
  http.get(`/customer-service/transaction/customer-info`, {
    params,
    headers: { Token: userStore.getToken },
  });

// 保存期望标签
export const saveTag = (params) =>
  http.post(`/customer-service/transaction/save-tag`, params, {
    headers: { Token: userStore.getToken },
  });

// 保存意向需求
export const saveDemand = (params) =>
  http.post(`/customer-service/transaction/save-demand`, params, {
    headers: { Token: userStore.getToken },
  });

