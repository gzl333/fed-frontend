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
    path: '/news',
    component: () => import('layouts/NewsLayout.vue'),
    meta: {
      title: '新闻动态-中国科技云联邦',
      requireLogin: false
    },
    props: true,
    children: [
      {
        // 文章统一出口，数据来自后端
        path: 'article/:name',
        component: () => import('pages/News/Article.vue'),
        meta: {
          title: '新闻动态-中国科技云联邦',
          requireLogin: false
        }
      },
      {
        // 内测公告
        path: 'closed-beta',
        component: () => import('pages/News/ClosedBeta.vue'),
        meta: {
          title: '新闻动态-中国科技云联邦',
          requireLogin: false
        }
      }
    ]
  },
  // {
  //   path: '/manual',
  //   component: () => import('layouts/ManualLayout.vue'),
  //   meta: {
  //     title: '使用手册-中国科技云联邦',
  //     requireLogin: false
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
        component: () => import('pages/My/Main.vue'),
        meta: {
          title: '我的首页-中国科技云联邦',
          requireLogin: true
        }
      },
      {
        path: 'personal',
        component: () => import('pages/My/Personal/PersonalIndex.vue'),
        redirect: '/my/personal/vm',
        meta: {
          title: '个人资源-中国科技云联邦'
        },
        children: [
          {
            path: 'vm',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/Vm.vue')
          },
          {
            path: 'vmcreate',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/VmCreate.vue'),
            props: true // 接收url中的参数
          },
          {
            path: 'vmdetail/:serverId', // serverId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/VmDetail.vue')
          },
          {
            path: 'vd',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/Vd.vue')
          },
          {
            path: 'obs',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/Obs.vue')
          },
          {
            path: 'quota',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/QuotaIndex.vue'),
            redirect: '/my/personal/quota/list',
            children: [
              {
                path: 'list',
                meta: {
                  requireLogin: true
                },
                component: () => import('pages/My/Personal/QuotaList.vue')
              },
              {
                path: 'application',
                meta: {
                  requireLogin: true
                },
                component: () => import('pages/My/Personal/QuotaApplication.vue')
              }
            ]
          },
          {
            path: 'quota_detail/:id', // quotaId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/QuotaDetail.vue')
          },
          {
            path: 'quota_apply',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/QuotaApply.vue'),
            props: true // 接收url中的参数
          },
          {
            path: 'vpn',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/Vpn.vue')
          }
        ]
      },
      {
        path: 'group',
        component: () => import('pages/My/Group/GroupIndex.vue'),
        redirect: '/my/group/list',
        meta: {
          title: '项目组资源-中国科技云联邦'
        },
        children: [
          {
            path: 'server', // 组云主机
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupServer.vue')
          },
          {
            path: 'server/detail/:serverId',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupServerDetail.vue')
          },
          {
            path: 'server/deploy',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupServerDeploy.vue')
          },
          {
            path: 'obs', // 组资源
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupObs.vue')
          },
          {
            path: 'quota', // 组配额
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupQuotaIndex.vue'),
            redirect: '/my/group/quota/list',
            children: [
              {
                path: 'list',
                meta: {
                  requireLogin: true
                },
                component: () => import('pages/My/Group/GroupQuotaList.vue')
              },
              {
                path: 'application',
                meta: {
                  requireLogin: true
                },
                component: () => import('pages/My/Group/GroupQuotaApplication.vue')
              }
            ]
          },
          {
            path: 'quota/detail/:quotaId',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupQuotaDetail.vue')
          },
          {
            path: 'quota/apply',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupQuotaApply.vue')
          },
          {
            path: 'list', // 组列表
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupList.vue')
          },
          {
            path: 'detail/:id', // groupId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupDetail.vue')
          },
          {
            path: 'member/:id', // groupId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupMember.vue')
          },
          {
            path: 'edit/:id', // groupId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupEdit.vue')
          },
          {
            path: 'create',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupCreate.vue')
          }
        ]
      },
      {
        path: 'provider',
        component: () => import('pages/My/Provider/ProviderIndex.vue'),
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
            component: () => import('pages/My/Provider/Manage.vue')
          },
          {
            path: 'provided',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Provider/Provided.vue')
          },
          {
            path: 'service',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Provider/Service.vue')
          },
          {
            path: 'join_service',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Provider/Join.vue')
          },
          {
            path: 'create_datacenter',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Provider/CreateDatacenter.vue')
          },
          {
            path: 'configuration',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Provider/Configuration.vue')
          },
          {
            path: 'quit',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Provider/Quit.vue')
          }
        ]
      },
      {
        path: 'federation',
        component: () => import('pages/My/Federation/FederationIndex.vue'),
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
            component: () => import('pages/My/Federation/ServiceList.vue')
          },
          {
            path: 'institution_list',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Federation/InstitutionList.vue')
          },
          {
            path: 'audit_list',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Federation/AuditList.vue')
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
