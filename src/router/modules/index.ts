import text from './routerDate' //测试用的路由

export default [
  {
    path: '/',
    name: '/',
    redirect: '/home',
    // component: () => import('@/layouts/default/index.vue'), //后台管理形式
    component: () => import('@/layouts/page/main.vue'), //单页面形式
    children: text,
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      needLogin: false,
      keepAlive: false,
    },
    component: () => import('@/views/sys/login/index.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '错误',
      needLogin: false,
      keepAlive: false,
    },
    component: () => import('@/views/sys/error/404.vue'),
  },
]
