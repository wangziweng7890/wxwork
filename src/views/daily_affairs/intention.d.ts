/*
 * @Author: Autumn.again
 * @Date: 2023-09-14 14:56:23
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-25 10:52:14
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\intention.d.ts
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */

// 筛选弹窗
interface filter_params {
    customer_name?: string // 客户名字
    user_id?: string | number // 香港同事id
    create_at?: string // 创建时间
    address?: string // 地点
    task_status?: string | number // 状态
    start_time?: string | number // 开始时间
    end_time?: string | number // 结束时间
    is_conver?: number
}
interface imageInfo {
    name: string
    res: {
        status: number
        size: number
        data: any
        requestUrls: string[]
        [key: string]: any
    }
    url: string
    oriName: string
    type: string
    uid: number
}

interface userInfo {
    id: number | string
    mobile: number | string
    name: string
    role_key: string
}