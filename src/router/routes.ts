import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/HomeLayout.vue'),
    meta: {
      title: '中国科技云联邦',
      myPages: false
    }
  },
  {
    path: '/login',
    redirect: '/my/',
    meta: {
      title: '中国科技云联邦',
      myPages: false
    },
    beforeEnter: (to, from) => {
      // todo /login为科技云通行证返回回调code的路由，应截取localhost:8080/login/callback?code=1111中的code，并取回token
      console.log(to, from)
    }
  },
  {
    path: '/my',
    component: () => import('layouts/MyLayout.vue'),
    redirect: '/my/main',
    children: [
      {
        path: 'main',
        name: 'main',
        component: () => import('pages/Main.vue'),
        meta: {
          title: '我的首页-中国科技云联邦',
          myPages: true
        }
      },
      {
        path: 'usage',
        component: () => import('pages/Usage/Usage.vue'),
        redirect: '/my/usage/vm',
        meta: {
          title: '在用资源-中国科技云联邦'
        },
        children: [
          {
            path: 'vm',
            meta: {
              myPages: true
            },
            component: () => import('pages/Usage/Vm.vue')
          },
          {
            path: 'vmcreate',
            meta: {
              myPages: true
            },
            component: () => import('pages/Usage/VmCreate.vue')
          },
          {
            path: 'vmdetail',
            meta: {
              myPages: true
            },
            component: () => import('pages/Usage/VmDetail.vue')
          },
          {
            path: 'vd',
            meta: {
              myPages: true
            },
            component: () => import('pages/Usage/Vd.vue')
          },
          {
            path: 'obs',
            meta: {
              myPages: true
            },
            component: () => import('pages/Usage/Obs.vue')
          },
          {
            path: 'vpn',
            meta: {
              myPages: true
            },
            component: () => import('pages/Usage/Vpn.vue')
          }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
