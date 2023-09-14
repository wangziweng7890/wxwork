/*
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-14 17:52:17
 * @FilePath: \workwexin-h5-sidebar\src\main.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
import './assets/base.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import 'vant/es/toast/style'
// 引入状态管理
import { setupStore } from '@/stores'
import VueHashCalendar from 'vue3-hash-calendar';
import 'vue3-hash-calendar/es/index.css';
import i18n from './locales/setupI18n'

// 创建实例
const setupAll = async () => {
    const app = createApp(App)
    await setupStore(app)
    app.use(router).use(VueHashCalendar).use(i18n)
    app.mount('#app')
}

setupAll()
