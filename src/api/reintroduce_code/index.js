
import http from '@/utils/request'

// 转介绍码信息
export const getReintroduceInfo = params => http.get(`/frontend/education/mini-code`, { params })

