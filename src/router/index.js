import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Auth/Auth.vue"),
    },
    {
      path: "/auth",
      name: "Auth",
      component: () => import("@/views/Auth/Auth.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Login/Login.vue"),
    },
    {
      path: "/order_list",
      name: "OrderList",
      component: () => import("@/views/OrderList/OrderList.vue"),
    },
    {
      path: "/daily_affairs",
      name: "daily_affairs",
      component: () => import("@/views/daily_affairs/daily_affairs.vue"),
    },
    {
      path: "/detail",
      name: "detail",
      component: () => import("@/views/detail/detail.vue"),
    },
  ],
});

export default router;
