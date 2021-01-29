import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import store from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '中国科技云联邦',
      breadcrumb: ['Home']
    }
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login.vue'),
    meta: {
      title: '注册-中国科技云联邦 ',
      redirectLogged: true
    }
  },
  {
    path: '/main',
    name: 'main',
    component: () => import(/* webpackChunkName: "Main" */ '@/views/Main.vue'),
    meta: {
      title: '首页-中国科技云联邦',
      breadcrumb: [],
      requireLogin: true
    }
  },
  {
    path: '/usage',
    name: 'usage',
    component: () => import(/* webpackChunkName: "Usage" */ '@/views/Usage.vue'),
    redirect: '/usage/vm/list',
    meta: {
      title: '在用资源-中国科技云联邦',
      requireLogin: true
    },
    children: [
      {
        path: '',
        name: 'usage/',
        component: () => import(/* webpackChunkName: "Usage/" */ '@/components/Usage/Vm.vue'),
        redirect: '/usage/vm/list',
        meta: {
          requireLogin: true
        }
      },
      {
        path: 'vm',
        name: 'vm',
        component: () => import(/* webpackChunkName: "Usage/vm" */ '@/components/Usage/Vm.vue'),
        redirect: '/usage/vm/list',
        meta: {
          requireLogin: true
        },
        children: [
          {
            path: '',
            name: 'vm/',
            component: () => import(/* webpackChunkName: "Usage/vm/" */ '@/components/Usage/VmList.vue'),
            redirect: '/usage/vm/list',
            meta: {
              requireLogin: true
            }
          },
          {
            path: 'list',
            name: 'vmlist',
            component: () => import(/* webpackChunkName: "Usage/vm/list" */ '@/components/Usage/VmList.vue'),
            meta: {
              breadcrumb: ['在用资源', '云服务器', '云服务器列表'],
              requireLogin: true
            }
          },
          {
            path: 'create',
            name: 'vmcreate',
            component: () => import(/* webpackChunkName: "Usage/vm/create" */ '@/components/Usage/VmCreate.vue'),
            meta: {
              breadcrumb: ['在用资源', '云服务器', '创建云服务器'],
              requireLogin: true
            }
          },
          {
            path: 'search',
            name: 'vmsearch',
            component: () => import(/* webpackChunkName: "Usage/vm/search" */ '@/components/Usage/VmSearch.vue'),
            meta: {
              breadcrumb: ['在用资源', '云服务器', '云服务器搜索'],
              requireLogin: true
            }
          },
          {
            path: 'org',
            name: 'vmorgtree',
            component: () => import(/* webpackChunkName: "Usage/vm/org" */ '@/components/Usage/OrgTree.vue'),
            meta: {
              breadcrumb: ['在用资源', '云服务器', '机构树'],
              requireLogin: true
            }
          }
        ]
      },
      {
        path: 'disk',
        name: 'disk',
        component: () => import(/* webpackChunkName: "Usage/disk" */ '@/components/Usage/Disk.vue'),
        meta: {
          breadcrumb: ['在用资源', '云硬盘'],
          requireLogin: true
        }
      },
      {
        path: 'obs',
        name: 'obs',
        component: () => import(/* webpackChunkName: "Usage/obs" */ '@/components/Usage/Obs.vue'),
        meta: {
          breadcrumb: ['在用资源', '对象存储'],
          requireLogin: true
        }
      },
      {
        path: 'discovery',
        name: 'discovery',
        component: () => import(/* webpackChunkName: "Usage/discovery" */ '@/components/Usage/Discovery.vue'),
        meta: {
          breadcrumb: ['在用资源', '资源智能发现'],
          requireLogin: true
        }
      }
    ]
  },
  {
    path: '/group',
    name: 'group',
    component: () => import(/* webpackChunkName: "Group" */ '@/views/Group.vue'),
    meta: {
      title: '我的小组-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/bill',
    name: 'bill',
    component: () => import(/* webpackChunkName: "Bill" */ '@/views/Bill.vue'),
    meta: {
      title: '计费中心-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/ticket',
    name: 'ticket',
    component: () => import(/* webpackChunkName: "Ticket" */ '@/views/Ticket.vue'),
    meta: {
      title: '工单中心-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import(/* webpackChunkName: "Manage" */ '@/views/Manage.vue'),
    meta: {
      title: '资源管理-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/monitor',
    name: 'monitor',
    component: () => import(/* webpackChunkName: "Monitor" */ '@/views/Monitor.vue'),
    meta: {
      title: '监测中心-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "Users" */ '@/views/Users.vue'),
    meta: {
      title: '用户管理-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/data',
    name: 'data',
    component: () => import(/* webpackChunkName: "Data" */ '@/views/Data.vue'),
    meta: {
      title: '数据中心-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/maintenance',
    name: 'maintenance',
    component: () => import(/* webpackChunkName: "Maintenance" */ '@/views/Maintenance.vue'),
    meta: {
      title: '联邦维护-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: () => import(/* webpackChunkName: "Statistics" */ '@/views/Statistics.vue'),
    meta: {
      title: '统计报表-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/provide',
    name: 'provide',
    component: () => import(/* webpackChunkName: "Provide" */ '@/views/Provide.vue'),
    meta: {
      title: '已供资源-中国科技云联邦',
      requireLogin: true
    }
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // if not logged in yet, jump to login page
  if (to.meta.requireLogin && !store.state.user.isLogin) {
    next({ name: 'login' })
  }
  // if logged in, jump to the page before login or Home view
  if (to.meta.redirectLogged && store.state.user.isLogin) {
    const routerName = from.name
    next({ name: routerName || 'main' })
  }
  // update breadcrumb
  if (to.meta.breadcrumb) {
    store.commit('updatePosition', to.meta.breadcrumb)
  }
  // change page title with each jump
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
