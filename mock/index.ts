import Mock from 'mockjs'

const proxy = import.meta.env.VITE_BASE_URL

// 根据.env中的VITE_USE_MOCK判断是否开启mock
if (import.meta.env.VITE_USE_MOCK === 'true') {
  Mock.mock(proxy + '/login', 'post', (options) => {
    return {
      code: 200,
      data: {
        token: 'admin',
        uid: 123456,
      },
    }
  })

  Mock.mock(proxy + '/user/info', 'post', (options) => {
    return {
      code: 200,
      data: {
        uid: 123456,
        name: '我是你爹',
        phone: '110',
        address: '火星',
      },
    }
  })
  Mock.mock(proxy + '/user/router/list', 'post', (options) => {
    return {
      code: 200,
      data: [
        {
          path: '/home',
          name: '/home',
          component: '/demo/home',
          meta: {
            title: '首页',
            needLogin: true,
            keepAlive: false,
            icon: 'Menu',
          },
        },
        {
          path: '/system',
          name: '/system',
          redirect: '/system/role',
          meta: {
            title: '系统管理',
            needLogin: true,
            keepAlive: false,
            icon: 'Setting',
          },
          children: [
            {
              path: '/role',
              name: '/role',
              component: '/demo/system/role',
              meta: {
                title: '角色管理',
                needLogin: true,
                keepAlive: false,
              },
            },
          ],
        },
        {
          path: '/jurisdiction',
          name: '/jurisdiction',
          component: '/demo/jurisdiction',
          meta: {
            title: '权限管理',
            needLogin: true,
            keepAlive: false,
            icon: 'Location',
          },
        },
        {
          path: '/permission',
          name: '/permission',
          component: '/demo/permission',
          meta: {
            title: '注册用户',
            needLogin: true,
            keepAlive: false,
            icon: 'Location',
          },
        },
      ],
    }
  })
}
