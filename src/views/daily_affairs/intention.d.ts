/*
 * @Author: Autumn.again
 * @Date: 2023-09-14 14:56:23
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-20 16:01:47
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\intention.d.ts
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */

// 用户进度列表搜索
interface search_params {
    customer_name?: string // 客户名字
}

// 筛选弹窗
interface filter_params {
    customer_name?: string // 客户名字
    fellow_name?: string | number // 香港同事
    create_at?: string // 创建时间
    adress?: string // 地点
    status?: string | number // 状态
}