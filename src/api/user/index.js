import api from '@/utils/request'

// 获取用户信息
export const getUserInfo = params => api.get(`/frontend/work-wechat/user_info`, {params, hideLoading: true })
