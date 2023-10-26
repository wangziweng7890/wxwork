/*
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-21 14:28:56
 * @FilePath: \workwexin-h5-sidebar\src\main.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
import './assets/base.css'
import init from '@/config/init'
import { createApp } from 'vue'
import { initSentry } from './sentry';
import App from './App.vue'
import router from './router'
import 'vant/es/toast/style'
// 引入状态管理
import { setupStore } from "@/stores";
import "vue3-hash-calendar/es/index.css";
import i18n from "./locales/setupI18n";
import 'virtual:iconfont'
import "./style/index.scss"
// 创建实例
const setupAll = async () => {
  const app = createApp(App);
  await setupStore(app);
  app.use(router).use(i18n);
  initSentry(app, router)
  app.mount("#app");
};

init()
setupAll()
