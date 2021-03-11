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
