
import http from '@/utils/request'

// 转介绍码信息
export const getReintroduceInfo = params => http.get(`/frontend/education/mini-code`, { params })

// 测评码风险判断提示
export const getUserRoleCheck = params => http.get(`/frontend/users/check-role`, { params })

