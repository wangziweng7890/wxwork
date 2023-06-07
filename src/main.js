import './assets/base.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import 'vant/es/toast/style'

// 引入状态管理
import { setupStore } from '@/stores'

// 创建实例
const setupAll = async () => {
    const app = createApp(App)
    await setupStore(app)
    app.use(router)
    app.mount('#app')
}

setupAll()
