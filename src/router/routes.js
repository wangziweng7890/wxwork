/*
 * @Author: Autumn.again
 * @Date: 2023-09-19 13:37:42
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-27 19:08:54
 * @FilePath: \workwexin-h5-sidebar\src\router\routes.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
export default [
  {
    path: "/",
    component: () => import("@/views/Login/Login.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login/Login.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/order_list",
    name: "OrderList",
    component: () => import("@/views/OrderList/OrderList.vue"),
    meta: {
      jsApiList: ["openDefaultBrowser", "getCurExternalContact"],
      title: "订单管理",
    },
  },
  {
    path: "/daily_affairs",
    component: () => import("@/views/daily_affairs/index.vue"),
    meta: {
      title: "香港事务日常协同",
      jsApiList: ["shareAppMessage", "selectEnterpriseContact"],
    },
    children: [
      {
        path: "list",
        name: "daily_affairs",
        component: () => import("@/views/daily_affairs/list/daily_affairs.vue"),
        meta: {
          jsApiList: ["shareAppMessage", "selectEnterpriseContact", 'openEnterpriseChat'],
        },
      },
      {
        path: "detail",
        name: "/daily_detail",
        component: () => import("@/views/daily_affairs/detail/detail.vue"),
        meta: {
          title: "客户信息",
          jsApiList: ["previewFile", "openDefaultBrowser"],
        },
      },
      {
        path: 'serch_list',
        name: 'serch_list',
        component: () => import("@/views/daily_affairs/list/serch_list.vue"),
        title: "客户信息",
        meta: {
          jsApiList: ['shareAppMessage', 'openEnterpriseChat'],
        },
      }
    ],
  },
  {
    path: "/reintroduce_code",
    name: "ReintroduceCode",
    component: () => import("@/views/ReintroduceCode/ReintroduceCode.vue"),
    meta: {
      title: "转介绍二维码",
      jsApiList: ["sendChatMessage", "getCurExternalContact", "previewImage"],
    },
  },
];
