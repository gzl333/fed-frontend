import { RouteRecordRaw } from 'vue-router'

// @ts-ignore
// @ts-ignore
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
      },
      {
        // 网络中心内测公告
        path: 'center-beta',
        component: () => import('pages/News/CenterBeta.vue'),
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
        redirect: '/my/personal/server',
        meta: {
          title: '个人资源-中国科技云联邦'
        },
        children: [
          {
            path: 'server',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/PersonalServer.vue')
          },
          {
            path: 'server/deploy',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/PersonalServerDeploy.vue'),
            props: true // 接收url中的参数
          },
          {
            path: 'server/detail/:serverId', // serverId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/PersonalServerDetail.vue')
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
            path: 'quota/detail/:id', // quotaId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/QuotaDetail.vue')
          },
          {
            path: 'quota/apply',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/QuotaApply.vue'),
            props: true // 接收url中的参数
          },
          { // 2021-10-19所内测试专用页面
            path: 'quota/apply_beta',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Personal/QuotaApplyBeta.vue')
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
            component: () => import('pages/My/Group/GroupServerDeploy.vue'),
            props: true // 接收url中的参数
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
            component: () => import('pages/My/Group/GroupQuotaApply.vue'),
            props: true // 接收url中的参数
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
            component: () => import('pages/My/Group/GroupDetail.vue'),
            props: true // 接收url中的参数
          },
          {
            path: 'member/:id', // groupId 动态路由匹配
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupMember.vue')
          },
          {
            path: 'create',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Group/GroupCreate.vue'),
            props: true // 接收url中的参数
          }
        ]
      },
      {
        path: 'provider',
        component: () => import('pages/My/Provider/ProviderIndex.vue'),
        redirect: '/my/provider/quota',
        meta: {
          title: '资源提供-中国科技云联邦'
        },
        children: [
          {
            path: 'quota',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Provider/QuotaAudit.vue')
          },
          {
            path: 'server',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Provider/ServerCreated.vue')
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
        redirect: '/my/federation/resource',
        meta: {
          title: '联邦管理-中国科技云联邦'
        },
        children: [
          {
            path: 'resource',
            meta: {
              requireLogin: true
            },
            component: () => import('pages/My/Federation/FederationResource.vue')
          },
          {
            path: 'monitor',
            meta: {
              requireLogin: true,
              requireFedAdmin: true // 云联邦管理员才能访问
            },
            redirect: '/my/federation/monitor/storage',
            component: () => import('pages/My/Federation/FederationMonitorIndex.vue'),
            children: [
              {
                path: 'storage',
                meta: {
                  requireLogin: true
                },
                component: () => import('pages/My/Federation/FederationMonitorStorage.vue')
              },
              {
                path: 'server',
                meta: {
                  requireLogin: true
                },
                component: () => import('pages/My/Federation/FederationMonitorServer.vue')
              }
            ]
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
