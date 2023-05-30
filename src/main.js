import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import WechatPlugin from './utils/WechatPlugin'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(WechatPlugin)
app.mount('#app')
