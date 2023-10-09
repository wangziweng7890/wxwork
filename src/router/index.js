/*
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-27 19:01:48
 * @FilePath: \workwexin-h5-sidebar\src\router\index.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
import { createRouter, createWebHistory } from "vue-router";
import { agentConfig } from "@/config/wxconfig";

import routes from "./routes";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;

// 设置页面 title
router.afterEach((to) => {
  to.meta.title &&
    (document.title =
      typeof to.meta.title === "function" ? to.meta.title() : to.meta.title);
});

// 为当前页面设置企微调用权限
router.afterEach(async (to, from) => {
	to.meta.jsApiList &&  await agentConfig(to.meta.jsApiList)
})
