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
        path: 'personal',
        component: () => import('pages/Personal/PersonalIndex.vue'),
        redirect: '/my/personal/vm',
        meta: {
          title: '在用资源-中国科技云联邦'
        },
        children: [
          {
            path: 'vm',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Personal/Vm.vue')
          },
          {
            path: 'vmcreate',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Personal/VmCreate.vue')
          },
          {
            path: 'vmdetail/:id', // serverId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Personal/VmDetail.vue')
          },
          {
            path: 'vd',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Personal/Vd.vue')
          },
          {
            path: 'obs',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Personal/Obs.vue')
          },
          {
            path: 'quota',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Personal/PersonalQuota.vue'),
            redirect: '/my/personal/quota/list',
            children: [
              {
                path: 'list',
                meta: {
                  requireLogin: true
                },
                component: () => import('pages/Quota/QuotaList.vue')
              },
              {
                path: 'application',
                meta: {
                  requireLogin: true
                },
                component: () => import('pages/Quota/QuotaApplication.vue')
              }
            ]
          },
          {
            path: 'vpn',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Personal/Vpn.vue')
          }
        ]
      },
      {
        path: 'group',
        component: () => import('pages/Group/GroupIndex.vue'),
        redirect: '/my/group/resource',
        meta: {
          title: '小组资源-中国科技云联邦'
        },
        children: [
          {
            path: 'resource', // 组资源
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Group/GroupResource.vue')
          },
          {
            path: 'quota', // 组配额
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Group/GroupQuota.vue')
          },
          {
            path: 'list', // 组列表
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Group/GroupList.vue')
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
            component: () => import('pages/Quota/QuotaApplication.vue')
          },
          {
            path: 'apply',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Quota/QuotaApply.vue')
          }
        ]
      },
      {
        path: 'provider',
        component: () => import('pages/Provider/Provider.vue'),
        redirect: '/my/provider/manage',
        meta: {
          title: '资源提供-中国科技云联邦'
        },
        children: [
          {
            path: 'manage',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Provider/Manage.vue')
          },
          {
            path: 'provided',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Provider/Provided.vue')
          },
          {
            path: 'service',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Provider/Service.vue')
          },
          {
            path: 'join_service',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Provider/Join.vue')
          },
          {
            path: 'create_datacenter',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Provider/CreateDatacenter.vue')
          },
          {
            path: 'configuration',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Provider/Configuration.vue')
          },
          {
            path: 'quit',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Provider/Quit.vue')
          }
        ]
      },
      {
        path: 'federation',
        component: () => import('pages/Federation/Federation.vue'),
        redirect: '/my/federation/service_list',
        meta: {
          title: '联邦管理-中国科技云联邦'
        },
        children: [
          {
            path: 'service_list',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Federation/ServiceList.vue')
          },
          {
            path: 'institution_list',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Federation/InstitutionList.vue')
          },
          {
            path: 'audit_list',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/Federation/AuditList.vue')
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
