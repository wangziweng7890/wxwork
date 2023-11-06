
import { crmHttp } from '@/utils/request'

// 转介绍码信息
export const getReintroduceInfo = params => crmHttp.get(`/presale/evaluation-url/wx-detail`, { params })

