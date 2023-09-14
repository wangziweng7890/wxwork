import './assets/base.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import 'vant/es/toast/style'
// 引入状态管理
import { setupStore } from '@/stores'
import VueHashCalendar from 'vue3-hash-calendar';
import 'vue3-hash-calendar/es/index.css';

// 创建实例
const setupAll = async () => {
    const app = createApp(App)
    await setupStore(app)
    app.use(router).use(VueHashCalendar)
    app.mount('#app')
}

setupAll()
