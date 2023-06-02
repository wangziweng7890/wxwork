import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/login',
			name: 'Login',
			component: import("@/views/Login/Login.vue")
		},
		{
			path: '/order_list',
			name: 'OrderList',
			component: import("@/views/OrderList/OrderList.vue")
		}
	]
})

export default router
