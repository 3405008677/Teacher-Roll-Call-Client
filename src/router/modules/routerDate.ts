export default {
  path: 'home',
  name: '/home',
  meta: {
    title: '主页',
    needLogin: true,
    keepAlive: false,
  },
  component: () => import('@/views/demo/home/index.vue'),
}
