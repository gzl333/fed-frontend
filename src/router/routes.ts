import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/HomeLayout.vue')
  },

  {
    path: '/my',
    component: () => import('layouts/MyLayout.vue'),
    redirect: '/my/main',
    children: [
      {
        path: 'main',
        name: 'main',
        component: () => import('pages/Main.vue')
      },
      {
        path: 'usage',
        component: () => import('pages/Usage/Usage.vue'),
        redirect: '/my/usage/vm',
        children: [
          {
            path: 'vm',
            component: () => import('pages/Usage/Vm.vue')
          },
          {
            path: 'vd',
            component: () => import('pages/Usage/Vd.vue')
          },
          {
            path: 'obs',
            component: () => import('pages/Usage/Obs.vue')
          },
          {
            path: 'vpn',
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
