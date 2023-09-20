export default [
    {
        path: '/',
        component:() => import("@/views/Login/Login.vue")
    },
    {
        path: '/login',
        name: 'Login',
        component:() => import("@/views/Login/Login.vue"),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/order_list',
        name: 'OrderList',
        component:() => import("@/views/OrderList/OrderList.vue"),
        meta: {
            jsApiList: ['openDefaultBrowser', 'getCurExternalContact'],
            title: '订单管理'
        }
    },
    {
        path: '/daily_affairs',
        component:() => import("@/views/daily_affairs/index.vue"),
        meta: {
            title: '香港事务日常协同'
        },
        children: [
            {
                path: 'list',
                name: 'daily_affairs',
                component:() => import("@/views/daily_affairs/daily_affairs.vue"),
                meta: {
                    jsApiList: ['shareAppMessage', 'selectEnterpriseContact'],
                },
            },
            {
                path: 'detail',
                name: 'serch_detail',
                component:() => import("@/views/daily_affairs/serch_detail.vue"),
                meta: {
                    jsApiList: ['shareAppMessage'],
                },
            }
        ]
    }
]