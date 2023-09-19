import { createRouter, createWebHistory } from 'vue-router'
import { agentConfig } from '@/config/wxconfig'

import routes from './routes'
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
})

export default router

// 设置页面 title
router.afterEach((to) => {
    to.meta.title && (document.title = typeof to.meta.title === 'function' ? to.meta.title() : to.meta.title)
})

// 为当前页面设置企微调用权限
router.afterEach(async (to, from) => {
	to.meta.jsApiList &&  await agentConfig(to.meta.jsApiList)
})
