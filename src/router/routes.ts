import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/HomeLayout.vue'),
    meta: {
      title: '中国科技云联邦',
      requireLogin: false
    }
  },
  // {
  //   path: '/login',
  //   component: () => import('layouts/HomeLayout.vue'),
  //   meta: {
  //     title: '中国科技云联邦',
  //     requireLogin: false
  //   },
  //   beforeEnter: (to/*, from */) => {
  //     const code = to.fullPath.slice(12)
  //     console.log(code)
  //   }
  // },
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
          requireLogin: true
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
              requireLogin: true
            },
            component: () => import('pages/Usage/Vm.vue')
          },
          {
            path: 'vmcreate',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Usage/VmCreate.vue')
          },
          {
            path: 'vmdetail/:id', // serverId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Usage/VmDetail.vue')
          },
          {
            path: 'vd',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Usage/Vd.vue')
          },
          {
            path: 'obs',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Usage/Obs.vue')
          },
          {
            path: 'vpn',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Usage/Vpn.vue')
          }
        ]
      },
      {
        path: 'quota',
        component: () => import('pages/Quota/Quota.vue'),
        redirect: '/my/quota/list',
        meta: {
          title: '资源配额-中国科技云联邦'
        },
        children: [
          {
            path: 'list',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Quota/QuotaList.vue')
          },
          {
            path: 'detail/:id', // quotaId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Quota/QuotaDetail.vue')
          },
          {
            path: 'application',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Quota/ApplicationList.vue')
          },
          {
            path: 'apply',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Quota/Apply.vue')
          },
          {
            path: 'manage',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Quota/Manage.vue')
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
